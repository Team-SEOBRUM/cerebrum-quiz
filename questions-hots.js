// Soal HOTS untuk mode Balapan Peta — setiap soal punya "clue" yang ditampilkan lebih dulu.
// Dipakai 8 soal acak per game. Benar = +2 petak & dapat 1 senjata/skill.
// Fokus UTBK (Cerebrum) & CPNS (JadiASN). Fakta angka dari Product Knowledge Center — Team SEOBRUM (2026).
// Format: { q, a: [...], c: indexBenar, clue: "petunjuk", f: "pembahasan singkat" }

window.HOTS = [
  {
    q: "Subtes Penalaran Umum UTBK berisi 30 soal dalam 30 menit. Rata-rata waktu per soal adalah…",
    a: ["1 menit", "30 detik", "2 menit", "45 detik"],
    c: 0,
    clue: "Bagi total waktu dengan jumlah soal.",
    f: "30 menit ÷ 30 soal = 1 menit per soal."
  },
  {
    q: "SKD CPNS: 110 soal dalam 100 menit. Kira-kira berapa waktu untuk satu soal?",
    a: ["± 55 detik", "± 1 menit 10 detik", "± 45 detik", "± 1,5 menit"],
    c: 0,
    clue: "Ubah 100 menit ke detik dulu, lalu bagi 110.",
    f: "6.000 detik ÷ 110 ≈ 54,5 detik."
  },
  {
    q: "Bobot akhir CPNS = SKD 40% + SKB 60%. Jika nilai SKD 80 dan SKB 70, nilai akhirnya…",
    a: ["74", "75", "76", "72"],
    c: 0,
    clue: "Kalikan tiap nilai dengan bobotnya, lalu jumlahkan.",
    f: "0,4 × 80 = 32; 0,6 × 70 = 42; total 74."
  },
  {
    q: "Lanjutkan pola bilangan: 2, 6, 12, 20, 30, …",
    a: ["42", "40", "36", "44"],
    c: 0,
    clue: "Lihat selisih antar-suku: 4, 6, 8, 10, …",
    f: "Selisih bertambah 2 → berikutnya +12 → 42."
  },
  {
    q: "Lanjutkan pola huruf: A, C, F, J, O, …",
    a: ["U", "T", "V", "S"],
    c: 0,
    clue: "Ubah huruf jadi urutan angka (A=1). Selisihnya +2, +3, +4, +5, …",
    f: "O = 15, +6 = 21 = U."
  },
  {
    q: "Jika peserta mengikuti Live Class, ia bisa menonton rekamannya. Rina mengikuti Live Class. Kesimpulan yang tepat…",
    a: ["Rina bisa menonton rekamannya", "Rina tidak bisa menonton rekamannya", "Semua yang menonton rekaman ikut Live Class", "Tidak dapat disimpulkan"],
    c: 0,
    clue: "Pola: Jika P maka Q. P terjadi. Maka…? (Modus Ponens)",
    f: "P → Q, P benar ⇒ Q benar."
  },
  {
    q: "Jika rutin Latsol setiap hari, maka ketelitian meningkat. Ketelitian Dodi tidak meningkat. Kesimpulan yang tepat…",
    a: ["Dodi tidak rutin Latsol setiap hari", "Dodi rutin Latsol setiap hari", "Latsol tidak berguna", "Ketelitian Dodi menurun"],
    c: 0,
    clue: "Pola: Jika P maka Q. Q tidak terjadi. Maka…? (Modus Tollens)",
    f: "P → Q, bukan Q ⇒ bukan P."
  },
  {
    q: "Paket belajar Rp200.000 diskon 25%, lalu dapat cashback 10% dari harga setelah diskon. Biaya bersihnya…",
    a: ["Rp135.000", "Rp130.000", "Rp140.000", "Rp150.000"],
    c: 0,
    clue: "Hitung bertahap: diskon dulu, baru cashback dari harga baru — bukan dijumlah 35%.",
    f: "200.000 − 25% = 150.000; cashback 10% = 15.000 → 135.000."
  },
  {
    q: "Aturan SNBT 2026 untuk 3 pilihan prodi. Kombinasi mana yang TIDAK diperbolehkan?",
    a: ["3 prodi Sarjana (semua akademik)", "2 Sarjana + 1 Diploma Tiga", "1 Sarjana + 2 Diploma Tiga", "3 prodi vokasi, minimal 1 Diploma Tiga"],
    c: 0,
    clue: "Untuk 3 pilihan, minimal satu harus program vokasi.",
    f: "3 pilihan: 2 akademik + 1 vokasi, 1 akademik + 2 vokasi, atau 3 vokasi (min. 1 D3)."
  },
  {
    q: "Hasil tryout: Andi di atas Citra. Budi di bawah Citra. Dewi di atas Andi. Siapa peringkat terendah?",
    a: ["Budi", "Citra", "Andi", "Dewi"],
    c: 0,
    clue: "Susun urutan dari atas ke bawah satu per satu.",
    f: "Dewi > Andi > Citra > Budi."
  },
  {
    q: "Total waktu UTBK 2026: TPS (30 + 20 + 15 + 25 menit) dan Literasi (42,5 + 20 + 42,5 menit). Jumlahnya…",
    a: ["195 menit", "180 menit", "210 menit", "165 menit"],
    c: 0,
    clue: "Jumlahkan TPS dan Literasi secara terpisah, lalu gabungkan.",
    f: "TPS 90 menit + Literasi 105 menit = 195 menit."
  },
  {
    q: "Nilai SKD Rina (ketentuan umum): TWK 70, TIU 75, TKP 170. Apakah Rina lolos nilai ambang batas?",
    a: ["Tidak, karena TIU di bawah 80", "Ya, semua lolos", "Tidak, karena TKP di bawah 166", "Tidak, karena TWK di bawah 65"],
    c: 0,
    clue: "Cek SATU per SATU dengan ambang batasnya: TWK 65, TIU 80, TKP 166.",
    f: "Semua subtes harus lolos; TIU 75 < 80."
  },
  {
    q: "Berapa skor maksimal total SKD CPNS (TWK + TIU + TKP)?",
    a: ["550", "500", "450", "600"],
    c: 0,
    clue: "TWK 30 soal × 5, TIU 35 soal × 5, TKP 45 soal × maks 5.",
    f: "150 + 175 + 225 = 550."
  },
  {
    q: "Di TIU (35 soal), Andi menjawab benar 20, salah 10, dan mengosongkan 5. Nilai TIU Andi…",
    a: ["100", "90", "75", "110"],
    c: 0,
    clue: "Benar = 5 poin. Salah dan kosong = 0 poin (tidak mengurangi).",
    f: "20 × 5 = 100 — salah/kosong tidak dikurangi."
  }
];
