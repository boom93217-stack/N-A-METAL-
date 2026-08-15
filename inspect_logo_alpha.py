from pathlib import Path

from PIL import Image


for name in ("na-metal-logo-transparent.png", "na-metal-logo-transparent-trimmed.webp"):
    path = Path("/home/ubuntu/webdev-static-assets") / name
    with Image.open(path).convert("RGBA") as image:
        alpha = image.getchannel("A")
        low, high = alpha.getextrema()
        opaque = sum(1 for value in alpha.getdata() if value == 255)
        total = image.width * image.height
        print(f"{name}: alpha={low}-{high}, opaque={opaque}/{total}")
