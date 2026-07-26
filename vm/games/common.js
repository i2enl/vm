/* ============================================================
   MEDIEVAL — utilitários partilhados por todos os jogos.
   ============================================================ */
window.Medieval = (function () {
  "use strict";

  const BOOK_URL = "https://jorgefiliperibeiro.com/i2eonline/btcbook.pdf";
  const PRIZE_EMAIL = "jfrmarket@gmail.com";
  const PRIZE_BTC = "0.00002 BTC (2000 SATS)";
  const TRIP_URL = "https://www.viagemmedieval.com/";

  const PLAYER_COLORS = [
    { hex: "#1e3a5f", name: "Azul" },
    { hex: "#7a1e1e", name: "Vermelho" },
    { hex: "#4c5b32", name: "Verde" },
    { hex: "#c9972b", name: "Dourado" },
  ];

  /* ---------------- ÁUDIO SINTETIZADO ---------------- */
  let audioCtx = null;
  let muted = false;
  function ensureAudio() {
    if (audioCtx) return audioCtx;
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (e) { audioCtx = null; }
    return audioCtx;
  }
  function tone(freq, dur, type, gainStart, delay) {
    if (muted) return;
    const ac = ensureAudio();
    if (!ac) return;
    const t0 = ac.currentTime + (delay || 0);
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type || "square";
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(gainStart || 0.08, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }
  const sfx = {
    tap: () => tone(700, 0.05, "square", 0.05),
    jump: () => tone(520, 0.09, "square", 0.06),
    hit: () => { tone(120, 0.25, "sawtooth", 0.12); tone(80, 0.3, "square", 0.08, 0.05); },
    coin: () => { tone(880, 0.07, "square", 0.05); tone(1180, 0.08, "square", 0.05, 0.06); },
    good: () => tone(1400, 0.06, "triangle", 0.05),
    bad: () => tone(160, 0.14, "sawtooth", 0.09),
    conquest: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.18, "square", 0.07, i * 0.09)); },
    win: () => { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.16, "square", 0.07, i * 0.08)); },
    lose: () => { [400, 300, 220].forEach((f, i) => tone(f, 0.28, "sawtooth", 0.08, i * 0.14)); },
    countdown: () => tone(440, 0.08, "square", 0.06),
    go: () => tone(880, 0.15, "square", 0.09),
  };
  function vibrate(pattern) {
    if (navigator.vibrate) { try { navigator.vibrate(pattern); } catch (e) {} }
  }
  function isMuted() { return muted; }
  function setMuted(v) { muted = v; }

  /* ---------------- ESCALA VISUAL (contain-fit, letterboxed) ---------------- */
  function fitCanvas(canvas, wrapEl, logicalW, logicalH) {
    canvas.width = logicalW;
    canvas.height = logicalH;
    function layout() {
      const availW = wrapEl.clientWidth || window.innerWidth;
      const availH = wrapEl.clientHeight || window.innerHeight;
      const scale = Math.max(0.1, Math.min(availW / logicalW, availH / logicalH));
      canvas.style.width = Math.floor(logicalW * scale) + "px";
      canvas.style.height = Math.floor(logicalH * scale) + "px";
    }
    layout();
    setTimeout(layout, 60);
    setTimeout(layout, 300);
    const onResize = () => layout();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", () => setTimeout(layout, 50));
    let ro = null;
    if (window.ResizeObserver) { ro = new ResizeObserver(layout); ro.observe(wrapEl); }
    return {
      layout,
      destroy() {
        window.removeEventListener("resize", onResize);
        if (ro) ro.disconnect();
      },
    };
  }

  /* ---------------- BOTÃO DE LIVRO (sempre presente) ---------------- */
  function bookButtonHTML() {
    return `<a class="pixel-btn gold" href="${BOOK_URL}" target="_blank" rel="noopener" download>DESCARREGAR O LIVRO (PDF)</a>`;
  }

  /* ---------------- FORMULÁRIO DE PRÉMIO (reutilizável, isolado por contentor) ---------------- */
  function prizeSectionHTML(playerLabel) {
    return `
      <hr class="divider">
      <h2>Prémio em Bitcoin${playerLabel ? " — " + playerLabel : ""}</h2>
      <p>Ganhaste <b>${PRIZE_BTC}</b>! Escolhe a rede para receberes o prémio:</p>
      <div class="choice-row">
        <button type="button" class="pixel-btn secondary btnLightning">⚡ LIGHTNING</button>
        <button type="button" class="pixel-btn secondary btnLiquid">💧 LIQUID</button>
      </div>
      <div class="networkInstructions"></div>
      <div class="field">
        <label>O teu email</label>
        <input class="fEmail" type="email" placeholder="nome@email.com">
      </div>
      <div class="field">
        <label class="fWalletLabel">Endereço / fatura da carteira</label>
        <input class="fWallet" type="text" placeholder="Escolhe primeiro a rede acima">
      </div>
      <div class="field">
        <label>Data de nascimento</label>
        <input class="fDob" type="date">
      </div>
      <p class="small-note">Não guardamos estes dados — são apenas enviados por email para validação e envio manual do prémio.</p>
      <div class="btn-row">
        <button type="button" class="pixel-btn btnSendPrize" disabled>ENVIAR PEDIDO DE PRÉMIO POR EMAIL</button>
      </div>
      <p class="small-note sendWarning"></p>
    `;
  }

  function wirePrizeForm(container, meta) {
    // meta: { gameLabel, resultText, playerLabel }
    let network = null;
    const btnL = container.querySelector(".btnLightning");
    const btnQ = container.querySelector(".btnLiquid");
    const instrBox = container.querySelector(".networkInstructions");
    const walletInput = container.querySelector(".fWallet");
    const walletLabel = container.querySelector(".fWalletLabel");
    const sendBtn = container.querySelector(".btnSendPrize");
    const warning = container.querySelector(".sendWarning");
    const emailInput = container.querySelector(".fEmail");
    const dobInput = container.querySelector(".fDob");
    if (!btnL) return;

    function selectNetwork(n) {
      network = n;
      btnL.classList.toggle("active", n === "lightning");
      btnQ.classList.toggle("active", n === "liquid");
      instrBox.classList.add("show");
      if (n === "lightning") {
        walletLabel.textContent = "Fatura ou endereço Lightning";
        walletInput.placeholder = "lnbc... ou endereço tipo email";
        instrBox.innerHTML = `<b>Rede Lightning</b><ul>
          <li>Instala uma carteira: Wallet of Satoshi, Phoenix ou Muun.</li>
          <li>Gera uma fatura ou usa o teu endereço Lightning tipo email.</li>
          <li>Cola aqui esse endereço/fatura.</li></ul>`;
      } else {
        walletLabel.textContent = "Endereço Liquid (L-BTC)";
        walletInput.placeholder = "endereço Liquid (VJL... ou lq1...)";
        instrBox.innerHTML = `<b>Rede Liquid</b><ul>
          <li>Instala uma carteira: Blockstream Green ou Aqua.</li>
          <li>Cria uma carteira Liquid e copia o endereço de receção (L-BTC).</li>
          <li>Cola aqui esse endereço.</li></ul>`;
      }
      validate();
    }
    btnL.addEventListener("click", () => selectNetwork("lightning"));
    btnQ.addEventListener("click", () => selectNetwork("liquid"));

    function validate() {
      const email = emailInput.value.trim();
      const wallet = walletInput.value.trim();
      const dob = dobInput.value;
      const ok = network && email.includes("@") && wallet.length > 4 && dob;
      sendBtn.disabled = !ok;
      return ok;
    }
    emailInput.addEventListener("input", validate);
    dobInput.addEventListener("input", validate);
    walletInput.addEventListener("input", validate);

    sendBtn.addEventListener("click", () => {
      if (!validate()) { warning.textContent = "Preenche a rede, email, carteira e data de nascimento."; return; }
      const email = emailInput.value.trim();
      const wallet = walletInput.value.trim();
      const dob = dobInput.value;
      const subject = encodeURIComponent(`Prémio - ${meta.gameLabel || "Torneio Medieval"}`);
      const body = encodeURIComponent(
        `Vitória no jogo "${meta.gameLabel || ""}".\n` +
        (meta.playerLabel ? `Jogador: ${meta.playerLabel}\n` : "") +
        `Resultado: ${meta.resultText || ""}\n\n` +
        `Rede escolhida: ${network === "lightning" ? "Lightning Network" : "Liquid Network"}\n` +
        `Endereço/fatura: ${wallet}\n` +
        `Email do jogador: ${email}\n` +
        `Data de nascimento: ${dob}\n`
      );
      window.location.href = `mailto:${PRIZE_EMAIL}?subject=${subject}&body=${body}`;
      warning.textContent = "A abrir a app de email... se nada acontecer, envia manualmente os dados acima para " + PRIZE_EMAIL;
    });
  }

  /* ---------------- PARTÍCULAS (genérico, usado por qualquer jogo) ---------------- */
  function createParticleSystem() {
    let particles = [];
    let floaters = [];
    return {
      burst(x, y, color, count, spread) {
        for (let i = 0; i < count; i++) {
          const ang = Math.random() * Math.PI * 2;
          const spd = 20 + Math.random() * (spread || 60);
          particles.push({ x, y, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd - 30, life: 0.4 + Math.random() * 0.4, maxLife: 0.7, color, size: 2 + Math.random() * 2 });
        }
      },
      floater(x, y, text, color) { floaters.push({ x, y, text, color, life: 0.9, vy: -34 }); },
      update(dt) {
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 220 * dt; p.life -= dt;
          if (p.life <= 0) particles.splice(i, 1);
        }
        for (let i = floaters.length - 1; i >= 0; i--) {
          const f = floaters[i];
          f.y += f.vy * dt; f.life -= dt;
          if (f.life <= 0) floaters.splice(i, 1);
        }
      },
      draw(ctx, pxFn) {
        particles.forEach((p) => {
          ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
          ctx.fillStyle = p.color;
          ctx.fillRect(pxFn(p.x), pxFn(p.y), p.size, p.size);
        });
        ctx.globalAlpha = 1;
        floaters.forEach((f) => {
          ctx.globalAlpha = Math.max(0, f.life / 0.9);
          ctx.fillStyle = f.color;
          ctx.font = "9px 'Press Start 2P', monospace";
          ctx.fillText(f.text, pxFn(f.x), pxFn(f.y));
        });
        ctx.globalAlpha = 1;
      },
      clear() { particles = []; floaters = []; },
    };
  }

  /* ---------------- TORNEIO (duelos 2 a 2) ----------------
     Com 2 jogadores: um único duelo.
     Com 3 jogadores: duelo 1 vs 2, depois o vencedor defronta o 3.
     Com 4 jogadores: meias-finais (1v2 e 3v4) e depois a final. */
  function createTournament(n, players) {
    let queue, idx = 0, semiWinners = [];
    if (n === 2) queue = [[players[0], players[1]]];
    else if (n === 3) queue = [[players[0], players[1]]];
    else queue = [[players[0], players[1]], [players[2], players[3]]];
    const history = [];
    return {
      current() { return queue[idx] || null; },
      matchLabel() {
        if (n === 2) return "Final";
        if (n === 3) return idx === 0 ? "Duelo 1" : "Final";
        return idx < 2 ? `Meia-final ${idx + 1}` : "Final";
      },
      reportWinner(winner, loser) {
        history.push({ a: queue[idx][0], b: queue[idx][1], winner, loser });
        idx += 1;
        if (n === 3 && idx === 1) queue.push([winner, players[2]]);
        if (n === 4 && idx <= 2) {
          semiWinners.push(winner);
          if (idx === 2) queue.push([semiWinners[0], semiWinners[1]]);
        }
      },
      isDone() { return idx >= queue.length; },
      history,
      champion() { return history.length ? history[history.length - 1].winner : null; },
    };
  }

  /* ---------------- ECRÃ DE CONFIGURAÇÃO DE JOGADORES (reutilizável) ---------------- */
  function buildPlayerSetupScreen(root, opts) {
    // opts: { hudLabel, title, introHTML, minPlayers, maxPlayers, startLabel, hint, onBack, onStart(count, names) }
    const min = opts.minPlayers || 2;
    const max = opts.maxPlayers || 4;
    let count = min;
    let names = ["Jogador 1", "Jogador 2", "Jogador 3", "Jogador 4"];

    function render() {
      const opts_list = [];
      for (let n = min; n <= max; n++) opts_list.push(n);
      root.innerHTML = `
        <div class="hud">
          <div class="mini-flag"></div>
          <div class="hud-block"><span class="hud-label">${opts.hudLabel || ""}</span></div>
          <button class="backBtn" id="ps_btnBack">MENU</button>
        </div>
        <div class="screen-center">
          <div class="modal pixel-panel">
            <h1>${opts.title}</h1>
            ${opts.introHTML || ""}
            <p class="small-note">Quantos jogadores?</p>
            <div class="player-count-row" id="ps_countRow"></div>
            <div id="ps_namesWrap"></div>
            ${opts.hint ? `<p class="small-note">${opts.hint}</p>` : ""}
            <div class="btn-row">
              <button class="pixel-btn" id="ps_btnGo">${opts.startLabel || "COMEÇAR"}</button>
            </div>
          </div>
        </div>
      `;
      const countRow = root.querySelector("#ps_countRow");
      opts_list.forEach((n) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "pixel-btn" + (n === count ? " active" : "") + " secondary";
        b.textContent = n + " jogadores";
        b.addEventListener("click", () => { count = n; render(); });
        countRow.appendChild(b);
      });
      const namesWrap = root.querySelector("#ps_namesWrap");
      for (let i = 0; i < count; i++) {
        const row = document.createElement("div");
        row.className = "player-name-field";
        row.innerHTML = `<span class="swatch" style="background:${PLAYER_COLORS[i].hex}"></span>
          <input type="text" maxlength="14" value="${names[i]}" data-idx="${i}">`;
        row.querySelector("input").addEventListener("input", (e) => {
          const idx = Number(e.target.dataset.idx);
          names[idx] = e.target.value.trim() || `Jogador ${idx + 1}`;
        });
        namesWrap.appendChild(row);
      }
      root.querySelector("#ps_btnBack").addEventListener("click", () => opts.onBack());
      root.querySelector("#ps_btnGo").addEventListener("click", () => opts.onStart(count, names.slice(0, count)));
    }
    render();
  }


  const games = [];
  function registerGame(def) { games.push(def); }

  return {
    BOOK_URL, PRIZE_EMAIL, PRIZE_BTC, TRIP_URL, PLAYER_COLORS,
    ensureAudio, tone, sfx, vibrate, isMuted, setMuted,
    fitCanvas, bookButtonHTML, prizeSectionHTML, wirePrizeForm,
    createParticleSystem, createTournament, buildPlayerSetupScreen,
    registerGame, games,
  };
})();
