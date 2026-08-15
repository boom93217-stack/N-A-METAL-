from pathlib import Path

from PIL import Image


source = Path("/home/ubuntu/webdev-static-assets/na-metal-logo-transparent.png")
target = Path("/home/ubuntu/webdev-static-assets/na-metal-logo-transparent-trimmed.webp")

with Image.open(source).convert("RGBA") as image:
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if bbox is None:
        raise RuntimeError("The cleaned logo does not contain visible pixels.")
    pad = 28
    left = max(0, bbox[0] - pad)
    top = max(0, bbox[1] - pad)
    right = min(image.width, bbox[2] + pad)
    bottom = min(image.height, bbox[3] + pad)
    trimmed = image.crop((left, top, right, bottom))
    if trimmed.width > 960:
        height = round(trimmed.height * 960 / trimmed.width)
        trimmed = trimmed.resize((960, height), Image.Resampling.LANCZOS)
    trimmed.save(target, "WEBP", lossless=True, method=6)

print(f"{target}: {target.stat().st_size} bytes")
