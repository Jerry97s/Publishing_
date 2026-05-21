/* 숫자 맞추기 1~100 */
(function () {
  let started = false;
  let answer = 0;
  let tries = 0;
  const MAX = 100;
  const MIN = 1;

  function newGame() {
    answer = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
    tries = 0;
    document.getElementById("num-input").value = "";
    document.getElementById("num-log").innerHTML = "<p>1부터 100 사이 숫자를 맞춰보세요.</p>";
    document.getElementById("num-tries").textContent = "0";
    document.getElementById("num-status").textContent = "대기 중";
  }

  function guess() {
    const input = document.getElementById("num-input");
    const n = parseInt(input.value, 10);
    const log = document.getElementById("num-log");
    if (isNaN(n) || n < MIN || n > MAX) {
      log.innerHTML += "<p>⚠ 1~100 사이 숫자를 입력하세요.</p>";
      return;
    }
    tries++;
    document.getElementById("num-tries").textContent = tries;
    if (n < answer) {
      log.innerHTML += "<p>" + tries + "회: " + n + " → <strong>더 큰 수</strong></p>";
      document.getElementById("num-status").textContent = "UP ↑";
    } else if (n > answer) {
      log.innerHTML += "<p>" + tries + "회: " + n + " → <strong>더 작은 수</strong></p>";
      document.getElementById("num-status").textContent = "DOWN ↓";
    } else {
      log.innerHTML += "<p>🎉 " + tries + "회 만에 정답 <strong>" + answer + "</strong>!</p>";
      document.getElementById("num-status").textContent = "정답!";
      alert(tries + "번 만에 맞췄습니다! (정답: " + answer + ")");
      newGame();
    }
    log.scrollTop = log.scrollHeight;
    input.value = "";
    input.focus();
  }

  window.initNumberGuess = function () {
    if (started) return;
    started = true;
    document.getElementById("num-btn-new").addEventListener("click", newGame);
    document.getElementById("num-btn-go").addEventListener("click", guess);
    document.getElementById("num-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") guess();
    });
    newGame();
  };
})();
