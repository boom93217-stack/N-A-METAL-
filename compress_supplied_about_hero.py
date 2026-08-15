from pathlib import Path

from PIL import Image


source = Path(__file__).parent / "na-metal-about-supplied-fabrication-hero.webp"
target = Path(__file__).parent / "na-metal-about-supplied-fabrication-hero-optimized.webp"

with Image.open(source) as image:
    rgb = image.convert("RGB")
    optimized = rgb.resize((1920, 1072), Image.Resampling.LANCZOS)
    optimized.save(target, "WEBP", quality=86, method=6)
    print(f"{source.name} -> {target.name}: {optimized.size[0]}x{optimized.size[1]}")
