# Cerebrum Quiz 🧠

Game quiz seru ala kuis live (pakai **kode PIN**) untuk menguji pemahaman tentang aplikasi **Cerebrum**.
Materi soal diambil dari [Product Knowledge Center — Team SEOBRUM](https://product-knowledge-center.netlify.app/).

## Cara main
1. **Host** buka website di laptop/proyektor → klik **🎤 Jadi Host** → pilih jumlah soal & waktu → **Buat Room**.
2. Layar host menampilkan **PIN 6 digit** + QR code.
3. **Pemain** buka website yang sama di HP → masukkan PIN (atau scan QR) → isi nama & pilih avatar.
4. Host klik **Mulai**. Game dibagi **3 sesi** (Pemanasan ×1, Kejar-kejaran ×1.5, Penentuan ×2 poin) jadi yang tertinggal masih bisa menyalip. Jawab secepat mungkin — makin cepat makin besar poinnya, jawab benar beruntun dapat bonus 🔥.
5. Setelah tiap soal muncul **papan peringkat** beranimasi (naik ▲ / turun ▼ dan selisih poin), di akhir tiap sesi ada klasemen + Bintang Sesi ⭐, dan di akhir muncul podium juara 🥇🥈🥉.

Ada juga **🎯 Main Solo** untuk latihan sendiri tanpa PIN.

## Teknologi
- HTML + CSS + JavaScript murni (tanpa build).
- Koneksi realtime host ↔ pemain lewat [PeerJS](https://peerjs.com/) (WebRTC), jadi **tidak butuh server/database**. Host berperan sebagai "server" — **tab host harus tetap terbuka** selama game.
- Bisa di-hosting statis (Vercel).

## Ubah / tambah soal
Edit `questions.js`. Format:
```js
{ q: "Pertanyaan?", a: ["Opsi A", "Opsi B", "Opsi C", "Opsi D"], c: 1, f: "Fun fact (opsional)" }
```
`c` = indeks jawaban benar (mulai dari 0). Untuk soal Benar/Salah cukup 2 opsi.

## Jalankan di komputer
Klik kanan `server/serve.ps1` → *Run with PowerShell*, lalu buka http://localhost:5510/
