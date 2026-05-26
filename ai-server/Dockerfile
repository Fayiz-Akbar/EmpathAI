FROM python:3.10

WORKDIR /code

# 1. Salin dan install dependencies
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# 2. Atur user dengan UID 1000 (Aturan wajib Hugging Face)
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR $HOME/app

# 3. Salin semua file model dan kode python
COPY --chown=user . $HOME/app

# 4. Jalankan FastAPI di port wajib 7860
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]