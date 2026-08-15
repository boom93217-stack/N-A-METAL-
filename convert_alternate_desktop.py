from pathlib import Path
from PIL import Image

source = Path("/home/ubuntu/webdev-static-assets/noman-builds-hero-alternate-desktop.png")
destination = Path("/home/ubuntu/webdev-static-assets/noman-builds-hero-alternate-desktop.webp")

with Image.open(source) as image:
    image = image.convert("RGB")
    image.thumbnail((1600, 900), Image.Resampling.LANCZOS)
    image.save(destination, "WEBP", quality=82, method=6)
    print(f"Saved {destination} at {image.width}x{image.height}")
