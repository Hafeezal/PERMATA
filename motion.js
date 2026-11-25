/* PERMATA - splash logo, animasi pindah menu, dan animasi grafik berulang */
(function (global) {
  const P = global.PERMATA = global.PERMATA || {};
  const SPLASH_MS = 1900;
  const CHART_REPLAY_MS = 14000;

  /* Splash tampil setiap login/refresh */
  function hideSplash() {
    const el = document.getElementById('splash');
    if (!el) return;
    el.classList.add('is-hiding');
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 800);
  }

  function initSplash() {
    const el = document.getElementById('splash');
    if (!el) return;
    const start = Date.now();
    const finish = () => setTimeout(hideSplash, Math.max(0, SPLASH_MS - (Date.now() - start)));
    if (document.readyState === 'complete') finish();
    else global.addEventListener('load', finish);
    setTimeout(hideSplash, 5000); // pengaman
  }

  /* Animasi masuk setiap kali tampilan menu dirender ulang */
  function animateView() {
    const view = document.getElementById('view');
    if (!view) return;
    view.classList.remove('view-enter');
    void view.offsetWidth; // restart animasi
    view.classList.add('view-enter');
  }

  /* Grafik mengulang animasinya secara berkala */
  function replayCharts() {
    if (document.hidden || !P.charts || !P.charts.replay) return;
    P.charts.replay();
  }

  function init() {
    initSplash();
    setInterval(replayCharts, CHART_REPLAY_MS);
  }

  P.motion = { animateView, hideSplash };
  init();
})(window);
