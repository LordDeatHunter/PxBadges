import threading
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI, Header, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles

from config import ADMIN_API_KEY, REFRESH_INTERVAL_SECONDS
from image_generator import generate_badge
from utils import load_materials, load_techs

stop_event = threading.Event()


@asynccontextmanager
async def lifespan(app: FastAPI):
    _reload_lists()

    refresh_thread = threading.Thread(
        target=_refresh_worker,
        args=(stop_event,),
        daemon=True
    )
    refresh_thread.start()
    try:
        yield
    finally:
        stop_event.set()
        refresh_thread.join(timeout=2)


app = FastAPI(lifespan=lifespan)

app.mount("/static", StaticFiles(directory="static"), name="static")

techs = set()
materials = set()
data_lock = threading.Lock()


def _reload_lists():
    global techs, materials

    new_techs = load_techs()
    new_materials = load_materials()

    with data_lock:
        prev_tech_count = len(techs)
        prev_material_count = len(materials)
        techs = new_techs
        materials = new_materials

    return {
        "new_techs": len(new_techs) - prev_tech_count,
        "new_materials": len(new_materials) - prev_material_count
    }


def _refresh_worker(stop_signal: threading.Event):
    while not stop_signal.is_set():
        stop_signal.wait(REFRESH_INTERVAL_SECONDS)
        if stop_signal.is_set():
            break
        try:
            _reload_lists()
        except Exception:
            # Keep the refresh loop alive even if a reload fails.
            continue


@app.get("/")
def root():
    return FileResponse("static/index.html")


@app.get("/techs")
def get_techs():
    with data_lock:
        tech_list = sorted(techs)
    return {"techs": tech_list, "count": len(tech_list)}


@app.get("/materials")
def get_materials():
    with data_lock:
        material_list = sorted(materials)
    return {"materials": material_list, "count": len(material_list)}


@app.get("/badge")
def get_badge(tech: str, score: int, scale: int, material: str = "standard"):
    tech = tech.strip().lower()

    errors = []

    with data_lock:
        tech_valid = tech in techs
        material_valid = material in materials

    if not tech_valid:
        errors.append("Invalid tech. Call '/techs' to see valid options.")
    if score < 0 or score > 6:
        errors.append("Score must be a number between 0 and 6")
    if scale < 1 or scale > 20:
        errors.append("Scale must be a number between 1 and 20")
    if not material_valid:
        errors.append(
            "Invalid material. Call '/materials' to see valid options.")

    if errors:
        raise HTTPException(status_code=400, detail=errors)

    image_data = generate_badge(tech, score, scale, material)

    return StreamingResponse(image_data, media_type="image/png")


@app.post("/admin/reload")
def reload(api_key: str = Header(..., alias="X-API-Key")):
    if not ADMIN_API_KEY:
        raise HTTPException(
            status_code=500, detail="Admin API key not configured")
    if api_key != ADMIN_API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")

    counts = _reload_lists()

    return {
        "message": "Reloaded successfully",
        "new_materials": counts["new_materials"],
        "new_techs": counts["new_techs"]
    }


def main():
    _reload_lists()
    uvicorn.run(app, host="127.0.0.1", port=8000)


if __name__ == "__main__":
    main()
