# LAPORAN AUDIT KOMPARATIF: CHAPTER 4 VS CHAPTER 1–3
**Penilai:** QA Lead + Art Director + Frontend Auditor  
**Proyek:** Ponpon Mania Interactive Comic  
**Subjek Audit:** Chapter 4 (*"A Birthday for Tifa"*) vs Chapter 1–3 (Baseline)  
**Metodologi:** Pengukuran terukur via Puppeteer (Desktop 1440x900 & Mobile 390x844), inspeksi asset manifest, dan analisis performa. Mode Read-Only.

---

## 1. VERDICT
**Chapter 4 secara visual dan naratif SETARA dengan Chapter 1–3 (bahkan lebih unggul dalam efek pencahayaan dan presisi rute speech bubble), namun secara teknikal LEBIH BURUK karena beban aset 6,4x lebih besar (97,88 MB vs 15,31 MB); berstatus LAYAK RILIS untuk deployment lokal/kado personal, tetapi MEMERLUKAN OPTIMASI ASET sebelum rilis publik bandwidth-sensitif.**

---

## 2. TABEL SKOR (Kategori A–E x Chapter 1–4)

Skala Skor: 0–10 (9–10: sebanding/unggul; 7–8: layak/cacat kecil; 5–6: di bawah baseline; <5: blocker).

| Kategori Evaluasi | Ch 1 (Stage) | Ch 2 (Bar) | Ch 3 (Alpaca) | **Baseline (Rata-rata 1–3)** | **Chapter 4 (Tifa)** | **Selisih (Ch 4 vs Base)** | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **A. Konsistensi Visual** | 9.5 | 9.0 | 9.0 | **9.17** | **8.5** | -0.67 | Layak (Cacat kecil lore/gaya) |
| **B. Speech Bubble** | 9.0 | 9.0 | 9.0 | **9.00** | **8.5** | -0.50 | Layak (Vektor akurat, font digital) |
| **C. Layout & Sinematografi** | 9.0 | 9.0 | 8.5 | **8.83** | **9.0** | **+0.17** | Unggul (Pacing emosional & grid solid) |
| **D. Naskah & Cerita** | 8.5 | 8.5 | 8.5 | **8.50** | **8.5** | 0.00 | Setara (Puitis, mandiri) |
| **E. Teknis & Performa** | 9.5 | 9.5 | 9.5 | **9.50** | **7.0** | **-2.50** | Di bawah baseline (Ukuran aset besar) |
| **SKOR RATA-RATA TOTAL** | **9.10** | **9.00** | **8.90** | **9.00** | **8.30** | **-0.70** | **LAYAK RILIS BERSYARAT** |

---

## 3. DAFTAR TEMUAN TERURUT KEPARAHAN

| ID | Lokasi | Deskripsi Masalah | Bukti Terukur (File) | Tingkat Keparahan | Keyakinan |
| :---: | :--- | :--- | :--- | :---: | :---: |
| **F-01** | `textures/chapters/4/` | **Beban Aset Sangat Berat Tanpa Kompresi GPU (Basis KTX)**: Total aset Ch 4 mencapai 97,88 MB (49 PNG uncompressed) vs rata-rata Ch 1–3 sebesar 15,31 MB. File latar mencapai 2,73 MB. | [audit_metrics.json](file:///d:/Project/HBD/TiffaHBD/audit_evidence/audit_metrics.json#L417-L430), [c4b1p2-background.png](file:///d:/Project/HBD/TiffaHBD/textures/chapters/4/c4b1p2-background.png) (2.73 MB) | **MAJOR** | Tinggi |
| **F-02** | `textures/chapters/4/text/` | **Tipografi Menggunakan Font Geometris Digital**: Teks balon Ch 4 menggunakan Google Font `Libre Franklin` (800/900) sans-serif, berbeda dari baseline Ch 1–3 yang menggunakan font *hand-lettered* komik berkarakter coretan tangan organik. | [sample_ch4_bubble.svg](file:///d:/Project/HBD/TiffaHBD/audit_evidence/sample_ch4_bubble.svg) vs [sample_ch1_bubble.png](file:///d:/Project/HBD/TiffaHBD/audit_evidence/sample_ch1_bubble.png) | **MAJOR** | Tinggi |
| **F-03** | Seluruh Board Ch 4 | **Perbedaan Semesta Karakter (Human Chibi vs Animal Cartoon)**: Ch 1–3 berlatar fabel hewan antromorfik (Ponpon domba, Jean-Luc serigala, Gladys alpaka), sedangkan Ch 4 dibintangi manusia (Tifa). | [ch4/desktop/board1.png](file:///d:/Project/HBD/TiffaHBD/audit_evidence/ch4/desktop/board1.png) vs [ch1/desktop/board1.png](file:///d:/Project/HBD/TiffaHBD/audit_evidence/ch1/desktop/board1.png) | **MINOR** | Tinggi |
| **F-04** | Ch 4 Board 3 & 4 (Focus Zoom) | **Crop Fokus Panel Rasio 2.1 Menjadi Square di Viewport Tertentu**: Pada mode klik/fokus, panel rasio 2.1 di-zoom ke 1.0 sehingga sayap kiri/kanan dipotong oleh viewport seleksi, meskipun pada mode board scroll terlihat sempurna. | [c4b3p2_focus.png](file:///d:/Project/HBD/TiffaHBD/before_after/after/desktop/c4b3p2_focus.png) vs [c4b3p2_board.png](file:///d:/Project/HBD/TiffaHBD/before_after/after/desktop/c4b3p2_board.png) | **MINOR** | Sedang |
| **F-05** | Board 6 Panel 1 | **Gaya Shading Background Lebih Halus**: Terdapat sedikit gradasi pencahayaan lampu dan jendela pada latar kamar Ch 4, berbeda dari cel-shading murni 2-tone Ch 1–3. | [ch4/desktop/board6.png](file:///d:/Project/HBD/TiffaHBD/audit_evidence/ch4/desktop/board6.png) | **MINOR** | Rendah (Karakteristik visual yang justru memperkaya suasana) |

*(Catatan: Tidak ditemukan cacat bertingkat **BLOCKER** pada Chapter 4. Semua fungsi runtime, navigasi board, interaktivitas, dan keterbacaan mobile berjalan tanpa crash).*

---

## 4. RINGKASAN REGRESI DAN PENINGKATAN CHAPTER 4

### A. Regresi (Kemunduran Dibandingkan Chapter 1–3)
1. **Regresi Ukuran Aset (97,88 MB vs 15,31 MB)**:  
   Chapter 1–3 mengemas tekstur menggunakan Free-Texture-Packer atlas dan GPU texture compression **Basis Universal (.basis KTX)** dengan varian `-small.basis` untuk mobile. Chapter 4 memuat PNG resolusi penuh (2048x1024) berukuran 2–3 MB per plate tanpa kompresi GPU.
2. **Regresi Keotentikan Tipografi Komik**:  
   Chapter 1–3 memiliki font komik hand-lettered khas Franco-Belgian bande dessinée. Chapter 4 menggunakan rendering teks vektor sans-serif (`Libre Franklin`).

### B. Peningkatan (Kelebihan Chapter 4 Dibandingkan Chapter 1–3)
1. **Sistem Speech Bubble Parametrik & Vektor Resolusi Penuh**:  
   Berbeda dengan bubble raster Ch 1–3 yang statis dan berpiksel jika di-zoom, bubble Chapter 4 dibangun dengan SVG parametrik dinamis (cubic bezier path). Posisi ekor terbukti presisi mengarah ke mulut/kepala pembicara (seluruhnya <= 5.8% panel radius), 100% bebas tumpang tindih dengan wajah/aksesori, dan margin aman di mobile 390px.
2. **Efek Shader & Atmospheric Lighting yang Lebih Maju**:  
   Chapter 4 memperkenalkan shader dinamis `candleGlow` dengan sinusoidal dual-frequency flicker pada 23 lilin kue Board 6, sistem partikel kelopak bunga melayang (`fJ`) yang bereaksi terhadap kursor pada Board 1 dan 8, serta goyangan lembut banner pesta (`overlayMesh.rotation.z`).
3. **Penyelarasan Z-Depth Parallax Otentik**:  
   Chapter 4 memisahkan background plate (`z = -0.72`), foreground cutout karakter (`z = 0.35`), dan balon teks (`z = 0.82`) dengan kamera perspektif (`fov = 45`), menghasilkan efek kedalaman 3D yang lebih hidup saat mouse digerakkan dibanding panel 2D datar.
4. **Pacing dan Climax Emosional**:  
   Transisi dari jalan malam yang tenang (Board 1–2), rasa penasaran di meja kerja (Board 3–4), kejutan kue ulang tahun (Board 5–6), pesta bersama kawan (Board 7), hingga kartu ucapan keepsake (Board 8) memiliki struktur sinematografi terpadu.

---

## 5. REKOMENDASI PERBAIKAN BERURUTAN PRIORITAS
*(Hanya rekomendasi teknis untuk rilis masa depan, TIDAK dieksekusi saat ini sesuai mode READ-ONLY)*

1. **[MAJOR] Kompresi Tekstur Latar ke Format KTX / WebP**:
   - *Tindakan*: Konversi 49 file PNG berukuran besar di `textures/chapters/4/` menjadi format Basis Universal KTX atau WebP terkompresi (target < 300 KB per file). Ini akan memangkas footprint dari 97,88 MB menjadi ~18 MB.
   - *Estimasi Usaha*: **Sedang** (1–2 jam via skrip automasi Node.js / `basisu`).
2. **[MAJOR] Terapkan Custom Hand-Lettered Display Font pada SVG Balon**:
   - *Tindakan*: Sematkan webfont comic display berkarakter hand-drawn (misal: *CC Wild Words*, *Bangers*, atau custom font Ponpon) ke dalam `@font-face` SVG generator, menggantikan `Libre Franklin` sans-serif.
   - *Estimasi Usaha*: **Kecil** (30 menit pada `scripts/bubbles/generate_svgs.js`).
3. **[MINOR] Sesuaikan Aspek Rasio Kamera pada Mode Seleksi Zoom Panel 2.1**:
   - *Tindakan*: Pada metode `select()` di `Chapter4Panel`, sesuaikan skala zoom kamera agar panel horizontal lebar (2.1) tidak terpotong tepi kiri/kanannya saat pengguna mengklik panel.
   - *Estimasi Usaha*: **Kecil** (15 menit pada `CfE0pqJa.js`).

---

## 6. HAL YANG TIDAK BISA DINILAI & ALASAN
1. **Perbandingan dengan Tifa di Chapter 1–3**:  
   Karakter Tifa tidak hadir di Chapter 1, 2, atau 3. Oleh karena itu, kontinuitas kostum dan aksesori Tifa hanya dapat diverifikasi secara internal antar-board di Chapter 4 (Board 1 s.d. Board 8), bukan lintas chapter.
2. **Performa Jaringan Riil Multi-Device**:  
   Pengukuran dilakukan pada server lokal (localhost:3000) dengan simulasi headless browser Microsoft Edge. Waktu latensi jaringan 3G/4G dunia nyata untuk unduhan 97 MB diestimasi secara teoritis, bukan dari field test perangkat fisik langsung.

---
*Bukti visual dan metrik lengkap tersimpan di folder `audit_evidence/`.*
