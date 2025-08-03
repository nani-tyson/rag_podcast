from fastapi import FastAPI
from app.api import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS (allow frontend to call this backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(router)
