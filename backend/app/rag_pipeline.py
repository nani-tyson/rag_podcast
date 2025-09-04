import os
import hashlib
import json
from dotenv import load_dotenv
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.embeddings import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
import assemblyai as aai

load_dotenv()
aai.settings.api_key = os.getenv("ASSEMBLYAI_API_KEY")

class RAGProcessor:
    def __init__(self):
        self.cache_db_path = "cache_db.json"
        self._load_cache()

    def _load_cache(self):
        if os.path.exists(self.cache_db_path):
            with open(self.cache_db_path, "r") as f:
                self.cache = json.load(f)
        else:
            self.cache = {}

    def _save_cache(self):
        with open(self.cache_db_path, "w") as f:
            json.dump(self.cache, f, indent=2)

    def _get_file_hash(self, path):
        """Generate hash from local file content"""
        hasher = hashlib.md5()
        with open(path, "rb") as f:
            while chunk := f.read(8192):
                hasher.update(chunk)
        return hasher.hexdigest()

    def ingest_file(self, file_path: str, refresh=False):
        """Transcribe uploaded audio, embed it, and store in ChromaDB"""
        file_hash = self._get_file_hash(file_path)

        if not refresh and file_hash in self.cache:
            print("✅ Loaded from cache")
            self.db = Chroma(
                persist_directory=self.cache[file_hash]["db_path"],
                embedding_function=HuggingFaceEmbeddings(model_name="BAAI/bge-small-en")
            )
            self.qa_chain = RetrievalQA.from_chain_type(
                llm=ChatGoogleGenerativeAI(model="models/gemini-1.5-flash", temperature=0.2),
                retriever=self.db.as_retriever(),
                return_source_documents=True
            )
            return

        # Step 1: Transcribe
        transcriber = aai.Transcriber()
        transcript = transcriber.transcribe(file_path, config=aai.TranscriptionConfig(speaker_labels=True))

        utterances = transcript.utterances
        if not utterances:
            raise ValueError("Transcription returned no utterances. Please upload a valid audio file.")

        # Step 2: Convert transcript into LangChain documents
        documents = []
        for utt in utterances:
            metadata = {
                "speaker": utt.speaker,
                "start": self.seconds_to_timestamp(utt.start),
                "end": self.seconds_to_timestamp(utt.end),
                "audio_file": file_path,
            }
            documents.append(Document(page_content=utt.text, metadata=metadata))

        # Step 3: Chunk into smaller parts
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        chunks = splitter.split_documents(documents)

        # Step 4: Store in Chroma DB
        embedder = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en")
        persist_dir = os.path.join("chroma_store", file_hash)
        os.makedirs(persist_dir, exist_ok=True)

        self.db = Chroma.from_documents(chunks, embedder, persist_directory=persist_dir)
        self.db.persist()

        self.cache[file_hash] = {"db_path": persist_dir}
        self._save_cache()

        # Step 5: Build RAG QA chain
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=ChatGoogleGenerativeAI(model="models/gemini-1.5-flash", temperature=0.2),
            retriever=self.db.as_retriever(),
            return_source_documents=True
        )

    def ask(self, query: str):
        """Ask a question against the ingested audio transcript"""
        if not hasattr(self, 'qa_chain'):
            return {"error": "No audio ingested yet. Please upload a file first."}

        result = self.qa_chain.invoke({"query": query})
        sources = []
        for doc in result["source_documents"]:
            sources.append({
                "audio_file": doc.metadata.get("audio_file"),
                "start_time": doc.metadata.get("start"),
                "end_time": doc.metadata.get("end"),
                "speaker": doc.metadata.get("speaker"),
                "content": doc.page_content
            })

        return {
            "query": query,
            "answer": result["result"],
            "sources": sources
        }

    def seconds_to_timestamp(self, ms):
        seconds = ms // 1000
        return f"{seconds // 3600}:{(seconds % 3600) // 60:02}:{seconds % 60:02}"

    def generate_summary(self):
        """Generate a summary of ingested content"""
        if not hasattr(self, 'qa_chain'):
            return {"error": "No audio ingested yet. Please upload a file first."}

        return self.ask("Give me a concise summary of the uploaded audio content.")
