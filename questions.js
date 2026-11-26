// Bank soal Cerebrum Quiz — set 4: Cerebrum (UTBK/SNBT) & JadiASN (CPNS)
// 52 soal + 5 soal bahasa Inggris (en: true, selalu ikut di mode Quiz Interaktif)
// Sumber: Product Knowledge Center — Team SEOBRUM: "Kurikulum SNBT 2026" (Cerebrum) dan
//         "Riset Seleksi Calon ASN / Kurikulum SKD CPNS / Riset SKB CPNS" (JadiASN), 2026.
// Format: { q: "pertanyaan", a: ["opsi1","opsi2",...], c: indexJawabanBenar, f: "fun fact (opsional)" }

window.QUESTIONS = [
  // =================== CEREBRUM · UTBK / SNBT ===================
  {
    q: "UTBK SNBT 2026 terdiri dari dua kelompok tes, yaitu Tes Potensi Skolastik (TPS) dan…",
    a: ["Tes Literasi", "Tes Wawasan Kebangsaan", "Tes Kepribadian", "Tes Bakat Minat"],
    c: 0,
    f: "Literasi: Bahasa Indonesia, Bahasa Inggris & Penalaran Matematika."
  },
  {
    q: "Subtes Pengetahuan Kuantitatif (PK) UTBK 2026 berisi…",
    a: ["20 soal dalam 20 menit", "30 soal dalam 30 menit", "20 soal dalam 42,5 menit", "15 soal dalam 15 menit"],
    c: 0
  },
  {
    q: "Berapa waktu pengerjaan subtes Pemahaman Bacaan dan Menulis (PBM)?",
    a: ["25 menit", "15 menit", "20 menit", "42,5 menit"],
    c: 0,
    f: "PBM: 20 soal dalam 25 menit."
  },
  {
    q: "Literasi Bahasa Indonesia di UTBK 2026 terdiri dari berapa soal?",
    a: ["30 soal", "20 soal", "25 soal", "40 soal"],
    c: 0,
    f: "30 soal dalam 42,5 menit."
  },
  {
    q: "Penalaran Umum terbagi 3 komponen @10 soal: Penalaran Induktif, Penalaran Deduktif, dan…",
    a: ["Penalaran Kuantitatif", "Penalaran Figural", "Penalaran Spasial", "Penalaran Verbal"],
    c: 0
  },
  {
    q: "Silogisme, Modus Ponens & Modus Tollens termasuk komponen Penalaran…",
    a: ["Deduktif", "Induktif", "Kuantitatif", "Spasial"],
    c: 0
  },
  {
    q: "Materi \"Hukum KPTS\" dan teknik mengutip dipelajari di subtes…",
    a: ["Pemahaman Bacaan dan Menulis (PBM)", "Penalaran Matematika", "Pengetahuan Kuantitatif", "Literasi Bahasa Inggris"],
    c: 0
  },
  {
    q: "Materi Algoritma (diagram alir) termasuk dalam subtes…",
    a: ["Pengetahuan Kuantitatif", "Literasi Bahasa Indonesia", "PPU", "PBM"],
    c: 0
  },
  {
    q: "Peluang dan Kombinatorika diujikan pada subtes…",
    a: ["Penalaran Matematika", "Penalaran Umum", "PPU", "Literasi Bahasa Inggris"],
    c: 0
  },
  {
    q: "Tipe soal UTBK yang dipastikan ada di SEMUA subtes adalah…",
    a: ["Pilihan Ganda", "Majemuk Kompleks", "Isian Singkat", "Esai"],
    c: 0
  },
  {
    q: "Soal Majemuk Kompleks di UTBK biasanya disajikan dalam bentuk…",
    a: ["Tabel pernyataan", "Gambar figural", "Rekaman audio", "Esai panjang"],
    c: 0,
    f: "Peserta bisa memilih lebih dari satu jawaban benar."
  },
  {
    q: "Benar atau Salah: Hasil UTBK 2026 bisa dipakai lagi untuk SNBT 2027.",
    a: ["Benar", "Salah"],
    c: 1,
    f: "Hasil UTBK 2026 hanya berlaku untuk SNBT & penerimaan PTN tahun 2026."
  },
  {
    q: "UTBK dirancang berbasis komputer agar penilaian…",
    a: ["Lebih objektif & seragam di seluruh Indonesia", "Bisa dikerjakan di rumah", "Tidak perlu belajar", "Hanya untuk kota besar"],
    c: 0
  },
  {
    q: "Landasan hukum penyelenggaraan UTBK/SNBT adalah…",
    a: ["UU No. 20 Tahun 2003 (Sisdiknas)", "UU No. 20 Tahun 2023 (ASN)", "UU No. 16 Tahun 2025 (BUMN)", "UU No. 34 Tahun 2004 (TNI)"],
    c: 0
  },
  {
    q: "Jika peserta SNBT hanya memilih 2 program studi, ketentuannya…",
    a: ["Bebas memilih program apa pun", "Wajib 1 vokasi & 1 akademik", "Wajib 2 Diploma Tiga", "Tidak boleh memilih Sarjana"],
    c: 0
  },
  {
    q: "Peserta SNBT berkebutuhan khusus tunanetra wajib mengunggah…",
    a: ["Surat Pernyataan Tuna Netra", "Portofolio seni", "Sertifikat TOEFL", "Surat rekomendasi dosen"],
    c: 0
  },
  {
    q: "Siswa kelas 12 yang belum punya ijazah saat UTBK harus membawa…",
    a: ["Surat keterangan siswa kelas 12 dari sekolah", "KTP orang tua", "Rapor kelas 10", "Kartu pelajar saja"],
    c: 0,
    f: "Lengkap dengan identitas, pas foto berwarna, tanda tangan kepala sekolah & cap sekolah."
  },
  {
    q: "Di kelas Cerebrum, setelah guru menjelaskan materi, kegiatan berikutnya adalah…",
    a: ["Latihan & diskusi interaktif", "Salam sapa", "Perkenalan guru", "Penyampaian agenda"],
    c: 0,
    f: "Lalu tanya jawab, dan ditutup penugasan latihan soal di LMS."
  },
  {
    q: "Evaluasi pengajar di program Cerebrum dilakukan melalui…",
    a: ["Kuesioner yang diisi peserta", "Ujian untuk guru", "Undian", "Jumlah like di media sosial"],
    c: 0
  },
  {
    q: "Peta Belajar Terstruktur Cerebrum membimbing belajar mulai dari…",
    a: ["Pengenalan materi hingga soal tingkat lanjut", "Soal tersulit dulu", "Tryout tanpa materi", "Hanya menonton video"],
    c: 0
  },
  {
    q: "Sistem ranking di Tryout Cerebrum membantu peserta mengetahui…",
    a: ["Peluang lolos dibanding peserta lain", "Jadwal libur sekolah", "Nilai rapor", "Biaya kuliah"],
    c: 0
  },
  {
    q: "Selain dari nilai UTBK, sebagian PTN menyelenggarakan jalur masuk sendiri yang disebut…",
    a: ["Ujian Mandiri", "SKD", "SNBP", "SKB"],
    c: 0
  },
  {
    q: "Materi Sinonim, kata rumpang & makna kata termasuk subtes…",
    a: ["Pengetahuan dan Pemahaman Umum (PPU)", "Penalaran Matematika", "Pengetahuan Kuantitatif", "Penalaran Umum"],
    c: 0
  },
  {
    q: "Dalam subtes Literasi Bahasa Indonesia, peserta antara lain diminta…",
    a: ["Mengevaluasi koherensi argumen dalam teks", "Menghitung integral", "Menghafal tahun sejarah", "Menerjemahkan bahasa Jepang"],
    c: 0
  },
  {
    q: "Penalaran Matematika menguji konsep matematika untuk masalah…",
    a: ["Kontekstual sehari-hari", "Teori murni tanpa konteks", "Fisika kuantum", "Akuntansi perusahaan"],
    c: 0,
    f: "Mis. aritmatika sosial: persentase, bunga, diskon, laba & rugi."
  },

  // =================== JADIASN · CPNS ===================
  {
    q: "Dasar hukum Aparatur Sipil Negara (ASN) yang terbaru adalah…",
    a: ["UU No. 20 Tahun 2023", "UU No. 20 Tahun 2003", "UU No. 5 Tahun 2014", "UU No. 16 Tahun 2025"],
    c: 0
  },
  {
    q: "Seleksi CASN mencakup dua jalur utama, yaitu…",
    a: ["PNS dan PPPK", "PNS dan BUMN", "TNI dan Polri", "PPPK dan Honorer"],
    c: 0
  },
  {
    q: "PPPK diangkat sebagai ASN berdasarkan…",
    a: ["Perjanjian kerja untuk jangka waktu tertentu", "Status tetap seumur hidup", "Undian nasional", "Rekomendasi kepala daerah saja"],
    c: 0
  },
  {
    q: "Benar atau Salah: Pelamar PPPK harus menjalani masa CPNS terlebih dahulu.",
    a: ["Benar", "Salah"],
    c: 1,
    f: "PPPK diangkat langsung berdasarkan kontrak kerja, tanpa masa CPNS."
  },
  {
    q: "Rentang usia pelamar CPNS umum adalah…",
    a: ["18–35 tahun", "17–30 tahun", "21–40 tahun", "18–45 tahun"],
    c: 0
  },
  {
    q: "Usia maksimal pelamar CPNS dosen/peneliti bergelar doktor adalah…",
    a: ["40 tahun", "35 tahun", "45 tahun", "50 tahun"],
    c: 0
  },
  {
    q: "Nilai ambang batas TWK (ketentuan umum) SKD CPNS adalah…",
    a: ["65", "80", "166", "75"],
    c: 0
  },
  {
    q: "Nilai ambang batas TIU (ketentuan umum) SKD CPNS adalah…",
    a: ["80", "65", "85", "60"],
    c: 0
  },
  {
    q: "Nilai ambang batas TKP (ketentuan umum) SKD CPNS adalah…",
    a: ["166", "150", "180", "126"],
    c: 0
  },
  {
    q: "Skor maksimal Tes Karakteristik Pribadi (TKP) adalah…",
    a: ["225", "175", "150", "250"],
    c: 0,
    f: "45 soal × maksimal 5 poin."
  },
  {
    q: "Pada TWK dan TIU, jawaban salah atau kosong bernilai…",
    a: ["0 poin", "−1 poin", "−5 poin", "1 poin"],
    c: 0,
    f: "Jawaban benar bernilai 5 poin."
  },
  {
    q: "Setiap pilihan jawaban TKP bernilai…",
    a: ["Paling rendah 1, paling tinggi 5", "Benar 5, salah 0", "Selalu 3", "Benar 4, salah −1"],
    c: 0
  },
  {
    q: "Waktu SKD untuk peserta disabilitas sensorik netra adalah…",
    a: ["130 menit", "100 menit", "120 menit", "150 menit"],
    c: 0
  },
  {
    q: "Urutan tahapan seleksi CPNS yang benar adalah…",
    a: ["Administrasi → SKD → SKB", "SKD → Administrasi → SKB", "SKB → SKD → Administrasi", "Administrasi → SKB → SKD"],
    c: 0
  },
  {
    q: "Mana yang BUKAN termasuk bab Tes Wawasan Kebangsaan (TWK)?",
    a: ["Deret Angka", "Nasionalisme", "Bela Negara", "Pilar Negara"],
    c: 0,
    f: "5 bab TWK: Nasionalisme, Integritas, Bela Negara, Pilar Negara, Bahasa Negara."
  },
  {
    q: "Deret angka & soal cerita jarak-kecepatan-waktu termasuk TIU kategori…",
    a: ["Numerik", "Verbal", "Figural", "Analitis"],
    c: 0
  },
  {
    q: "Soal \"The Next Box\" dan Kotak 3×3 termasuk TIU kategori…",
    a: ["Figural", "Numerik", "Verbal", "Silogisme"],
    c: 0
  },
  {
    q: "Materi Anti Radikalisme dan Pelayanan Publik termasuk subtes…",
    a: ["TKP", "TWK", "TIU", "SKB"],
    c: 0,
    f: "Seluruh materi TKP mengacu pada nilai dasar ASN BerAKHLAK."
  },
  {
    q: "Pedoman Computer Assisted Test (CAT) seleksi CASN diatur dalam…",
    a: ["Peraturan BKN No. 5 Tahun 2024", "Permendikbud No. 3 Tahun 2020", "UU No. 20 Tahun 2003", "Perpres No. 1 Tahun 2024"],
    c: 0
  },
  {
    q: "Mana yang BUKAN bentuk Seleksi Kompetensi Bidang (SKB) CPNS?",
    a: ["Tes UTBK", "Psikotes", "Tes praktik kerja", "Wawancara"],
    c: 0
  },
  {
    q: "Pada instansi DAERAH, SKB tambahan TIDAK boleh berupa…",
    a: ["Tes wawancara", "Psikotes", "Tes praktik kerja", "Tes bahasa asing"],
    c: 0
  },
  {
    q: "Di instansi pusat, bobot tes wawancara (sebagai SKB tambahan) paling tinggi…",
    a: ["10% dari nilai SKB", "50% dari nilai SKB", "25% dari nilai SKB", "60% dari nilai SKB"],
    c: 0
  },
  {
    q: "Pelamar cumlaude & diaspora harus mencapai nilai kumulatif SKD minimal…",
    a: ["311", "286", "300", "350"],
    c: 0,
    f: "Plus nilai TIU minimal 85."
  },
  {
    q: "JadiASN dipercaya lebih dari … pengguna untuk persiapan seleksi ASN.",
    a: ["Satu juta", "Sepuluh ribu", "Seratus ribu", "Sepuluh juta"],
    c: 0
  },
  {
    q: "Pembahasan soal JadiASN dilengkapi \"carcep\". Apa artinya?",
    a: ["Cara cepat", "Catatan cepat", "Cari cepat", "Cerdas cermat"],
    c: 0,
    f: "Plus konsep, kata kunci & pembahasan opsi yang salah."
  },
  {
    q: "Pelamar CPNS tidak boleh pernah dipidana dengan ancaman penjara … atau lebih.",
    a: ["2 tahun", "6 bulan", "5 tahun", "10 tahun"],
    c: 0
  },

  // ---------- English questions (selalu ikut di mode Quiz Interaktif) ----------
  {
    en: true,
    q: "In UTBK 2026, which subtest tests skills like skimming, scanning, and tone & attitude?",
    a: ["English Literacy", "Quantitative Knowledge", "General Reasoning", "Mathematical Reasoning"],
    c: 0
  },
  {
    en: true,
    q: "How many questions are there in the CPNS SKD test in total?",
    a: ["110 questions", "100 questions", "90 questions", "150 questions"],
    c: 0,
    f: "TWK 30 + TIU 35 + TKP 45."
  },
  {
    en: true,
    q: "In the SKD test, how many points does a correct TIU answer give?",
    a: ["5 points", "1 point", "3 points", "10 points"],
    c: 0
  },
  {
    en: true,
    q: "What does \"UTBK\" stand for in English?",
    a: ["Computer-Based Written Test", "National Graduation Exam", "University Entrance Interview", "Basic Competency Test"],
    c: 0,
    f: "Ujian Tulis Berbasis Komputer."
  },
  {
    en: true,
    q: "Which two career tracks make up Indonesia's civil servant (ASN) selection?",
    a: ["PNS and PPPK", "TNI and Polri", "BUMN and OJK", "SNBP and SNBT"],
    c: 0
  }
];
