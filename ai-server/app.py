from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
import pickle
# KITA UBAH IMPORT-NYA JADI NATIVE KERAS DI SINI
from keras.models import load_model
from keras.preprocessing.sequence import pad_sequences
import traceback

app = FastAPI(title="EmpathAI Emotion Engine")

# --- INITIALIZE GLOBAL VARIABLES ---
model = None
tokenizer = None
EMOTIONS = ['marah', 'netral', 'sedih', 'senang', 'stres']

# --- 1. MEMUAT MODEL KERAS ---
try:
    print("⏳ [1/2] Mencoba memuat Model Keras...")
    model = load_model('best_model.keras')
    print("🎯 Model Keras berhasil dimuat!")
except Exception as e:
    print(f"\n❌ GAGAL MEMUAT MODEL: {e}")
    traceback.print_exc()

# --- 2. MEMUAT TOKENIZER ---
try:
    print("⏳ [2/2] Mencoba memuat Tokenizer...")
    with open('tokenizer.pkl', 'rb') as handle:
        tokenizer = pickle.load(handle)
    print("🎯 Tokenizer berhasil dimuat!")
except Exception as e:
    print(f"\n❌ GAGAL MEMUAT TOKENIZER: {e}")
    traceback.print_exc()

# --- VALIDASI KESIAPAN SISTEM ---
if model is not None and tokenizer is not None:
    print("🚀🚀 SEMUA SISTEM SIAP! EmpathAI Emotion Model siap bertugas! 🚀🚀")
else:
    print("⚠️ PERINGATAN: Ada komponen AI yang gagal dimuat. Silakan periksa log di atas.")

class ChatRequest(BaseModel):
    text: str

# --- 3. ENDPOINT PREDIKSI ---
@app.post("/predict")
async def predict_emotion(request: ChatRequest):
    if model is None or tokenizer is None:
        raise HTTPException(
            status_code=503, 
            detail="AI Engine Error: Model atau Tokenizer belum berhasil dimuat sempurna di server."
        )
        
    try:
        print(f"\n📩 [DEBUG] Pesan Masuk: '{request.text}'")
        
        seq = tokenizer.texts_to_sequences([request.text])
        print(f"🔢 [DEBUG] Hasil Tokenizer (Angka): {seq}")
        
        padded = pad_sequences(seq, maxlen=100, padding='post', truncating='post')
        
        pred = model.predict(padded, verbose=0)
        
        formatted_pred = [f"{p:.4f}" for p in pred[0]]
        print(f"📊 [DEBUG] Skor Probabilitas: {formatted_pred}")
        
        class_index = np.argmax(pred, axis=1)[0]
        print(f"🎯 [DEBUG] Index Terpilih: {class_index}")
        
        emotion = EMOTIONS[class_index]
        print(f"🧠 [DEBUG] Keputusan Final: {emotion}")
        
        return {"emotion": emotion}
    
    except Exception as e:
        print(f"❌ Error di predict: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=7860, reload=True)