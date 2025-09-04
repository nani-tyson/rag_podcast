from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from app.rag_pipeline import RAGProcessor
import tempfile
from pydantic import BaseModel
import traceback  # ✅ for full error logs
import logging

# Setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

class QuestionRequest(BaseModel):
    query: str

rag = RAGProcessor()

@router.post("/upload-audio")
async def upload_audio(file: UploadFile = File(...)):
    try:
        suffix = "." + file.filename.split('.')[-1] if '.' in file.filename else ".wav"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        rag.ingest_file(tmp_path)
        return {"message": "File processed successfully"}

    except Exception as e:
        error_trace = traceback.format_exc()  # ✅ full traceback
        logger.error(f"Upload error: {error_trace}")
        # Return both message + traceback
        return JSONResponse(
            status_code=500,
            content={"error": str(e), "traceback": error_trace}
        )

@router.post("/ask")
async def ask_question(request: QuestionRequest):
    try:
        result = rag.ask(request.query)
        return result
    except Exception as e:
        error_trace = traceback.format_exc()
        logger.error(f"Ask error: {error_trace}")
        return JSONResponse(status_code=500, content={"error": str(e), "traceback": error_trace})

@router.post("/summary")
def generate_summary():
    try:
        return rag.generate_summary()
    except Exception as e:
        error_trace = traceback.format_exc()
        logger.error(f"Summary error: {error_trace}")
        return JSONResponse(status_code=500, content={"error": str(e), "traceback": error_trace})

@router.get("/")
async def root():
    return {
        "message": "Welcome to the RAG API. Upload audio with /upload-audio, then ask questions with /ask."
    }
