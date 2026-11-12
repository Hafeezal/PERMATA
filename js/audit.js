/* PERMATA - Audit & Findings: upload temuan & tracking tindak lanjut */
(function (global) {
  const P = global.PERMATA = global.PERMATA || {};
  const ui = P.ui;

  const ASPECTS = [
    { id: 'penerapan', label: 'Ketidaksesuaian Penerapan', hint: 'Indikator kriteria belum diterapkan sesuai ketentuan' },
    { id: 'dokumen', label: 'Ketidaksesuaian Dokumen', hint: 'Dokumen wajib tidak tersedia, kedaluwarsa, atau tidak sesuai' },
    { id: 'rekaman', label: 'Ketidaksesuaian Rekaman', hint: 'Bukti rekaman kegiatan tidak lengkap atau tidak mutakhir' },
    { id: 'kinerja', label: 'Ketidaksesuaian Kinerja', hint: 'Kinerja lingkungan melampaui baku mutu atau target internal' },
    { id: 'lainnya', label: 'Lainnya', hint: 'Temuan lain di luar kategori di atas' }
  ];

  const STATUS = {
    open: { label: 'OPEN', cls: 'red', icon: 'circle-alert', tone: 'red' },
    in_process: { label: 'PROCESS', cls: 'amber', icon: 'loader', tone: 'amber' },
    closed: { label: 'CLOSED', cls: 'green', icon: 'check-circle-2', tone: 'green' }
  };

  const NEXT_ACTION = {
    open: { status: 'in_process', label: 'Mulai Tindak Lanjut', icon: 'play', tone: 'soft' },
    in_process: { status: 'closed', label: 'Tutup Temuan', icon: 'check', tone: 'primary' },
    closed: null
  };

  function fmtDate(iso) {
    if (!iso) return '-';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return iso;
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }

  function todayISO() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function aspectLabel(id) {
    const a = ASPECTS.find(x => x.id === id);
    return a ? a.label : id;
  }

  function countByStatus(findings) {
    return {
      open: findings.filter(f => f.status === 'open').length,
      in_process: findings.filter(f => f.status === 'in_process').length,
      closed: findings.filter(f => f.status === 'closed').length
    };
  }

  function statCard(key, value, hint) {
    const meta = STATUS[key];
    return `
      <div class="find-stat">
        <span class="find-stat-icon ${meta.cls}">${ui.icon(meta.icon)}</span>
        <div>
          <strong>${value}</strong>
          <span>${meta.label}</span>
          <small>${hint}</small>
        </div>
      </div>`;
  }

  function render(params) {
    const scope = params.scope;
    const tab = params.tab === 'tracking' ? 'tracking' : 'upload';
    const findings = P.state.findings();
    const counts = countByStatus(findings);
    const facilityName = (P.data.facilities.find(f => f.id === scope.facility) || {}).name || scope.facility;

    return `
      <section class="findings-page">
        <div class="findings-grid">
          <div class="findings-main">
            <div class="panel">
              <div class="tabs-bar">
                <a class="tab ${tab === 'upload' ? 'active' : ''}" href="#/audit/upload">${ui.icon('camera')}Upload Temuan</a>
                <a class="tab ${tab === 'tracking' ? 'active' : ''}" href="#/audit/tracking">${ui.icon('list-checks')}Tracking Temuan${findings.length ? ` <span class="tab-count">${findings.length}</span>` : ''}</a>
              </div>

              ${tab === 'upload' ? renderUploadForm(facilityName) : renderTracking(findings, counts)}
            </div>
          </div>

          <aside class="findings-side">
            <div class="panel">
              <div class="panel-head">
                <h3>${ui.icon('search-check')}Ringkasan Temuan</h3>
              </div>
              <div class="find-stats">
                ${statCard('open', counts.open, counts.open === 1 ? 'temuan aktif' : 'temuan aktif')}
                ${statCard('in_process', counts.in_process, 'sedang ditindaklanjuti')}
                ${statCard('closed', counts.closed, 'sudah ditutup')}
              </div>
              <div class="find-total">
                ${ui.icon('clipboard-list')}
                <span>Total <strong>${findings.length}</strong> temuan pada fasilitas ini</span>
              </div>
            </div>

            <div class="panel">
              <div class="panel-head">
                <h3>${ui.icon('info')}Tentang Modul Ini</h3>
              </div>
              <p class="panel-sub" style="margin-bottom:10px">Temuan adalah catatan ketidaksesuaian aspek lingkungan dari audit, inspeksi, atau pengamatan lapangan.</p>
              <ul class="find-notes">
                <li>${ui.icon('camera')}Foto kondisi lapangan sebagai bukti objektif.</li>
                <li>${ui.icon('map-pin')}Lokasi spesifik agar tindak lanjut terarah.</li>
                <li>${ui.icon('loader')}Status berubah Open → In Process → Closed.</li>
                <li>${ui.icon('check-circle-2')}Temuan Closed tetap tercatat sebagai riwayat.</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>`;
  }

  function renderUploadForm(facilityName) {
    return `
      <div class="tab-body">
        <div class="find-form-head">
          <div>
            <h3>${ui.icon('camera')}Laporkan Temuan Baru</h3>
            <p class="panel-sub">Dokumentasikan ketidaksesuaian aspek lingkungan beserta bukti fotonya. Data demo - tidak ada file yang benar-benar diunggah.</p>
          </div>
          <span class="find-scope">${ui.icon('map-pin')}${ui.escapeHtml(facilityName)}</span>
        </div>

        <form class="find-form" id="findingForm" novalidate>
          <div class="form-grid">
            <label class="field field--full">
              <span>Judul Temuan <em>*</em></span>
              <input type="text" name="title" placeholder="cth: Penyimpanan limbah B3 tidak tertutup" required>
            </label>

            <label class="field">
              <span>Kategori Aspek <em>*</em></span>
              <div class="control control--block">
                ${ui.icon('tag')}
                <select name="aspect" required>
                  ${ASPECTS.map(a => `<option value="${a.id}">${a.label}</option>`).join('')}
                </select>
                ${ui.icon('chevron-down', 'chev')}
              </div>
              <small class="field-hint" data-aspect-hint>${ASPECTS[0].hint}</small>
            </label>

            <label class="field">
              <span>Tanggal Temuan <em>*</em></span>
              <div class="control control--block">
                ${ui.icon('calendar-days')}
                <input type="date" name="date" value="${todayISO()}" required>
              </div>
            </label>

            <label class="field field--full">
              <span>Lokasi Temuan <em>*</em></span>
              <div class="control control--block">
                ${ui.icon('map-pin')}
                <input type="text" name="location" placeholder="cth: Area tangki T-102, gudang limbah, IPAL outlet" required>
              </div>
            </label>

            <label class="field field--full">
              <span>Deskripsi Temuan <em>*</em></span>
              <textarea name="description" rows="4" placeholder="Jelaskan kondisi yang ditemukan, dampak potensial terhadap lingkungan, dan referensi ketentuan yang dilanggar (jika ada)." required></textarea>
            </label>

            <div class="field field--full">
              <span>Foto Temuan</span>
              <label class="upload-box" for="findingPhoto">
                <input type="file" id="findingPhoto" accept="image/*" hidden>
                <span class="upload-preview" data-upload-preview>${ui.icon('image-plus')}</span>
                <span class="upload-copy">
                  <strong>Klik untuk memilih foto</strong>
                  <small>JPG / PNG · bukti kondisi lapangan · demo: metadata saja</small>
                </span>
              </label>
            </div>
          </div>

          <div class="find-form-foot">
            <button class="btn btn--ghost" type="reset">${ui.icon('rotate-ccw')}Kosongkan</button>
            <button class="btn btn--primary" type="submit">${ui.icon('send')}Kirim Temuan</button>
          </div>
        </form>
      </div>`;
  }

  function renderTracking(findings, counts) {
    const filter = currentFilter();
    const list = filter === 'all' ? findings : findings.filter(f => f.status === filter);

    return `
      <div class="tab-body">
        <div class="track-head">
          <div class="track-filters">
            ${filterChip('all', 'Semua', findings.length, filter)}
            ${filterChip('open', 'Open', counts.open, filter)}
            ${filterChip('in_process', 'In Process', counts.in_process, filter)}
            ${filterChip('closed', 'Closed', counts.closed, filter)}
          </div>
          <a class="btn btn--primary btn--sm" href="#/audit/upload">${ui.icon('plus')}Laporkan Temuan</a>
        </div>

        ${list.length ? `<div class="track-list">${list.map(findingRow).join('')}</div>` : emptyState(filter)}
      </div>`;
  }

  let filter = 'all';
  function currentFilter() { return filter; }
  function setFilter(value) { filter = value; }

  function filterChip(id, label, count, active) {
    return `
      <button class="chip ${active === id ? 'active' : ''}" type="button" data-filter="${id}">
        ${label}<span class="chip-count">${count}</span>
      </button>`;
  }

  function findingRow(f) {
    const meta = STATUS[f.status];
    const next = NEXT_ACTION[f.status];
    const photo = f.photo ? `<span class="find-photo" title="${ui.escapeHtml(f.photo.name)}">${ui.icon('image')}<small>${ui.escapeHtml(f.photo.name)}</small></span>` : '';
    const history = (f.followups || []).map(fu =>
      `<li>${ui.icon('corner-down-right')}<span>${ui.escapeHtml(fu.note || 'Status diperbarui')} <em>· ${ui.escapeHtml(fu.at)} · ${ui.escapeHtml(fu.by)}</em></span></li>`
    ).join('');

    return `
      <article class="find-row ${meta.cls}">
        <div class="find-status">
          <span class="status-badge ${meta.cls}">${ui.icon(meta.icon)}${meta.label}</span>
        </div>
        <div class="find-body">
          <div class="find-title">
            <h4>${ui.escapeHtml(f.title)}</h4>
            <span class="find-meta">
              ${ui.icon('tag')}${aspectLabel(f.aspect)}
              ${ui.icon('map-pin')}${ui.escapeHtml(f.location)}
              ${ui.icon('calendar-days')}${fmtDate(f.date)}
            </span>
          </div>
          <p class="find-desc">${ui.escapeHtml(f.description)}</p>
          <div class="find-foot">
            <span class="find-reporter">${ui.icon('user')}${ui.escapeHtml(f.reporter || '-')}</span>
            ${photo}
          </div>
          ${history ? `<ul class="find-history">${history}</ul>` : ''}
        </div>
        <div class="find-actions">
          ${next ? `<button class="btn btn--${next.tone} btn--sm" type="button" data-next="${f.id}" data-status="${next.status}">${ui.icon(next.icon)}${next.label}</button>` : `<span class="find-closed-note">${ui.icon('archive')}Tercatat sebagai riwayat</span>`}
        </div>
      </article>`;
  }

  function emptyState(filterId) {
    const copy = {
      all: ['clipboard-list', 'Belum ada temuan', 'Temuan yang dilaporkan melalui tab Upload Temuan akan tampil di sini.'],
      open: ['circle-check', 'Tidak ada temuan Open', 'Semua temuan aktif sudah mulai ditindaklanjuti.'],
      in_process: ['loader', 'Tidak ada temuan In Process', 'Tidak ada tindak lanjut yang sedang berjalan saat ini.'],
      closed: ['archive', 'Belum ada temuan Closed', 'Temuan yang sudah selesai ditindaklanjuti akan tampil di sini.']
    }[filterId] || ['clipboard-list', 'Belum ada temuan', ''];
    return ui.empty(copy[0], copy[1], copy[2]);
  }

  function bindUploadForm(root) {
    const form = root.querySelector('#findingForm');
    if (!form) return;

    const aspectSelect = form.querySelector('select[name="aspect"]');
    const aspectHint = form.querySelector('[data-aspect-hint]');
    aspectSelect.addEventListener('change', () => {
      const a = ASPECTS.find(x => x.id === aspectSelect.value);
      if (a && aspectHint) aspectHint.textContent = a.hint;
    });

    const photoInput = form.querySelector('#findingPhoto');
    const preview = form.querySelector('[data-upload-preview]');
    let photoMeta = null;
    photoInput.addEventListener('change', () => {
      const file = photoInput.files && photoInput.files[0];
      if (!file) { photoMeta = null; preview.innerHTML = ui.icon('image-plus'); return; }
      photoMeta = { name: file.name, size: file.size, type: file.type };
      preview.innerHTML = `${ui.icon('image')}<small>${ui.escapeHtml(file.name)}</small>`;
      ui.refreshIcons();
    });

    form.addEventListener('reset', () => {
      photoMeta = null;
      preview.innerHTML = ui.icon('image-plus');
      if (aspectHint) aspectHint.textContent = ASPECTS[0].hint;
      ui.refreshIcons();
    });

    form.addEventListener('submit', event => {
      event.preventDefault();
      const fd = new FormData(form);
      const title = String(fd.get('title') || '').trim();
      const location = String(fd.get('location') || '').trim();
      const description = String(fd.get('description') || '').trim();
      const aspect = String(fd.get('aspect') || 'lainnya');
      const date = String(fd.get('date') || todayISO());

      if (!title || !location || !description) {
        ui.toast('Lengkapi judul, lokasi, dan deskripsi temuan terlebih dahulu.', 'warning');
        return;
      }

      P.state.addFinding({ title, aspect, location, description, date, photo: photoMeta });
      form.reset();
      ui.toast(`Temuan "${title}" berhasil dilaporkan.`, 'success');
      P.nav.navigate('#/audit/tracking');
    });
  }

  function bindTracking(root) {
    root.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        setFilter(btn.getAttribute('data-filter'));
        P.nav.renderView();
      });
    });

    root.querySelectorAll('[data-next]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-next');
        const status = btn.getAttribute('data-status');
        const finding = P.state.findings().find(f => f.id === id);
        if (!finding) return;

        if (status === 'in_process') {
          ui.prompt({
            title: 'Mulai Tindak Lanjut',
            text: `Jelaskan rencana atau tindakan perbaikan untuk temuan "${finding.title}".`,
            placeholder: 'cth: Menyusun SOP penyimpanan limbah dan menjadwalkan perbaikan tangki',
            confirmLabel: 'Simpan & Proses',
            onConfirm: note => {
              P.state.setFindingStatus(id, 'in_process', note);
              ui.toast('Status temuan diperbarui menjadi In Process.', 'success');
            }
          });
        } else if (status === 'closed') {
          ui.confirm({
            title: 'Tutup temuan ini?',
            text: `Pastikan tindakan perbaikan untuk "${finding.title}" sudah selesai dan tervalidasi. Temuan yang ditutup tetap tercatat sebagai riwayat.`,
            confirmLabel: 'Tutup Temuan',
            onConfirm: () => {
              P.state.setFindingStatus(id, 'closed', 'Tindak lanjut selesai dan tervalidasi');
              ui.toast('Temuan ditutup. Status kini Closed dan tercatat sebagai riwayat.', 'success');
            }
          });
        }
      });
    });
  }

  function mount(root, params) {
    const tab = params.tab === 'tracking' ? 'tracking' : 'upload';
    if (tab === 'upload') bindUploadForm(root);
    else bindTracking(root);
  }

  P.views = P.views || {};
  P.views.audit = { render, mount };
})(window);
