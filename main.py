from fastapi.responses import StreamingResponse
from image_generator import generate_badge
from fastapi import FastAPI
import uvicorn
import os

app = FastAPI()


def load_techs():
    techs_dir = "assets/tech"

    def remove_ext(filename):
        return filename.split('.')[0].split('_')[0]

    def get_files(dir_path):
        return [f for f in os.listdir(dir_path) if os.path.isfile(os.path.join(dir_path, f))]

    return set([remove_ext(f) for f in get_files(techs_dir)])

techs = load_techs()


@app.get("/techs")
def get_techs():
    return {"techs": techs}


@app.get("/badge")
def get_badge(tech: str, score: int, scale: int):
    tech = tech.strip().lower()

    if tech not in techs:
        return {"error": "Tech not found"}

    if score < 0 or score > 6:
        return {"error": "Score must be a number between 0 and 6"}

    if scale < 1 or scale > 20:
        return {"error": "Scale must be a number between 1 and 20"}

    image_data = generate_badge(tech, score, scale)

    return StreamingResponse(image_data, media_type="image/png")


def main():
    uvicorn.run(app, host="127.0.0.1", port=8000)


if __name__ == "__main__":
    main()
