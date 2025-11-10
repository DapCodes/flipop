<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Flipop — Memory Card Flip</title>
  <style>
    * { box-sizing: border-box; }
    html, body { height: 100%; }
    body {
      margin: 0;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
      color: #111827;
      background: radial-gradient(1200px 600px at 70% -10%, #dbeafe 0%, #ffffff 40%) fixed;
    }
    .wrap { min-height: 100%; display: grid; grid-template-rows: auto 1fr auto; }
    header {
      padding: 16px 20px; display: flex; gap: 12px; align-items: center; justify-content: space-between;
      backdrop-filter: blur(6px);
    }
    .brand { font-weight: 800; letter-spacing: 0.5px; display: flex; align-items: center; gap: 10px; }
    .brand-badge {
      width: 32px; height: 32px; border-radius: 10px;
      background: linear-gradient(135deg, #60a5fa, #a78bfa);
      display: grid; place-items: center; color: white; font-weight: 900; transform: rotate(-10deg);
    }
    .stats { display: flex; gap: 12px; align-items: center; font-weight: 600; flex-wrap: wrap; }
    .stat { background: #f3f4f6; padding: 8px 12px; border-radius: 10px; }
    .hidden-on-start { visibility: hidden; }
    main { display: grid; place-items: center; padding: 16px 20px 32px; }
    .welcome {
      text-align: center; display: grid; gap: 14px; max-width: 680px;
      background: rgba(255,255,255,0.7); padding: 28px; border-radius: 18px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.06); animation: floatIn .5s ease both;
    }
    .welcome h1 { margin: 0; font-size: clamp(28px, 5vw, 44px); line-height: 1.1; letter-spacing: .3px; }
    .welcome p { margin: 0; opacity: .8; }
    @keyframes floatIn { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .btn {
      border: none; padding: 12px 16px; border-radius: 12px; font-weight: 700; cursor: pointer;
      transition: transform .06s ease, box-shadow .2s ease, background .2s ease;
      background: #111827; color: #fff; box-shadow: 0 6px 16px rgba(17,24,39,.2);
    }
    .btn:hover { transform: translateY(-1px); }
    .btn:active { transform: translateY(0); filter: brightness(.95); }
    .btn.primary { background: linear-gradient(135deg, #2563eb, #7c3aed); }
    .btn.ghost { background: #f3f4f6; color: #111827; box-shadow: none; }
    .btn.small { padding: 8px 12px; border-radius: 10px; font-weight: 700; }
    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.25); display: none; place-items: center; padding: 20px; z-index: 30; }
    .modal {
      width: 100%; max-width: 520px; background: white; border-radius: 16px; padding: 22px;
      box-shadow: 0 20px 60px rgba(0,0,0,.25); animation: pop .16s ease both;
    }
    @keyframes pop { from{ transform: scale(.96); opacity: 0 } to{ transform: scale(1); opacity: 1 } }
    .choices { display: grid; gap: 10px; grid-template-columns: 1fr; }
    .choice {
      display: flex; align-items: center; justify-content: space-between; padding: 14px;
      border: 2px solid #e5e7eb; border-radius: 12px; cursor: pointer; transition: border-color .15s ease, transform .06s ease;
    }
    .choice:hover { border-color: #a78bfa; transform: translateY(-1px); }
    .board { width: min(1100px, 94vw); display: grid; gap: 12px; perspective: 1400px; position: relative; }
    .cols-4 { grid-template-columns: repeat(4, 1fr); }
    .cols-6 { grid-template-columns: repeat(6, 1fr); }
    .cols-8 { grid-template-columns: repeat(8, 1fr); }
    .card {
      position: relative; aspect-ratio: 3 / 4; cursor: pointer; transform-style: preserve-3d;
      border-radius: 14px; will-change: transform; transition: transform .18s ease;
      animation: deal .5s cubic-bezier(.2,.8,.2,1) both;
    }
    .card:not(.flipped):hover { transform: translateY(-3px); }
    @keyframes deal { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
    .card-inner {
      position: absolute; inset: 0; border-radius: 14px; background: #111827;
      box-shadow: 0 10px 24px rgba(17,24,39,.20);
      transform: rotateY(0); transform-style: preserve-3d;
      transition: transform .64s cubic-bezier(.2,.8,.2,1), box-shadow .4s ease;
      will-change: transform, box-shadow;
    }
    .flipped .card-inner { transform: rotateY(180deg); box-shadow: 0 16px 32px rgba(17,24,39,.28); }
    .face, .back {
      position: absolute; inset: 0; display: grid; place-items: center; backface-visibility: hidden; border-radius: 14px; user-select: none;
    }
    .face { font-size: clamp(24px, 5vw, 42px); background: white; transform: rotateY(180deg); }
    .back { background: linear-gradient(135deg, #60a5fa, #a78bfa); color: white; font-weight: 900; letter-spacing: 1px; }
    .matched { pointer-events: none; }
    .matched .face { outline: 3px solid #34d399; animation: pulse .42s ease; }
    @keyframes pulse { 0%{ transform: rotateY(180deg) scale(.98) } 100%{ transform: rotateY(180deg) scale(1) } }
    .board.locked .card { pointer-events: none; }
    .prestart {
      position: absolute; inset: 0; display: none; place-items: center; z-index: 25;
      background: rgba(255,255,255,.65); backdrop-filter: blur(2px); border-radius: 16px;
    }
    .prestart .panel { text-align: center; display: grid; gap: 10px; }
    .countdown {
      position: absolute; inset: 0; display: none; place-items: center; z-index: 26;
      font-size: clamp(36px, 8vw, 80px); font-weight: 900; color: #111827;
      background: rgba(255,255,255,.7); backdrop-filter: blur(2px); border-radius: 16px;
      animation: pop .2s ease both;
    }
    .win { position: fixed; inset: 0; display: none; place-items: center; z-index: 40; }
    .win .panel {
      background: rgba(255,255,255,.9); border: 2px solid #e5e7eb; backdrop-filter: blur(4px);
      padding: 28px; border-radius: 18px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,.15); animation: floatIn .4s ease both;
    }
    .big { font-size: clamp(26px, 4.2vw, 42px); font-weight: 900; margin: 0 0 8px; }
    .sub { margin: 0 0 20px; opacity: .8; }
    .confetti { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 45; }
    .confetti i { position: absolute; width: 10px; height: 14px; opacity: .9; border-radius: 2px; animation: fall linear forwards; }
    @keyframes fall { to { transform: translateY(110vh) rotate(620deg); opacity: 1; } }
    footer { padding: 10px 16px 16px; text-align: center; opacity: .7; font-size: 12px; }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <div class="brand">
        <div class="brand-badge">F</div>
        <div>Flipop</div>
      </div>
      <div class="stats hidden-on-start" id="stats">
        <div class="stat">Langkah: <span id="moves">0</span></div>
        <div class="stat">Waktu: <span id="time">00:00</span></div>
        <button class="btn small ghost" id="btnRestart" title="Mulai ulang">↻ Mulai Ulang</button>
      </div>
    </header>

    <main>
      <section class="welcome" id="welcome">
        <h1>Selamat Datang di <span style="color:#7c3aed">Flipop</span> 🃏</h1>
        <p>Balik dan cocokkan pasangan kartu secepat mungkin.</p>
        <p><small>Latihan: array shuffle, game loop, animasi CSS/JS.</small></p>
        <div style="display:flex; gap:10px; justify-content:center; margin-top:12px;">
          <button class="btn primary" id="btnMulai">Mulai</button>
          <button class="btn ghost" id="btnCara">Cara Main</button>
        </div>
      </section>

      <section class="board cols-4" id="board" aria-label="Papan Kartu" style="display:none">
        <div class="prestart" id="prestart">
          <div class="panel">
            <div style="font-weight:800; font-size:18px">Siap menghafal posisi kartu?</div>
            <button class="btn primary" id="btnPrestart">Mulai</button>
            <div style="opacity:.7; font-size:12px;">Setelah klik, akan ada hitung mundur 3…2…1 lalu kartu tertutup.</div>
          </div>
        </div>
        <div class="countdown" id="countdown">3</div>
      </section>
    </main>

    <footer>© 2025 Flipop – dibuat untuk latihan logika & animasi</footer>
  </div>

  <div class="modal-backdrop" id="modalDiff" role="dialog" aria-modal="true" aria-labelledby="diffTitle">
    <div class="modal">
      <h3 id="diffTitle" style="margin-top:0;">Pilih Kesulitan</h3>
      <div class="choices" id="choices"></div>
      <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:14px;">
        <button class="btn ghost" id="btnBatal">Batal</button>
      </div>
    </div>
  </div>

  <div class="win" id="win">
    <div class="panel">
      <div class="big">Kamu Menang! 🎉</div>
      <p class="sub">Selesai dalam <b><span id="finalTime">00:00</span></b> dengan <b><span id="finalMoves">0</span></b> langkah.</p>
      <div style="display:flex; gap:10px; justify-content:center;">
        <button class="btn primary" id="btnMainLagi">Main Lagi</button>
        <button class="btn ghost" id="btnGanti"><span>Ganti Kesulitan</span></button>
      </div>
    </div>
  </div>
  <div class="confetti" id="confetti" aria-hidden="true"></div>

  <script>
    const fmtMMSS = (sec) => {
      const m = Math.floor(sec / 60).toString().padStart(2, "0");
      const s = (sec % 60).toString().padStart(2, "0");
      return `${m}:${s}`;
    };
    const shuffle = (arr) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };
    const el = (tag, cls, txt) => {
      const e = document.createElement(tag);
      if (cls) e.className = cls;
      if (txt !== undefined) e.textContent = txt;
      return e;
    };

    const DIFFICULTIES = [
      { key: "mudah",  pairs: 4,  label: "Mudah (8 kartu)"  },
      { key: "sedang", pairs: 8,  label: "Sedang (16 kartu)" },
      { key: "sulit",  pairs: 16, label: "Sulit (32 kartu)"  },
    ];
    const ICONS = [
      "🐶","🐱","🦊","🐻","🐼","🦁","🐮","🐸",
      "🐵","🦄","🐷","🐯","🐔","🐙","🐳","🦋",
      "🍎","🍌","🍇","🍉","🍓","🥑","🍩","🍪",
      "⚽","🏀","🏈","🎾","🎮","🎲","🎧","🎹"
    ];

    const boardEl = document.getElementById("board");
    const welcomeEl = document.getElementById("welcome");
    const modalDiff = document.getElementById("modalDiff");
    const choicesEl = document.getElementById("choices");
    const statsEl = document.getElementById("stats");
    const movesEl = document.getElementById("moves");
    const timeEl  = document.getElementById("time");
    const prestartEl = document.getElementById("prestart");
    const btnPrestart = document.getElementById("btnPrestart");
    const countdownEl = document.getElementById("countdown");
    const winEl = document.getElementById("win");
    const finalMovesEl = document.getElementById("finalMoves");
    const finalTimeEl = document.getElementById("finalTime");
    const confettiEl = document.getElementById("confetti");

    let currentPairs = 4;
    let deck = [];
    let firstPick = null;
    let secondPick = null;
    let matchedCount = 0;
    let moves = 0;
    let timer = { running: false, sec: 0, int: null };
    let gamePhase = "idle";

    document.getElementById("btnMulai").addEventListener("click", openDiff);
    document.getElementById("btnCara").addEventListener("click", () => {
      alert("Cocokkan 2 kartu yang sama.\n- Klik 'Mulai' → pilih kesulitan.\n- Hafalkan saat preview, lalu kartu tertutup.\n- Buka 2 kartu. Jika sama akan tetap terbuka.\n- Selesai saat semua pasangan ditemukan.");
    });
    document.getElementById("btnBatal").addEventListener("click", closeDiff);
    document.getElementById("btnRestart").addEventListener("click", () => startGame(currentPairs));
    document.getElementById("btnMainLagi").addEventListener("click", () => { closeWin(); startGame(currentPairs); });
    document.getElementById("btnGanti").addEventListener("click", () => { closeWin(); openDiff(); });
    btnPrestart.addEventListener("click", startCountdown);

    DIFFICULTIES.forEach(d => {
      const row = el("div", "choice");
      const left = el("div", "", d.label);
      const right = el("button", "btn small primary", "Pilih");
      right.addEventListener("click", () => { closeDiff(); startGame(d.pairs); });
      row.append(left, right);
      choicesEl.appendChild(row);
    });

    function openDiff()  { modalDiff.style.display = "grid"; }
    function closeDiff() { modalDiff.style.display = "none"; }

    function startGame(pairs) {
      statsEl.classList.remove("hidden-on-start");
      welcomeEl.style.display = "none";
      boardEl.style.display = "grid";
      currentPairs = pairs;
      matchedCount = 0;
      moves = 0;
      movesEl.textContent = "0";
      stopTimer(true);
      gamePhase = "preview";
      buildDeck();
      renderBoard();
      setGridCols();
      flipAll(true);
      boardEl.classList.add("locked");
      prestartEl.style.display = "grid";
      countdownEl.style.display = "none";
    }

    function setGridCols() {
      const total = currentPairs * 2;
      boardEl.classList.remove("cols-4","cols-6","cols-8");
      if (total <= 8) boardEl.classList.add("cols-4");
      else if (total <= 16) boardEl.classList.add("cols-6");
      else boardEl.classList.add("cols-8");
    }

    function buildDeck() {
      const pool = ICONS.slice(0);
      shuffle(pool);
      const selected = pool.slice(0, currentPairs);
      const doubled = selected.flatMap((icon, i) => ([
        { id: `${i}-a`, value: icon, matched: false },
        { id: `${i}-b`, value: icon, matched: false },
      ]));
      deck = shuffle(doubled);
    }

    function renderBoard() {
      boardEl.querySelectorAll(".card").forEach(c => c.remove());
      deck.forEach((cardData, idx) => {
        const card = createCardElement(cardData);
        card.style.animationDelay = `${idx * 45}ms`;
        boardEl.insertBefore(card, prestartEl);
      });
    }

    function startCountdown() {
      if (gamePhase !== "preview") return;
      gamePhase = "countdown";
      prestartEl.style.display = "none";
      countdownEl.style.display = "grid";
      let n = 3;
      countdownEl.textContent = n;
      const iv = setInterval(() => {
        n--;
        if (n > 0) countdownEl.textContent = n;
        else {
          clearInterval(iv);
          countdownEl.textContent = "Mulai!";
          flipAll(false);
          setTimeout(() => {
            countdownEl.style.display = "none";
            boardEl.classList.remove("locked");
            gamePhase = "playing";
          }, 500);
        }
      }, 800);
    }

    function flipAll(open) {
      boardEl.querySelectorAll(".card").forEach(card => {
        card.classList.toggle("flipped", open);
      });
    }

    function createCardElement(cardData) {
      const root = el("div", "card");
      root.dataset.id = cardData.id;
      root.dataset.value = cardData.value;
      const inner = el("div", "card-inner");
      const face = el("div", "face", cardData.value);
      const back = el("div", "back", "FLIP");
      inner.append(face, back);
      root.append(inner);
      root.addEventListener("click", () => onFlip(root));
      return root;
    }

    function onFlip(cardEl) {
      if (gamePhase !== "playing") return;
      if (!timer.running) startTimer();
      if (cardEl.classList.contains("flipped") || cardEl.classList.contains("matched")) return;
      if (boardEl.classList.contains("locked")) return;
      cardEl.classList.add("flipped");
      if (!firstPick) { firstPick = cardEl; return; }
      if (!secondPick) {
        secondPick = cardEl;
        boardEl.classList.add("locked");
        setTimeout(checkPair, 320);
      }
    }

    function checkPair() {
      const v1 = firstPick.dataset.value;
      const v2 = secondPick.dataset.value;
      moves++;
      movesEl.textContent = moves;
      if (v1 === v2) {
        firstPick.classList.add("matched");
        secondPick.classList.add("matched");
        matchedCount++;
        resetSelection();
        if (matchedCount === currentPairs) {
          stopTimer(false);
          gamePhase = "won";
          setTimeout(showWin, 450);
        } else {
          boardEl.classList.remove("locked");
        }
      } else {
        setTimeout(() => {
          firstPick.classList.remove("flipped");
          secondPick.classList.remove("flipped");
          resetSelection();
          boardEl.classList.remove("locked");
        }, 520);
      }
    }

    function resetSelection() { firstPick = null; secondPick = null; }

    function startTimer() {
      timer.running = true;
      timer.int = setInterval(() => {
        timer.sec++;
        timeEl.textContent = fmtMMSS(timer.sec);
      }, 1000);
    }
    function stopTimer(reset = false) {
      if (timer.int) clearInterval(timer.int);
      timer.int = null;
      timer.running = false;
      if (reset) {
        timer.sec = 0;
        timeEl.textContent = "00:00";
      }
    }

    function showWin() {
      finalMovesEl.textContent = moves;
      finalTimeEl.textContent = fmtMMSS(timer.sec);
      winEl.style.display = "grid";
      burstConfetti();
    }
    function closeWin() { winEl.style.display = "none"; confettiEl.innerHTML = ""; }

    function burstConfetti() {
      const colors = ["#34d399","#60a5fa","#fbbf24","#f87171","#a78bfa","#fb7185","#22d3ee","#4ade80"];
      const count = 140;
      const w = window.innerWidth;
      for (let i = 0; i < count; i++) {
        const piece = document.createElement("i");
        piece.style.left = Math.random() * w + "px";
        piece.style.top = (-Math.random() * 40) + "px";
        piece.style.background = colors[Math.floor(Math.random()*colors.length)];
        piece.style.animationDuration = (4 + Math.random() * 2) + "s";
        piece.style.animationDelay = (Math.random() * .8) + "s";
        piece.style.transform = `translateY(0) rotate(${Math.random()*360}deg)`;
        confettiEl.appendChild(piece);
      }
      setTimeout(() => (confettiEl.innerHTML = ""), 7000);
    }

    window.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() === "r" && boardEl.style.display !== "none") startGame(currentPairs);
    });
  </script>
</body>
</html>
