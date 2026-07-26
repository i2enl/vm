/* ============================================================
   PROVA III — DEFESA DAS MURALHAS (duelos 2 a 2; torneio com 3 ou 4 jogadores)
   ============================================================ */
(function () {
  "use strict";
  const M = window.Medieval;

  const LOGICAL_W = 320, LOGICAL_H = 340;
  const HEADER_H = 44, FOOTER_H = 34;
  const COLS = 3, ROWS = 2;
  const ROUND_SECONDS = 20;
  const MIN_MOORS_FOR_FEAT = 18;

  function init(root, opts) {
    let rafId = null, fit = null;
    const timeouts = [];
    let featAchievers = [];

    function startSetup() {
      M.buildPlayerSetupScreen(root, {
        hudLabel: "PROVA III",
        title: "DEFESA DAS MURALHAS",
        introHTML: `<p>Dois jogadores de cada vez defendem a sua secção da muralha. Mouros sobem às ameias — toca-lhes antes que fujam. <b>Cuidado:</b> por vezes aparece um aldeão. Não lhe toques, ou perdes pontos!</p>`,
        hint: "💡 Não te podes distrair, os aldeões aparecem e não podem ser abatidos.",
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
          <div class="hud-block"><span class="hud-label">PROVA III</span></div>
          <button class="backBtn" id="w_btnBackI">MENU</button>
        </div>
        <div class="screen-center">
          <div class="modal pixel-panel">
            <h1>${tournament.matchLabel().toUpperCase()}</h1>
            <p class="vs-title" style="color:${a.color}">${a.name}</p>
            <p class="vs-title">CONTRA</p>
            <p class="vs-title" style="color:${b.color}">${b.name}</p>
            <p>Passem o telemóvel e coloquem-se um de cada lado do ecrã. Defendam a vossa muralha durante 20 segundos!</p>
            <div class="btn-row">
              <button class="pixel-btn" id="w_btnFight">DEFENDER!</button>
            </div>
          </div>
        </div>
      `;
      root.querySelector("#w_btnBackI").addEventListener("click", () => opts.onExit());
      root.querySelector("#w_btnFight").addEventListener("click", () => playMatch(tournament, a, b));
    }

    function playMatch(tournament, playerA, playerB) {
      root.innerHTML = `
        <div class="hud">
          <div class="mini-flag"></div>
          <div class="hud-block"><span class="hud-label">TEMPO</span><span class="hud-value" id="w_hudTime">${ROUND_SECONDS}</span></div>
          <button class="backBtn" id="w_btnBack1">MENU</button>
        </div>
        <div class="gameWrap" id="w_gameWrap"><canvas id="w_canvas"></canvas></div>
      `;
      const canvas = root.querySelector("#w_canvas");
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      const gameWrap = root.querySelector("#w_gameWrap");
      const hudTime = root.querySelector("#w_hudTime");
      if (fit) fit.destroy();
      fit = M.fitCanvas(canvas, gameWrap, LOGICAL_W, LOGICAL_H);
      root.querySelector("#w_btnBack1").addEventListener("click", () => opts.onExit());

      const players = [playerA, playerB].map((p) => ({
        name: p.name, color: p.color, score: 0, hits: 0, misses: 0, villagerHits: 0, moorsAppeared: 0,
        slots: Array.from({ length: COLS * ROWS }, () => ({ active: false, type: null, life: 0, dur: 0 })),
        spawnTimer: 0.4,
      }));
      const particles = M.createParticleSystem();
      let phase = "countdown", countdown = 3, countdownTimer = 1, elapsed = 0, lastTs = null;
      let shakeTime = 0, shakeMag = 0, finished = false;

      function zoneWidth() { return LOGICAL_W / 2; }
      function difficulty() { return Math.min(1, elapsed / (ROUND_SECONDS * 0.8)); }

      function cellRect(zoneIdx, cellIdx) {
        const zw = zoneWidth();
        const col = cellIdx % COLS, row = Math.floor(cellIdx / COLS);
        const gridW = zw - 12, gridH = LOGICAL_H - HEADER_H - FOOTER_H;
        const cw = gridW / COLS, ch = gridH / ROWS;
        const x = zoneIdx * zw + 6 + col * cw;
        const y = HEADER_H + row * ch;
        return { x, y, w: cw, h: ch };
      }

      function trySpawn(p) {
        const emptySlots = p.slots.map((s, i) => (!s.active ? i : -1)).filter((i) => i >= 0);
        if (emptySlots.length === 0) return;
        const slotIdx = emptySlots[Math.floor(Math.random() * emptySlots.length)];
        const isVillager = Math.random() < 0.18;
        const dur = 0.95 - difficulty() * 0.5 + Math.random() * 0.15;
        p.slots[slotIdx] = { active: true, type: isVillager ? "villager" : "moor", life: dur, dur };
        if (!isVillager) p.moorsAppeared += 1;
      }

      function onPointer(e) {
        if (phase !== "running") return;
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const lx = ((e.clientX - rect.left) / rect.width) * LOGICAL_W;
        const ly = ((e.clientY - rect.top) / rect.height) * LOGICAL_H;
        const zoneIdx = lx < zoneWidth() ? 0 : 1;
        const p = players[zoneIdx];
        for (let i = 0; i < p.slots.length; i++) {
          const s = p.slots[i];
          if (!s.active) continue;
          const r = cellRect(zoneIdx, i);
          if (lx >= r.x && lx <= r.x + r.w && ly >= r.y && ly <= r.y + r.h) {
            if (s.type === "moor") {
              p.score += 10; p.hits += 1;
              particles.burst(r.x + r.w / 2, r.y + r.h / 2, "#c9972b", 8, 60);
              M.sfx.good();
            } else {
              p.score = Math.max(0, p.score - 15); p.villagerHits += 1;
              particles.burst(r.x + r.w / 2, r.y + r.h / 2, "#7a1e1e", 10, 70);
              M.sfx.bad(); M.vibrate(30);
            }
            s.active = false;
            break;
          }
        }
      }
      function pd(e) { e.preventDefault(); M.ensureAudio(); onPointer(e); }
      canvas.addEventListener("pointerdown", pd, { passive: false });

      function px(x) { return Math.round(x); }

      function drawZone(zoneIdx) {
        const p = players[zoneIdx];
        const zw = zoneWidth(), x0 = zoneIdx * zw;
        ctx.fillStyle = "rgba(255,255,255,0.04)";
        if (zoneIdx === 1) ctx.fillRect(x0, 0, zw, LOGICAL_H);
        ctx.fillStyle = "#fff"; ctx.font = "8px 'Press Start 2P', monospace";
        const label = p.name.length > 11 ? p.name.slice(0, 11) : p.name;
        ctx.fillText(label, x0 + 8, 16);
        ctx.fillStyle = p.color; ctx.font = "10px 'Press Start 2P', monospace";
        ctx.fillText(String(p.score), x0 + 8, 32);

        for (let i = 0; i < p.slots.length; i++) {
          const r = cellRect(zoneIdx, i);
          const s = p.slots[i];
          ctx.fillStyle = "#4a4038"; ctx.fillRect(r.x, r.y, r.w - 4, r.h - 4);
          ctx.strokeStyle = "#1a1410"; ctx.lineWidth = 2; ctx.strokeRect(r.x, r.y, r.w - 4, r.h - 4);
          if (s.active) {
            const cx = r.x + (r.w - 4) / 2, cyBase = r.y + (r.h - 4) / 2;
            const bob = Math.sin(elapsed * 14 + i) * 1.5;
            if (s.type === "moor") {
              ctx.fillStyle = "#6e2b2b"; ctx.fillRect(cx - 8, cyBase - 4 + bob, 16, 12);
              ctx.fillStyle = "#c98a55"; ctx.fillRect(cx - 5, cyBase - 12 + bob, 10, 9);
              ctx.fillStyle = "#ded3ba"; ctx.fillRect(cx - 6, cyBase - 15 + bob, 12, 5);
            } else {
              ctx.fillStyle = "#5b7a45"; ctx.fillRect(cx - 8, cyBase - 4 + bob, 16, 12);
              ctx.fillStyle = "#e8b98a"; ctx.fillRect(cx - 5, cyBase - 12 + bob, 10, 9);
              ctx.fillStyle = "#8a6a3a"; ctx.fillRect(cx - 7, cyBase - 16 + bob, 14, 4);
            }
            const lifeFrac = Math.max(0, s.life / s.dur);
            ctx.fillStyle = "#e8d9b5"; ctx.fillRect(r.x, r.y + r.h - 8, (r.w - 4) * lifeFrac, 3);
          }
        }
      }

      function render() {
        ctx.save();
        if (shakeTime > 0) { const m = shakeMag * (shakeTime / 0.3); ctx.translate((Math.random() - 0.5) * m, (Math.random() - 0.5) * m); }
        ctx.clearRect(-8, -8, LOGICAL_W + 16, LOGICAL_H + 16);
        ctx.fillStyle = "#2f2a22"; ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);
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
          hudTime.textContent = Math.max(0, Math.ceil(ROUND_SECONDS - elapsed));
          const concurrentCap = 1 + Math.floor(difficulty() * 1.999);
          players.forEach((p) => {
            const activeCount = p.slots.filter((s) => s.active).length;
            p.spawnTimer -= dt;
            if (p.spawnTimer <= 0 && activeCount < concurrentCap) {
              trySpawn(p);
              p.spawnTimer = (1.1 - difficulty() * 0.6) + Math.random() * 0.4;
            }
            p.slots.forEach((s) => {
              if (!s.active) return;
              s.life -= dt;
              if (s.life <= 0) { s.active = false; if (s.type === "moor") p.misses += 1; }
            });
          });
          if (elapsed >= ROUND_SECONDS) finishMatch();
        }
        render();
      }

      function resolveMatch() {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        if (players[0].score === players[1].score) {
          playMatch(tournament, playerA, playerB); // empate raro: repete o duelo
          return;
        }
        const winner = players[0].score > players[1].score ? players[0] : players[1];
        const loser = players[0].score > players[1].score ? players[1] : players[0];
        players.forEach((p) => {
          if (p.misses === 0 && p.villagerHits === 0 && p.moorsAppeared >= MIN_MOORS_FOR_FEAT) {
            featAchievers.push({ name: p.name, resultText: `Defesa perfeita — ${p.score} pontos, ${p.hits} mouros abatidos sem falhas (duelo contra ${p === winner ? loser.name : winner.name})` });
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
          <div class="pr-score">${p.score} pontos · ${p.hits} mouros abatidos${p.villagerHits ? ` · ${p.villagerHits} aldeões atingidos` : ""}</div>
          ${p === winner ? '<span class="royal-feat-tag" style="background:var(--royal-blue);">VENCEU O DUELO</span>' : ""}
        </div>`).join("");
      root.innerHTML = `
        <div class="hud">
          <div class="mini-flag"></div>
          <div class="hud-block"><span class="hud-label">PROVA III</span></div>
          <button class="backBtn" id="w_btnBackM">MENU</button>
        </div>
        <div class="screen-center">
          <div class="modal pixel-panel">
            <h1>${winner.name.toUpperCase()} VENCE!</h1>
            ${cards}
            <div class="btn-row">
              <button class="pixel-btn" id="w_btnNext">${tournament.isDone() ? "VER RESULTADO FINAL" : "PRÓXIMO DUELO"}</button>
            </div>
          </div>
        </div>
      `;
      root.querySelector("#w_btnBackM").addEventListener("click", () => opts.onExit());
      root.querySelector("#w_btnNext").addEventListener("click", () => showNextMatchIntro(tournament));
    }

    function showTournamentSummary(tournament) {
      const champion = tournament.champion();
      const historyList = tournament.history
        .map((h) => `<li>${h.winner.name} venceu ${h.loser.name}</li>`)
        .join("");

      let html = `
        <div class="hud">
          <div class="mini-flag"></div>
          <div class="hud-block"><span class="hud-label">PROVA III</span></div>
          <button class="backBtn" id="w_btnBackF">MENU</button>
        </div>
        <div class="screen-center">
          <div class="modal pixel-panel">
            <div class="flagbig"></div>
            <h1>${champion.name.toUpperCase()} DEFENDEU MELHOR AS MURALHAS!</h1>
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
              <button class="pixel-btn secondary" id="w_btnAgainT">NOVO TORNEIO</button>
              <button class="pixel-btn" id="w_btnMenuF">VOLTAR AO MENU</button>
            </div>
          </div>
        </div>
      `;
      root.innerHTML = html;
      root.querySelector("#w_btnBackF").addEventListener("click", () => opts.onExit());
      root.querySelector("#w_btnMenuF").addEventListener("click", () => opts.onExit());
      root.querySelector("#w_btnAgainT").addEventListener("click", () => { featAchievers = []; startSetup(); });

      featAchievers.forEach((f, i) => {
        const holder = root.querySelector(`.featBox_${i}`);
        if (!holder) return;
        holder.innerHTML = M.prizeSectionHTML(f.name);
        M.wirePrizeForm(holder, { gameLabel: "Defesa das Muralhas", playerLabel: f.name, resultText: f.resultText });
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
    id: "muralhas",
    name: "Defesa das Muralhas",
    icon: "🏹",
    playersLabel: "2 a 4 jogadores · duelos 2 a 2",
    desc: "Cada duelo, dois jogadores defendem a sua secção. Atenção aos aldeões escondidos entre os mouros — só a defesa perfeita conta como Feito Real.",
    init,
  });
})();
