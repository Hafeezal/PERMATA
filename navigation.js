/* PERMATA - Sidebar, Topbar, Notifikasi, dan Hash Router */
(function (global) {
  const P = global.PERMATA = global.PERMATA || {};
  const data = P.data;
  const ui = P.ui;

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Overview', icon: 'layout-dashboard', href: '#/dashboard' },
    { sep: 'MANAJEMEN KEPATUHAN' },
    { id: 'proper', label: 'PROPER Monitoring', icon: 'award', href: '#/proper/kriteria' },
    { id: 'perca', label: 'PERCA', icon: 'scale', href: '#/perca' },
    { id: 'monitoring', label: 'Status Lingkungan Kerja', icon: 'activity', href: '#/monitoring' },
    { id: 'audit', label: 'Tracking Temuan', icon: 'list-checks', href: '#/audit/tracking' },
    { sep: 'KECERDASAN BUATAN (AI)' },
    { id: 'ai', label: 'AI Regulatory (RAG)', icon: 'bot', href: '#/ai' },
    { id: 'predictive', label: 'Predictive AI & Simulasi', icon: 'sparkles', href: '#/predictive' },
    { sep: '' },
    { id: 'klh', label: 'Kunjungi KLH/BPLH', icon: 'external-link', external: 'https://jdih.kemenlh.go.id/dokumen/peraturan-klh-bplh' },
    { id: 'settings', label: 'Pengaturan', icon: 'settings' }
  ];

  const SOON_CONTENT = {
    settings: {
      title: 'Pengaturan',
      heading: 'Konfigurasi Sistem PERMATA',
      icon: 'settings',
      text: 'Pengaturan mencakup master fasilitas PT Pertamina Patra Niaga, konfigurasi kriteria penilaian PROPER dan PERCA, hak akses pengguna, dan preferensi notifikasi.',
      items: ['Master fasilitas dan titik sampling', 'Konfigurasi target ketaatan internal', 'Peran pengguna dan audit log']
    }
  };

  const routeViews = {
    dashboard: {
      title: 'Overview',
      eyebrow: 'DASHBOARD OVERVIEW',
      subtitle: 'Monitoring kinerja pengelolaan lingkungan, PROPER, PERCA, ISO 14001, dan status lingkungan kerja.'
    },
    proper: {
      title: 'PROPER Monitoring',
      eyebrow: 'PROPER MONITORING',
      subtitle: 'Evaluasi kesiapan dan pencapaian 11 kriteria ketaatan dan 7 kelompok beyond compliance.'
    },
    criteria: {
      title: 'Detail Kriteria PROPER',
      eyebrow: 'PROPER / KRITERIA',
      subtitle: 'Deskripsi penilaian, panduan contoh penerapan, bentuk penerapan fasilitas, dan berkas evidence.'
    },
    perca: {
      title: 'PERCA',
      eyebrow: 'PERTAMINA ENVIRONMENTAL RATING',
      subtitle: 'Program Penilaian Peringkat Kinerja Pengelolaan Lingkungan (Pelaksanaan Dokumen, Air, B3, Udara, Pemulihan & Gakkum).'
    },
    monitoring: {
      title: 'Status Lingkungan Kerja',
      eyebrow: 'PEMANTAUAN BAKU MUTU',
      subtitle: 'Parameter kebisingan, air limbah, emisi cerobong, udara ambien, dan lingkungan kerja PT Pertamina Patra Niaga vs BML.'
    },
    audit: {
      title: 'Tracking Temuan Lingkungan',
      eyebrow: 'AUDIT & FINDINGS',
      subtitle: 'Daftar temuan ketidaksesuaian lingkungan dan tindak lanjut status OPEN, PROCESS, CLOSED.'
    },
    ai: {
      title: 'AI Regulatory Assistant (RAG)',
      eyebrow: 'KECERDASAN BUATAN / RAG ENGINE',
      subtitle: 'Tanya jawab cerdas regulasi lingkungan, kriteria PROPER 2025, pedoman PERCA, dan baku mutu terverifikasi.'
    },
    predictive: {
      title: 'Predictive AI & Simulasi Audit',
      eyebrow: 'KECERDASAN BUATAN / AUDIT PREDICTOR',
      subtitle: 'Proyeksi peringkat PROPER & PERCA, simulasi gap regulasi, dan rekomendasi target yang bisa dikejar.'
    }
  };

  let current = null;
  let drawerRoot = null;

  function renderSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    sidebar.innerHTML = `
      <div class="brand">
        <img src="assets/logo-permata.png" alt="Logo PERMATA">
        <span class="brand-tagline">Environmental Management System</span>
      </div>
      <nav class="nav" aria-label="Navigasi utama">
        ${NAV_ITEMS.map(item => navMarkup(item)).join('')}
      </nav>
      <div class="sidebar-footer-note" style="padding:16px;margin-top:auto;font-size:11px;color:var(--slate);line-height:1.4">
        <span>PT Pertamina Patra Niaga</span><br>
        <strong style="color:var(--dark)">PERMATA v1.0.0</strong>
      </div>`;

    sidebar.querySelectorAll('[data-soon]').forEach(btn => {
      btn.addEventListener('click', () => ui.soon(SOON_CONTENT[btn.getAttribute('data-soon')]));
    });
    sidebar.querySelectorAll('a.nav-item').forEach(link => {
      link.addEventListener('click', closeSidebar);
    });
    updateActiveNav();
  }

  function navMarkup(item) {
    if (item.sep !== undefined) {
      return item.sep ? `<div class="nav-sep-label" style="font-size:9.5px;font-weight:700;color:var(--slate-400);padding:14px 16px 4px;letter-spacing:.06em">${item.sep}</div>` : `<div class="nav-sep"></div>`;
    }
    if (item.external) {
      return `<a class="nav-item" href="${item.external}" target="_blank" rel="noopener noreferrer" data-nav="${item.id}" title="Buka JDIH KLH/BPLH di tab baru">${ui.icon(item.icon)}<span>${ui.escapeHtml(item.label)}</span></a>`;
    }
    if (item.href) {
      return `<a class="nav-item" href="${item.href}" data-nav="${item.id}">${ui.icon(item.icon)}<span>${ui.escapeHtml(item.label)}</span></a>`;
    }
    return `<button class="nav-item" type="button" data-soon="${item.id}">${ui.icon(item.icon)}<span>${ui.escapeHtml(item.label)}</span></button>`;
  }

  function updateActiveNav() {
    const map = { dashboard: 'dashboard', proper: 'proper', criteria: 'proper', perca: 'perca', monitoring: 'monitoring', audit: 'audit', ai: 'ai', predictive: 'predictive' };
    const activeId = (current && map[current.view]) || 'dashboard';
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-nav') === activeId);
    });
  }

  function renderTopbar() {
    const topbar = document.getElementById('topbar');
    if (!topbar) return;
    const meta = (current && routeViews[current.view]) || routeViews.dashboard;
    const scope = P.state.scope();
    const unread = P.state.unreadCount();
    topbar.innerHTML = `
      <div class="topbar-inner">
        <button class="icon-btn menu-btn" type="button" id="menuBtn" aria-label="Buka navigasi">${ui.icon('menu')}</button>
        <div class="page-heading">
          <span class="eyebrow">${ui.escapeHtml(meta.eyebrow)}</span>
          <h1>${ui.escapeHtml(meta.title)}</h1>
          <p>${ui.escapeHtml(meta.subtitle)}</p>
        </div>
        <div class="topbar-tools">
          <label class="control">
            ${ui.icon('calendar-days')}
            <select id="periodSelect" aria-label="Filter periode">
              ${data.periods.map(p => `<option value="${p.id}"${p.id === scope.period ? ' selected' : ''}>${p.id} · ${p.status}</option>`).join('')}
            </select>
            ${ui.icon('chevron-down', 'chev')}
          </label>
          <label class="control control--wide">
            ${ui.icon('map-pin')}
            <select id="facilitySelect" aria-label="Filter fasilitas">
              ${data.facilities.map(f => `<option value="${f.id}"${f.id === scope.facility ? ' selected' : ''}>${ui.escapeHtml(f.name)}</option>`).join('')}
            </select>
            ${ui.icon('chevron-down', 'chev')}
          </label>
          <div class="last-updated" title="Waktu pembaruan data terakhir">
            <span class="pulse"></span>
            <div>
              <span>Terakhir diperbarui</span>
              <strong>${data.lastUpdated}</strong>
            </div>
          </div>
          <button class="icon-btn" type="button" id="notifBtn" aria-label="Notifikasi">
            ${ui.icon('bell')}
            ${unread ? `<span class="notif-dot">${unread}</span>` : ''}
          </button>
          <div class="profile-wrap">
            <button class="profile-btn" type="button" id="profileBtn" aria-label="Menu profil">
              ${ui.avatar(data.profile.name)}
              ${ui.icon('chevron-down')}
            </button>
          </div>
        </div>
      </div>`;

    topbar.querySelector('#periodSelect').addEventListener('change', event => {
      P.state.setPeriod(event.target.value);
    });
    topbar.querySelector('#facilitySelect').addEventListener('change', event => {
      P.state.setFacility(event.target.value);
    });
    topbar.querySelector('#notifBtn').addEventListener('click', openNotifications);
    topbar.querySelector('#profileBtn').addEventListener('click', toggleProfileMenu);
    topbar.querySelector('#menuBtn').addEventListener('click', openSidebar);
  }

  function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (!sidebar || !overlay) return;
    sidebar.classList.add('open');
    overlay.classList.add('open');
    overlay.onclick = closeSidebar;
  }

  function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  }

  function toggleProfileMenu(event) {
    event.stopPropagation();
    const wrap = document.querySelector('.profile-wrap');
    if (!wrap) return;
    const existing = wrap.querySelector('.menu');
    if (existing) { existing.remove(); return; }
    const menu = document.createElement('div');
    menu.className = 'menu';
    menu.innerHTML = `
      <div class="menu-head">
        ${ui.avatar(data.profile.name)}
        <div>
          <strong>${ui.escapeHtml(data.profile.name)}</strong>
          <span>${ui.escapeHtml(data.profile.role)} · ${ui.escapeHtml(data.profile.unit)}</span>
        </div>
      </div>
      <button class="menu-item" type="button" data-profile="profile">${ui.icon('user')}Profil Saya</button>
      <button class="menu-item" type="button" data-profile="settings">${ui.icon('settings')}Pengaturan</button>
      <button class="menu-item" type="button" data-profile="reset">${ui.icon('rotate-ccw')}Reset Data Demo</button>
      <button class="menu-item danger" type="button" data-profile="logout">${ui.icon('log-out')}Keluar</button>`;
    wrap.appendChild(menu);
    ui.refreshIcons();

    menu.querySelectorAll('[data-profile]').forEach(item => {
      item.addEventListener('click', () => {
        const action = item.getAttribute('data-profile');
        menu.remove();
        if (action === 'reset') {
          ui.confirm({
            title: 'Reset data demo?',
            text: 'Seluruh input penerapan dan status indikator akan dikembalikan ke kondisi default.',
            confirmLabel: 'Reset',
            danger: true,
            onConfirm: () => {
              P.state.reset();
              ui.toast('Data berhasil dikembalikan ke kondisi awal.');
            }
          });
        } else if (action === 'logout') {
          ui.toast('Mode demo: sesi pengguna tetap aktif.', 'info');
        } else {
          ui.soon(SOON_CONTENT.settings);
        }
      });
    });

    setTimeout(() => {
      const close = ev => {
        if (!menu.contains(ev.target)) {
          menu.remove();
          document.removeEventListener('click', close);
        }
      };
      document.addEventListener('click', close);
    }, 0);
  }

  function openNotifications() {
    closeNotifications();
    const unread = P.state.unreadCount();
    const items = data.notifications.map(n => {
      const isRead = !n.unread || P.state.notifReadIds().indexOf(n.id) >= 0;
      return `
        <button class="notif-item" type="button" data-notif="${n.id}">
          <span class="notif-icon ${n.tone === 'red' ? 'red' : n.tone === 'amber' ? 'amber' : n.tone === 'blue' ? 'blue' : ''}">${ui.icon(n.icon)}</span>
          <span class="notif-copy">
            <strong>${ui.escapeHtml(n.title)}</strong>
            <span>${ui.escapeHtml(n.meta)}<br>${ui.escapeHtml(n.time)}</span>
          </span>
          ${isRead ? '' : '<span class="unread"></span>'}
        </button>`;
    }).join('');

    drawerRoot = document.createElement('div');
    drawerRoot.innerHTML = `
      <div class="drawer-overlay" data-close-drawer></div>
      <aside class="drawer" aria-label="Notifikasi">
        <div class="drawer-head">
          <div>
            <h3>Notifikasi</h3>
            <p class="panel-sub">${unread} belum dibaca</p>
          </div>
          <button class="icon-btn" type="button" data-close-drawer aria-label="Tutup">${ui.icon('x')}</button>
        </div>
        <div class="drawer-body">
          <div class="notif-list">${items}</div>
        </div>
      </aside>`;
    document.body.appendChild(drawerRoot);
    document.body.classList.add('no-scroll');
    ui.refreshIcons();

    drawerRoot.querySelectorAll('[data-close-drawer]').forEach(el => {
      el.addEventListener('click', closeNotifications);
    });
    drawerRoot.querySelectorAll('[data-notif]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-notif');
        const notif = data.notifications.find(n => n.id === id);
        P.state.markNotifRead(id);
        closeNotifications();
        if (notif && notif.route) {
          location.hash = notif.route;
        }
      });
    });
  }

  function closeNotifications() {
    if (!drawerRoot) return;
    drawerRoot.remove();
    drawerRoot = null;
    document.body.classList.remove('no-scroll');
  }

  function parseRoute() {
    const raw = location.hash || '#/dashboard';
    const clean = raw.split('?')[0];
    if (clean === '#/dashboard' || clean === '' || clean === '#') {
      return { view: 'dashboard', params: {} };
    }
    const properMatch = clean.match(/^#\/proper\/(kriteria|evidence|riwayat)$/);
    if (properMatch) return { view: 'proper', params: { tab: properMatch[1] } };
    
    // Support #/criteria/:id dan #/criteria/:group/:id
    const critMatch = clean.match(/^#\/criteria(?:\/(compliance|beyond))?\/([a-z0-9-]+)$/);
    if (critMatch) return { view: 'criteria', params: { group: critMatch[1], id: critMatch[2] } };

    // Support #/perca dan #/perca/:id
    const percaMatch = clean.match(/^#\/perca(?:\/([a-z0-9-]+))?$/);
    if (percaMatch) return { view: 'perca', params: { id: percaMatch[1] || null } };

    // Support #/monitoring (Status Lingkungan Kerja)
    if (clean === '#/monitoring') return { view: 'monitoring', params: {} };

    // Support #/ai (AI Regulatory RAG)
    if (clean === '#/ai') return { view: 'ai', params: {} };

    // Support #/predictive (Predictive AI & Simulasi)
    if (clean === '#/predictive') return { view: 'predictive', params: {} };

    // Support #/audit (Tracking Temuan)
    const auditMatch = clean.match(/^#\/audit\/(upload|tracking)$/);
    if (auditMatch) return { view: 'audit', params: { tab: auditMatch[1] } };
    if (clean === '#/audit') return { view: 'audit', params: { tab: 'tracking' } };

    return { view: 'dashboard', params: {} };
  }

  function renderView() {
    const viewEl = document.getElementById('view');
    if (!viewEl) return;
    P.charts.destroyAll();
    current = parseRoute();
    const module = P.views[current.view] || P.views.dashboard;
    const scope = P.state.scope();
    const ctx = Object.assign({ scope }, current.params);
    viewEl.innerHTML = module.render(ctx);
    if (typeof module.mount === 'function') {
      module.mount(viewEl, ctx);
    }
    ui.refreshIcons();
    updateActiveNav();
    if (P.motion) P.motion.animateView();
    const meta = routeViews[current.view] || routeViews.dashboard;
    document.title = 'PERMATA · ' + meta.title;
  }

  function renderAll() {
    renderSidebar();
    renderTopbar();
    renderView();
    ui.refreshIcons();
  }

  function navigate(hash) {
    if (location.hash === hash) {
      renderView();
    } else {
      location.hash = hash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function init() {
    if (!location.hash) history.replaceState(null, '', '#/dashboard');
    current = parseRoute();
    renderAll();

    window.addEventListener('hashchange', () => {
      closeSidebar();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      renderView();
      renderTopbar();
      ui.refreshIcons();
    });

    P.state.subscribe(reason => {
      if (reason === 'notif') {
        renderTopbar();
        ui.refreshIcons();
        return;
      }
      renderTopbar();
      renderView();
      ui.refreshIcons();
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeNotifications();
        closeSidebar();
        const menu = document.querySelector('.profile-wrap .menu');
        if (menu) menu.remove();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024) closeSidebar();
    });
  }

  P.nav = {
    init,
    renderAll,
    renderView,
    navigate,
    SOON_CONTENT
  };
})(window);
