from fastapi import FastAPI
import uvicorn

app = FastAPI()


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
