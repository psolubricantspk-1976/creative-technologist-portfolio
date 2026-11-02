"""Convert a black-on-white silhouette PNG into a compact SVG path (normalised)."""
import sys
import numpy as np
import potrace
from PIL import Image, ImageFilter

def trace(src, target_w=600, turdsize=8, alphamax=1.3, opttol=0.8, scale=None):
    im = Image.open(src).convert("L")
    ratio = target_w / im.width
    im = im.resize((target_w, max(1, round(im.height * ratio))), Image.LANCZOS)
    im = im.filter(ImageFilter.MedianFilter(3))
    a = np.array(im)
    ink = a < 128

    ys, xs = np.where(ink)
    y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    # pad so curves never sit on the viewBox edge
    pad = max(2, int(target_w * 0.01))
    ink = ink[max(0, y0 - pad):y1 + pad, max(0, x0 - pad):x1 + pad]
    h, w = ink.shape

    # potracer treats True as background; invert so the animal is traced
    path = potrace.Bitmap(~ink).trace(
        turdsize=turdsize,
        turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY,
        alphamax=alphamax,
        opticurve=1,
        opttolerance=opttol,
    )

    k = 1.0 if scale is None else scale
    def p(pt):
        return f"{pt.x * k:.0f} {pt.y * k:.0f}"

    parts = []
    for c in path:
        parts.append(f"M{p(c.start_point)}")
        for s in c:
            if s.is_corner:
                parts.append(f"L{p(s.c)} {p(s.end_point)}")
            else:
                parts.append(f"C{p(s.c1)} {p(s.c2)} {p(s.end_point)}")
        parts.append("Z")

    d = "".join(parts).replace(" -", "-")
    return d, round(w * k), round(h * k), len(path)

if __name__ == "__main__":
    src, out = sys.argv[1], sys.argv[2]
    d, w, h, n = trace(src)
    with open(out, "w") as fh:
        fh.write(d)
    print(f"{src}: viewBox 0 0 {w} {h} · {n} subpaths · {len(d)} chars")
