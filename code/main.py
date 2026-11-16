import logging
import os

# Silence TensorFlow's noisy startup logs (must be set before importing TF)
os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")

import pickle
import re
from contextlib import asynccontextmanager
from pathlib import Path

import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("emotion-api")

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
# Resolve paths relative to this file so it works no matter where uvicorn starts
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "BiGRU_Model.keras"
TOKENIZER_PATH = BASE_DIR / "tokenizer.pkl"

MAX_SEQUENCE_LENGTH = 50

# Order must match the label encoding used during training
EMOTION_LABELS = ["sadness", "joy", "love", "anger", "fear", "surprise"]

EMOTION_EMOJIS = {
    "sadness": "😢",
    "joy": "😄",
    "love": "❤️",
    "anger": "😠",
    "fear": "😨",
    "surprise": "😲",
}

# Comma-separated list, e.g. "https://my-frontend.onrender.com,http://localhost:5173"
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
    ).split(",")
    if origin.strip()
]


# ---------------------------------------------------------------------------
# Preprocessing (must match what you did at training time)
# ---------------------------------------------------------------------------
def preprocess_text(text: str) -> str:
    text = text.lower()
    text = text.replace("'", "")
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------
class TextInput(BaseModel):
    text: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="The sentence to analyze",
        json_schema_extra={"example": "I feel so happy and excited"},
    )


class PredictionResponse(BaseModel):
    text: str
    predicted_emotion: str
    emoji: str
    confidence: float
    all_probabilities: dict[str, float]


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool


# ---------------------------------------------------------------------------
# App lifecycle: load the model once at startup
# ---------------------------------------------------------------------------
resources: dict = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Loading model and tokenizer...")
    # compile=False: we only run inference, so skip optimizer/loss restoration
    model = load_model(MODEL_PATH, compile=False)
    with open(TOKENIZER_PATH, "rb") as f:
        tokenizer = pickle.load(f)  # only ever load pickles you created yourself

    # Warm-up so the first real request isn't slow
    model(np.zeros((1, MAX_SEQUENCE_LENGTH), dtype="int32"), training=False)

    resources["model"] = model
    resources["tokenizer"] = tokenizer
    logger.info("Model and tokenizer loaded.")

    yield  # server runs here

    resources.clear()


app = FastAPI(title="Emotion Detection API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/")
def root():
    return {"message": "Emotion Detection API is running. See /docs for usage."}


@app.get("/health", response_model=HealthResponse)
def health_check():
    loaded = "model" in resources and "tokenizer" in resources
    return HealthResponse(status="Server is running", model_loaded=loaded)


# Plain `def` (not `async def`): FastAPI runs it in a threadpool, so the
# blocking model call doesn't freeze the event loop.
@app.post("/predict", response_model=PredictionResponse)
def predict_emotion(payload: TextInput):
    """
    1. Clean the input sentence.
    2. Convert words to integers with the tokenizer.
    3. Pad/truncate to a fixed length.
    4. Run the BiGRU model.
    5. Return the top emotion plus the full probability breakdown.
    """
    model = resources.get("model")
    tokenizer = resources.get("tokenizer")

    if model is None or tokenizer is None:
        raise HTTPException(
            status_code=503, detail="Model is not loaded yet. Please try again later."
        )

    cleaned_text = preprocess_text(payload.text)
    if not cleaned_text:
        raise HTTPException(
            status_code=422,
            detail="Text must contain at least one letter or number.",
        )

    sequence = tokenizer.texts_to_sequences([cleaned_text])
    padded = pad_sequences(
        sequence, maxlen=MAX_SEQUENCE_LENGTH, padding="post", truncating="post"
    )

    # Calling the model directly is faster than .predict() for a single sample
    probabilities = model(padded, training=False).numpy()[0]

    top_index = int(np.argmax(probabilities))
    top_label = EMOTION_LABELS[top_index]

    return PredictionResponse(
        text=payload.text,
        predicted_emotion=top_label,
        emoji=EMOTION_EMOJIS[top_label],
        confidence=float(probabilities[top_index]),
        all_probabilities={
            label: float(p) for label, p in zip(EMOTION_LABELS, probabilities)
        },
    )