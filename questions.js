// Bank soal Cerebrum Quiz
// Sumber: Product Knowledge Center — Team SEOBRUM (product-knowledge-center.netlify.app)
// Format: { q: "pertanyaan", a: ["opsi1","opsi2",...], c: indexJawabanBenar, f: "fun fact (opsional)" }
// Soal Benar/Salah cukup pakai 2 opsi.

window.QUESTIONS = [
  {
    q: "Aplikasi Cerebrum membantu kamu bersiap untuk apa?",
    a: ["Masuk PTN (SNBT/UTBK, TKA & Ujian Mandiri)", "Seleksi CPNS", "Seleksi TNI", "Tes TOEFL"],
    c: 0,
    f: "Cerebrum fokus pada persiapan masuk Perguruan Tinggi Negeri."
  },
  {
    q: "Apa nama perusahaan induk di balik Cerebrum?",
    a: ["PT Cerebrum Indonesia Jaya", "PT Cerebrum Edukanesia Nusantara", "PT Edukasi Nusantara Cerdas", "PT Bimbel Online Indonesia"],
    c: 1,
    f: "Situs resminya ada di Cerebrumcorp.id."
  },
  {
    q: "Sudah berapa tahun pengalaman Cerebrum mendampingi pejuang PTN?",
    a: ["1 tahun", "3 tahun", "8 tahun", "15 tahun"],
    c: 2,
    f: "8 tahun — salah satu platform paling senior di ekosistem Cerebrum!"
  },
  {
    q: "Kira-kira berapa jumlah bank soal di Cerebrum?",
    a: ["Sekitar 500 soal", "Sekitar 2.000 soal", "27.813 soal", "1 juta soal"],
    c: 2,
    f: "Ada 27.813 soal siap dilatih."
  },
  {
    q: "Berapa jumlah pengguna Cerebrum?",
    a: ["70 ribu lebih", "100 orang", "500 orang", "Belum ada"],
    c: 0,
    f: "70k+ pengguna sudah belajar bareng Cerebrum."
  },
  {
    q: "Fitur simulasi ujian dengan sistem CAT, timer otomatis & ranking disebut…",
    a: ["Flashcard", "Tryout", "Kalender", "Latsol"],
    c: 1,
    f: "Tryout dibuat semirip mungkin dengan ujian asli."
  },
  {
    q: "\"Latsol\" di Cerebrum adalah singkatan dari…",
    a: ["Latihan Solo", "Latihan Soal", "Lanjut Solusi", "Lapor Soal"],
    c: 1,
    f: "Latsol = Latihan Soal harian yang singkat per materi."
  },
  {
    q: "Fitur kelas online langsung bersama mentor berpengalaman bernama…",
    a: ["Live Class", "Tracking Belajar", "Fitur Free", "Peta Belajar"],
    c: 0,
    f: "Di Live Class kamu bisa tanya jawab langsung dengan mentor."
  },
  {
    q: "Kalau berhalangan ikut Live Class, apa yang bisa dilakukan?",
    a: ["Tidak bisa apa-apa", "Tonton rekaman kelasnya", "Harus daftar ulang", "Minta uang kembali"],
    c: 1,
    f: "Live Class menyediakan rekaman, jadi nggak takut ketinggalan."
  },
  {
    q: "Fitur kartu belajar ringkas untuk menghafal konsep & rumus disebut…",
    a: ["Scorecard", "Flashcard", "Giftcard", "Postcard"],
    c: 1,
    f: "Flashcard bikin hafalan rumus jadi lebih cepat."
  },
  {
    q: "Fitur untuk melihat posisimu dibanding peserta lain se-Indonesia adalah…",
    a: ["Kalender", "Ranking Nilai Nasional", "Materi", "Fitur Free"],
    c: 1,
    f: "Ranking Nasional membantu mengukur peluang lolos secara nyata."
  },
  {
    q: "Di fitur Materi Cerebrum, apa saja yang tersedia?",
    a: ["Video, PDF, e-book & flashcard", "Hanya buku cetak", "Hanya podcast", "Game online"],
    c: 0,
    f: "Pustaka Materi lengkap untuk belajar cepat maupun mendalam."
  },
  {
    q: "Setiap soal Tryout Cerebrum dilengkapi dengan…",
    a: ["Kunci jawaban saja", "Video pembahasan per soal & PDF pembahasan", "Tidak ada pembahasan", "Stiker lucu"],
    c: 1,
    f: "Ada video pembahasan per soal + PDF pembahasan lengkap."
  },
  {
    q: "Apa manfaat utama fitur Peta Belajar Terstruktur?",
    a: ["Tidak bingung harus mulai belajar dari mana", "Bisa main game", "Dapat diskon belanja", "Bisa chatting dengan teman"],
    c: 0,
    f: "Belajar dibimbing langkah demi langkah, dari konsep sampai soal lanjut."
  },
  {
    q: "Fitur Kalender di Cerebrum berguna untuk…",
    a: ["Melihat jadwal belajar, live class & tryout", "Melihat cuaca", "Menghitung nilai rapor", "Memesan tiket"],
    c: 0,
    f: "Semua jadwal dalam satu tampilan agar persiapan tetap on-track."
  },
  {
    q: "Fitur untuk memantau progres belajar (materi selesai, skor, kelemahan) adalah…",
    a: ["Tracking Belajar", "Flashcard", "Live Class", "Bank Soal"],
    c: 0,
    f: "Tracking Belajar menunjukkan bagian mana yang perlu diperbaiki."
  },
  {
    q: "Apa itu \"Fitur Free\" di Cerebrum?",
    a: ["Akses materi & latihan pilihan secara gratis", "Free ongkir", "Free pulsa", "Libur belajar"],
    c: 0,
    f: "Mulai belajar tanpa hambatan dengan Fitur Free."
  },
  {
    q: "UTBK terdiri dari dua kelompok tes: Tes Potensi Skolastik (TPS) dan…",
    a: ["Tes Fisik", "Tes Literasi", "Tes Wawancara", "Tes Kesehatan"],
    c: 1,
    f: "Tes Literasi mencakup Literasi B. Indonesia, B. Inggris & Penalaran Matematika."
  },
  {
    q: "TPS adalah singkatan dari…",
    a: ["Tes Potensi Skolastik", "Tes Pintar Siswa", "Tes Pilihan Sekolah", "Tes Prestasi Sains"],
    c: 0
  },
  {
    q: "TKA adalah singkatan dari…",
    a: ["Tes Kemampuan Akademik", "Tes Kecerdasan Anak", "Tes Kelas Akhir", "Tes Komputer Asli"],
    c: 0,
    f: "TKA adalah asesmen terstandar berbasis komputer dari pemerintah."
  },
  {
    q: "Maksimal berapa program studi yang boleh dipilih di SNBT?",
    a: ["1", "2", "4", "10"],
    c: 2,
    f: "Maksimal 4 prodi, dan urutannya menunjukkan prioritas."
  },
  {
    q: "Peserta SNBT boleh ikut UTBK 2026 sebanyak…",
    a: ["1 kali", "2 kali", "3 kali", "Sepuasnya"],
    c: 0,
    f: "Cuma sekali — makanya latihan Tryout itu penting!"
  },
  {
    q: "Pada soal Pilihan Ganda UTBK, jawaban yang salah akan…",
    a: ["Mengurangi poin", "Tidak mengurangi poin", "Membuat ujian gagal", "Dikali dua"],
    c: 1,
    f: "Jawaban salah atau kosong tidak mengurangi poin."
  },
  {
    q: "Mata uji WAJIB di TKA adalah…",
    a: ["Bahasa Indonesia, Matematika, Bahasa Inggris", "Fisika, Kimia, Biologi", "Sejarah, Geografi, Ekonomi", "Olahraga & Seni"],
    c: 0,
    f: "Ditambah 2 mata uji pilihan sesuai minat."
  },
  {
    q: "Berapa lama durasi satu sesi kelas Cerebrum?",
    a: ["15 menit", "60 menit", "3 jam", "Seharian"],
    c: 1,
    f: "Satu sesi 60 menit: materi, diskusi, tanya jawab, lalu latihan di LMS."
  },
  {
    q: "Belajar \"synchronous\" di Cerebrum artinya…",
    a: ["Belajar langsung real-time lewat Zoom/Google Meet", "Belajar sendiri tanpa guru", "Belajar lewat surat", "Belajar sambil tidur"],
    c: 0,
    f: "Asynchronous = lewat video pembelajaran yang bisa ditonton kapan saja."
  },
  {
    q: "Benar atau Salah: Siswa yang sudah lulus SNBP boleh ikut SNBT di tahun yang sama.",
    a: ["Benar", "Salah"],
    c: 1,
    f: "Yang sudah lulus SNBP 2024–2026 tidak dapat mengikuti SNBT 2026."
  },
  {
    q: "Benar atau Salah: Tryout Cerebrum memakai sistem CAT seperti ujian asli.",
    a: ["Benar", "Salah"],
    c: 0
  },
  {
    q: "Selain Cerebrum, platform di ekosistem yang sama untuk persiapan CPNS adalah…",
    a: ["JadiASN", "JadiPrajurit", "TOEFL Academy", "JagoTPA"],
    c: 0,
    f: "Ekosistem Cerebrum punya 21 platform & program!"
  },
  {
    q: "Apa tagline Team SEOBRUM di Product Knowledge Center?",
    a: ["From #MissionZEROPossible to #BeNumberONE", "Just Do It", "Belajar Itu Mahal", "Santai Dulu Aja"],
    c: 0,
    f: "#MissionZEROPossible → #BeNumberONE 🚀"
  }
];
