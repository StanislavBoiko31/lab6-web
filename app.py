from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import os

FILE_NAME = "collapses.json"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def read_data():
    if not os.path.exists(FILE_NAME):
        return {"collapses": []}
    with open(FILE_NAME, 'r') as file:
        try:
            return json.load(file)
        except json.JSONDecodeError:
            return {"collapses": []}

def write_data(data):
    with open(FILE_NAME, 'w') as file:
        json.dump(data, file)

@app.post("/save-collapses")
async def save_collapses_endpoint(collapses: dict):
    if "collapses" not in collapses or not isinstance(collapses["collapses"], list):
        raise HTTPException(status_code=400, detail="Invalid data format")
    write_data(collapses)
    return {"message": "Data saved successfully"}

@app.get("/get-collapses")
async def get_collapses():
    return read_data()

@app.delete("/delete/{index}")
async def delete_collapse(index: int):
    data = read_data()
    collapses = data.get("collapses", [])
    if 0 <= index < len(collapses):
        collapses.pop(index)
        write_data({"collapses": collapses})
        return {"message": "Collapse removed successfully"}
    raise HTTPException(status_code=404, detail="Collapse not found")

@app.on_event("startup")
async def reset_on_startup():
    write_data({"collapses": []})
