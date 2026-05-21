/* Klondike Solitaire — Windows style (draw 1) */
(function () {
  const SUITS = ["s", "h", "d", "c"];
  const SUIT_SYM = { s: "♠", h: "♥", d: "♦", c: "♣" };
  const RANK_LABEL = ["", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

  let state = null;
  let selected = null;
  let moves = 0;
  let score = 0;
  let timerSec = 0;
  let timerId = null;
  let drawCount = 1;

  const el = {
    stock: document.getElementById("pile-stock"),
    waste: document.getElementById("pile-waste"),
    foundations: [
      document.getElementById("found-0"),
      document.getElementById("found-1"),
      document.getElementById("found-2"),
      document.getElementById("found-3"),
    ],
    tableau: Array.from({ length: 7 }, (_, i) => document.getElementById("tab-" + i)),
    moves: document.getElementById("stat-moves"),
    score: document.getElementById("stat-score"),
    time: document.getElementById("stat-time"),
    winModal: document.getElementById("win-modal"),
  };

  function isRed(card) {
    return card.suit === "h" || card.suit === "d";
  }

  function createDeck() {
    const deck = [];
    for (const s of SUITS) {
      for (let r = 1; r <= 13; r++) deck.push({ suit: s, rank: r, faceUp: false });
    }
    return deck;
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function newGame() {
    const deck = shuffle(createDeck());
    const tableau = [[], [], [], [], [], [], []];
    let idx = 0;
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row <= col; row++) {
        const card = deck[idx++];
        card.faceUp = row === col;
        tableau[col].push(card);
      }
    }
    state = {
      stock: deck.slice(idx),
      waste: [],
      foundations: [[], [], [], []],
      tableau,
    };
    selected = null;
    moves = 0;
    score = 0;
    timerSec = 0;
    stopTimer();
    startTimer();
    updateStats();
    render();
    el.winModal.classList.remove("is-open");
  }

  function startTimer() {
    timerId = setInterval(() => {
      timerSec++;
      el.time.textContent = formatTime(timerSec);
    }, 1000);
  }

  function stopTimer() {
    if (timerId) clearInterval(timerId);
    timerId = null;
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m + ":" + String(s).padStart(2, "0");
  }

  function updateStats() {
    el.moves.textContent = moves;
    el.score.textContent = score;
  }

  function cardId(card) {
    return card.suit + card.rank;
  }

  function makeCardEl(card, source) {
    const div = document.createElement("div");
    div.dataset.id = cardId(card);
    div.dataset.source = source;

    if (!card.faceUp) {
      div.className = "card card--back";
      div.setAttribute("role", "button");
      div.setAttribute("aria-label", "뒷면 카드");
      return div;
    }

    const red = isRed(card);
    div.className = "card card--face " + (red ? "red" : "black");
    if (card.rank >= 11) div.classList.add("card--rank-small");
    div.setAttribute("role", "button");
    div.setAttribute("aria-label", RANK_LABEL[card.rank] + " " + SUIT_SYM[card.suit]);

    const sym = SUIT_SYM[card.suit];
    const lbl = RANK_LABEL[card.rank];
    div.innerHTML =
      '<span class="card__corner">' + lbl + sym + "</span>" +
      '<span class="card__center">' + sym + "</span>" +
      '<span class="card__corner card__corner--br">' + lbl + sym + "</span>";

    return div;
  }

  function render() {
    renderPile(el.stock, state.stock, "stock", { showTop: true });
    renderWaste();
    state.foundations.forEach((pile, i) => renderPile(el.foundations[i], pile, "foundation-" + i, {}));
    state.tableau.forEach((pile, i) => renderTableau(i, pile));
  }

  function renderPile(container, pile, source, opts) {
    container.innerHTML = "";
    if (!pile.length && source === "stock") {
      const empty = document.createElement("div");
      empty.className = "card card--back";
      empty.dataset.source = "stock";
      empty.style.opacity = state.waste.length ? "1" : "0.35";
      empty.setAttribute("aria-label", "스톡 — 클릭하여 카드 뽑기");
      container.appendChild(empty);
      return;
    }
    if (!pile.length) return;

    const cards = opts.showTop ? [pile[pile.length - 1]] : pile;
    const start = opts.showTop ? pile.length - 1 : 0;

    for (let i = start; i < pile.length; i++) {
      const card = pile[i];
      const c = makeCardEl(card, source + ":" + i);
      c.style.top = "0";
      c.style.zIndex = i;
      if (selected && selected.source === source && selected.index === i) {
        c.classList.add("card--selected");
      }
      container.appendChild(c);
    }
  }

  function renderWaste() {
    el.waste.innerHTML = "";
    const pile = state.waste;
    if (!pile.length) return;
    const show = pile.slice(-Math.min(3, pile.length));
    const offset = pile.length - show.length;
    show.forEach((card, i) => {
      const idx = offset + i;
      const c = makeCardEl(card, "waste:" + idx);
      c.style.left = i * 18 + "px";
      c.style.zIndex = idx;
      if (selected && selected.type === "waste" && selected.index === idx) {
        c.classList.add("card--selected");
      }
      el.waste.appendChild(c);
    });
  }

  function renderTableau(col, pile) {
    const container = el.tableau[col];
    container.innerHTML = "";
    pile.forEach((card, i) => {
      const c = makeCardEl(card, "tableau:" + col + ":" + i);
      c.style.top = i * 24 + "px";
      c.style.zIndex = i;
      if (
        selected &&
        selected.type === "tableau" &&
        selected.col === col &&
        i >= selected.cardIndex
      ) {
        c.classList.add("card--selected");
      }
      container.appendChild(c);
    });
  }

  function isValidTableauStack(cards) {
    for (let i = 0; i < cards.length - 1; i++) {
      const a = cards[i];
      const b = cards[i + 1];
      if (!a.faceUp || !b.faceUp) return false;
      if (isRed(a) === isRed(b) || a.rank !== b.rank + 1) return false;
    }
    return true;
  }

  function parseSource(str) {
    if (str === "stock" || str.startsWith("stock:")) return { type: "stock" };
    if (str.startsWith("waste:")) return { type: "waste", index: parseInt(str.split(":")[1], 10) };
    if (str.startsWith("foundation-")) {
      const base = str.split(":")[0];
      const i = parseInt(base.replace("foundation-", ""), 10);
      return { type: "foundation", index: i };
    }
    if (str.startsWith("tableau:")) {
      const p = str.split(":");
      return { type: "tableau", col: parseInt(p[1], 10), cardIndex: parseInt(p[2], 10) };
    }
    return null;
  }

  function getSelectedCards() {
    if (!selected) return null;
    if (selected.type === "waste") {
      const pile = state.waste;
      return pile.slice(selected.index);
    }
    if (selected.type === "tableau") {
      const pile = state.tableau[selected.col];
      const cards = pile.slice(selected.cardIndex);
      if (!cards.length || !cards[0].faceUp) return null;
      return cards;
    }
    if (selected.type === "foundation") {
      const pile = state.foundations[selected.index];
      if (!pile.length) return null;
      return [pile[pile.length - 1]];
    }
    return null;
  }

  function canPlaceOnTableau(cards, col) {
    const card = cards[0];
    const target = state.tableau[col];
    if (!target.length) return card.rank === 13;
    const top = target[target.length - 1];
    if (!top.faceUp) return false;
    return isRed(card) !== isRed(top) && card.rank === top.rank - 1;
  }

  function canPlaceOnFoundation(card, fi) {
    const pile = state.foundations[fi];
    if (!pile.length) return card.rank === 1;
    const top = pile[pile.length - 1];
    return card.suit === top.suit && card.rank === top.rank + 1;
  }

  function removeFromSource() {
    if (selected.type === "waste") {
      state.waste = state.waste.slice(0, selected.index);
    } else if (selected.type === "tableau") {
      state.tableau[selected.col] = state.tableau[selected.col].slice(0, selected.cardIndex);
      const pile = state.tableau[selected.col];
      if (pile.length && !pile[pile.length - 1].faceUp) {
        pile[pile.length - 1].faceUp = true;
        score += 5;
      }
    } else if (selected.type === "foundation") {
      state.foundations[selected.index].pop();
    }
  }

  function tryMoveToFoundation(cards) {
    if (cards.length !== 1) return false;
    const card = cards[0];
    for (let i = 0; i < 4; i++) {
      if (canPlaceOnFoundation(card, i)) {
        removeFromSource();
        state.foundations[i].push(card);
        moves++;
        score += 10;
        return true;
      }
    }
    return false;
  }

  function tryMoveToTableau(cards, col) {
    if (!isValidTableauStack(cards) || !canPlaceOnTableau(cards, col)) return false;
    removeFromSource();
    state.tableau[col].push(...cards);
    moves++;
    score += 5;
    return true;
  }

  function flipTopWaste() {
    if (state.waste.length) {
      const c = state.waste.pop();
      c.faceUp = false;
      state.stock.push(c);
    }
  }

  function drawFromStock() {
    selected = null;
    if (state.stock.length) {
      const n = Math.min(drawCount, state.stock.length);
      for (let i = 0; i < n; i++) {
        const c = state.stock.pop();
        c.faceUp = true;
        state.waste.push(c);
      }
      moves++;
    } else {
      while (state.waste.length) {
        const c = state.waste.pop();
        c.faceUp = false;
        state.stock.unshift(c);
      }
      if (state.stock.length) moves++;
    }
    render();
  }

  function autoToFoundation() {
    const cards = getSelectedCards();
    if (!cards || cards.length !== 1) return;
    if (tryMoveToFoundation(cards)) {
      selected = null;
      updateStats();
      render();
      checkWin();
    }
  }

  function checkWin() {
    const won = state.foundations.every((p) => p.length === 13);
    if (won) {
      stopTimer();
      score += Math.max(0, 10000 - timerSec * 10);
      updateStats();
      el.winModal.classList.add("is-open");
    }
  }

  function handleClick(e) {
    const cardEl = e.target.closest(".card");
    const pileEl = e.target.closest("[data-pile]");

    if (pileEl && pileEl.dataset.pile === "stock" && !cardEl) {
      drawFromStock();
      return;
    }

    if (cardEl) {
      const src = parseSource(cardEl.dataset.source);
      if (!src) return;

      if (src.type === "stock") {
        drawFromStock();
        return;
      }

      if (!cardEl.classList.contains("card--face") && src.type === "tableau") {
        const pile = state.tableau[src.col];
        const topIdx = pile.length - 1;
        if (topIdx >= 0 && !pile[topIdx].faceUp) {
          pile[topIdx].faceUp = true;
          score += 5;
          render();
        }
        return;
      }

      if (selected) {
        const same =
          selected.type === src.type &&
          (src.type !== "tableau" ||
            (selected.col === src.col && selected.cardIndex === src.cardIndex));
        if (same) {
          selected = null;
          render();
          return;
        }

        const cards = getSelectedCards();
        if (cards) {
          if (src.type === "foundation") {
            if (tryMoveToFoundation(cards)) {
              selected = null;
              updateStats();
              render();
              checkWin();
              return;
            }
          }
          if (src.type === "tableau") {
            if (tryMoveToTableau(cards, src.col)) {
              selected = null;
              updateStats();
              render();
              checkWin();
              return;
            }
          }
        }
      }

      if (src.type === "waste") {
        selected = { type: "waste", index: src.index };
      } else if (src.type === "tableau") {
        const pile = state.tableau[src.col];
        if (!pile[src.cardIndex].faceUp) return;
        selected = { type: "tableau", col: src.col, cardIndex: src.cardIndex };
      } else if (src.type === "foundation") {
        selected = { type: "foundation", index: src.index };
      }
      render();
      return;
    }

    if (pileEl && selected) {
      const pileType = pileEl.dataset.pile;
      const cards = getSelectedCards();
      if (!cards) return;

      if (pileType === "foundation") {
        const fi = parseInt(pileEl.dataset.index, 10);
        if (cards.length === 1 && canPlaceOnFoundation(cards[0], fi)) {
          removeFromSource();
          state.foundations[fi].push(cards[0]);
          moves++;
          score += 10;
          selected = null;
          updateStats();
          render();
          checkWin();
          return;
        }
      }

      if (pileType === "tableau") {
        const col = parseInt(pileEl.dataset.index, 10);
        if (tryMoveToTableau(cards, col)) {
          selected = null;
          updateStats();
          render();
          checkWin();
        }
      }
    } else if (!cardEl) {
      selected = null;
      render();
    }
  }

  function handleDblClick(e) {
    const cardEl = e.target.closest(".card--face");
    if (!cardEl) return;
    const src = parseSource(cardEl.dataset.source);
    if (!src) return;

    if (src.type === "waste") selected = { type: "waste", index: src.index };
    else if (src.type === "tableau")
      selected = { type: "tableau", col: src.col, cardIndex: src.cardIndex };
    else if (src.type === "foundation")
      selected = { type: "foundation", index: src.index };

    autoToFoundation();
  }

  document.getElementById("btn-new").addEventListener("click", newGame);
  document.getElementById("btn-hint").addEventListener("click", () => {
    for (let c = 0; c < 7; c++) {
      const pile = state.tableau[c];
      for (let i = pile.length - 1; i >= 0; i--) {
        if (!pile[i].faceUp) continue;
        const card = pile[i];
        for (let f = 0; f < 4; f++) {
          if (canPlaceOnFoundation(card, f)) {
            alert("힌트: " + RANK_LABEL[card.rank] + SUIT_SYM[card.suit] + " → 완성 더미로 옮길 수 있어요");
            return;
          }
        }
      }
    }
    if (state.waste.length) {
      const card = state.waste[state.waste.length - 1];
      for (let f = 0; f < 4; f++) {
        if (canPlaceOnFoundation(card, f)) {
          alert("힌트: 웨이스트 맨 위 카드를 완성 더미로!");
          return;
        }
      }
    }
    alert("힌트: 스톡을 눌러 카드를 뽑거나, 빨강/검정 교차로 내림차순 쌓아보세요.");
  });
  document.getElementById("btn-undo").addEventListener("click", () => {
    alert("실행 취소는 다음 단계 과제로! (배열 히스토리 스택 연습)");
  });
  document.getElementById("win-close").addEventListener("click", () => {
    el.winModal.classList.remove("is-open");
    newGame();
  });

  document.querySelector(".sol-board").addEventListener("click", handleClick);
  document.querySelector(".sol-board").addEventListener("dblclick", handleDblClick);

  newGame();
})();
