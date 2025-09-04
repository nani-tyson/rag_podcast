from fastapi import FastAPI
from app.api import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://127.0.0.1:5173",   # local frontend (dev)
    "http://localhost:5173",   # another local alias
    "https://rag-podcast.vercel.app",  # replace with your deployed frontend domain
]
# CORS (allow frontend to call this backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
