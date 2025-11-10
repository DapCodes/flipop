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

// ====== API URL (fix: gunakan file ini sendiri, tidak hardcode) ======
const API_URL = window.location.pathname;

// ====== Consts ======
const DIFFICULTIES = [
  { key: "mudah", pairs: 4, label: "Mudah (8 kartu / 4 pasang)" },
  { key: "sedang", pairs: 8, label: "Sedang (16 kartu / 8 pasang)" },
  { key: "sulit", pairs: 16, label: "Sulit (32 kartu / 16 pasang)" },
];
const DIFF_FACTOR = { mudah: 1, sedang: 2, sulit: 3 };

// IKON: kategori
const ICON_SETS = {
  acak: [
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
    "🚗",
    "🚌",
    "🚲",
    "🚀",
    "🚁",
    "🚂",
    "🛥️",
    "✈️",
    "🚜",
    "🚕",
    "🛵",
    "🚒",
    "🚑",
    "🚛",
    "🚤",
    "🛩️",
    "🪑",
    "🛋️",
    "🧸",
    "🖊️",
    "📚",
    "💡",
    "🧯",
    "📦",
    "🔧",
    "🧰",
    "🧵",
    "🎒",
    "🧪",
    "🧂",
    "🍳",
    "🔨",
  ],
  transportasi: [
    "🚗",
    "🚌",
    "🚲",
    "🚀",
    "🚁",
    "🚂",
    "🛥️",
    "✈️",
    "🚜",
    "🚕",
    "🛵",
    "🚒",
    "🚑",
    "🚛",
    "🚤",
    "🛩️",
  ],
  "buah-sayur": [
    "🍎",
    "🍌",
    "🍇",
    "🍉",
    "🍓",
    "🥑",
    "🍋",
    "🍍",
    "🥕",
    "🌽",
    "🍅",
    "🥦",
    "🥒",
    "🍒",
    "🍈",
    "🍑",
  ],
  benda: [
    "🪑",
    "🛋️",
    "🧸",
    "🖊️",
    "📚",
    "💡",
    "🧯",
    "📦",
    "🔧",
    "🧰",
    "🧵",
    "🎒",
    "🧪",
    "🧂",
    "🍳",
    "🔨",
  ],
  hewan: [
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
  ],
};

// Time Trial
const TIME_DIFFS = [
  { key: "mudah", label: "Waktu Mudah" },
  { key: "sedang", label: "Waktu Sedang" },
  { key: "sulit", label: "Waktu Sulit" },
];
function getTimeLimit(pairs, timeKey) {
  let limits = { mudah: 120, sedang: 60, sulit: 30 };
  if (pairs === 8) limits = { mudah: 180, sedang: 90, sulit: 45 };
  if (pairs === 16) limits = { mudah: 420, sedang: 300, sulit: 180 };
  return limits[timeKey] ?? limits.mudah;
}

// ====== Elements ======
const boardWrapEl = document.querySelector(".board-wrap");
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
const btnNamaOK = document.getElementById("btnNamaOK");

const modalHistory = document.getElementById("modalHistory");
const tblHistory = document.getElementById("tblHistory");
const modalLb = document.getElementById("modalLb");
const tblLb = document.getElementById("tblLb");

// Splash overlays
const overlaySplash = document.getElementById("overlaySplash");
const overlayNameFirst = document.getElementById("overlayNameFirst");
const overlayHello = document.getElementById("overlayHello");
const firstNameInput = document.getElementById("firstNameInput");
const firstNameCancel = document.getElementById("firstNameCancel");
const firstNameOK = document.getElementById("firstNameOK");
const helloText = document.getElementById("helloText");

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
    "Cocokkan 2 kartu yang sama.\n- Pilih mode (Solo/Duel/Time Trial) dan masukkan nama.\n- Pilih kesulitan & kategori ikon.\n- (Opsional) Preview 10 detik → 3..2..1 → Mulai!\n- Duel: jika cocok, tetap giliranmu; jika salah, pindah.\n- Selesai saat semua pasangan ditemukan."
  );
});
document.getElementById("btnMulai").addEventListener("click", () => {
  if (!state.mode) state.mode = "solo";
  openNameModal();
});

// Mode cards
document.querySelectorAll(".mode-card").forEach((card) => {
  card.addEventListener("click", () => {
    state.mode = card.dataset.mode; // 'solo' | 'duel' | 'timetrial'
    openNameModal();
  });
});

// Diff modal
document.getElementById("btnBatal").addEventListener("click", closeDiff);
btnPrestart.addEventListener("click", () => {
  if (state.preview10s) startPreview10ThenCountdown();
  else startCountdown();
});

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
  mode: null, // 'solo' | 'duel' | 'timetrial'
  players: {
    p1: { name: "", score: 0 },
    p2: { name: "", score: 0 },
    turnIndex: 0,
  },
  difficulty: { key: "mudah", pairs: 4 },
  timeTrial: { enabled: false, timeKey: "mudah", limitSec: 120 },
  iconCategory: "acak",
  preview10s: false,

  deck: [],
  firstPick: null,
  secondPick: null,
  matchedCount: 0,
  moves: 0,
  timer: { running: false, sec: 0, int: null, dir: "up" }, // dir: 'up' | 'down'
  gamePhase: "idle", // idle | preview | countdown | playing | won | lost
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

function setGridCols() {
  const total = state.difficulty.pairs * 2;

  // Bersihkan kelas layout khusus dulu
  boardEl.classList.remove(
    "flex-layout",
    "layout-4x2",
    "layout-6-6-4",
    "layout-8x4"
  );

  // Gunakan layout khusus untuk 8 / 16 / 32 kartu
  if (total === 8) {
    boardEl.classList.add("flex-layout", "layout-4x2");
    return; // tidak perlu set grid-template-columns
  }
  if (total === 16) {
    boardEl.classList.add("flex-layout", "layout-6-6-4");
    return;
  }
  if (total === 32) {
    boardEl.classList.add("flex-layout", "layout-8x4");
    return;
  }

  // --- fallback: pakai grid responsif lamamu (untuk jumlah lain) ---
  const w = window.innerWidth;
  let cols;

  if (w <= 420) {
    cols = total <= 8 ? 2 : 4;
  } else if (w <= 768) {
    if (total <= 8) cols = 3;
    else if (total <= 16) cols = 4;
    else cols = 6;
  } else if (w <= 1200) {
    if (total <= 8) cols = 4;
    else if (total <= 16) cols = 4;
    else cols = 6;
  } else {
    if (total <= 8) cols = 4;
    else if (total <= 16) cols = 4;
    else cols = 8;
  }

  boardEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
}

function buildDeck() {
  const cat = state.iconCategory || "acak";
  let pool = ICON_SETS[cat] ? ICON_SETS[cat].slice(0) : ICON_SETS.acak.slice(0);
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

  const back = el("div", "back");
  const brand = el("div", "back-label", "Flipop"); // <<< tambahkan ini
  back.appendChild(brand); // <<< dan ini

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
  setGridCols(); // fix: pastikan grid sesuai total kartu
  fitBoardToViewport();
}
function flipAll(open) {
  boardEl.querySelectorAll(".card").forEach((card) => {
    card.classList.toggle("flipped", open);
  });
}

// ====== Auto scale Board agar tidak overflow 100vh ======
function fitBoardToViewport() {
  // Ukur tinggi NYATA header/footer (bukan asumsi var --header-h) supaya tidak muncul scroll di desktop
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");

  const headerH = header ? header.offsetHeight : 64;
  const footerH = footer ? footer.offsetHeight : 36;

  // Ruang yang benar-benar tersedia
  const verticalPadding = 16; // buffer kecil
  const availH = window.innerHeight - headerH - footerH - verticalPadding;

  // Sementara reset transform untuk dapat ukuran asli
  const prevTransform = boardEl.style.transform;
  boardEl.style.transform = "scale(1)";

  // Pastikan kolom sudah sesuai lebar layar sebelum hitung skala
  setGridCols();

  // Hitung ukuran alami board
  const rect = boardEl.getBoundingClientRect();

  // Perhitungkan lebar container juga supaya tidak “geser kanan”
  const wrapW = boardWrapEl.clientWidth || window.innerWidth;
  const availW = wrapW - 12; // buffer

  const scaleH = rect.height > 0 ? Math.min(1, availH / rect.height) : 1;
  const scaleW = rect.width > 0 ? Math.min(1, availW / rect.width) : 1;
  const scale = Math.max(0.5, Math.min(scaleH, scaleW)); // jangan terlalu kecil

  boardEl.style.transform = `scale(${scale})`;
  boardEl.style.transformOrigin = "top center";

  // Jika sebelumnya ada transform lain, abaikan saja—kita ganti penuh
  void prevTransform; // no-op supaya linter senang
}

window.addEventListener("resize", () => {
  setGridCols();
  fitBoardToViewport();
});

// ====== Game Flow ======
function openDiff() {
  modalDiff.style.display = "grid";
  // Build ulang pilihan difficulty (idempotent)
  choicesEl.innerHTML = "";
  DIFFICULTIES.forEach((d) => {
    const row = el("div", "choice");
    const left = el("div", "", d.label);
    const right = el("button", "btn small primary", "Pilih");
    right.addEventListener("click", () => {
      closeDiff();
      setDifficulty(d.key);
      if (state.mode === "timetrial") {
        state.timeTrial.limitSec = getTimeLimit(
          d.pairs,
          state.timeTrial.timeKey
        );
      }
      startGame(d.pairs);
    });
    row.append(left, right);
    choicesEl.appendChild(row);
  });

  // siapkan UI tambahan (kategori ikon, preview, time trial)
  setupTimeTrialUI();
}
function closeDiff() {
  modalDiff.style.display = "none";
}

function startGame(pairs) {
  welcomeEl.style.display = "none";
  boardEl.style.display = "grid";
  statsEl.style.display = "flex"; // <== tampilkan HUD
  state.difficulty.pairs = pairs;
  state.matchedCount = 0;
  state.moves = 0;
  movesEl.textContent = "0";
  stopTimer(true);
  state.gamePhase = "preview";

  // set limit waktu bila timetrial
  if (state.mode === "timetrial") {
    state.timeTrial.enabled = true;
    state.timeTrial.limitSec = getTimeLimit(pairs, state.timeTrial.timeKey);
    state.timer.dir = "down";
    state.timer.sec = state.timeTrial.limitSec;
    timeEl.textContent = fmtMMSS(state.timer.sec);
  } else {
    state.timeTrial.enabled = false;
    state.timer.dir = "up";
    state.timer.sec = 0;
    timeEl.textContent = fmtMMSS(0);
  }

  buildDeck();
  renderBoard();

  // fase awal: flip open (preview modal kita sendiri)
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
  fitBoardToViewport();
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

function startPreview10ThenCountdown() {
  state.gamePhase = "preview";
  prestartEl.style.display = "none";
  countdownEl.style.display = "grid";
  countdownEl.textContent = "Lihat kartu (10s)";
  countdownEl.classList.add("preview-clear");

  flipAll(true);
  boardEl.classList.add("locked");
  let left = 10;
  const iv = setInterval(() => {
    left--;
    if (left > 0) {
      countdownEl.textContent = `Lihat kartu (${left}s)`;
    } else {
      clearInterval(iv);
      flipAll(false);
      setTimeout(() => {
        countdownEl.classList.remove("preview-clear");
        countdownEl.style.display = "none";
        startCountdown();
      }, 400);
    }
  }, 1000);
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
  if (state.timer.int) clearInterval(state.timer.int);
  state.timer.int = setInterval(() => {
    if (state.timer.dir === "up") {
      state.timer.sec++;
      timeEl.textContent = fmtMMSS(state.timer.sec);
    } else {
      state.timer.sec = Math.max(0, state.timer.sec - 1);
      timeEl.textContent = fmtMMSS(state.timer.sec);
      if (state.timer.sec === 0) {
        // waktu habis
        stopTimer(false);
        state.gamePhase = "lost";
        setTimeout(showLose, 350);
      }
    }
  }, 1000);
}
function stopTimer(reset = false) {
  if (state.timer.int) clearInterval(state.timer.int);
  state.timer.int = null;
  state.timer.running = false;
  if (reset) {
    if (state.timer.dir === "down" && state.timeTrial?.limitSec) {
      state.timer.sec = state.timeTrial.limitSec;
    } else {
      state.timer.sec = 0;
    }
    timeEl.textContent = fmtMMSS(state.timer.sec);
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
  if (state.mode === "solo" || state.mode === "timetrial") {
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

  const elapsed =
    state.timer.dir === "up"
      ? state.timer.sec
      : Math.max(0, state.timeTrial.limitSec - state.timer.sec);
  document.getElementById("finalMoves").textContent = state.moves;
  document.getElementById("finalTime").textContent = fmtMMSS(elapsed);
  winEl.style.display = "grid";

  winEl.querySelector("#btnMainLagi").onclick = () => {
    closeWin();
    startGame(state.difficulty.pairs);
  };
  winEl.querySelector("#btnGanti").onclick = () => {
    closeWin();
    statsEl.style.display = "none"; // sembunyikan HUD
    openDiff();
  };
  burstConfetti();
  if (state.mode === "timetrial") state.timeTrial.result = "menang";
  saveResult();
}
function closeWin() {
  const winEl = document.getElementById("win");
  if (winEl) winEl.style.display = "none";
  const confetti = document.getElementById("confetti");
  if (confetti) confetti.innerHTML = "";
}
function showLose() {
  const loseEl =
    document.querySelector(".lose") ||
    (() => {
      const wrap = el("div", "win lose");
      wrap.id = "lose";
      const panel = el("div", "panel");
      panel.innerHTML = `
          <div class="big">Waktu Habis ⏱️</div>
          <p class="sub">Coba lagi ya. Kamu menemukan <b>${state.matchedCount}</b> dari <b>${state.difficulty.pairs}</b> pasangan.</p>
          <div style="display:flex; gap:10px; justify-content:center;">
            <button class="btn primary" id="btnCobaLagi">Coba Lagi</button>
            <button class="btn ghost" id="btnGantiDiff">Ganti Pilihan</button>
          </div>
        `;
      wrap.appendChild(panel);
      document.body.appendChild(wrap);
      return wrap;
    })();

  loseEl.style.display = "grid";
  loseEl.querySelector("#btnCobaLagi").onclick = () => {
    closeLose();
    startGame(state.difficulty.pairs);
  };
  loseEl.querySelector("#btnGantiDiff").onclick = () => {
    closeLose();
    statsEl.style.display = "none"; // sembunyikan HUD
    openDiff();
  };

  state.timeTrial.result = "waktu_habis";
  saveResult();
}
function closeLose() {
  const elx = document.getElementById("lose");
  if (elx) elx.style.display = "none";
}

// ====== Name Modal & Difficulty ======
function openNameModal() {
  nameFields.innerHTML = "";
  const defaultName = localStorage.getItem("flipop-username") || "Pemain";
  if (state.mode === "duel") {
    nameFields.append(
      inputRow("Nama Player 1", defaultName || "P1", "nameP1"),
      inputRow("Nama Player 2", "P2", "nameP2")
    );
  } else {
    nameFields.append(
      inputRow("Nama Player", defaultName || "Pemain", "nameSolo")
    );
  }
  modalName.style.display = "grid";
  // Prefill state
  if (state.mode === "duel") {
    state.players.p1.name = defaultName;
  } else {
    state.players.p1.name = defaultName;
  }
}
function inputRow(label, placeholder, id) {
  const wrap = el("div", "");
  const input = el("input", "");
  input.placeholder = placeholder;
  input.value = placeholder; // isi awal dengan placeholder (defaultName)
  input.id = id;
  input.required = true;
  const lbl = el("label", "", label);
  lbl.style.fontWeight = "700";
  lbl.style.display = "block";
  lbl.style.marginBottom = "6px";
  wrap.append(lbl, input);
  return wrap;
}
document
  .getElementById("btnNamaBatal")
  ?.addEventListener("click", () => (modalName.style.display = "none"));
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
  openDiff(); // akan memanggil setupTimeTrialUI() juga
});

// Build pilihan kesulitan (awal)
DIFFICULTIES.forEach((d) => {
  const row = el("div", "choice");
  const left = el("div", "", d.label);
  const right = el("button", "btn small primary", "Pilih");
  right.addEventListener("click", () => {
    closeDiff();
    setDifficulty(d.key);
    if (state.mode === "timetrial") {
      state.timeTrial.limitSec = getTimeLimit(d.pairs, state.timeTrial.timeKey);
    }
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

function setupTimeTrialUI() {
  const timeRow = document.getElementById("timeDiffRow");
  const timeBtns = document.getElementById("timeDiffBtns");
  const timeHint = document.getElementById("timeDiffHint");
  const iconSel = document.getElementById("selectIconCat");
  const chkPrev = document.getElementById("chkPreview10");

  if (iconSel) {
    iconSel.value = state.iconCategory || "acak";
    iconSel.onchange = () => (state.iconCategory = iconSel.value);
  }
  if (chkPrev) {
    chkPrev.checked = !!state.preview10s;
    chkPrev.onchange = () => (state.preview10s = chkPrev.checked);
  }

  if (state.mode === "timetrial" && timeRow && timeBtns && timeHint) {
    state.timeTrial.enabled = true;
    timeRow.style.display = "block";
    timeBtns.innerHTML = "";
    TIME_DIFFS.forEach((t) => {
      const b = el("button", "btn small ghost", t.label);
      if (t.key === state.timeTrial.timeKey) b.classList.add("active");
      b.addEventListener("click", () => {
        timeBtns
          .querySelectorAll("button")
          .forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        state.timeTrial.timeKey = t.key;
        updateTimeTrialHint(timeHint);
      });
      timeBtns.appendChild(b);
    });
    updateTimeTrialHint(timeHint);
  } else if (timeRow) {
    state.timeTrial.enabled = false;
    timeRow.style.display = "none";
  }
}
function updateTimeTrialHint(hintEl) {
  if (!hintEl) return;
  const pairs = state.difficulty?.pairs ?? 4;
  const tk = state.timeTrial.timeKey ?? "mudah";
  const lim = getTimeLimit(pairs, tk);
  const mm = Math.floor(lim / 60);
  const ss = (lim % 60).toString().padStart(2, "0");
  hintEl.textContent = `Waktu tersedia: ${mm}:${ss} untuk ${
    pairs * 2
  } kartu (${tk}).`;
}

// ====== Keyboard shortcut ======
window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "r" && boardEl.style.display !== "none")
    startGame(state.difficulty.pairs);
});

// ====== Save / Load (API) ======
async function fetchData() {
  try {
    const res = await fetch(`${API_URL}?action=getData`, { cache: "no-store" });
    const json = await res.json();
    if (json?.ok) {
      state.dataCache.history = Array.isArray(json.history) ? json.history : [];
      state.dataCache.leaderboard = json.leaderboard || { solo: {}, duel: {} };
    }
  } catch (err) {
    console.error("Fetch data failed", err);
  }
}
async function saveResult() {
  const elapsed =
    state.timer.dir === "up"
      ? state.timer.sec
      : Math.max(0, state.timeTrial.limitSec - state.timer.sec);
  const payload = {
    mode: state.mode,
    difficulty: state.difficulty.key,
    moves: state.moves,
    time_sec: elapsed,
    pairs: state.difficulty.pairs,
  };

  if (state.mode === "solo" || state.mode === "timetrial") {
    const diffFactor = DIFF_FACTOR[state.difficulty.key] || 1;
    const eff = state.difficulty.pairs / Math.max(1, state.moves);
    const spd = (state.difficulty.pairs * 10) / Math.max(5, elapsed || 1);
    const score = Math.round(1000 * diffFactor * eff * spd);
    payload.player = state.players.p1.name || "Pemain";
    payload.score = score;

    if (state.mode === "timetrial") {
      payload.time_limit = state.timeTrial.limitSec;
      payload.result = state.timeTrial.result || "unknown";
    }
  } else {
    payload.player1 = state.players.p1.name || "P1";
    payload.player2 = state.players.p2.name || "P2";
    payload.score1 = state.players.p1.score || 0;
    payload.score2 = state.players.p2.score || 0;
  }

  try {
    const res = await fetch(`${API_URL}?action=saveResult`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (json?.ok) await fetchData();
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
      const mode = r.mode || "-";
      const diff = r.difficulty || "-";
      const moves = r.moves ?? 0;
      const time = fmtMMSS(r.time_sec || 0);
      let playerCol = "";
      let scoreCol = "";
      if (mode === "solo") {
        playerCol = r.player || "Pemain";
        scoreCol = r.score ?? 0;
      } else if (mode === "duel") {
        playerCol = `${r.player1 || "P1"} vs ${r.player2 || "P2"}`;
        const winner = r.winner || "Seri";
        scoreCol = `${r.score1 ?? 0} - ${r.score2 ?? 0} (${winner})`;
      } else if (mode === "timetrial") {
        playerCol = r.player || "Pemain";
        const lim = r.time_limit ? ` / limit ${fmtMMSS(r.time_limit)}` : "";
        scoreCol = `Time Trial: ${r.result || "-"}${lim} • Skor ${
          r.score ?? 0
        }`;
      } else {
        playerCol = "-";
        scoreCol = "-";
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

// Init HUD (welcome screen)
updateHudPlayers();

// ====== SPLASH → FORM → HELLO ======
function show(el) {
  el.classList.add("show");
  el.classList.remove("fade-out");
}
function hide(el) {
  el.classList.add("fade-out");
  setTimeout(() => {
    el.classList.remove("show");
  }, 250);
}

function firstRunFlow() {
  const savedName = localStorage.getItem("flipop-username");
  if (!savedName) {
    // Tampilkan splash
    show(overlaySplash);

    // Klik di mana saja → ke form
    const toForm = () => {
      hide(overlaySplash);
      setTimeout(() => show(overlayNameFirst), 260);
      window.removeEventListener("click", toForm);
    };
    // gunakan setTimeout agar tidak trigger langsung saat page load
    setTimeout(() => {
      window.addEventListener("click", toForm, { once: true });
    }, 100);

    // Form tombol
    firstNameCancel.addEventListener(
      "click",
      () => {
        hide(overlayNameFirst);
      },
      { once: true }
    );
    firstNameOK.addEventListener(
      "click",
      () => {
        const name = (firstNameInput.value || "").trim() || "Pemain";
        localStorage.setItem("flipop-username", name);

        // Isi Player 1 saat ini juga
        state.players.p1.name = name;
        updateHudPlayers();

        hide(overlayNameFirst);
        // Tampilkan salam
        setTimeout(() => {
          helloText.textContent = `Selamat datang, ${name}!`;
          show(overlayHello);

          // Auto hilang setelah animasi + buffer
          setTimeout(() => {
            hide(overlayHello);
          }, 1600);

          // Bisa di-close dengan klik
          const closeHello = () => hide(overlayHello);
          setTimeout(() => {
            overlayHello.addEventListener("click", closeHello, { once: true });
          }, 250);
        }, 260);
      },
      { once: true }
    );
  } else {
    // Sudah punya nama, set langsung
    state.players.p1.name = savedName;
    updateHudPlayers();
  }
}
firstRunFlow();

// ====== Theme persist already handled ======
