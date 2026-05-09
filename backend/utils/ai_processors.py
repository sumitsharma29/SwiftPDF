import os
from typing import List
import fitz

class AIProcessors:
    """
    Simplified processor for non-AI workflows.
    Hugging Face and Transformers removed to ensure high-performance backend startup.
    """
    def __init__(self):
        pass

    def summarize_text(self, text: str) -> str:
        return "Intelligence core disabled. Use the Visual Editor for manual modifications."

    def answer_question(self, context: str, question: str) -> str:
        return "Intelligence core disabled."

    @staticmethod
    def extract_text_for_ai(file_path: str, max_chars: int = 10000) -> str:
        try:
            doc = fitz.open(file_path)
            text = ""
            for page in doc:
                text += page.get_text()
                if len(text) > max_chars:
                    break
            doc.close()
            return text[:max_chars]
        except Exception:
            return ""

ai_processor = AIProcessors()
