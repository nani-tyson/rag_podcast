from fastapi import APIRouter
from pydantic import BaseModel
from app.rag_pipeline import RAGProcessor
from fastapi.responses import JSONResponse
from yt_dlp.utils import DownloadError

router = APIRouter()

class URLRequest(BaseModel):
    url: str

class QuestionRequest(BaseModel):
    query: str  # Expecting a JSON body like { "query": "..." }

rag = RAGProcessor()

@router.post("/upload-audio")
async def upload_audio(request: URLRequest):
    try:
        rag.ingest_url(request.url)
        return {"message": "URL processed"}
    except DownloadError as e:
        return JSONResponse(
            status_code=400,
            content={"error": "Failed to download. Video may be unavailable, private, or restricted."}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

@router.post("/ask")
async def ask_question(request: QuestionRequest):
    result = rag.ask(request.query)
    return result

@router.post("/summary")
def generate_summary():
    return rag.generate_summary()

@router.get("/")
async def root():
    return {
        "message": "Welcome to the RAG API. Use /upload-audio to upload audio files and /ask to ask questions."
    }
