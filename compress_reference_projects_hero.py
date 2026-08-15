from pathlib import Path

from PIL import Image


FILES = [
    "na-metal-reference-event-stage.jpeg",
    "na-metal-reference-entrance-arch.webp",
    "na-metal-reference-backdrop.webp",
]


def resize_to_max(image: Image.Image, max_dimension: int = 1600) -> Image.Image:
    width, height = image.size
    scale = min(1, max_dimension / max(width, height))
    if scale == 1:
        return image
    return image.resize((round(width * scale), round(height * scale)), Image.Resampling.LANCZOS)


def main() -> None:
    root = Path(__file__).parent
    for filename in FILES:
        source = root / filename
        target = source.with_name(f"{source.stem}-optimized.webp")
        with Image.open(source) as image:
            optimized = resize_to_max(image.convert("RGB"))
            optimized.save(target, "WEBP", quality=84, method=6)
            print(f"{source.name} -> {target.name}: {optimized.size[0]}x{optimized.size[1]}")


if __name__ == "__main__":
    main()
