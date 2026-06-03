<div align="center">

# 🧠 EmpathAI

**Asisten Virtual Kesehatan Mental 24/7 dengan Empati AI & "Strict Guardrailing"**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](#)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](#)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](#)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white)](#)

</div>

---

## 📖 Daftar Isi
- [Deskripsi Proyek](#-deskripsi-proyek)
- [Arsitektur AI (Hybrid)](#-arsitektur-ai-hybrid)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Panduan Instalasi Lokal](#-panduan-instalasi-lokal-local-setup)

---

## 📌 Deskripsi Proyek

**EmpathAI** adalah aplikasi web asisten virtual kesehatan mental yang dirancang untuk memberikan dukungan psikologis awal yang tersedia secara 24/7. Proyek ini dibangun sebagai tugas akhir dari program pengembangan perangkat lunak (Coding Camp).

Salah satu inovasi utama dari EmpathAI adalah penerapan **"Strict Guardrailing"**, sebuah mekanisme keamanan AI yang memastikan chatbot akan secara tegas menolak dan membatasi percakapan untuk topik-topik di luar lingkup kesehatan mental dan *wellness*. Hal ini bertujuan untuk menjaga fokus layanan, memastikan keamanan pengguna, serta mencegah penyalahgunaan AI.

---

## 🧠 Arsitektur AI (Hybrid)

Sistem kecerdasan buatan pada EmpathAI mengadopsi pendekatan **Arsitektur Hybrid** yang canggih:
- **Deteksi Emosi Independen:** Menggunakan model klasifikasi emosi mandiri yang di-hosting di **Hugging Face Spaces**. Model ini berfungsi mendeteksi intensitas emosi (*Soft Labeling*) dari input pengguna.
- **Generasi Respons Dinamis:** Model klasifikasi dipadukan dengan **External LLM** (Large Language Model) untuk menghasilkan respons yang tidak hanya akurat secara konteks, tetapi juga dinamis dan penuh empati, disesuaikan dengan kondisi mental/emosi pengguna saat itu.

---

## ✨ Fitur Utama

- 💬 **Smart Chatbot Kesehatan Mental:** Asisten AI yang dirancang khusus untuk mendengarkan dan merespons keluh kesah pengguna dengan pendekatan psikologis dasar.
- 🎭 **Deteksi Intensitas Emosi:** AI mampu menganalisis teks pengguna untuk menentukan jenis dan intensitas emosi yang sedang dirasakan (contoh: kecemasan sedang, kesedihan mendalam).
- 📊 **Dashboard Visualisasi Mood Tracker Harian:** Pengguna dapat memantau perkembangan suasana hati (*mood*) mereka dari waktu ke waktu melalui grafik interaktif yang informatif.
- 🛡️ **Pemblokiran Otomatis (Out-of-Domain):** Fitur pencegahan di mana chatbot akan menolak secara halus pertanyaan atau diskusi yang tidak relevan dengan ranah kesehatan mental/psikologis.
- 🧘‍♀️ **Antarmuka yang Menenangkan (Calming UI):** Desain UI/UX yang menggunakan palet warna dan tipografi psikologis yang bertujuan memberikan efek tenang dan nyaman bagi pengguna.
- 🚑 **Integrasi Rujukan Layanan Darurat:** Fitur cerdas yang dapat mendeteksi intensi berbahaya (seperti *self-harm*) dan secara otomatis memberikan kontak rujukan darurat atau hotline profesional.
- 🔒 **Autentikasi Aman Berlapis:** Sistem keamanan akun pengguna (*JWT Authentication*), dilengkapi dengan fitur pemulihan akun (Forgot Password) yang ditenagai oleh **Nodemailer**.

---

## 💻 Tech Stack

Proyek ini dikembangkan menggunakan tumpukan teknologi modern skala industri:

**Frontend**
*   **Library:** React.js
*   **Styling:** Tailwind CSS
*   **Deployment:** Netlify

**Backend**
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Deployment:** Render / Railway

**AI & Machine Learning**
*   **Language:** Python
*   **Framework:** FastAPI
*   **Hosting Model:** Hugging Face Spaces

**Database & Layanan Lain**
*   **Database:** MongoDB
*   **Email Service:** Nodemailer

---

## 🚀 Panduan Instalasi Lokal (Local Setup)

Ikuti langkah-langkah di bawah ini untuk menjalankan EmpathAI di lingkungan pengembangan (komputer lokal) Anda.

### 📋 Prerequisites (Prasyarat)
Pastikan sistem Anda sudah terinstal perangkat lunak berikut:
- [Node.js](https://nodejs.org/en/) (Versi 16.x atau terbaru)
- [Git](https://git-scm.com/)
- [MongoDB](https://www.mongodb.com/) (Lokal atau menggunakan akun MongoDB Atlas)

### 1️⃣ Clone Repository
Buka terminal dan jalankan perintah berikut untuk mengunduh source code proyek:
```bash
git clone https://github.com/username-anda/EmpathAI.git
cd EmpathAI
```

### 2️⃣ Install Dependencies (Backend & Frontend)
Proyek ini menggunakan struktur folder terpisah untuk `client` (frontend) dan `server` (backend). Anda perlu menginstal dependensi pada kedua direktori tersebut.

**Untuk Backend:**
```bash
cd server
npm install
```

**Untuk Frontend:**
```bash
cd ../client
npm install
```

### 3️⃣ Pengaturan Environment Variables (.env)
Anda perlu mengatur *environment variables* untuk keamanan kredensial API, token rahasia, dan konfigurasi database.

**Di folder `server/`**, salin file `.env.example` menjadi `.env` (jika ada), atau buat file bernama `.env` dan tambahkan variabel berikut:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/empathai  # Atau URI dari MongoDB Atlas Anda
JWT_SECRET=rahasia_jwt_super_aman_anda
EMAIL_USER=email_anda@gmail.com               # Email untuk fitur Forgot Password (Nodemailer)
EMAIL_PASS=password_aplikasi_email_anda      # App Password untuk Nodemailer
AI_SERVICE_URL=http://localhost:8000         # URL FastAPI atau Hugging Face Endpoint
```

**Di folder `client/`**, buat file bernama `.env` dan tambahkan variabel yang menghubungkan aplikasi ke backend:
```env
VITE_API_URL=http://localhost:5000/api       # Jika menggunakan Vite, gunakan VITE_
# atau
REACT_APP_API_URL=http://localhost:5000/api  # Jika menggunakan Create React App (CRA)
```

### 4️⃣ Menjalankan Server & Aplikasi

Buka dua tab atau jendela terminal yang berbeda, satu untuk backend dan satu lagi untuk frontend.

**Terminal 1 (Menjalankan Backend Node.js/Express):**
```bash
cd server
npm run dev
# Server backend biasanya akan berjalan di http://localhost:5000
```

**Terminal 2 (Menjalankan Frontend React):**
```bash
cd client
npm run dev # atau `npm start` (sesuaikan dengan package.json)
# Aplikasi web klien bisa diakses di browser, biasanya http://localhost:5173 atau http://localhost:3000
```

Aplikasi **EmpathAI** kini dapat diakses dan digunakan di browser lokal Anda! 🎉

---

<div align="center">
Dibuat dengan ❤️ oleh Tim Pengembang EmpathAI.
</div>
