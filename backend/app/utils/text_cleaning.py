import re
import string

def clean_text(text: str) -> str:
    """Cleans and normalizes text for processing."""
    if not text:
        return ""
    # Convert to lowercase
    text = text.lower()
    # Remove punctuation (keep standard ASCII characters)
    text = re.sub(f"[{re.escape(string.punctuation)}]", " ", text)
    # Remove extra whitespaces
    text = re.sub(r"\s+", " ", text).strip()
    return text
