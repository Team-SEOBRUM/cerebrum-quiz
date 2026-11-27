/* Cerebrum Quiz — mode "Balapan Peta"
 * Pemain berjalan di peta 30 petak. Siapa yang pertama mencapai 🏁 menang.
 *  - Benar +1 petak, soal HOTS +1 lagi, penjawab benar tercepat +1 lagi.
 *  - Senjata/skill didapat dari 3x benar beruntun & tiap benar soal HOTS. Maks 3 di tas.
 *  - Soal HOTS selalu didahului layar clue.
 * Memakai helper dari app.js lewat window.CQ.
 */
(() => {
  "use strict";
  const C = window.CQ;
  if (!C) return;
  const { Host, Player, render, esc, avHtml, Sfx, Music, toast, confetti, countdown, answerButtons, shuffle, calcPoints, MEDALS } = C;

  const GOAL = 40;      // petak tujuan (30 soal: pemain dominan butuh ±20 soal)
  const NQ = 30;        // jumlah soal
  const NHOTS = 8;      // soal HOTS per game
  const MAX_INV = 3;    // kapasitas tas senjata/skill
  const COLS = 9;       // lebar papan (ular)
  const CLUE_SECS = 6;

  const SKILLS = {
    freeze: { icon: "❄️", name: "Freeze", desc: "Lawan tidak bisa menjawab soal berikutnya", target: true, w: 25 },
    bomb: { icon: "💣", name: "Bom", desc: "Lawan mundur 2 petak", target: true, w: 25 },
    rocket: { icon: "🚀", name: "Roket", desc: "Kamu maju 3 petak", target: false, w: 20 },
    shield: { icon: "🛡️", name: "Perisai", desc: "Menahan 1 serangan Freeze/Bom", target: false, w: 15 },
    clue: { icon: "💡", name: "Bocoran", desc: "Hapus 2 jawaban salah di soal berikutnya", target: false, w: 15 },
  };
  const randSkill = () => {
    let r = Math.random() * Object.values(SKILLS).reduce((a, s) => a + s.w, 0);
    for (const [k, s] of Object.entries(SKILLS)) if ((r -= s.w) < 0) return k;
    return "rocket";
  };
  const shuffleOpts = (q) => {
    if (q.a.length < 4) return { ...q };
    const o = shuffle(q.a.map((_, i) => i));
    return { ...q, a: o.map((i) => q.a[i]), c: o.indexOf(q.c) };
  };
  // Tema luar angkasa: hiasan planet/benda langit di petak tertentu (murni dekorasi)
  const SPACE_DECOR = { 3: "🌑", 6: "☄️", 9: "🪐", 13: "🛰️", 17: "🌕", 21: "🌌", 24: "☄️", 28: "🪐", 32: "🌠", 36: "🌑", 38: "🛰️" };
  const spaceOn = (on) => document.body.classList.toggle("space", !!on);
  const ensure = (p) => {
    if (p.pos == null) Object.assign(p, { pos: 0, prevPos: 0, inv: [], shield: false, frozen: false, frozenNext: false, clueNext: false, correct: 0, score: p.score || 0, streak: 0 });
    return p;
  };

  // 22 soal reguler + 8 HOTS yang disebar merata (± tiap 4 soal)
  function buildMapDeck() {
    const hots = shuffle(window.HOTS || []).slice(0, NHOTS).map((q) => ({ ...shuffleOpts(q), hots: true }));
    const reg = shuffle(window.QUESTIONS || []).slice(0, NQ - hots.length).map(shuffleOpts);
    const gap = NQ / Math.max(1, hots.length);
    const slots = new Set(hots.map((_, i) => Math.min(NQ - 1, Math.round(gap * i + gap - 1))));
    const deck = [];
    for (let i = 0, h = 0, r = 0; i < NQ; i++) {
      const q = slots.has(i) && h < hots.length ? hots[h++] : reg[r++] || hots[h++];
      if (q) deck.push(q);
    }
    return deck;
  }

  // =========================================================
  //  HOST
  // =========================================================
  Host.chooseMode = function () {
    render(`
      <div class="center">
        <div class="kicker">Pilih mode game</div>
        <h1 class="logo">Mau main <span class="hl">apa?</span></h1>
        <div class="modes">
          <button class="mode-card" id="mClassic">
            <span class="mode-ico">🏆</span><b>Quiz Interaktif</b>
            <small>3 sesi kejar-kejaran poin (×1 → ×1.5 → ×2), papan peringkat tiap soal.</small>
          </button>
          <button class="mode-card hot" id="mMap">
            <span class="mode-tag">BARU</span>
            <span class="mode-ico">🗺️</span><b>Balapan Peta</b>
            <small>${NQ} soal · jalan di peta sampai 🏁 · senjata ❄️ 💣 🚀 🛡️ 💡 · soal HOTS + clue.</small>
          </button>
        </div>
        <button class="btn ghost" id="back">← Kembali ke beranda</button>
      </div>`);
    document.getElementById("mClassic").onclick = () => { Sfx.tick(); this.classicSetup(); };
    document.getElementById("mMap").onclick = () => { Sfx.tick(); this.mSetup(); };
    document.getElementById("back").onclick = () => { history.replaceState(null, "", location.pathname); location.href = location.pathname; };
  };

  Host.mSetup = function () {
    let t = 20;
    render(`
      <div class="center">
        <h1 class="logo">Balapan <span class="hl">Peta</span></h1>
        <div class="card" style="max-width:440px">
          <b>Aturan</b>
          <ul class="rules">
            <li>🏁 Pertama mencapai <b>petak ${GOAL}</b> menang (${NQ} soal, termasuk ${NHOTS} soal <b>HOTS</b>).</li>
            <li>✅ Benar <b>+1 petak</b> · 🔥 HOTS <b>+1</b> · ⚡ tercepat <b>+1</b>.</li>
            <li>🎁 Dapat senjata/skill dari <b>3x benar beruntun</b> & tiap <b>benar soal HOTS</b>. Tas maks <b>${MAX_INV}</b>.</li>
            <li>${Object.values(SKILLS).map((s) => `${s.icon} ${s.name}`).join(" · ")}</li>
          </ul>
          <b>Waktu per soal</b>
          <div class="chips" id="tm">${[15, 20, 30].map((s) => `<button class="chip${s === t ? " on" : ""}" data-v="${s}">${s} detik</button>`).join("")}</div>
          <div class="muted">Soal HOTS mendapat waktu 1,5× lebih lama.</div>
          <button class="btn green" id="go">Buat Room →</button>
        </div>
        <button class="btn ghost" id="back">← Pilih mode lain</button>
      </div>`);
    document.querySelectorAll("#tm .chip").forEach((b) => b.onclick = () => {
      document.querySelectorAll("#tm .chip").forEach((x) => x.classList.remove("on")); b.classList.add("on"); t = +b.dataset.v; Sfx.tick();
    });
    document.getElementById("go").onclick = (e) => { e.target.disabled = true; this.mode = "map"; this.time = t; this.nQ = NQ; this.open(); };
    document.getElementById("back").onclick = () => this.chooseMode();
  };

  Host.mRows = function () {
    return [...this.players.values()].map(ensure)
      .sort((a, b) => (b === this.winner) - (a === this.winner) || b.pos - a.pos || b.score - a.score)
      .map((p) => ({ k: p.key, n: p.name, av: p.av, pos: p.pos, inv: p.inv.length, sh: p.shield, fz: p.frozenNext, on: p.online }));
  };

  Host.mStart = function () {
    spaceOn(true);
    Music.stop();
    this.deck = buildMapDeck(); this.nQ = this.deck.length; this.qi = -1; this.feed = []; this.winner = null;
    for (const p of this.players.values()) { p.pos = null; p.score = 0; ensure(p); }
    this.onlinePlayers().forEach((p) => this.send(p, { t: "getready", mode: "map", total: this.deck.length, goal: GOAL }));
    this.phase = "intro";
    render(`
      <div class="center">
        <div class="kicker">Mode Balapan Peta</div>
        <div class="title-pill">🚀 Siap meluncur!</div>
        <div class="big-emoji" id="cd">🏁</div>
        <div class="mini-top">
          <span>✅ Benar +1</span><span>🔥 HOTS +1</span><span>⚡ Tercepat +1</span>
          <span>🎁 3x beruntun / benar HOTS = senjata</span><span>🎒 Maks ${MAX_INV}</span>
        </div>
        <div class="mini-top">${Object.values(SKILLS).map((s) => `<span>${s.icon} <b>${s.name}</b> — ${s.desc}</span>`).join("")}</div>
      </div>
      <div class="host-actions"><button class="btn green" id="nextBtn">Mulai Balapan →</button></div>`);
    Sfx.go();
    const btn = document.getElementById("nextBtn");
    btn.onclick = () => {
      btn.disabled = true; this.phase = "countdown";
      const cd = document.getElementById("cd"); let n = 3;
      cd.style.fontSize = "140px"; cd.textContent = n; Sfx.tickLow();
      const id = setInterval(() => { n--; if (n > 0) { cd.textContent = n; Sfx.tickLow(); } else { clearInterval(id); this.mNext(); } }, 1000);
    };
  };

  Host.mNext = function () {
    this.qi++;
    if (this.winner || this.qi >= this.deck.length) return this.mFinish();
    const q = this.deck[this.qi];
    if (q.hots) this.mClue(q); else this.mAsk();
  };

  // Layar clue sebelum soal HOTS
  Host.mClue = function (q) {
    this.phase = "clue";
    render(`
      <div class="center">
        <div class="hots-badge">🔥 SOAL HOTS · ${this.qi + 1}/${this.deck.length}</div>
        <div class="title-pill">Clue dulu!</div>
        <div class="clue-box">💡 ${esc(q.clue)}</div>
        <p class="foot">Benar di soal HOTS = <b>+2 petak</b> & dapat <b>1 senjata</b> 🎁 · waktu menjawab 1,5×</p>
        <div class="big-emoji" id="cd">${CLUE_SECS}</div>
      </div>`);
    this.onlinePlayers().forEach((p) => this.send(p, { t: "clue", clue: q.clue, qi: this.qi, total: this.deck.length, secs: CLUE_SECS }));
    Sfx.gong();
    let n = CLUE_SECS;
    const id = setInterval(() => {
      n--; const el = document.getElementById("cd"); if (el) el.textContent = n;
      if (n <= 3 && n > 0) Sfx.tickLow();
      if (n <= 0) { clearInterval(id); this.mAsk(); }
    }, 1000);
  };

  Host.mQuestionMsg = function (p) {
    ensure(p);
    const q = this.deck[this.qi];
    return {
      t: "question", map: true, qi: this.qi, total: this.deck.length, q: q.q, a: q.a, time: this.qTime,
      left: Math.max(1, Math.round(this.qTime - (Date.now() - this.qStart) / 1000)),
      hots: !!q.hots, frozen: !!p.frozen, hide: p.hide || [], pos: p.pos, goal: GOAL, inv: p.inv,
    };
  };

  Host.mAsk = function () {
    const q = this.deck[this.qi];
    this.phase = "question"; this.answers = new Map(); this.qStart = Date.now();
    this.qTime = q.hots ? Math.round(this.time * 1.5) : this.time;
    for (const p of this.players.values()) {
      ensure(p);
      p.frozen = !!p.frozenNext; p.frozenNext = false; p.hide = null;
      if (p.clueNext && q.a.length >= 4) {
        p.clueNext = false;
        p.hide = shuffle(q.a.map((_, i) => i).filter((i) => i !== q.c)).slice(0, 2);
      }
    }
    render(`
      <div class="q-head">${q.hots ? `<span class="hots-tag">🔥 HOTS</span> ` : ""}${esc(q.q)}</div>
      <div class="q-mid">
        <div class="timer" id="timer">${this.qTime}</div>
        <div class="q-brain" aria-hidden="true"></div>
        <div class="ans-count"><b id="ansNum">0</b>Jawaban</div>
      </div>
      <div class="answered" id="answered"></div>
      ${answerButtons(q)}
      <div class="q-progress">🗺️ Soal ${this.qi + 1}/${this.deck.length}${q.hots ? " · HOTS +2 petak" : ""} · PIN ${this.pin}</div>
      <div class="host-actions"><button class="btn white" id="nextBtn">Lewati ⏭</button></div>`);
    document.getElementById("nextBtn").onclick = () => this.mReveal();
    this.drawAnswered();
    this.onlinePlayers().forEach((p) => this.send(p, this.mQuestionMsg(p)));
    Sfx.go();
    this.stopTimer = countdown(this.qTime, (left) => {
      const t = document.getElementById("timer"); if (!t) return;
      t.textContent = left; t.classList.toggle("low", left <= 5);
      if (left <= 5 && left > 0) Sfx.tickLow();
    }, () => this.mReveal());
  };

  Host.mReveal = function () {
    if (this.phase !== "question") return;
    this.phase = "reveal"; this.stopTimer && this.stopTimer();
    const q = this.deck[this.qi];
    const counts = q.a.map(() => 0);
    const okList = [];
    for (const p of this.players.values()) {
      ensure(p);
      const a = this.answers.get(p.key);
      if (a) { counts[a.choice]++; if (a.choice === q.c) okList.push(p); }
    }
    okList.sort((x, y) => this.answers.get(x.key).elapsed - this.answers.get(y.key).elapsed);
    const fastest = okList[0] || null;
    const reached = [];
    for (const p of this.players.values()) {
      const a = this.answers.get(p.key);
      const ok = !!a && a.choice === q.c;
      const earned = []; let full = false; let steps = 0;
      p.prevPos = p.pos;
      if (ok) {
        p.streak++; p.correct++;
        steps = 1 + (q.hots ? 1 : 0) + (p === fastest ? 1 : 0);
        p.score += calcPoints(a.elapsed, this.qTime);
        const give = (why) => {
          if (p.inv.length < MAX_INV) { const k = randSkill(); p.inv.push(k); earned.push({ k, why }); } else full = true;
        };
        if (p.streak % 3 === 0) give("streak");
        if (q.hots) give("hots");
      } else if (!p.frozen) p.streak = 0;
      p.pos = Math.min(GOAL, p.pos + steps);
      if (p.prevPos < GOAL && p.pos >= GOAL) reached.push(p);
      p._r = { answered: !!a, correct: ok, steps, fastest: p === fastest, earned, full, frozen: !!p.frozen };
      if (earned.length) this.mFeed(`🎁 ${p.name} dapat ${earned.map((e) => `${SKILLS[e.k].icon} ${SKILLS[e.k].name}`).join(" & ")} (${earned.map((e) => (e.why === "hots" ? "benar HOTS" : "3x beruntun")).join(", ")})`);
    }
    if (!this.winner && reached.length) {
      reached.sort((x, y) => (this.answers.get(x.key)?.elapsed ?? 99) - (this.answers.get(y.key)?.elapsed ?? 99));
      this.winner = reached[0];
      this.mFeed(`🏁 ${this.winner.name} mencapai garis finish!`);
    }
    const rows = this.mRows();
    for (const p of this.players.values()) {
      this.send(p, {
        t: "mresult", ...p._r, right: q.a[q.c], hots: !!q.hots, pos: p.pos, goal: GOAL, streak: p.streak,
        rank: rows.findIndex((r) => r.k === p.key) + 1, total: rows.length, inv: p.inv, shield: p.shield, rows, score: p.score,
        qn: this.qi + 1, nq: this.deck.length,
      });
    }
    const max = Math.max(1, ...counts);
    render(`
      <div class="q-head">${q.hots ? `<span class="hots-tag">🔥 HOTS</span> ` : ""}${esc(q.q)}</div>
      <div class="chart">${q.a.map((_, i) => `
        <div class="bar-wrap">
          <div class="bar-num">${counts[i]}${i === q.c ? " ✔" : ""}</div>
          <div class="bar${i === q.c ? " ok" : ""}" data-h="${Math.round((counts[i] / max) * 100)}"></div>
          <div class="bar-foot${i === q.c ? " ok" : ""}">${"ABCD"[i]}</div>
        </div>`).join("")}
      </div>
      ${fastest ? `<div class="fact">⚡ Tercepat: <b>${esc(fastest.name)}</b> (${this.answers.get(fastest.key).elapsed.toFixed(1)} detik) · +1 petak bonus</div>` : ""}
      ${q.f ? `<div class="fact">💡 ${esc(q.f)}</div>` : ""}
      ${answerButtons(q)}
      <div class="host-actions"><button class="btn green" id="nextBtn">Lihat Peta 🗺️</button></div>`);
    document.querySelectorAll(".answers .ans").forEach((el, i) => {
      if (i === q.c) { el.classList.add("right"); el.querySelector(".check").textContent = "✔"; }
      else { el.classList.add("dim"); el.querySelector(".check").textContent = "✖"; }
    });
    requestAnimationFrame(() => setTimeout(() => document.querySelectorAll(".bar").forEach((b) => b.style.height = `calc(${b.dataset.h}% - 70px)`), 50));
    Sfx.gong();
    document.getElementById("nextBtn").onclick = () => this.mBoard();
  };

  Host.mFeed = function (text, loud = false) {
    this.feed = this.feed || [];
    this.feed.unshift(text);
    this.feed = this.feed.slice(0, 8);
    const el = document.getElementById("feed");
    if (el) el.innerHTML = this.mFeedHtml();
    if (loud && this.phase !== "board") toast(text, 3500);
  };
  Host.mFeedHtml = function () {
    return (this.feed || []).map((t, i) => `<div class="fd${i === 0 ? " new" : ""}">${esc(t)}</div>`).join("") || `<div class="fd muted">Belum ada kejadian. Senjata didapat dari 3x benar beruntun & benar soal HOTS.</div>`;
  };

  // Papan ular: petak 0 (START) sampai GOAL (🏁)
  Host.mBoardHtml = function () {
    const occ = new Map();
    for (const p of this.players.values()) { ensure(p); if (!occ.has(p.pos)) occ.set(p.pos, []); occ.get(p.pos).push(p); }
    let html = "";
    for (let t = 0; t <= GOAL; t++) {
      const row = Math.floor(t / COLS), ci = t % COLS, col = row % 2 === 0 ? ci : COLS - 1 - ci;
      const here = occ.get(t) || [];
      const dir = t === GOAL ? "" : (row % 2 === 0 ? (ci === COLS - 1 ? "↓" : "→") : (ci === COLS - 1 ? "↓" : "←"));
      html += `<div class="tile${t === 0 ? " start" : ""}${t === GOAL ? " goal" : ""}${t % 5 === 0 && t && t !== GOAL ? " cp" : ""}" style="grid-row:${row + 1};grid-column:${col + 1}">
        ${SPACE_DECOR[t] ? `<span class="decor">${SPACE_DECOR[t]}</span>` : ""}<span class="tn">${t === 0 ? "🚀 LAUNCH" : t === GOAL ? "🛸 FINISH" : t}</span><span class="dir">${dir}</span>
        <div class="toks">${here.slice(0, 5).map((p) => `<span class="tok${p.prevPos !== p.pos ? " hop" : ""}${p.shield ? " sh" : ""}" title="${esc(p.name)}">${avHtml(p.av)}</span>`).join("")}${here.length > 5 ? `<span class="more">+${here.length - 5}</span>` : ""}</div>
      </div>`;
    }
    return html;
  };

  Host.mBoardMsg = function (p, rows) {
    return {
      t: "mboard", pos: p.pos, goal: GOAL, rank: rows.findIndex((r) => r.k === p.key) + 1, total: rows.length,
      inv: p.inv, shield: p.shield, frozenNext: p.frozenNext, clueNext: p.clueNext, rows, qn: this.qi + 1, nq: this.deck.length,
      winner: this.winner ? this.winner.name : null,
    };
  };

  Host.mBoard = function () {
    this.phase = "board";
    const rows = this.mRows();
    const done = !!this.winner || this.qi + 1 >= this.deck.length;
    render(`
      <div class="map-screen">
        <div class="map-head">
          <div class="title-pill">🚀 Peta Galaksi</div>
          <div class="lb-sub">Soal ${this.qi + 1}/${this.deck.length} · Tujuan petak ${GOAL} 🏁${this.winner ? ` · 🏆 ${esc(this.winner.name)} finish!` : ""}</div>
        </div>
        <div class="map-wrap">
          <div class="board">${this.mBoardHtml()}</div>
          <aside class="map-side">
            <h3>Posisi</h3>
            <div class="mrank">${rows.slice(0, 10).map((r, i) => `
              <div class="mrow${i === 0 ? " lead" : ""}"><span class="lb-rank">${i + 1}</span><span class="lb-name">${avHtml(r.av)} ${esc(r.n)}</span>
                <span class="mst">${r.sh ? "🛡️" : ""}${r.fz ? "❄️" : ""}${r.inv ? `<small>🎒${r.inv}</small>` : ""}</span><b>${r.pos}</b></div>`).join("")}
              ${rows.length > 10 ? `<div class="muted" style="text-align:center">+${rows.length - 10} pemain lain</div>` : ""}
            </div>
            <h3>Kejadian</h3>
            <div class="feed" id="feed">${this.mFeedHtml()}</div>
          </aside>
        </div>
      </div>
      <div class="host-actions"><button class="btn ${done ? "green" : "white"}" id="nextBtn">${done ? "Lihat Pemenang 🏆" : "Soal berikutnya ▶"}</button></div>`);
    for (const p of this.players.values()) p.prevPos = p.pos; // animasi lompat hanya sekali
    document.getElementById("nextBtn").onclick = () => (done ? this.mFinish() : this.mNext());
    for (const p of this.players.values()) this.send(p, this.mBoardMsg(p, rows));
  };

  // Pemain memakai senjata/skill
  Host.mUseSkill = function (p, msg) {
    if (this.mode !== "map" || !["clue", "question", "reveal", "board"].includes(this.phase)) return;
    ensure(p);
    const i = +msg.i, k = p.inv[i];
    if (!k || !SKILLS[k] || k !== msg.k) return;
    const sk = SKILLS[k];
    let t = null;
    if (sk.target) { t = this.players.get(String(msg.target || "")); if (!t || t === p) return; ensure(t); }
    p.inv.splice(i, 1);
    let text;
    if (k === "freeze" || k === "bomb") {
      if (t.shield) {
        t.shield = false;
        text = `🛡️ Perisai ${t.name} menahan ${sk.icon} ${sk.name} dari ${p.name}!`;
        this.send(t, { t: "hit", kind: "blocked", by: p.name, skill: k });
      } else if (k === "freeze") {
        t.frozenNext = true;
        text = `❄️ ${p.name} membekukan ${t.name}! Tidak bisa menjawab soal berikutnya.`;
        this.send(t, { t: "hit", kind: "freeze", by: p.name });
      } else {
        t.prevPos = t.pos; t.pos = Math.max(0, t.pos - 2);
        text = `💣 ${p.name} mengebom ${t.name}! Mundur 2 petak → petak ${t.pos}.`;
        this.send(t, { t: "hit", kind: "bomb", by: p.name, pos: t.pos });
      }
    } else if (k === "rocket") {
      p.prevPos = p.pos; p.pos = Math.min(GOAL, p.pos + 3);
      text = `🚀 ${p.name} pakai Roket! Maju 3 petak → petak ${p.pos}.`;
      if (p.pos >= GOAL && !this.winner) { this.winner = p; text += " 🏁 FINISH!"; }
    } else if (k === "shield") {
      p.shield = true; text = `🛡️ ${p.name} memasang Perisai.`;
    } else {
      p.clueNext = true; text = `💡 ${p.name} menyiapkan Bocoran untuk soal berikutnya.`;
    }
    this.send(p, { t: "inv", inv: p.inv, pos: p.pos, shield: p.shield, clueNext: p.clueNext, used: k });
    Sfx.join();
    this.mFeed(text, true);
    if (this.phase === "board") this.mBoard();
    else { const rows = this.mRows(); for (const x of this.players.values()) this.send(x, { t: "mrows", rows, pos: x.pos }); }
  };

  Host.mFinish = function () {
    this.phase = "end"; this.stopTimer && this.stopTimer();
    const ps = [...this.players.values()].map(ensure)
      .sort((a, b) => (b === this.winner) - (a === this.winner) || b.pos - a.pos || b.score - a.score);
    ps.forEach((p, i) => this.send(p, { t: "end", mode: "map", rank: i + 1, total: ps.length, pos: p.pos, goal: GOAL, score: p.score, correct: p.correct, nq: this.deck.length }));
    const slot = (p, cls, medal) => p ? `
      <div class="pod ${cls}">
        <div class="pod-name">${avHtml(p.av, "lg")}<br>${esc(p.name)}</div>
        <div class="pod-block"><span class="medal">${medal}</span><span class="pts">Petak ${p.pos}</span></div>
      </div>` : `<div class="pod ${cls}"></div>`;
    render(`
      <div class="center" style="justify-content:flex-start;padding-top:28px">
        <div class="title-pill">🏁 Pemenang Balapan Peta</div>
        <p class="foot" style="margin:0">${this.winner ? `${esc(this.winner.name)} mencapai finish duluan!` : `Soal habis — posisi terjauh yang menang.`}</p>
        <div class="podium">${slot(ps[1], "p2", "2")}${slot(ps[0], "p1", "1")}${slot(ps[2], "p3", "3")}</div>
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
      box.innerHTML = `<div class="st-wrap"><table class="st"><thead><tr><th>#</th><th class="nm">Pemain</th><th>Petak</th><th>Benar</th><th>Poin</th></tr></thead><tbody>${ps.map((p, i) => `
        <tr${i < 3 ? ` class="top${i + 1}"` : ""}><td>${i + 1}</td><td class="nm">${avHtml(p.av)} ${esc(p.name)}</td><td class="tot">${p.pos}</td><td>${p.correct}/${this.deck.length}</td><td>${p.score}</td></tr>`).join("")}</tbody></table></div>`;
    };
    document.getElementById("againBtn").onclick = () => {
      for (const p of this.players.values()) { this.send(p, { t: "lobby" }); p.pos = null; }
      [...this.players.values()].filter((p) => !p.online).forEach((p) => this.players.delete(p.key));
      this.deck = []; this.winner = null; spaceOn(false); this.lobby();
    };
    document.getElementById("homeBtn").onclick = () => {
      if (!confirm("Tutup room ini? Semua pemain akan terputus.")) return;
      try { this.peer.destroy(); } catch {}
      this.players.clear(); location.href = location.pathname;
    };
  };

  // =========================================================
  //  PLAYER (HP)
  // =========================================================
  Player.mOnMsg = function (m) {
    switch (m.t) {
      case "getready":
        if (m.mode !== "map") { this.mode = "classic"; return false; }
        spaceOn(true);
        this.mode = "map"; this.inv = []; this.pos = 0; this.score = 0; this.goal = m.goal; this.mrows = [];
        this.waiting("Misi Luar Angkasa! 🚀", `${m.total} soal · terbang duluan ke 🛸 petak ${m.goal}!<br>✅ Benar +1 · 🔥 HOTS +1 · ⚡ Tercepat +1<br>🎁 3x benar beruntun / benar HOTS = senjata (maks ${MAX_INV})`, "🏁", true);
        Sfx.go(); return true;
      case "clue":
        this.mClosePicker(); this.stopTimer && this.stopTimer();
        render(`
          <div class="p-top"><span>🔥 Soal HOTS ${m.qi + 1}/${m.total}</span><span>Petak ${this.pos ?? 0}/${GOAL}</span></div>
          <div class="center">
            <div class="hots-badge">🔥 SOAL HOTS</div>
            <div class="title-pill" style="font-size:22px">Clue dulu!</div>
            <div class="clue-box">💡 ${esc(m.clue)}</div>
            <p class="foot">Benar = +2 petak & dapat 1 senjata 🎁</p>
          </div>
          <div class="p-bottom"><span>${avHtml(this.av)} ${esc(this.name)}</span><span class="score-tag">${this.score}</span></div>`);
        Sfx.gong(); return true;
      case "question":
        if (!m.map) return false;
        spaceOn(true); this.mode = "map"; this.mQuestion(m); return true;
      case "mresult": this.mResult(m); return true;
      case "mboard": this.mBoardView(m); return true;
      case "mrows": {
        this.mrows = m.rows || []; if (m.pos != null) this.pos = m.pos;
        const mp = document.getElementById("pmap");
        if (mp && !this._picking) { mp.outerHTML = this.mMapHtml(); this.mBindMap(); }
        return true;
      }
      case "inv":
        this.inv = m.inv || []; this.pos = m.pos; this.shield = m.shield; this.clueNext = m.clueNext;
        if (m.used && SKILLS[m.used]) toast(`${SKILLS[m.used].icon} ${SKILLS[m.used].name} dipakai!`);
        this.mRefreshInv(); return true;
      case "hit": {
        const by = esc(m.by || "Lawan");
        const txt = m.kind === "freeze" ? `❄️ Kamu dibekukan ${by}! Tidak bisa menjawab soal berikutnya.`
          : m.kind === "bomb" ? `💣 Kamu kena bom ${by}! Mundur ke petak ${m.pos}.`
          : `🛡️ Perisaimu menahan serangan ${by}!`;
        if (m.pos != null) this.pos = m.pos;
        if (m.kind === "blocked") this.shield = false;
        toast(txt, 4000);
        m.kind === "blocked" ? Sfx.correct() : Sfx.wrong();
        try { navigator.vibrate && navigator.vibrate([200, 80, 200]); } catch {}
        return true;
      }
      case "end":
        if (m.mode !== "map") return false;
        this.mEnd(m); return true;
      case "lobby":
        spaceOn(false); this.mode = "classic"; this.inv = []; this.mClosePicker(); return false;
    }
    return false;
  };

  Player.mTop = function (left) {
    return `<div class="p-top"><span>🗺️ Petak <b>${this.pos ?? 0}</b>/${GOAL}${this.shield ? " 🛡️" : ""}</span>${left}</div>`;
  };

  Player.mQuestion = function (m) {
    this.mClosePicker();
    this.qi = m.qi; this.pos = m.pos; if (m.inv) this.inv = m.inv;
    this.stopTimer && this.stopTimer();
    const top = this.mTop(`<span id="pt">⏱ ${m.left}</span>`);
    if (m.frozen) {
      render(`${top}
        <div class="center frozen">
          <div class="big-emoji">❄️</div>
          <h2 style="margin:0">Kamu dibekukan!</h2>
          <p>Kamu tidak bisa menjawab soal ini. Tunggu soal berikutnya…</p>
          <div class="p-q" style="opacity:.6">${esc(m.q)}</div>
        </div>
        <div class="p-bottom"><span>${avHtml(this.av)} ${esc(this.name)}</span><span class="score-tag">${this.score}</span></div>`);
      Sfx.wrong();
      this.stopTimer = countdown(m.left, (l) => { const el = document.getElementById("pt"); if (el) el.textContent = `⏱ ${l}`; }, () => {});
      return;
    }
    render(`${top}
      <div class="p-q">${m.hots ? `<span class="hots-tag">🔥 HOTS</span><br>` : ""}${esc(m.q)}</div>
      ${m.hide && m.hide.length ? `<div class="bocoran">💡 Bocoran aktif: 2 jawaban salah dihapus!</div>` : ""}
      ${answerButtons({ a: m.a }, { clickable: true, cls: "p-answers" })}
      <div class="p-bottom"><span>${avHtml(this.av)} ${esc(this.name)}</span><span class="score-tag">Soal ${m.qi + 1}/${m.total}</span></div>`);
    (m.hide || []).forEach((i) => { const b = document.querySelector(`.p-answers .ans[data-i="${i}"]`); if (b) { b.classList.add("gone"); b.disabled = true; } });
    let sent = false;
    document.querySelectorAll(".p-answers .ans").forEach((b) => b.onclick = () => {
      if (sent || b.disabled) return; sent = true;
      try { navigator.vibrate && navigator.vibrate(40); } catch {}
      Sfx.tick();
      this.conn.send({ t: "answer", qi: m.qi, choice: +b.dataset.i });
      b.classList.add("picked"); document.querySelectorAll(".p-answers .ans").forEach((x) => { if (x !== b) x.classList.add("dim"); });
    });
    this.stopTimer = countdown(m.left, (l) => { const el = document.getElementById("pt"); if (el) el.textContent = `⏱ ${l}`; }, () => {
      if (!sent) this.waiting("Waktu habis! ⌛", "Tunggu hasilnya…", "⌛");
    });
  };

  Player.mProgress = function () {
    const pct = Math.round(((this.pos || 0) / GOAL) * 100);
    return `<div class="mprog"><div class="mbar"><span style="width:${pct}%"></span><i style="left:${pct}%">${avHtml(this.av)}</i></div><div class="mlbl"><span>START</span><span>Petak ${this.pos || 0}/${GOAL}</span><span>🏁</span></div></div>`;
  };

  // ----- Peta mini di HP: lihat posisi semua pemain & ketuk lawan untuk menyerang -----
  const ATTACKS = ["freeze", "bomb"];
  Player.mHasAttack = function () { return (this.inv || []).some((k) => ATTACKS.includes(k)); };
  Player.mMapHtml = function () {
    const rows = this.mrows || [];
    const occ = new Map();
    rows.forEach((r) => { const t = Math.max(0, Math.min(GOAL, r.pos || 0)); if (!occ.has(t)) occ.set(t, []); occ.get(t).push(r); });
    const armed = this.mHasAttack();
    let html = "";
    for (let t = 0; t <= GOAL; t++) {
      const row = Math.floor(t / COLS), ci = t % COLS, col = row % 2 === 0 ? ci : COLS - 1 - ci;
      const here = occ.get(t) || [];
      const mine = here.some((r) => r.n === this.name);
      const foes = here.filter((r) => r.n !== this.name);
      html += `<button type="button" class="pt${t === 0 ? " start" : ""}${t === GOAL ? " goal" : ""}${mine ? " mine" : ""}${foes.length ? " foe" : ""}${foes.length && armed ? " armed" : ""}" data-t="${t}" style="grid-row:${row + 1};grid-column:${col + 1}"${foes.length ? "" : " tabindex=\"-1\""}>
        ${SPACE_DECOR[t] ? `<span class="pdecor">${SPACE_DECOR[t]}</span>` : ""}<span class="ptn">${t === 0 ? "🚀" : t === GOAL ? "🛸" : t}</span>
        <span class="ptoks">${here.slice(0, 3).map((r) => `<span class="ptok${r.n === this.name ? " me" : ""}${r.sh ? " sh" : ""}">${avHtml(r.av)}</span>`).join("")}${here.length > 3 ? `<span class="pmore">+${here.length - 3}</span>` : ""}</span>
      </button>`;
    }
    return `<div class="pmap-wrap" id="pmap">
      <h3>🗺️ Peta <small>${armed ? "Ketuk lawan untuk menyerang ⚔️" : "Dapatkan ❄️/💣 untuk menyerang"}</small></h3>
      <div class="pmap" style="grid-template-columns:repeat(${COLS},1fr)">${html}</div>
    </div>`;
  };
  Player.mBindMap = function () {
    document.querySelectorAll("#pmap .pt.foe").forEach((b) => b.onclick = () => {
      const t = +b.dataset.t;
      this.mAttackSheet((this.mrows || []).filter((r) => r.n !== this.name && Math.max(0, Math.min(GOAL, r.pos || 0)) === t));
    });
    document.querySelectorAll("#pmap .pt.mine:not(.foe)").forEach((b) => b.onclick = () => toast(`Kamu di petak ${this.pos || 0}. ${GOAL - (this.pos || 0)} petak lagi ke 🏁`));
  };
  // Lembar serang: pilih lawan (kalau satu petak berisi beberapa) lalu pilih senjata
  Player.mAttackSheet = function (targets) {
    if (!targets.length) return;
    const weapons = (this.inv || []).map((k, i) => ({ k, i })).filter((w) => ATTACKS.includes(w.k));
    this.mClosePicker();
    this._picking = true;
    const ov = document.createElement("div");
    ov.className = "picker"; ov.id = "picker";
    ov.innerHTML = `<div class="picker-card">
        <h3>⚔️ Serang lawan</h3>
        ${weapons.length ? `<p class="muted">Pilih senjata untuk menyerang. ${targets.some((r) => r.sh) ? "🛡️ = lawan punya perisai (seranganmu akan tertahan)." : ""}</p>`
          : `<p class="muted">Kamu belum punya senjata serang. Dapatkan ❄️ Freeze / 💣 Bom dari 3x benar beruntun atau benar soal HOTS.</p>`}
        <div class="picker-list">${targets.map((r) => `
          <div class="atk">
            <div class="atk-who">${avHtml(r.av)} <span class="pkn">${esc(r.n)}</span><small>${r.sh ? "🛡️ " : ""}${r.fz ? "❄️ " : ""}Petak ${r.pos}</small></div>
            <div class="atk-btns">${weapons.map((w) => `<button class="btn ${w.k === "bomb" ? "accent" : "white"} atk-go" data-k="${esc(r.k)}" data-i="${w.i}" data-w="${w.k}">${SKILLS[w.k].icon} ${SKILLS[w.k].name}</button>`).join("") || `<span class="muted">—</span>`}</div>
          </div>`).join("")}
        </div>
        <button class="btn ghost" id="pkCancel">Tutup</button>
      </div>`;
    document.body.appendChild(ov);
    ov.querySelectorAll(".atk-go").forEach((b) => b.onclick = () => {
      try { this.conn.send({ t: "skill", i: +b.dataset.i, k: b.dataset.w, target: b.dataset.k }); } catch {}
      Sfx.tick(); this.mClosePicker();
    });
    ov.onclick = (e) => { if (e.target === ov) this.mClosePicker(); };
    document.getElementById("pkCancel").onclick = () => this.mClosePicker();
  };

  Player.mInvHtml = function () {
    const inv = this.inv || [];
    const slots = [0, 1, 2].map((i) => {
      const k = inv[i];
      if (!k || !SKILLS[k]) return `<div class="slot empty"><span class="si">＋</span><small>Slot kosong</small></div>`;
      const s = SKILLS[k];
      return `<button class="slot" data-i="${i}"><span class="si">${s.icon}</span><b>${s.name}</b><small>${s.desc}</small><span class="use">PAKAI</span></button>`;
    }).join("");
    const status = [this.shield ? "🛡️ Perisai aktif" : "", this.clueNext ? "💡 Bocoran siap" : ""].filter(Boolean).join(" · ");
    return `<div class="inv" id="inv"><h3>🎒 Senjata & Skill <small>${inv.length}/${MAX_INV}</small></h3>${status ? `<div class="inv-status">${status}</div>` : ""}<div class="slots">${slots}</div></div>`;
  };
  Player.mBindInv = function () {
    document.querySelectorAll("#inv .slot[data-i]").forEach((b) => b.onclick = () => this.mUse(+b.dataset.i));
  };
  Player.mRefreshInv = function () {
    const el = document.getElementById("inv");
    if (el) { el.outerHTML = this.mInvHtml(); this.mBindInv(); }
    const mp = document.getElementById("pmap");
    if (mp) { mp.outerHTML = this.mMapHtml(); this.mBindMap(); }
  };

  Player.mUse = function (i) {
    const k = (this.inv || [])[i], s = SKILLS[k];
    if (!s) return;
    if (!s.target) { try { this.conn.send({ t: "skill", i, k }); } catch {} return; }
    const others = (this.mrows || []).filter((r) => r.n !== this.name);
    if (!others.length) { toast("Belum ada lawan untuk diserang"); return; }
    this.mClosePicker();
    this._picking = true;
    const ov = document.createElement("div");
    ov.className = "picker"; ov.id = "picker";
    ov.innerHTML = `<div class="picker-card">
        <h3>${s.icon} ${s.name}: pilih target</h3><p class="muted">${s.desc}</p>
        <div class="picker-list">${others.map((r) => `<button class="pk" data-k="${esc(r.k)}">${avHtml(r.av)} <span class="pkn">${esc(r.n)}</span><small>${r.sh ? "🛡️ " : ""}Petak ${r.pos}</small></button>`).join("")}</div>
        <button class="btn ghost" id="pkCancel">Batal</button>
      </div>`;
    document.body.appendChild(ov);
    ov.querySelectorAll(".pk").forEach((b) => b.onclick = () => {
      try { this.conn.send({ t: "skill", i, k, target: b.dataset.k }); } catch {}
      Sfx.tick(); this.mClosePicker();
    });
    document.getElementById("pkCancel").onclick = () => this.mClosePicker();
  };
  Player.mClosePicker = function () {
    const ov = document.getElementById("picker"); if (ov) ov.remove();
    if (this._picking) {
      this._picking = false;
      const pend = this._pendingBoard; this._pendingBoard = null;
      if (pend) this.mBoardView(pend);
    }
  };

  Player.mRankList = function (rows) {
    const me = rows.findIndex((r) => r.n === this.name);
    const show = rows.slice(0, 5);
    if (me >= 5) show.push(rows[me]);
    return `<div class="lb">${show.map((r) => {
      const i = rows.indexOf(r);
      return `<div class="lb-row${r.n === this.name ? " me" : ""}"${r.n === this.name ? "" : ` data-k="${esc(r.k)}" role="button"`}><span class="lb-rank">${i + 1}</span><span class="lb-name">${avHtml(r.av)} ${esc(r.n)}${r.n === this.name ? " · kamu" : ""}</span><span class="mv same">${r.sh ? "🛡️" : ""}${r.fz ? "❄️" : ""}</span><span class="lb-right"><span class="lb-score">${r.pos}</span><small class="lb-gap">petak</small></span></div>`;
    }).join("")}</div>`;
  };

  Player.mResult = function (m) {
    this.stopTimer && this.stopTimer();
    this.pos = m.pos; this.inv = m.inv || []; this.shield = m.shield; this.score = m.score; this.mrows = m.rows || [];
    const ok = m.correct;
    const head = m.frozen ? { cls: "bad", emo: "❄️", title: "Beku", sub: "Kamu dibekukan lawan di soal ini." }
      : !m.answered ? { cls: "bad", emo: "😴", title: "Lewat", sub: "Kamu tidak menjawab." }
      : ok ? { cls: "ok", emo: "✅", title: "Benar!", sub: "" } : { cls: "bad", emo: "❌", title: "Salah", sub: "" };
    const chips = ok ? [`✓ Benar +1`, m.hots ? `🔥 HOTS +1` : "", m.fastest ? `⚡ Tercepat +1` : ""].filter(Boolean) : [];
    const nextBonus = 3 - (m.streak % 3);
    render(`
      ${this.mTop(`<span>#${m.rank} dari ${m.total}</span>`)}
      <div class="result-screen ${head.cls}">
        <div class="big-emoji">${head.emo}</div>
        <h2 class="result-title">${head.title}</h2>
        ${head.sub ? `<div>${head.sub}</div>` : ""}
        ${ok ? `<div class="points-pill">+${m.steps} petak</div><div class="mini-top">${chips.map((c) => `<span>${c}</span>`).join("")}</div>` : `<div style="opacity:.9">Jawaban: <b>${esc(m.right)}</b></div>`}
        ${m.earned && m.earned.length ? `<div class="earned">🎁 Dapat ${m.earned.map((e) => `${SKILLS[e.k].icon} <b>${SKILLS[e.k].name}</b>`).join(" & ")}!</div>` : ""}
        ${m.full ? `<div class="earned full">🎒 Tas penuh (maks ${MAX_INV}) — pakai senjatamu dulu!</div>` : ""}
        ${ok && !(m.earned && m.earned.length) && m.streak > 0 ? `<div>🔥 Beruntun ${m.streak}x · ${nextBonus} benar lagi dapat senjata</div>` : ""}
      </div>
      ${this.mProgress()}
      ${this.mInvHtml()}
      ${this.mMapHtml()}
      <div class="p-bottom"><span>${avHtml(this.av)} ${esc(this.name)}</span><span class="score-tag">Soal ${m.qn}/${m.nq}</span></div>`);
    this.mBindInv(); this.mBindMap();
    if (m.earned && m.earned.length) { Sfx.fanfare(); try { navigator.vibrate && navigator.vibrate([60, 40, 60, 40, 60]); } catch {} }
    else ok ? Sfx.correct() : Sfx.wrong();
  };

  Player.mBoardView = function (m) {
    this.mrows = m.rows || [];
    if (this._picking) { this._pendingBoard = m; return; }
    this.pos = m.pos; this.inv = m.inv || []; this.shield = m.shield; this.clueNext = m.clueNext;
    render(`
      ${this.mTop(`<span>#${m.rank} dari ${m.total}</span>`)}
      <div class="p-board">
        <div class="title-pill" style="font-size:20px;align-self:center">🚀 Peta Galaksi</div>
        ${m.winner ? `<div class="earned">🏁 ${esc(m.winner)} sudah finish!</div>` : ""}
        ${m.frozenNext ? `<div class="earned full">❄️ Kamu akan dibekukan di soal berikutnya!</div>` : ""}
        ${this.mInvHtml()}
        ${this.mMapHtml()}
        <h3>Posisi <small>Soal ${m.qn}/${m.nq}</small></h3>
        ${this.mRankList(this.mrows)}
        <p class="foot" style="text-align:center;margin:6px auto 0">Ketuk lawan di peta atau di daftar untuk menyerang ⚔️</p>
      </div>
      <div class="p-bottom"><span>${avHtml(this.av)} ${esc(this.name)}</span><span class="score-tag">${this.score}</span></div>`);
    this.mBindInv(); this.mBindMap();
    document.querySelectorAll(".p-board .lb-row[data-k]").forEach((el) => el.onclick = () => this.mAttackSheet((this.mrows || []).filter((r) => r.k === el.dataset.k)));
  };

  Player.mEnd = function (m) {
    this._ended = true; this.mClosePicker();
    const medal = MEDALS[m.rank - 1];
    const msg = m.rank === 1 ? "JUARA BALAPAN! 🏁👑" : m.rank <= 3 ? "Naik podium! Keren! 🎉" : "Terima kasih sudah ikut balapan! 🙌";
    render(`
      <div class="center">
        <div class="big-emoji">${medal || "🏁"}</div>
        <div class="title-pill">Peringkat #${m.rank} dari ${m.total}</div>
        <h2 style="margin:0">${msg}</h2>
        <div class="points-pill">Petak ${m.pos}/${m.goal}</div>
        <div class="mini-top"><span>✅ Benar ${m.correct}/${m.nq}</span><span>⭐ ${m.score} poin</span></div>
        <p class="foot">Lihat podium di layar host 👀</p>
      </div>`);
    if (m.rank <= 3) { Sfx.fanfare(); confetti(); }
  };
})();
