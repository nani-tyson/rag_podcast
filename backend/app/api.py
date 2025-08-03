from fastapi import APIRouter, Form, Body
from pydantic import BaseModel
from app.rag_pipeline import RAGProcessor

router = APIRouter()

class URLRequest(BaseModel):
    url: str

rag = RAGProcessor()

@router.post("/upload-audio")
async def upload_audio(request: URLRequest):
    rag.ingest_url(request.url)
    return {"message": "URL processed"}

@router.post("/ask")
async def ask_question(query: str = Form(...)):
    result = rag.ask(query)
    return result

@router.post("/summary")
def generate_summary():
    return rag.generate_summary()


@router.get("/")
async def root():
    return {
        "message": "Welcome to the RAG API. Use /upload-audio to upload audio files and /ask to ask questions."
    }
