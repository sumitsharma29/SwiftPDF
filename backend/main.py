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
    # Start cleanup task
    try:
        task = asyncio.create_task(periodic_cleanup())
        yield
    finally:
        # Cancel cleanup task on shutdown
        try:
            task.cancel()
        except Exception:
            pass

app = FastAPI(
    title="PDF Converter API", 
    lifespan=lifespan,
    docs_url="/api/docs",
    openapi_url="/api/openapi.json"
)

# CORS Headers
# Allow all origins for Vercel preview deployments
origins = ["*"]

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
