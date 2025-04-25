from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from PIL import Image
from rapidfuzz import process, fuzz
import pandas as pd
import re
import io
import base64
import numpy as np
import cv2
from ultralytics import YOLO
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from huggingface_hub import hf_hub_download

# --- Initialize Flask App ---
app = Flask(__name__)
CORS(app)

# --- Load Models Once at Startup ---
print("Loading models...")
processor = TrOCRProcessor.from_pretrained('microsoft/trocr-large-handwritten')
model = VisionEncoderDecoderModel.from_pretrained('microsoft/trocr-large-handwritten')
model_path = hf_hub_download(repo_id="Riksarkivet/yolov9-lines-within-regions-1", filename="model.pt")
yolo_model = YOLO(model_path)
print("Models loaded successfully.")

# --- Load CSV for Drug Matching ---
df = pd.read_csv('./final.csv')
words = ["tab", "mg", "g"]

# --- Utility Functions ---
def clean_text(text):
    text = re.sub(r"[\"\'\[\]\(\)\{\}]", '', text)
    text = re.sub(r"[^a-zA-Z0-9\-\/.%\s]", '', text)
    text = re.sub(r"-", ' ', text)
    text = text.replace('.', '')
    text = re.sub(r'\s+', ' ', text)
    tokens = text.strip().lower().split()
    filtered = [
        token for token in tokens
        if token in words or len(token) > 3 or token.isdigit()
    ]
    return ' '.join(filtered)

def extract_drugs_and_dosages(text):
    cleaned_text = clean_text(text)
    words_to_match = cleaned_text.split()
    results = []
    i = 0

    while i < len(words_to_match):
        word = words_to_match[i]

        if word.isdigit():
            i += 1
            continue

        matched, score, _ = process.extractOne(word, df['Extracted_Text'], scorer=fuzz.ratio)
        if score >= 70:
            entry = {"drug": matched}
            if i + 1 < len(words_to_match) and words_to_match[i + 1].isdigit():
                entry["dosage"] = words_to_match[i + 1]
                i += 1
            results.append(entry)

        i += 1

    return {"results": results}

def segment_text_lines(image):
    image_np = np.array(image.convert('RGB')) if not isinstance(image, np.ndarray) else image
    results = yolo_model(image_np)
    boxes = results[0].boxes.xyxy.cpu().numpy()
    boxes = sorted(boxes, key=lambda b: b[1])
    image_with_boxes = image_np.copy()
    for box in boxes:
        x_min, y_min, x_max, y_max = map(int, box)
        cv2.rectangle(image_with_boxes, (x_min, y_min), (x_max, y_max), (0, 255, 0), 2)
    return Image.fromarray(image_with_boxes)

def segment_extract_text(image):
    image_np = np.array(image.convert('RGB')) if not isinstance(image, np.ndarray) else image
    results = yolo_model(image_np)
    boxes = results[0].boxes.xyxy.cpu().numpy()
    boxes = sorted(boxes, key=lambda b: b[1])
    extracted_text = []
    image_with_boxes = image_np.copy()

    for box in boxes:
        x_min, y_min, x_max, y_max = map(int, box)
        line_crop = image_np[y_min:y_max, x_min:x_max]
        pil_crop = Image.fromarray(line_crop)
        pixel_values = processor(pil_crop, return_tensors="pt").pixel_values
        generated_ids = model.generate(pixel_values)
        text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
        extracted_text.append(text)
        cv2.rectangle(image_with_boxes, (x_min, y_min), (x_max, y_max), (0, 255, 0), 2)

    full_text = " ".join(extracted_text)
    return full_text, Image.fromarray(image_with_boxes)

# --- Routes ---
@app.route('/process/process_text', methods=['POST'])
def process_text():
    data = request.get_json()
    text = data.get('text', '')
    if not text:
        return jsonify({"error": "No text provided"}), 400
    result = extract_drugs_and_dosages(text)
    return jsonify(result)

@app.route('/process/segmentation', methods=['POST'])
def process_segmentation():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    img = Image.open(request.files['image'].stream)
    segmented_img = segment_text_lines(img)
    output = io.BytesIO()
    segmented_img.save(output, format='JPEG')
    output.seek(0)
    return send_file(output, mimetype='image/jpeg')

@app.route('/process/extract_text', methods=['POST'])
def extract_text():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    img = Image.open(request.files['image'].stream)
    text, segmented_img = segment_extract_text(img)
    output = io.BytesIO()
    segmented_img.save(output, format='JPEG')
    output.seek(0)
    img_base64 = base64.b64encode(output.getvalue()).decode('utf-8')
    return jsonify({'text': text, 'segmented_image': img_base64})

# --- Run Server ---
if __name__ == '__main__':
    app.run(debug=True)
