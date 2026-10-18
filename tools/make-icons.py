#!/usr/bin/env python3
"""Build TickerAI icons from the raster master at tools/logo-master.png.

The master is the cropped logo on a transparent background. App icons sit on
the desk ink so a browser tab and an iOS home screen stay readable.
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
MASTER = ROOT / "tools" / "logo-master.png"
INK = (11, 12, 10, 255)


def fit(logo: Image.Image, size: int, pad: float) -> Image.Image:
    inner = max(1, int(round(size * (1 - 2 * pad))))
    glyph = logo.copy()
    glyph.thumbnail((inner, inner), Image.Resampling.LANCZOS)
    return glyph


def transparent_mark(logo: Image.Image, size: int, pad: float) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    glyph = fit(logo, size, pad)
    x = (size - glyph.width) // 2
    y = (size - glyph.height) // 2
    canvas.paste(glyph, (x, y), glyph)
    return canvas


def ink_icon(logo: Image.Image, size: int, pad: float) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), INK)
    glyph = fit(logo, size, pad)
    x = (size - glyph.width) // 2
    y = (size - glyph.height) // 2
    canvas.paste(glyph, (x, y), glyph)
    return canvas


def main() -> None:
    logo = Image.open(MASTER).convert("RGBA")
    icons = ROOT / "icons"
    public = ROOT / "public"
    icons.mkdir(exist_ok=True)
    public.mkdir(exist_ok=True)

    mark = transparent_mark(logo, 512, 0.04)
    mark.save(icons / "mark.png", optimize=True)
    mark.save(public / "mark.png", optimize=True)

    ink_icon(logo, 512, 0.1).save(icons / "icon-512.png", optimize=True)
    ink_icon(logo, 192, 0.1).save(icons / "icon-192.png", optimize=True)
    ink_icon(logo, 180, 0.1).save(icons / "icon-180.png", optimize=True)
    ink_icon(logo, 32, 0.08).save(icons / "favicon-32.png", optimize=True)
    ink_icon(logo, 180, 0.1).save(public / "apple-touch-icon.png", optimize=True)

    # Self-contained so any leftover mark.svg request still shows this logo.
    embedded = transparent_mark(logo, 256, 0.04)
    import base64
    import io

    buf = io.BytesIO()
    embedded.save(buf, format="PNG", optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">'
        f'<image width="256" height="256" href="data:image/png;base64,{b64}"/>'
        "</svg>\n"
    )
    (icons / "mark.svg").write_text(svg)
    (public / "mark.svg").write_text(svg)
    print("wrote icons from", MASTER.name)


if __name__ == "__main__":
    main()
