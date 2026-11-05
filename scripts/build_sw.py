#!/usr/bin/env python3
"""Régénère site/sw.js : liste tous les fichiers du site à mettre en cache
et calcule une version à partir de leur contenu (à relancer après chaque modification)."""
import hashlib, os, pathlib
root = pathlib.Path(__file__).resolve().parent.parent / "site"
files, h = [], hashlib.sha256()
for p in sorted(root.rglob("*")):
    if not p.is_file() or p.name in ("sw.js", ".DS_Store", "robots.txt", "plan.json"): continue
    rel = p.relative_to(root).as_posix()
    # img/p (personnages du clin d'œil) reste hors du cache initial : le SW les garde à la première demande.
    # Leur contenu compte quand même dans la version, pour que l'ancien cache soit jeté quand les dessins changent
    if "img/p/" not in rel: files.append("/" + rel)
    h.update(rel.encode()); h.update(p.read_bytes())
tpl = (root.parent / "scripts" / "sw.template.js").read_text()
out = tpl.replace("__VERSION__", h.hexdigest()[:10]).replace("__FILES__", ",\n  ".join(f'"{f}"' for f in files))
(root / "sw.js").write_text(out)
print(f"sw.js : {len(files)} fichiers, version {h.hexdigest()[:10]}")
