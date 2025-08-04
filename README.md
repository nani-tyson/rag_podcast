## 📌 Project Title: Podcast-based RAG System

A Retrieval-Augmented Generation (RAG) system that allows users to **submit podcast audio/video URLs (primarily from YouTube)**, automatically **transcribes the content**, **generates summaries**, and enables users to **ask questions** based on the transcribed material. The backend is built with **FastAPI**, and the frontend is built with **React.js + Vite + Tailwind CSS**.

---

## 🌟 Features

* 🔗 Accepts podcast video/audio **URLs** (e.g., YouTube)
* 🎧 Automatically **downloads and extracts audio**
* ✍️ Transcribes using **AssemblyAI**
* 🔍 Embeds and indexes using **HuggingFace embeddings**
* 💬 Enables **question answering** using **OpenAI** (via LangChain)
* 📄 Displays **multi-question summaries**
* 📀 Stores transcripts and embeddings locally to avoid redundant re-processing
* 🔁 Supports **re-ingestion with a refresh toggle**
* ⚡ Modern frontend with conditional UI (e.g., hides Q\&A until processing is complete)

---

## 🛠️ Tech Stack

| Layer          | Technology                     |
| -------------- | ------------------------------ |
| Frontend       | React.js + Vite + Tailwind CSS |
| Backend        | FastAPI, LangChain             |
| Transcription  | AssemblyAI                     |
| LLMs           | OpenAI, Gemini (optional)      |
| Embeddings     | HuggingFace                    |
| Storage        | Local file system + JSON/DB    |
| Video Handling | yt\_dlp + ffmpeg               |

---

## 📁 Project Structure

```
podcast-rag/
│
├── backend/
│   ├── main.py
│   ├── api.py
│   ├── rag_pipeline.py
│   ├── utils/ (yt_dlp, ffmpeg, audio conversion)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│
├── README.md
├── requirements.txt
└── build.sh (for Render deployment with ffmpeg support)
```

---

## 🧠 Assumptions

* 📹 **Only URLs from YouTube** are supported for now (future support for local uploads is optional).
* 🎹 Input URLs are assumed to be **podcast-style videos**, i.e., speech-heavy content (not music, gameplays, etc.).
* 🎞️ Supported formats: `.mp4`, `.m4a`, `.mp3`, and YouTube links with audio streams extractable by `yt_dlp`.
* ↺ If a URL has already been processed, the system uses cached transcripts & embeddings **unless** the "Refresh" option is enabled.
* ✍️ API key for **AssemblyAI** and **OpenAI** is required (stored in `.env` or config).

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/podcast-rag.git
cd podcast-rag
```

---

### 2. Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

Update `.env` with your API keys:

```env
OPENAI_API_KEY=your_openai_key
ASSEMBLYAI_API_KEY=your_assemblyai_key
```

Then run:

```bash
uvicorn main:create_app --reload --factory
```

---

### 3. Frontend Setup (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

---

### 4. Deployment (Optional - Render.com)

To support `ffmpeg` on Render:

* Include a `build.sh` that installs it.
* Use Docker or Render’s native runtime with custom build commands.

---

## 📸 Demo

📹 *\[Link to demo video if deploy fails]*
🔗 *\[Deployed site (Render)*: [https://rag-podcast.onrender.com](https://rag-podcast.onrender.com)]
🗃 *\[GitHub Repo]*: [https://github.com/your-username/podcast-rag](https://github.com/your-username/podcast-rag)

---

## 🤝 Acknowledgements

* [`yt_dlp`](https://github.com/yt-dlp/yt-dlp)
* [`AssemblyAI`](https://www.assemblyai.com/)
* [`LangChain`](https://github.com/langchain-ai/langchain)
* [`OpenAI`](https://openai.com/)
* [`HuggingFace`](https://huggingface.co/)
