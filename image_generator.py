from PIL import Image
from io import BytesIO


def generate_badge(tech: str, score: int, scale: int) -> BytesIO:
    base = Image.open("assets/badge_1.png").convert("RGBA")
    star = Image.open("assets/star.png").convert("RGBA")

    base.paste(star, (7, 46), star)
    base.paste(star, (19, 48), star)
    base.paste(star, (31, 46), star)

    output = BytesIO()
    base.save(output, format="PNG")
    output.seek(0)

    return output
