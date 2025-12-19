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
materials = []


def get_files(dir_path):
    return [f for f in os.listdir(dir_path) if os.path.isfile(os.path.join(dir_path, f))]


def remove_ext(filename):
    return filename.split('.')[0]


def load_techs():
    global techs
    techs_dir = "assets/tech"

    techs = set([remove_ext(f).split('_')[0] for f in get_files(techs_dir)])


def load_materials():
    global materials
    materials_dir = "assets/badge"

    materials = set([remove_ext(f) for f in get_files(materials_dir)])


@app.get("/techs")
def get_techs():
    return {"techs": sorted(techs), "count": len(techs)}


@app.get("/materials")
def get_materials():
    return {"materials": materials, "count": len(materials)}


@app.get("/badge")
def get_badge(tech: str, score: int, scale: int, material: str = "standard"):
    tech = tech.strip().lower()

    errors = []

    if tech not in techs:
        errors.append("Invalid tech. Call '/techs' to see valid options.")
    if score < 0 or score > 6:
        errors.append("Score must be a number between 0 and 6")
    if scale < 1 or scale > 20:
        errors.append("Scale must be a number between 1 and 20")
    if material not in materials:
        errors.append("Invalid material. Call '/materials' to see valid options.")

    if errors:
        raise HTTPException(status_code=400, detail=errors)

    image_data = generate_badge(tech, score, scale, material)

    return StreamingResponse(image_data, media_type="image/png")


@app.post("/admin/reload")
def reload(api_key: str = Header(..., alias="X-API-Key")):
    if not ADMIN_API_KEY:
        raise HTTPException(status_code=500, detail="Admin API key not configured")
    if api_key != ADMIN_API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")

    prev_tech_count = len(techs)
    load_techs()
    new_techs = len(techs) - prev_tech_count

    prev_material_count = len(materials)
    load_materials()
    new_materials = len(materials) - prev_material_count

    return {
        "message": "Reloaded successfully",
        "new_materials": new_materials,
        "new_techs": new_techs
    }


def main():
    load_techs()
    load_materials()
    uvicorn.run(app, host="127.0.0.1", port=8000)


if __name__ == "__main__":
    main()
