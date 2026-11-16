# Sentiment Analysis

A web application that analyzes text and classifies its sentiment as **positive**, **negative**, or **neutral** using Python-based Natural Language Processing (NLP) and machine learning.

**Live demo:** [https://sentiment-analysis-pe9b.onrender.com/](https://sentiment-analysis-pe9b.onrender.com/)

> The demo is hosted on Render's free tier. If the app has been idle, the first load can take up to a minute while the server wakes up.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Deployment](#deployment)
- [Limitations](#limitations)
- [Future Improvements](#future-improvements)
- [Author](#author)
- [License](#license)

---

## Overview

Sentiment analysis is the task of identifying the emotional tone behind a piece of text. It is widely used to understand customer feedback, product reviews, social media posts, and survey responses at scale.

This project takes raw text as input, cleans and prepares it using standard NLP preprocessing, and passes it through a trained classification model to predict its sentiment. The result is delivered through a simple web interface so the model can be tested in real time without any setup.

## Features

- Classifies user-entered text as positive, negative, or neutral
- Text preprocessing pipeline (cleaning, tokenization, stop-word removal, normalization)
- Feature extraction from text for model input
- Machine learning model trained on labeled text data
- Clean, responsive web interface for instant predictions
- Deployed and publicly accessible online

## How It Works

1. **Input:** The user enters a piece of text in the web interface.
2. **Preprocessing:** The text is lowercased, stripped of punctuation, URLs, and special characters, tokenized into words, and filtered to remove common stop words. Words are then normalized (stemming or lemmatization) so that variations of the same word are treated alike.
3. **Feature extraction:** The cleaned text is converted into numerical features that a machine learning model can process.
4. **Prediction:** The trained classifier predicts the sentiment label for the text.
5. **Output:** The predicted sentiment is displayed back to the user.

## Tech Stack

| Area | Tools |
| --- | --- |
| Language | Python |
| NLP | GRU(RNN) |
| Machine learning | Scikit-learn |
| Data handling | Pandas, NumPy |
| Web framework | Flask |
| Hosting | Render |

## Getting Started

### Prerequisites

- Python 3.8 or higher
- pip
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AOISYNM/sentiment-analysis.git
   cd sentiment-analysis
   ```

2. Create and activate a virtual environment (recommended):

   ```bash
   python -m venv venv

   # macOS / Linux
   source venv/bin/activate

   # Windows
   venv\Scripts\activate
   ```

3. Install the dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Download the required NLTK data:

   ```bash
   python -m nltk.downloader stopwords punkt wordnet
   ```

### Running Locally

```bash
python app.py
```

Then open `http://127.0.0.1:5000` in your browser.

## Usage

1. Open the app (locally or via the [live demo](https://sentiment-analysis-pe9b.onrender.com/)).
2. Type or paste a sentence, review, or short paragraph into the input box.
3. Submit the text to see the predicted sentiment.

**Example**

| Input | Predicted sentiment |
| --- | --- |
| "The product quality is excellent and delivery was fast." | Positive |
| "The service was terrible and I want a refund." | Negative |
| "The package arrived on Tuesday." | Neutral |

## Deployment

The application is deployed on [Render](https://render.com) as a web service.

To deploy your own copy:

1. Fork this repository.
2. Create a new **Web Service** on Render and connect your fork.
3. Set the build command to:

   ```bash
   pip install -r requirements.txt
   ```

4. Set the start command to:

   ```bash
   gunicorn app:app
   ```

5. Deploy. Render will build and serve the app at a public URL.

## Limitations

- Predictions depend on the quality and size of the data the model was trained on.
- Sarcasm, irony, slang, and mixed sentiments within one text can be misclassified.
- The model is designed for English text.
- Very short or context-dependent inputs may produce less reliable results.

## Future Improvements

- Add confidence scores for each prediction
- Support batch analysis through CSV upload
- Compare multiple models and report evaluation metrics (accuracy, precision, recall, F1-score)
- Experiment with transformer-based models for higher accuracy
- Add support for additional languages

## Author

**AOISYNM**
GitHub: [@AOISYNM](https://github.com/AOISYNM)

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
