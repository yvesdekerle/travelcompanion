#!/usr/bin/env python3
"""Détoure les dessins des personnages du groupe (fond blanc cassé → transparent, ombre au sol gardée en
semi-transparent), les recadre, les réduit et écrit des PNG RGBA. Bibliothèque standard seulement (pas de Pillow).
Usage : python3 scripts/cutout_cast.py tmp/personnage site/img/p 560
Les PNG d'origine sont dans tmp/ (hors git) ; ajouter ensuite le prénom dans `cast` (site/js/data.js)."""
import sys, zlib, struct, pathlib, glob
from collections import deque

def decode(path):
    data = pathlib.Path(path).read_bytes(); pos = 8; idat = b""
    while pos < len(data):
        ln, = struct.unpack(">I", data[pos:pos+4]); typ = data[pos+4:pos+8]; body = data[pos+8:pos+8+ln]; pos += 12 + ln
        if typ == b"IHDR": w, h, bd, ct = struct.unpack(">IIBB", body[:10])
        elif typ == b"IDAT": idat += body
    raw = zlib.decompress(idat); bpp = 4 if ct == 6 else 3; stride = w * bpp
    out = bytearray(w * h * 4); prev = bytearray(stride); p = 0
    for y in range(h):
        f = raw[p]; cur = bytearray(raw[p+1:p+1+stride]); p += 1 + stride
        for i in range(stride):
            a = cur[i-bpp] if i >= bpp else 0; b = prev[i]; c = prev[i-bpp] if i >= bpp else 0
            if f == 1: cur[i] = (cur[i] + a) & 255
            elif f == 2: cur[i] = (cur[i] + b) & 255
            elif f == 3: cur[i] = (cur[i] + ((a + b) >> 1)) & 255
            elif f == 4:
                pa, pb, pc = abs(b - c), abs(a - c), abs(a + b - 2*c)
                cur[i] = (cur[i] + (a if pa <= pb and pa <= pc else b if pb <= pc else c)) & 255
        for x in range(w):
            o = (y * w + x) * 4; s = x * bpp
            out[o:o+3] = cur[s:s+3]; out[o+3] = 255
        prev = cur
    return w, h, out

def encode(path, w, h, px):
    raw = bytearray()
    for y in range(h): raw.append(0); raw += px[y*w*4:(y+1)*w*4]
    def chunk(t, b): return struct.pack(">I", len(b)) + t + b + struct.pack(">I", zlib.crc32(t + b) & 0xffffffff)
    pathlib.Path(path).write_bytes(b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0)) + chunk(b"IDAT", zlib.compress(bytes(raw), 9)) + chunk(b"IEND", b""))

def cutout(w, h, px):
    # pixel « fond » : clair et peu saturé ; « ombre » : gris peu saturé. On remplit depuis les bords.
    def kind(x, y):
        o = (y * w + x) * 4; r, g, b = px[o], px[o+1], px[o+2]; mx, mn = max(r, g, b), min(r, g, b)
        if mx - mn > 22: return 0
        if mn > 228: return 1          # fond
        if mn > 120: return 2          # ombre au sol
        return 0
    seen = bytearray(w * h); q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if kind(x, y) and not seen[y*w+x]: seen[y*w+x] = 1; q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if kind(x, y) and not seen[y*w+x]: seen[y*w+x] = 1; q.append((x, y))
    def fill():
        while q:
            x, y = q.popleft()
            for nx, ny in ((x+1, y), (x-1, y), (x, y+1), (x, y-1)):
                if 0 <= nx < w and 0 <= ny < h and not seen[ny*w+nx] and kind(nx, ny):
                    seen[ny*w+nx] = 1; q.append((nx, ny))
    fill()
    # fond médian (pixels atteints depuis le bord) pour juger les zones fermées (entre les jambes, sous un bras)
    samp = sorted(tuple(px[i*4:i*4+3]) for i in range(0, w*h, 97) if seen[i] and min(px[i*4:i*4+3]) > 228)
    bg = samp[len(samp)//2] if samp else (250, 250, 245)
    close = lambda i: max(abs(px[i*4+k] - bg[k]) for k in range(3)) <= 7
    comp_seen = bytearray(seen)
    for start in range(w*h):
        if comp_seen[start] or not kind(start % w, start // w): continue
        comp = [start]; comp_seen[start] = 1; qq = deque([start]); near = 0
        while qq:
            i = qq.popleft(); x, y = i % w, i // w
            if close(i): near += 1
            for nx, ny in ((x+1, y), (x-1, y), (x, y+1), (x, y-1)):
                j = ny*w+nx
                if 0 <= nx < w and 0 <= ny < h and not comp_seen[j] and kind(nx, ny): comp_seen[j] = 1; comp.append(j); qq.append(j)
        # zone fermée : on l'efface si elle est grande et vraiment de la couleur du fond (une chemise blanche ne l'est pas)
        if len(comp) >= 40 and near / len(comp) > 0.6:
            for i in comp: seen[i] = 1
    for y in range(h):
        for x in range(w):
            i = y * w + x
            if not seen[i]: continue
            o = i * 4; mn = min(px[o], px[o+1], px[o+2])
            if mn > 228: px[o+3] = 0
            else:  # ombre : gris → noir semi-transparent, d'autant plus opaque que c'est sombre
                a = int((232 - mn) * 1.1); px[o] = px[o+1] = px[o+2] = 20; px[o+3] = max(0, min(150, a))
    # léger adoucissement du bord : un pixel opaque voisin d'un transparent garde un peu d'alpha en moins
    edge = bytearray(px)
    for y in range(1, h - 1):
        for x in range(1, w - 1):
            i = y * w + x; o = i * 4
            if px[o+3] == 255 and (px[o-1] == 0 or px[o+7] == 0 or px[o-w*4+3] == 0 or px[o+w*4+3] == 0): edge[o+3] = 200
    return edge

def resize(w, h, px, nh):
    nw = round(w * nh / h); out = bytearray(nw * nh * 4); sx, sy = w / nw, h / nh
    for y in range(nh):
        y0, y1 = int(y * sy), max(int(y * sy) + 1, int((y + 1) * sy))
        for x in range(nw):
            x0, x1 = int(x * sx), max(int(x * sx) + 1, int((x + 1) * sx))
            r = g = b = a = n = 0
            for yy in range(y0, y1):
                for xx in range(x0, x1):
                    o = (yy * w + xx) * 4; al = px[o+3]
                    r += px[o] * al; g += px[o+1] * al; b += px[o+2] * al; a += al; n += 1
            o = (y * nw + x) * 4
            if a: out[o], out[o+1], out[o+2], out[o+3] = r // a, g // a, b // a, a // n
    return nw, nh, out

def crop(w, h, px):
    xs = [x for x in range(w) if any(px[(y*w+x)*4+3] for y in range(0, h, 2))]
    ys = [y for y in range(h) if any(px[(y*w+x)*4+3] for x in range(0, w, 2))]
    x0, x1, y0, y1 = max(0, xs[0]-4), min(w, xs[-1]+5), max(0, ys[0]-4), min(h, ys[-1]+5)
    nw, nh = x1 - x0, y1 - y0; out = bytearray(nw * nh * 4)
    for y in range(nh): out[y*nw*4:(y+1)*nw*4] = px[((y+y0)*w+x0)*4:((y+y0)*w+x1)*4]
    return nw, nh, out

if len(sys.argv) != 4: sys.exit("usage : cutout_cast.py <dossier source> <dossier cible> <hauteur en px>")
src, dst, H = sys.argv[1], pathlib.Path(sys.argv[2]), int(sys.argv[3]); dst.mkdir(parents=True, exist_ok=True)
for f in sorted(glob.glob(f"{src}/*.png")):
    w, h, px = decode(f)
    px = cutout(w, h, px)
    for y in range(h):  # bords du scan (colonne parfois noire) : 3 px effacés tout autour
        for x in list(range(3)) + list(range(w-3, w)): px[(y*w+x)*4+3] = 0
    for x in range(w):
        for y in list(range(3)) + list(range(h-3, h)): px[(y*w+x)*4+3] = 0
    w, h, px = crop(w, h, px); w, h, px = resize(w, h, px, H)
    for i in range(0, w*h*4, 4):  # couleurs arrondies au multiple de 4 : invisible, mais le PNG se compresse mieux
        if px[i+3]: px[i], px[i+1], px[i+2] = px[i] & ~3, px[i+1] & ~3, px[i+2] & ~3
        else: px[i] = px[i+1] = px[i+2] = 0
    out = dst / (pathlib.Path(f).stem + ".png"); encode(out, w, h, px)
    print(out.name, w, h, out.stat().st_size // 1000, "kB")
