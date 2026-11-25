/* PERMATA - Detail Kriteria PROPER
   Menyajikan Deskripsi Penilaian, Panduan Contoh Penerapan Mudah Dipahami,
   Bentuk Penerapan Kita, serta Bukti Dokumen & Foto Lapangan.
*/
(function (global) {
  const P = global.PERMATA = global.PERMATA || {};
  const data = P.data;
  const ui = P.ui;
  const rd = P.readiness;

  function render(ctx) {
    // Cari kriteria berdasarkan ID (contoh: c01, c02, b01, atau path group/id)
    let id = ctx.id;
    if (id && id.includes('/')) id = id.split('/')[1];

    const criterion = P.proper.criterion(id);
    if (!criterion) {
      return `
        <div class="card">
          ${ui.empty('file-question', 'Kriteria Tidak Ditemukan', 'Aspek penilaian yang Anda tuju belum terdaftar pada basis data.')}
          <div style="display:flex;justify-content:center;margin-top:14px">
            <a class="btn btn--primary" href="#/proper/kriteria">Kembali ke PROPER</a>
          </div>
        </div>`;
    }

    const scope = ctx.scope;
    const group = P.proper.groups[criterion.group];
    const score = rd.criterionScore(criterion, scope);
    const status = rd.criterionStatus(criterion, scope);
    const stats = rd.indicatorStats(criterion, scope);
    const userImpls = P.state ? P.state.implementationsFor(criterion.id) : [];

    return `
      <!-- BREADCRUMB -->
      <div class="breadcrumb">
        <a href="#/dashboard">Dashboard</a>
        ${ui.icon('chevron-right')}
        <a href="#/proper/kriteria">PROPER Monitoring</a>
        ${ui.icon('chevron-right')}
        <span>${ui.escapeHtml(group.title)}</span>
        ${ui.icon('chevron-right')}
        <span class="active">${criterion.code} · ${ui.escapeHtml(criterion.name)}</span>
      </div>

      <!-- HERO SECTION -->
      <section class="crit-hero">
        <div class="crit-hero-top">
          <div>
            <div class="crit-eyebrow">${criterion.group === 'beyond' ? 'BEYOND COMPLIANCE' : 'KRITERIA KETAATAN'} · ASPEK ${criterion.no}</div>
            <h1>${criterion.no}. ${ui.escapeHtml(criterion.name)}</h1>
            <p class="crit-tagline">${ui.escapeHtml(criterion.tagline || '')}</p>
            <div class="meta" style="margin-top:10px">
              ${ui.metaChip('map-pin', data.facilityName(scope.facility))}
              ${ui.metaChip('calendar-days', 'Periode ' + scope.period)}
              ${ui.metaChip('user', 'PIC: ' + criterion.pic)}
            </div>
          </div>
          <div class="hero-actions">
            ${ui.badge(status.label, status.tone, true)}
            <button class="btn btn--primary" id="btnInputPenerapanDetail" type="button">
              ${ui.icon('plus-circle')} Input Penerapan di Aspek Ini
            </button>
            <a class="btn btn--ghost" href="#/proper/kriteria">${ui.icon('arrow-left')} Kembali</a>
          </div>
        </div>
      </section>

      <!-- PROGRESS HERO CARD -->
      <section class="card progress-hero-card" style="margin-bottom:16px">
        <div class="progress-hero">
          <div>
            <div class="progress-big">${score}<small>%</small></div>
            <div class="progress-meta">${stats.verifiedCount} dari ${stats.count} indikator terverifikasi</div>
          </div>
          <div class="progress-mid">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <span style="font-size:12px;font-weight:600;color:var(--dark)">Kesiapan Aspek ${criterion.code}</span>
              ${ui.badge(status.label, status.tone)}
            </div>
            ${ui.progress(score, score >= 80 ? '' : score >= 60 ? 'amber' : 'red', 'progress--lg')}
            <div class="progress-meta" style="margin-top:6px">
              Bobot terverifikasi ${stats.verified} dari total ${stats.total} poin
            </div>
          </div>
          <div class="progress-targets">
            <div class="target-row"><span>Target Kepatuhan</span><strong>100%</strong></div>
            <div class="target-row"><span>Penerapan Fasilitas</span><strong>${(criterion.companyPractice || []).length + userImpls.length} Program</strong></div>
            <div class="target-row"><span>Evidence Terkait</span><strong>${(criterion.evidenceDocs || []).length} Dokumen · ${(criterion.evidencePhotos || []).length} Foto</strong></div>
          </div>
        </div>
      </section>

      <!-- MAIN CONTENT GRID -->
      <div class="crit-content-grid">
        <!-- 1. DESKRIPSI PENILAIAN -->
        <section class="card">
          <div class="card-head">
            <div class="card-title">${ui.icon('book-open')}Deskripsi Penilaian PROPER</div>
            ${ui.badge(criterion.code, 'gray')}
          </div>
          <p class="section-sub" style="font-size:13.5px;line-height:1.65;color:var(--dark)">
            ${ui.escapeHtml(criterion.description)}
          </p>

          <div class="aside-title" style="margin-top:16px">${ui.icon('scale')}Dasar Hukum & Regulasi Acuan</div>
          <div class="legal-list">
            ${(criterion.laws || []).map(law => `
              <div class="legal-item">
                ${ui.icon('file-text')}
                <span><strong>${ui.escapeHtml(law.ref)}</strong> — ${ui.escapeHtml(law.about)}</span>
              </div>`).join('')}
          </div>
        </section>

        <!-- 2. PANDUAN CONTOH PENERAPAN (MUDAH DIPAHAMI) -->
        <section class="card">
          <div class="card-head">
            <div class="card-title">${ui.icon('lightbulb')}Panduan Contoh Penerapan (Mudah Dipahami)</div>
            <span class="badge badge--green">Panduan Operasional</span>
          </div>
          <p class="section-sub" style="margin-bottom:14px">
            Ilustrasi penerapan nyata berdasarkan karakteristik fasilitas Fuel Terminal, DPPU, SPBU, terminal LPG, dan bengkel/kantor:
          </p>
          <div class="practice-list">
            ${(criterion.practicalGuide || []).map(guide => `
              <div class="practice-item">
                <div class="practice-icon">${ui.icon('check-circle-2')}</div>
                <div class="practice-content">
                  <strong>${ui.escapeHtml(guide.title)}</strong>
                  <p>${ui.escapeHtml(guide.text)}</p>
                </div>
              </div>`).join('')}
          </div>
        </section>

        <!-- 3. BENTUK PENERAPAN KITA DI FASILITAS -->
        <section class="card">
          <div class="card-head">
            <div class="card-title">${ui.icon('building-2')}Bentuk Penerapan Fasilitas Kita</div>
            <span class="badge badge--green">${data.facilityName(scope.facility)}</span>
          </div>
          <p class="section-sub" style="margin-bottom:14px">
            Program pengelolaan lingkungan yang sedang dan telah dilaksanakan pada fasilitas ini:
          </p>

          <!-- Input Penerapan Pengguna (Jika Ada) -->
          ${userImpls.length ? `
            <div class="aside-title" style="margin-bottom:10px">${ui.icon('history')}Penerapan Baru yang Diinput Pengguna</div>
            <div class="impl-list" style="margin-bottom:16px">
              ${userImpls.map(impl => `
                <div class="impl-item">
                  <div class="impl-head">
                    <strong style="font-size:14px;color:var(--dark)">${ui.escapeHtml(impl.title)}</strong>
                    <span class="badge badge--green">${ui.escapeHtml(impl.form || 'Penerapan')}</span>
                  </div>
                  ${impl.description ? `<p style="font-size:13px;color:var(--slate);margin:6px 0">${ui.escapeHtml(impl.description)}</p>` : ''}
                  <div class="impl-meta">
                    ${ui.metaChip('calendar-days', ui.formatDate(impl.date))}
                    ${ui.metaChip('user', impl.by || '-')}
                    ${impl.doc ? ui.metaChip('file-text', impl.doc.name) : ''}
                    ${impl.photo ? ui.metaChip('image', impl.photo.name) : ''}
                  </div>
                </div>`).join('')}
            </div>` : ''}

          <!-- Penerapan Eksisting Standar -->
          <div class="company-practice-list">
            ${(criterion.companyPractice || []).map(p => `
              <div class="legal-item">
                ${ui.icon('check-circle-2')}
                <span>${ui.escapeHtml(p)}</span>
              </div>`).join('')}
          </div>
        </section>

        <!-- 4. ICON EVIDENCE DOKUMEN & DOKUMENTASI/FOTO -->
        <section class="card">
          <div class="card-head">
            <div class="card-title">${ui.icon('folder-open')}Evidence Dokumen & Dokumentasi Foto</div>
            <span class="tiny muted">Bukti sah untuk penilaian PROPER</span>
          </div>

          <div class="evidence-two-col" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:12px">
            <!-- Kolom Dokumen Bukti -->
            <div class="ev-col">
              <div class="aside-title" style="margin-bottom:10px">
                ${ui.icon('file-text')} Dokumen Bukti (PDF / Legal / Laporan)
              </div>
              <div class="ev-doc-list">
                ${(criterion.evidenceDocs || []).map(doc => `
                  <div class="evidence-file-card" data-preview-name="${ui.escapeHtml(doc.name)}">
                    <div class="file-icon-box pdf-box">
                      <span class="file-ext">PDF</span>
                    </div>
                    <div class="file-info-box">
                      <strong>${ui.escapeHtml(doc.name)}</strong>
                      <span>${ui.escapeHtml(doc.type)} · ${doc.size} · ${ui.formatDate(doc.date)}</span>
                    </div>
                    <button class="btn btn--ghost btn--sm btn-preview-file" type="button" title="Lihat Pratinjau">
                      ${ui.icon('eye')}
                    </button>
                  </div>`).join('')}
              </div>
            </div>

            <!-- Kolom Dokumentasi Foto -->
            <div class="ev-col">
              <div class="aside-title" style="margin-bottom:10px">
                ${ui.icon('image')} Dokumentasi / Foto Lapangan
              </div>
              <div class="ev-doc-list">
                ${(criterion.evidencePhotos || []).map(photo => `
                  <div class="evidence-file-card" data-preview-name="${ui.escapeHtml(photo.name)}">
                    <div class="file-icon-box img-box">
                      ${ui.icon('image')}
                    </div>
                    <div class="file-info-box">
                      <strong>${ui.escapeHtml(photo.name)}</strong>
                      <span>${ui.escapeHtml(photo.caption)}</span>
                    </div>
                    <button class="btn btn--ghost btn--sm btn-preview-file" type="button" title="Lihat Foto">
                      ${ui.icon('eye')}
                    </button>
                  </div>`).join('')}
              </div>
            </div>
          </div>
        </section>

        <!-- 5. CHECKLIST INDIKATOR PEMENUHAN -->
        <section class="card">
          <div class="card-head">
            <div class="card-title">${ui.icon('list-checks')}Indikator Pemenuhan Penilaian</div>
            <span class="badge badge--gray">${stats.count} Indikator · Bobot ${stats.total} Poin</span>
          </div>
          <div class="checklist" style="margin-top:12px">
            ${criterion.indicators.map((ind, idx) => `
              <div class="indicator-item-card">
                <div class="ind-head">
                  <div class="ind-num">${idx + 1}</div>
                  <div class="ind-content">
                    <strong>${ui.escapeHtml(ind.title)}</strong>
                    <p>${ui.escapeHtml(ind.desc)}</p>
                  </div>
                  <div class="ind-badge">
                    ${ui.indicatorBadge(rd.effectiveStatus(ind, scope))}
                    <span class="ind-weight">Bobot: ${ind.weight}</span>
                  </div>
                </div>
              </div>`).join('')}
          </div>
        </section>
      </div>`;
  }

  function mount(root, ctx) {
    let id = ctx.id;
    if (id && id.includes('/')) id = id.split('/')[1];

    // Tombol input penerapan langsung di kriteria ini
    const btnInput = document.getElementById('btnInputPenerapanDetail');
    if (btnInput) {
      btnInput.addEventListener('click', () => {
        if (P.views.proper && P.views.proper.openInputModal) {
          P.views.proper.openInputModal(id);
        }
      });
    }

    // Pratinjau dokumen / foto
    document.querySelectorAll('[data-preview-name]').forEach(el => {
      el.addEventListener('click', () => {
        const name = el.getAttribute('data-preview-name');
        ui.modal({
          title: 'Pratinjau Berkas Evidence',
          subtitle: name,
          size: 'md',
          body: `
            <div style="padding:20px;text-align:center;background:#F8FAF9;border-radius:12px;border:1px dashed var(--line)">
              <div style="font-size:42px;color:var(--forest);margin-bottom:10px">
                ${name.endsWith('.pdf') ? ui.icon('file-text') : ui.icon('image')}
              </div>
              <h4 style="color:var(--dark);margin-bottom:6px">${ui.escapeHtml(name)}</h4>
              <p style="font-size:12px;color:var(--slate)">
                Dokumen telah tersimpan dan terverifikasi pada sistem manajemen kepatuhan PERMATA.
              </p>
            </div>`,
          footer: `<button class="btn btn--primary" data-modal-close>Tutup Pratinjau</button>`
        });
      });
    });
  }

  P.views = P.views || {};
  P.views.criteria = { render, mount };
})(window);
