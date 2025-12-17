from fastapi.responses import StreamingResponse
from image_generator import generate_badge
from fastapi import FastAPI, Header, HTTPException
import uvicorn
import dotenv
import os

app = FastAPI()
dotenv.load_dotenv()
ADMIN_API_KEY = os.getenv("ADMIN_API_KEY")


techs = []

def load_techs():
    techs_dir = "assets/tech"

    def remove_ext(filename):
        return filename.split('.')[0].split('_')[0]

    def get_files(dir_path):
        return [f for f in os.listdir(dir_path) if os.path.isfile(os.path.join(dir_path, f))]

    global techs
    techs = set([remove_ext(f) for f in get_files(techs_dir)])


@app.get("/techs")
def get_techs():
    return {"techs": sorted(techs), "count": len(techs)}


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


@app.post("/admin/reload-techs")
def reload_techs(api_key: str = Header(..., alias="X-API-Key")):
    if not ADMIN_API_KEY:
        raise HTTPException(status_code=500, detail="Admin API key not configured")
    if api_key != ADMIN_API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")

    prev_tech_count = len(techs)
    load_techs()
    new_techs = len(techs) - prev_tech_count

    return {"message": "Techs reloaded successfully", "new_techs": new_techs, "techs": sorted(techs)}


def main():
    load_techs()
    uvicorn.run(app, host="127.0.0.1", port=8000)


if __name__ == "__main__":
    main()
