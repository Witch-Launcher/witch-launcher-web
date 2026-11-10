#!/usr/bin/env python3
"""Sync project documentation from the sibling repositories into the web docs.

Each repository publishes its own `docs/DOCS_MANIFEST.json`, which declares the
project, the branch it lives on, the language bases and the ordered list of
markdown files. This script mirrors those files into

    docs-md/<lang>/projects/<project-id>/<slug>.md
    docs-md/<lang>/projects/<project-id>/manifest.json

so the site always has a local copy. At runtime the web docs prefer the live
file on GitHub (raw.githubusercontent.com) and fall back to these local copies
when the network is unavailable.

Usage:
    python3 scripts/sync-project-docs.py [--check]
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
from pathlib import Path

WEB_ROOT = Path(__file__).resolve().parent.parent
DOCS_MD = WEB_ROOT / "docs-md"

# Project id -> absolute path of the sibling repository.
PROJECTS = {
    "launcher": Path("/Volumes/project/Angel-Aura-Amethyst-iOS/Angel-Aura-Amethyst-iOS"),
    "tglmt": Path("/Volumes/project/TGLMT"),
    "tgles": Path("/Volumes/project/TGLES"),
    "metalcompat": Path("/Volumes/project/MetalCompat"),
    "metalbridge": Path("/Volumes/project/MetalBridgeA9"),
}

MANIFEST_NAME = "DOCS_MANIFEST.json"
DEFAULT_LANG = "en"


def slugify(rel: str) -> str:
    """`plugins/api.md` -> `plugins-api`, `API_INVENTORY.md` -> `api-inventory`."""
    stem = re.sub(r"\.md$", "", rel, flags=re.I)
    slug = re.sub(r"[^a-z0-9]+", "-", stem.lower()).strip("-")
    return slug or "doc"


def title_of(text: str, fallback: str) -> str:
    """First markdown H1, or a `title:` frontmatter field, else the file stem."""
    m = re.search(r"^---\s*\n(.*?)\n---", text, flags=re.S)
    if m:
        fm = re.search(r'^title:\s*"?(.+?)"?\s*$', m.group(1), flags=re.M)
        if fm:
            return fm.group(1).strip()
    m = re.search(r"^#\s+(.+)$", text, flags=re.M)
    if m:
        return m.group(1).strip().strip("#").strip()
    return fallback.replace("-", " ").title()


def desc_of(text: str) -> str:
    """First non-heading paragraph — used as the card blurb."""
    body = re.sub(r"^---\s*\n.*?\n---", "", text, flags=re.S)
    for block in re.split(r"\n\s*\n", body):
        line = block.strip()
        if not line or line.startswith(("#", ">", "|", "```", "---")):
            continue
        if line.startswith("|"):
            continue
        return re.sub(r"\s+", " ", re.sub(r"[*_`>#]", "", line))[:220]
    return ""


def strip_h1(text: str) -> str:
    """Drop the leading H1 — the docs shell already renders the page title."""
    return re.sub(r"^(\s*)#\s+[^\n]*\n+", r"\1", text, count=1)


def load_manifest(repo: Path) -> dict:
    path = repo / "docs" / MANIFEST_NAME
    if not path.is_file():
        raise FileNotFoundError(f"missing {path}")
    return json.loads(path.read_text(encoding="utf-8"))


def read_doc(repo: Path, manifest: dict, entry: dict, lang: str) -> tuple[str, str, str] | None:
    """Return (text, resolved_rel_path, source_lang) for the requested language.

    A project that only publishes English still shows up in the Vietnamese
    docs — the English file is used as the fallback so no section goes blank.
    """
    bases = manifest.get("bases") or {}
    langs = manifest.get("languages") or [DEFAULT_LANG]
    rel = entry["file"]

    # candidate relative paths, most preferred first
    rels: list[tuple[str, str]] = []
    if lang in bases:
        rels.append((bases[lang] + rel, lang))
    for other in [DEFAULT_LANG] + [l for l in langs if l != DEFAULT_LANG]:
        if other in bases and (bases[other] + rel, other) not in rels:
            rels.append((bases[other] + rel, other))
    if (rel, DEFAULT_LANG) not in rels:
        rels.append((rel, DEFAULT_LANG))

    for candidate, source_lang in rels:
        path = repo / "docs" / candidate
        if path.is_file():
            return path.read_text(encoding="utf-8"), candidate, source_lang
    return None


def sync_project(pid: str, repo: Path, lang: str, out_root: Path, check: bool) -> list[str]:
    manifest = load_manifest(repo)
    out_dir = out_root / "projects" / pid
    written: list[str] = []

    entries = []
    for item in manifest.get("order", []):
        rel = item["file"]
        slug = slugify(rel)
        got = read_doc(repo, manifest, item, lang)
        if got is None:
            print(f"  ! skip {pid}/{lang}/{rel} — not found in repo", file=sys.stderr)
            continue
        text, resolved, source_lang = got
        entries.append({
            "slug": slug,
            "group": item.get("group", "Docs"),
            "file": rel,
            "source": resolved,
            "sourceLang": source_lang,
            "title": title_of(text, slug),
            "desc": desc_of(text),
            "body": strip_h1(text),
        })

    # group order follows the manifest, groups keep their first appearance
    groups: list[str] = []
    for e in entries:
        if e["group"] not in groups:
            groups.append(e["group"])

    index = {
        "id": pid,
        "project": manifest.get("project", pid),
        "repository": manifest.get("repository", ""),
        "branch": manifest.get("branch", "main"),
        "section": manifest.get("webSection", "Projects"),
        "lang": lang,
        "groups": groups,
        "docs": [
            {k: e[k] for k in ("slug", "group", "file", "source", "sourceLang", "title", "desc")}
            for e in entries
        ],
    }

    for e in entries:
        written.append(out_dir / f"{e['slug']}.md")
        if not check:
            out_dir.mkdir(parents=True, exist_ok=True)
            (out_dir / f"{e['slug']}.md").write_text(e["body"], encoding="utf-8")

    written.append(out_dir / "manifest.json")
    if not check:
        out_dir.mkdir(parents=True, exist_ok=True)
        (out_dir / "manifest.json").write_text(
            json.dumps(index, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
        )
    return written


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--check", action="store_true", help="report drift without writing")
    args = ap.parse_args()

    problems = 0
    for lang in ("en", "vi"):
        out_root = DOCS_MD / lang
        for pid, repo in PROJECTS.items():
            if not repo.is_dir():
                print(f"! repo missing: {repo}", file=sys.stderr)
                problems += 1
                continue
            try:
                files = sync_project(pid, repo, lang, out_root, args.check)
            except Exception as exc:  # noqa: BLE001
                print(f"! {pid} [{lang}]: {exc}", file=sys.stderr)
                problems += 1
                continue
            print(f"  {pid} [{lang}]: {len(files)} file(s)")

    if problems:
        print(f"\n{problems} problem(s)", file=sys.stderr)
        return 1
    print("\nsync ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
