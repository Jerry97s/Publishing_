/* 틱택토 (플레이어 X vs 컴퓨터 O) */
(function () {
  let started = false;
  let board = [];
  let over = false;
  let scores = { x: 0, o: 0, d: 0 };

  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  function newGame() {
    board = Array(9).fill("");
    over = false;
    setMsg("당신은 X — 먼저 두세요");
    render();
  }

  function setMsg(t) {
    document.getElementById("ttt-msg").textContent = t;
  }

  function render() {
    const grid = document.getElementById("ttt-grid");
    grid.innerHTML = "";
    board.forEach((v, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ttt-cell" + (v === "O" ? " ttt-cell--o" : "");
      btn.textContent = v;
      btn.disabled = over || v !== "";
      btn.addEventListener("click", () => play(i));
      grid.appendChild(btn);
    });
    document.getElementById("ttt-score-x").textContent = scores.x;
    document.getElementById("ttt-score-o").textContent = scores.o;
    document.getElementById("ttt-score-d").textContent = scores.d;
  }

  function winner(b) {
    for (const [a, c, d] of lines) {
      if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
    }
    if (b.every((c) => c)) return "D";
    return null;
  }

  function play(i) {
    if (over || board[i]) return;
    board[i] = "X";
    let w = winner(board);
    if (w) return end(w);
    aiMove();
    w = winner(board);
    if (w) end(w);
    else setMsg("당신 차례 (X)");
    render();
  }

  function aiMove() {
    const empty = board.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
    if (!empty.length) return;
    const pick = empty[Math.floor(Math.random() * empty.length)];
    board[pick] = "O";
  }

  function end(w) {
    over = true;
    if (w === "X") { scores.x++; setMsg("🎉 X 승리!"); }
    else if (w === "O") { scores.o++; setMsg("컴퓨터(O) 승리"); }
    else { scores.d++; setMsg("무승부"); }
    render();
  }

  window.initTicTacToe = function () {
    if (started) return;
    started = true;
    document.getElementById("ttt-btn-new").addEventListener("click", newGame);
    newGame();
  };
})();
