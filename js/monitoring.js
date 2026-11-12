/* PERMATA - Pemantauan Lingkungan (status parameter lingkungan kerja vs BML) */
(function (global) {
  const P = global.PERMATA = global.PERMATA || {};
  const data = P.data;
  const ui = P.ui;

  const CATEGORIES = [
    { id: 'noise', label: 'Kebisingan', short: 'Kebisingan', icon: 'volume-2' },
    { id: 'water', label: 'Air Limbah', short: 'Air Limbah', icon: 'droplets' },
    { id: 'emission', label: 'Emisi Sumber Tidak Bergerak', short: 'Emisi Genset', icon: 'factory' },
    { id: 'ambient', label: 'Udara Ambien & Kebauan', short: 'Udara Ambien', icon: 'wind' },
    { id: 'workplace', label: 'Lingkungan Kerja (Area Operasi)', short: 'Area Kerja', icon: 'hard-hat' }
  ];

  /* type: max = tidak boleh melebihi, min = tidak boleh kurang, range = rentang */
  const PARAMS = [
    { id: 'n1', cat: 'noise', name: 'Kebisingan lingkungan (batas pagar)', unit: 'dBA', type: 'max', bml: 70, loc: 'Pagar sisi utara', ref: 'KepMenLH 48/1996 (kawasan industri)',
      seed: [{ date: '2025-12-10', value: 63.4 }, { date: '2026-05-20', value: 61.8 }] },
    { id: 'n2', cat: 'noise', name: 'Kebisingan area pompa & genset', unit: 'dBA', type: 'max', bml: 85, loc: 'Rumah pompa', ref: 'Permenaker 5/2018 (NAB 8 jam/hari)',
      seed: [{ date: '2025-12-10', value: 83.1 }, { date: '2026-05-20', value: 82.6 }] },

    { id: 'w1', cat: 'water', name: 'pH (outlet OWS)', unit: '-', type: 'range', min: 6, max: 9, loc: 'Outlet OWS', ref: 'Permen LH 19/2010 (depot/terminal minyak)',
      seed: [{ date: '2026-04-28', value: 7.4 }, { date: '2026-05-28', value: 7.2 }] },
    { id: 'w2', cat: 'water', name: 'Minyak & lemak (outlet OWS)', unit: 'mg/L', type: 'max', bml: 25, loc: 'Outlet OWS', ref: 'Permen LH 19/2010 (depot/terminal minyak)',
      seed: [{ date: '2026-04-28', value: 6.8 }, { date: '2026-05-28', value: 8.1 }] },
    { id: 'w3', cat: 'water', name: 'TOC (outlet OWS)', unit: 'mg/L', type: 'max', bml: 110, loc: 'Outlet OWS', ref: 'Permen LH 19/2010 (depot/terminal minyak)',
      seed: [{ date: '2026-04-28', value: 42 }, { date: '2026-05-28', value: 38 }] },
    { id: 'w4', cat: 'water', name: 'COD (air limbah domestik)', unit: 'mg/L', type: 'max', bml: 100, loc: 'Outlet STP kantor', ref: 'Baku mutu air limbah domestik',
      seed: [{ date: '2026-04-28', value: 71 }, { date: '2026-05-28', value: 84 }] },
    { id: 'w5', cat: 'water', name: 'BOD (air limbah domestik)', unit: 'mg/L', type: 'max', bml: 30, loc: 'Outlet STP kantor', ref: 'Baku mutu air limbah domestik',
      seed: [{ date: '2026-04-28', value: 19 }, { date: '2026-05-28', value: 22 }] },
    { id: 'w6', cat: 'water', name: 'TSS (air limbah domestik)', unit: 'mg/L', type: 'max', bml: 30, loc: 'Outlet STP kantor', ref: 'Baku mutu air limbah domestik',
      seed: [{ date: '2026-04-28', value: 14 }, { date: '2026-05-28', value: 17 }] },
    { id: 'w7', cat: 'water', name: 'Amonia / NH3-N (domestik)', unit: 'mg/L', type: 'max', bml: 10, loc: 'Outlet STP kantor', ref: 'Baku mutu air limbah domestik',
      seed: [{ date: '2026-04-28', value: 4.2 }, { date: '2026-05-28', value: 5.6 }] },
    { id: 'w8', cat: 'water', name: 'Debit air limbah domestik', unit: 'm³/hari', type: 'max', bml: 12, loc: 'Outlet STP kantor', ref: 'Persetujuan Teknis fasilitas',
      seed: [{ date: '2026-04-28', value: 7.9 }, { date: '2026-05-28', value: 8.3 }] },

    { id: 'e1', cat: 'emission', name: 'CO (cerobong genset)', unit: 'mg/Nm³', type: 'max', bml: 600, loc: 'Genset 500 kVA', ref: 'Persetujuan Teknis emisi / Permen LHK 11/2021',
      seed: [{ date: '2025-11-18', value: 214 }, { date: '2026-05-18', value: 236 }] },
    { id: 'e2', cat: 'emission', name: 'NO2 (cerobong genset)', unit: 'mg/Nm³', type: 'max', bml: 1000, loc: 'Genset 500 kVA', ref: 'Persetujuan Teknis emisi / Permen LHK 11/2021',
      seed: [{ date: '2025-11-18', value: 612 }, { date: '2026-05-18', value: 648 }] },
    { id: 'e3', cat: 'emission', name: 'SO2 (cerobong genset)', unit: 'mg/Nm³', type: 'max', bml: 800, loc: 'Genset 500 kVA', ref: 'Persetujuan Teknis emisi / Permen LHK 11/2021',
      seed: [{ date: '2025-11-18', value: 96 }, { date: '2026-05-18', value: 88 }] },
    { id: 'e4', cat: 'emission', name: 'Partikulat (cerobong genset)', unit: 'mg/Nm³', type: 'max', bml: 150, loc: 'Genset 500 kVA', ref: 'Persetujuan Teknis emisi / Permen LHK 11/2021',
      seed: [{ date: '2025-11-18', value: 48 }, { date: '2026-05-18', value: 52 }] },
    { id: 'e5', cat: 'emission', name: 'Opasitas (cerobong genset)', unit: '%', type: 'max', bml: 20, loc: 'Genset 500 kVA', ref: 'Persetujuan Teknis emisi / Permen LHK 11/2021',
      seed: [{ date: '2025-11-18', value: 9 }, { date: '2026-05-18', value: 11 }] },

    { id: 'a1', cat: 'ambient', name: 'SO2 udara ambien (1 jam)', unit: 'µg/Nm³', type: 'max', bml: 150, loc: 'Ambien titik UA-1', ref: 'PP 22/2021 Lampiran VII',
      seed: [{ date: '2025-12-12', value: 21 }, { date: '2026-05-22', value: 24 }] },
    { id: 'a2', cat: 'ambient', name: 'NO2 udara ambien (1 jam)', unit: 'µg/Nm³', type: 'max', bml: 200, loc: 'Ambien titik UA-1', ref: 'PP 22/2021 Lampiran VII',
      seed: [{ date: '2025-12-12', value: 38 }, { date: '2026-05-22', value: 41 }] },
    { id: 'a3', cat: 'ambient', name: 'PM10 (24 jam)', unit: 'µg/Nm³', type: 'max', bml: 75, loc: 'Ambien titik UA-1', ref: 'PP 22/2021 Lampiran VII',
      seed: [{ date: '2025-12-12', value: 44 }, { date: '2026-05-22', value: 49 }] },
    { id: 'a4', cat: 'ambient', name: 'Hidrokarbon / NMHC (3 jam)', unit: 'µg/Nm³', type: 'max', bml: 160, loc: 'Ambien dekat filling shed', ref: 'PP 22/2021 Lampiran VII',
      seed: [{ date: '2025-12-12', value: 118 }, { date: '2026-05-22', value: 137 }] },
    { id: 'a5', cat: 'ambient', name: 'H2S (kebauan)', unit: 'ppm', type: 'max', bml: 0.02, loc: 'Batas pagar sisi OWS', ref: 'KepMenLH 50/1996 (baku tingkat kebauan)',
      seed: [{ date: '2025-12-12', value: 0.006 }, { date: '2026-05-22', value: 0.008 }] },

    { id: 'k1', cat: 'workplace', name: 'H2S area kerja', unit: 'ppm', type: 'max', bml: 1, loc: 'Area OWS & sump pit', ref: 'Permenaker 5/2018 (NAB)',
      seed: [{ date: '2026-03-15', value: 0.2 }, { date: '2026-06-10', value: 0.3 }] },
    { id: 'k2', cat: 'workplace', name: 'Benzena (uap BBM)', unit: 'ppm', type: 'max', bml: 0.5, loc: 'Filling shed', ref: 'Permenaker 5/2018 (NAB)',
      seed: [{ date: '2026-03-15', value: 0.18 }, { date: '2026-06-10', value: 0.21 }] },
    { id: 'k3', cat: 'workplace', name: 'Pencahayaan ruang kontrol', unit: 'lux', type: 'min', bml: 300, loc: 'Control room', ref: 'Permenaker 5/2018',
      seed: [{ date: '2026-03-15', value: 410 }, { date: '2026-06-10', value: 395 }] },
    { id: 'k4', cat: 'workplace', name: 'Iklim kerja (ISBB)', unit: '°C', type: 'max', bml: 31, loc: 'Area loading', ref: 'Permenaker 5/2018 (beban kerja ringan)',
      seed: [{ date: '2026-03-15', value: 28.4 }, { date: '2026-06-10', value: 29.1 }] }
  ];

  let catFilter = 'all';

  function param(id) { return PARAMS.find(p => p.id === id); }

  function history(p) {
    const user = (P.state && P.state.measurements ? P.state.measurements() : [])
      .filter(m => m.paramId === p.id)
      .map(m => ({ date: m.date, value: Number(m.value), loc: m.loc, lab: m.lab, note: m.note, user: true }));
    return p.seed.map(s => Object.assign({ loc: p.loc, lab: 'Laboratorium terakreditasi KAN' }, s))
      .concat(user)
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  function latest(p) { return history(p)[0]; }

  function bmlText(p) {
    if (p.type === 'range') return p.min + ' – ' + p.max;
    if (p.type === 'min') return '≥ ' + fmt(p.bml);
    return '≤ ' + fmt(p.bml);
  }

  function fmt(v) {
    return Number(v).toLocaleString('id-ID', { maximumFractionDigits: 3 });
  }

  /* Rasio pemakaian BML (%) - makin besar makin dekat/melewati batas */
  function ratio(p, value) {
    if (p.type === 'range') {
      const mid = (p.min + p.max) / 2;
      const half = (p.max - p.min) / 2;
      return Math.round((Math.abs(value - mid) / half) * 100);
    }
    if (p.type === 'min') return Math.round((p.bml / Math.max(value, 0.0001)) * 100);
    return Math.round((value / p.bml) * 100);
  }

  function status(p, value) {
    const r = ratio(p, value);
    if (r > 100) return { key: 'over', label: 'Melebihi BML', tone: 'red' };
    if (r >= 80) return { key: 'near', label: 'Mendekati BML', tone: 'amber' };
    return { key: 'ok', label: 'Memenuhi', tone: 'green' };
  }

  function summary() {
    const out = { total: PARAMS.length, ok: 0, near: 0, over: 0 };
    PARAMS.forEach(p => { out[status(p, latest(p).value).key] += 1; });
    return out;
  }

  /* Untuk grafik Overview: rasio tertinggi per kategori */
  function categorySummary() {
    return CATEGORIES.map(c => {
      const list = PARAMS.filter(p => p.cat === c.id);
      const max = Math.max.apply(null, list.map(p => ratio(p, latest(p).value)));
      return { label: c.short, pct: max };
    });
  }

  function render(ctx) {
    const s = summary();
    const list = PARAMS.filter(p => catFilter === 'all' || p.cat === catFilter);
    const cats = CATEGORIES.filter(c => catFilter === 'all' || c.id === catFilter);

    return `
      <div class="mon-stats">
        ${stat('Total parameter', s.total, '')}
        ${stat('Memenuhi', s.ok, 'green')}
        ${stat('Mendekati BML (≥ 80%)', s.near, 'amber')}
        ${stat('Melebihi BML', s.over, 'red')}
      </div>

      <section class="panel" style="margin-top:16px">
        <div class="panel-head">
          <div>
            <div class="panel-title">${ui.icon('activity')}Hasil Pengukuran Terakhir vs Baku Mutu</div>
            <div class="panel-sub">${data.facilityName(ctx.scope.facility)} · nilai BML mengacu regulasi umum, sesuaikan dengan persetujuan teknis fasilitas.</div>
          </div>
          <button class="btn btn--primary btn--sm" type="button" data-mon-update>${ui.icon('plus')}Update Data</button>
        </div>

        <div class="mon-chips">
          <button class="mon-chip${catFilter === 'all' ? ' active' : ''}" type="button" data-mon-cat="all">Semua</button>
          ${CATEGORIES.map(c => `<button class="mon-chip${catFilter === c.id ? ' active' : ''}" type="button" data-mon-cat="${c.id}">${ui.escapeHtml(c.label)}</button>`).join('')}
        </div>

        ${cats.map(c => {
          const rows = list.filter(p => p.cat === c.id);
          return `
            <div class="mon-group">
              <div class="mon-group-title">${ui.icon(c.icon)}${ui.escapeHtml(c.label)}</div>
              <div class="table-wrap">
                <table class="table mon-table">
                  <thead><tr><th>Parameter</th><th>Lokasi</th><th class="num">Hasil terakhir</th><th class="num">BML</th><th>Satuan</th><th style="width:150px">% terhadap BML</th><th>Tanggal</th><th>Status</th><th></th></tr></thead>
                  <tbody>
                    ${rows.map(p => {
                      const l = latest(p);
                      const st = status(p, l.value);
                      const r = ratio(p, l.value);
                      return `
                        <tr>
                          <td><span class="cell-strong">${ui.escapeHtml(p.name)}</span><span class="cell-sub">${ui.escapeHtml(p.ref)}</span></td>
                          <td>${ui.escapeHtml(l.loc || p.loc)}</td>
                          <td class="num"><strong>${fmt(l.value)}</strong></td>
                          <td class="num">${bmlText(p)}</td>
                          <td>${ui.escapeHtml(p.unit)}</td>
                          <td>${ui.progress(Math.min(r, 100), st.tone === 'green' ? '' : st.tone)}<span class="cell-sub">${r}%</span></td>
                          <td>${ui.formatDate(l.date)}</td>
                          <td>${ui.badge(st.label, st.tone)}</td>
                          <td class="right">
                            <button class="btn btn--ghost btn--sm" type="button" data-mon-history="${p.id}">Riwayat</button>
                            <button class="btn btn--soft btn--sm" type="button" data-mon-update="${p.id}">Update</button>
                          </td>
                        </tr>`;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>`;
        }).join('')}
      </section>`;
  }

  function stat(label, value, tone) {
    return `<div class="mon-stat"><span>${label}</span><strong class="${tone}">${value}</strong></div>`;
  }

  function openUpdate(preselect) {
    const first = param(preselect) || PARAMS[0];
    ui.modal({
      title: 'Update Data Pemantauan',
      subtitle: 'Masukkan hasil pengukuran terbaru. Status dan grafik Overview akan diperbarui otomatis.',
      size: 'lg',
      body: `
        <form class="modal-form" style="display:flex;flex-direction:column;gap:12px" onsubmit="return false">
          <label class="field"><span>Parameter</span>
            <select class="input" id="mParam" style="width:100%">
              ${CATEGORIES.map(c => `<optgroup label="${ui.escapeHtml(c.label)}">
                ${PARAMS.filter(p => p.cat === c.id).map(p => `<option value="${p.id}"${p.id === first.id ? ' selected' : ''}>${ui.escapeHtml(p.name)} (${ui.escapeHtml(p.unit)})</option>`).join('')}
              </optgroup>`).join('')}
            </select>
          </label>
          <p class="tiny muted" id="mBml"></p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <label class="field"><span>Nilai hasil ukur *</span><input class="input" id="mValue" type="number" step="any" style="width:100%"></label>
            <label class="field"><span>Tanggal pengukuran *</span><input class="input" id="mDate" type="date" value="${data.TODAY || ''}" style="width:100%"></label>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <label class="field"><span>Lokasi / titik sampling</span><input class="input" id="mLoc" type="text" style="width:100%"></label>
            <label class="field"><span>Laboratorium / alat ukur</span><input class="input" id="mLab" type="text" placeholder="Contoh: Lab terakreditasi KAN" style="width:100%"></label>
          </div>
          <label class="field"><span>Catatan</span><textarea class="input" id="mNote" rows="2" style="width:100%"></textarea></label>
        </form>`,
      footer: `<button class="btn btn--ghost" data-modal-close type="button">Batal</button>
               <button class="btn btn--primary" type="button" id="mSave">${ui.icon('check')}Simpan</button>`,
      onMount: overlay => {
        const sel = overlay.querySelector('#mParam');
        const sync = () => {
          const p = param(sel.value);
          overlay.querySelector('#mBml').textContent = `BML: ${bmlText(p)} ${p.unit} · Acuan: ${p.ref}`;
          overlay.querySelector('#mLoc').value = p.loc;
        };
        sel.addEventListener('change', sync);
        sync();
        overlay.querySelector('#mSave').addEventListener('click', () => {
          const p = param(sel.value);
          const raw = overlay.querySelector('#mValue').value;
          const date = overlay.querySelector('#mDate').value;
          if (raw === '' || isNaN(Number(raw)) || !date) { ui.toast('Isi nilai hasil ukur dan tanggal.', 'error'); return; }
          const value = Number(raw);
          P.state.addMeasurement({
            paramId: p.id,
            paramName: p.name,
            value,
            date,
            loc: overlay.querySelector('#mLoc').value.trim() || p.loc,
            lab: overlay.querySelector('#mLab').value.trim(),
            note: overlay.querySelector('#mNote').value.trim()
          });
          ui.closeModal();
          const st = status(p, value);
          ui.toast(`${p.name}: ${fmt(value)} ${p.unit} (${st.label}).`, st.key === 'over' ? 'error' : undefined);
        });
      }
    });
  }

  function openHistory(id) {
    const p = param(id);
    const h = history(p);
    ui.modal({
      title: 'Riwayat Pengukuran',
      subtitle: `${p.name} · BML ${bmlText(p)} ${p.unit}`,
      size: 'lg',
      body: `
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Tanggal</th><th class="num">Nilai</th><th>Lokasi</th><th>Lab / alat</th><th>Status</th></tr></thead>
            <tbody>
              ${h.map(m => {
                const st = status(p, m.value);
                return `<tr><td>${ui.formatDate(m.date)}</td><td class="num">${fmt(m.value)} ${ui.escapeHtml(p.unit)}</td>
                  <td>${ui.escapeHtml(m.loc || '-')}</td><td>${ui.escapeHtml(m.lab || '-')}${m.note ? `<span class="cell-sub">${ui.escapeHtml(m.note)}</span>` : ''}</td>
                  <td>${ui.badge(st.label, st.tone)}</td></tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>`,
      footer: `<button class="btn btn--primary" data-modal-close>Tutup</button>`
    });
  }

  function mount(root) {
    root.querySelectorAll('[data-mon-cat]').forEach(btn => {
      btn.addEventListener('click', () => {
        catFilter = btn.getAttribute('data-mon-cat');
        P.nav.renderView();
      });
    });
    root.querySelectorAll('[data-mon-update]').forEach(btn => {
      btn.addEventListener('click', () => openUpdate(btn.getAttribute('data-mon-update')));
    });
    root.querySelectorAll('[data-mon-history]').forEach(btn => {
      btn.addEventListener('click', () => openHistory(btn.getAttribute('data-mon-history')));
    });
  }

  P.monitoringCalc = { categories: CATEGORIES, params: PARAMS, summary, categorySummary, latest, status };
  P.views = P.views || {};
  P.views.monitoring = { render, mount };
})(window);
