/* ============================================================
   PROVA II — O ARÍETE (duelos 2 a 2; torneio com 3 ou 4 jogadores)
   ============================================================ */
(function () {
  "use strict";
  const M = window.Medieval;

  const LOGICAL_W = 300, LOGICAL_H = 300;
  const ROUND_SECONDS = 10;
  const MIN_TAP_INTERVAL = 0.07;
  const PUSH_PER_TAP = 2.2;
  const FEAT_MAX_SECONDS = 4.5;

  function init(root, opts) {
    let rafId = null, fit = null;
    const timeouts = [];
    let featAchievers = [];

    function startSetup() {
      M.buildPlayerSetupScreen(root, {
        hudLabel: "PROVA II",
        title: "O ARÍETE",
        introHTML: `<p>Dois jogadores de cada vez tocam o mais depressa possível para arrombar o portão do castelo. Com mais de 2 jogadores, joga-se em eliminatórias — sempre 2 a 2.</p>`,
        hint: "💡 Clica rápido para derrubares o portão.",
        startLabel: "VER PRIMEIRO DUELO",
        minPlayers: 2, maxPlayers: 4,
        onBack: () => opts.onExit(),
        onStart: (count, names) => {
          const players = names.map((name, i) => ({ name, color: M.PLAYER_COLORS[i].hex }));
          const tournament = M.createTournament(count, players);
          showNextMatchIntro(tournament);
        },
      });
    }
    startSetup();

    function showNextMatchIntro(tournament) {
      const pair = tournament.current();
      if (!pair) { showTournamentSummary(tournament); return; }
      const [a, b] = pair;
      root.innerHTML = `
        <div class="hud">
          <div class="mini-flag"></div>
          <div class="hud-block"><span class="hud-label">PROVA II</span></div>
          <button class="backBtn" id="a_btnBackI">MENU</button>
        </div>
        <div class="screen-center">
          <div class="modal pixel-panel">
            <h1>${tournament.matchLabel().toUpperCase()}</h1>
            <p class="vs-title" style="color:${a.color}">${a.name}</p>
            <p class="vs-title">CONTRA</p>
            <p class="vs-title" style="color:${b.color}">${b.name}</p>
            <p>Passem o telemóvel e coloquem-se um de cada lado do ecrã. Ao sinal, toquem o mais depressa possível!</p>
            <div class="btn-row">
              <button class="pixel-btn" id="a_btnFight">LUTAR!</button>
            </div>
          </div>
        </div>
      `;
      root.querySelector("#a_btnBackI").addEventListener("click", () => opts.onExit());
      root.querySelector("#a_btnFight").addEventListener("click", () => playMatch(tournament, a, b));
    }

    function playMatch(tournament, playerA, playerB) {
      root.innerHTML = `
        <div class="hud">
          <div class="mini-flag"></div>
          <div class="hud-block"><span class="hud-label">TEMPO</span><span class="hud-value" id="a_hudTime">${ROUND_SECONDS.toFixed(1)}</span></div>
          <button class="backBtn" id="a_btnBack1">MENU</button>
        </div>
        <div class="gameWrap" id="a_gameWrap"><canvas id="a_canvas"></canvas></div>
      `;
      const canvas = root.querySelector("#a_canvas");
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      const gameWrap = root.querySelector("#a_gameWrap");
      const hudTime = root.querySelector("#a_hudTime");
      if (fit) fit.destroy();
      fit = M.fitCanvas(canvas, gameWrap, LOGICAL_W, LOGICAL_H);
      root.querySelector("#a_btnBack1").addEventListener("click", () => opts.onExit());

      const players = [
        { ...playerA, push: 0, taps: 0, lastTap: -1, broken: false, breakTime: null },
        { ...playerB, push: 0, taps: 0, lastTap: -1, broken: false, breakTime: null },
      ];
      const particles = M.createParticleSystem();
      let phase = "countdown", countdown = 3, countdownTimer = 1, elapsed = 0, lastTs = null;
      let shakeTime = 0, shakeMag = 0, finished = false;

      function zoneWidth() { return LOGICAL_W / 2; }

      function onPointer(e) {
        if (phase !== "running") return;
        const rect = canvas.getBoundingClientRect();
        const relX = rect.width > 0 ? (e.clientX - rect.left) / rect.width : 0;
        const zoneIdx = relX < 0.5 ? 0 : 1;
        const p = players[zoneIdx];
        if (p.broken) return;
        if (elapsed - p.lastTap < MIN_TAP_INTERVAL) return;
        p.lastTap = elapsed; p.taps += 1;
        p.push = Math.min(100, p.push + PUSH_PER_TAP);
        M.sfx.tap();
        particles.burst((zoneIdx + 0.5) * zoneWidth(), LOGICAL_H - 60, p.color, 4, 30);
        if (p.push >= 100 && !p.broken) {
          p.broken = true; p.breakTime = elapsed;
          shakeMag = 5; shakeTime = 0.3;
          M.sfx.conquest(); M.vibrate([20, 40, 20, 40, 60]);
          finishMatch();
        }
      }
      function pd(e) { e.preventDefault(); M.ensureAudio(); onPointer(e); }
      canvas.addEventListener("pointerdown", pd, { passive: false });

      function px(x) { return Math.round(x); }

      function drawZone(i) {
        const zw = zoneWidth(), x0 = i * zw, p = players[i];
        ctx.fillStyle = "rgba(255,255,255,0.04)";
        if (i === 1) ctx.fillRect(x0, 0, zw, LOGICAL_H);
        const barW = zw * 0.5, barX = x0 + (zw - barW) / 2, barTop = 40, barH = LOGICAL_H - 90;
        ctx.fillStyle = "#100c09"; ctx.fillRect(barX, barTop, barW, barH);
        const fillH = (p.push / 100) * barH;
        ctx.fillStyle = p.color; ctx.fillRect(barX, barTop + barH - fillH, barW, fillH);
        ctx.strokeStyle = "#e8d9b5"; ctx.lineWidth = 2; ctx.strokeRect(barX, barTop, barW, barH);
        ctx.fillStyle = p.broken ? "#3a2414" : "#5b5148";
        ctx.fillRect(barX - 4, barTop - 10, barW + 8, 10);
        ctx.fillStyle = "#fff"; ctx.font = "8px 'Press Start 2P', monospace";
        const label = p.name.length > 11 ? p.name.slice(0, 11) : p.name;
        ctx.fillText(label, x0 + 8, 16);
        ctx.font = "16px 'VT323', monospace";
        ctx.fillText(`${Math.floor(p.push)}%`, x0 + 8, barTop + barH + 22);
      }

      function render() {
        ctx.save();
        if (shakeTime > 0) { const m = shakeMag * (shakeTime / 0.3); ctx.translate((Math.random() - 0.5) * m, (Math.random() - 0.5) * m); }
        ctx.clearRect(-8, -8, LOGICAL_W + 16, LOGICAL_H + 16);
        ctx.fillStyle = "#2a2118"; ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);
        drawZone(0); drawZone(1);
        ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(LOGICAL_W / 2, 0); ctx.lineTo(LOGICAL_W / 2, LOGICAL_H); ctx.stroke();
        particles.draw(ctx, px);
        ctx.restore();
        if (phase === "countdown") {
          ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);
          ctx.fillStyle = "#e8d9b5"; ctx.font = "26px 'Press Start 2P', monospace";
          ctx.textAlign = "center";
          ctx.fillText(countdown > 0 ? String(countdown) : "VAI!", LOGICAL_W / 2, LOGICAL_H / 2);
          ctx.textAlign = "left";
        }
      }

      function finishMatch() {
        if (finished) return;
        finished = true; phase = "done";
        timeouts.push(setTimeout(() => resolveMatch(), 350));
      }

      function loop(ts) {
        rafId = requestAnimationFrame(loop);
        if (lastTs === null) lastTs = ts;
        let dt = (ts - lastTs) / 1000; lastTs = ts;
        if (dt > 0.05) dt = 0.05;
        particles.update(dt);
        if (shakeTime > 0) shakeTime -= dt;
        if (phase === "countdown") {
          countdownTimer -= dt;
          if (countdownTimer <= 0) {
            countdown -= 1; countdownTimer = 1;
            if (countdown >= 0) M.sfx.countdown();
            if (countdown < 0) { phase = "running"; M.sfx.go(); }
          }
        } else if (phase === "running") {
          elapsed += dt;
          hudTime.textContent = Math.max(0, ROUND_SECONDS - elapsed).toFixed(1);
          if (elapsed >= ROUND_SECONDS) finishMatch();
        }
        render();
      }

      function resolveMatch() {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        if (players[0].push === players[1].push) {
          playMatch(tournament, playerA, playerB); // empate raro: repete o duelo
          return;
        }
        const winner = players[0].push > players[1].push ? players[0] : players[1];
        const loser = players[0].push > players[1].push ? players[1] : players[0];
        players.forEach((p) => {
          if (p.broken && p.breakTime !== null && p.breakTime <= FEAT_MAX_SECONDS) {
            featAchievers.push({ name: p.name, resultText: `Portão arrombado em ${p.breakTime.toFixed(1)} segundos (duelo contra ${p === winner ? loser.name : winner.name})` });
          }
        });
        tournament.reportWinner(
          { name: winner.name, color: winner.color },
          { name: loser.name, color: loser.color }
        );
        showMatchResult(tournament, winner, loser);
      }

      rafId = requestAnimationFrame(loop);
    }

    function showMatchResult(tournament, winner, loser) {
      const sorted = [winner, loser];
      const cards = sorted.map((p) => `
        <div class="player-result-card ${p === winner ? "winner" : ""}" style="border-left:8px solid ${p.color}">
          <div class="pr-name">${p.name}</div>
          <div class="pr-score">${Math.floor(p.push)}% · ${p.taps} toques</div>
          ${p === winner ? '<span class="royal-feat-tag" style="background:var(--royal-blue);">VENCEU O DUELO</span>' : ""}
        </div>`).join("");
      root.innerHTML = `
        <div class="hud">
          <div class="mini-flag"></div>
          <div class="hud-block"><span class="hud-label">PROVA II</span></div>
          <button class="backBtn" id="a_btnBackM">MENU</button>
        </div>
        <div class="screen-center">
          <div class="modal pixel-panel">
            <h1>${winner.name.toUpperCase()} VENCE!</h1>
            ${cards}
            <div class="btn-row">
              <button class="pixel-btn" id="a_btnNext">${tournament.isDone() ? "VER RESULTADO FINAL" : "PRÓXIMO DUELO"}</button>
            </div>
          </div>
        </div>
      `;
      root.querySelector("#a_btnBackM").addEventListener("click", () => opts.onExit());
      root.querySelector("#a_btnNext").addEventListener("click", () => showNextMatchIntro(tournament));
    }

    function showTournamentSummary(tournament) {
      const champion = tournament.champion();
      const historyList = tournament.history
        .map((h) => `<li>${h.winner.name} venceu ${h.loser.name}</li>`)
        .join("");

      let html = `
        <div class="hud">
          <div class="mini-flag"></div>
          <div class="hud-block"><span class="hud-label">PROVA II</span></div>
          <button class="backBtn" id="a_btnBackF">MENU</button>
        </div>
        <div class="screen-center">
          <div class="modal pixel-panel">
            <div class="flagbig"></div>
            <h1>${champion.name.toUpperCase()} É O CAMPEÃO DO ARÍETE!</h1>
            <h2>Percurso do torneio</h2>
            <ul class="bracket-list">${historyList}</ul>
            <hr class="divider">
            <p>Seja qual for o resultado, leva contigo o livro <b>"Um café com o Protocolo Bitcoin"</b>:</p>
            <div class="btn-row">${M.bookButtonHTML()}</div>
      `;
      if (featAchievers.length) {
        html += `<hr class="divider"><h2>Feitos Reais alcançados</h2>`;
        featAchievers.forEach((f, i) => {
          html += `<div class="player-result-card"><div class="pr-name">${f.name}</div><div class="pr-score">${f.resultText}</div><div class="featBox_${i}"></div></div>`;
        });
      }
      html += `
            <hr class="divider">
            <div class="btn-row">
              <button class="pixel-btn secondary" id="a_btnAgainT">NOVO TORNEIO</button>
              <button class="pixel-btn" id="a_btnMenuF">VOLTAR AO MENU</button>
            </div>
          </div>
        </div>
      `;
      root.innerHTML = html;
      root.querySelector("#a_btnBackF").addEventListener("click", () => opts.onExit());
      root.querySelector("#a_btnMenuF").addEventListener("click", () => opts.onExit());
      root.querySelector("#a_btnAgainT").addEventListener("click", () => { featAchievers = []; startSetup(); });

      featAchievers.forEach((f, i) => {
        const holder = root.querySelector(`.featBox_${i}`);
        if (!holder) return;
        holder.innerHTML = M.prizeSectionHTML(f.name);
        M.wirePrizeForm(holder, { gameLabel: "O Aríete", playerLabel: f.name, resultText: f.resultText });
      });
    }

    return {
      destroy() {
        if (rafId) cancelAnimationFrame(rafId);
        if (fit) fit.destroy();
        timeouts.forEach(clearTimeout);
      },
    };
  }

  M.registerGame({
    id: "ariete",
    name: "O Aríete",
    icon: "🛡",
    playersLabel: "2 a 4 jogadores · duelos 2 a 2",
    desc: "Toca o mais depressa possível e arromba o portão antes do adversário. Quase impossível fazê-lo em menos de 4,5 segundos.",
    init,
  });
})();
