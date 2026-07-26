/* ============================================================
   PROVA IV — CULTURA GERAL (vários jogadores, à vez)
   Sem prémios — apenas para fins educativos.
   As perguntas vêm de window.MedievalTrivia (trivia-questions.js).
   ============================================================ */
(function () {
  "use strict";
  const M = window.Medieval;

  const TIME_LIMIT = 12; // segundos por pergunta
  const ROUNDS_PER_PLAYER = 5;
  const POINTS_CORRECT = 10;

  function shuffled(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function init(root, opts) {
    let rafId = null;
    const timeouts = [];

    function startSetup() {
      root.innerHTML = "";
      M.buildPlayerSetupScreen(root, {
        hudLabel: "PROVA IV",
        title: "CULTURA GERAL",
        introHTML: `
          <p>Um jogo sobre a vida e o reinado de D. Afonso Henriques. Cada jogador responde à vez, uma pergunta de cada vez.</p>
          <div class="edu-warning">📚 Este jogo não tem recompensas — serve apenas para fins educativos.</div>
        `,
        startLabel: "COMEÇAR QUIZ",
        minPlayers: 1, maxPlayers: 4,
        onBack: () => opts.onExit(),
        onStart: (count, names) => {
          const players = names.map((name, i) => ({ name, color: M.PLAYER_COLORS[i].hex, score: 0, correct: 0, total: 0 }));
          startQuiz(players);
        },
      });
    }
    startSetup();

    function startQuiz(players) {
      const bank = window.MedievalTrivia || [];
      let queue = shuffled(bank);
      const totalTurns = players.length * ROUNDS_PER_PLAYER;
      let turnIdx = 0;

      function nextQuestion() {
        if (queue.length === 0) queue = shuffled(bank);
        return queue.pop();
      }

      function playTurn() {
        if (turnIdx >= totalTurns || bank.length === 0) { showFinalScoreboard(players); return; }
        const player = players[turnIdx % players.length];
        const question = nextQuestion();
        const roundNum = Math.floor(turnIdx / players.length) + 1;
        renderQuestion(player, question, roundNum);
      }

      function renderQuestion(player, question, roundNum) {
        const optionLetters = ["A", "B", "C", "D"];
        root.innerHTML = `
          <div class="hud">
            <div class="mini-flag"></div>
            <div class="hud-block"><span class="hud-label">PROVA IV</span><span class="hud-value" style="font-size:9px;">RONDA ${roundNum}/${ROUNDS_PER_PLAYER}</span></div>
            <button class="backBtn" id="t_btnBack">MENU</button>
          </div>
          <div class="screen-center">
            <div class="modal pixel-panel">
              <p class="trivia-turn" style="color:${player.color}">VEZ DE ${player.name.toUpperCase()}</p>
              <p class="trivia-question">${question.q}</p>
              <div class="trivia-timerbar"><div class="trivia-timerbar-fill" id="t_bar" style="width:100%"></div></div>
              <div class="trivia-options" id="t_options">
                ${question.options.map((opt, i) => `<button type="button" class="pixel-btn secondary" data-i="${i}">${optionLetters[i]}) ${opt}</button>`).join("")}
              </div>
            </div>
          </div>
        `;
        root.querySelector("#t_btnBack").addEventListener("click", () => opts.onExit());

        let answered = false;
        let timeLeft = TIME_LIMIT;
        let lastTs = null;
        const bar = root.querySelector("#t_bar");
        const optionBtns = root.querySelectorAll("#t_options button");

        optionBtns.forEach((btn) => {
          btn.addEventListener("click", () => lockAnswer(Number(btn.dataset.i)));
        });

        function lockAnswer(chosenIdx) {
          if (answered) return;
          answered = true;
          if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
          const correct = chosenIdx === question.correctIndex;
          player.total += 1;
          if (correct) { player.score += POINTS_CORRECT; player.correct += 1; M.sfx.good(); }
          else M.sfx.bad();
          optionBtns.forEach((btn) => {
            const i = Number(btn.dataset.i);
            btn.disabled = true;
            if (i === question.correctIndex) btn.classList.add("correct");
            else if (i === chosenIdx) btn.classList.add("wrong");
          });
          timeouts.push(setTimeout(() => { turnIdx += 1; playTurn(); }, 1100));
        }

        function timeUp() {
          if (answered) return;
          answered = true;
          player.total += 1;
          M.sfx.bad();
          optionBtns.forEach((btn) => {
            const i = Number(btn.dataset.i);
            btn.disabled = true;
            if (i === question.correctIndex) btn.classList.add("correct");
          });
          timeouts.push(setTimeout(() => { turnIdx += 1; playTurn(); }, 1300));
        }

        function loop(ts) {
          if (answered) return;
          rafId = requestAnimationFrame(loop);
          if (lastTs === null) lastTs = ts;
          const dt = (ts - lastTs) / 1000;
          lastTs = ts;
          timeLeft -= dt;
          if (timeLeft <= 0) { bar.style.width = "0%"; timeUp(); return; }
          bar.style.width = `${Math.max(0, (timeLeft / TIME_LIMIT) * 100)}%`;
        }
        rafId = requestAnimationFrame(loop);
      }

      playTurn();
    }

    function showFinalScoreboard(players) {
      const maxScore = Math.max(...players.map((p) => p.score));
      const sorted = players.slice().sort((a, b) => b.score - a.score);
      const rows = sorted
        .map((p) => `<li ${p.score >= maxScore ? 'style="color:var(--oxblood); font-weight:bold;"' : ""}>${p.name} — ${p.score} pontos (${p.correct}/${p.total} certas)${p.score >= maxScore ? " 👑" : ""}</li>`)
        .join("");
      root.innerHTML = `
        <div class="hud">
          <div class="mini-flag"></div>
          <div class="hud-block"><span class="hud-label">PROVA IV</span></div>
          <button class="backBtn" id="t_btnBackF">MENU</button>
        </div>
        <div class="screen-center">
          <div class="modal pixel-panel">
            <div class="flagbig"></div>
            <h1>FIM DO QUIZ!</h1>
            <h2>Classificação</h2>
            <ul class="trivia-scoreboard">${rows}</ul>
            <div class="edu-warning">📚 Este jogo não tem recompensas — serve apenas para fins educativos. Para o livro e o prémio em Bitcoin, experimenta as outras provas do torneio!</div>
            <div class="btn-row">
              <button class="pixel-btn secondary" id="t_btnAgain">JOGAR OUTRA VEZ</button>
              <button class="pixel-btn" id="t_btnMenu2">VOLTAR AO MENU</button>
            </div>
          </div>
        </div>
      `;
      root.querySelector("#t_btnBackF").addEventListener("click", () => opts.onExit());
      root.querySelector("#t_btnMenu2").addEventListener("click", () => opts.onExit());
      root.querySelector("#t_btnAgain").addEventListener("click", () => startSetup());
    }

    return {
      destroy() {
        if (rafId) cancelAnimationFrame(rafId);
        timeouts.forEach(clearTimeout);
      },
    };
  }

  M.registerGame({
    id: "trivia",
    name: "Cultura Geral",
    icon: "📜",
    playersLabel: "1 a 4 jogadores · à vez",
    desc: "Perguntas sobre a vida e o reinado de D. Afonso Henriques. Sem prémios — só para aprender e conviver.",
    isEducational: true,
    init,
  });
})();
