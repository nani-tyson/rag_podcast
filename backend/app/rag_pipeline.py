import os
import hashlib
import yt_dlp
import tempfile
from dotenv import load_dotenv
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.embeddings import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
import assemblyai as aai
import json

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

    def _get_url_hash(self, url):
        return hashlib.md5(url.encode()).hexdigest()

    def _download_and_convert(self, url):
        temp_dir = tempfile.mkdtemp()
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': os.path.join(temp_dir, 'input.%(ext)s'),
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'wav',
                'preferredquality': '192',
            }],
            'quiet': True,
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

        # Find the .wav file in temp_dir
        wav_file = None
        for fname in os.listdir(temp_dir):
            if fname.lower().endswith('.wav'):
                wav_file = os.path.join(temp_dir, fname)
                break
        if not wav_file or not os.path.exists(wav_file):
            raise FileNotFoundError("No .wav file found after yt_dlp download.")

        audio_path = os.path.join(temp_dir, "audio.wav")
        if wav_file != audio_path:
            # Rename or copy to audio.wav
            import shutil
            shutil.copy(wav_file, audio_path)

        return audio_path

    def ingest_url(self, url: str, refresh=False):
        url_hash = self._get_url_hash(url)

        if not refresh and url_hash in self.cache:
            print("✅ Loaded from cache")
            self.db = Chroma(persist_directory=self.cache[url_hash]["db_path"], embedding_function=HuggingFaceEmbeddings(model_name="BAAI/bge-small-en"))
            self.qa_chain = RetrievalQA.from_chain_type(
                llm=ChatGoogleGenerativeAI(model="models/gemini-1.5-flash", temperature=0.2),
                retriever=self.db.as_retriever(),
                return_source_documents=True
            )
            return

        audio_path = self._download_and_convert(url)

        transcriber = aai.Transcriber()
        transcript = transcriber.transcribe(audio_path, config=aai.TranscriptionConfig(speaker_labels=True))

        utterances = transcript.utterances
        documents = []

        for utt in utterances:
            metadata = {
                "speaker": utt.speaker,
                "start": self.seconds_to_timestamp(utt.start),
                "end": self.seconds_to_timestamp(utt.end),
                "audio_file": url,
            }
            documents.append(Document(page_content=utt.text, metadata=metadata))

        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        chunks = splitter.split_documents(documents)

        embedder = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en")
        persist_dir = os.path.join("chroma_store", url_hash)
        os.makedirs(persist_dir, exist_ok=True)
        self.db = Chroma.from_documents(chunks, embedder, persist_directory=persist_dir)
        self.db.persist()

        self.cache[url_hash] = {"db_path": persist_dir}
        self._save_cache()

        self.qa_chain = RetrievalQA.from_chain_type(
            llm=ChatGoogleGenerativeAI(model="models/gemini-1.5-flash", temperature=0.2),
            retriever=self.db.as_retriever(),
            return_source_documents=True
        )

    def ask(self, query: str):
        if not hasattr(self, 'qa_chain'):
            return {"error": "No podcast/audio ingested yet"}

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
