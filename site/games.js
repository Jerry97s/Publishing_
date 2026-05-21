/* Games hub — tab switching (must load AFTER game-*.js) */
(function () {
  const tabs = document.querySelectorAll(".game-tab");
  const panels = document.querySelectorAll(".game-panel");
  const inited = {};

  const initMap = {
    cardgame: () => window.initCardGame?.(),
    memory: () => window.initMemory?.(),
    tictactoe: () => window.initTicTacToe?.(),
    number: () => window.initNumberGuess?.(),
  };

  const pauseMap = {
    cardgame: () => window.pauseCardGame?.(),
  };

  const resumeMap = {
    cardgame: () => window.resumeCardGame?.(),
  };

  function tryInit(id) {
    if (inited[id]) return true;
    const init = initMap[id];
    if (typeof init !== "function") return false;
    init();
    inited[id] = true;
    return true;
  }

  function show(id) {
    tabs.forEach((t) => {
      const on = t.dataset.game === id;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    panels.forEach((p) => {
      const on = p.id === "game-" + id;
      p.classList.toggle("is-active", on);
      p.hidden = !on;
    });

    Object.keys(pauseMap).forEach((key) => {
      if (key !== id && inited[key]) pauseMap[key]?.();
    });

    const wasInited = !!inited[id];
    if (!tryInit(id)) {
      console.warn("[games] init not ready:", id);
    } else if (wasInited && resumeMap[id]) {
      resumeMap[id]();
    }

    if (location.hash !== "#" + id) {
      history.replaceState(null, "", "#" + id);
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => show(tab.dataset.game));
  });

  function boot() {
    const hash = (location.hash || "#cardgame").replace("#", "");
    const valid = ["cardgame", "memory", "tictactoe", "number"];
    show(valid.includes(hash) ? hash : "cardgame");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
