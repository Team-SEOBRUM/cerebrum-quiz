// Bank soal Cerebrum Quiz — set 5: 4 sesi bertopik (mode Quiz Interaktif)
//   cat "pk"   = Sesi 1 · Product Knowledge   cat "utbk" = Sesi 2 · UTBK
//   cat "cpns" = Sesi 3 · CPNS                cat "seo"  = Sesi 4 · SEO
// Tiap sesi mengambil soal acak dari kategorinya; soal "en: true" (bahasa Inggris) selalu ikut di sesinya.
// Mode Balapan Peta mengambil soal acak dari semua kategori.
// Sumber fakta Cerebrum/UTBK/CPNS: Product Knowledge Center — Team SEOBRUM (2026).
// Format: { cat, q: "pertanyaan", a: ["opsi1", ...], c: indexJawabanBenar, f: "fun fact (opsional)" }

window.QUESTIONS = [
  // =================== SESI 1 · PRODUCT KNOWLEDGE (Cerebrum & ekosistem) ===================
  {
    cat: "pk",
    q: "PT Cerebrum Edukanesia Nusantara berdiri sejak tahun…",
    a: ["2018", "2012", "2021", "2015"],
    c: 0,
    f: "Perusahaan edutech Indonesia dengan rekam jejak sejak 2018."
  },
  {
    cat: "pk",
    q: "Cerebrum disebut telah mengakselerasi akses belajar bagi lebih dari … siswa.",
    a: ["3 juta", "300 ribu", "30 ribu", "30 juta"],
    c: 0
  },
  {
    cat: "pk",
    q: "Siapa CEO PT Cerebrum Edukanesia Nusantara?",
    a: ["Aditya Pratama Ghifary", "Alif Hijriah", "Rizky Ananda Putra", "Dimas Prasetyo"],
    c: 0,
    f: "Memimpin bersama founder Alif Hijriah."
  },
  {
    cat: "pk",
    q: "Cerebrum menaungi sekitar berapa aplikasi bimbel online?",
    a: ["15", "5", "50", "150"],
    c: 0
  },
  {
    cat: "pk",
    q: "Situs resmi perusahaan induk Cerebrum adalah…",
    a: ["cerebrumcorp.id", "cerebrum.go.id", "cerebrum.edu", "cerebrumapp.net"],
    c: 0
  },
  {
    cat: "pk",
    q: "Lengkapi semangat Team SEOBRUM: From #MissionZEROPossible to…",
    a: ["#BeNumberONE", "#StayHome", "#JustDoIt", "#NeverGiveUp"],
    c: 0
  },
  {
    cat: "pk",
    q: "Platform di ekosistem Cerebrum untuk persiapan CPNS adalah…",
    a: ["JadiASN", "JadiBUMN", "JadiSekdin", "JadiOJK"],
    c: 0
  },
  {
    cat: "pk",
    q: "Persiapan rekrutmen TNI dilayani oleh…",
    a: ["JadiPrajurit", "JadiPolisi", "JadiSekdin", "JadiPCPM"],
    c: 0,
    f: "Untuk Polri ada JadiPolisi."
  },
  {
    cat: "pk",
    q: "JadiPCPM menyiapkan peserta untuk seleksi PCPM di…",
    a: ["Bank Indonesia", "OJK", "Kementerian Keuangan", "BUMN"],
    c: 0
  },
  {
    cat: "pk",
    q: "JadiSekdin menyiapkan peserta untuk berapa instansi sekolah kedinasan?",
    a: ["9", "3", "15", "20"],
    c: 0,
    f: "Antara lain PKN STAN, IPDN, Polstat STIS, STMKG, STIN & Poltek SSN."
  },
  {
    cat: "pk",
    q: "Rekrutmen Bersama BUMN (RBB) disiapkan lewat platform…",
    a: ["JadiBUMN", "JadiASN", "JadiOJK", "JagoTPA"],
    c: 0
  },
  {
    cat: "pk",
    q: "JadiAffiliate dalam ekosistem Cerebrum adalah…",
    a: ["Program afiliasi untuk mempromosikan produk Cerebrum", "Aplikasi bimbel CPNS", "Kelas bahasa Inggris", "Bank soal SNBT"],
    c: 0
  },
  {
    cat: "pk",
    q: "Benar atau Salah: JadiNakes saat ini masih berupa aplikasi bimbel tenaga kesehatan.",
    a: ["Benar", "Salah"],
    c: 1,
    f: "JadiNakes kini menjadi situs web informasi kesehatan."
  },
  {
    cat: "pk",
    q: "soalsnbt.com, soalcpnsterbaru.com & soalpppkterbaru.com berfungsi sebagai…",
    a: ["Situs bank soal pelengkap platform utama", "Situs pendaftaran resmi pemerintah", "Media sosial Cerebrum", "Aplikasi kasir"],
    c: 0
  },
  {
    cat: "pk",
    q: "Fitur Cerebrum yang membimbing belajar langkah demi langkah dari dasar sampai soal lanjut adalah…",
    a: ["Peta Belajar Terstruktur", "Live Class", "Kalender", "Ranking Nasional"],
    c: 0
  },
  {
    cat: "pk",
    q: "Tryout Cerebrum dirancang menyerupai ujian asli dengan sistem…",
    a: ["CAT, timer otomatis & penilaian real-time", "Kertas & pensil", "Lisan dengan mentor", "Tanpa batas waktu"],
    c: 0
  },
  {
    cat: "pk",
    q: "Latsol di Cerebrum adalah singkatan dari…",
    a: ["Latihan Soal (harian)", "Latihan Solusi", "Lanjutan Soal", "Lapor Solusi"],
    c: 0
  },
  {
    cat: "pk",
    q: "Isi Pustaka Materi Cerebrum adalah video, PDF, e-book, dan…",
    a: ["Flashcard", "Game online", "Podcast musik", "Kuis TV"],
    c: 0
  },
  {
    cat: "pk",
    q: "Live Class Cerebrum juga disebut…",
    a: ["Mentoring Interaktif", "Kelas Pasif", "Webinar Tertutup", "Kelas Offline"],
    c: 0,
    f: "Bisa tanya langsung + ada rekaman kelas."
  },
  {
    cat: "pk",
    q: "Fitur untuk melihat posisimu dibanding peserta lain se-Indonesia adalah…",
    a: ["Ranking Nilai Nasional", "Tracking Belajar", "Kalender", "Flashcard"],
    c: 0
  },
  {
    cat: "pk",
    q: "Jadwal belajar, Live Class & Tryout dalam satu tampilan ada di fitur…",
    a: ["Kalender", "Latsol", "Materi", "Ranking"],
    c: 0
  },
  {
    cat: "pk",
    q: "Sistem resmi yang dirujuk kurikulum Program PPG di JadiPPG adalah…",
    a: ["SIMPKB", "SSCASN", "Portal SNPMB", "FHCI"],
    c: 0
  },
  {
    cat: "pk",
    en: true,
    q: "Which platform in the Cerebrum ecosystem helps you prepare for the TOEFL test?",
    a: ["TOEFL Academy", "JadiBUMN", "JadiSekdin", "PsikotesKerja.id"],
    c: 0
  },
  {
    cat: "pk",
    en: true,
    q: "In what year was PT Cerebrum Edukanesia Nusantara founded?",
    a: ["2018", "2010", "2022", "2015"],
    c: 0
  },
  // =================== SESI 2 · UTBK / SNBT 2026 ===================
  {
    cat: "utbk",
    q: "UTBK SNBT 2026 terdiri dari dua kelompok tes, yaitu Tes Potensi Skolastik (TPS) dan…",
    a: ["Tes Literasi", "Tes Wawasan Kebangsaan", "Tes Kepribadian", "Tes Bakat Minat"],
    c: 0,
    f: "Literasi: Bahasa Indonesia, Bahasa Inggris & Penalaran Matematika."
  },
  {
    cat: "utbk",
    q: "Subtes Pengetahuan Kuantitatif (PK) UTBK 2026 berisi…",
    a: ["20 soal dalam 20 menit", "30 soal dalam 30 menit", "20 soal dalam 42,5 menit", "15 soal dalam 15 menit"],
    c: 0
  },
  {
    cat: "utbk",
    q: "Berapa waktu pengerjaan subtes Pemahaman Bacaan dan Menulis (PBM)?",
    a: ["25 menit", "15 menit", "20 menit", "42,5 menit"],
    c: 0,
    f: "PBM: 20 soal dalam 25 menit."
  },
  {
    cat: "utbk",
    q: "Literasi Bahasa Indonesia di UTBK 2026 terdiri dari berapa soal?",
    a: ["30 soal", "20 soal", "25 soal", "40 soal"],
    c: 0,
    f: "30 soal dalam 42,5 menit."
  },
  {
    cat: "utbk",
    q: "Penalaran Umum terbagi 3 komponen @10 soal: Penalaran Induktif, Penalaran Deduktif, dan…",
    a: ["Penalaran Kuantitatif", "Penalaran Figural", "Penalaran Spasial", "Penalaran Verbal"],
    c: 0
  },
  {
    cat: "utbk",
    q: "Silogisme, Modus Ponens & Modus Tollens termasuk komponen Penalaran…",
    a: ["Deduktif", "Induktif", "Kuantitatif", "Spasial"],
    c: 0
  },
  {
    cat: "utbk",
    q: "Materi \"Hukum KPTS\" dan teknik mengutip dipelajari di subtes…",
    a: ["Pemahaman Bacaan dan Menulis (PBM)", "Penalaran Matematika", "Pengetahuan Kuantitatif", "Literasi Bahasa Inggris"],
    c: 0
  },
  {
    cat: "utbk",
    q: "Materi Algoritma (diagram alir) termasuk dalam subtes…",
    a: ["Pengetahuan Kuantitatif", "Literasi Bahasa Indonesia", "PPU", "PBM"],
    c: 0
  },
  {
    cat: "utbk",
    q: "Peluang dan Kombinatorika diujikan pada subtes…",
    a: ["Penalaran Matematika", "Penalaran Umum", "PPU", "Literasi Bahasa Inggris"],
    c: 0
  },
  {
    cat: "utbk",
    q: "Tipe soal UTBK yang dipastikan ada di SEMUA subtes adalah…",
    a: ["Pilihan Ganda", "Majemuk Kompleks", "Isian Singkat", "Esai"],
    c: 0
  },
  {
    cat: "utbk",
    q: "Soal Majemuk Kompleks di UTBK biasanya disajikan dalam bentuk…",
    a: ["Tabel pernyataan", "Gambar figural", "Rekaman audio", "Esai panjang"],
    c: 0,
    f: "Peserta bisa memilih lebih dari satu jawaban benar."
  },
  {
    cat: "utbk",
    q: "Benar atau Salah: Hasil UTBK 2026 bisa dipakai lagi untuk SNBT 2027.",
    a: ["Benar", "Salah"],
    c: 1,
    f: "Hasil UTBK 2026 hanya berlaku untuk SNBT & penerimaan PTN tahun 2026."
  },
  {
    cat: "utbk",
    q: "UTBK dirancang berbasis komputer agar penilaian…",
    a: ["Lebih objektif & seragam di seluruh Indonesia", "Bisa dikerjakan di rumah", "Tidak perlu belajar", "Hanya untuk kota besar"],
    c: 0
  },
  {
    cat: "utbk",
    q: "Landasan hukum penyelenggaraan UTBK/SNBT adalah…",
    a: ["UU No. 20 Tahun 2003 (Sisdiknas)", "UU No. 20 Tahun 2023 (ASN)", "UU No. 16 Tahun 2025 (BUMN)", "UU No. 34 Tahun 2004 (TNI)"],
    c: 0
  },
  {
    cat: "utbk",
    q: "Jika peserta SNBT hanya memilih 2 program studi, ketentuannya…",
    a: ["Bebas memilih program apa pun", "Wajib 1 vokasi & 1 akademik", "Wajib 2 Diploma Tiga", "Tidak boleh memilih Sarjana"],
    c: 0
  },
  {
    cat: "utbk",
    q: "Peserta SNBT berkebutuhan khusus tunanetra wajib mengunggah…",
    a: ["Surat Pernyataan Tuna Netra", "Portofolio seni", "Sertifikat TOEFL", "Surat rekomendasi dosen"],
    c: 0
  },
  {
    cat: "utbk",
    q: "Siswa kelas 12 yang belum punya ijazah saat UTBK harus membawa…",
    a: ["Surat keterangan siswa kelas 12 dari sekolah", "KTP orang tua", "Rapor kelas 10", "Kartu pelajar saja"],
    c: 0,
    f: "Lengkap dengan identitas, pas foto berwarna, tanda tangan kepala sekolah & cap sekolah."
  },
  {
    cat: "utbk",
    q: "Di kelas Cerebrum, setelah guru menjelaskan materi, kegiatan berikutnya adalah…",
    a: ["Latihan & diskusi interaktif", "Salam sapa", "Perkenalan guru", "Penyampaian agenda"],
    c: 0,
    f: "Lalu tanya jawab, dan ditutup penugasan latihan soal di LMS."
  },
  {
    cat: "utbk",
    q: "Evaluasi pengajar di program Cerebrum dilakukan melalui…",
    a: ["Kuesioner yang diisi peserta", "Ujian untuk guru", "Undian", "Jumlah like di media sosial"],
    c: 0
  },
  {
    cat: "utbk",
    q: "Peta Belajar Terstruktur Cerebrum membimbing belajar mulai dari…",
    a: ["Pengenalan materi hingga soal tingkat lanjut", "Soal tersulit dulu", "Tryout tanpa materi", "Hanya menonton video"],
    c: 0
  },
  {
    cat: "utbk",
    q: "Sistem ranking di Tryout Cerebrum membantu peserta mengetahui…",
    a: ["Peluang lolos dibanding peserta lain", "Jadwal libur sekolah", "Nilai rapor", "Biaya kuliah"],
    c: 0
  },
  {
    cat: "utbk",
    q: "Selain dari nilai UTBK, sebagian PTN menyelenggarakan jalur masuk sendiri yang disebut…",
    a: ["Ujian Mandiri", "SKD", "SNBP", "SKB"],
    c: 0
  },
  {
    cat: "utbk",
    q: "Materi Sinonim, kata rumpang & makna kata termasuk subtes…",
    a: ["Pengetahuan dan Pemahaman Umum (PPU)", "Penalaran Matematika", "Pengetahuan Kuantitatif", "Penalaran Umum"],
    c: 0
  },
  {
    cat: "utbk",
    q: "Dalam subtes Literasi Bahasa Indonesia, peserta antara lain diminta…",
    a: ["Mengevaluasi koherensi argumen dalam teks", "Menghitung integral", "Menghafal tahun sejarah", "Menerjemahkan bahasa Jepang"],
    c: 0
  },
  {
    cat: "utbk",
    q: "Penalaran Matematika menguji konsep matematika untuk masalah…",
    a: ["Kontekstual sehari-hari", "Teori murni tanpa konteks", "Fisika kuantum", "Akuntansi perusahaan"],
    c: 0,
    f: "Mis. aritmatika sosial: persentase, bunga, diskon, laba & rugi."
  },
  {
    cat: "utbk",
    en: true,
    q: "In UTBK 2026, which subtest tests skills like skimming, scanning, and tone & attitude?",
    a: ["English Literacy", "Quantitative Knowledge", "General Reasoning", "Mathematical Reasoning"],
    c: 0
  },
  {
    cat: "utbk",
    en: true,
    q: "What does \"UTBK\" stand for in English?",
    a: ["Computer-Based Written Test", "National Graduation Exam", "University Entrance Interview", "Basic Competency Test"],
    c: 0,
    f: "Ujian Tulis Berbasis Komputer."
  },
  // =================== SESI 3 · CPNS (JadiASN) ===================
  {
    cat: "cpns",
    q: "Dasar hukum Aparatur Sipil Negara (ASN) yang terbaru adalah…",
    a: ["UU No. 20 Tahun 2023", "UU No. 20 Tahun 2003", "UU No. 5 Tahun 2014", "UU No. 16 Tahun 2025"],
    c: 0
  },
  {
    cat: "cpns",
    q: "Seleksi CASN mencakup dua jalur utama, yaitu…",
    a: ["PNS dan PPPK", "PNS dan BUMN", "TNI dan Polri", "PPPK dan Honorer"],
    c: 0
  },
  {
    cat: "cpns",
    q: "PPPK diangkat sebagai ASN berdasarkan…",
    a: ["Perjanjian kerja untuk jangka waktu tertentu", "Status tetap seumur hidup", "Undian nasional", "Rekomendasi kepala daerah saja"],
    c: 0
  },
  {
    cat: "cpns",
    q: "Benar atau Salah: Pelamar PPPK harus menjalani masa CPNS terlebih dahulu.",
    a: ["Benar", "Salah"],
    c: 1,
    f: "PPPK diangkat langsung berdasarkan kontrak kerja, tanpa masa CPNS."
  },
  {
    cat: "cpns",
    q: "Rentang usia pelamar CPNS umum adalah…",
    a: ["18–35 tahun", "17–30 tahun", "21–40 tahun", "18–45 tahun"],
    c: 0
  },
  {
    cat: "cpns",
    q: "Usia maksimal pelamar CPNS dosen/peneliti bergelar doktor adalah…",
    a: ["40 tahun", "35 tahun", "45 tahun", "50 tahun"],
    c: 0
  },
  {
    cat: "cpns",
    q: "Nilai ambang batas TWK (ketentuan umum) SKD CPNS adalah…",
    a: ["65", "80", "166", "75"],
    c: 0
  },
  {
    cat: "cpns",
    q: "Nilai ambang batas TIU (ketentuan umum) SKD CPNS adalah…",
    a: ["80", "65", "85", "60"],
    c: 0
  },
  {
    cat: "cpns",
    q: "Nilai ambang batas TKP (ketentuan umum) SKD CPNS adalah…",
    a: ["166", "150", "180", "126"],
    c: 0
  },
  {
    cat: "cpns",
    q: "Skor maksimal Tes Karakteristik Pribadi (TKP) adalah…",
    a: ["225", "175", "150", "250"],
    c: 0,
    f: "45 soal × maksimal 5 poin."
  },
  {
    cat: "cpns",
    q: "Pada TWK dan TIU, jawaban salah atau kosong bernilai…",
    a: ["0 poin", "−1 poin", "−5 poin", "1 poin"],
    c: 0,
    f: "Jawaban benar bernilai 5 poin."
  },
  {
    cat: "cpns",
    q: "Setiap pilihan jawaban TKP bernilai…",
    a: ["Paling rendah 1, paling tinggi 5", "Benar 5, salah 0", "Selalu 3", "Benar 4, salah −1"],
    c: 0
  },
  {
    cat: "cpns",
    q: "Waktu SKD untuk peserta disabilitas sensorik netra adalah…",
    a: ["130 menit", "100 menit", "120 menit", "150 menit"],
    c: 0
  },
  {
    cat: "cpns",
    q: "Urutan tahapan seleksi CPNS yang benar adalah…",
    a: ["Administrasi → SKD → SKB", "SKD → Administrasi → SKB", "SKB → SKD → Administrasi", "Administrasi → SKB → SKD"],
    c: 0
  },
  {
    cat: "cpns",
    q: "Mana yang BUKAN termasuk bab Tes Wawasan Kebangsaan (TWK)?",
    a: ["Deret Angka", "Nasionalisme", "Bela Negara", "Pilar Negara"],
    c: 0,
    f: "5 bab TWK: Nasionalisme, Integritas, Bela Negara, Pilar Negara, Bahasa Negara."
  },
  {
    cat: "cpns",
    q: "Deret angka & soal cerita jarak-kecepatan-waktu termasuk TIU kategori…",
    a: ["Numerik", "Verbal", "Figural", "Analitis"],
    c: 0
  },
  {
    cat: "cpns",
    q: "Soal \"The Next Box\" dan Kotak 3×3 termasuk TIU kategori…",
    a: ["Figural", "Numerik", "Verbal", "Silogisme"],
    c: 0
  },
  {
    cat: "cpns",
    q: "Materi Anti Radikalisme dan Pelayanan Publik termasuk subtes…",
    a: ["TKP", "TWK", "TIU", "SKB"],
    c: 0,
    f: "Seluruh materi TKP mengacu pada nilai dasar ASN BerAKHLAK."
  },
  {
    cat: "cpns",
    q: "Pedoman Computer Assisted Test (CAT) seleksi CASN diatur dalam…",
    a: ["Peraturan BKN No. 5 Tahun 2024", "Permendikbud No. 3 Tahun 2020", "UU No. 20 Tahun 2003", "Perpres No. 1 Tahun 2024"],
    c: 0
  },
  {
    cat: "cpns",
    q: "Mana yang BUKAN bentuk Seleksi Kompetensi Bidang (SKB) CPNS?",
    a: ["Tes UTBK", "Psikotes", "Tes praktik kerja", "Wawancara"],
    c: 0
  },
  {
    cat: "cpns",
    q: "Pada instansi DAERAH, SKB tambahan TIDAK boleh berupa…",
    a: ["Tes wawancara", "Psikotes", "Tes praktik kerja", "Tes bahasa asing"],
    c: 0
  },
  {
    cat: "cpns",
    q: "Di instansi pusat, bobot tes wawancara (sebagai SKB tambahan) paling tinggi…",
    a: ["10% dari nilai SKB", "50% dari nilai SKB", "25% dari nilai SKB", "60% dari nilai SKB"],
    c: 0
  },
  {
    cat: "cpns",
    q: "Pelamar cumlaude & diaspora harus mencapai nilai kumulatif SKD minimal…",
    a: ["311", "286", "300", "350"],
    c: 0,
    f: "Plus nilai TIU minimal 85."
  },
  {
    cat: "cpns",
    q: "JadiASN dipercaya lebih dari … pengguna untuk persiapan seleksi ASN.",
    a: ["Satu juta", "Sepuluh ribu", "Seratus ribu", "Sepuluh juta"],
    c: 0
  },
  {
    cat: "cpns",
    q: "Pembahasan soal JadiASN dilengkapi \"carcep\". Apa artinya?",
    a: ["Cara cepat", "Catatan cepat", "Cari cepat", "Cerdas cermat"],
    c: 0,
    f: "Plus konsep, kata kunci & pembahasan opsi yang salah."
  },
  {
    cat: "cpns",
    q: "Pelamar CPNS tidak boleh pernah dipidana dengan ancaman penjara … atau lebih.",
    a: ["2 tahun", "6 bulan", "5 tahun", "10 tahun"],
    c: 0
  },
  {
    cat: "cpns",
    en: true,
    q: "How many questions are there in the CPNS SKD test in total?",
    a: ["110 questions", "100 questions", "90 questions", "150 questions"],
    c: 0,
    f: "TWK 30 + TIU 35 + TKP 45."
  },
  {
    cat: "cpns",
    en: true,
    q: "In the SKD test, how many points does a correct TIU answer give?",
    a: ["5 points", "1 point", "3 points", "10 points"],
    c: 0
  },
  {
    cat: "cpns",
    en: true,
    q: "Which two career tracks make up Indonesia's civil servant (ASN) selection?",
    a: ["PNS and PPPK", "TNI and Polri", "BUMN and OJK", "SNBP and SNBT"],
    c: 0
  },
  // =================== SESI 4 · PENGETAHUAN SEO ===================
  {
    cat: "seo",
    q: "SEO adalah singkatan dari…",
    a: ["Search Engine Optimization", "Search Engine Operation", "Site Engine Optimization", "Search Easy Online"],
    c: 0
  },
  {
    cat: "seo",
    q: "Judul halaman yang tampil di hasil pencarian Google diatur lewat tag…",
    a: ["<title>", "<h6>", "<footer>", "<span>"],
    c: 0,
    f: "Sering disebut meta title / SEO title."
  },
  {
    cat: "seo",
    q: "Panjang meta description yang umum disarankan agar tidak terpotong di Google adalah sekitar…",
    a: ["150–160 karakter", "20–30 karakter", "500 karakter", "1.000 karakter"],
    c: 0
  },
  {
    cat: "seo",
    q: "File yang memberi tahu crawler halaman mana yang boleh/tidak boleh di-crawl adalah…",
    a: ["robots.txt", "sitemap.xml", "index.html", "style.css"],
    c: 0
  },
  {
    cat: "seo",
    q: "File berisi daftar URL penting untuk membantu Google menemukan halaman disebut…",
    a: ["Sitemap XML", "robots.txt", ".htaccess", "favicon"],
    c: 0
  },
  {
    cat: "seo",
    q: "Link dari website lain yang mengarah ke website kita disebut…",
    a: ["Backlink", "Internal link", "Broken link", "Anchor"],
    c: 0
  },
  {
    cat: "seo",
    q: "Link antar-halaman di dalam satu website yang sama disebut…",
    a: ["Internal link", "Backlink", "Outbound link", "Redirect"],
    c: 0
  },
  {
    cat: "seo",
    q: "Teks yang bisa diklik pada sebuah link disebut…",
    a: ["Anchor text", "Alt text", "Meta tag", "Slug"],
    c: 0
  },
  {
    cat: "seo",
    q: "Teks alternatif yang menjelaskan isi gambar untuk mesin pencari disebut…",
    a: ["Alt text", "Anchor text", "Caption", "Title tag"],
    c: 0
  },
  {
    cat: "seo",
    q: "Kode status redirect PERMANEN yang meneruskan sinyal SEO ke URL baru adalah…",
    a: ["301", "302", "404", "500"],
    c: 0
  },
  {
    cat: "seo",
    q: "Tag untuk menandai versi utama dari halaman yang isinya mirip/duplikat adalah…",
    a: ["rel=\"canonical\"", "rel=\"nofollow\"", "noindex", "hreflang"],
    c: 0
  },
  {
    cat: "seo",
    q: "Agar sebuah halaman TIDAK muncul di hasil pencarian, gunakan meta robots…",
    a: ["noindex", "nofollow", "canonical", "index, follow"],
    c: 0
  },
  {
    cat: "seo",
    q: "Dalam E-E-A-T, huruf E pertama adalah…",
    a: ["Experience", "Engagement", "Efficiency", "Education"],
    c: 0,
    f: "Experience, Expertise, Authoritativeness, Trustworthiness."
  },
  {
    cat: "seo",
    q: "Kata kunci panjang & spesifik dengan volume kecil tapi persaingan rendah disebut…",
    a: ["Long-tail keyword", "Head keyword", "Brand keyword", "Stop word"],
    c: 0
  },
  {
    cat: "seo",
    q: "Tools GRATIS dari Google untuk memantau indexing & performa website di pencarian adalah…",
    a: ["Google Search Console", "Google Docs", "Google Meet", "Google Keep"],
    c: 0
  },
  {
    cat: "seo",
    q: "Metrik Core Web Vitals yang mengukur kecepatan tampil konten terbesar adalah…",
    a: ["LCP", "CLS", "CTR", "DR"],
    c: 0,
    f: "Largest Contentful Paint."
  },
  {
    cat: "seo",
    q: "Metrik Core Web Vitals yang mengukur pergeseran tata letak (layout) halaman adalah…",
    a: ["CLS", "LCP", "INP", "TTL"],
    c: 0,
    f: "Cumulative Layout Shift."
  },
  {
    cat: "seo",
    q: "Sejak 2024, metrik Core Web Vitals INP menggantikan…",
    a: ["FID", "LCP", "CLS", "TTFB"],
    c: 0,
    f: "INP = Interaction to Next Paint."
  },
  {
    cat: "seo",
    q: "Google mengindeks website terutama berdasarkan versi…",
    a: ["Mobile", "Desktop", "Cetak (print)", "AMP saja"],
    c: 0,
    f: "Dikenal sebagai mobile-first indexing."
  },
  {
    cat: "seo",
    q: "Pencarian \"beli laptop murah promo\" termasuk search intent…",
    a: ["Transaksional", "Informasional", "Navigasional", "Komersial investigasi"],
    c: 0
  },
  {
    cat: "seo",
    q: "Kode terstruktur yang membantu tampil sebagai rich result (bintang ulasan, FAQ, dll.) disebut…",
    a: ["Schema markup / structured data", "Inline CSS", "Meta keywords", "Cookie"],
    c: 0
  },
  {
    cat: "seo",
    q: "Kotak jawaban ringkas yang tampil di atas hasil organik Google disebut…",
    a: ["Featured snippet", "Breadcrumb", "Footer", "Pop-up"],
    c: 0
  },
  {
    cat: "seo",
    q: "Mengulang-ulang kata kunci secara berlebihan agar ranking naik disebut…",
    a: ["Keyword stuffing", "Keyword research", "Keyword mapping", "Link building"],
    c: 0,
    f: "Praktik buruk yang bisa merugikan ranking."
  },
  {
    cat: "seo",
    q: "Bagian URL setelah nama domain yang mendeskripsikan isi halaman disebut…",
    a: ["Slug", "Anchor", "Hostname", "Protocol"],
    c: 0,
    f: "Contoh: cerebrum.id/blog/tips-utbk → \"tips-utbk\"."
  },
  {
    cat: "seo",
    q: "Upaya SEO di luar website (backlink, mention, PR) disebut…",
    a: ["Off-page SEO", "On-page SEO", "Technical SEO", "Local SEO"],
    c: 0
  },
  {
    cat: "seo",
    q: "Persentase orang yang mengklik hasil pencarian dibanding jumlah tayangan disebut…",
    a: ["CTR", "CPC", "DR", "LCP"],
    c: 0,
    f: "Click-Through Rate."
  },
  {
    cat: "seo",
    q: "Metrik Ahrefs yang menunjukkan kekuatan profil backlink sebuah domain adalah…",
    a: ["Domain Rating (DR)", "Page Speed", "Bounce Rate", "Core Web Vitals"],
    c: 0
  },
  {
    cat: "seo",
    en: true,
    q: "What does SERP stand for?",
    a: ["Search Engine Results Page", "Search Engine Ranking Process", "Site Entry Response Page", "Search Engine Reach Plan"],
    c: 0
  },
  {
    cat: "seo",
    en: true,
    q: "Which HTTP status code means \"Page Not Found\"?",
    a: ["404", "301", "200", "503"],
    c: 0
  }
];
