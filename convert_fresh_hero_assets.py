from pathlib import Path

from PIL import Image


ASSETS = (
    ("na-metal-hero-outdoor-installation-desktop.png", "na-metal-hero-outdoor-installation-desktop.webp", 1600),
    ("na-metal-hero-outdoor-installation-mobile.png", "na-metal-hero-outdoor-installation-mobile.webp", 900),
)


def convert(source_name: str, target_name: str, max_width: int) -> None:
    base = Path("/home/ubuntu/webdev-static-assets")
    source = base / source_name
    target = base / target_name
    with Image.open(source) as image:
        image = image.convert("RGB")
        if image.width > max_width:
            height = round(image.height * max_width / image.width)
            image = image.resize((max_width, height), Image.Resampling.LANCZOS)
        image.save(target, "WEBP", quality=82, method=6)
    print(f"{target.name}: {target.stat().st_size} bytes")


for asset in ASSETS:
    convert(*asset)
