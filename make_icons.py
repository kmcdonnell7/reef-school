#!/usr/bin/env python3
"""Generate app icons for Reef School's two sub-apps.
Run: python3 make_icons.py   (needs Pillow)"""
import os, math
from PIL import Image, ImageDraw, ImageFont

APPS = {
    "tidepool": {"emoji": "🌊", "top": (169, 214, 229), "bot": (74, 159, 199), "fallback": "TP"},
    "deepdive": {"emoji": "🤿", "top": (97, 165, 194), "bot": (1, 58, 99), "fallback": "DD"},
}
SIZES = [180, 192, 512]


def emoji_img(emoji):
    """Render a color emoji at its native 160px strike (Apple Color Emoji only
    ships that size), cropped tight. Returns an RGBA image or None."""
    path = "/System/Library/Fonts/Apple Color Emoji.ttc"
    if not os.path.exists(path):
        return None
    try:
        f = ImageFont.truetype(path, 160)
        canvas = Image.new("RGBA", (200, 200), (0, 0, 0, 0))
        d = ImageDraw.Draw(canvas)
        d.text((20, 20), emoji, font=f, embedded_color=True)
        return canvas.crop(canvas.getbbox())
    except Exception:
        return None


def label_font(px):
    for path in [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, px)
            except Exception:
                continue
    return ImageFont.load_default()


def make(app, cfg):
    outdir = os.path.join(os.path.dirname(__file__), app, "icons")
    os.makedirs(outdir, exist_ok=True)
    for size in SIZES:
        img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        d = ImageDraw.Draw(img)
        # vertical gradient background
        for y in range(size):
            t = y / size
            r = int(cfg["top"][0] * (1 - t) + cfg["bot"][0] * t)
            g = int(cfg["top"][1] * (1 - t) + cfg["bot"][1] * t)
            b = int(cfg["top"][2] * (1 - t) + cfg["bot"][2] * t)
            d.line([(0, y), (size, y)], fill=(r, g, b, 255))
        # rounded mask
        mask = Image.new("L", (size, size), 0)
        md = ImageDraw.Draw(mask)
        rad = int(size * 0.22)
        md.rounded_rectangle([0, 0, size, size], radius=rad, fill=255)
        img.putalpha(mask)
        d = ImageDraw.Draw(img)
        # a few bubbles
        for (cx, cy, rr) in [(0.22, 0.30, 0.06), (0.78, 0.24, 0.045), (0.68, 0.72, 0.05), (0.30, 0.74, 0.035)]:
            x, y, r = cx * size, cy * size, rr * size
            d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 255, 255, 60))
        # emoji centered (rendered at native strike, then scaled)
        em = emoji_img(cfg["emoji"])
        placed = False
        if em is not None:
            target = int(size * 0.62)
            scale = target / max(em.width, em.height)
            em2 = em.resize((max(1, int(em.width * scale)), max(1, int(em.height * scale))), Image.LANCZOS)
            img.alpha_composite(em2, ((size - em2.width) // 2, (size - em2.height) // 2))
            placed = True
        if not placed:
            lf = label_font(int(size * 0.42))
            txt = cfg["fallback"]
            bbox = d.textbbox((0, 0), txt, font=lf)
            w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
            d.text(((size - w) / 2 - bbox[0], (size - h) / 2 - bbox[1]), txt, font=lf, fill=(255, 255, 255, 255))
        img.save(os.path.join(outdir, f"icon-{size}.png"))
        print("wrote", os.path.join(app, "icons", f"icon-{size}.png"))


if __name__ == "__main__":
    for app, cfg in APPS.items():
        make(app, cfg)
