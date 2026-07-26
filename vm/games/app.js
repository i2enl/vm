/* ============================================================
   TORNEIO MEDIEVAL — hub principal.
   Constrói o menu e faz a gestão de navegação entre jogos.
   ============================================================ */
(function () {
  "use strict";
  const M = window.Medieval;

  const app = document.getElementById("app");
  app.innerHTML = `
    <div id="topbar">
      <div id="topbarTitle">⚔ TORNEIO MEDIEVAL</div>
      <div id="topbarBtns">
        <button id="muteBtnGlobal" class="icon-btn" aria-label="Som">🔊</button>
        <button id="installBtnGlobal" class="icon-btn" aria-label="Instalar" style="display:none;">⬇</button>
      </div>
    </div>
    <div id="gameRoot"></div>
  `;

  const gameRoot = document.getElementById("gameRoot");
  const muteBtn = document.getElementById("muteBtnGlobal");
  const installBtn = document.getElementById("installBtnGlobal");

  muteBtn.addEventListener("click", () => {
    M.setMuted(!M.isMuted());
    muteBtn.textContent = M.isMuted() ? "🔇" : "🔊";
  });

  /* ---------------- PWA ---------------- */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(() => {}); });
  }
  let deferredInstallPrompt = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    installBtn.style.display = "inline-block";
  });
  installBtn.addEventListener("click", () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.finally(() => {
      deferredInstallPrompt = null;
      installBtn.style.display = "none";
    });
  });
  window.addEventListener("appinstalled", () => { installBtn.style.display = "none"; });

  /* ---------------- NAVEGAÇÃO ---------------- */
  let currentGame = null; // { destroy() }

  function teardownCurrent() {
    if (currentGame && typeof currentGame.destroy === "function") {
      try { currentGame.destroy(); } catch (e) {}
    }
    currentGame = null;
  }

  function showMenu() {
    teardownCurrent();
    gameRoot.innerHTML = `
      <div id="menuWrap">
        <div class="flagbig" id="menuFlag"></div>
        <h1 class="menu-title">TORNEIO MEDIEVAL</h1>
        <p class="menu-sub">Quatro provas. Um reino por conquistar. Joga sozinho ou desafia os teus amigos em duelos 2 a 2.</p>
        <div id="gameCards"></div>
        <a class="pixel-btn secondary" href="${M.TRIP_URL}" target="_blank" rel="noopener" id="tripLink">🗺 SITE OFICIAL DA VIAGEM MEDIEVAL</a>
        <p class="small-note menu-foot">Em qualquer prova: joga, e leva sempre contigo o livro <b>"Um café com o Protocolo Bitcoin"</b>. Alcança o Feito Real e ganha ${M.PRIZE_BTC}.</p>
      </div>
    `;
    const cardsEl = document.getElementById("gameCards");
    M.games.forEach((g) => {
      const card = document.createElement("button");
      card.className = "game-card pixel-panel";
      card.innerHTML = `
        <span class="game-card-icon">${g.icon}</span>
        <span class="game-card-name">${g.name}</span>
        <span class="game-card-players">${g.playersLabel}</span>
        <span class="game-card-desc">${g.desc}</span>
        ${g.isEducational ? '<span class="game-card-edu">📚 Sem prémios — apenas educativo</span>' : ""}
      `;
      card.addEventListener("click", () => launchGame(g));
      cardsEl.appendChild(card);
    });
  }

  function launchGame(g) {
    teardownCurrent();
    gameRoot.innerHTML = "";
    currentGame = g.init(gameRoot, { onExit: showMenu });
  }

  showMenu();
})();
