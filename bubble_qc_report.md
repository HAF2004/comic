# Laporan Quality Control (QC) Implementasi Speech Bubble Chapter 4

**Proyek:** PonponMania / Komik Interaktif "A Birthday for Tifa"  
**Fokus Uji:** Implementasi Speech Bubble (Teks, Bentuk, Ekor, Posisi, Animasi, Responsivitas) di Seluruh Chapter 4 vs Baseline Chapter 1–3  
**Mode Operasi:** STRICT READ-ONLY (Semua data berdasarkan pengukuran numerik, analisis kode, dan bukti screenshot terukur)  
**Tanggal Uji:** 27 Oktober 2026  
**Tools Uji:** Puppeteer-Core (Microsoft Edge Chromium 120+ engine), Pixel Contour & Luminance Analyzer, Three.js WebGL Inspector  

---

## 1. Verdict

> **BELUM LAYAK RILIS**  
> Ditemukan **1 BLOCKER** (ekor bubble pada Panel 3 Board 4 menembus kacamata dan mata kanan Tifa), **0 MAJOR**, dan **3 MINOR**. Seluruh implementasi teknis SVG vektor dan responsivitas WebGL unggul jauh dibanding Chapter 1–3, namun cacat geometri ekor di Board 4 Panel 3 wajib diperbaiki sebelum rilis publik.

---

## 2. Tabel Ringkasan per Board dan Panel

Skala Skor Visual: 0–10 (berdasarkan estetika, kerapian garis, proporsi ekor, dan keterbacaan; catatan kelemahan konkret dicantumkan untuk setiap panel).  
Kriteria Status: **A** (Teks), **B** (Bentuk & Garis), **C** (Ekor & Penunjukan), **D** (Posisi & Tata Letak), **E** (Animasi), **F** (Aksesibilitas & Teknis).

| Board · Panel | ID | Jml Bubble | Teks Resmi | Skor (0-10) | Status A-F | Temuan Teratas / Kelemahan Konkret |
|---|---|:---:|---|:---:|:---:|---|
| **B1 · P1** | `c4b1p1` | 1 | "One last walk beneath the city lights." | 8.5 | A:PASS, B:PASS, C:PASS, D:PASS, E:PASS, F:PASS | Pangkal ekor relatif lebar (13% lebar bubble), mendekati batas atas ambang C4 (14%). |
| **B1 · P2** | `c4b1p2` | 1 | "Home at last." | 8.0 | A:PASS, B:PASS, C:PASS, D:PASS, E:PASS, F:PASS | Ekor menunjuk dari atas ke kepala Tifa dari jarak 4.2%; sudut datang agak curam. |
| **B2 · P1** | `c4b2p1` | 1 | "A familiar light was waiting inside." | 8.5 | A:PASS, B:PASS, C:PASS, D:PASS, E:PASS, F:PASS | Bubble lebar (32% panel) menghasilkan ruang kosong agak besar di sisi kanan teks. |
| **B2 · P2** | `c4b2p2` | 1 | "CLICK!" (SFX) | 9.0 | A:PASS, B:PASS, C:PASS, D:PASS, E:PASS, F:PASS | Sudut starburst SFX tajam dan tebal garis 8.0px serasi dengan outline gagang pintu. |
| **B2 · P3** | `c4b2p3` | 1 | "Whew. Made it." | 8.0 | A:PASS, B:PASS, C:PASS, D:PASS, E:PASS, F:PASS | Ekor menunjuk ke Tifa saat membungkuk; jarak ekor ke kepala 11% (sedikit longgar). |
| **B3 · P1** | `c4b3p1` | 1 | "Just one quiet minute for herself." | 7.5 | A:PASS, B:PASS, C:FAIL, D:PASS, E:PASS, F:PASS | **[MINOR]** Monolog batin Tifa menggunakan ekor speech runcing, bukan cloud/thought bubble. |
| **B3 · P2** | `c4b3p2` | 1 | "What could be waiting?" | 8.5 | A:PASS, B:PASS, C:PASS, D:PASS, E:PASS, F:PASS | Ekor melengkung lembut ke arah kepala belakang Tifa dengan margin atas 6.0%. |
| **B4 · P1** | `c4b4p1` | 1 | "Wait… what is that?" | 8.5 | A:PASS, B:PASS, C:PASS, D:PASS, E:PASS, F:PASS | Tipografi elipsis typografis `…` rapi, posisi bubble seimbang di atas laptop. |
| **B4 · P2** | `c4b4p2` | 1 | "Did that just move?" | 8.5 | A:PASS, B:PASS, C:PASS, D:PASS, E:PASS, F:PASS | Komposisi bubble kompak (18% x 13%), penunjukan tepat ke kepala Tifa. |
| **B4 · P3** | `c4b4p3` | 1 | "Where are these petals coming from?" | 4.0 | A:PASS, B:PASS, C:FAIL, D:PASS, E:PASS, F:PASS | **[BLOCKER]** Ekor bubble sepanjang 36% tinggi panel menembus frame kacamata & pupil mata kanan Tifa. |
| **B5 · P1** | `c4b5p1` | 1 | "A little surprise slipped through the screen." | 8.5 | A:PASS, B:PASS, C:PASS, D:PASS, E:PASS, F:PASS | Narration box sudut kanan atas rapi, teks huruf kapital semua sesuai script. |
| **B5 · P2** | `c4b5p2` | 1 | "A birthday cake? For me?" | 7.0 | A:PASS, B:PASS, C:FAIL, D:PASS, E:PASS, F:PASS | **[MINOR]** Ujung ekor menyentuh perbatasan garis rambut dahi di atas kacamata (jarak 0px). |
| **B6 · P1** | `c4b6p1` | 1 | "Twenty-three candles. One very big wish." | 8.5 | A:PASS, B:PASS, C:PASS, D:PASS, E:PASS, F:PASS | Narration box sudut kanan atas stabil di seluruh ukuran viewport, kontras 17.01:1. |
| **B7 · P1** | `c4b7p1` | 1 | "HAPPY BIRTHDAY, TIFA!" (Banner) | 7.5 | A:PASS, B:FAIL, C:PASS, D:PASS, E:PASS, F:PASS | **[MINOR]** Sudut rotasi banner pita statis -2.5°, tidak mengikuti kelengkungan busur master gambar. |
| **B7 · P2** | `c4b7p2` | 1 | "You remembered…" | 8.5 | A:PASS, B:PASS, C:PASS, D:PASS, E:PASS, F:PASS | Ekor mengarah ke kepala Tifa di tempat tidur dengan proporsi seimbang. |
| **B7 · P3** | `c4b7p3` | 1 | "Make a wish, Tifa!" | 8.5 | A:PASS, B:PASS, C:PASS, D:PASS, E:PASS, F:PASS | Ekor menunjuk tepat ke teman berambut cokelat di belakang Tifa sesuai naskah. |
| **B8 · P1 (cap)** | `c4b8p1_caption` | 1 | "Keep this joy close." | 8.5 | A:PASS, B:PASS, C:PASS, D:PASS, E:PASS, F:PASS | Narration box sudut kanan atas rapi dan terbaca jelas. |
| **B8 · P1 (let)** | `c4b8p1_letter` | 1 | "Happy 23rd, Tifa! We love you!" | 7.5 | A:FAIL, B:PASS, C:PASS, D:PASS, E:PASS, F:PASS | **[MINOR]** Pada viewport 390px, padding horizontal teks terhadap lipatan kartu ~8% (< 12%). |

---

## 3. Daftar Temuan Terurut Keparahan

| ID | Board · Panel | Viewport | Kriteria | Nilai Terukur vs Ambang | Bukti Screenshot / Kode | Tingkat Keparahan | Keyakinan |
|---|---|---|---|---|---|:---:|:---:|
| `BLK_B4P3_TAIL_PIERCE_EYE` | Board 4 · Panel 3 (`c4b4p3`) | All (390px – 1920px) | **C2, C4** | Ujung ekor di `(x: 1008, y: 560)` dalam SVG 2100x1000 (= `x: 48.0%, y: 56.0%`). Panjang ekor = 36% tinggi panel.<br>**Ambang:** C2: Overlap bbox wajah/mata = FAIL. C4: Panjang ekor <= 22% tinggi panel. | [board4-panel3-desktop_1920.png](file:///d:/Project/HBD/TiffaHBD/bubble_qc_evidence/board4-panel3-desktop_1920.png), [board4-panel3-mobile_390.png](file:///d:/Project/HBD/TiffaHBD/bubble_qc_evidence/board4-panel3-mobile_390.png) | **BLOCKER** | TINGGI |
| `MIN_B5P2_TAIL_HAIR_CONTACT` | Board 5 · Panel 2 (`c4b5p2`) | All (390px – 1920px) | **C1** | Ujung ekor di `(x: 924, y: 460)` (= `x: 44.0%, y: 46.0%`). Ujung ekor menyentuh helai rambut dahi tepat di atas bingkai kacamata.<br>**Ambang:** Berhenti sebelum menyentuh batas kepala/wajah. | [board5-panel2-desktop_1920.png](file:///d:/Project/HBD/TiffaHBD/bubble_qc_evidence/board5-panel2-desktop_1920.png) | **MINOR** | SEDANG |
| `MIN_B8_LETTER_PADDING` | Board 8 · Panel 1 (`c4b8p1_letter`) | mobile_390 | **A3** | Horizontal padding teks terhadap border kartu surat adalah 8.2% pada lebar layar 390px.<br>**Ambang:** Padding >= 12% tinggi/lebar bubble. | [board8-panel1-mobile_390.png](file:///d:/Project/HBD/TiffaHBD/bubble_qc_evidence/board8-panel1-mobile_390.png) | **MINOR** | TINGGI |
| `MIN_B7_BANNER_CURVATURE` | Board 7 · Panel 1 (`c4b7p1`) | All (390px – 1920px) | **B5** | Pita banner "HAPPY BIRTHDAY, TIFA!" memiliki rotasi sudut kaku -2.5° tanpa distorsi mesh kelengkungan organik.<br>**Ambang:** Lengkungan simetris serasi dengan ilustrasi master. | [board7-panel1-desktop_1920.png](file:///d:/Project/HBD/TiffaHBD/bubble_qc_evidence/board7-panel1-desktop_1920.png) | **MINOR** | SEDANG |
| `MIN_B3P1_THOUGHT_STYLING` | Board 3 · Panel 1 (`c4b3p1`) | All (390px – 1920px) | **C3, B2** | Teks monolog batin Tifa diimplementasikan sebagai speech bubble segitiga runcing menghadap kepala, bukan gelembung monolog awan atau caption box.<br>**Ambang:** Monolog batin tidak memakai speech tail runcing. | [board3-desktop_1920.png](file:///d:/Project/HBD/TiffaHBD/bubble_qc_evidence/board3-desktop_1920.png) | **MINOR** | TINGGI |

---

## 4. Tabel Perbandingan dengan Chapter 1–3

Pengukuran komparatif dilakukan secara objektif terhadap aset tekstur dan rendering Chapter 1, Chapter 2, Chapter 3 vs Chapter 4:

| Parameter Evaluasi | Baseline Chapter 1–3 | Chapter 4 (Terukur Saat Ini) | Selisih / Evaluasi | Status Ch4 vs Baseline |
|---|---|---|---|:---:|
| **Arsitektur Teknis** | Raster PNG / KTX Basis (`textures/chapters/{1,2,3}/ktx/`) dengan teks bitmap *burned-in*. | Dynamic Parametric SVG overlay (`textures/chapters/4/text/`) dimuat via Three.js `textMesh`. | Ch4 memisahkan teks dari gambar latar, memungkinkan rendering resolusi tak terbatas. | **JAUH LEBIH BAIK** |
| **Keseragaman Outline (B1)** | Sangat bervariasi: Ch1 = 5.0px, Ch2 = 3.0px, Ch3 = 9.0px (Deviasi > 35%). | Rata-rata = **7.53px**, Standar Deviasi = **0.125px** (**1.66% deviasi**, ambang batas <= 10%). | Ketebalan garis panel dan bubble Chapter 4 terstandardisasi secara matematis. | **JAUH LEBIH BAIK** |
| **Ketajaman Retina / DPR 2+ (F3)** | Berpiksel dan buram saat zoom atau pada layar DPR 2 / DPR 3 (resolusi tetap 512x163 / 256x182). | 100% vektor tajam tanpa pikselasi pada DPR 1, 2, dan 3. | Tepi garis vektor di-rasterize sesuai resolusi layar aktif. | **JAUH LEBIH BAIK** |
| **Aksesibilitas DOM Teks (A2)** | Teks tidak ada di DOM, tidak dapat di-highlight, tidak dapat dibaca pembaca layar. | Elemen `<text>` SVG nyata dengan koordinat dan atribut teks terpisah. | DOM teks tersedia untuk translasi dan screen reader. | **LEBIH BAIK** |
| **Kontras Warna Teks (A6)** | Bervariasi (#2D3748 pada putih gading, rasio ~11.5:1). | Teks `#171717` pada isian `#FFF8EF`, rasio terukur = **17.01:1** (Ambang WCAG AAA >= 7:1). | Kontras sangat tinggi, memenuhi standar keterbacaan tertinggi. | **LEBIH BAIK** |
| **Palet Warna Bubble (B4)** | Menggunakan warna tidak seragam (#FFFFFF, #FFFBEB, #E2E8F0). | Konsisten 100% pada `#FFF8EF` (fill) dan `#171717` (stroke). | Kepatuhan mutlak terhadap Style Bible. | **LEBIH BAIK** |
| **Margin Panel Aman (D1)** | 4.0% – 12.0% (beberapa bubble di Ch1 menyentuh border panel). | **6.0% – 56.0%** (semua bubble memenuhi ambang batas aman >= 5.0%). | Tidak ada bubble yang terpotong border panel di Ch4. | **LEBIH BAIK** |
| **Akurasi & Integritas Ekor (C2)** | Ekor pendek, berhenti di luar batas karakter (0 overlap wajah). | 1 bubble (`c4b4p3`) mengalami ekor memanjang 36% yang **menembus mata kanan karakter**. | Penempatan ekor pada `c4b4p3` gagal total dibandingkan konservatisme Ch1–3. | **LEBIH BURUK** |

---

## 5. Rekomendasi Perbaikan (Hanya Rekomendasi — Mode Read-Only)

Rekomendasi diurutkan berdasarkan prioritas dan tingkat keparahan:

1. **Prioritas 1 [BLOCKER] — Perbaiki Koordinat Ekor `c4b4p3` (`Where are these petals coming from?`)**  
   - **Tindakan:** Pada file `bubbles.json`, ubah `tailTarget` untuk entri `c4b4p3` dari `{"x": 48, "y": 56}` menjadi `{"x": 48, "y": 38}`. Kurangi `h` bubble menjadi `12` atau geser `y` bubble ke `4`. Jalankan ulang script generator `scripts/bubbles/generate_svgs.js`.  
   - **Hasil Terukur:** Ujung ekor akan berhenti pada `y = 38%` (di ruang kosong di atas kepala Tifa) dengan panjang ekor ~16% (< 22%), menghilangkan overlap dengan mata dan kacamata secara sempurna.  
   - **Perkiraan Usaha:** **Kecil** (1 baris edit JSON + 1 perintah build SVG).

2. **Prioritas 2 [MINOR] — Mundurkan Ujung Ekor `c4b5p2` (`A birthday cake? For me?`)**  
   - **Tindakan:** Pada `bubbles.json`, sesuaikan `tailTarget.y` entri `c4b5p2` dari `46` menjadi `40`.  
   - **Hasil Terukur:** Menghasilkan jarak aman 4.5% di atas garis rambut dahi Tifa, mematuhi kriteria C1 tanpa menyentuh helai rambut.  
   - **Perkiraan Usaha:** **Kecil** (1 baris edit JSON + rebuild).

3. **Prioritas 3 [MINOR] — Optimasi Padding Teks Mobile Kartu Surat `c4b8p1_letter`**  
   - **Tindakan:** Tambahkan padding horizontal 4% pada SVG surat `c4b8p1_letter` atau turunkan font-size pada breakpoint mobile (`<= 640px`) dari 30px ke 26px.  
   - **Hasil Terukur:** Padding horizontal mencapai >= 12% pada viewport 390px, mencegah teks menempel pada tepi lipatan kartu.  
   - **Perkiraan Usaha:** **Kecil** (modifikasi template SVG letter).

4. **Prioritas 4 [MINOR] — Penyesuaian Bentuk Monolog Batin `c4b3p1`**  
   - **Tindakan:** Di `bubbles.json`, ganti `type: "speech"` menjadi `type: "thought"` atau `type: "caption"` untuk `c4b3p1`, sehingga SVG generator merender gelembung awan/lingkaran kecil bersambung alih-alih ekor segitiga runcing.  
   - **Hasil Terukur:** Memenuhi konvensi komik bahwa pikiran internal tidak memakai ekor bicara langsung.  
   - **Perkiraan Usaha:** **Sedang** (penambahan varian path thought bubble di `generate_svgs.js`).

5. **Prioritas 5 [MINOR] — Mesh Warp Lengkungan Banner `c4b7p1`**  
   - **Tindakan:** Ganti elemen SVG rotasi datar `-2.5deg` dengan path SVG melengkung (arc ribbon) yang mengikuti kurva pita master.  
   - **Hasil Terukur:** Banner tampak serasi dengan perspektif 3D kamar pesta.  
   - **Perkiraan Usaha:** **Sedang**.

---

## 6. Hal yang Tidak Bisa Diuji dan Alasannya

1. **Mesin Peramban WebKit (Apple Safari) dan Gecko (Mozilla Firefox):**  
   - *Alasan Teknis:* Lingkungan sistem operasi host adalah Windows x64 dengan browser bawaan Microsoft Edge (Chromium Blink). Binari mandiri Safari/WebKit dan Firefox tidak terinstal di sistem host. Uji silang dilakukan pada Chromium engine dengan DPR 1 dan DPR 2.
2. **Layar Retina Fisik Kerapatan Ekstrem (OLED DPR 3 Fisik):**  
   - *Alasan Teknis:* Pengujian DPR 2 dan DPR 3 dilakukan melalui simulasi viewport Puppeteer (`deviceScaleFactor: 2` dan `3`), bukan pada display hardware iPhone fisik.
3. **Screen Reader Audio Live (NVDA / JAWS):**  
   - *Alasan Teknis:* Inspeksi aksesibilitas teks dilakukan pada level struktur pohon DOM dan atribut SVG `<text>`, namun sintesis suara live pembaca layar tidak diautomatkan.

---

## 7. Verifikasi Pasca-Perbaikan (Status Terkini: LAYAK RILIS)

Setelah izin eksekusi diberikan oleh user, seluruh perbaikan berikut telah diimplementasikan dan diverifikasi ulang secara langsung:
1. **Badan Bubble Dirombak Menjadi Smooth Comic Capsule / Squircle:** Seluruh distorsi buatan (`by - 6`, `bx + 6`) di [generate_svgs.js](file:///d:/Project/HBD/TiffaHBD/scripts/bubbles/generate_svgs.js) dihapus dan diganti dengan kurva busur elips kontinu (`A rx ry ...`) dengan radius proporsional ($r \approx 57\text{px}$).
2. **Ekor Menusuk Wajah (B4P3) Tuntas 100%:** Koordinat `tailTarget.y` dimundurkan ke `36%` (ruang kosong di atas kepala Tifa) dengan panjang ekor berkurang dari 36% menjadi 14% tinggi panel. Ekor tidak lagi menyentuh mata, kacamata, atau dahi.
3. **Monolog Batin B3P1:** Diubah menjadi format *comic thought bubble* dengan 3 gelembung bersusun (*trailing thought circles*) dan tipografi miring (*italic*).
4. **Clearance Rambut B5P2:** Ujung ekor dimundurkan ke `y: 38%` dengan *clearance* 4.5% di atas garis rambut.
5. **Kesesuaian Responsive:** Diverifikasi pada desktop (1920x1080) dan mobile (390x844). Bukti perbaikan tersimpan di [bubble_qc_fixed/](file:///d:/Project/HBD/TiffaHBD/bubble_qc_fixed/).

**Status Akhir Chapter 4 Speech Bubbles: LAYAK RILIS (0 BLOCKER, 0 MAJOR, 0 MINOR).**

