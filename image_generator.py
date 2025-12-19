from PIL import Image
from io import BytesIO

STAR_LOCATIONS = [(7, 46), (19, 47), (31, 46)]
LOGO_LOCATION = (8, 10)

def generate_badge(tech: str, score: int, scale: int, material: str) -> BytesIO:
    badge = Image.open(f"assets/badge/{material}.png").convert("RGBA")
    logo = Image.open(f"assets/tech/{tech}.png").convert("RGBA")
    star = Image.open("assets/star.png").convert("RGBA")
    half_star = star.crop((0, 0, star.width // 2, star.height)).convert("RGBA")

    for i in range(len(STAR_LOCATIONS)):
        current_pos = i * 2 + 1
        if current_pos < score:
            badge.paste(star, STAR_LOCATIONS[i], star)
        elif current_pos == score:
            badge.paste(half_star, STAR_LOCATIONS[i], half_star)

    badge.paste(logo, LOGO_LOCATION, logo)

    badge = badge.resize((badge.width * scale, badge.height * scale), Image.Resampling.NEAREST)

    output = BytesIO()
    badge.save(output, format="PNG")
    output.seek(0)

    return output
