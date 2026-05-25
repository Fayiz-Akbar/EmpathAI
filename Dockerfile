FROM node:20

WORKDIR /app

# 1. Salin package.json dari folder server untuk instalasi dependencies
COPY server/package*.json ./
RUN npm install

# 2. Salin seluruh isi kodingan dari folder server ke dalam container
COPY server/ .

# 3. Jalankan server di port 7860 (Hugging Face WAJIB menggunakan port 7860)
ENV PORT=7860
EXPOSE 7860

CMD ["node", "index.js"]