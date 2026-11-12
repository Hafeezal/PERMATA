/* PERMATA - PROPER Monitoring (Kriteria, Evidence Center, Riwayat, & Input Penerapan) */
(function (global) {
  const P = global.PERMATA = global.PERMATA || {};
  const data = P.data;
  const ui = P.ui;
  const rd = P.readiness;

  const evidenceFilter = { q: '', criterion: 'all', status: 'all' };

  function render(ctx) {
    const scope = ctx.scope;
    const tab = ctx.tab || 'kriteria';
    const snapshot = rd.properSnapshot(scope);

    return `
      ${achievement(snapshot, scope)}
      <div class="proper-layout">
        <div class="proper-main">
          <div class="tab-bar">
            <div class="tabs">
              <a class="tab${tab === 'kriteria' ? ' active' : ''}" href="#/proper/kriteria">${ui.icon('list-checks')}Kriteria Penilaian</a>
              <a class="tab${tab === 'evidence' ? ' active' : ''}" href="#/proper/evidence">${ui.icon('folder-open')}Evidence Center</a>
              <a class="tab${tab === 'riwayat' ? ' active' : ''}" href="#/proper/riwayat">${ui.icon('history')}Riwayat Penilaian</a>
            </div>
            <div class="tab-actions">
              <button class="btn btn--primary btn--sm" id="btnInputPenerapanMain" type="button">
                ${ui.icon('plus-circle')} Input Penerapan Baru
              </button>
            </div>
          </div>
          ${tab === 'evidence' ? evidenceTab(scope) : tab === 'riwayat' ? historyTab(scope) : criteriaTab(scope)}
        </div>
        ${attentionAside(scope)}
      </div>`;
  }

  function achievement(snapshot, scope) {
    const rank = snapshot.rank;
    const rankText = rank === 'Belum Ditetapkan' ? 'Belum Ditetapkan' : 'Peringkat ' + rank;
    const overall = snapshot.overall;
    const heading = rank === 'Emas'
      ? 'Mempertahankan Peringkat Emas'
      : rank === 'Hijau'
        ? 'Siap Menuju Peringkat Emas'
        : rank === 'Biru'
          ? 'Menuju Peringkat Hijau'
          : 'Menetapkan Baseline Kinerja';
    const gapCompliance = snapshot.compliance.gapToTarget;
    const gapBeyond = snapshot.beyond.gapToTarget;

    return `
      <div class="achievement-grid">
        <div class="ach-card ach-rank">
          <div class="rank-mini">
            <canvas id="achRankDonut" aria-label="Kesiapan keseluruhan PROPER"></canvas>
            <div class="donut-center">
              <span class="donut-rank" style="font-size:22px">${overall}<small style="font-size:12px;font-weight:700">%</small></span>
              <span class="donut-period">${scope.period}</span>
              <span class="donut-official">${ui.escapeHtml(rank === 'Belum Ditetapkan' ? 'Resmi: belum ditetapkan' : 'Resmi: ' + rank)}</span>
            </div>
          </div>
          <div class="ach-rank-copy">
            <div class="ach-label">${ui.icon('gauge')}Kesiapan Keseluruhan (internal)</div>
            <h3>${overall}% siap audit</h3>
            <p>Peringkat resmi terakhir: ${ui.escapeHtml(rankText)} · Periode ${scope.period}</p>
            ${ui.badge(rank === 'Belum Ditetapkan' ? 'Belum ditetapkan' : 'Hasil resmi terakhir', rank === 'Belum Ditetapkan' ? 'gray' : data.rankTone(rank), true)}
          </div>
        </div>

        <div class="ach-card">
          <div class="ach-label">${ui.icon('shield-check')}Compliance</div>
          <div class="ach-value">${snapshot.compliance.score}%</div>
          <div class="ach-sub">Kesiapan kriteria ketaatan · ${snapshot.compliance.atTarget}/${snapshot.compliance.totalCriteria} kriteria ≥ target</div>
          ${ui.progress(snapshot.compliance.score, '', 'progress--lg')}
          <div class="ach-target" style="flex-wrap:wrap">${ui.icon('target')}Target internal ${snapshot.compliance.target}% ${ui.trendBadge(snapshot.compliance.delta)}</div>
        </div>

        <div class="ach-card">
          <div class="ach-label">${ui.icon('sparkles')}Beyond Compliance</div>
          <div class="ach-value">${snapshot.beyond.score}%</div>
          <div class="ach-sub">Kesiapan kriteria lebih dari ketaatan · ${snapshot.beyond.atTarget}/${snapshot.beyond.totalCriteria} kriteria ≥ target</div>
          ${ui.progress(snapshot.beyond.score, 'lime', 'progress--lg')}
          <div class="ach-target" style="flex-wrap:wrap">${ui.icon('target')}Target internal ${snapshot.beyond.target}% ${ui.trendBadge(snapshot.beyond.delta)}</div>
        </div>

        <div class="ach-card ach-target-card">
          <div class="insight-icon">${ui.icon('target')}</div>
          <h3>${ui.escapeHtml(heading)}</h3>
          <p>${gapCompliance > 0 ? `Gap ${gapCompliance} poin pada ketaatan` : 'Target ketaatan internal tercapai'}, ${gapBeyond > 0 ? `${gapBeyond} poin pada beyond compliance` : 'beyond compliance sesuai target'}. Rekomendasi bersifat internal.</p>
          <button class="btn btn--ghost btn--sm" type="button" data-gap style="margin-top:10px;align-self:flex-start">${ui.icon('arrow-right')}Lihat prioritas</button>
        </div>
      </div>`;
  }

  function criteriaTab(scope) {
    return `
      <div class="criteria-columns">
        ${['compliance', 'beyond'].map(group => criteriaCard(group, scope)).join('')}
      </div>
      <p class="tiny muted" style="margin-top:10px">11 Aspek Penilaian Ketaatan & 7 Kelompok Beyond Compliance (Permen LH/BPLH 7/2025). Klik baris untuk melihat deskripsi dan bentuk penerapan fasilitas.</p>`;
  }

  function criteriaCard(groupId, scope) {
    const group = P.proper.groups[groupId];
    const rows = rd.criteriaRows(groupId, scope);
    const score = rd.groupScore(groupId, scope);
    const atTarget = rows.filter(r => r.score >= group.target).length;

    return `
      <section class="panel criteria-card">
        <div class="criteria-card-head">
          <div class="row">
            <div>
              <h3>${ui.escapeHtml(group.title)}</h3>
              <p>${rows.length} ${groupId === 'compliance' ? 'aspek penilaian' : 'kelompok penilaian'} · ${atTarget} ≥ target ${group.target}%</p>
            </div>
            <span class="criteria-pct">${score}%</span>
          </div>
          ${ui.progress(score, groupId === 'beyond' ? 'lime' : '')}
        </div>
        <div class="criteria-list">
          ${rows.map(row => `
            <button class="criteria-row" type="button" data-criterion="${row.criterion.id}">
              <span class="crit-num">${row.criterion.no}</span>
              <span class="crit-ico">${ui.icon(row.criterion.icon)}</span>
              <span class="crit-name">${ui.escapeHtml(row.criterion.name)}</span>
              <div class="crit-bar">
                ${ui.progress(row.score, groupId === 'beyond' ? 'lime' : '')}
              </div>
              <span class="crit-val">${row.score}%</span>
              <span class="crit-chevron">${ui.icon('chevron-right')}</span>
            </button>`).join('')}
        </div>
      </section>`;
  }

  function attentionAside(scope) {
    const items = data.attentionFor(scope.facility);
    return `
      <aside class="proper-aside">
        <section class="panel attention-panel">
          <div class="panel-head">
            <div>
              <div class="panel-title">${ui.icon('alert-circle')}Perhatian</div>
              <div class="panel-sub">Perlu tindak lanjut pada cakupan ini.</div>
            </div>
            <span class="counter-badge">${items.length}</span>
          </div>
          ${items.length ? `
            <div class="attention-list">
              ${items.map(item => `
                <div class="att-card ${item.status}" data-open-criterion="${item.group}/${item.criterionId}">
                  <div class="att-ico">${ui.icon('alert-triangle')}</div>
                  <div class="att-main">
                    <strong>${ui.escapeHtml(item.title)}</strong>
                    <p>${ui.escapeHtml(item.subtitle)} · Due ${ui.formatDate(item.due)}</p>
                  </div>
                  ${ui.attentionBadge(item.status)}
                </div>`).join('')}
            </div>` : ui.empty('check-circle', 'Semua aman', 'Tidak ada temuan atau kewajiban kritis pada cakupan ini.')}
          <p class="tiny muted" style="margin-top:12px">Klik item untuk membuka kriteria terkait.</p>
        </section>
      </aside>`;
  }

  function evidenceTab(scope) {
    const list = data.evidenceForScope(scope);
    const stats = data.evidenceStats(list);
    return `
      <div class="evidence-stats-grid">
        <div class="stat-box"><span>Total Evidence</span><strong>${stats.total}</strong></div>
        <div class="stat-box"><span>Terverifikasi</span><strong style="color:var(--forest)">${stats.verified || 0}</strong></div>
        <div class="stat-box"><span>Menunggu Review</span><strong style="color:var(--amber)">${stats.pending || 0}</strong></div>
        <div class="stat-box"><span>Perlu Diperbarui</span><strong style="color:var(--red)">${stats.need_update || 0}</strong></div>
      </div>
      <div class="panel" style="margin-top:14px">
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Nama Dokumen Bukti</th>
                <th>Kriteria</th>
                <th>Tanggal Upload</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(ev => `
                <tr>
                  <td>
                    <div style="display:flex;align-items:center;gap:8px">
                      <span class="doc-ico ${ev.ext === 'img' ? 'img' : 'pdf'}">${ev.ext === 'img' ? ui.icon('image') : 'PDF'}</span>
                      <span class="cell-strong">${ui.escapeHtml(ev.name)}</span>
                    </div>
                  </td>
                  <td>${ui.escapeHtml(data.criterionName(ev.criterionId))}</td>
                  <td>${ui.formatDate(ev.uploaded)}</td>
                  <td>${ui.evidenceBadge(ev.status)}</td>
                  <td>
                    <button class="btn btn--ghost btn--sm" type="button" data-ev-preview="${ev.id}">${ui.icon('eye')} Preview</button>
                  </td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  function historyTab(scope) {
    return `
      <section class="panel">
        <div class="panel-head">
          <div class="panel-title">${ui.icon('history')}Riwayat Pencapaian PROPER Periode ke Periode</div>
          <span class="badge badge--green">Fasilitas: ${data.facilityName(scope.facility)}</span>
        </div>
        <div style="height:280px;margin-top:16px">
          <canvas id="historyLineCanvas"></canvas>
        </div>
      </section>`;
  }

  /* MODAL INPUT BENTUK PENERAPAN (FITUR UTAMA USER) */
  function openInputModal(preselectedCriterionId) {
    const scope = P.state.scope();
    const criteriaList = P.proper.criteria;
    const defaultCrit = preselectedCriterionId ? P.proper.criterion(preselectedCriterionId) : criteriaList[0];
    const defaultGroup = defaultCrit ? defaultCrit.group : 'compliance';

    ui.modal({
      title: 'Input Bentuk Penerapan Kriteria PROPER',
      subtitle: 'Catat bentuk penerapan nyata fasilitas, bukti dokumen, dan dokumentasi foto untuk memperbarui kesiapan.',
      size: 'lg',
      body: `
        <form id="formInputPenerapan" class="modal-form" style="display:flex;flex-direction:column;gap:14px">
          <div class="form-row" style="display:grid;grid-template-columns:1fr 1.6fr;gap:12px">
            <div>
              <label class="form-label" style="font-size:11px;font-weight:600;color:var(--slate)">Kelompok Kriteria</label>
              <select id="inputGroupSelect" class="input" style="width:100%">
                <option value="compliance"${defaultGroup === 'compliance' ? ' selected' : ''}>Kriteria Ketaatan (11 Aspek)</option>
                <option value="beyond"${defaultGroup === 'beyond' ? ' selected' : ''}>Kriteria Beyond Compliance (7 Kelompok)</option>
              </select>
            </div>
            <div>
              <label class="form-label" style="font-size:11px;font-weight:600;color:var(--slate)">Aspek Penilaian PROPER</label>
              <select id="inputCriterionSelect" class="input" style="width:100%">
                ${criteriaList.map(c => `
                  <option value="${c.id}" data-grp="${c.group}"${(defaultCrit && defaultCrit.id === c.id) ? ' selected' : ''}>
                    ${c.code} · ${ui.escapeHtml(c.name)}
                  </option>`).join('')}
              </select>
            </div>
          </div>

          <div>
            <label class="form-label" style="font-size:11px;font-weight:600;color:var(--slate)">Nama / Bentuk Penerapan Fasilitas *</label>
            <input id="inputTitle" class="input" type="text" placeholder="Contoh: Optimalisasi Unit Oil-Water Separator (OWS) Area Loading" required style="width:100%">
          </div>

          <div>
            <label class="form-label" style="font-size:11px;font-weight:600;color:var(--slate)">Deskripsi Teknis Penerapan & Pengendalian *</label>
            <textarea id="inputDesc" class="input" rows="3" placeholder="Jelaskan spesifikasi teknis, alur pengendalian, dan hasil pemantauan di lapangan..." required style="width:100%"></textarea>
          </div>

          <div class="form-row" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div>
              <label class="form-label" style="font-size:11px;font-weight:600;color:var(--slate)">
                ${ui.icon('file-text')} Lampiran Dokumen Bukti (PDF / Laporan)
              </label>
              <input id="inputDocName" class="input" type="text" placeholder="Nama berkas (misal: Laporan_Uji_Lab_OWS_2026.pdf)" style="width:100%">
            </div>
            <div>
              <label class="form-label" style="font-size:11px;font-weight:600;color:var(--slate)">
                ${ui.icon('image')} Dokumentasi / Foto Lapangan (JPG / PNG)
              </label>
              <input id="inputPhotoName" class="input" type="text" placeholder="Nama berkas (misal: Foto_Instalasi_OWS_Loading.jpg)" style="width:100%">
            </div>
          </div>

          <div class="form-row" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div>
              <label class="form-label" style="font-size:11px;font-weight:600;color:var(--slate)">Status Pemenuhan</label>
              <select id="inputStatus" class="input" style="width:100%">
                <option value="verified" selected>Terpenuhi (Meningkatkan Progress Bar Kriteria)</option>
                <option value="in_process">Dalam Proses Penerapan</option>
              </select>
            </div>
            <div>
              <label class="form-label" style="font-size:11px;font-weight:600;color:var(--slate)">Fasilitas & PIC</label>
              <input class="input" type="text" value="${data.facilityName(scope.facility)} · ${data.profile.name}" disabled style="width:100%;background:#F8FAF9">
            </div>
          </div>
        </form>`,
      footer: `
        <button class="btn btn--ghost" data-modal-close type="button">Batal</button>
        <button class="btn btn--primary" id="btnSubmitFormPenerapan" type="button">
          ${ui.icon('check-circle-2')} Simpan & Update Grafik
        </button>`,
      onMount: overlay => {
        const groupSel = overlay.querySelector('#inputGroupSelect');
        const critSel = overlay.querySelector('#inputCriterionSelect');

        function filterCriteriaByGroup() {
          const grp = groupSel.value;
          let firstMatch = null;
          critSel.querySelectorAll('option').forEach(opt => {
            const matches = opt.getAttribute('data-grp') === grp;
            opt.style.display = matches ? '' : 'none';
            if (matches && !firstMatch) firstMatch = opt;
          });
          if (firstMatch && critSel.selectedOptions[0].getAttribute('data-grp') !== grp) {
            critSel.value = firstMatch.value;
          }
        }

        groupSel.addEventListener('change', filterCriteriaByGroup);
        filterCriteriaByGroup();

        overlay.querySelector('#btnSubmitFormPenerapan').addEventListener('click', () => {
          const title = overlay.querySelector('#inputTitle').value.trim();
          const desc = overlay.querySelector('#inputDesc').value.trim();
          const critId = critSel.value;
          const status = overlay.querySelector('#inputStatus').value;
          const docName = overlay.querySelector('#inputDocName').value.trim() || 'Dokumen_Bukti_' + Date.now() + '.pdf';
          const photoName = overlay.querySelector('#inputPhotoName').value.trim() || 'Foto_Dokumentasi_' + Date.now() + '.jpg';

          if (!title || !desc) {
            ui.toast('Mohon lengkapi nama dan deskripsi penerapan fasilitas.', 'error');
            return;
          }

          const targetCrit = P.proper.criterion(critId);
          const currentScope = P.state.scope();

          // Simpan ke state
          P.state.addImplementation({
            criterionId: critId,
            criterionCode: targetCrit ? targetCrit.code : 'C',
            scopeKey: P.state.scopeKey(currentScope),
            title,
            description: desc,
            form: 'Penerapan Mandiri Fasilitas',
            date: new Date().toISOString().slice(0, 10),
            by: data.profile.name,
            status,
            doc: { name: docName },
            photo: { name: photoName }
          });

          ui.closeModal();
          ui.toast('Bentuk penerapan "' + title + '" berhasil dicatat! Progress bar dan grafik utama telah diperbarui.');

          // Navigasi ke detail kriteria terkait agar langsung terlihat hasilnya
          P.nav.navigate('#/criteria/' + critId);
        });
      }
    });
  }

  function mount(root, ctx) {
    const scope = ctx.scope;
    const P = window.PERMATA;
    if (P.charts && P.charts.ready()) {
      const achDonut = document.getElementById('achRankDonut');
      if (achDonut) {
        const snap = rd.properSnapshot(scope);
        P.charts.rankDonut(achDonut, snap.rank);
      }
      const historyCanvas = document.getElementById('historyLineCanvas');
      if (historyCanvas) {
        const series = rd.historySeries(scope);
        P.charts.trendLine(historyCanvas, series.labels, series.compliance);
      }
    }

    // Event tombol input penerapan
    const btnInput = document.getElementById('btnInputPenerapanMain');
    if (btnInput) {
      btnInput.addEventListener('click', () => openInputModal());
    }

    // Klik kriteria row
    document.querySelectorAll('.criteria-row').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-criterion');
        P.nav.navigate('#/criteria/' + id);
      });
    });

    // Klik item perhatian
    document.querySelectorAll('[data-open-criterion]').forEach(btn => {
      btn.addEventListener('click', () => {
        const path = btn.getAttribute('data-open-criterion');
        const id = path.split('/')[1] || path;
        P.nav.navigate('#/criteria/' + id);
      });
    });

    // Preview evidence
    document.querySelectorAll('[data-ev-preview]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-ev-preview');
        const ev = data.evidence.find(e => e.id === id);
        if (ev && ui.previewEvidence) {
          ui.previewEvidence(ev);
        } else {
          ui.toast('Membuka pratinjau bukti dokumen...');
        }
      });
    });
  }

  P.views = P.views || {};
  P.views.proper = { render, mount, openInputModal };
})(window);
