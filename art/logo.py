"""Cut the FG bull monogram + ForgeX Global wordmark out of the supplied JPEG.

The artwork arrives flattened on an off-white card, so the background is
keyed out, enclosed counters are cleared, the remaining edge pixels are
decontaminated and everything is resized in premultiplied alpha (otherwise
the downscale leaves a pale halo on the dark UI).
"""
import sys

from PIL import Image, ImageDraw, ImageFilter
import numpy as np

BG = np.array([247, 248, 250], dtype=np.float32)
KEY = (255, 0, 255)
SRC = sys.argv[1] if len(sys.argv) > 1 else 'art/forgex-logo-source.jpeg'


def keyed(src_img, box):
    im = src_img.convert("RGB").crop(box)
    w, h = im.size
    work = im.copy()
    for seed in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1),
                 (w // 2, 0), (0, h // 2), (w - 1, h // 2), (w // 2, h - 1)]:
        ImageDraw.floodfill(work, seed, KEY, thresh=30)
    bgmask = np.all(np.asarray(work) == np.array(KEY), axis=2)

    rgb = np.asarray(im).astype(np.float32)
    dist = np.sqrt(((rgb - BG) ** 2).sum(axis=2))

    # clear enclosed counters: large connected blobs of card colour
    cand = (dist < 14)
    seen = np.zeros_like(cand)
    holes = np.zeros_like(cand)
    H, W = cand.shape
    for y0 in range(H):
        for x0 in np.nonzero(cand[y0] & ~seen[y0])[0]:
            if seen[y0, x0] or not cand[y0, x0]:
                continue
            stack, comp = [(y0, x0)], []
            seen[y0, x0] = True
            while stack:
                y, x = stack.pop()
                comp.append((y, x))
                for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < H and 0 <= nx < W and cand[ny, nx] and not seen[ny, nx]:
                        seen[ny, nx] = True
                        stack.append((ny, nx))
            if len(comp) >= 60:
                ys = [p[0] for p in comp]
                xs = [p[1] for p in comp]
                holes[ys, xs] = True

    bgmask = bgmask | holes

    # edge ring: pixels that touch background → soft alpha from colour distance
    grown = np.asarray(Image.fromarray((bgmask * 255).astype(np.uint8))
                       .filter(ImageFilter.MaxFilter(3))) > 0
    ring = grown & ~bgmask

    alpha = np.full(bgmask.shape, 255.0, dtype=np.float32)
    alpha[bgmask] = 0.0
    alpha[ring] = np.minimum(alpha[ring], np.clip((dist[ring] - 8.0) / 18.0, 0, 1) * 255.0)

    # undo the blend with the card colour
    a = np.clip(alpha / 255.0, 0, 1)[..., None]
    true_rgb = np.clip((rgb - (1.0 - np.clip(a, 0.03, 1.0)) * BG) / np.clip(a, 0.03, 1.0), 0, 255)
    return np.concatenate([true_rgb, alpha[..., None]], axis=2)


def trim(arr, thr=6):
    ys, xs = np.where(arr[..., 3] > thr)
    return arr[ys.min():ys.max() + 1, xs.min():xs.max() + 1]


def premul_resize(arr, target_h):
    a = arr[..., 3:4] / 255.0
    pm = np.concatenate([arr[..., :3] * a, arr[..., 3:4]], axis=2)
    h, w = pm.shape[:2]
    tw = max(1, round(w * target_h / h))
    img = Image.fromarray(np.clip(pm, 0, 255).astype(np.uint8), "RGBA").resize((tw, target_h), Image.LANCZOS)
    pm2 = np.asarray(img).astype(np.float32)
    a2 = np.clip(pm2[..., 3:4] / 255.0, 1e-3, 1.0)
    return np.concatenate([np.clip(pm2[..., :3] / a2, 0, 255), pm2[..., 3:4]], axis=2).astype(np.uint8)


def main():
    src = Image.open(SRC)

    mark = trim(keyed(src, (400, 520, 1180, 930)))
    Image.fromarray(premul_resize(mark, 220), "RGBA").save("public/brand/forgex-mark.png", optimize=True)

    # The wordmark is flat two-colour artwork, so coverage can be measured
    # straight from the distance to the card colour — no ambiguity, no halo.
    win = src.convert("RGB").crop((400, 922, 1200, 1070))
    wrgb = np.asarray(win).astype(np.float32)
    wdist = np.sqrt(((wrgb - BG) ** 2).sum(axis=2))
    walpha = np.clip((wdist - 10.0) / 120.0, 0.0, 1.0) * 255.0
    ys, xs = np.where(walpha > 6)
    walpha = walpha[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    wrgb = wrgb[ys.min():ys.max() + 1, xs.min():xs.max() + 1]

    INK = np.array([246, 241, 233], dtype=np.float32)
    ember = wrgb[..., 0] > wrgb[..., 2] + 24
    wc = np.empty_like(wrgb)
    wc[ember] = np.array([255, 138, 43], dtype=np.float32)
    wc[~ember] = INK
    word = np.concatenate([wc, walpha[..., None]], axis=2)
    Image.fromarray(premul_resize(word, 96), "RGBA").save("public/brand/forgex-word.png", optimize=True)

    lock = trim(keyed(src, (400, 520, 1200, 1070)))
    Image.fromarray(premul_resize(lock, 480), "RGBA").save("public/brand/forgex-logo.png", optimize=True)

    for name in ("forgex-mark", "forgex-word", "forgex-logo"):
        im = Image.open(f"public/brand/{name}.png")
        print(name, im.size)


if __name__ == "__main__":
    main()
