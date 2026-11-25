/* PERMATA - bootstrap aplikasi */
(function (global) {
  const P = global.PERMATA = global.PERMATA || {};

  function boot() {
    if (!global.Chart) {
      console.warn('PERMATA: Chart.js tidak termuat, grafik tidak akan tampil.');
    }
    P.nav.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window);
