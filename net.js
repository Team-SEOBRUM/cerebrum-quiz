/* Cerebrum Quiz — lapisan koneksi realtime lewat MQTT (WebSocket/WSS).
 *
 * Sebelumnya HP pemain tersambung langsung ke laptop host lewat WebRTC (PeerJS).
 * Itu sering gagal di data seluler / Wi-Fi kantor (NAT ketat). Sekarang semua pesan
 * lewat broker MQTT publik di port HTTPS-WebSocket, jadi jalan di jaringan mana pun
 * yang bisa membuka website.
 *
 * API-nya sengaja dibuat mirip PeerJS supaya logika game tidak berubah:
 *   host  : new RoomPeer(id)        -> on("open"), on("connection", conn), on("error", {type})
 *   pemain: new RoomPeer()          -> on("open"), connect(id) -> conn
 *   conn  : open, send(obj), close(), on("open" | "data" | "close" | "error")
 */
(() => {
  "use strict";

  // Broker dicoba berurutan; host & pemain memakai urutan yang sama.
  const BROKERS = window.CQ_BROKERS || [
    "wss://broker.emqx.io:8084/mqtt",
    "wss://broker.hivemq.com:8884/mqtt",
  ];
  const NS = "seobrum/cerebrum-quiz/v2/";
  const PING_MS = 6000;          // pemain kirim detak tiap 6 detik
  const HOST_TIMEOUT_MS = 25000; // host anggap pemain putus kalau 25 detik tanpa kabar
  const ROOM_WAIT_MS = 7000;     // pemain menunggu info room selama ini

  const rid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  const enc = (o) => JSON.stringify(o);
  const dec = (buf) => { try { const s = String(buf); return s ? JSON.parse(s) : null; } catch { return undefined; } };

  class Emitter {
    constructor() { this._h = {}; }
    on(e, f) { (this._h[e] = this._h[e] || []).push(f); return this; }
    emit(e, ...a) { (this._h[e] || []).slice().forEach((f) => { try { f(...a); } catch (err) { console.error(err); } }); }
  }

  // Sambung ke broker pertama yang berhasil
  function connectBroker(opts, onClient, onFail, i = 0) {
    if (typeof window.mqtt === "undefined") { onFail(new Error("mqtt lib missing")); return; }
    if (i >= BROKERS.length) { onFail(new Error("no broker")); return; }
    let settled = false;
    const client = window.mqtt.connect(BROKERS[i], {
      clientId: "cq_" + rid(), clean: true, keepalive: 20, connectTimeout: 7000,
      reconnectPeriod: 0, protocolVersion: 4, ...opts,
    });
    const fail = () => {
      if (settled) return; settled = true;
      try { client.end(true); } catch {}
      connectBroker(opts, onClient, onFail, i + 1);
    };
    const t = setTimeout(fail, 8000);
    client.once("connect", () => {
      if (settled) return; settled = true; clearTimeout(t);
      client.options.reconnectPeriod = 2000; // setelah tersambung, boleh auto-reconnect
      onClient(client, i);
    });
    client.once("error", fail);
    client.once("close", () => { if (!settled) fail(); });
  }

  // ---------- Koneksi virtual (satu per pemain) ----------
  class Conn extends Emitter {
    constructor(sendFn, closeFn) { super(); this.open = false; this._send = sendFn; this._close = closeFn; }
    send(msg) { if (this.open) this._send(msg); }
    close() { if (!this.open) return; this.open = false; try { this._close(); } catch {} this.emit("close"); }
    _drop() { if (!this.open) return; this.open = false; this.emit("close"); }
  }

  class RoomPeer extends Emitter {
    constructor(id) {
      super();
      this.id = id || null;
      this.client = null;
      this.destroyed = false;
      if (this.id) this._startHost();
      else setTimeout(() => this.emit("open", null), 0); // pemain: broker disambung saat connect()
    }

    // ===== HOST =====
    _startHost() {
      const base = NS + this.id;
      const roomT = base + "/room";
      this.conns = new Map(); // cid -> Conn
      this.token = rid();
      connectBroker(
        { will: { topic: roomT, payload: "", retain: true, qos: 1 } },
        (client) => {
          if (this.destroyed) { client.end(true); return; }
          this.client = client;
          let claimed = false, checked = false;
          // Cek dulu apakah PIN sudah dipakai host lain (pesan retained di topik room)
          client.subscribe(roomT, { qos: 1 });
          const claim = () => {
            if (claimed || this.destroyed) return; claimed = true;
            client.unsubscribe(roomT);
            this._announce();
            client.subscribe(base + "/up/+", { qos: 1 }, (err) => {
              if (err) { this.emit("error", { type: "network" }); return; }
              this.emit("open", this.id);
            });
          };
          const timer = setTimeout(() => { checked = true; claim(); }, 1500);
          client.on("message", (topic, payload) => {
            if (topic === roomT) {
              if (checked || claimed) return;
              const m = dec(payload);
              if (m && m.token && m.token !== this.token && Date.now() - (m.ts || 0) < 6 * 3600e3) {
                clearTimeout(timer); checked = true;
                this.emit("error", { type: "unavailable-id" });
              }
              return;
            }
            const cid = topic.slice(base.length + 4); // ".../up/<cid>"
            const msg = dec(payload);
            if (!cid || msg === undefined || msg === null) return;
            this._hostMsg(base, cid, msg);
          });
          // Kalau koneksi ke broker sempat putus lalu tersambung lagi, umumkan room lagi
          client.on("connect", () => { if (claimed) this._announce(); });
          client.on("offline", () => this.emit("disconnected"));
          this._sweep = setInterval(() => {
            const now = Date.now();
            for (const [cid, c] of this.conns) if (now - c.lastSeen > HOST_TIMEOUT_MS) { this.conns.delete(cid); c._drop(); }
          }, 3000);
        },
        () => this.emit("error", { type: "network" }),
      );
    }
    _announce() {
      if (!this.client) return;
      this.client.publish(NS + this.id + "/room", enc({ token: this.token, ts: Date.now() }), { qos: 1, retain: true });
    }
    _hostMsg(base, cid, msg) {
      let c = this.conns.get(cid);
      if (msg.t === "_bye") { if (c) { this.conns.delete(cid); c._drop(); } return; }
      if (!c) {
        c = new Conn(
          (m) => this.client && this.client.publish(base + "/down/" + cid, enc(m), { qos: 1 }),
          () => this.client && this.client.publish(base + "/down/" + cid, enc({ t: "_close" }), { qos: 1 }),
        );
        c.open = true; c.lastSeen = Date.now();
        this.conns.set(cid, c);
        this.emit("connection", c);
      }
      c.lastSeen = Date.now();
      if (msg.t === "_open" || msg.t === "_ping") return;
      c.emit("data", msg);
    }

    // ===== PEMAIN =====
    connect(hostId) {
      const base = NS + hostId;
      const cid = rid();
      const upT = base + "/up/" + cid, downT = base + "/down/" + cid, roomT = base + "/room";
      const conn = new Conn(
        (m) => this.client && this.client.publish(upT, enc(m), { qos: 1 }),
        () => { if (this.client) { this.client.publish(upT, enc({ t: "_bye" }), { qos: 1 }); setTimeout(() => this.destroy(), 300); } },
      );
      connectBroker(
        { will: { topic: upT, payload: enc({ t: "_bye" }), qos: 1, retain: false } },
        (client) => {
          if (this.destroyed) { client.end(true); return; }
          this.client = client;
          let found = false, first = true;
          const notFound = setTimeout(() => { if (!found) this.emit("error", { type: "peer-unavailable" }); }, ROOM_WAIT_MS);
          client.on("message", (topic, payload) => {
            const m = dec(payload);
            if (topic === roomT) {
              if (m && m.token) {
                if (!found) {
                  found = true; clearTimeout(notFound);
                  conn.open = true;
                  client.publish(upT, enc({ t: "_open" }), { qos: 1 });
                  conn.emit("open");
                }
              } else if (found && m === null) {
                conn._drop(); // host menutup room / host offline
              }
              return;
            }
            if (topic === downT && m) {
              if (m.t === "_close") { conn._drop(); return; }
              conn.emit("data", m);
            }
          });
          client.subscribe([downT, roomT], { qos: 1 }, (err) => { if (err) this.emit("error", { type: "network" }); });
          this._ping = setInterval(() => { if (conn.open) client.publish(upT, enc({ t: "_ping" }), { qos: 0 }); }, PING_MS);
          // Putus sambungan broker di tengah game -> anggap koneksi terputus (pemain bisa sambung lagi)
          client.on("connect", () => { if (!first) conn._drop(); first = false; });
          client.on("offline", () => conn._drop());
        },
        () => this.emit("error", { type: "network" }),
      );
      return conn;
    }

    reconnect() { /* mqtt.js menyambung ulang sendiri */ }
    destroy() {
      if (this.destroyed) return;
      this.destroyed = true;
      clearInterval(this._sweep); clearInterval(this._ping);
      const c = this.client; this.client = null;
      if (!c) return;
      try {
        if (this.id) c.publish(NS + this.id + "/room", "", { qos: 1, retain: true }, () => c.end());
        else c.end();
      } catch {}
    }
  }

  window.RoomPeer = RoomPeer;
})();
