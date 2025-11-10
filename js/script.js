// ====== Utils ======
const fmtMMSS = (sec) => {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
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

// ====== Consts ======
const DIFFICULTIES = [
  { key: "mudah", pairs: 4, label: "Mudah (8 kartu / 4 pasang)" },
  { key: "sedang", pairs: 8, label: "Sedang (16 kartu / 8 pasang)" },
  { key: "sulit", pairs: 16, label: "Sulit (32 kartu / 16 pasang)" },
];
const DIFF_FACTOR = { mudah: 1, sedang: 2, sulit: 3 };
const ICONS = [
  "🐶",
  "🐱",
  "🦊",
  "🐻",
  "🐼",
  "🦁",
  "🐮",
  "🐸",
  "🐵",
  "🦄",
  "🐷",
  "🐯",
  "🐔",
  "🐙",
  "🐳",
  "🦋",
  "🍎",
  "🍌",
  "🍇",
  "🍉",
  "🍓",
  "🥑",
  "🍩",
  "🍪",
  "⚽",
  "🏀",
  "🏈",
  "🎾",
  "🎮",
  "🎲",
  "🎧",
  "🎹",
];

// ====== Elements ======
const boardEl = document.getElementById("board");
const welcomeEl = document.getElementById("welcome");
const modalDiff = document.getElementById("modalDiff");
const choicesEl = document.getElementById("choices");
const statsEl = document.getElementById("stats");
const movesEl = document.getElementById("moves");
const timeEl = document.getElementById("time");
const prestartEl = document.getElementById("prestart");
const btnPrestart = document.getElementById("btnPrestart");
const countdownEl = document.getElementById("countdown");
const hudPlayersEl = document.getElementById("hudPlayers");

const modalName = document.getElementById("modalName");
const nameFields = document.getElementById("nameFields");
const btnNamaBatal = document.getElementById("btnNamaBatal");
const btnNamaOK = document.getElementById("btnNamaOK");

const modalHistory = document.getElementById("modalHistory");
const tblHistory = document.getElementById("tblHistory");
const modalLb = document.getElementById("modalLb");
const tblLb = document.getElementById("tblLb");

// Buttons (header)
document
  .getElementById("btnRestart")
  .addEventListener("click", () => startGame(state.difficulty.pairs));
document.getElementById("btnHistory").addEventListener("click", openHistory);
document
  .getElementById("btnLeaderboard")
  .addEventListener("click", openLeaderboard);
document.getElementById("btnTheme").addEventListener("click", toggleTheme);

// Welcome actions
document.getElementById("btnCara").addEventListener("click", () => {
  alert(
    "Cocokkan 2 kartu yang sama.\n- Pilih mode (Solo/Duel) dan masukkan nama.\n- Pilih kesulitan.\n- Preview → 3..2..1 → Mulai!\n- Duel: jika cocok, tetap giliranmu; jika salah, pindah.\n- Selesai saat semua pasangan ditemukan."
  );
});
document.getElementById("btnMulai").addEventListener("click", () => {
  if (!state.mode) state.mode = "solo";
  openNameModal();
});

// Mode cards (klik untuk memilih mode)
document.querySelectorAll(".mode-card").forEach((card) => {
  card.addEventListener("click", () => {
    state.mode = card.dataset.mode; // 'solo' | 'duel'
    openNameModal();
  });
});

// Diff modal
document.getElementById("btnBatal").addEventListener("click", closeDiff);
btnPrestart.addEventListener("click", startCountdown);

// History / Leaderboard modal closers
document
  .getElementById("btnCloseHistory")
  ?.addEventListener("click", () => (modalHistory.style.display = "none"));
document
  .getElementById("btnCloseLb")
  ?.addEventListener("click", () => (modalLb.style.display = "none"));

// Leaderboard tab & diff buttons
document.querySelectorAll(".lb-tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".lb-tab")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderLeaderboardTable();
  });
});
document.querySelectorAll(".lb-diff-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".lb-diff-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderLeaderboardTable();
  });
});

// ====== State ======
const state = {
  mode: null, // 'solo' | 'duel'
  players: {
    p1: { name: "", score: 0 },
    p2: { name: "", score: 0 },
    turnIndex: 0,
  },
  difficulty: { key: "mudah", pairs: 4 },
  deck: [],
  firstPick: null,
  secondPick: null,
  matchedCount: 0,
  moves: 0,
  timer: { running: false, sec: 0, int: null },
  gamePhase: "idle", // idle | preview | countdown | playing | won
  dataCache: { history: [], leaderboard: { solo: {}, duel: {} } },
};

// ====== Theme ======
(function initTheme() {
  const saved = localStorage.getItem("flipop-theme");
  if (saved === "dark") document.documentElement.classList.add("dark");
})();
function toggleTheme() {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem(
    "flipop-theme",
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );
}

// ====== Deck & Board ======
function setGridCols() {
  const total = state.difficulty.pairs * 2;
  boardEl.classList.remove("cols-4", "cols-6", "cols-8");
  if (total <= 8) boardEl.classList.add("cols-4");
  else if (total <= 16) boardEl.classList.add("cols-6");
  else boardEl.classList.add("cols-8");
}
function buildDeck() {
  const pool = ICONS.slice(0);
  shuffle(pool);
  const selected = pool.slice(0, state.difficulty.pairs);
  const doubled = selected.flatMap((icon, i) => [
    { id: `${i}-a`, value: icon, matched: false },
    { id: `${i}-b`, value: icon, matched: false },
  ]);
  state.deck = shuffle(doubled);
}
function createCardElement(cardData, idx) {
  const root = el("div", "card");
  root.dataset.id = cardData.id;
  root.dataset.value = cardData.value;
  const inner = el("div", "card-inner");
  const face = el("div", "face", cardData.value);
  const back = el("div", "back", "FLIP");
  inner.append(face, back);
  root.append(inner);
  root.addEventListener("click", () => onFlip(root));
  root.style.animationDelay = `${idx * 45}ms`;
  return root;
}
function renderBoard() {
  boardEl.querySelectorAll(".card").forEach((c) => c.remove());
  state.deck.forEach((cardData, idx) => {
    const card = createCardElement(cardData, idx);
    boardEl.insertBefore(card, prestartEl);
  });
}
function flipAll(open) {
  boardEl.querySelectorAll(".card").forEach((card) => {
    card.classList.toggle("flipped", open);
  });
}

// ====== Game Flow ======
function openDiff() {
  modalDiff.style.display = "grid";
}
function closeDiff() {
  modalDiff.style.display = "none";
}

function startGame(pairs) {
  statsEl.classList.remove("hidden-on-start");
  welcomeEl.style.display = "none";
  boardEl.style.display = "grid";
  state.difficulty.pairs = pairs;
  state.matchedCount = 0;
  state.moves = 0;
  movesEl.textContent = "0";
  stopTimer(true);
  state.gamePhase = "preview";
  buildDeck();
  renderBoard();
  setGridCols();
  flipAll(true);
  boardEl.classList.add("locked");
  prestartEl.style.display = "grid";
  countdownEl.style.display = "none";

  // Reset skor dan acak starter jika duel
  state.players.p1.score = 0;
  if (state.mode === "duel") {
    state.players.p2.score = 0;
    state.players.turnIndex = Math.random() < 0.5 ? 0 : 1;
  } else {
    state.players.turnIndex = 0;
  }
  updateHudPlayers();
}

function startCountdown() {
  if (state.gamePhase !== "preview") return;
  state.gamePhase = "countdown";
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
        state.gamePhase = "playing";
      }, 500);
    }
  }, 800);
}

function onFlip(cardEl) {
  if (state.gamePhase !== "playing") return;
  if (!state.timer.running) startTimer();
  if (
    cardEl.classList.contains("flipped") ||
    cardEl.classList.contains("matched")
  )
    return;
  if (boardEl.classList.contains("locked")) return;
  cardEl.classList.add("flipped");
  if (!state.firstPick) {
    state.firstPick = cardEl;
    return;
  }
  if (!state.secondPick) {
    state.secondPick = cardEl;
    boardEl.classList.add("locked");
    setTimeout(checkPair, 320);
  }
}

function checkPair() {
  const v1 = state.firstPick.dataset.value;
  const v2 = state.secondPick.dataset.value;
  state.moves++;
  movesEl.textContent = state.moves;

  if (v1 === v2) {
    state.firstPick.classList.add("matched");
    state.secondPick.classList.add("matched");
    state.matchedCount++;
    if (state.mode === "duel") {
      if (state.players.turnIndex === 0) state.players.p1.score++;
      else state.players.p2.score++;
      // turn tetap pada pemain yang sama ketika match
    }
    resetSelection();
    updateHudPlayers();
    if (state.matchedCount === state.difficulty.pairs) {
      stopTimer(false);
      state.gamePhase = "won";
      setTimeout(showWin, 450);
    } else {
      boardEl.classList.remove("locked");
    }
  } else {
    setTimeout(() => {
      state.firstPick.classList.remove("flipped");
      state.secondPick.classList.remove("flipped");
      resetSelection();
      if (state.mode === "duel") {
        state.players.turnIndex = state.players.turnIndex === 0 ? 1 : 0;
        updateHudPlayers();
      }
      boardEl.classList.remove("locked");
    }, 520);
  }
}

function resetSelection() {
  state.firstPick = null;
  state.secondPick = null;
}

// ====== Timer ======
function startTimer() {
  state.timer.running = true;
  state.timer.int = setInterval(() => {
    state.timer.sec++;
    timeEl.textContent = fmtMMSS(state.timer.sec);
  }, 1000);
}
function stopTimer(reset = false) {
  if (state.timer.int) clearInterval(state.timer.int);
  state.timer.int = null;
  state.timer.running = false;
  if (reset) {
    state.timer.sec = 0;
    timeEl.textContent = "00:00";
  }
}

// ====== HUD Players ======
function initials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}
function updateHudPlayers() {
  hudPlayersEl.innerHTML = "";
  if (state.mode === "solo") {
    const p = state.players.p1;
    const item = el("div", "hud-player active");
    const av = el("div", "avatar", initials(p.name || "P1"));
    const nm = el("div", "", p.name || "Pemain");
    item.append(av, nm);
    hudPlayersEl.appendChild(item);
  } else {
    const p1 = state.players.p1,
      p2 = state.players.p2;
    const item1 = el(
      "div",
      "hud-player" + (state.players.turnIndex === 0 ? " active" : "")
    );
    item1.append(
      el("div", "avatar", initials(p1.name || "P1")),
      el("div", "", `${p1.name || "P1"} (${p1.score})`)
    );
    const item2 = el(
      "div",
      "hud-player" + (state.players.turnIndex === 1 ? " active" : "")
    );
    item2.append(
      el("div", "avatar", initials(p2.name || "P2")),
      el("div", "", `${p2.name || "P2"} (${p2.score})`)
    );
    hudPlayersEl.append(item1, item2);
  }
}

// ====== Win & Confetti ======
function ensureConfettiContainer() {
  let confetti = document.getElementById("confetti");
  if (!confetti) {
    confetti = document.createElement("div");
    confetti.id = "confetti";
    confetti.className = "confetti";
    document.body.appendChild(confetti);
  }
  return confetti;
}
function burstConfetti() {
  const confetti = ensureConfettiContainer();
  const colors = [
    "#34d399",
    "#60a5fa",
    "#fbbf24",
    "#f87171",
    "#a78bfa",
    "#fb7185",
    "#22d3ee",
    "#4ade80",
  ];
  const count = 140;
  const w = window.innerWidth;
  confetti.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("i");
    piece.style.left = Math.random() * w + "px";
    piece.style.top = -Math.random() * 40 + "px";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = 4 + Math.random() * 2 + "s";
    piece.style.animationDelay = Math.random() * 0.8 + "s";
    piece.style.transform = `translateY(0) rotate(${Math.random() * 360}deg)`;
    confetti.appendChild(piece);
  }
  setTimeout(() => (confetti.innerHTML = ""), 7000);
}
function showWin() {
  const winEl =
    document.querySelector(".win") ||
    (() => {
      const wrap = el("div", "win");
      wrap.id = "win";
      const panel = el("div", "panel");
      panel.innerHTML = `
        <div class="big">Kamu Menang! 🎉</div>
        <p class="sub">Selesai dalam <b><span id="finalTime">00:00</span></b> dengan <b><span id="finalMoves">0</span></b> langkah.</p>
        <div style="display:flex; gap:10px; justify-content:center;">
          <button class="btn primary" id="btnMainLagi">Main Lagi</button>
          <button class="btn ghost" id="btnGanti"><span>Ganti Kesulitan</span></button>
        </div>
      `;
      wrap.appendChild(panel);
      document.body.appendChild(wrap);
      return wrap;
    })();

  document.getElementById("finalMoves").textContent = state.moves;
  document.getElementById("finalTime").textContent = fmtMMSS(state.timer.sec);
  winEl.style.display = "grid";

  // PASANG LISTENER DULU (kalau ada error visual, tombol tetap berfungsi)
  winEl.querySelector("#btnMainLagi").onclick = () => {
    closeWin();
    startGame(state.difficulty.pairs);
  };
  winEl.querySelector("#btnGanti").onclick = () => {
    closeWin();
    openDiff();
  };

  // Efek & simpan hasil
  burstConfetti();
  saveResult();
}
function closeWin() {
  const winEl = document.getElementById("win");
  if (winEl) winEl.style.display = "none";
  const confetti = document.getElementById("confetti");
  if (confetti) confetti.innerHTML = "";
}

// ====== Name Modal & Difficulty ======
function openNameModal() {
  nameFields.innerHTML = "";
  if (state.mode === "duel") {
    nameFields.append(
      inputRow("Nama Player 1", "P1", "nameP1"),
      inputRow("Nama Player 2", "P2", "nameP2")
    );
  } else {
    nameFields.append(inputRow("Nama Player", "Pemain", "nameSolo"));
  }
  modalName.style.display = "grid";
}
function inputRow(label, placeholder, id) {
  const wrap = el("div", "");
  const input = el("input", "");
  input.placeholder = placeholder;
  input.id = id;
  input.required = true;
  const lbl = el("label", "", label);
  lbl.style.fontWeight = "700";
  lbl.style.display = "block";
  lbl.style.marginBottom = "6px";
  wrap.append(lbl, input);
  return wrap;
}
btnNamaBatal.addEventListener(
  "click",
  () => (modalName.style.display = "none")
);
btnNamaOK.addEventListener("click", () => {
  if (state.mode === "duel") {
    const n1 = document.getElementById("nameP1").value.trim() || "P1";
    const n2 = document.getElementById("nameP2").value.trim() || "P2";
    state.players.p1.name = n1;
    state.players.p2.name = n2;
  } else {
    const n = document.getElementById("nameSolo").value.trim() || "Pemain";
    state.players.p1.name = n;
    state.players.p2.name = ""; // not used
  }
  modalName.style.display = "none";
  openDiff();
});

// Populate difficulty choices
DIFFICULTIES.forEach((d) => {
  const row = el("div", "choice");
  const left = el("div", "", d.label);
  const right = el("button", "btn small primary", "Pilih");
  right.addEventListener("click", () => {
    closeDiff();
    setDifficulty(d.key);
    startGame(d.pairs);
  });
  row.append(left, right);
  choicesEl.appendChild(row);
});
function setDifficulty(key) {
  const found = DIFFICULTIES.find((x) => x.key === key) || DIFFICULTIES[0];
  state.difficulty.key = found.key;
  state.difficulty.pairs = found.pairs;
}

// ====== Keyboard shortcut ======
window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "r" && boardEl.style.display !== "none")
    startGame(state.difficulty.pairs);
});

// ====== Save / Load (API) ======
async function fetchData() {
  const res = await fetch("card-system.php?action=getData", {
    cache: "no-store",
  });
  const json = await res.json();
  if (json.ok) {
    state.dataCache.history = json.history || [];
    state.dataCache.leaderboard = json.leaderboard || { solo: {}, duel: {} };
  }
}
async function saveResult() {
  const payload = {
    mode: state.mode,
    difficulty: state.difficulty.key,
    moves: state.moves,
    time_sec: state.timer.sec,
    pairs: state.difficulty.pairs,
  };

  if (state.mode === "solo") {
    const diffFactor = DIFF_FACTOR[state.difficulty.key] || 1;
    const eff = state.difficulty.pairs / Math.max(1, state.moves);
    const spd = (state.difficulty.pairs * 10) / Math.max(5, state.timer.sec);
    const score = Math.round(1000 * diffFactor * eff * spd);
    payload.player = state.players.p1.name || "Pemain";
    payload.score = score;
  } else {
    payload.player1 = state.players.p1.name || "P1";
    payload.player2 = state.players.p2.name || "P2";
    payload.score1 = state.players.p1.score || 0;
    payload.score2 = state.players.p2.score || 0;
  }

  try {
    const res = await fetch("card-system.php?action=saveResult", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    // Optional debug:
    // console.log("saveResult:", json);
    if (json.ok) await fetchData();
  } catch (e) {
    console.error("Save result failed", e);
  }
}

// ====== History UI ======
async function openHistory() {
  await fetchData();
  renderHistoryTable();
  modalHistory.style.display = "grid";
}
function renderHistoryTable() {
  const rows = state.dataCache.history.slice().reverse(); // terbaru di atas
  const th = `
    <tr>
      <th>Tanggal</th>
      <th>Mode</th>
      <th>Kesulitan</th>
      <th>Pemain</th>
      <th>Langkah</th>
      <th>Waktu</th>
      <th>Skor / Detail</th>
    </tr>`;
  const tdRows = rows
    .map((r) => {
      const when = r.date || "";
      const mode = r.mode;
      const diff = r.difficulty;
      const moves = r.moves;
      const time = fmtMMSS(r.time_sec || 0);
      let playerCol = "";
      let scoreCol = "";
      if (mode === "solo") {
        playerCol = r.player || "Pemain";
        scoreCol = r.score ?? 0;
      } else {
        playerCol = `${r.player1 || "P1"} vs ${r.player2 || "P2"}`;
        const winner = r.winner || "Seri";
        scoreCol = `${r.score1 ?? 0} - ${r.score2 ?? 0} (${winner})`;
      }
      return `<tr>
      <td>${when}</td>
      <td>${mode}</td>
      <td>${diff}</td>
      <td>${playerCol}</td>
      <td>${moves}</td>
      <td>${time}</td>
      <td>${scoreCol}</td>
    </tr>`;
    })
    .join("");
  tblHistory.innerHTML = th + tdRows;
}

// ====== Leaderboard UI ======
async function openLeaderboard() {
  await fetchData();
  modalLb.style.display = "grid";
  renderLeaderboardTable();
}
function activeLbMode() {
  const btn = document.querySelector(".lb-tab.active");
  return btn ? btn.dataset.mode : "solo";
}
function activeLbDiff() {
  const btn = document.querySelector(".lb-diff-btn.active");
  return btn ? btn.dataset.diff : "mudah";
}
function renderLeaderboardTable() {
  const mode = activeLbMode();
  const diff = activeLbDiff();
  const lb = state.dataCache.leaderboard?.[mode]?.[diff] || [];

  if (mode === "solo") {
    const th = `
      <tr>
        <th>#</th>
        <th>Pemain</th>
        <th>Skor</th>
        <th>Langkah</th>
        <th>Waktu</th>
        <th>Tanggal</th>
      </tr>`;
    const rows = lb
      .map(
        (r, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${r.player}</td>
        <td>${r.score}</td>
        <td>${r.moves}</td>
        <td>${fmtMMSS(r.time_sec)}</td>
        <td>${r.date}</td>
      </tr>
    `
      )
      .join("");
    tblLb.innerHTML = th + rows;
  } else {
    const th = `
      <tr>
        <th>#</th>
        <th>Player 1</th>
        <th>Player 2</th>
        <th>Pemenang</th>
        <th>Margin</th>
        <th>Langkah</th>
        <th>Waktu</th>
        <th>Tanggal</th>
      </tr>`;
    const rows = lb
      .map(
        (r, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${r.player1}</td>
        <td>${r.player2}</td>
        <td>${r.winner}</td>
        <td>${r.winner_margin}</td>
        <td>${r.moves}</td>
        <td>${fmtMMSS(r.time_sec)}</td>
        <td>${r.date}</td>
      </tr>
    `
      )
      .join("");
    tblLb.innerHTML = th + rows;
  }
}

// ====== Start helpers ======
function openDiff() {
  modalDiff.style.display = "grid";
}
function closeDiff() {
  modalDiff.style.display = "none";
}

// Init HUD (welcome screen)
updateHudPlayers();
