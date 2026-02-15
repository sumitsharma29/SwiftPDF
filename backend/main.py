from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import asyncio
from contextlib import asynccontextmanager
from .utils.file_utils import cleanup_old_sessions

async def periodic_cleanup():
    while True:
        try:
            await asyncio.to_thread(cleanup_old_sessions)
        except Exception as e:
            print(f"Cleanup error: {e}")
        await asyncio.sleep(600) # Run every 10 mins

@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(periodic_cleanup())
    yield
    task.cancel()

app = FastAPI(
    title="PDF Converter API", 
    lifespan=lifespan,
    docs_url="/api/docs",
    openapi_url="/api/openapi.json"
)

# CORS Headers
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from .routers import pdf_routes

app.include_router(pdf_routes.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "PDF Converter API is running"}
