from pathlib import Path
from PIL import Image

source = Path("/home/ubuntu/webdev-static-assets/noman-builds-hero-alternate-mobile-v2.png")
destination = Path("/home/ubuntu/webdev-static-assets/noman-builds-hero-alternate-mobile.webp")

with Image.open(source) as image:
    image = image.convert("RGB")
    image.thumbnail((960, 1707), Image.Resampling.LANCZOS)
    image.save(destination, "WEBP", quality=82, method=6)
    print(f"Saved {destination} at {image.width}x{image.height}")
