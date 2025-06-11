from flask import Flask, request, jsonify, send_file, send_from_directory
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
from gtts import gTTS  # Replace pyttsx3 with gTTS
import uuid 
import os
import threading

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

# --- Audio Setup ---
AUDIO_FOLDER = "audio"
os.makedirs(AUDIO_FOLDER, exist_ok=True)

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

def generate_audio_background(text, filename):
    """Generate audio file using gTTS in a separate thread"""
    def run():
        try:
            path = os.path.join(AUDIO_FOLDER, filename)
            # Check if the file already exists to avoid regeneration
            if not os.path.exists(path):
                tts = gTTS(text=text, lang='en', slow=False)
                tts.save(path)
                print(f"Audio file generated successfully: {path}")
        except Exception as e:
            print(f"Error generating audio: {e}")
    
    thread = threading.Thread(target=run)
    thread.daemon = True  # Make thread daemon so it doesn't block app shutdown
    thread.start()
    return thread

def extract_drugs_and_dosages(text):
    cleaned_text = clean_text(text)
    print(f"Cleaned text: {cleaned_text}")
    words = cleaned_text.split()
    results = []
    i = 0
    threads = []  # Keep track of all audio generation threads
    
    while i < len(words):
        word = words[i]
        if word.isdigit():
            i += 1
            continue
            
        matched, score, _ = process.extractOne(word, df['Extracted_Text'], scorer=fuzz.ratio)
        if score >= 70:
            entry = {"drug": matched}
            
            # Generate sanitized filename
            safe_name = re.sub(r'[^a-zA-Z0-9]', '_', matched.lower())
            filename = f"{safe_name}.mp3"
            
            # Start audio generation in background
            thread = generate_audio_background(matched, filename)
            threads.append(thread)
            
            entry["audio"] = f"/audio/{filename}"
            
            if i + 1 < len(words) and words[i + 1].isdigit():
                entry["dosage"] = words[i + 1]
                i += 1
                
            print(entry)
            results.append(entry)
        i += 1
    
    # Optional: Wait for all audio generation to complete
    # Uncomment if you want to ensure all audio is generated before responding
    # for thread in threads:
    #     thread.join()
    
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


def segment_extract_text_boxes(image):
    image_np = np.array(image.convert('RGB')) if not isinstance(image, np.ndarray) else image
    results = yolo_model(image_np)
    boxes = results[0].boxes.xyxy.cpu().numpy()
    boxes = sorted(boxes, key=lambda b: b[1])  # Sort by y-coordinate
    
    extracted_text = []
    cropped_images = []
    image_with_boxes = image_np.copy()
    
    for box in boxes:
        x_min, y_min, x_max, y_max = map(int, box)
        
        # Crop and store individual images
        line_crop = image_np[y_min:y_max, x_min:x_max]
        cropped_images.append(Image.fromarray(line_crop))
        
        # Process text recognition
        pil_crop = Image.fromarray(line_crop)
        pixel_values = processor(pil_crop, return_tensors="pt").pixel_values
        generated_ids = model.generate(pixel_values)
        text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
        extracted_text.append(text)
        
        # Draw boxes on visualization image
        cv2.rectangle(image_with_boxes, (x_min, y_min), (x_max, y_max), (0, 255, 0), 2)
    
    full_text = " ".join(extracted_text)
    return full_text, cropped_images, Image.fromarray(image_with_boxes)
# --- Routes ---
@app.route('/audio/<filename>')
def serve_audio(filename):
    return send_from_directory(AUDIO_FOLDER, filename)

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
    
    # Modified to return full_text, cropped_images, and visualization image
    full_text, cropped_images, visualization_img = segment_extract_text_boxes(img)
    
    # Prepare the visualization image
    vis_output = io.BytesIO()
    visualization_img.save(vis_output, format='JPEG')
    vis_output.seek(0)
    vis_base64 = base64.b64encode(vis_output.getvalue()).decode('utf-8')
    
    # Prepare all cropped images
    cropped_images_base64 = []
    for crop in cropped_images:
        output = io.BytesIO()
        crop.save(output, format='JPEG')
        output.seek(0)
        cropped_images_base64.append(base64.b64encode(output.getvalue()).decode('utf-8'))
    
    return jsonify({
        'full_text': full_text,
        'segmented_image': vis_base64,  # Image with boxes visualization
        'cropped_images': cropped_images_base64,  # Array of individual crops
        'count': len(cropped_images)  # Number of detected boxes
    })
# --- Run Server ---
if __name__ == '__main__':
    app.run(debug=True)