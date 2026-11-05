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
            out[o:o+3] = cur[s:s+3]; out[o+3] = cur[s+3] if bpp == 4 else 255
        prev = cur
    return w, h, out

def encode(path, w, h, px):
    raw = bytearray()
    for y in range(h): raw.append(0); raw += px[y*w*4:(y+1)*w*4]
    def chunk(t, b): return struct.pack(">I", len(b)) + t + b + struct.pack(">I", zlib.crc32(t + b) & 0xffffffff)
    pathlib.Path(path).write_bytes(b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0)) + chunk(b"IDAT", zlib.compress(bytes(raw), 9)) + chunk(b"IEND", b""))

# Zones (x0, y0, x1, y1, en pixels de l'image d'origine) à ne jamais effacer : des vêtements blancs de la couleur
# exacte du fond, que la règle automatique prendrait pour un trou (tee-shirt d'Alex, débardeur de Chloé, chemises blanches
# de Yves et Quentin dont la patte de boutonnage est une fente claire)
KEEP = {"alex": [(222, 149, 267, 310)], "chloe": [(199, 189, 247, 246)], "yves": [(80, 100, 340, 370)], "quentin": [(70, 120, 320, 320)]}

def cutout(w, h, px, keep=()):
    # pixel « fond » : clair et peu saturé ; « ombre au sol » : gris-beige peu saturé. On remplit depuis les bords.
    band = int(h * 0.86)  # l'ombre au sol n'existe que sous les pieds : le critère « gris-beige » ne vaut que là
    def kind(x, y):
        o = (y * w + x) * 4; r, g, b = px[o], px[o+1], px[o+2]; mx, mn = max(r, g, b), min(r, g, b)
        if mn > 228 and mx - mn <= 24: return 1   # fond
        if y >= band and mn > 120 and mx - mn <= 60: return 2   # ombre portée sur le sol (retirée : le CSS en dessine une)
        return 0
    # Un pixel d'ombre n'est franchissable que si ses huit voisins sont fond ou ombre : le remplissage ne se faufile
    # pas par une brèche de un ou deux pixels dans le trait d'une basket (érosion), la bordure est rattrapée ensuite
    def passable(x, y):
        k = kind(x, y)
        if k != 2: return k
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                nx, ny = x + dx, y + dy
                if 0 <= nx < w and 0 <= ny < h and not kind(nx, ny): return 0
        return 2
    seen = bytearray(w * h); q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if kind(x, y) and not seen[y*w+x]: seen[y*w+x] = 1; q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if kind(x, y) and not seen[y*w+x]: seen[y*w+x] = 1; q.append((x, y))
    while q:
        x, y = q.popleft()
        for nx, ny in ((x+1, y), (x-1, y), (x, y+1), (x, y-1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny*w+nx] and passable(nx, ny):
                seen[ny*w+nx] = 1; q.append((nx, ny))
    grow = [(x, y) for y in range(band, h) for x in range(w) if not seen[y*w+x] and kind(x, y) == 2
            and any(0 <= x+dx < w and 0 <= y+dy < h and seen[(y+dy)*w+x+dx] for dy in (-1, 0, 1) for dx in (-1, 0, 1))]
    for x, y in grow: seen[y*w+x] = 1
    # fond médian (pixels atteints depuis le bord) pour juger les zones fermées (entre les jambes, sous un bras)
    samp = sorted(tuple(px[i*4:i*4+3]) for i in range(0, w*h, 97) if seen[i] and min(px[i*4:i*4+3]) > 228)
    bg = samp[len(samp)//2] if samp else (250, 250, 245)
    close = lambda i: max(abs(px[i*4+k] - bg[k]) for k in range(3)) <= 7
    comp_seen = bytearray(seen)
    for start in range(w*h):
        if comp_seen[start] or not kind(start % w, start // w): continue
        comp = [start]; comp_seen[start] = 1; qq = deque([start]); near = near4 = 0
        while qq:
            i = qq.popleft(); x, y = i % w, i // w
            if close(i): near += 1
            if max(abs(px[i*4+k] - bg[k]) for k in range(3)) <= 4: near4 += 1
            for nx, ny in ((x+1, y), (x-1, y), (x, y+1), (x, y-1)):
                j = ny*w+nx
                if 0 <= nx < w and 0 <= ny < h and not comp_seen[j] and kind(nx, ny): comp_seen[j] = 1; comp.append(j); qq.append(j)
        if len(comp) < 40 or any((x0 <= x < x1 and y0 <= y < y1) for (x0, y0, x1, y1) in keep): continue
        # zone fermée (entre un bras et le corps, entre les jambes) : effacée si elle est exactement de la couleur du
        # fond (une chemise blanche en est un peu éloignée : near4 faible), ou si c'est une fine fente presque fond
        xs = [i % w for i in comp]; ys = [i // w for i in comp]; thin = min(max(xs) - min(xs), max(ys) - min(ys)) <= 14
        if near4 / len(comp) >= 0.55 or (thin and near / len(comp) >= 0.5):
            for i in comp: seen[i] = 1
    for i in range(w * h):
        if seen[i]: px[i*4+3] = 0
    # Bord : les pixels opaques qui touchent le vide sont un mélange du trait et du fond (anti-crénelage).
    # On retrouve leur opacité d'après leur écart au fond et on retire la part de fond de leur couleur (pas de liseré clair).
    def ring(depth_mask, div):
        for y in range(h):
            for x in range(w):
                i = y * w + x; o = i * 4
                if not depth_mask[i]: continue
                d = max(abs(px[o+k] - bg[k]) for k in range(3)); a = min(1.0, d / div)
                if a < 0.1: px[o+3] = 0; continue
                for k in range(3): px[o+k] = max(0, min(255, round((px[o+k] - (1 - a) * bg[k]) / a)))
                px[o+3] = round(a * 255)
    def neighbours_of(pred):
        m = bytearray(w * h)
        for y in range(h):
            for x in range(w):
                i = y * w + x
                if px[i*4+3] == 0 or not pred(i): continue
                if (x > 0 and px[(i-1)*4+3] == 0) or (x < w-1 and px[(i+1)*4+3] == 0) or (y > 0 and px[(i-w)*4+3] == 0) or (y < h-1 and px[(i+w)*4+3] == 0): m[i] = 1
        return m
    r1 = neighbours_of(lambda i: px[i*4+3] == 255); ring(r1, 110)
    r2 = neighbours_of(lambda i: px[i*4+3] == 255 and not r1[i]); ring(r2, 60)
    return px

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
    # Un PNG déjà détouré (fond transparent, v2 des personnages) est seulement recadré et réduit
    if all(px[i] == 255 for i in range(3, w * h * 4, 4)): px = cutout(w, h, px, KEEP.get(pathlib.Path(f).stem, ()))
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
