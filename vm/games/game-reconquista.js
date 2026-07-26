/* ============================================================
   PROVA I — A RECONQUISTA (solo)
   ============================================================ */
(function () {
  "use strict";
  const M = window.Medieval;

  const REIGN_START = new Date(1143, 10, 5);
  const REIGN_END = new Date(1185, 12, 6);
  const REIGN_TOTAL_DAYS = (REIGN_END - REIGN_START) / 86400000;
  const REIGN_SECONDS = 60;

  const PT_MONTHS = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];

  const CONQUESTS = [
    { id:"santarem", name:"Santarém", date:"março de 1147", dist:900, bonus:400, blurb:"Tomada de surpresa, numa rápida operação militar." },
    { id:"lisboa", name:"Lisboa", date:"outubro de 1147", dist:2500, bonus:650, blurb:"Conquistada com o apoio decisivo de cruzados do norte da Europa." },
    { id:"asp", name:"Almada, Sintra e Palmela", date:"c. 1147–1158", dist:4400, bonus:700, blurb:"Vilas e castelos fortificados para assegurar a margem sul do Tejo." },
    { id:"alcacer", name:"Alcácer do Sal", date:"1158", dist:6800, bonus:800, blurb:"Conquistada para afastar o perigo muçulmano da região." },
    { id:"beja", name:"Beja", date:"1162", dist:9600, bonus:900, blurb:"Importante praça do sul sob domínio português." },
    { id:"evora", name:"Évora", date:"1165", dist:13000, bonus:1000, blurb:"Ocupada com a colaboração de cavaleiros como Geraldo Sem Pavor." },
    { id:"moura", name:"Moura e Juromenha", date:"séc. XII", dist:17200, bonus:1500, blurb:"Últimas praças alentejanas no avanço para sul.", isFinal:true },
  ];

  const LOGICAL_W = 240, LOGICAL_H = 432, GROUND_OFFSET = 74;
  const GRAVITY = 1500, JUMP_VY = -420, GRACE_PERIOD = 2.2;

  function init(root, opts) {
    root.innerHTML = `
      <div class="hud">
        <div class="mini-flag"></div>
        <div class="hud-block"><span class="hud-label">DATA</span><span class="hud-value" id="r_hudDate">—</span></div>
        <div class="hud-block"><span class="hud-label">PONTOS</span><span class="hud-value" id="r_hudScore">0</span><span class="combo-box" id="r_comboBox"></span></div>
        <div class="hud-block"><span class="hud-label">VIDAS</span><span class="hud-value" id="r_livesBox">♥♥♥</span></div>
        <button class="backBtn" id="r_btnBack">MENU</button>
      </div>
      <div class="gameWrap" id="r_gameWrap">
        <canvas id="r_canvas"></canvas>
        <div class="hitFlash" id="r_hitFlash"></div>
        <div class="toast" id="r_toast"></div>
        <div class="tapHint" id="r_tapHint">👆 toca para saltar</div>
      </div>
      <div class="chronicle pixel-panel" id="r_chronicle">A cavalgar rumo a sul...</div>

      <div class="overlay" id="r_startOverlay">
        <div class="modal pixel-panel">
          <div class="flagbig"></div>
          <h1>A RECONQUISTA<br>D. AFONSO HENRIQUES</h1>
          <p>1143 — 1185. O primeiro rei de Portugal cavalga para sul, terra a terra, contra os Mouros.</p>
          <p><b>Toca para saltar</b> os soldados mouros. <b>Não saltes</b> quando vires uma flecha a voar — ela só te atinge no ar!</p>
          <p class="small-note">O relógio do reinado termina em 1185 — as conquistas históricas vão surgindo com a tua perícia. </p>
          <div class="btn-row">
            <button class="pixel-btn" id="r_btnStart">INICIAR JOGO</button>
            <button class="pixel-btn secondary" id="r_btnBack1">VOLTAR AO MENU</button>
          </div>
        </div>
      </div>
      <div class="overlay hidden" id="r_endOverlay"><div class="modal pixel-panel" id="r_endModalContent"></div></div>
    `;

    const canvas = root.querySelector("#r_canvas");
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    const gameWrap = root.querySelector("#r_gameWrap");
    const hudDate = root.querySelector("#r_hudDate");
    const hudScore = root.querySelector("#r_hudScore");
    const livesBox = root.querySelector("#r_livesBox");
    const comboBox = root.querySelector("#r_comboBox");
    const toastEl = root.querySelector("#r_toast");
    const tapHint = root.querySelector("#r_tapHint");
    const chronicle = root.querySelector("#r_chronicle");
    const startOverlay = root.querySelector("#r_startOverlay");
    const endOverlay = root.querySelector("#r_endOverlay");
    const endModalContent = root.querySelector("#r_endModalContent");
    const hitFlash = root.querySelector("#r_hitFlash");

    const fit = M.fitCanvas(canvas, gameWrap, LOGICAL_W, LOGICAL_H);

    let state = "start", elapsed = 0, distance = 0, score = 0, lives = 3, invuln = 0, speed = 90;
    let timeScale = 1, slowmoTimer = 0, spawnTimer = 0, nextSpawnGap = 1.6;
    let obstacles = [], coins = [], achieved = new Set();
    let toastTimer = 0, combo = 0, comboMult = 1, runFrame = 0, runClock = 0;
    let shakeTime = 0, shakeMag = 0, player = { y: 0, vy: 0, jumping: false };
    let endReason = null, lastTs = null, rafId = null;
    const particles = M.createParticleSystem();
    const timeouts = [];

    function groundY() { return LOGICAL_H - GROUND_OFFSET; }
    function formatDate(d) { return `${d.getDate()} de ${PT_MONTHS[d.getMonth()]} de ${d.getFullYear()}`; }
    function dateAtElapsed(t) { const frac = Math.min(1, t / REIGN_SECONDS); return new Date(REIGN_START.getTime() + frac * REIGN_TOTAL_DAYS * 86400000); }

    function resetGame() {
      elapsed = 0; distance = 0; score = 0; lives = 3; invuln = 0; speed = 90;
      timeScale = 1; slowmoTimer = 0; spawnTimer = 0; nextSpawnGap = 1.6;
      obstacles = []; coins = []; achieved = new Set(); toastTimer = 0; combo = 0; comboMult = 1;
      runFrame = 0; runClock = 0; shakeTime = 0; shakeMag = 0; endReason = null;
      player.y = 0; player.vy = 0; player.jumping = false;
      particles.clear();
      updateHud();
      chronicle.textContent = `Próximo alvo: ${CONQUESTS[0].name} (${CONQUESTS[0].date})`;
    }
    function updateHud() {
      hudDate.textContent = formatDate(dateAtElapsed(elapsed));
      hudScore.textContent = Math.floor(score);
      livesBox.textContent = "♥".repeat(Math.max(0, lives)) + "♡".repeat(3 - Math.max(0, lives));
      comboBox.textContent = comboMult > 1.05 ? `x${comboMult.toFixed(1)}` : "";
      hudDate.classList.toggle("danger", elapsed > REIGN_SECONDS * 0.8);
    }

    function onTap() {
      if (state === "start" || state === "over") return;
      M.ensureAudio();
      if ((state === "playing" || state === "toast") && !player.jumping) {
        player.jumping = true; player.vy = JUMP_VY; M.sfx.jump();
      }
    }
    function pd(e) { e.preventDefault(); onTap(); }
    canvas.addEventListener("pointerdown", pd, { passive: false });
    gameWrap.addEventListener("pointerdown", pd, { passive: false });
    function keyHandler(e) { if (e.code === "Space") onTap(); }
    window.addEventListener("keydown", keyHandler);

    root.querySelector("#r_btnStart").addEventListener("click", () => {
      M.ensureAudio();
      startOverlay.classList.add("hidden");
      resetGame(); state = "playing";
      tapHint.style.opacity = "1";
      timeouts.push(setTimeout(() => { if (state === "playing" || state === "toast") tapHint.style.opacity = "0"; }, 3200));
      lastTs = null; fit.layout();
      if (!rafId) rafId = requestAnimationFrame(loop);
    });
    root.querySelector("#r_btnBack1").addEventListener("click", () => opts.onExit());
    root.querySelector("#r_btnBack").addEventListener("click", () => opts.onExit());

    function shake(mag, time) { shakeMag = Math.max(shakeMag, mag); shakeTime = Math.max(shakeTime, time); }
    function flashHit() { hitFlash.classList.add("show"); timeouts.push(setTimeout(() => hitFlash.classList.remove("show"), 110)); }
    function px(x) { return Math.round(x); }

    function regionBlend() { return Math.min(1, distance / CONQUESTS[CONQUESTS.length - 1].dist); }
    function lerpColor(c1, c2, t) {
      const a = c1.match(/\w\w/g).map((x) => parseInt(x, 16));
      const b = c2.match(/\w\w/g).map((x) => parseInt(x, 16));
      return `#${a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, "0")).join("")}`;
    }

    function drawBackground(camX) {
      const t = regionBlend();
      const g = ctx.createLinearGradient(0, 0, 0, groundY());
      g.addColorStop(0, lerpColor("#bfe0f2", "#f2d9a0", t));
      g.addColorStop(1, lerpColor("#e9d9b0", "#f0c078", t));
      ctx.fillStyle = g; ctx.fillRect(0, 0, LOGICAL_W, groundY());
      ctx.fillStyle = "#f2c85b"; ctx.fillRect(LOGICAL_W - 44, 20, 18, 18);
      ctx.fillStyle = lerpColor("#8a9b5e", "#b0965a", t);
      const ho = (camX * 0.15) % 90;
      for (let i = -1; i < LOGICAL_W / 90 + 2; i++) ctx.fillRect(i * 90 - ho, groundY() - 38, 66, 38);
      ctx.fillStyle = lerpColor("#71824c", "#957a45", t);
      const ho2 = (camX * 0.32) % 64;
      for (let i = -1; i < LOGICAL_W / 64 + 2; i++) ctx.fillRect(i * 64 - ho2, groundY() - 22, 44, 22);
      ctx.fillStyle = "#c9a35a"; ctx.fillRect(0, groundY(), LOGICAL_W, LOGICAL_H - groundY());
      ctx.fillStyle = "#b78a43";
      const to = camX % 22;
      for (let i = -1; i < LOGICAL_W / 22 + 2; i++) ctx.fillRect(i * 22 - to, groundY(), 11, 7);
    }

    function drawConquestMarkers(camX) {
      CONQUESTS.forEach((c) => {
        const sx = c.dist - camX;
        if (sx < -60 || sx > LOGICAL_W + 60) return;
        const baseY = groundY(); const got = achieved.has(c.id);
        ctx.fillStyle = got ? "#7a8f52" : "#5b5148"; ctx.fillRect(sx - 10, baseY - 38, 20, 38);
        ctx.fillStyle = got ? "#8fa564" : "#6d6154"; ctx.fillRect(sx - 14, baseY - 46, 6, 10); ctx.fillRect(sx + 8, baseY - 46, 6, 10);
        if (got) {
          ctx.fillStyle = "#e8d9b5"; ctx.fillRect(sx - 1, baseY - 58, 10, 7);
          ctx.fillStyle = "#1e3a5f"; ctx.fillRect(sx + 3, baseY - 58, 2, 7); ctx.fillRect(sx - 1, baseY - 55, 10, 1);
          ctx.fillStyle = "#1a1410"; ctx.fillRect(sx - 1, baseY - 58, 1, 20);
        }
      });
    }

    const PLAYER_X = 34, PLAYER_W = 30, PLAYER_H = 30;
    function drawKnightHorse(jumpOffset, frame, hurt) {
      const x = PLAYER_X;
      const bob = player.jumping ? 0 : (frame % 2 === 0 ? 0 : -1);
      const y = groundY() - jumpOffset - bob;
      if (hurt && Math.floor(runClock * 20) % 2 === 0) return;
      ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.fillRect(x - 2, groundY() + 1, 34, 4);
      ctx.fillStyle = "#5a3a22";
      const legFrame = player.jumping ? 0 : frame % 2;
      if (legFrame === 0) { ctx.fillRect(x + 2, y - 6, 4, 10); ctx.fillRect(x + 22, y - 6, 4, 10); }
      else { ctx.fillRect(x + 4, y - 6, 4, 8); ctx.fillRect(x + 20, y - 6, 4, 8); }
      ctx.fillStyle = "#6b4423"; ctx.fillRect(x, y - 20, 30, 16);
      ctx.fillStyle = "#7a4f2a"; ctx.fillRect(x, y - 22, 30, 4);
      ctx.fillStyle = "#6b4423"; ctx.fillRect(x + 26, y - 26, 10, 10);
      ctx.fillStyle = "#3a2414"; ctx.fillRect(x + 33, y - 24, 3, 3); ctx.fillRect(x - 4, y - 20, 4, 12);
      ctx.fillStyle = "#e8d9b5"; ctx.fillRect(x + 6, y - 34, 14, 14);
      ctx.fillStyle = "#1e3a5f"; ctx.fillRect(x + 11, y - 34, 4, 14); ctx.fillRect(x + 6, y - 28, 14, 3);
      ctx.fillStyle = "#e8d9b5"; ctx.fillRect(x + 18, y - 32, 5, 6);
      ctx.fillStyle = "#c9c9c9"; ctx.fillRect(x + 22, y - 40, 3, 16);
      ctx.fillStyle = "#c9972b"; ctx.fillRect(x + 20, y - 26, 8, 3);
      ctx.fillStyle = "#e8b98a"; ctx.fillRect(x + 9, y - 44, 9, 9);
      ctx.fillStyle = "#4a3324"; ctx.fillRect(x + 9, y - 38, 9, 5);
      ctx.fillStyle = "#8a8f94"; ctx.fillRect(x + 8, y - 47, 11, 5);
      ctx.fillStyle = "#c9972b"; ctx.fillRect(x + 8, y - 43, 11, 1);
      ctx.fillStyle = "#1a1410"; ctx.fillRect(x + 12, y - 41, 2, 2);
    }

    function drawMoor(o) {
      const x = px(o.x), y = groundY();
      ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.fillRect(x - 1, y + 1, o.w + 2, 4);
      ctx.fillStyle = "#2e2a26"; ctx.fillRect(x + 2, y - 10, 4, 10); ctx.fillRect(x + o.w - 6, y - 10, 4, 10);
      ctx.fillStyle = "#6e2b2b"; ctx.fillRect(x, y - 24, o.w, 16);
      ctx.fillStyle = "#8a3a3a"; ctx.fillRect(x, y - 24, o.w, 4);
      ctx.fillStyle = "#c98a55"; ctx.fillRect(x + o.w / 2 - 4, y - 32, 8, 8);
      ctx.fillStyle = "#ded3ba"; ctx.fillRect(x + o.w / 2 - 5, y - 36, 10, 5);
      ctx.fillStyle = "#c9c9c9"; ctx.fillRect(x + o.w + 1, y - 34, 2, 24);
      ctx.fillStyle = "#8a8f94"; ctx.fillRect(x + o.w, y - 36, 4, 4);
    }
    function drawArrow(o) {
      const x = px(o.x), y = px(o.y);
      ctx.fillStyle = "#8a6a3a"; ctx.fillRect(x, y, 16, 2);
      ctx.fillStyle = "#3a2414"; ctx.fillRect(x, y - 2, 4, 6);
      ctx.fillStyle = "#c9c9c9"; ctx.fillRect(x + 14, y - 1, 4, 4);
    }
    function drawCoin(c) {
      if (c.taken) return;
      const bobY = c.y + Math.sin(runClock * 6 + c.x) * 2;
      ctx.fillStyle = "#f2c230"; ctx.fillRect(px(c.x), px(bobY), 8, 8);
      ctx.fillStyle = "#c9972b"; ctx.fillRect(px(c.x) + 2, px(bobY) + 2, 4, 4);
    }

    function showConquestToast(c) {
      toastEl.innerHTML = `<span>&#9876; ${c.name} conquistada!</span><span class="toast-date">${c.date} · +${c.bonus} pts</span>`;
      toastEl.classList.add("show"); toastTimer = 1.5;
      const idx = CONQUESTS.findIndex((cc) => cc.id === c.id);
      const next = CONQUESTS[idx + 1];
      chronicle.innerHTML = next
        ? `<b>${c.name}</b> conquistada. Próximo alvo: ${next.name} (${next.date})`
        : `<b>${c.name}</b> conquistada — todas as praças estão sob o teu domínio!`;
    }

    function spawnObstacleIfNeeded(dt) {
      if (elapsed < GRACE_PERIOD) return;
      spawnTimer += dt;
      if (spawnTimer >= nextSpawnGap) {
        spawnTimer = 0;
        const difficulty = Math.min(1, (elapsed - GRACE_PERIOD) / 45);
        nextSpawnGap = (1.15 - difficulty * 0.55) + Math.random() * 0.5;
        const arrowChance = 0.18 + difficulty * 0.22;
        if (Math.random() < arrowChance) {
          obstacles.push({ type: "arrow", x: distance + LOGICAL_W + 20, y: groundY() - 78, w: 16, h: 6, passed: false });
        } else {
          const w = 14 + Math.floor(Math.random() * 6);
          obstacles.push({ type: "moor", x: distance + LOGICAL_W + 20, w, h: 24, passed: false, nearMiss: false });
        }
        if (Math.random() < 0.32) coins.push({ x: distance + LOGICAL_W + 60 + Math.random() * 30, y: groundY() - 60 - Math.random() * 24, taken: false });
      }
    }

    function loop(ts) {
      rafId = requestAnimationFrame(loop);
      if (lastTs === null) lastTs = ts;
      let rawDt = (ts - lastTs) / 1000; lastTs = ts;
      if (rawDt > 0.05) rawDt = 0.05;

      if (slowmoTimer > 0) { slowmoTimer -= rawDt; timeScale = 0.28; if (slowmoTimer <= 0) timeScale = 1; }
      const dt = rawDt * timeScale;
      particles.update(rawDt);

      if (state === "toast") {
        toastTimer -= rawDt; runClock += rawDt;
        if (toastTimer <= 0) { toastEl.classList.remove("show"); state = "playing"; }
        stepPhysicsAndDraw(dt); return;
      }
      if (state !== "playing") { renderFrame(); return; }

      elapsed += rawDt; runClock += rawDt;
      if (invuln > 0) invuln -= rawDt;
      if (shakeTime > 0) shakeTime -= rawDt;

      const inGrace = elapsed < GRACE_PERIOD;
      speed = inGrace ? 90 : 90 + achieved.size * 14 + Math.min(95, (elapsed - GRACE_PERIOD) * 2.8);
      distance += speed * dt;
      score += speed * dt * 0.05 * comboMult;

      stepPhysicsAndDraw(dt);
      spawnObstacleIfNeeded(dt);
      handleObstacles();
      handleCoins();
      handleConquests();

      if (state === "playing" && elapsed >= REIGN_SECONDS) triggerGameOver("time");
      updateHud();
    }

    function stepPhysicsAndDraw(dt) {
      if (player.jumping) {
        player.vy += GRAVITY * dt; player.y += player.vy * dt;
        if (player.y >= 0) { player.y = 0; player.vy = 0; player.jumping = false; }
      }
      renderFrame();
    }

    function handleObstacles() {
      const jumpOffset = -player.y;
      const playerBottom = groundY() - jumpOffset;
      const playerTop = playerBottom - PLAYER_H;
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const o = obstacles[i];
        const screenX = o.x - distance;
        if (screenX < -40) { obstacles.splice(i, 1); continue; }
        const overlapX = screenX < PLAYER_X + PLAYER_W - 6 && screenX + (o.w || 16) > PLAYER_X + 6;
        if (o.type === "moor") {
          if (invuln <= 0 && overlapX) {
            const obsTop = groundY() - o.h;
            if (playerBottom > obsTop + 6) { hitPlayer(o.x, groundY()); obstacles.splice(i, 1); continue; }
            else if (playerBottom - obsTop > -8) o.nearMiss = true;
          }
          if (!o.passed && screenX + (o.w || 16) < PLAYER_X) { o.passed = true; registerClear(o); }
        } else if (o.type === "arrow") {
          if (invuln <= 0 && overlapX) {
            const arrowTop = o.y, arrowBottom = o.y + o.h;
            if (playerTop < arrowBottom && playerBottom > arrowTop) { hitPlayer(o.x, o.y); obstacles.splice(i, 1); continue; }
          }
          if (!o.passed && screenX + o.w < PLAYER_X) { o.passed = true; registerClear(o); }
        }
      }
    }
    function registerClear(o) {
      combo += 1; comboMult = Math.min(3, 1 + combo * 0.12);
      score += (o.type === "moor" ? 12 : 6) * comboMult;
      if (o.type === "moor" && o.nearMiss) {
        score += 30;
        particles.floater(PLAYER_X + 10, groundY() - 60, "PERFEITO!", "#c9972b");
        M.sfx.good(); M.vibrate(15);
      }
    }
    function hitPlayer(wx, wy) {
      lives -= 1; invuln = 1.3; combo = 0; comboMult = 1;
      const sx = wx - distance;
      particles.burst(sx, groundY() - 20, "#7a1e1e", 14, 90);
      shake(4, 0.25); flashHit(); M.sfx.hit(); M.vibrate([40, 30, 40]);
      if (lives <= 0) triggerGameOver("lives");
    }
    function handleCoins() {
      const jumpOffset = -player.y;
      const playerBottom = groundY() - jumpOffset, playerTop = playerBottom - PLAYER_H;
      for (let i = coins.length - 1; i >= 0; i--) {
        const c = coins[i]; const screenX = c.x - distance;
        if (screenX < -20) { coins.splice(i, 1); continue; }
        if (!c.taken && screenX > PLAYER_X - 10 && screenX < PLAYER_X + 30) {
          if (c.y > playerTop - 6 && c.y < playerBottom) {
            c.taken = true; score += 20 * comboMult;
            particles.burst(screenX, c.y, "#f2c230", 8, 50); M.sfx.coin();
          }
        }
      }
    }
    function handleConquests() {
      if (state !== "playing") return;
      for (const c of CONQUESTS) {
        if (!achieved.has(c.id) && distance >= c.dist) {
          achieved.add(c.id); score += c.bonus;
          showConquestToast(c); state = "toast";
          particles.burst(LOGICAL_W * 0.5, LOGICAL_H * 0.35, "#c9972b", 26, 110);
          shake(3, 0.3); slowmoTimer = 0.45; M.sfx.conquest(); M.vibrate([20, 40, 20, 40, 60]);
          if (c.isFinal) triggerGameOver("win");
          break;
        }
      }
    }

    function renderFrame() {
      runFrame = Math.floor(runClock * 8);
      ctx.save();
      if (shakeTime > 0) { const m = shakeMag * (shakeTime / 0.3); ctx.translate((Math.random() - 0.5) * m, (Math.random() - 0.5) * m); }
      else shakeMag = 0;
      ctx.clearRect(-10, -10, LOGICAL_W + 20, LOGICAL_H + 20);
      drawBackground(distance); drawConquestMarkers(distance);
      coins.forEach(drawCoin);
      obstacles.forEach((o) => { const so = { ...o, x: o.x - distance }; if (o.type === "moor") drawMoor(so); else drawArrow(so); });
      drawKnightHorse(-player.y, runFrame, invuln > 0);
      particles.draw(ctx, px);
      ctx.restore();
    }

    function triggerGameOver(reason) {
      if (state === "over") return;
      endReason = reason; state = "over"; tapHint.style.opacity = "0";
      if (reason !== "win") M.sfx.lose(); else M.sfx.win();
      timeouts.push(setTimeout(buildEndScreen, 400));
    }

    function buildEndScreen() {
      const won = endReason === "win";
      const achievedList = CONQUESTS.map((c) => `<li class="${achieved.has(c.id) ? "" : "missed"}">${c.name} <span class="small-note">(${c.date})</span></li>`).join("");
      let reasonText;
      if (endReason === "win") reasonText = "Conquistaste todo o território antes que o reinado terminasse. Um feito quase impossível!";
      else if (endReason === "lives") reasonText = "As tuas hostes foram derrotadas em combate.";
      else reasonText = "O reinado chegou ao fim (4 de outubro de 1143) antes de completares a Reconquista.";

      let html = `
        <div class="flagbig"></div>
        <h1>${won ? "VITÓRIA REAL!" : "FIM DE JOGO"}</h1>
        <p>${reasonText}</p>
        <p style="font-family:var(--font-display); font-size:16px; color:var(--oxblood);">${Math.floor(score)} pontos</p>
        <h2>Crónica da tua jornada</h2>
        <ul class="conquest-list">${achievedList}</ul>
        <hr class="divider">
        <h2>O teu prémio</h2>
        <p>Seja qual for o resultado, leva contigo o livro <b>"Um café com o Protocolo Bitcoin"</b>:</p>
        <div class="btn-row">${M.bookButtonHTML()}</div>
      `;
      if (won) html += M.prizeSectionHTML();
      html += `<hr class="divider"><div class="btn-row">
        <button class="pixel-btn secondary" id="r_btnAgain">JOGAR OUTRA VEZ</button>
        <button class="pixel-btn" id="r_btnMenu">VOLTAR AO MENU</button>
      </div>`;

      endModalContent.innerHTML = html;
      endOverlay.classList.remove("hidden");
      endModalContent.querySelector("#r_btnAgain").addEventListener("click", () => {
        endOverlay.classList.add("hidden"); resetGame(); state = "playing"; lastTs = null;
      });
      endModalContent.querySelector("#r_btnMenu").addEventListener("click", () => opts.onExit());
      if (won) M.wirePrizeForm(endModalContent, { gameLabel: "A Reconquista", resultText: `${Math.floor(score)} pontos, todas as conquistas` });
    }

    function visHandler() { if (document.hidden) lastTs = null; }
    document.addEventListener("visibilitychange", visHandler);

    fit.layout();
    resetGame();
    drawBackground(0);
    drawKnightHorse(0, 0, false);

    return {
      destroy() {
        if (rafId) cancelAnimationFrame(rafId);
        window.removeEventListener("keydown", keyHandler);
        document.removeEventListener("visibilitychange", visHandler);
        fit.destroy();
        timeouts.forEach(clearTimeout);
      },
    };
  }

  M.registerGame({
    id: "reconquista",
    name: "A Reconquista",
    icon: "🐎",
    playersLabel: "1 jogador",
    desc: "Cavalga com D. Afonso Henriques e conquista o território antes que o reinado termine.",
    init,
  });
})();
