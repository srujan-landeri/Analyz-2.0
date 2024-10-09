from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import api.endpoints

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Analyz End Point"}

app.include_router(api.endpoints.router)