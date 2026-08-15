from pathlib import Path

from PIL import Image


ASSETS = {
    "na-metal-about-fabrication-workshop.jpg": (1920, 1280),
    "na-metal-about-corten-sculpture.jpg": (1600, 1067),
}


def optimize(source: Path, target_size: tuple[int, int]) -> None:
    with Image.open(source) as image:
        working = image.convert("RGB")
        if source.name == "na-metal-about-fabrication-workshop.jpg":
            working = working.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        if working.size != target_size:
            working = working.resize(target_size, Image.Resampling.LANCZOS)
        destination = source.with_suffix(".webp")
        working.save(destination, "WEBP", quality=84, method=6)
        print(f"{source.name} -> {destination.name}: {working.size[0]}x{working.size[1]}")


def main() -> None:
    root = Path(__file__).parent
    for filename, target_size in ASSETS.items():
        optimize(root / filename, target_size)


if __name__ == "__main__":
    main()
