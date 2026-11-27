# Cerebrum Quiz 🧠

Game quiz seru ala kuis live (pakai **kode PIN**) untuk menguji pemahaman tentang aplikasi **Cerebrum**.
Materi soal diambil dari [Product Knowledge Center — Team SEOBRUM](https://product-knowledge-center.netlify.app/).

## Cara main
1. **Host** buka website di laptop/proyektor → klik **🎤 Jadi Host** → pilih jumlah soal & waktu → **Buat Room**.
2. Layar host menampilkan **PIN 6 digit** + QR code.
3. **Pemain** buka website yang sama di HP → masukkan PIN (atau scan QR) → isi nama & pilih avatar.
4. Host klik **Mulai**. Game dibagi **3 sesi** (Pemanasan ×1, Kejar-kejaran ×1.5, Penentuan ×2 poin) jadi yang tertinggal masih bisa menyalip. Jawab secepat mungkin — makin cepat makin besar poinnya, jawab benar beruntun dapat bonus 🔥.
5. Setelah tiap soal muncul **papan peringkat** di layar host **dan di HP setiap peserta** beranimasi (naik ▲ / turun ▼ dan selisih poin), di akhir tiap sesi ada klasemen + Bintang Sesi ⭐, dan di akhir muncul podium juara 🥇🥈🥉.

Ada juga **🎯 Main Solo** untuk latihan sendiri tanpa PIN.

## Mode game
Saat klik **Jadi Host**, pilih salah satu:
- **🏆 Quiz Interaktif** — 4 sesi bertopik × 15 soal (bisa 5/10/15), tiap sesi soal baru & juara 1-2-3 sendiri, lalu juara umum:
  1. 🧠 Product Knowledge · 2. 🎓 UTBK · 3. 🏛️ CPNS · 4. 🔎 SEO. Soal diatur lewat field `cat` di `questions.js` (pk/utbk/cpns/seo).
- **🗺️ Balapan Peta** — 30 soal (22 reguler + 8 HOTS). Pemain berjalan di peta 40 petak; pertama sampai 🏁 menang.
  - Benar +1 petak · soal HOTS +1 · penjawab benar tercepat +1.
  - Soal HOTS selalu didahului layar **clue**. Bank soal HOTS ada di `questions-hots.js`.
  - Senjata/skill didapat dari **3x benar beruntun** dan tiap **benar soal HOTS**; tas maks **3**:
    ❄️ Freeze (lawan tidak bisa jawab soal berikutnya) · 💣 Bom (lawan mundur 2) · 🚀 Roket (maju 3) ·
    🛡️ Perisai (tahan 1 serangan) · 💡 Bocoran (hapus 2 jawaban salah).

## Teknologi
- HTML + CSS + JavaScript murni (tanpa build).
- Koneksi realtime host ↔ pemain lewat broker MQTT publik di WebSocket aman port 443 (`wss://public.cloud.shiftr.io`, cadangan EMQX & HiveMQ) — `net.js` + `assets/mqtt.min.js` (mqtt.js, MIT). Jalan di data seluler maupun Wi-Fi kantor, **tidak butuh server/database**. Host berperan sebagai "server" — **tab host harus tetap terbuka** selama game.
- Bisa di-hosting statis (Vercel).

## Ubah / tambah soal
Edit `questions.js`. Format:
```js
{ q: "Pertanyaan?", a: ["Opsi A", "Opsi B", "Opsi C", "Opsi D"], c: 1, f: "Fun fact (opsional)" }
```
`c` = indeks jawaban benar (mulai dari 0). Untuk soal Benar/Salah cukup 2 opsi.

## Jalankan di komputer
Klik kanan `server/serve.ps1` → *Run with PowerShell*, lalu buka http://localhost:5510/
