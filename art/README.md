# Brand art

Source files and the small scripts used to produce the assets in `public/brand`
and the inline silhouettes in `src/components/gfx/creature-paths.ts`.

* `logo.py` — keys the off-white card out of the supplied logo JPEG, clears the
  enclosed counters, decontaminates the edges and writes `forgex-mark.png`,
  `forgex-word.png` (recoloured for the dark UI) and `forgex-logo.png`.
  Usage: `python3 art/logo.py [path-to-source.jpeg]`.
* `src-bull.png`, `src-whale.png` — black-on-white silhouettes; `trace.py`
  converts them to the compact SVG paths used by the hero animation.
  Usage: `python3 art/trace.py art/src-bull.png /tmp/bull.path`.

Requires `pillow`, `numpy` and `potracer`.
