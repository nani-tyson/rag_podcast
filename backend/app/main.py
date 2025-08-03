from fastapi import FastAPI
from app.api import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS (allow frontend to call this backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
            "http://localhost:5173",  # for local frontend dev
            "https://your-frontend-url.com",  # replace with actual deployed frontend URL
        ],  # Adjust this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
