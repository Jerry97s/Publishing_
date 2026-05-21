/* 짝맞추기 메모리 게임 */
(function () {
  const EMOJIS = ["🍎", "🍋", "🍇", "🍒", "🥝", "🍑", "🌸", "⭐"];
  let started = false;
  let cards = [];
  let flipped = [];
  let matched = 0;
  let moves = 0;
  let lock = false;

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function newGame() {
    const pairs = shuffle([...EMOJIS, ...EMOJIS]);
    cards = pairs.map((emoji, i) => ({ id: i, emoji, matched: false }));
    flipped = [];
    matched = 0;
    moves = 0;
    lock = false;
    updateStats();
    render();
  }

  function updateStats() {
    const root = document.getElementById("game-memory");
    root.querySelector("#mem-moves").textContent = moves;
    root.querySelector("#mem-pairs").textContent = matched + " / " + EMOJIS.length;
  }

  function render() {
    const grid = document.getElementById("memory-grid");
    grid.innerHTML = "";
    cards.forEach((card, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "memory-card";
      if (card.matched) btn.classList.add("is-matched");
      if (flipped.includes(idx)) btn.classList.add("is-flipped");
      btn.innerHTML =
        '<span class="memory-card__inner">' +
        '<span class="memory-card__back">?</span>' +
        '<span class="memory-card__face">' + card.emoji + "</span></span>";
      btn.addEventListener("click", () => onFlip(idx));
      grid.appendChild(btn);
    });
  }

  function onFlip(idx) {
    if (lock || cards[idx].matched || flipped.includes(idx)) return;
    flipped.push(idx);
    render();
    if (flipped.length < 2) return;
    moves++;
    updateStats();
    lock = true;
    const [a, b] = flipped;
    if (cards[a].emoji === cards[b].emoji) {
      cards[a].matched = cards[b].matched = true;
      matched++;
      flipped = [];
      lock = false;
      render();
      updateStats();
      if (matched === EMOJIS.length) {
        setTimeout(() => alert("🎉 모든 짝을 찾았습니다! 이동 " + moves + "회"), 200);
      }
    } else {
      setTimeout(() => {
        flipped = [];
        lock = false;
        render();
      }, 700);
    }
  }

  window.initMemory = function () {
    if (started) return;
    started = true;
    document.getElementById("mem-btn-new").addEventListener("click", newGame);
    newGame();
  };
})();
