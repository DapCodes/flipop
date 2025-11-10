<?php
session_start();

/**
 * Struktur session default:
 * $_SESSION['history'] = [ ... up to 60 ... ]
 * $_SESSION['leaderboard'] = [
 *   'solo' => ['mudah'=>[], 'sedang'=>[], 'sulit'=>[]],
 *   'duel' => ['mudah'=>[], 'sedang'=>[], 'sulit'=>[]],
 * ];
 */
if (!isset($_SESSION['history'])) {
  $_SESSION['history'] = [];
}
if (!isset($_SESSION['leaderboard'])) {
  $_SESSION['leaderboard'] = [
    'solo' => ['mudah'=>[], 'sedang'=>[], 'sulit'=>[]],
    'duel' => ['mudah'=>[], 'sedang'=>[], 'sulit'=>[]],
  ];
}

function clamp_history() {
  if (count($_SESSION['history']) > 60) {
    $_SESSION['history'] = array_slice($_SESSION['history'], -60);
  }
}

function sort_leaderboard_solo(&$arr) {
  // Urut: score desc, time asc, moves asc, date asc
  usort($arr, function($a, $b) {
    if ($a['score'] !== $b['score']) return $b['score'] <=> $a['score'];
    if ($a['time_sec'] !== $b['time_sec']) return $a['time_sec'] <=> $b['time_sec'];
    if ($a['moves'] !== $b['moves']) return $a['moves'] <=> $b['moves'];
    return strcmp($a['date'], $b['date']);
  });
  // optional: batasi top 50
  if (count($arr) > 50) $arr = array_slice($arr, 0, 50);
}

function sort_leaderboard_duel(&$arr) {
  // Urut: margin desc, pemenangScore desc, time asc, moves asc
  usort($arr, function($a, $b) {
    $marginA = $a['winner_margin'];
    $marginB = $b['winner_margin'];
    if ($marginA !== $marginB) return $marginB <=> $marginA;
    if ($a['winner_score'] !== $b['winner_score']) return $b['winner_score'] <=> $a['winner_score'];
    if ($a['time_sec'] !== $b['time_sec']) return $a['time_sec'] <=> $b['time_sec'];
    if ($a['moves'] !== $b['moves']) return $a['moves'] <=> $b['moves'];
    return strcmp($a['date'], $b['date']);
  });
  if (count($arr) > 50) $arr = array_slice($arr, 0, 50);
}

// Router sederhana untuk API
if (isset($_GET['action'])) {
  header('Content-Type: application/json; charset=utf-8');
  $action = $_GET['action'];

  if ($action === 'getData') {
    echo json_encode([
      'ok' => true,
      'history' => $_SESSION['history'],
      'leaderboard' => $_SESSION['leaderboard'],
    ]);
    exit;
  }

  if ($action === 'saveResult' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);

    // Validasi minimal
    if (!$data || !isset($data['mode']) || !isset($data['difficulty'])) {
      http_response_code(400);
      echo json_encode(['ok'=>false, 'error'=>'Payload tidak lengkap']);
      exit;
    }

    $mode = $data['mode']; // 'solo' | 'duel' | 'timetrial'
    $difficulty = $data['difficulty']; // 'mudah' | 'sedang' | 'sulit'
    $date = date('Y-m-d H:i:s');

    // Simpan ke history
    $entry = [
      'mode' => $mode,
      'difficulty' => $difficulty,
      'moves' => intval($data['moves'] ?? 0),
      'time_sec' => intval($data['time_sec'] ?? 0),
      'date' => $date,
    ];

    if ($mode === 'solo') {
      $entry['player'] = $data['player'] ?? 'Pemain';
      $entry['pairs'] = intval($data['pairs'] ?? 0);
      $entry['score'] = intval($data['score'] ?? 0);
      $_SESSION['history'][] = $entry;

      // Leaderboard solo
      $_SESSION['leaderboard']['solo'][$difficulty][] = [
        'player' => $entry['player'],
        'difficulty' => $difficulty,
        'pairs' => $entry['pairs'],
        'moves' => $entry['moves'],
        'time_sec' => $entry['time_sec'],
        'score' => $entry['score'],
        'date' => $date,
      ];
      sort_leaderboard_solo($_SESSION['leaderboard']['solo'][$difficulty]);
    } else if ($mode === 'duel') { // duel
      // player1, player2, score1, score2
      $p1 = $data['player1'] ?? 'P1';
      $p2 = $data['player2'] ?? 'P2';
      $s1 = intval($data['score1'] ?? 0);
      $s2 = intval($data['score2'] ?? 0);
      $pairs = intval($data['pairs'] ?? 0);

      $entry['player1'] = $p1;
      $entry['player2'] = $p2;
      $entry['pairs'] = $pairs;
      $entry['score1'] = $s1;
      $entry['score2'] = $s2;

      // status pemenang
      if ($s1 > $s2) {
        $winner = $p1; $winnerScore = $s1; $margin = $s1 - $s2;
      } else if ($s2 > $s1) {
        $winner = $p2; $winnerScore = $s2; $margin = $s2 - $s1;
      } else {
        $winner = 'Seri'; $winnerScore = $s1; $margin = 0;
      }
      $entry['winner'] = $winner;
      $_SESSION['history'][] = $entry;

      $_SESSION['leaderboard']['duel'][$difficulty][] = [
        'player1' => $p1,
        'player2' => $p2,
        'difficulty' => $difficulty,
        'pairs' => $pairs,
        'moves' => $entry['moves'],
        'time_sec' => $entry['time_sec'],
        'winner' => $winner,
        'winner_score' => $winnerScore,
        'winner_margin' => $margin,
        'date' => $date,
      ];
      sort_leaderboard_duel($_SESSION['leaderboard']['duel'][$difficulty]);
    } else if ($mode === 'timetrial') {
      $entry['player'] = $data['player'] ?? 'Pemain';
      $entry['pairs'] = intval($data['pairs'] ?? 0);
      $entry['score'] = intval($data['score'] ?? 0); // opsional: gunakan formula sama seperti solo
      $entry['time_limit'] = intval($data['time_limit'] ?? 0);
      $entry['result'] = $data['result'] ?? 'unknown';
      $_SESSION['history'][] = $entry;
      // (Saat ini tidak dimasukkan leaderboard agar tab tetap 2 mode: Solo & Duel)
    }

    clamp_history();
    echo json_encode(['ok'=>true]);
    exit;
  }

  // Fallback
  http_response_code(404);
  echo json_encode(['ok'=>false, 'error'=>'Not found']);
  exit;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Flipop — Memory Card Flip</title>
  <!-- <link rel="stylesheet" href="asset/css/style.css" /> -->
   <link rel="shortcut icon" href="asset/img/logo-small.svg" type="image/x-icon">
  <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="wrap">
    <header>
      <div class="brand">
        <!-- <div class="brand-badge">F</div> -->
        <img src="asset/img/logo-small.svg" alt="" srcset="" class="logo">
        <div>Flipop</div>
      </div>
      <div class="stats">
        <div id="stats">
          <div class="hud-players" id="hudPlayers">
            <!-- Dinamis: avatar inisial + nama + skor + highlight turn -->
          </div>
          <div class="stat">Langkah: <span id="moves">0</span></div>
          <div class="stat">Waktu: <span id="time">00:00</span></div>
        <button class="btn small ghost" id="btnRestart" title="Mulai ulang">↻ Mulai Ulang</button>
        </div>
        <button class="btn small ghost" id="btnHistory" title="Riwayat">🕘 Riwayat</button>
        <button class="btn small ghost" id="btnLeaderboard" title="Papan Peringkat">🏆 Peringkat</button>
        <button class="btn small ghost" id="btnTheme" title="Tema">☀️/🌙</button>
      </div>
    </header>

    <main>
      <section class="welcome" id="welcome">
        <h1>Selamat Datang di <span class="accent"> Flipop</span></h1> 
        <p>Balik dan cocokkan pasangan kartu secepat mungkin.</p>
        <p><small>Latihan: array shuffle, game loop, animasi CSS/JS.</small></p>

        <!-- Kartu pilihan mode -->
        <div class="mode-grid" id="modeGrid">
          <div class="mode-card" data-mode="solo" tabindex="0">
            <div class="mode-emoji">🧠</div>
            <div class="mode-title">Solo</div>
            <div class="mode-sub">Main sendiri, buru waktu & langkah.</div>
          </div>
          <div class="mode-card" data-mode="duel" tabindex="0">
            <div class="mode-emoji">⚔️</div>
            <div class="mode-title">Duel</div>
            <div class="mode-sub">Bergiliran, rebut pasangan terbanyak.</div>
          </div>
          <div class="mode-card" data-mode="timetrial" tabindex="0">
            <div class="mode-emoji">⏱️</div>
            <div class="mode-title">Time Trial</div>
            <div class="mode-sub">Kejar waktu + cocokkan semua pasangan.</div>
          </div>
        </div>

        <div class="welcome-actions">
          <button class="btn primary" id="btnMulai">Mulai</button>
          <button class="btn ghost" id="btnCara">Cara Main</button>
        </div>
      </section>

      <div class="board-wrap board-safe-padding">
        <section class="board cols-4" id="board" aria-label="Papan Kartu" style="display:none">
          <div class="prestart" id="prestart">
            <div class="panel">
              <div style="font-weight:800; font-size:18px">Siap menghafal posisi kartu?</div>
              <button class="btn primary" id="btnPrestart">Mulai</button>
              <div class="hint">Setelah klik, akan ada hitung mundur 3…2…1 lalu kartu tertutup.</div>
            </div>
          </div>
          <div class="countdown" id="countdown">3</div>
        </section>
      </div>
    </main>

    <footer>© 2025 Flipop – dibuat untuk latihan logika & animasi</footer>
  </div>

  <!-- Overlay: Splash Sapaan -->
  <div class="overlay" id="overlaySplash" role="dialog" aria-modal="true">
    <div class="splash-card">
      <h2 class="splash-title">Selamat datang di <span class="accent">Flipop</span> 👋</h2>
      <p class="splash-sub">Game mengasah memori: balik kartu & cocokkan pasangannya.</p>
      <p class="tap-anywhere">Klik di mana saja untuk lanjut</p>
    </div>
  </div>

  <!-- Overlay: Form Nama Awal -->
  <div class="overlay" id="overlayNameFirst" role="dialog" aria-modal="true" aria-labelledby="firstNameTitle">
    <div class="modal" style="max-width:520px">
      <h3 id="firstNameTitle" class="modal-title">Masukkan Nama Anda</h3>
      <div class="name-fields">
        <label style="font-weight:700; display:block; margin-bottom:6px">Nama</label>
        <input type="text" id="firstNameInput" placeholder="Nama Anda" />
      </div>
      <div class="modal-actions">
        <button class="btn ghost" id="firstNameCancel">Tutup</button>
        <button class="btn primary" id="firstNameOK">Oke</button>
      </div>
    </div>
  </div>

  <!-- Overlay: Salam “Selamat datang, {nama}” -->
  <div class="overlay" id="overlayHello">
    <div class="hello-card">
      <div class="hello-text" id="helloText">Selamat datang!</div>
      <div class="tap-anywhere">Klik di mana saja untuk mulai</div>
    </div>
  </div>

  <!-- Modal: Pilih Kesulitan -->
  <div class="modal-backdrop" id="modalDiff" role="dialog" aria-modal="true" aria-labelledby="diffTitle">
    <div class="modal">
      <h3 id="diffTitle" class="modal-title">Pilih Kesulitan</h3>

      <div class="field-row" id="iconCategoryRow" style="margin-bottom:10px">
        <label for="selectIconCat" style="font-weight:700; display:block; margin-bottom:6px">Kategori Ikon</label>
        <select id="selectIconCat" class="select">
          <option value="acak">Acak (campur)</option>
          <option value="transportasi">Transportasi</option>
          <option value="buah-sayur">Buah & Sayur</option>
          <option value="benda">Benda</option>
          <option value="hewan">Hewan</option>
        </select>
      </div>

      <div class="field-row" id="previewChoiceRow" style="margin-bottom:10px">
        <label style="font-weight:700; display:block; margin-bottom:6px">Tampilkan kartu 10 detik sebelum mulai?</label>
        <div style="display:flex; gap:10px; align-items:center">
          <input type="checkbox" id="chkPreview10" />
          <label for="chkPreview10">Ya, tampilkan preview 10 detik</label>
        </div>
      </div>

      <!-- Khusus Time Trial: pilih tingkat kesulitan waktu -->
      <div class="field-row" id="timeDiffRow" style="display:none; margin-bottom:12px">
        <label style="font-weight:700; display:block; margin-bottom:6px">Kesulitan Waktu</label>
        <div id="timeDiffBtns" style="display:flex; gap:8px; flex-wrap:wrap"></div>
        <div id="timeDiffHint" style="font-size:12px; opacity:.75; margin-top:6px"></div>
      </div>

      <div class="choices" id="choices"></div>
      <div class="modal-actions">
        <button class="btn ghost" id="btnBatal">Batal</button>
      </div>
    </div>
  </div>

  <!-- Modal: Input Nama (sebelum main / duel) -->
  <div class="modal-backdrop" id="modalName" role="dialog" aria-modal="true" aria-labelledby="nameTitle">
    <div class="modal">
      <h3 id="nameTitle" class="modal-title">Masukkan Nama</h3>
      <div id="nameFields" class="name-fields"></div>
      <div class="modal-actions">
        <button class="btn ghost" id="btnNamaBatal">Batal</button>
        <button class="btn primary" id="btnNamaOK">Lanjut</button>
      </div>
    </div>
  </div>

  <!-- Modal: Riwayat -->
  <div class="modal-backdrop" id="modalHistory" role="dialog" aria-modal="true" aria-labelledby="historyTitle">
    <div class="modal large">
      <h3 id="historyTitle" class="modal-title">Riwayat Terakhir</h3>
      <div class="table-wrap">
        <table id="tblHistory" class="table"></table>
      </div>
      <div class="modal-actions">
        <button class="btn ghost" id="btnCloseHistory">Tutup</button>
      </div>
    </div>
  </div>

  <!-- Modal: Leaderboard -->
  <div class="modal-backdrop" id="modalLb" role="dialog" aria-modal="true" aria-labelledby="lbTitle">
    <div class="modal large">
      <h3 id="lbTitle" class="modal-title">Papan Peringkat</h3>
      <div class="lb-tabs">
        <button class="btn small ghost lb-tab active" data-mode="solo">Solo</button>
        <button class="btn small ghost lb-tab" data-mode="duel">Duel</button>
      </div>
      <div class="lb-diff">
        <button class="btn small ghost lb-diff-btn active" data-diff="mudah">Mudah</button>
        <button class="btn small ghost lb-diff-btn" data-diff="sedang">Sedang</button>
        <button class="btn small ghost lb-diff-btn" data-diff="sulit">Sulit</button>
      </div>
      <div class="table-wrap">
        <table id="tblLb" class="table"></table>
      </div>
      <div class="modal-actions">
        <button class="btn ghost" id="btnCloseLb">Tutup</button>
      </div>
    </div>
  </div>

  <div class="confetti" id="confetti" aria-hidden="true"></div>

  <script src="js/script.js"></script>
</body>
</html>
