from pathlib import Path
from PIL import Image

assets = Path("/home/ubuntu/webdev-static-assets")
targets = [
    (
        assets / "noman-builds-hero-premium-desktop.png",
        assets / "noman-builds-hero-premium-desktop.webp",
        (1600, 900),
    ),
    (
        assets / "noman-builds-hero-premium-mobile.png",
        assets / "noman-builds-hero-premium-mobile.webp",
        (960, 1707),
    ),
]

for source, destination, size in targets:
    with Image.open(source) as image:
        image = image.convert("RGB")
        image.thumbnail(size, Image.Resampling.LANCZOS)
        image.save(destination, "WEBP", quality=82, method=6)
        print(f"Saved {destination} at {image.width}x{image.height}")
