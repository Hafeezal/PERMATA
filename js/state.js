/* PERMATA - state aplikasi & penyimpanan lokal */
(function (global) {
  const P = global.PERMATA = global.PERMATA || {};
  const KEY = 'permata.state.v1';

  function defaultState() {
    return {
      period: '2025/2026',
      facility: 'tbbm-a',
      notifRead: [],
      indicatorStatus: {},
      evidenceStatus: {},
      evidenceDeleted: [],
      uploads: [],
      log: [],
      findings: seedFindings(),
      implementations: [],
      measurements: []
    };
  }

  function seedFindings() {
    return [
      {
        id: 'fnd-seed-1',
        title: 'Penyimpanan limbah B3 tidak tertutup di gudang sementara',
        aspect: 'penerapan',
        location: 'Gudang limbah sementara, area timur',
        description: 'Drum limbah B3 (sludge IPAL) tertumpuk di area terbuka tanpa atap penutup. Berpotensi terjadi rembesan ke tanah saat hujan dan tidak sesuai ketentuan PP 101/2014 tentang pengelolaan limbah B3.',
        date: '2026-06-18',
        photo: { name: 'limbah-b3-gudang.jpg', size: 2145000, type: 'image/jpeg' },
        status: 'in_process',
        reporter: 'Rizky Anggara',
        followups: [
          { note: 'Menyusun jadwal pemindahan drum ke gudang tertutup dan pengadaan atap darurat.', at: '24 Jun 2026, 09.15', by: 'Rizky Anggara' }
        ]
      },
      {
        id: 'fnd-seed-2',
        title: 'Saluran pembuangan air hujan tersumbat di dekat area loading',
        aspect: 'kinerja',
        location: 'Area loading/unloading BBM, titik drainase D-4',
        description: 'Drainase tersumbat sedimen dan oli tumpah, berisiko meluap ke area jalan dan mengarah ke badan air. Perlu pembersihan berkala dan pemasangan oil boom sementara.',
        date: '2026-06-21',
        photo: { name: 'drainase-d4.jpg', size: 1832000, type: 'image/jpeg' },
        status: 'open',
        reporter: 'Siti Rahmawati',
        followups: []
      },
      {
        id: 'fnd-seed-3',
        title: 'Lampu penerangan emergency tangki T-102 mati',
        aspect: 'lainnya',
        location: 'Tangki T-102, area farm tangki',
        description: 'Lampu emergency di tangga akses tangki T-102 tidak menyala saat uji fungsi. Sudah diganti fitting dan diverifikasi menyala kembali pada 23 Jun 2026.',
        date: '2026-06-19',
        photo: { name: 'lampu-emergency-t102.jpg', size: 1568000, type: 'image/jpeg' },
        status: 'closed',
        reporter: 'Rizky Anggara',
        followups: [
          { note: 'Penggantian fitting lampu emergency dan uji fungsi ulang.', at: '23 Jun 2026, 10.40', by: 'Rizky Anggara' },
          { note: 'Tindak lanjut selesai dan tervalidasi', at: '24 Jun 2026, 08.05', by: 'Rizky Anggara' }
        ]
      }
    ];
  }

  let state = load();
  const listeners = [];

  function load() {
    try {
      const raw = global.localStorage.getItem(KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return Object.assign(defaultState(), parsed);
    } catch (err) {
      return defaultState();
    }
  }

  function persist() {
    try {
      global.localStorage.setItem(KEY, JSON.stringify(state));
    } catch (err) {
      /* penyimpanan tidak tersedia (mode privat) - state tetap berjalan di memori */
    }
  }

  function emit(reason) {
    persist();
    listeners.slice().forEach(fn => {
      try { fn(reason, state); } catch (err) { /* listener gagal tidak menghentikan aplikasi */ }
    });
  }

  function get() {
    return state;
  }

  function subscribe(fn) {
    listeners.push(fn);
    return function () {
      const i = listeners.indexOf(fn);
      if (i >= 0) listeners.splice(i, 1);
    };
  }

  function scopeKey(scope) {
    return scope.period + '|' + scope.facility;
  }

  function scope() {
    return { period: state.period, facility: state.facility };
  }

  function setPeriod(period) {
    if (state.period === period) return;
    state.period = period;
    emit('period');
  }

  function setFacility(facility) {
    if (state.facility === facility) return;
    state.facility = facility;
    emit('facility');
  }

  function setFilter(next) {
    let changed = false;
    if (next.period && next.period !== state.period) { state.period = next.period; changed = true; }
    if (next.facility && next.facility !== state.facility) { state.facility = next.facility; changed = true; }
    if (changed) emit('filter');
  }

  function indicatorKey(id) {
    const s = scope();
    return s.period + '|' + s.facility + '|' + id;
  }

  function indicatorOverride(id) {
    return state.indicatorStatus[indicatorKey(id)] || null;
  }

  function setIndicatorStatus(id, status, title) {
    state.indicatorStatus[indicatorKey(id)] = status;
    addLog('memperbarui indikator', title || id);
    emit('indicator');
  }

  function clearIndicatorOverride(id) {
    delete state.indicatorStatus[indicatorKey(id)];
    emit('indicator');
  }

  function setEvidenceStatus(id, status, name) {
    state.evidenceStatus[id] = status;
    const verb = status === 'verified' ? 'menyetujui evidence' : status === 'need_update' ? 'meminta revisi' : 'memperbarui evidence';
    addLog(verb, name || id);
    emit('evidence');
  }

  function deleteEvidence(id, name) {
    if (state.evidenceDeleted.indexOf(id) === -1) state.evidenceDeleted.push(id);
    addLog('menghapus evidence', name || id);
    emit('evidence');
  }

  function addUpload(item) {
    state.uploads.unshift(item);
    addLog('mengunggah', item.name);
    emit('upload');
  }

  function notifReadIds() {
    return state.notifRead || [];
  }

  function markNotifRead(id) {
    if (state.notifRead.indexOf(id) === -1) {
      state.notifRead.push(id);
      emit('notif');
    }
  }

  function markAllNotifRead() {
    const ids = P.data.notifications.map(n => n.id);
    ids.forEach(id => {
      if (state.notifRead.indexOf(id) === -1) state.notifRead.push(id);
    });
    emit('notif');
  }

  function unreadCount() {
    return P.data.notifications.filter(n => n.unread && state.notifRead.indexOf(n.id) === -1).length;
  }

  function addLog(action, detail) {
    state.log.unshift({
      user: P.data.profile.name,
      action: action,
      detail: detail,
      at: '24 Jun 2026, ' + nowClock()
    });
    if (state.log.length > 40) state.log.length = 40;
  }

  function nowClock() {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return h + '.' + m;
  }

  function logEntries() {
    return state.log.length ? state.log : P.data.activityLogSeed();
  }

  /* ---------------- Findings (temuan lapangan) ---------------- */
  function addFinding(item) {
    const finding = Object.assign({
      id: 'fnd-' + Date.now().toString(36) + Math.floor(Math.random() * 999),
      status: 'open',
      followups: [],
      reporter: P.data.profile.name
    }, item);
    state.findings.unshift(finding);
    addLog('melaporkan temuan', item.title);
    emit('finding');
    return finding;
  }

  function setFindingStatus(id, status, note) {
    const f = state.findings.find(x => x.id === id);
    if (!f) return;
    f.status = status;
    f.followups.unshift({ note: note || '', at: '24 Jun 2026, ' + nowClock(), by: P.data.profile.name });
    addLog(status === 'closed' ? 'menutup temuan' : 'memperbarui tindak lanjut temuan', f.title);
    emit('finding');
  }

  function findings() {
    return state.findings;
  }

  /* ---------------- Input penerapan ---------------- */
  function addImplementation(item) {
    const impl = Object.assign({ id: 'imp-' + Date.now().toString(36) }, item);
    state.implementations.unshift(impl);
    addLog('menginput penerapan', item.criterionCode + ' · ' + item.title);
    emit('implementation');
    return impl;
  }

  function implementationsFor(criterionId) {
    const key = scopeKey(scope());
    return state.implementations.filter(i => i.criterionId === criterionId && i.scopeKey === key);
  }

  /* ---------------- Pemantauan lingkungan ---------------- */
  function addMeasurement(item) {
    if (!Array.isArray(state.measurements)) state.measurements = [];
    const m = Object.assign({ id: 'ms-' + Date.now().toString(36), by: P.data.profile.name }, item);
    state.measurements.unshift(m);
    addLog('memperbarui data pemantauan', item.paramName || item.paramId);
    emit('measurement');
    return m;
  }

  function measurements() {
    return Array.isArray(state.measurements) ? state.measurements : [];
  }

  function reset() {
    state = defaultState();
    emit('reset');
  }

  P.state = {
    get,
    subscribe,
    scope,
    scopeKey,
    setPeriod,
    setFacility,
    setFilter,
    indicatorKey,
    indicatorOverride,
    setIndicatorStatus,
    clearIndicatorOverride,
    setEvidenceStatus,
    deleteEvidence,
    addUpload,
    notifReadIds,
    markNotifRead,
    markAllNotifRead,
    unreadCount,
    addLog,
    logEntries,
    addFinding,
    setFindingStatus,
    findings,
    addImplementation,
    implementationsFor,
    addMeasurement,
    measurements,
    reset
  };
})(window);
