/* PERMATA - PERCA (Pertamina Environmental Rating & Compliance Assessment)
   Aspek mengacu pada publikasi Pertamina Sustainability Report 2020,
   Environmental Annual Report PHE 2024 (hlm. 60, 63, 79), dan Laporan Keberlanjutan PT Pertamina Gas.
*/
(function (global) {
  const P = global.PERMATA = global.PERMATA || {};
  const data = P.data;
  const ui = P.ui;

  const TARGET = 90;

  const ASPECTS = [
    {
      id: 'p01', no: '01', code: 'PC-01', core: true,
      name: 'Pelaksanaan Dokumen Lingkungan',
      icon: 'file-check-2',
      tagline: 'Persetujuan lingkungan, AMDAL/UKL-UPL, RKL-RPL, dan pelaporannya',
      pic: 'Sari Wulandari',
      description: 'Menilai pemenuhan dokumen dan kewajiban lingkungan yang dimiliki perusahaan, termasuk pelaksanaan serta pelaporannya. Cakupan meliputi Persetujuan Lingkungan, AMDAL/UKL-UPL, RKL-RPL, pelaporan pelaksanaan pengelolaan lingkungan, dan pemenuhan kewajiban yang tercantum dalam persetujuan lingkungan.',
      examples: [
        { title: 'Matriks kewajiban dokumen', text: 'Seluruh komitmen RKL-RPL diturunkan menjadi daftar kewajiban dengan PIC, frekuensi, dan tenggat, lalu dipantau setiap bulan.' },
        { title: 'Pelaporan semesteran', text: 'Laporan pelaksanaan RKL-RPL semester I dan II disampaikan tepat waktu ke SIMPEL/DLH dan bukti tanda terima diarsipkan.' },
        { title: 'Pengelolaan perubahan', text: 'Setiap penambahan tangki, jalur pipa, atau fasilitas baru dikaji dahulu apakah memerlukan perubahan persetujuan lingkungan.' }
      ],
      companyPractice: [
        'Persetujuan lingkungan dan dokumen AMDAL/UKL-UPL fasilitas tersedia dan mutakhir.',
        'Laporan RKL-RPL semester I 2026 telah disampaikan melalui SIMPEL.',
        'Matriks kewajiban lingkungan dipantau oleh fungsi HSSE setiap bulan.'
      ],
      evidenceDocs: [
        { name: 'Persetujuan_Lingkungan_Fasilitas.pdf', type: 'Persetujuan Lingkungan', date: '2025-01-15' },
        { name: 'Laporan_RKL_RPL_Semester_I_2026.pdf', type: 'Laporan Pelaksanaan', date: '2026-06-20' }
      ],
      evidencePhotos: [
        { name: 'Papan_Informasi_Lingkungan.jpg', caption: 'Papan informasi persetujuan lingkungan di area fasilitas' }
      ],
      indicators: [
        { id: 'p01-i1', title: 'Ketersediaan persetujuan lingkungan yang sah', weight: 25, status: 'verified' },
        { id: 'p01-i2', title: 'Pelaksanaan kewajiban RKL-RPL', weight: 25, status: 'verified' },
        { id: 'p01-i3', title: 'Pelaporan pelaksanaan pengelolaan lingkungan tepat waktu', weight: 25, status: 'verified' },
        { id: 'p01-i4', title: 'Pemenuhan kewajiban lain dalam persetujuan lingkungan', weight: 25, status: 'pending' }
      ]
    },
    {
      id: 'p02', no: '02', code: 'PC-02', core: true,
      name: 'Pengendalian Pencemaran Air',
      icon: 'droplets',
      tagline: 'Pengelolaan air limbah dan ketaatan baku mutu',
      pic: 'Nabila Putri',
      description: 'Menilai pengelolaan air limbah dan kepatuhan terhadap ketentuan pengendalian pencemaran air, mulai dari kompetensi personel, pemantauan dan pelaporan, hingga pemenuhan baku mutu parameter air limbah.',
      examples: [
        { title: 'Operasional OWS', text: 'Air limpasan area loading dan tangki dialirkan ke Oil-Water Separator; minyak terpisah ditampung sebagai limbah B3.' },
        { title: 'Pemantauan rutin', text: 'Sampling bulanan di titik penaatan untuk parameter pH, TSS, COD, NH3-N, minyak & lemak, serta pencatatan debit harian.' },
        { title: 'Personel bersertifikat', text: 'Operator pengolahan air limbah memiliki sertifikat kompetensi (POPAL/PPPA).' }
      ],
      companyPractice: [
        'OWS 3 kompartemen beroperasi dan dirawat terjadwal.',
        'Pengujian air limbah bulanan oleh laboratorium terakreditasi KAN.',
        'Logbook debit harian dan pelaporan triwulanan tersedia.'
      ],
      evidenceDocs: [
        { name: 'Hasil_Uji_Air_Limbah_Mei_2026.pdf', type: 'Sertifikat Hasil Uji', date: '2026-05-28' },
        { name: 'Sertifikat_Kompetensi_POPAL.pdf', type: 'Kompetensi Personel', date: '2025-09-12' }
      ],
      evidencePhotos: [
        { name: 'Unit_OWS_Area_Loading.jpg', caption: 'Unit Oil-Water Separator area loading' }
      ],
      indicators: [
        { id: 'p02-i1', title: 'Kompetensi personel pengelolaan pencemaran air', weight: 30, status: 'verified' },
        { id: 'p02-i2', title: 'Ketaatan pemantauan dan pelaporan', weight: 35, status: 'verified' },
        { id: 'p02-i3', title: 'Pemenuhan baku mutu (pH, TSS, COD, NH3-N, debit)', weight: 35, status: 'pending' }
      ]
    },
    {
      id: 'p03', no: '03', code: 'PC-03', core: true,
      name: 'Pengelolaan Limbah B3',
      icon: 'triangle-alert',
      tagline: 'Dari sumber hingga penyerahan kepada pengelola berizin',
      pic: 'Rizky Anggara',
      description: 'Menilai kepatuhan perusahaan dalam mengelola limbah Bahan Berbahaya dan Beracun dari sumber hingga penyerahan kepada pengelola berizin, termasuk perizinan, neraca, penanganan lahan terkontaminasi, kompetensi personel, dan sistem tanggap darurat.',
      examples: [
        { title: 'TPS Limbah B3', text: 'Oli bekas, sludge tangki, dan majun terkontaminasi disimpan di TPS berizin dengan simbol, label, dan secondary containment.' },
        { title: 'Neraca & manifest', text: 'Neraca limbah B3 disusun per triwulan dan setiap pengangkutan tercatat pada manifest elektronik (Festronik).' },
        { title: 'Tanggap darurat', text: 'Spill kit tersedia di TPS dan area tangki, serta dilakukan simulasi tumpahan minimal satu kali per tahun.' }
      ],
      companyPractice: [
        'Rincian teknis TPS limbah B3 telah disetujui.',
        'Neraca limbah B3 triwulan II 2026 lengkap.',
        'Penyerahan limbah hanya kepada transporter dan pengolah berizin.'
      ],
      evidenceDocs: [
        { name: 'Rintek_TPS_Limbah_B3.pdf', type: 'Perizinan', date: '2025-02-11' },
        { name: 'Neraca_Limbah_B3_Q2_2026.pdf', type: 'Neraca', date: '2026-06-15' },
        { name: 'Manifest_Festronik_Juni_2026.pdf', type: 'Bukti Penyerahan', date: '2026-06-18' }
      ],
      evidencePhotos: [
        { name: 'TPS_Limbah_B3.jpg', caption: 'TPS limbah B3 beratap dan berlantai kedap' }
      ],
      indicators: [
        { id: 'p03-i1', title: 'Perizinan pengelolaan limbah B3', weight: 20, status: 'verified' },
        { id: 'p03-i2', title: 'Neraca limbah B3', weight: 20, status: 'verified' },
        { id: 'p03-i3', title: 'Penanganan lahan terkontaminasi limbah B3', weight: 15, status: 'pending' },
        { id: 'p03-i4', title: 'Kepatuhan penyerahan limbah kepada pihak ketiga', weight: 20, status: 'verified' },
        { id: 'p03-i5', title: 'Kompetensi personel pengelola limbah B3', weight: 10, status: 'verified' },
        { id: 'p03-i6', title: 'Ketersediaan sistem tanggap darurat', weight: 15, status: 'revisi' }
      ]
    },
    {
      id: 'p04', no: '04', code: 'PC-04', core: true,
      name: 'Pengendalian Pencemaran Udara',
      icon: 'wind',
      tagline: 'Emisi sumber operasional, pemantauan, dan pelaporan',
      pic: 'Dimas Prasetyo',
      description: 'Menilai pengendalian emisi dari sumber kegiatan operasional serta kepatuhan pemantauan dan pelaporannya, termasuk pelaporan beban emisi gas rumah kaca (CO2, CH4, N2O) dan non-GRK (CO, NO2, opasitas).',
      examples: [
        { title: 'Inventarisasi sumber emisi', text: 'Genset, fire pump engine, dan sumber uap BBM didata lengkap dengan kapasitas dan jam operasi.' },
        { title: 'Uji emisi berkala', text: 'Cerobong genset diuji semesteran untuk parameter CO, NO2, SO2, partikulat, dan opasitas.' },
        { title: 'Inventarisasi GRK', text: 'Beban emisi CO2, CH4, dan N2O dihitung dari konsumsi bahan bakar dan listrik, lalu dilaporkan tahunan.' }
      ],
      companyPractice: [
        'Cerobong genset dilengkapi lubang sampling dan akses aman.',
        'Uji emisi genset semester I 2026 memenuhi baku mutu.',
        'Perhitungan beban emisi GRK 2025 telah disusun.'
      ],
      evidenceDocs: [
        { name: 'Hasil_Uji_Emisi_Genset_2026.pdf', type: 'Sertifikat Hasil Uji', date: '2026-05-18' },
        { name: 'Laporan_Beban_Emisi_GRK_2025.pdf', type: 'Inventarisasi GRK', date: '2026-02-20' }
      ],
      evidencePhotos: [
        { name: 'Cerobong_Genset.jpg', caption: 'Cerobong genset dengan sampling port' }
      ],
      indicators: [
        { id: 'p04-i1', title: 'Kompetensi personel pengelolaan pencemaran udara', weight: 20, status: 'verified' },
        { id: 'p04-i2', title: 'Ketaatan pemantauan dan pelaporan', weight: 25, status: 'verified' },
        { id: 'p04-i3', title: 'Pemenuhan baku mutu emisi', weight: 30, status: 'verified' },
        { id: 'p04-i4', title: 'Pelaporan beban emisi GRK dan non-GRK', weight: 25, status: 'pending' }
      ]
    },
    {
      id: 'p05', no: '05', code: 'PC-05', core: false,
      name: 'Pemulihan Lingkungan dan Penegakan Hukum',
      icon: 'scale',
      tagline: 'Aspek tambahan: pemulihan lingkungan dan kepatuhan sanksi (Gakkum)',
      pic: 'Rangga Aditya',
      description: 'Meliputi tindak lanjut pemulihan lingkungan serta kepatuhan terhadap sanksi atau tindakan penegakan hukum apabila terdapat pelanggaran. Aspek ini dicantumkan dalam laporan keberlanjutan PT Pertamina Gas; publikasi lain menampilkan empat aspek utama saja, sehingga cakupannya perlu dikonfirmasi untuk tiap entitas dan periode.',
      examples: [
        { title: 'Pemulihan lahan', text: 'Lahan yang pernah terpapar tumpahan BBM dipulihkan sesuai rencana pemulihan dan diverifikasi dengan uji tanah.' },
        { title: 'Tindak lanjut sanksi', text: 'Jika ada sanksi administratif, setiap butir perintah ditindaklanjuti dengan bukti dan dilaporkan sesuai tenggat.' }
      ],
      companyPractice: [
        'Tidak terdapat sanksi administratif aktif pada periode berjalan.',
        'Register kejadian tumpahan dan status pemulihannya dipelihara.'
      ],
      evidenceDocs: [
        { name: 'Register_Pemulihan_Lahan.pdf', type: 'Register', date: '2026-04-30' }
      ],
      evidencePhotos: [],
      indicators: [
        { id: 'p05-i1', title: 'Tindak lanjut pemulihan lingkungan', weight: 50, status: 'verified' },
        { id: 'p05-i2', title: 'Kepatuhan terhadap sanksi / tindakan penegakan hukum', weight: 50, status: 'verified' }
      ]
    }
  ];

  const STATUS = {
    verified: { label: 'Terpenuhi', tone: 'green' },
    pending: { label: 'Menunggu verifikasi', tone: 'amber' },
    revisi: { label: 'Perlu perbaikan', tone: 'red' },
    empty: { label: 'Belum diisi', tone: 'gray' }
  };

  function aspect(id) { return ASPECTS.find(a => a.id === id); }

  function implementations(id) {
    return P.state && P.state.implementationsFor ? P.state.implementationsFor(id) : [];
  }

  function score(a) {
    const total = a.indicators.reduce((s, i) => s + i.weight, 0);
    let verified = a.indicators.filter(i => i.status === 'verified').reduce((s, i) => s + i.weight, 0);
    implementations(a.id).forEach(impl => { verified += impl.status === 'in_process' ? 10 : 20; });
    return total ? Math.min(100, Math.round((verified / total) * 100)) : 0;
  }

  function rows() {
    return ASPECTS.map(a => ({ aspect: a, score: score(a) }));
  }

  function index() {
    const list = rows();
    return Math.round(list.reduce((s, r) => s + r.score, 0) / list.length);
  }

  function statusOf(pct) {
    if (pct >= 100) return { label: 'Terpenuhi', tone: 'green' };
    if (pct >= 70) return { label: 'Dalam proses', tone: 'amber' };
    return { label: 'Perlu perhatian', tone: 'red' };
  }

  /* ---------------- Halaman daftar ---------------- */
  function renderList(ctx) {
    const list = rows();
    const idx = index();
    const core = list.filter(r => r.aspect.core);
    const coreAvg = Math.round(core.reduce((s, r) => s + r.score, 0) / core.length);
    const extra = list.find(r => !r.aspect.core);
    const below = list.filter(r => r.score < TARGET);

    return `
      <div class="achievement-grid">
        <div class="ach-card ach-rank">
          <div class="rank-mini">
            <canvas id="percaDonut" aria-label="Indeks PERCA"></canvas>
            <div class="donut-center">
              <span class="donut-rank" style="font-size:22px">${idx}<small style="font-size:12px;font-weight:700">%</small></span>
              <span class="donut-period">${ctx.scope.period}</span>
            </div>
          </div>
          <div class="ach-rank-copy">
            <div class="ach-label">${ui.icon('gauge')}Indeks Kesiapan PERCA (internal)</div>
            <h3>${idx}% terpenuhi</h3>
            <p>${list.length} aspek penilaian · target internal ${TARGET}%</p>
          </div>
        </div>
        <div class="ach-card">
          <div class="ach-label">${ui.icon('shield-check')}Aspek Utama</div>
          <div class="ach-value">${coreAvg}%</div>
          <div class="ach-sub">Rata-rata 4 aspek utama PERCA</div>
          ${ui.progress(coreAvg, '', 'progress--lg')}
        </div>
        <div class="ach-card">
          <div class="ach-label">${ui.icon('scale')}Pemulihan & Gakkum</div>
          <div class="ach-value">${extra ? extra.score : 0}%</div>
          <div class="ach-sub">Aspek tambahan sesuai publikasi Pertamina Gas</div>
          ${ui.progress(extra ? extra.score : 0, 'lime', 'progress--lg')}
        </div>
        <div class="ach-card ach-target-card">
          <h3>${below.length ? below.length + ' aspek di bawah target' : 'Seluruh aspek sesuai target'}</h3>
          <p>${below.length ? 'Prioritaskan: ' + below.map(r => ui.escapeHtml(r.aspect.name)).join(', ') + '.' : 'Pertahankan konsistensi pemantauan dan pelaporan.'}</p>
        </div>
      </div>

      <div class="proper-layout">
        <div class="proper-main">
          <div class="tab-bar">
            <div class="tabs"><span class="tab active">${ui.icon('list-checks')}Aspek Penilaian PERCA</span></div>
            <div class="tab-actions">
              <button class="btn btn--primary btn--sm" type="button" data-perca-input>${ui.icon('plus')}Input Penerapan</button>
            </div>
          </div>
          <section class="panel criteria-card">
            <div class="criteria-card-head">
              <div class="row">
                <div>
                  <h3>Aspek Penilaian PERCA</h3>
                  <p>${list.length} aspek · ${list.length - below.length} ≥ target ${TARGET}%</p>
                </div>
                <span class="criteria-pct">${idx}%</span>
              </div>
              ${ui.progress(idx)}
            </div>
            <div class="criteria-list">
              ${list.map(r => `
                <button class="criteria-row" type="button" data-perca="${r.aspect.id}">
                  <span class="crit-num">${r.aspect.no}</span>
                  <span class="crit-ico">${ui.icon(r.aspect.icon)}</span>
                  <span class="crit-name">${ui.escapeHtml(r.aspect.name)}${r.aspect.core ? '' : ' <small class="muted">(tambahan)</small>'}</span>
                  <div class="crit-bar">${ui.progress(r.score, r.aspect.core ? '' : 'lime')}</div>
                  <span class="crit-val">${r.score}%</span>
                  <span class="crit-chevron">${ui.icon('chevron-right')}</span>
                </button>`).join('')}
            </div>
          </section>
        </div>
        <aside class="proper-aside">
          <section class="panel">
            <div class="panel-title">${ui.icon('info')}Catatan Cakupan</div>
            <p class="panel-sub" style="margin-top:8px;line-height:1.55">
              Pertamina Sustainability Report 2020 dan diagram PERCA PHE 2024 menampilkan empat aspek utama.
              Laporan PT Pertamina Gas menambahkan aspek Pemulihan Lingkungan dan Penegakan Hukum.
              Konfirmasikan cakupan yang berlaku untuk entitas dan periode penilaian Anda.
            </p>
            <p class="tiny muted" style="margin-top:10px">Sumber indikator: Environmental Annual Report PHE 2024, hlm. 60, 63, dan 79.</p>
          </section>
        </aside>
      </div>`;
  }

  /* ---------------- Halaman detail ---------------- */
  function renderDetail(ctx) {
    const a = aspect(ctx.id);
    if (!a) {
      return `<div class="card">${ui.empty('file-question', 'Aspek tidak ditemukan', 'Aspek PERCA yang Anda tuju tidak tersedia.')}
        <div style="display:flex;justify-content:center;margin-top:12px"><a class="btn btn--primary" href="#/perca">Kembali ke PERCA</a></div></div>`;
    }
    const pct = score(a);
    const st = statusOf(pct);
    const impls = implementations(a.id);
    const verifiedCount = a.indicators.filter(i => i.status === 'verified').length;

    return `
      <div class="breadcrumb">
        <a href="#/dashboard">Overview</a>${ui.icon('chevron-right')}
        <a href="#/perca">PERCA</a>${ui.icon('chevron-right')}
        <span class="active">${a.code} · ${ui.escapeHtml(a.name)}</span>
      </div>

      <section class="crit-hero">
        <div class="crit-hero-top">
          <div>
            <div class="crit-eyebrow">PERCA · ASPEK ${a.no}${a.core ? '' : ' (TAMBAHAN)'}</div>
            <h1>${a.no}. ${ui.escapeHtml(a.name)}</h1>
            <p class="crit-tagline">${ui.escapeHtml(a.tagline)}</p>
            <div class="meta" style="margin-top:10px">
              ${ui.metaChip('map-pin', data.facilityName(ctx.scope.facility))}
              ${ui.metaChip('calendar-days', 'Periode ' + ctx.scope.period)}
              ${ui.metaChip('user', 'PIC: ' + a.pic)}
            </div>
          </div>
          <div class="hero-actions">
            ${ui.badge(st.label, st.tone, true)}
            <button class="btn btn--primary" type="button" data-perca-input="${a.id}">${ui.icon('plus')}Input Penerapan</button>
            <a class="btn btn--ghost" href="#/perca">${ui.icon('arrow-left')}Kembali</a>
          </div>
        </div>
      </section>

      <section class="card progress-hero-card" style="margin-bottom:16px">
        <div class="progress-hero">
          <div>
            <div class="progress-big">${pct}<small>%</small></div>
            <div class="progress-meta">${verifiedCount} dari ${a.indicators.length} indikator terpenuhi</div>
          </div>
          <div class="progress-mid">
            ${ui.progress(pct, pct >= 80 ? '' : pct >= 60 ? 'amber' : 'red', 'progress--lg')}
            <div class="progress-meta" style="margin-top:6px">Termasuk ${impls.length} penerapan yang diinput pengguna</div>
          </div>
          <div class="progress-targets">
            <div class="target-row"><span>Target internal</span><strong>${TARGET}%</strong></div>
            <div class="target-row"><span>Evidence</span><strong>${a.evidenceDocs.length} dokumen · ${a.evidencePhotos.length} foto</strong></div>
          </div>
        </div>
      </section>

      <div class="crit-content-grid">
        <section class="card">
          <div class="card-head"><div class="card-title">${ui.icon('book-open')}Deskripsi Penilaian</div></div>
          <p class="section-sub" style="font-size:13.5px;line-height:1.65;color:var(--dark)">${ui.escapeHtml(a.description)}</p>
        </section>

        <section class="card">
          <div class="card-head"><div class="card-title">${ui.icon('lightbulb')}Contoh Penerapan</div></div>
          <div class="practice-list">
            ${a.examples.map(ex => `
              <div class="practice-item">
                <div class="practice-content"><strong>${ui.escapeHtml(ex.title)}</strong><p>${ui.escapeHtml(ex.text)}</p></div>
              </div>`).join('')}
          </div>
        </section>

        <section class="card">
          <div class="card-head"><div class="card-title">${ui.icon('list-checks')}Indikator Penilaian</div></div>
          <div class="checklist">
            ${a.indicators.map((ind, i) => `
              <div class="indicator-item-card">
                <div class="ind-head">
                  <div class="ind-num">${i + 1}</div>
                  <div class="ind-content"><strong>${ui.escapeHtml(ind.title)}</strong></div>
                  <div class="ind-badge">${ui.badge(STATUS[ind.status].label, STATUS[ind.status].tone)}<span class="ind-weight">Bobot ${ind.weight}</span></div>
                </div>
              </div>`).join('')}
          </div>
        </section>

        <section class="card">
          <div class="card-head"><div class="card-title">${ui.icon('building-2')}Bentuk Penerapan Kita</div></div>
          ${impls.length ? `
            <div class="impl-list" style="margin-bottom:12px">
              ${impls.map(impl => `
                <div class="impl-item">
                  <div class="impl-head"><strong>${ui.escapeHtml(impl.title)}</strong>${ui.badge(impl.status === 'in_process' ? 'Dalam proses' : 'Terpenuhi', impl.status === 'in_process' ? 'amber' : 'green')}</div>
                  ${impl.description ? `<p style="font-size:12.5px;color:var(--slate);margin:6px 0">${ui.escapeHtml(impl.description)}</p>` : ''}
                  <div class="impl-meta">
                    ${ui.metaChip('calendar-days', ui.formatDate(impl.date))}
                    ${impl.doc ? ui.metaChip('file-text', impl.doc.name) : ''}
                    ${impl.photo ? ui.metaChip('image', impl.photo.name) : ''}
                  </div>
                </div>`).join('')}
            </div>` : ''}
          <div class="legal-list">
            ${a.companyPractice.map(p => `<div class="legal-item">${ui.icon('check')}<span>${ui.escapeHtml(p)}</span></div>`).join('')}
          </div>
        </section>

        <section class="card">
          <div class="card-head"><div class="card-title">${ui.icon('folder-open')}Evidence Dokumen & Foto</div></div>
          <div class="evidence-two-col">
            <div class="ev-doc-list">
              ${a.evidenceDocs.map(d => `
                <div class="evidence-file-card" data-perca-preview="${ui.escapeHtml(d.name)}">
                  <div class="file-icon-box pdf-box">PDF</div>
                  <div class="file-info-box"><strong>${ui.escapeHtml(d.name)}</strong><span>${ui.escapeHtml(d.type)} · ${ui.formatDate(d.date)}</span></div>
                </div>`).join('')}
            </div>
            <div class="ev-doc-list">
              ${a.evidencePhotos.length ? a.evidencePhotos.map(ph => `
                <div class="evidence-file-card" data-perca-preview="${ui.escapeHtml(ph.name)}">
                  <div class="file-icon-box img-box">${ui.icon('image')}</div>
                  <div class="file-info-box"><strong>${ui.escapeHtml(ph.name)}</strong><span>${ui.escapeHtml(ph.caption)}</span></div>
                </div>`).join('') : '<p class="tiny muted">Belum ada dokumentasi foto.</p>'}
            </div>
          </div>
        </section>
      </div>`;
  }

  function render(ctx) {
    return ctx.id ? renderDetail(ctx) : renderList(ctx);
  }

  /* ---------------- Input penerapan ---------------- */
  function openInput(preselect) {
    ui.modal({
      title: 'Input Penerapan PERCA',
      subtitle: 'Penerapan yang disimpan langsung menambah progres aspek dan indeks PERCA di Overview.',
      size: 'lg',
      body: `
        <form class="modal-form" style="display:flex;flex-direction:column;gap:12px" onsubmit="return false">
          <label class="field"><span>Aspek PERCA</span>
            <select class="input" id="pcAspect" style="width:100%">
              ${ASPECTS.map(a => `<option value="${a.id}"${a.id === preselect ? ' selected' : ''}>${a.code} · ${ui.escapeHtml(a.name)}</option>`).join('')}
            </select>
          </label>
          <label class="field"><span>Nama penerapan *</span><input class="input" id="pcTitle" type="text" style="width:100%" placeholder="Contoh: Pelaporan RKL-RPL semester I via SIMPEL"></label>
          <label class="field"><span>Deskripsi *</span><textarea class="input" id="pcDesc" rows="3" style="width:100%" placeholder="Jelaskan bentuk penerapan di lapangan"></textarea></label>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <label class="field"><span>Dokumen bukti</span><input class="input" id="pcDoc" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" style="width:100%"></label>
            <label class="field"><span>Foto dokumentasi</span><input class="input" id="pcPhoto" type="file" accept="image/*" style="width:100%"></label>
          </div>
          <label class="field"><span>Status</span>
            <select class="input" id="pcStatus" style="width:100%">
              <option value="verified">Terpenuhi</option>
              <option value="in_process">Dalam proses</option>
            </select>
          </label>
        </form>`,
      footer: `<button class="btn btn--ghost" data-modal-close type="button">Batal</button>
               <button class="btn btn--primary" type="button" id="pcSave">${ui.icon('check')}Simpan</button>`,
      onMount: overlay => {
        overlay.querySelector('#pcSave').addEventListener('click', () => {
          const id = overlay.querySelector('#pcAspect').value;
          const title = overlay.querySelector('#pcTitle').value.trim();
          const desc = overlay.querySelector('#pcDesc').value.trim();
          if (!title || !desc) { ui.toast('Lengkapi nama dan deskripsi penerapan.', 'error'); return; }
          const doc = overlay.querySelector('#pcDoc').files[0];
          const photo = overlay.querySelector('#pcPhoto').files[0];
          const a = aspect(id);
          P.state.addImplementation({
            criterionId: id,
            criterionCode: a.code,
            scopeKey: P.state.scopeKey(P.state.scope()),
            title,
            description: desc,
            form: 'Penerapan PERCA',
            date: data.TODAY || new Date().toISOString().slice(0, 10),
            by: data.profile.name,
            status: overlay.querySelector('#pcStatus').value,
            doc: doc ? { name: doc.name, size: doc.size } : null,
            photo: photo ? { name: photo.name, size: photo.size } : null
          });
          ui.closeModal();
          ui.toast('Penerapan PERCA tersimpan. Progres dan grafik diperbarui.');
          P.nav.navigate('#/perca/' + id);
        });
      }
    });
  }

  function mount(root, ctx) {
    if (P.charts && P.charts.ready()) {
      const c = root.querySelector('#percaDonut');
      if (c) P.charts.readinessDonut(c, index());
    }
    root.querySelectorAll('[data-perca]').forEach(btn => {
      btn.addEventListener('click', () => P.nav.navigate('#/perca/' + btn.getAttribute('data-perca')));
    });
    root.querySelectorAll('[data-perca-input]').forEach(btn => {
      btn.addEventListener('click', () => openInput(btn.getAttribute('data-perca-input') || ctx.id));
    });
    root.querySelectorAll('[data-perca-preview]').forEach(el => {
      el.addEventListener('click', () => {
        const name = el.getAttribute('data-perca-preview');
        ui.modal({
          title: 'Pratinjau Evidence',
          subtitle: name,
          body: `<div style="padding:24px;text-align:center;background:var(--bg);border-radius:12px">
                   <strong>${ui.escapeHtml(name)}</strong>
                   <p class="tiny muted" style="margin-top:6px">Berkas contoh pada mode demo.</p></div>`,
          footer: '<button class="btn btn--primary" data-modal-close>Tutup</button>'
        });
      });
    });
  }

  P.percaCalc = { aspects: ASPECTS, rows, index, score, TARGET };
  P.views = P.views || {};
  P.views.perca = { render, mount };
})(window);
