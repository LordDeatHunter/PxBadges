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

    return list(set([remove_ext(f) for f in get_files(techs_dir)]))


techs = load_techs()


@app.get("/techs")
def get_techs():
    return {"techs": techs}


@app.get("/badge")
def get_badge(tech: str, score: int, size: int):
    print(f"tech: {tech}")
    print(f"score: {score}")
    print(f"size: {size}")

    return {
        "tech": tech,
        "score": score,
        "size": size
    }


def main():
    uvicorn.run(app, host="0.0.0.0", port=8000)


if __name__ == "__main__":
    main()
