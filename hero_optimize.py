from PIL import Image

SOURCE = "/home/ubuntu/webdev-static-assets/metal-art-workshop.jpg"
DESKTOP = "/home/ubuntu/webdev-static-assets/noman-builds-hero-desktop.webp"
MOBILE = "/home/ubuntu/webdev-static-assets/noman-builds-hero-mobile.webp"

image = Image.open(SOURCE).convert("RGB")
width, height = image.size

# A 16:9 desktop crop keeps the fabrication action centered while matching the hero geometry.
desktop_height = round(width * 9 / 16)
desktop_top = (height - desktop_height) // 2
desktop_crop = image.crop((0, desktop_top, width, desktop_top + desktop_height))
desktop_crop.resize((1600, 900), Image.Resampling.LANCZOS).save(DESKTOP, "WEBP", quality=82, method=6)

# A 4:5 crop preserves the central workshop story for small screens without downloading the desktop asset.
mobile_width = round(height * 4 / 5)
mobile_left = (width - mobile_width) // 2
mobile_crop = image.crop((mobile_left, 0, mobile_left + mobile_width, height))
mobile_crop.resize((960, 1200), Image.Resampling.LANCZOS).save(MOBILE, "WEBP", quality=80, method=6)
