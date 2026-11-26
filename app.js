/* Cerebrum Quiz — game quiz ala kuis live dengan kode PIN.
 * Host (layar besar) jadi "server" lewat PeerJS (WebRTC), pemain gabung pakai PIN 6 digit.
 * Tidak butuh backend: cukup hosting statis (Vercel).
 */
(() => {
  "use strict";

  // ---------- Konstanta ----------
  const PREFIX = "cbrquiz-v1-";
  const SHAPES = ["A", "B", "C", "D"];
  const AVATARS = ["🦊", "🐼", "🐯", "🐸", "🐵", "🦁", "🐧", "🐙", "🦄", "🐨", "🐶", "🐱"];
  const PEER_OPTS = {
    debug: 0,
    config: {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "turn:openrelay.metered.ca:80", username: "openrelayproject", credential: "openrelayproject" },
        { urls: "turn:openrelay.metered.ca:443", username: "openrelayproject", credential: "openrelayproject" },
      ],
    },
  };
  const CHEERS_OK = ["Mantap! 🔥", "Keren banget! 😎", "Jenius! 🧠", "Gaspol! 🚀", "Sempurna! ✨"];
  const CHEERS_BAD = ["Yahh, hampir! 😅", "Gapapa, next! 💪", "Oops! 🙈", "Semangat lagi! ✊"];
  // 3 sesi: poin makin besar tiap sesi, jadi yang tertinggal masih bisa menyalip
  const SESS = [
    { name: "Pemanasan", emoji: "🔥", mult: 1, desc: "Kumpulkan poin sebanyak-banyaknya buat modal awal!" },
    { name: "Kejar-kejaran", emoji: "🏃", mult: 1.5, desc: "Poin naik jadi ×1.5 — saatnya menyalip lawan di depanmu!" },
    { name: "Penentuan", emoji: "👑", mult: 2, desc: "Poin DOBEL ×2! Klasemen masih bisa berubah total." },
  ];
  const SESSIONS = SESS.length;
  const MEDALS = ["🥇", "🥈", "🥉"];

  const $app = document.getElementById("app");
  const render = (html) => { $app.innerHTML = html; window.scrollTo(0, 0); };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch {} },
    del(k) { try { sessionStorage.removeItem(k); } catch {} },
  };

  function toast(msg, ms = 2600) {
    const t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), ms);
  }

  // Siapkan soal: acak urutan soal & opsi (kecuali soal Benar/Salah)
  function buildDeck(n) {
    return shuffle(window.QUESTIONS).slice(0, n).map((q) => {
      if (q.a.length < 4) return { ...q };
      const order = shuffle(q.a.map((_, i) => i));
      return { ...q, a: order.map((i) => q.a[i]), c: order.indexOf(q.c) };
    });
  }
  const calcPoints = (elapsed, total) => Math.round(1000 * (1 - Math.min(elapsed / total, 1) / 2));

  // ---------- Suara (WebAudio, tanpa file) ----------
  let muted = false;
  try { muted = localStorage.getItem("cq-muted") === "1"; } catch {}
  const muteBtn = document.getElementById("muteBtn");
  const syncMute = () => { muteBtn.textContent = muted ? "🔇" : "🔊"; };
  syncMute();
  muteBtn.onclick = () => { muted = !muted; try { localStorage.setItem("cq-muted", muted ? "1" : "0"); } catch {} syncMute(); if (muted) Music.stop(); };

  let ac = null;
  function audio() {
    if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; } }
    if (ac.state === "suspended") ac.resume();
    return ac;
  }
  document.addEventListener("pointerdown", () => audio(), { once: true });
  function tone(freq, dur = 0.12, type = "square", when = 0, vol = 0.08) {
    if (muted) return; const a = audio(); if (!a) return;
    const o = a.createOscillator(), g = a.createGain(), t = a.currentTime + when;
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + 0.02);
  }
  const Sfx = {
    join() { tone(660, .08, "triangle"); tone(990, .12, "triangle", .08); },
    tick() { tone(880, .05, "square", 0, .04); },
    tickLow() { tone(440, .08, "square", 0, .07); },
    go() { [523, 659, 784, 1046].forEach((f, i) => tone(f, .14, "triangle", i * .09, .1)); },
    correct() { [784, 988, 1318].forEach((f, i) => tone(f, .16, "triangle", i * .1, .1)); },
    wrong() { tone(220, .25, "sawtooth", 0, .07); tone(160, .35, "sawtooth", .2, .07); },
    gong() { tone(196, .6, "triangle", 0, .12); tone(294, .6, "triangle", 0, .08); },
    fanfare() { [523, 523, 523, 659, 784, 659, 784, 1046].forEach((f, i) => tone(f, .2, "triangle", i * .14, .1)); },
  };
  // Musik lobby sederhana (looping arpeggio)
  const Music = {
    id: null,
    start() {
      if (this.id || muted) return;
      const notes = [262, 330, 392, 523, 392, 330, 294, 370, 440, 587, 440, 370];
      let i = 0;
      this.id = setInterval(() => { if (!muted) tone(notes[i++ % notes.length], .16, "triangle", 0, .035); }, 220);
    },
    stop() { clearInterval(this.id); this.id = null; },
  };

  // ---------- Confetti ----------
  function confetti(duration = 3500) {
    const c = document.getElementById("confetti"), ctx = c.getContext("2d");
    c.width = innerWidth; c.height = innerHeight;
    const colors = ["#d4ff3a", "#ffffff", "#d4ff3a", "#9b9b9b", "#ffffff"];
    const parts = Array.from({ length: 160 }, () => ({
      x: Math.random() * c.width, y: -20 - Math.random() * c.height * .5,
      w: 6 + Math.random() * 8, h: 8 + Math.random() * 10, vy: 2 + Math.random() * 4,
      vx: -2 + Math.random() * 4, r: Math.random() * 6, vr: -.2 + Math.random() * .4, col: pick(colors),
    }));
    const end = Date.now() + duration;
    (function frame() {
      ctx.clearRect(0, 0, c.width, c.height);
      parts.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.col;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
      });
      if (Date.now() < end) requestAnimationFrame(frame); else ctx.clearRect(0, 0, c.width, c.height);
    })();
  }

  // ---------- Timer helper ----------
  function countdown(seconds, onTick, onDone) {
    const endAt = Date.now() + seconds * 1000; let last = null;
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      if (left !== last) { last = left; onTick(left); }
      if (left <= 0) { clearInterval(id); onDone(); }
    }, 100);
    return () => clearInterval(id);
  }

  function answerButtons(q, { clickable = false, cls = "answers" } = {}) {
    return `<div class="${cls}${q.a.length === 2 ? " two" : ""}">${q.a.map((opt, i) =>
      `<${clickable ? "button" : "div"} class="ans c${i}" data-i="${i}">
        <span class="shape">${SHAPES[i]}</span><span>${esc(opt)}</span><span class="check"></span>
      </${clickable ? "button" : "div"}>`).join("")}</div>`;
  }

  // Papan peringkat ringkas untuk HP: top N + baris "kamu" kalau di luar top N
  function boardRows(sorted, me, n) {
    const row = (x, i) => ({ r: i + 1, n: x.name, av: x.av, sc: x.score, mv: x.move || 0, me: x === me, gap: i > 0 ? sorted[i - 1].score - x.score : null });
    const rows = sorted.slice(0, n).map(row);
    const idx = sorted.indexOf(me);
    if (idx >= n) rows.push(row(me, idx));
    return rows;
  }
  function boardHtml(rows) {
    let prev = 0, out = "";
    for (const x of rows || []) {
      if (x.r > prev + 1) out += `<div class="lb-sep">• • •</div>`;
      prev = x.r;
      const mv = x.mv > 0 ? `<span class="mv up">▲${x.mv}</span>` : x.mv < 0 ? `<span class="mv down">▼${-x.mv}</span>` : `<span class="mv same">•</span>`;
      const gap = x.gap == null ? `<small class="lb-gap lead">Memimpin</small>` : x.gap === 0 ? `<small class="lb-gap">Seri</small>` : `<small class="lb-gap">−${x.gap}</small>`;
      out += `<div class="lb-row${x.me ? " me" : ""}"><span class="lb-rank">${x.r}</span><span class="lb-name">${esc(x.av)} ${esc(x.n)}${x.me ? " · kamu" : ""}</span>${mv}<span class="lb-right"><span class="lb-score">${x.sc}</span>${gap}</span></div>`;
    }
    return `<div class="lb">${out}</div>`;
  }

  // =========================================================
  //  HOME
  // =========================================================
  function home(prefillPin = "") {
    Music.stop();
    render(`
      <div class="center">
        <img class="brand" src="assets/seobrum-logo.png" alt="SEOBRUM" />
        <div class="kicker">Product Knowledge Battle</div>
        <h1 class="logo">Cerebrum <span class="hl">Quiz</span><small>Seberapa kenal kamu dengan aplikasi Cerebrum?</small></h1>
        <form class="card" id="pinForm" autocomplete="off">
          <b>Masukkan PIN room</b>
          <input class="input" id="pinInput" inputmode="numeric" pattern="[0-9]*" maxlength="6" placeholder="000000" value="${esc(prefillPin)}" aria-label="PIN room" />
          <button class="btn" type="submit">Masuk →</button>
        </form>
        <div class="row">
          <button class="btn white" id="hostBtn">Jadi Host</button>
          <button class="btn outline" id="soloBtn">Main Solo</button>
        </div>
        <p class="foot">Host buka game di layar besar, pemain masukkan PIN di HP masing-masing. Materi soal dari Product Knowledge Center — Team SEOBRUM.</p>
      </div>`);
    const inp = document.getElementById("pinInput");
    inp.addEventListener("input", () => { inp.value = inp.value.replace(/\D/g, "").slice(0, 6); });
    if (!prefillPin) inp.focus();
    document.getElementById("pinForm").onsubmit = (e) => {
      e.preventDefault();
      const pin = inp.value.trim();
      if (!/^\d{6}$/.test(pin)) { toast("PIN harus 6 angka ya 🙂"); return; }
      Player.connect(pin);
    };
    document.getElementById("hostBtn").onclick = () => Host.setup();
    document.getElementById("soloBtn").onclick = () => Solo.setup();
  }

  // Pilihan pengaturan (dipakai host & solo)
  function settingsCard(title, btnLabel, onGo, { sessions = false } = {}) {
    const total = window.QUESTIONS.length;
    let counts, n;
    if (sessions) {
      counts = [3, 5, 7, 10].filter((c) => c * SESSIONS <= total);
      if (!counts.length) counts = [Math.max(1, Math.floor(total / SESSIONS))];
      n = counts.includes(5) ? 5 : counts[counts.length - 1];
    } else {
      counts = [10, 15, 20].filter((c) => c < total).concat([total]);
      n = counts[0];
    }
    let t = 20;
    const label = (c) => sessions ? `${c} soal` : c === total ? `Semua (${c})` : c;
    const sumText = () => `${SESSIONS} sesi × ${n} soal = <b>${n * SESSIONS} soal</b>. Poin: ${SESS.map((s, i) => `Sesi ${i + 1} ×${s.mult}`).join(" · ")}`;
    render(`
      <div class="center">
        <h1 class="logo">${title}</h1>
        <div class="card">
          <b>${sessions ? `Soal per sesi (${SESSIONS} sesi)` : "Jumlah soal"}</b>
          <div class="chips" id="cnt">${counts.map((c) => `<button class="chip${c === n ? " on" : ""}" data-v="${c}">${label(c)}</button>`).join("")}</div>
          ${sessions ? `<div class="muted" id="sum">${sumText()}</div>` : ""}
          <b>Waktu per soal</b>
          <div class="chips" id="tm">${[10, 20, 30].map((s) => `<button class="chip${s === t ? " on" : ""}" data-v="${s}">${s} detik</button>`).join("")}</div>
          <button class="btn green" id="go">${btnLabel}</button>
        </div>
        <button class="btn ghost" id="back">← Kembali ke beranda</button>
      </div>`);
    const bindChips = (id, set) => document.querySelectorAll(`#${id} .chip`).forEach((b) => b.onclick = () => {
      document.querySelectorAll(`#${id} .chip`).forEach((x) => x.classList.remove("on"));
      b.classList.add("on"); set(+b.dataset.v); Sfx.tick();
    });
    bindChips("cnt", (v) => { n = v; const s = document.getElementById("sum"); if (s) s.innerHTML = sumText(); });
    bindChips("tm", (v) => t = v);
    document.getElementById("go").onclick = (e) => { e.target.disabled = true; onGo(n, t); };
    document.getElementById("back").onclick = () => { history.replaceState(null, "", location.pathname); home(); };
  }

  // =========================================================
  //  HOST
  // =========================================================
  const Host = {
    peer: null, pin: null, players: new Map(), deck: [], qi: -1, time: 20,
    phase: "lobby", answers: new Map(), qStart: 0, stopTimer: null, nQ: 15, perSess: 5, lastPrev: null,

    setup() {
      settingsCard("Buat <span class=\"hl\">Room</span>", "Buat Room →", (n, t) => { this.perSess = n; this.nQ = n * SESSIONS; this.time = t; this.open(); }, { sessions: true });
    },
    sess(qi = this.qi) { return Math.min(SESSIONS - 1, Math.floor(Math.max(0, qi) / this.perSess)); },

    open(attempt = 0) {
      this.pin = String(Math.floor(100000 + Math.random() * 900000));
      render(`<div class="center"><div class="spinner"></div><p>Membuat room…</p></div>`);
      const peer = new Peer(PREFIX + this.pin, PEER_OPTS);
      this.peer = peer;
      peer.on("open", () => { this.lobby(); this.keepAwake(); });
      peer.on("connection", (conn) => this.onConn(conn));
      peer.on("disconnected", () => { try { peer.reconnect(); } catch {} });
      peer.on("error", (err) => {
        if (err.type === "unavailable-id" && attempt < 5) { peer.destroy(); this.open(attempt + 1); return; }
        if (err.type === "peer-unavailable") return;
        console.warn(err);
        if (this.phase === "lobby" && !document.getElementById("pinBig")) {
          render(`<div class="center"><h2>Gagal membuat room 😢</h2><p>Cek koneksi internet lalu coba lagi.</p><button class="btn white" onclick="location.reload()">Coba lagi</button></div>`);
        }
      });
      window.addEventListener("beforeunload", (e) => { if (this.players.size) { e.preventDefault(); e.returnValue = ""; } });
      document.addEventListener("keydown", (e) => {
        if ((e.code === "Space" || e.code === "Enter") && document.activeElement.tagName !== "INPUT") {
          const b = document.getElementById("nextBtn"); if (b && !b.disabled) { e.preventDefault(); b.click(); }
        }
      });
    },

    async keepAwake() { try { await navigator.wakeLock?.request("screen"); } catch {} },

    joinUrl() { return `${location.origin}${location.pathname}?pin=${this.pin}`; },

    // ---- Koneksi pemain ----
    onConn(conn) {
      conn.on("data", (msg) => this.onMsg(conn, msg));
      conn.on("close", () => this.onClose(conn));
      conn.on("error", () => this.onClose(conn));
    },
    send(p, msg) { try { if (p.conn && p.conn.open) p.conn.send(msg); } catch {} },
    onClose(conn) {
      for (const p of this.players.values()) {
        if (p.conn === conn) {
          p.online = false; p.conn = null;
          if (this.phase === "lobby") { this.players.delete(p.key); this.drawPlayers(); }
          else this.checkAllAnswered();
        }
      }
    },
    onlinePlayers() { return [...this.players.values()].filter((p) => p.online); },

    onMsg(conn, msg) {
      if (!msg || typeof msg !== "object") return;
      if (msg.t === "hello") { conn.send({ t: "room", ok: true }); return; }
      if (msg.t === "join") {
        const name = String(msg.name || "").trim().slice(0, 15);
        const key = name.toLowerCase();
        if (!name) { conn.send({ t: "joined", ok: false, err: "Nama tidak boleh kosong" }); return; }
        const existing = this.players.get(key);
        if (existing && existing.online && existing.conn !== conn && existing.tok !== msg.tok) {
          conn.send({ t: "joined", ok: false, err: "Nama sudah dipakai, coba nama lain 😉" }); return;
        }
        if (existing && existing.conn && existing.conn !== conn) { const old = existing.conn; existing.conn = null; try { old.close(); } catch {} }
        const av = AVATARS.includes(msg.av) ? msg.av : pick(AVATARS);
        const p = existing || { key, name, av, score: 0, streak: 0, sess: SESS.map(() => 0), move: 0 };
        p.conn = conn; p.online = true; p.av = av; p.tok = msg.tok;
        this.players.set(key, p);
        conn.send({ t: "joined", ok: true, name: p.name, av: p.av, score: p.score, started: this.phase !== "lobby" });
        if (this.phase === "lobby") { Sfx.join(); this.drawPlayers(); }
        else if (this.phase === "question" && !this.answers.has(key)) this.send(p, this.questionMsg());
        return;
      }
      if (msg.t === "answer") {
        const p = [...this.players.values()].find((x) => x.conn === conn);
        if (!p || this.phase !== "question" || msg.qi !== this.qi || this.answers.has(p.key)) return;
        const choice = +msg.choice;
        if (!(choice >= 0 && choice < this.deck[this.qi].a.length)) return;
        this.answers.set(p.key, { choice, elapsed: (Date.now() - this.qStart) / 1000 });
        this.send(p, { t: "ack" });
        Sfx.tick();
        const el = document.getElementById("ansNum"); if (el) el.textContent = this.answers.size;
        this.checkAllAnswered();
      }
    },

    // ---- Lobby ----
    lobby() {
      this.phase = "lobby";
      const host = location.host || "cerebrum-quiz";
      render(`
        <div class="topbar">
          <img class="brand" src="assets/seobrum-logo.png" alt="SEOBRUM" />
          <div class="pin-label"><b>Buka di HP</b>${esc(host)}</div>
          <div class="pin-label"><b>PIN Room</b><span class="pin-big" id="pinBig">${this.pin.slice(0, 3)} ${this.pin.slice(3)}</span></div>
          <div id="qr" title="Scan untuk gabung"></div>
        </div>
        <div class="lobby-mid">
          <div class="count-badge"><span id="pCount">0</span> pemain</div>
          <h1 class="logo" style="font-size:clamp(26px,4.4vw,46px)">Cerebrum <span class="hl">Quiz</span></h1>
          <button class="btn green" id="nextBtn" disabled>Mulai →</button>
        </div>
        <div id="players"></div>
        <p class="foot" style="margin:auto auto 16px;text-align:center">Klik nama pemain untuk mengeluarkannya. ${SESSIONS} sesi × ${this.perSess} soal · ${this.time} detik/soal</p>`);
      try { new QRCode(document.getElementById("qr"), { text: this.joinUrl(), width: 192, height: 192, correctLevel: QRCode.CorrectLevel.M }); } catch {}
      document.getElementById("nextBtn").onclick = () => this.start();
      this.drawPlayers();
      Music.start();
    },
    drawPlayers() {
      const box = document.getElementById("players"); if (!box) return;
      const list = this.onlinePlayers();
      document.getElementById("pCount").textContent = list.length;
      document.getElementById("nextBtn").disabled = list.length === 0;
      box.innerHTML = list.length
        ? `<div class="players">${list.map((p) => `<div class="player-chip" data-k="${esc(p.key)}" title="Keluarkan">${p.av} ${esc(p.name)}</div>`).join("")}</div>`
        : `<div class="waiting-text">Menunggu pemain bergabung… ⏳</div>`;
      box.querySelectorAll(".player-chip").forEach((el) => el.onclick = () => {
        const p = this.players.get(el.dataset.k); if (!p) return;
        this.send(p, { t: "kicked" }); setTimeout(() => { try { p.conn && p.conn.close(); } catch {} }, 200);
        this.players.delete(p.key); this.drawPlayers();
      });
    },

    // ---- Game ----
    start() {
      Music.stop();
      this.deck = buildDeck(this.nQ); this.qi = -1; this.lastPrev = null;
      for (const p of this.players.values()) { p.score = 0; p.streak = 0; p.sess = SESS.map(() => 0); p.move = 0; }
      this.onlinePlayers().forEach((p) => this.send(p, { t: "getready", total: this.deck.length, sessions: SESSIONS, per: this.perSess }));
      this.sessionIntro(0);
    },

    // Layar pembuka tiap sesi
    sessionIntro(s) {
      this.phase = "intro";
      const info = SESS[s];
      const { sorted, rank } = this.rankOf();
      const lead = sorted[0];
      this.onlinePlayers().forEach((p) => this.send(p, {
        t: "session", s, n: SESSIONS, name: info.name, emoji: info.emoji, mult: info.mult, per: this.perSess,
        rank: s > 0 ? rank(p) : null, gapLead: s > 0 && lead ? lead.score - p.score : 0,
      }));
      const top = s > 0 ? sorted.slice(0, 3) : [];
      render(`
        <div class="center">
          ${this.sessSteps(s)}
          <div class="title-pill">Sesi ${s + 1}: ${info.name}</div>
          <div class="big-emoji" id="cd">${info.emoji}</div>
          <div class="mult-pill">Poin ×${info.mult}</div>
          <p style="font-size:clamp(18px,2.4vw,24px);margin:0">${info.desc}</p>
          ${top.length ? `<div class="mini-top">${top.map((p, i) => `<span>${MEDALS[i]} ${p.av} ${esc(p.name)} <b>${p.score}</b></span>`).join("")}</div>
            ${sorted.length > 1 ? `<p class="foot">Selisih #1 dan #2: <b>${sorted[0].score - sorted[1].score}</b> poin — dengan poin ×${info.mult}, satu jawaban cepat bisa membalik keadaan!</p>` : ""}` : ""}
        </div>
        <div class="host-actions"><button class="btn white" id="nextBtn">Mulai Sesi ${s + 1} ▶</button></div>`);
      if (s === 0) Sfx.go(); else Sfx.gong();
      const btn = document.getElementById("nextBtn");
      btn.onclick = () => {
        btn.disabled = true; this.phase = "countdown";
        const cd = document.getElementById("cd"); let n = 3;
        cd.style.fontSize = "140px"; cd.textContent = n; Sfx.tickLow();
        const id = setInterval(() => {
          n--; if (n > 0) { cd.textContent = n; Sfx.tickLow(); }
          else { clearInterval(id); this.next(); }
        }, 1000);
      };
    },
    sessSteps(s) {
      return `<div class="sess-steps">${SESS.map((x, i) => `<span class="sess-step${i < s ? " done" : i === s ? " on" : ""}">${i < s ? "✔ " : ""}Sesi ${i + 1} · ×${x.mult}</span>`).join("")}</div>`;
    },
    questionMsg() {
      const q = this.deck[this.qi]; const s = this.sess();
      return {
        t: "question", qi: this.qi, total: this.deck.length, q: q.q, a: q.a, time: this.time,
        left: Math.max(1, Math.round(this.time - (Date.now() - this.qStart) / 1000)),
        s, qs: this.qi % this.perSess, per: this.perSess, mult: SESS[s].mult,
      };
    },
    next() {
      this.qi++;
      if (this.qi >= this.deck.length) return this.finish();
      const q = this.deck[this.qi]; const s = this.sess();
      this.phase = "question"; this.answers = new Map(); this.qStart = Date.now();
      render(`
        <div class="q-head">${esc(q.q)}</div>
        <div class="q-mid">
          <div class="timer" id="timer">${this.time}</div>
          <div class="q-brain" aria-hidden="true"></div>
          <div class="ans-count"><b id="ansNum">0</b>Jawaban</div>
        </div>
        ${answerButtons(q)}
        <div class="q-progress">Sesi ${s + 1} · Soal ${(this.qi % this.perSess) + 1}/${this.perSess} · Poin ×${SESS[s].mult} · PIN ${this.pin}</div>
        <div class="host-actions"><button class="btn white" id="nextBtn">Lewati ⏭</button></div>`);
      document.getElementById("nextBtn").onclick = () => this.reveal();
      this.onlinePlayers().forEach((p) => this.send(p, this.questionMsg()));
      Sfx.go();
      this.stopTimer = countdown(this.time, (left) => {
        const t = document.getElementById("timer"); if (!t) return;
        t.textContent = left; t.classList.toggle("low", left <= 5);
        if (left <= 5 && left > 0) Sfx.tickLow();
      }, () => this.reveal());
    },
    checkAllAnswered() {
      if (this.phase !== "question") return;
      const online = this.onlinePlayers();
      if (online.length && online.every((p) => this.answers.has(p.key))) setTimeout(() => this.reveal(), 400);
    },
    rankOf() {
      const sorted = [...this.players.values()].sort((a, b) => b.score - a.score);
      return { sorted, rank: (p) => sorted.indexOf(p) + 1 };
    },
    reveal() {
      if (this.phase !== "question") return;
      this.phase = "reveal"; this.stopTimer && this.stopTimer();
      const q = this.deck[this.qi]; const s = this.sess(); const mult = SESS[s].mult;
      // simpan posisi sebelum soal ini untuk animasi kejar-kejaran
      const before = this.rankOf().sorted;
      const hadScore = before.some((p) => p.score > 0);
      this.lastPrev = { rank: new Map(before.map((p, i) => [p.key, i + 1])), score: new Map(before.map((p) => [p.key, p.score])) };
      const counts = q.a.map(() => 0);
      const gained = new Map();
      for (const p of this.players.values()) {
        const ans = this.answers.get(p.key);
        if (ans) counts[ans.choice]++;
        if (ans && ans.choice === q.c) {
          p.streak++;
          const pts = Math.round((calcPoints(ans.elapsed, this.time) + Math.min(p.streak - 1, 5) * 100) * mult);
          p.score += pts; p.sess[s] += pts; gained.set(p.key, pts);
        } else p.streak = 0;
      }
      const { sorted, rank } = this.rankOf();
      for (const p of this.players.values()) {
        p.move = hadScore ? this.lastPrev.rank.get(p.key) - rank(p) : 0;
        const ans = this.answers.get(p.key);
        const idx = sorted.indexOf(p);
        const ahead = idx > 0 ? sorted[idx - 1] : null;
        const behindMe = sorted[idx + 1];
        this.send(p, {
          t: "result", answered: !!ans, correct: !!ans && ans.choice === q.c, gained: gained.get(p.key) || 0,
          score: p.score, rank: rank(p), total: sorted.length, streak: p.streak, move: p.move, mult, s,
          behind: ahead ? { name: ahead.name, gap: ahead.score - p.score } : null,
          chaser: idx === 0 && behindMe ? { name: behindMe.name, gap: p.score - behindMe.score } : null,
          right: q.a[q.c], board: boardRows(sorted, p, 5), qn: (this.qi % this.perSess) + 1, per: this.perSess,
        });
      }
      const max = Math.max(1, ...counts);
      render(`
        <div class="q-head">${esc(q.q)}</div>
        <div class="chart">${q.a.map((_, i) => `
          <div class="bar-wrap">
            <div class="bar-num">${counts[i]}${i === q.c ? " ✔" : ""}</div>
            <div class="bar${i === q.c ? " ok" : ""}" data-h="${Math.round((counts[i] / max) * 100)}"></div>
            <div class="bar-foot${i === q.c ? " ok" : ""}">${SHAPES[i]}</div>
          </div>`).join("")}
        </div>
        ${q.f ? `<div class="fact">💡 ${esc(q.f)}</div>` : ""}
        ${answerButtons(q)}
        <div class="host-actions"><button class="btn white" id="nextBtn">Papan Peringkat 🏆</button></div>`);
      document.querySelectorAll(".answers .ans").forEach((el, i) => {
        if (i === q.c) { el.classList.add("right"); el.querySelector(".check").textContent = "✔"; }
        else { el.classList.add("dim"); el.querySelector(".check").textContent = "✖"; }
      });
      requestAnimationFrame(() => setTimeout(() => document.querySelectorAll(".bar").forEach((b) => b.style.height = `calc(${b.dataset.h}% - 70px)`), 50));
      Sfx.gong();
      document.getElementById("nextBtn").onclick = () => this.leaderboard();
    },

    // Papan peringkat setelah tiap soal — baris bergeser naik/turun (kejar-kejaran)
    leaderboard() {
      this.phase = "leaderboard";
      const s = this.sess();
      const endOfSess = (this.qi + 1) % this.perSess === 0 || this.qi + 1 >= this.deck.length;
      const { sorted } = this.rankOf();
      const shown = sorted.slice(0, 8);
      const prev = this.lastPrev;
      const row = (p, i) => {
        const ahead = i > 0 ? sorted[i - 1] : null;
        const mv = p.move > 0 ? `<span class="mv up">▲${p.move}</span>` : p.move < 0 ? `<span class="mv down">▼${-p.move}</span>` : `<span class="mv same">•</span>`;
        const gap = !ahead ? `<small class="lb-gap lead">👑 Memimpin</small>`
          : ahead.score === p.score ? `<small class="lb-gap">Seri dengan #${i}</small>`
          : `<small class="lb-gap">−${ahead.score - p.score} dari #${i}</small>`;
        const from = prev ? prev.score.get(p.key) ?? 0 : p.score;
        return `<div class="lb-row flip${p.move > 0 ? " rising" : ""}" data-k="${esc(p.key)}">
            <span class="lb-rank">${i + 1}</span>
            <span class="lb-name">${p.av} ${esc(p.name)}${p.streak >= 2 ? `<span class="streak">🔥${p.streak}</span>` : ""}</span>
            ${mv}
            <span class="lb-right"><span class="lb-score" data-from="${from}" data-to="${p.score}">${from}</span>${gap}</span>
          </div>`;
      };
      render(`
        <div class="center" style="justify-content:flex-start;padding-top:24px">
          ${this.sessSteps(s)}
          <div class="title-pill">🏆 Papan Peringkat</div>
          <div class="lb-sub">Sesi ${s + 1} · Soal ${(this.qi % this.perSess) + 1}/${this.perSess} · Poin ×${SESS[s].mult}</div>
          <div class="lb" id="lb">${shown.map(row).join("") || `<p>Belum ada pemain.</p>`}</div>
          ${sorted.length > shown.length ? `<p class="foot">+${sorted.length - shown.length} pemain lainnya — cek HP masing-masing untuk peringkatmu</p>` : ""}
        </div>
        <div class="host-actions"><button class="btn white" id="nextBtn">${endOfSess ? `Hasil Sesi ${s + 1} 🏁` : "Soal berikutnya ▶"}</button></div>`);
      this.animateLb(prev);
      for (const p of this.players.values()) {
        this.send(p, { t: "board", s, qn: (this.qi % this.perSess) + 1, per: this.perSess, mult: SESS[s].mult, rank: sorted.indexOf(p) + 1, total: sorted.length, score: p.score, rows: boardRows(sorted, p, 10) });
      }
      document.getElementById("nextBtn").onclick = () => endOfSess ? this.sessionEnd(s) : this.next();
    },
    animateLb(prev) {
      const rows = [...document.querySelectorAll("#lb .lb-row")];
      if (!rows.length) return;
      const h = rows[0].offsetHeight + 10;
      rows.forEach((r, i) => {
        const old = prev ? prev.rank.get(r.dataset.k) : null;
        const from = old ? Math.min(old, rows.length + 1) - 1 : i;
        r.style.transition = "none";
        r.style.transform = `translateY(${(from - i) * h}px)`;
      });
      void document.body.offsetHeight;
      setTimeout(() => {
        rows.forEach((r) => { r.style.transition = "transform .9s cubic-bezier(.3,1.2,.4,1)"; r.style.transform = "translateY(0)"; });
        if (rows.some((r) => r.classList.contains("rising"))) Sfx.join();
      }, 450);
      // hitung naik skor
      const els = [...document.querySelectorAll("#lb .lb-score")];
      const t0 = performance.now() + 300, dur = 1000;
      (function step(now) {
        const k = Math.max(0, Math.min(1, (now - t0) / dur));
        els.forEach((e) => { const a = +e.dataset.from, b = +e.dataset.to; e.textContent = Math.round(a + (b - a) * k); });
        if (k < 1 && document.body.contains(els[0])) requestAnimationFrame(step);
      })(performance.now());
    },
    standingsTable(sorted, upto) {
      const cols = SESS.slice(0, upto + 1);
      return `<div class="st-wrap"><table class="st">
        <thead><tr><th>#</th><th class="nm">Pemain</th>${cols.map((_, i) => `<th>Sesi ${i + 1}</th>`).join("")}<th>Total</th></tr></thead>
        <tbody>${sorted.map((p, i) => `<tr${i < 3 ? ` class="top${i + 1}"` : ""}>
          <td>${i + 1}</td><td class="nm">${p.av} ${esc(p.name)}</td>
          ${cols.map((_, j) => `<td>${p.sess[j] || 0}</td>`).join("")}<td class="tot">${p.score}</td></tr>`).join("")}</tbody>
      </table></div>`;
    },

    // Akhir tiap sesi: klasemen lengkap + bintang sesi
    sessionEnd(s) {
      this.phase = "sessionEnd";
      const last = s + 1 >= SESSIONS;
      const { sorted, rank } = this.rankOf();
      const bySess = [...this.players.values()].sort((a, b) => b.sess[s] - a.sess[s]);
      const star = bySess[0] && bySess[0].sess[s] > 0 ? bySess[0] : null;
      for (const p of this.players.values()) {
        const idx = sorted.indexOf(p); const ahead = idx > 0 ? sorted[idx - 1] : null;
        this.send(p, {
          t: "sessionEnd", s, n: SESSIONS, rank: rank(p), total: sorted.length, sessPts: p.sess[s], sessRank: bySess.indexOf(p) + 1,
          score: p.score, ahead: ahead ? { name: ahead.name, gap: ahead.score - p.score } : null,
          next: last ? null : { name: SESS[s + 1].name, mult: SESS[s + 1].mult }, star: star ? star.name : null,
        });
      }
      if (last) return this.finish();
      render(`
        <div class="center" style="justify-content:flex-start;padding-top:24px">
          ${this.sessSteps(s + 1)}
          <div class="title-pill">🏁 Sesi ${s + 1} Selesai!</div>
          ${star ? `<div class="star-card">⭐ Bintang Sesi ${s + 1}: <b>${star.av} ${esc(star.name)}</b> (+${star.sess[s]} poin)</div>` : ""}
          ${this.standingsTable(sorted, s)}
          <p class="foot">Berikutnya: <b>Sesi ${s + 2} — ${SESS[s + 1].name}</b>, poin ×${SESS[s + 1].mult}. Masih ada kesempatan menyalip! 🏃</p>
        </div>
        <div class="host-actions"><button class="btn white" id="nextBtn">Lanjut ke Sesi ${s + 2} ▶</button></div>`);
      Sfx.fanfare(); if (star) confetti(2000);
      document.getElementById("nextBtn").onclick = () => this.sessionIntro(s + 1);
    },
    finish() {
      this.phase = "end"; this.stopTimer && this.stopTimer();
      const { sorted, rank } = this.rankOf();
      for (const p of this.players.values()) this.send(p, { t: "end", rank: rank(p), score: p.score, total: sorted.length, sess: p.sess });
      const stars = SESS.map((_, s) => {
        const best = [...this.players.values()].sort((a, b) => b.sess[s] - a.sess[s])[0];
        return best && best.sess[s] > 0 ? `<span>⭐ Sesi ${s + 1}: ${best.av} ${esc(best.name)}</span>` : "";
      }).join("");
      const slot = (p, cls, medal) => p ? `
        <div class="pod ${cls}">
          <div class="pod-name">${p.av}<br>${esc(p.name)}</div>
          <div class="pod-block"><span class="medal">${medal}</span><span class="pts">${p.score}</span></div>
        </div>` : `<div class="pod ${cls}"></div>`;
      render(`
        <div class="center" style="justify-content:flex-start;padding-top:28px">
          <div class="title-pill">Juara Cerebrum Quiz</div>
          <div class="podium">${slot(sorted[1], "p2", "2")}${slot(sorted[0], "p1", "1")}${slot(sorted[2], "p3", "3")}</div>
          ${stars ? `<div class="mini-top">${stars}</div>` : ""}
          <div class="row">
            <button class="btn white" id="allBtn">📋 Klasemen akhir</button>
            <button class="btn green" id="againBtn">🔁 Main lagi</button>
            <button class="btn ghost" id="homeBtn">Selesai</button>
          </div>
          <div id="allLb" hidden style="width:100%;display:flex;justify-content:center"></div>
        </div>`);
      setTimeout(() => { Sfx.fanfare(); confetti(4500); }, 1900);
      document.getElementById("allBtn").onclick = () => {
        const box = document.getElementById("allLb"); box.hidden = !box.hidden;
        box.innerHTML = this.standingsTable(sorted, SESSIONS - 1);
      };
      document.getElementById("againBtn").onclick = () => {
        for (const p of this.players.values()) this.send(p, { t: "lobby" });
        [...this.players.values()].filter((p) => !p.online).forEach((p) => this.players.delete(p.key));
        this.deck = []; this.lobby();
      };
      document.getElementById("homeBtn").onclick = () => {
        if (!confirm("Tutup room ini? Semua pemain akan terputus.")) return;
        try { this.peer.destroy(); } catch {}
        this.players.clear(); location.href = location.pathname;
      };
    },
  };

  // =========================================================
  //  PLAYER
  // =========================================================
  const Player = {
    peer: null, conn: null, pin: null, name: null, av: null, score: 0, qi: -1, total: 0, stopTimer: null, retry: 0,

    connect(pin, auto = false) {
      this.pin = pin;
      render(`<div class="center"><div class="spinner"></div><p>Mencari room ${esc(pin)}…</p></div>`);
      try { this.peer && this.peer.destroy(); } catch {}
      const peer = new Peer(undefined, PEER_OPTS); this.peer = peer;
      let done = false;
      const fail = (msg) => {
        if (done) return; done = true; clearTimeout(timer);
        try { peer.destroy(); } catch {}
        toast(msg, 3500); home(pin);
      };
      const timer = setTimeout(() => fail("Room tidak ditemukan / koneksi lambat. Cek PIN lalu coba lagi."), 15000);
      peer.on("error", (err) => {
        if (err.type === "peer-unavailable") fail("PIN tidak ditemukan 🤔 Pastikan PIN benar.");
        else if (!this.conn || !this.conn.open) fail("Koneksi gagal. Coba lagi ya.");
      });
      peer.on("open", () => {
        const conn = peer.connect(PREFIX + pin, { reliable: true }); this.conn = conn;
        conn.on("open", () => { conn.send({ t: "hello" }); });
        conn.on("data", (msg) => {
          if (msg && msg.t === "room") {
            done = true; clearTimeout(timer);
            const saved = store.get("cq-name-" + pin);
            if (auto && saved) { const s = JSON.parse(saved); this.join(s.name, s.av); }
            else this.nickname();
            return;
          }
          this.onMsg(msg);
        });
        conn.on("close", () => this.lost());
        conn.on("error", () => this.lost());
      });
    },

    lost() {
      if (this._kicked || this._ended) return;
      this.stopTimer && this.stopTimer();
      const saved = store.get("cq-name-" + this.pin);
      render(`
        <div class="center">
          <div class="big-emoji">📡</div>
          <h2>Koneksi terputus</h2>
          <p>Tenang, skormu masih tersimpan di host.</p>
          <button class="btn white" id="rj">Sambungkan lagi</button>
          <button class="btn ghost" id="hm">Ke beranda</button>
        </div>`);
      document.getElementById("rj").onclick = () => this.connect(this.pin, !!saved);
      document.getElementById("hm").onclick = () => { location.href = location.pathname; };
    },

    nickname() {
      let av = pick(AVATARS);
      render(`
        <div class="center">
          <h1 class="logo" style="font-size:40px">Siapa namamu? ✍️</h1>
          <form class="card" id="nf" autocomplete="off">
            <input class="input" id="nm" maxlength="15" placeholder="Nama panggilan" aria-label="Nama panggilan" />
            <div class="muted">Pilih avatar</div>
            <div class="avatars">${AVATARS.map((a) => `<button type="button" class="av${a === av ? " on" : ""}" data-a="${a}">${a}</button>`).join("")}</div>
            <button class="btn" type="submit">Oke, gas! 🚀</button>
          </form>
        </div>`);
      const nm = document.getElementById("nm"); nm.focus();
      document.querySelectorAll(".av").forEach((b) => b.onclick = () => {
        document.querySelectorAll(".av").forEach((x) => x.classList.remove("on")); b.classList.add("on"); av = b.dataset.a; Sfx.tick();
      });
      document.getElementById("nf").onsubmit = (e) => {
        e.preventDefault();
        const name = nm.value.trim();
        if (!name) { toast("Isi nama dulu ya 🙂"); return; }
        this.join(name, av);
      };
    },
    join(name, av) {
      this.name = name; this.av = av;
      let tok = store.get("cq-tok");
      if (!tok) { tok = Math.random().toString(36).slice(2) + Date.now().toString(36); store.set("cq-tok", tok); }
      try { this.conn.send({ t: "join", name, av, tok }); } catch { this.lost(); }
    },
    waiting(title, sub, emoji = "⏳") {
      render(`
        <div class="p-top"><span>${this.av || ""} ${esc(this.name || "")}</span><span>PIN ${esc(this.pin)}</span></div>
        <div class="center"><div class="big-emoji">${emoji}</div><h2 style="margin:0">${title}</h2><p>${sub}</p></div>
        <div class="p-bottom"><span>${esc(this.name || "")}</span><span class="score-tag">${this.score}</span></div>`);
    },

    onMsg(msg) {
      if (!msg || typeof msg !== "object") return;
      switch (msg.t) {
        case "joined":
          if (!msg.ok) { toast(msg.err || "Gagal masuk"); this.nickname(); return; }
          this.name = msg.name; this.av = msg.av; this.score = msg.score || 0;
          store.set("cq-name-" + this.pin, JSON.stringify({ name: this.name, av: this.av }));
          Sfx.join();
          this.waiting("Kamu sudah masuk! 🎉", msg.started ? "Game sedang berjalan, tunggu soal berikutnya…" : "Lihat namamu di layar host 👀<br>Tunggu host memulai game.", "✅");
          break;
        case "getready":
          this.total = msg.total; this.score = 0;
          this.waiting("Siap-siap!", `${msg.sessions || SESSIONS} sesi × ${msg.per || "?"} soal seputar Cerebrum.<br>Poin makin besar tiap sesi (${SESS.map((s) => "×" + s.mult).join(" → ")}) — yang tertinggal masih bisa menyalip! ⚡`, "🚀");
          Sfx.go(); break;
        case "session": {
          const info = msg.rank
            ? msg.rank === 1 ? `Kamu memimpin! 👑 Pertahankan posisimu.` : `Kamu di peringkat <b>#${msg.rank}</b>, ${msg.gapLead} poin di belakang pemimpin. Kejar! 🏃`
            : "Jawab cepat & benar untuk modal poin awal!";
          this.waiting(`Sesi ${msg.s + 1}: ${esc(msg.name)}`, `Poin ×${msg.mult} · ${msg.per} soal<br>${info}`, msg.emoji || "🎮");
          Sfx.go(); break;
        }
        case "sessionEnd": this.sessionEnd(msg); break;
        case "board": this.board(msg); break;
        case "question": this.question(msg); break;
        case "ack": this.waiting("Jawaban terkirim!", "Semoga benar… 🤞", pick(["🤞", "🙏", "😬", "🤔"])); break;
        case "result": this.result(msg); break;
        case "end": this.end(msg); break;
        case "lobby": this._ended = false; this.score = 0; this.waiting("Main lagi! 🔁", "Tunggu host memulai game baru.", "🎮"); break;
        case "kicked":
          this._kicked = true; store.del("cq-name-" + this.pin);
          render(`<div class="center"><div class="big-emoji">👋</div><h2>Kamu dikeluarkan dari room</h2><button class="btn white" onclick="location.href=location.pathname">Ke beranda</button></div>`);
          break;
      }
    },
    question(m) {
      this.qi = m.qi;
      render(`
        <div class="p-top"><span>${m.s != null ? `Sesi ${m.s + 1} · ${m.qs + 1}/${m.per} <span class="mult-tag">×${m.mult}</span>` : `${m.qi + 1} / ${m.total}`}</span><span id="pt">⏱ ${m.left}</span></div>
        <div class="p-q">${esc(m.q)}</div>
        ${answerButtons({ a: m.a }, { clickable: true, cls: "p-answers" })}
        <div class="p-bottom"><span>${this.av} ${esc(this.name)}</span><span class="score-tag">${this.score}</span></div>`);
      let sent = false;
      document.querySelectorAll(".p-answers .ans").forEach((b) => b.onclick = () => {
        if (sent) return; sent = true;
        try { navigator.vibrate && navigator.vibrate(40); } catch {}
        Sfx.tick();
        this.conn.send({ t: "answer", qi: m.qi, choice: +b.dataset.i });
        b.classList.add("picked"); document.querySelectorAll(".p-answers .ans").forEach((x) => { if (x !== b) x.classList.add("dim"); });
      });
      this.stopTimer && this.stopTimer();
      this.stopTimer = countdown(m.left, (l) => { const el = document.getElementById("pt"); if (el) el.textContent = `⏱ ${l}`; }, () => {
        if (!sent) this.waiting("Waktu habis! ⌛", "Tunggu hasilnya…", "⌛");
      });
    },
    result(m) {
      this.stopTimer && this.stopTimer();
      this.score = m.score;
      const ok = m.correct;
      const sub = !m.answered ? "Kamu tidak menjawab 😴" : ok ? pick(CHEERS_OK) : pick(CHEERS_BAD);
      render(`
        <div class="p-top"><span>${this.av} ${esc(this.name)}</span><span>PIN ${esc(this.pin)}</span></div>
        <div class="result-screen ${ok ? "ok" : "bad"}">
          <div class="big-emoji">${ok ? "✅" : "❌"}</div>
          <h2 class="result-title">${ok ? "Benar!" : "Salah"}</h2>
          <div>${sub}</div>
          ${ok ? `<div class="points-pill">+${m.gained}${m.mult > 1 ? ` <small>(×${m.mult})</small>` : ""}</div>` : `<div style="opacity:.9">Jawaban: <b>${esc(m.right)}</b></div>`}
          ${m.streak >= 2 ? `<div>🔥 Beruntun ${m.streak}x!</div>` : ""}
          <div style="font-size:20px">Kamu di peringkat <b>#${m.rank}</b>${m.total ? ` dari ${m.total}` : ""}</div>
          ${m.move > 0 ? `<div class="mv-pill up">▲ Naik ${m.move} peringkat!</div>` : m.move < 0 ? `<div class="mv-pill down">▼ Turun ${-m.move} peringkat</div>` : ""}
          ${m.behind ? `<div>${m.behind.gap === 0 ? `Seri dengan ${esc(m.behind.name)}!` : `${m.behind.gap} poin lagi untuk menyalip ${esc(m.behind.name)} 🏃`}</div>`
            : m.rank === 1 ? `<div>👑 Kamu memimpin!${m.chaser ? ` ${esc(m.chaser.name)} mengejar, selisih ${m.chaser.gap} poin` : ""}</div>` : ""}
        </div>
        ${m.board ? `<div class="p-board"><h3>Peringkat${m.s != null ? ` <small>Sesi ${m.s + 1} · Soal ${m.qn}/${m.per}</small>` : ""}</h3>${boardHtml(m.board)}</div>` : ""}
        <div class="p-bottom"><span>${esc(this.name)}</span><span class="score-tag">${this.score}</span></div>`);
      ok ? Sfx.correct() : Sfx.wrong();
      try { navigator.vibrate && navigator.vibrate(ok ? [60, 40, 60] : 300); } catch {}
    },
    end(m) {
      this._ended = true; this.score = m.score;
      const medal = ["🥇", "🥈", "🥉"][m.rank - 1];
      const msg = m.rank === 1 ? "JUARA 1! Kamu master Cerebrum! 👑" : m.rank <= 3 ? "Naik podium! Keren! 🎉" : m.rank <= 5 ? "Masuk 5 besar, mantap! 💪" : "Terima kasih sudah main! 🙌";
      render(`
        <div class="center">
          <div class="big-emoji">${medal || "🏁"}</div>
          <div class="title-pill">Peringkat #${m.rank} dari ${m.total}</div>
          <h2 style="margin:0">${msg}</h2>
          <div class="points-pill">${m.score} poin</div>
          ${Array.isArray(m.sess) ? `<div class="mini-top">${m.sess.map((v, i) => `<span>Sesi ${i + 1}: <b>${v}</b></span>`).join("")}</div>` : ""}
          <p class="foot">Lihat podium di layar host 👀</p>
        </div>`);
      if (m.rank <= 3) { Sfx.fanfare(); confetti(); }
    },
    board(m) {
      this.stopTimer && this.stopTimer();
      this.score = m.score;
      render(`
        <div class="p-top"><span>Sesi ${m.s + 1} · Soal ${m.qn}/${m.per} <span class="mult-tag">×${m.mult}</span></span><span>#${m.rank} dari ${m.total}</span></div>
        <div class="p-board">
          <div class="title-pill" style="font-size:22px;align-self:center">Papan Peringkat</div>
          ${boardHtml(m.rows)}
          <p class="foot" style="text-align:center;margin:6px auto 0">Lihat layar host · soal berikutnya segera 🏃</p>
        </div>
        <div class="p-bottom"><span>${esc(this.av || "")} ${esc(this.name || "")}</span><span class="score-tag">${this.score}</span></div>`);
    },
    sessionEnd(m) {
      this.stopTimer && this.stopTimer();
      this.score = m.score;
      if (!m.next) { this.waiting("Semua sesi selesai! 🏁", "Menghitung juara…", "🥁"); return; }
      const iStar = m.star && m.star === this.name;
      render(`
        <div class="p-top"><span>${this.av} ${esc(this.name)}</span><span>PIN ${esc(this.pin)}</span></div>
        <div class="center">
          <div class="big-emoji">${iStar ? "⭐" : MEDALS[m.rank - 1] || "🏁"}</div>
          <div class="title-pill">Sesi ${m.s + 1} selesai</div>
          <div style="font-size:22px">Peringkat <b>#${m.rank}</b> dari ${m.total}</div>
          <div class="points-pill">+${m.sessPts} poin di sesi ini</div>
          ${iStar ? `<div>Kamu <b>Bintang Sesi ${m.s + 1}</b>! ⭐</div>` : `<div style="opacity:.9">Peringkat sesi ini: #${m.sessRank}</div>`}
          ${m.ahead ? `<div>${m.ahead.gap} poin lagi untuk menyalip ${esc(m.ahead.name)}</div>` : `<div>👑 Kamu memimpin klasemen!</div>`}
          <p class="foot">Berikutnya Sesi ${m.s + 2}: ${esc(m.next.name)} — poin ×${m.next.mult} 🏃</p>
        </div>
        <div class="p-bottom"><span>${esc(this.name)}</span><span class="score-tag">${this.score}</span></div>`);
      if (iStar || m.rank <= 3) Sfx.fanfare(); else Sfx.gong();
    },
  };

  // =========================================================
  //  SOLO (latihan sendiri, tanpa PIN)
  // =========================================================
  const Solo = {
    setup() { settingsCard("Main <span class=\"hl\">Solo</span>", "Mulai →", (n, t) => this.start(n, t)); },
    start(n, t) {
      this.deck = buildDeck(n); this.time = t; this.qi = -1; this.score = 0; this.streak = 0; this.right = 0;
      this.next();
    },
    next() {
      this.qi++;
      if (this.qi >= this.deck.length) return this.finish();
      const q = this.deck[this.qi]; const start = Date.now(); let done = false;
      render(`
        <div class="q-head">${esc(q.q)}</div>
        <div class="q-mid">
          <div class="timer" id="timer">${this.time}</div>
          <div class="q-brain" aria-hidden="true"></div>
          <div class="ans-count"><b>${this.score}</b>Poin</div>
        </div>
        ${answerButtons(q, { clickable: true })}
        <div class="q-progress">${this.qi + 1} / ${this.deck.length}</div>`);
      Sfx.go();
      const finish = (choice) => {
        if (done) return; done = true; stop();
        const ok = choice === q.c;
        let gained = 0;
        if (ok) { this.streak++; this.right++; gained = calcPoints((Date.now() - start) / 1000, this.time) + Math.min(this.streak - 1, 5) * 100; this.score += gained; }
        else this.streak = 0;
        ok ? Sfx.correct() : Sfx.wrong();
        document.querySelectorAll(".answers .ans").forEach((el, i) => {
          el.disabled = true;
          if (i === q.c) { el.classList.add("right"); el.querySelector(".check").textContent = "✔"; }
          else { el.classList.add("dim"); if (i === choice) el.querySelector(".check").textContent = "✖"; }
        });
        document.querySelector(".q-mid").innerHTML = `
          <div class="timer" style="background:${ok ? "var(--green)" : "var(--red)"}">${ok ? "✔" : "✖"}</div>
          <div style="text-align:center;font-size:clamp(20px,3vw,30px);font-weight:600">${choice === -1 ? "Waktu habis! ⌛" : ok ? `${pick(CHEERS_OK)}<br>+${gained}` : pick(CHEERS_BAD)}${this.streak >= 2 ? `<br>🔥 ${this.streak}x beruntun` : ""}${q.f ? `<div class="fact" style="margin-top:10px">💡 ${esc(q.f)}</div>` : ""}</div>
          <div class="ans-count"><b>${this.score}</b>Poin</div>`;
        const act = document.createElement("div"); act.className = "host-actions";
        act.innerHTML = `<button class="btn white" id="nextBtn">${this.qi + 1 >= this.deck.length ? "Lihat hasil 🏁" : "Lanjut ▶"}</button>`;
        $app.appendChild(act);
        document.getElementById("nextBtn").onclick = () => this.next();
      };
      document.querySelectorAll(".answers .ans").forEach((b) => b.onclick = () => finish(+b.dataset.i));
      const stop = countdown(this.time, (left) => {
        const el = document.getElementById("timer"); if (!el || done) return;
        el.textContent = left; el.classList.toggle("low", left <= 5); if (left <= 5 && left > 0) Sfx.tickLow();
      }, () => finish(-1));
    },
    finish() {
      const pct = this.right / this.deck.length;
      const [emoji, msg] = pct === 1 ? ["👑", "Sempurna! Kamu master Cerebrum!"] : pct >= .7 ? ["🎉", "Keren! Kamu paham banget soal Cerebrum."] : pct >= .4 ? ["💪", "Lumayan! Yuk main lagi biar makin paham."] : ["📚", "Belajar lagi yuk di Product Knowledge Center!"];
      render(`
        <div class="center">
          <div class="big-emoji">${emoji}</div>
          <div class="title-pill">${this.right} / ${this.deck.length} benar</div>
          <h2 style="margin:0">${msg}</h2>
          <div class="points-pill">${this.score} poin</div>
          <div class="row">
            <button class="btn green" id="again">🔁 Main lagi</button>
            <button class="btn white" id="hm">🏠 Beranda</button>
          </div>
        </div>`);
      if (pct >= .7) { Sfx.fanfare(); confetti(); }
      document.getElementById("again").onclick = () => this.start(this.deck.length, this.time);
      document.getElementById("hm").onclick = () => home();
    },
  };

  // ---------- Start ----------
  const params = new URLSearchParams(location.search);
  const pinParam = (params.get("pin") || "").replace(/\D/g, "").slice(0, 6);
  if (typeof Peer === "undefined") toast("Gagal memuat modul koneksi. Mode Solo tetap bisa dimainkan.", 5000);
  if (params.has("host")) Host.setup();
  else if (pinParam.length === 6) {
    const saved = store.get("cq-name-" + pinParam);
    if (saved) Player.connect(pinParam, true); else home(pinParam);
  } else home();
})();
