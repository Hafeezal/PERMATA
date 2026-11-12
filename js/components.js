/* PERMATA - komponen UI bersama */
(function (global) {
  const P = global.PERMATA = global.PERMATA || {};
  const data = P.data;

  const EVIDENCE_STATUS = {
    verified: { label: 'Terverifikasi', tone: 'green' },
    pending: { label: 'Menunggu Verifikasi', tone: 'amber' },
    need_update: { label: 'Perlu Diperbarui', tone: 'red' }
  };

  const ATTENTION_STATUS = {
    overdue: { label: 'Overdue', tone: 'red' },
    due_soon: { label: 'Due Soon', tone: 'amber' },
    pending: { label: 'Pending', tone: 'amber' },
    info: { label: 'Info', tone: 'blue' },
    open: { label: 'Open Finding', tone: 'red' }
  };

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const MONTHS_LONG = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  let activeModal = null;
  let modalKeyHandler = null;

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function icon(name, cls) {
    let iconName = name;
    if (global.lucide && global.lucide.icons) {
      const pascal = String(name).split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
      if (!global.lucide.icons[pascal]) iconName = 'circle';
    }
    return `<i data-lucide="${iconName}"${cls ? ` class="${cls}"` : ''}></i>`;
  }

  function refreshIcons() {
    if (global.lucide && global.lucide.createIcons) global.lucide.createIcons();
  }

  function formatDate(iso) {
    if (!iso) return '-';
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) return iso;
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  }

  function formatDateLong(iso) {
    if (!iso) return '-';
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) return iso;
    return `${d.getDate()} ${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
  }

  function badge(label, tone, withDot) {
    return `<span class="badge badge--${tone || 'gray'}">${withDot ? '<span class="dot"></span>' : ''}${escapeHtml(label)}</span>`;
  }

  function evidenceBadge(status) {
    const meta = EVIDENCE_STATUS[status] || EVIDENCE_STATUS.pending;
    return badge(meta.label, meta.tone, true);
  }

  function indicatorBadge(status) {
    const meta = P.proper.statusMeta[status] || P.proper.statusMeta.empty;
    return `<span class="badge badge--${meta.tone}">${icon(meta.icon)}${escapeHtml(meta.label)}</span>`;
  }

  function attentionBadge(status) {
    const meta = ATTENTION_STATUS[status] || ATTENTION_STATUS.pending;
    return badge(meta.label, meta.tone);
  }

  function progress(pct, variant, extraClass) {
    const value = Math.max(0, Math.min(100, Number(pct) || 0));
    return `<div class="progress${variant ? ' progress--' + variant : ''}${extraClass ? ' ' + extraClass : ''}"><span style="width:${value}%"></span></div>`;
  }

  function trendBadge(delta, suffix) {
    if (delta == null) return '';
    const cls = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
    const iconName = delta > 0 ? 'arrow-up-right' : delta < 0 ? 'arrow-down-right' : 'minus';
    const sign = delta > 0 ? '+' : '';
    return `<span class="trend ${cls}">${icon(iconName)}${sign}${delta}${suffix || '%'}</span>`;
  }

  function avatar(name, variant) {
    const initials = String(name || '?').split(' ').filter(Boolean).slice(0, 2).map(p => p.charAt(0)).join('').toUpperCase();
    return `<span class="avatar${variant ? ' avatar--' + variant : ''}">${escapeHtml(initials)}</span>`;
  }

  function empty(iconName, title, text) {
    return `<div class="empty"><div class="empty-icon">${icon(iconName || 'inbox')}</div><strong>${escapeHtml(title)}</strong><span>${escapeHtml(text || '')}</span></div>`;
  }

  function kv(label, valueHtml) {
    return `<div class="kv"><span>${escapeHtml(label)}</span><strong>${valueHtml}</strong></div>`;
  }

  function metaChip(iconName, label) {
    return `<span class="meta-chip">${icon(iconName)}${escapeHtml(label)}</span>`;
  }

  function toast(message, type) {
    let root = document.querySelector('.toast-root');
    if (!root) {
      root = document.createElement('div');
      root.className = 'toast-root';
      document.body.appendChild(root);
    }
    const el = document.createElement('div');
    el.className = 'toast' + (type === 'error' ? ' toast--error' : type === 'info' ? ' toast--info' : '');
    el.innerHTML = `${icon(type === 'error' ? 'alert-circle' : type === 'info' ? 'info' : 'check-circle-2')}<span>${escapeHtml(message)}</span>`;
    root.appendChild(el);
    refreshIcons();
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity .25s ease';
      setTimeout(() => el.remove(), 260);
    }, 3800);
  }

  function closeModal() {
    if (!activeModal) return;
    activeModal.remove();
    activeModal = null;
    document.body.classList.remove('no-scroll');
    if (modalKeyHandler) {
      document.removeEventListener('keydown', modalKeyHandler);
      modalKeyHandler = null;
    }
  }

  function modal(options) {
    closeModal();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal${options.size ? ' modal--' + options.size : ''}" role="dialog" aria-modal="true">
        <div class="modal-head">
          <div>
            <h3>${escapeHtml(options.title || '')}</h3>
            ${options.subtitle ? `<p>${escapeHtml(options.subtitle)}</p>` : ''}
          </div>
          <button class="modal-close" data-modal-close aria-label="Tutup">${icon('x')}</button>
        </div>
        <div class="modal-body">${options.body || ''}</div>
        ${options.footer ? `<div class="modal-foot">${options.footer}</div>` : ''}
      </div>`;
    document.body.appendChild(overlay);
    document.body.classList.add('no-scroll');
    activeModal = overlay;
    refreshIcons();

    overlay.addEventListener('click', event => {
      if (event.target === overlay || event.target.closest('[data-modal-close]')) closeModal();
    });
    modalKeyHandler = event => {
      if (event.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', modalKeyHandler);

    if (typeof options.onMount === 'function') options.onMount(overlay);
    return overlay;
  }

  function confirm(options) {
    const overlay = modal({
      title: options.title || 'Konfirmasi',
      subtitle: options.subtitle || '',
      size: 'sm',
      body: `<p class="section-sub">${escapeHtml(options.text || '')}</p>`,
      footer: `
        <button class="btn btn--ghost" data-modal-close>Batal</button>
        <button class="btn ${options.danger ? 'btn--danger' : 'btn--primary'}" data-confirm>${escapeHtml(options.confirmLabel || 'Lanjutkan')}</button>`,
      onMount: root => {
        root.querySelector('[data-confirm]').addEventListener('click', () => {
          closeModal();
          if (typeof options.onConfirm === 'function') options.onConfirm();
        });
      }
    });
    return overlay;
  }

  function prompt(options) {
    const overlay = modal({
      title: options.title || 'Catatan Tindak Lanjut',
      subtitle: options.subtitle || '',
      size: 'sm',
      body: `
        <p class="section-sub">${escapeHtml(options.text || '')}</p>
        <textarea class="input" data-prompt-input rows="3" placeholder="${escapeHtml(options.placeholder || '')}"></textarea>`,
      footer: `
        <button class="btn btn--ghost" data-modal-close>Batal</button>
        <button class="btn btn--primary" data-prompt-confirm>${escapeHtml(options.confirmLabel || 'Simpan')}</button>`,
      onMount: root => {
        const input = root.querySelector('[data-prompt-input]');
        input.focus();
        const submit = () => {
          const value = input.value.trim();
          if (!value) {
            toast('Isi catatan terlebih dahulu.', 'error');
            return;
          }
          closeModal();
          if (typeof options.onConfirm === 'function') options.onConfirm(value);
        };
        root.querySelector('[data-prompt-confirm]').addEventListener('click', submit);
        input.addEventListener('keydown', event => {
          if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) submit();
        });
      }
    });
    return overlay;
  }

  function download(item) {
    if (!item.file) {
      toast('File contoh belum tersedia untuk unggahan demo ini.', 'info');
      return;
    }
    const a = document.createElement('a');
    a.href = item.file;
    a.download = item.name || 'evidence';
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast('Mengunduh ' + (item.name || 'evidence') + '…');
  }

  function previewEvidence(item) {
    const isImage = item.ext === 'img' || item.type === 'PNG' || item.type === 'JPG';
    const src = item.file || (P.ui.runtimeImages && P.ui.runtimeImages[item.id]);
    const subtitle = `${item.name} · ${item.size || ''}`;
    let body;

    if (isImage) {
      body = `
        <div class="doc-view">
          <div class="image-view">
            ${src ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(item.name)}" data-zoom-image>` : `<div class="empty">${icon('image')}<strong>Pratinjau tidak tersedia</strong><span>Berkas gambar demo belum dimuat.</span></div>`}
            ${src ? `<div class="zoom-controls">
              <button data-zoom="in" aria-label="Perbesar">${icon('zoom-in')}</button>
              <button data-zoom="out" aria-label="Perkecil">${icon('zoom-out')}</button>
              <button data-zoom="reset" aria-label="Reset">${icon('rotate-ccw')}</button>
            </div>` : ''}
          </div>
          ${previewSide(item)}
        </div>`;
    } else {
      body = `
        <div class="doc-view">
          <div class="doc-page">
            <div class="doc-brand"><img src="assets/logo-permata.svg" alt="PERMATA">PERMATA · Evidence Center</div>
            <h4>${escapeHtml(item.previewTitle || item.name)}</h4>
            <div class="doc-sub">${escapeHtml(item.previewSub || 'Dokumen pendukung')}</div>
            <div class="doc-rule"></div>
            ${(item.previewLines || ['Dokumen contoh untuk keperluan prototipe.', '', 'Berkas asli dapat diunduh melalui panel di samping.']).map((line, idx) => `<div class="doc-line${idx === 0 ? ' lg' : ''}">${escapeHtml(line || ' ')}</div>`).join('')}
            <div class="doc-sign">Digenerate oleh PERMATA · ${escapeHtml(formatDate(item.date))}</div>
          </div>
          ${previewSide(item)}
        </div>`;
    }

    modal({
      title: 'Preview Evidence',
      subtitle: subtitle,
      size: 'xl',
      body: body,
      footer: `
        <button class="btn btn--ghost" data-modal-close>Tutup</button>
        <button class="btn btn--primary" data-download>${icon('download')}Unduh Berkas</button>`,
      onMount: root => {
        const img = root.querySelector('[data-zoom-image]');
        let zoom = 1;
        root.querySelectorAll('[data-zoom]').forEach(btn => {
          btn.addEventListener('click', () => {
            if (!img) return;
            const mode = btn.getAttribute('data-zoom');
            if (mode === 'in') zoom = Math.min(2.4, zoom + 0.2);
            else if (mode === 'out') zoom = Math.max(0.6, zoom - 0.2);
            else zoom = 1;
            img.style.transform = `scale(${zoom})`;
          });
        });
        const downloads = root.querySelectorAll('[data-download]');
        downloads.forEach(btn => btn.addEventListener('click', () => download(item)));
      }
    });
  }

  function previewSide(item) {
    return `
      <div class="doc-side">
        <div class="side-block">
          <h5>Informasi berkas</h5>
          ${kv('Jenis', item.type || 'Dokumen')}
          ${kv('Ukuran', item.size || '-')}
          ${kv('Tanggal dokumen', formatDate(item.date))}
          ${kv('Diunggah', formatDate(item.uploaded))}
          ${kv('Pengunggah', item.uploader || '-')}
        </div>
        <div class="side-block">
          <h5>Keterkaitan</h5>
          ${kv('Kriteria', P.data.criterionName(item.criterionId))}
          ${kv('Fasilitas', data.facilityShort(item.facility))}
          ${kv('Periode', item.period || '2025/2026')}
          ${kv('Status', evidenceBadge(item.status))}
        </div>
        <div class="side-block">
          <h5>Catatan</h5>
          <p>${escapeHtml(item.note || 'Tidak ada catatan tambahan.')}</p>
        </div>
        <div class="side-block">
          <h5>Berkas</h5>
          <div class="side-links">
            <button class="btn btn--ghost btn--sm" data-download>${icon('download')}Unduh berkas</button>
          </div>
        </div>
      </div>`;
  }

  function soon(feature) {
    modal({
      title: feature.title || 'Modul dalam pengembangan',
      subtitle: 'Prototipe PERMATA',
      size: 'sm',
      body: `
        <div class="soon">
          <div class="soon-icon">${icon(feature.icon || 'construction')}</div>
          <h3>${escapeHtml(feature.heading || 'Segera hadir')}</h3>
          <p>${escapeHtml(feature.text || 'Modul ini belum termasuk dalam cakupan prototipe tahap awal, namun telah disiapkan dalam struktur navigasi.')}</p>
          ${feature.items && feature.items.length ? `<ul>${feature.items.map(i => `<li>${icon('check')}<span>${escapeHtml(i)}</span></li>`).join('')}</ul>` : ''}
        </div>`,
      footer: `<button class="btn btn--primary" data-modal-close>Mengerti</button>`
    });
  }

  function rankBadge(rank) {
    return `<span class="badge badge--${data.rankTone(rank)}">${escapeHtml(rank)}</span>`;
  }

  P.ui = {
    evidenceStatus: EVIDENCE_STATUS,
    attentionStatus: ATTENTION_STATUS,
    escapeHtml,
    icon,
    refreshIcons,
    formatDate,
    formatDateLong,
    badge,
    evidenceBadge,
    indicatorBadge,
    attentionBadge,
    progress,
    trendBadge,
    avatar,
    empty,
    kv,
    metaChip,
    toast,
    modal,
    closeModal,
    confirm,
    prompt,
    download,
    previewEvidence,
    soon,
    rankBadge,
    runtimeImages: {}
  };
})(window);
