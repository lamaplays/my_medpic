import cv2
import pytesseract

def process_image(image_path):
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    denoised = cv2.fastNlMeansDenoising(gray, None, 30, 7, 21)

    thresholded = cv2.adaptiveThreshold(
        denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY, 11, 2
    )

    height, width = thresholded.shape
    new_width = 1000
    aspect_ratio = width / height
    new_height = int(new_width / aspect_ratio)
    resized = cv2.resize(thresholded, (new_width, new_height))

    config = '--oem 3 --psm 6'
    text = pytesseract.image_to_string(resized, config=config, lang='eng')
    return text
# Add this to the same file (ocr.py)
import re

def extract_medication_info(text):
    drug_name_pattern = r"\b[A-Za-z]+(?:\s[A-Za-z]+)*\b"
    dosage_pattern = r"\b\d+\s?(mg|ml|g|tablet|capsule|drops\day)\b"
    instructions_pattern = r"\b(take|apply|inject|consume|dose)\b.*\b(every|twice|daily|hour|as needed|week)\b"

    return {
        "Drug Names": re.findall(drug_name_pattern, text),
        "Dosages": re.findall(dosage_pattern, text),
        "Instructions": re.findall(instructions_pattern, text)
    }
