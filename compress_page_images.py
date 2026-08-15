from pathlib import Path

from PIL import Image


ASSETS = {
    "na-metal-about-architectural-metalwork.png": (1600, 1200),
    "na-metal-services-fabrication-engineering.png": (1920, 1080),
    "na-metal-project-gallery-anchor.png": (1920, 1080),
    "na-metal-project-structural-canopy.png": (1920, 1080),
    "na-metal-project-dark-facade.jpeg": (1920, 1080),
    "na-metal-contact-dubai-steel.png": (1920, 1080),
}


def optimize(source: Path, target_size: tuple[int, int]) -> None:
    with Image.open(source) as image:
        working = image.convert("RGB")
        target_ratio = target_size[0] / target_size[1]
        source_ratio = working.width / working.height
        if source_ratio > target_ratio:
            crop_width = round(working.height * target_ratio)
            left = (working.width - crop_width) // 2
            working = working.crop((left, 0, left + crop_width, working.height))
        elif source_ratio < target_ratio:
            crop_height = round(working.width / target_ratio)
            top = (working.height - crop_height) // 2
            working = working.crop((0, top, working.width, top + crop_height))
        if working.size != target_size:
            working = working.resize(target_size, Image.Resampling.LANCZOS)
        destination = source.with_suffix(".webp")
        working.save(destination, "WEBP", quality=84, method=6)
        print(f"{source.name} -> {destination.name}: {working.size[0]}x{working.size[1]}")


def main() -> None:
    root = Path(__file__).parent
    missing = [name for name in ASSETS if not (root / name).exists()]
    for filename, target_size in ASSETS.items():
        source = root / filename
        if source.exists():
            optimize(source, target_size)
    if missing:
        print(f"Skipped managed renders that are still finalizing: {', '.join(missing)}")


if __name__ == "__main__":
    main()
