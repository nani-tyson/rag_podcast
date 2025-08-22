from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from app.rag_pipeline import RAGProcessor
import tempfile
from pydantic import BaseModel

router = APIRouter()

class QuestionRequest(BaseModel):
    query: str

rag = RAGProcessor()

@router.post("/upload-audio")
async def upload_audio(file: UploadFile = File(...)):
    try:
        # Use a safe file suffix (default .wav if none)
        suffix = "." + file.filename.split('.')[-1] if '.' in file.filename else ".wav"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        rag.ingest_file(tmp_path)
        return {"message": "File processed successfully"}

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

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
        "message": "Welcome to the RAG API. Upload audio with /upload-audio, then ask questions with /ask."
    }
