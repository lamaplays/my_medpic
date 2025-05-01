import cv2
import pytesseract
import json
from sentence_transformers import SentenceTransformer
import chromadb


# Tesseract setup
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Load SFDA brands
def load_sfda(json_path="sfda_cleaned.json"):
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return set(m["brand"].strip().lower() for m in data if m.get("brand"))

# Extract text from image
def process_image(image_path):
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    denoised = cv2.fastNlMeansDenoising(gray, None, 30, 7, 21)
    thresh = cv2.adaptiveThreshold(denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                   cv2.THRESH_BINARY, 11, 2)
    h, w = thresh.shape
    resized = cv2.resize(thresh, (1000, int(1000 * h / w)))
    config = '--oem 3 --psm 6'
    return pytesseract.image_to_string(resized, config=config, lang='eng').strip()

# Query ChromaDB with extracted text
def query_chromadb(query_text, sfda_brands, chroma_path="chroma_store"):
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
    client = chromadb.PersistentClient(path=chroma_path)
    collection = client.get_collection("drug_info")
    embedding = embedding_model.encode(query_text)
    results = collection.query(query_embeddings=[embedding], n_results=3, include=["metadatas", "documents", "distances"])

    hits = []
    for i, (doc, meta, distance) in enumerate(zip(results["documents"][0], results["metadatas"][0], results["distances"][0])):
        name = meta.get("drug_name", "").lower()
        sfda_flag = "Yes" if name in sfda_brands else "No"

        hits.append({
            "drug_name": name.title(),
            "medical_condition": meta.get("medical_condition", ""),
            "medical_condition_description": meta.get("medical_condition_description", ""),
            "generic_name": meta.get("generic_name", ""),
            "drug_classes": meta.get("drug_classes", ""),
            "pregnancy_category": meta.get("pregnancy_category", ""),
            "rx_otc": meta.get("rx_otc", ""),
            "activity": meta.get("activity", ""),
            "SFDA_approved": sfda_flag,
            "relevance_score": round(1 - distance, 2),  # optional for frontend display
            "drug_link": meta.get("drug_link", "")
        })
    return hits

