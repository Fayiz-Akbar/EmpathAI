from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
import pickle
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
import traceback

app = FastAPI(title="EmpathAI Emotion Engine")

# --- 1. Load Model & Tokenizer (Label Encoder diganti pakai Array) ---
try:
    print("⏳ [1/2] Mencoba memuat Model Keras...")
    model = load_model('best_model.keras')
    print("✅ Model Keras berhasil dimuat!")
    
    print("⏳ [2/2] Mencoba memuat Tokenizer...")
    with open('tokenizer.pkl', 'rb') as handle:
        tokenizer = pickle.load(handle)
    print("✅ Tokenizer berhasil dimuat!")
    
    # KITA BYPASS LABEL ENCODER PKL DENGAN HARDCODE ARRAY (Urut Abjad)
    # 0=marah, 1=netral, 2=sedih, 3=senang, 4=stres
    EMOTIONS = ['marah', 'netral', 'sedih', 'senang', 'stres']
        
    print("🚀🚀 SEMUA SISTEM SIAP! EmpathAI Emotion Model siap bertugas! 🚀🚀")
except Exception as e:
    print(f"\n❌ GAGAL: {e}")
    traceback.print_exc()

class ChatRequest(BaseModel):
    text: str

# --- 2. Endpoint Prediksi ---
@app.post("/predict")
async def predict_emotion(request: ChatRequest):
    try:
        print(f"\n📩 [DEBUG] Pesan Masuk: '{request.text}'")
        
        # 1. Ubah teks jadi angka
        seq = tokenizer.texts_to_sequences([request.text])
        print(f"🔢 [DEBUG] Hasil Tokenizer (Angka): {seq}")
        
        # Kita paksa nol-nya ada di belakang, sama seperti saat training di Colab
        padded = pad_sequences(seq, maxlen=100, padding='post', truncating='post')
        
        # 2. Tebak pakai model AI
        pred = model.predict(padded, verbose=0)
        
        # Format skor agar mudah dibaca (tidak pakai notasi ilmiah e-05)
        formatted_pred = [f"{p:.4f}" for p in pred[0]]
        print(f"📊 [DEBUG] Skor Probabilitas: {formatted_pred}")
        
        class_index = np.argmax(pred, axis=1)[0]
        print(f"🎯 [DEBUG] Index Terpilih: {class_index}")
        
        # 3. Terjemahkan angka hasil jadi kata pakai array kita
        emotion = EMOTIONS[class_index]
        print(f"🧠 [DEBUG] Keputusan Final: {emotion}")
        
        return {"emotion": emotion}
    
    except Exception as e:
        print(f"❌ Error di predict: {e}")
        raise HTTPException(status_code=500, detail=str(e))