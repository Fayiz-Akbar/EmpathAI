import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

# ============================================
# CONFIGURASI HALAMAN STREAMLIT
# ============================================
st.set_page_config(
    page_title="EmpathAI - EDA Dashboard",
    page_icon="📊",
    layout="wide"
)

# Setup Tema Grafik
sns.set_theme(style="whitegrid")

# ============================================
# FUNGSI LOAD DATA
# ============================================
@st.cache_data
def load_data():
    jalur_data = os.path.join("data", "dataset_emosi_balanced.csv")
    if os.path.exists(jalur_data):
        return pd.read_csv(jalur_data)
    return None

df = load_data()

# ============================================
# JIKA DATA TIDAK DITEMUKAN
# ============================================
if df is None:
    st.error("Pastikan file sudah ada di folder proyek.")
    st.stop()

# ============================================
# HEADER UTAMA
# ============================================
st.title("Dashboard EmpathAI: Analisis Ulasan dan Emosi Pengguna")
st.caption("Eksplorasi Distribusi Emosi dan Karakteristik Teks Ulasan Pengguna")
st.markdown("---")

# ============================================
# SIDEBAR / FILTER INTERAKTIF
# ============================================
st.sidebar.header("Panel Kontrol Interaktif")
st.sidebar.write("Filter untuk mengubah tampilan grafik secara real-time:")

# Filter 1: Pilih Aplikasi (Bisa pilih 'Semua' atau aplikasi tertentu)
daftar_app = ["Semua Aplikasi"] + list(df["app"].unique())
pilihan_app = st.sidebar.selectbox("1. Pilih Sumber Aplikasi:", daftar_app)

# Filter 2: Pilih Kategori Emosi (Bisa pilih lebih dari satu)
daftar_emosi = list(df["label"].unique())
pilihan_emosi = st.sidebar.multiselect("2. Filter Kategori Emosi:", daftar_emosi, default=daftar_emosi)

# Filter 3: Tampilkan/Sembunyikan Outlier pada Boxplot
tampilkan_outlier = st.sidebar.checkbox("Tampilkan Outlier pada Grafik Boxplot", value=False)

# ============================================
# PROSES FILTER DATA BERDASARKAN INPUT USER
# ============================================
df_filtered = df[df["label"].isin(pilihan_emosi)]

if pilihan_app != "Semua Aplikasi":
    df_filtered = df_filtered[df_filtered["app"] == pilihan_app]

# Jika hasil filter menghasilkan data kosong
if df_filtered.empty:
    st.warning("Tidak ada data yang cocok dengan kombinasi filter yang Anda pilih. Silakan sesuaikan kembali filter Anda.")
    st.stop()

# ============================================
# METRIK RINGKASAN DINAMIS
# ============================================
col1, col2, col3, col4 = st.columns(4)
with col1:
    st.metric("Total Data Terfilter", f"{len(df_filtered)} Baris")
with col2:
    st.metric("Rata-rata Panjang Karakter", f"{int(df_filtered['char_length'].mean())} Huruf")
with col3:
    st.metric("Rata-rata Jumlah Kata", f"{int(df_filtered['word_count'].mean())} Kata")
with col4:
    st.metric("Aplikasi Aktif", "1" if pilihan_app != "Semua Aplikasi" else f"{df_filtered['app'].nunique()}")

st.markdown("---")

# ============================================
# VISUALISASI 1: DISTRIBUSI EMOSI
# ============================================
st.subheader("1. Distribusi dan Perbandingan Kelas Emosi")

col_graph1, col_text1 = st.columns([2, 1])

with col_graph1:
    fig1, ax1 = plt.subplots(figsize=(10, 4.5))
    
    if pilihan_app == "Semua Aplikasi":
        # Jika semua aplikasi, tampilkan perbandingan antar-aplikasi menggunakan 'hue'
        sns.countplot(data=df_filtered, x='app', hue='label', palette='Set2', ax=ax1)
        ax1.set_xlabel("Nama Platform / Aplikasi")
    else:
        # Jika satu aplikasi spesifik, tampilkan bar chart emosi tunggal yang lebih jelas
        sns.countplot(data=df_filtered, x='label', order=df_filtered['label'].value_counts().index, palette='magma', ax=ax1)
        ax1.set_xlabel("Kategori Emosi")
        
    ax1.set_ylabel("Jumlah Ulasan")
    st.pyplot(fig1)

with col_text1:
    st.markdown("#### **Tabel Distribusi Frekuensi**")
    st.write("Jumlah persis data yang muncul pada grafik di samping:")
    
    # Membuat ringkasan tabel frekuensi
    if pilihan_app == "Semua Aplikasi":
        tabel_frekuensi = df_filtered.groupby(['app', 'label']).size().unstack(fill_value=0)
    else:
        tabel_frekuensi = df_filtered['label'].value_counts().to_frame(name='Jumlah Ulasan')
        
    st.dataframe(tabel_frekuensi, use_container_width=True)

st.markdown("---")

# ============================================
# VISUALISASI 2: ANALISIS PANJANG TEKS (BOXPLOT)
# ============================================
st.subheader("2. Analisis Karakteristik Teks Ulasan")
st.write("Melihat sebaran panjang kata pengguna berdasarkan emosi yang mereka rasakan.")

fig2, ax2 = plt.subplots(figsize=(11, 4))
sns.boxplot(
    data=df_filtered, 
    x='label', 
    y='word_count', 
    palette='pastel', 
    showfliers=tampilkan_outlier, 
    ax=ax2
)
ax2.set_title(f"Sebaran Panjang Kata pada {pilihan_app}", fontsize=11, fontweight='bold')
ax2.set_xlabel("Kategori Emosi")
ax2.set_ylabel("Jumlah Kata per Ulasan")
st.pyplot(fig2)

# Kesimpulan EDA otomatis di bawah grafik
st.markdown("#### **Kesimpulan Analisis Data (Insight):**")
emosi_terpanjang = df_filtered.groupby('label')['word_count'].mean().idxmax()
rata_kata_tertinggi = df_filtered.groupby('label')['word_count'].mean().max()

st.info(
    f"💡 Pada data terfilter saat ini, pengguna yang mengekspresikan emosi **{emosi_terpanjang}** cenderung menulis "
    f"ulasan yang paling panjang dengan rata-rata **{int(rata_kata_tertinggi)} kata** per ulasan. Ini menunjukkan bahwa "
    f"tingkat ekspresi tekstual dipengaruhi secara langsung oleh kondisi emosional pengguna platform."
)