/* PERMATA - Predictive AI & Simulasi Audit
 * Memproyeksikan peringkat PROPER & PERCA berdasarkan sisa waktu audit,
 * ketaatan tiap regulasi, analisis gap "Apa yang bisa dikejar", dan what-if simulator.
 */
(function (global) {
  const P = global.PERMATA = global.PERMATA || {};
  const ui = P.ui;

  // Initial simulation state
  let simState = {
    daysRemaining: 45,
    complianceScore: 79,
    beyondScore: 64,
    b3Score: 75,
    waterScore: 70,
    airScore: 60,
    isoScore: 90,
    percaScore: 82,
    openFindings: 3
  };

  // Base state backup for resetting
  const defaultBase = Object.assign({}, simState);

  // Sinkronkan skor air & udara dengan data riil menu Status Lingkungan Kerja (vs baku mutu regulasi)
  function monitoringSignals() {
    const calc = P.monitoringCalc;
    if (!calc) return null;
    const pick = cats => calc.params.filter(p => cats.indexOf(p.cat) >= 0).map(p => {
      const st = calc.status(p, calc.latest(p).value);
      return { name: p.name, key: st.key };
    });
    const score = list => list.length ? Math.round(list.reduce((s, x) => s + (x.key === 'ok' ? 100 : x.key === 'near' ? 85 : 40), 0) / list.length) : null;
    const water = pick(['water']);
    const air = pick(['emission', 'ambient']);
    return { water, air, waterScore: score(water), airScore: score(air),
      over: water.concat(air).filter(x => x.key === 'over') };
  }

  const MON = monitoringSignals();
  if (MON) {
    if (MON.waterScore !== null) { simState.waterScore = MON.waterScore; defaultBase.waterScore = MON.waterScore; }
    if (MON.airScore !== null) { simState.airScore = MON.airScore; defaultBase.airScore = MON.airScore; }
  }

  // ==============================================================
  // 1. PREDICTIVE AI RATING & PROBABILITY ENGINE
  // ==============================================================
  function calculatePrediction(state) {
    const days = Number(state.daysRemaining);
    const b3 = Number(state.b3Score);
    const water = Number(state.waterScore);
    const air = Number(state.airScore);
    const comp = Number(state.complianceScore);
    const beyond = Number(state.beyondScore);
    const iso = Number(state.isoScore);
    const perca = Number(state.percaScore);
    const findings = Number(state.openFindings);

    // Rate of improvement velocity: how much can be fixed within daysRemaining
    // ~1.5 points per week (7 days) for compliance if prioritized
    const weeks = Math.max(1, days / 7);
    const projectedB3 = Math.min(100, b3 + (weeks * 4));
    const projectedWater = Math.min(100, water + (weeks * 4.5));
    const projectedComp = Math.min(100, (b3 + water + air + comp * 3) / 6 + (weeks * 3.5));
    const projectedBeyond = Math.min(100, beyond + (weeks * 2.2));

    let rank = 'Hijau';
    let rankColor = '#159B63';
    let probEmas = 0;
    let probHijau = 0;
    let probBiru = 0;
    let probMerah = 0;
    let confidence = 92;

    // Critical Blocker Check: If B3 or Water < 70% and days < 14 -> High Red Risk
    if ((b3 < 70 || water < 60) && days < 14) {
      rank = 'Merah';
      rankColor = '#E11D48';
      probMerah = 65;
      probBiru = 30;
      probHijau = 5;
      probEmas = 0;
    } else if (projectedComp < 90) {
      // Compliance won't reach 100% in time -> Blue or Red
      rank = 'Biru';
      rankColor = '#2563EB';
      probBiru = 65;
      probMerah = 20;
      probHijau = 15;
      probEmas = 0;
    } else {
      // Compliance satisfies 100% requirement
      if (projectedBeyond >= 82 && iso >= 90 && perca >= 85 && findings <= 1) {
        rank = 'Emas';
        rankColor = '#D4A72C';
        probEmas = Math.min(85, Math.round(50 + (projectedBeyond - 80) * 2.5));
        probHijau = 100 - probEmas;
        probBiru = 0;
        probMerah = 0;
      } else if (projectedBeyond >= 65 && iso >= 80) {
        rank = 'Hijau';
        rankColor = '#159B63';
        probHijau = Math.min(88, Math.round(60 + (projectedBeyond - 60) * 1.5));
        probEmas = Math.max(5, Math.round((projectedBeyond - 70) * 1.2));
        probBiru = Math.max(5, 100 - probHijau - probEmas);
        probMerah = 0;
      } else {
        rank = 'Biru';
        rankColor = '#2563EB';
        probBiru = 70;
        probHijau = 25;
        probEmas = 5;
        probMerah = 0;
      }
    }

    // Gap analysis generator: What can be sprinted right now
    const actionPlan = generateActionPlan(state, days);

    return {
      rank,
      rankColor,
      confidence,
      probEmas,
      probHijau,
      probBiru,
      probMerah,
      projectedComp: Math.round(projectedComp),
      projectedBeyond: Math.round(projectedBeyond),
      actionPlan
    };
  }

  function generateActionPlan(state, days) {
    const list = [];

    // Priority 1: Critical Blockers (Wajib 100% agar tidak jatuh ke Merah)
    const overList = (monitoringSignals() || { over: [] }).over;
    if (overList.length) {
      list.push({
        type: 'blocker',
        tag: 'CRITICAL BLOCKER',
        title: 'Parameter Melebihi Baku Mutu (Status Lingkungan Kerja)',
        desc: `Terdapat ${overList.length} parameter melebihi baku mutu: ${overList.map(x => x.name).join(', ')}. Pelampauan baku mutu dapat dikenai sanksi (Permen LH 6/2026) dan menggugurkan ketaatan.`,
        deadline: `${Math.min(7, Math.max(2, Math.round(days * 0.15)))} Hari`,
        impact: 'Wajib 100% taat baku mutu',
        actionRoute: '#/monitoring',
        actionLabel: 'Tinjau Pemantauan'
      });
    }
    if (state.b3Score < 95) {
      list.push({
        type: 'blocker',
        tag: 'CRITICAL BLOCKER',
        title: 'Pengelolaan Limbah B3 & Rekonsiliasi FESTRONIK',
        desc: `Ketaatan saat ini ${state.b3Score}%. Masih terdapat gap manifest pihak ketiga dan batas simpan TPS B3. Wajib diselesaikan agar tidak langsung menggugurkan peringkat (risiko jatuh ke Merah).`,
        deadline: `${Math.min(14, Math.max(3, Math.round(days * 0.3)))} Hari`,
        impact: '+12.5% Ketaatan (Kunci Biru/Hijau)',
        actionRoute: '#/proper/kriteria',
        actionLabel: 'Input Penerapan B3'
      });
    }

    if (state.waterScore < 90) {
      list.push({
        type: 'blocker',
        tag: 'CRITICAL BLOCKER',
        title: 'Baku Mutu Outlet Air Limbah (Oil Catcher)',
        desc: `Capaian saat ini ${state.waterScore}%. Pastikan seluruh sertifikat hasil uji lab KAN 12 bulan terakhir lengkap dan debit harian tercatat di SIMPEL.`,
        deadline: `${Math.min(10, Math.max(3, Math.round(days * 0.25)))} Hari`,
        impact: '+8.0% Ketaatan Mutlak',
        actionRoute: '#/monitoring',
        actionLabel: 'Update Uji Air Limbah'
      });
    }

    // Priority 2: Quick Wins Menuju HIJAU
    if (state.isoScore < 100 || state.openFindings > 0) {
      list.push({
        type: 'quickwin',
        tag: 'QUICK WIN MENUJU HIJAU',
        title: 'Closing Temuan Audit Lingkungan Internal (SML ISO 14001)',
        desc: `Terdapat ${state.openFindings} temuan berstatus OPEN. Menutup temuan ini akan langsung menyempurnakan skor SML ISO 14001 ke 100% dan mengamankan status kandidat Hijau.`,
        deadline: `${Math.min(7, Math.max(2, Math.round(days * 0.15)))} Hari`,
        impact: '+5.5 Poin Evaluasi SML',
        actionRoute: '#/audit/tracking',
        actionLabel: 'Tutup Temuan di Tracking'
      });
    }

    if (state.airScore < 85) {
      list.push({
        type: 'quickwin',
        tag: 'QUICK WIN MENUJU HIJAU',
        title: 'Uji Emisi Cerobong Genset & Kalibrasi Sampling Port',
        desc: `Capaian saat ini ${state.airScore}%. Upload bukti uji emisi berkala sesuai Persetujuan Teknis emisi dan dokumentasi sampling port bersertifikat.`,
        deadline: `${Math.min(14, Math.max(5, Math.round(days * 0.35)))} Hari`,
        impact: '+6.0 Poin Ketaatan Udara',
        actionRoute: '#/proper/kriteria',
        actionLabel: 'Input Bukti Emisi'
      });
    }

    // Priority 3: Sprint Menuju EMAS
    if (days >= 25 && state.beyondScore < 85) {
      list.push({
        type: 'goldpush',
        tag: 'SPRINT MENUJU EMAS',
        title: 'Kuantifikasi SROI Inovasi Sosial & Dokumen Ekoinovasi',
        desc: `Untuk meraih Emas, sisa waktu ${days} hari cukup untuk memfinalisasi laporan SROI (target rasio minimal 1:2.5) dan Dokumen Deskripsi Ekoinovasi (DDE) terverifikasi.`,
        deadline: `${Math.round(days * 0.7)} Hari`,
        impact: '+18 Poin Beyond Compliance (Peluang Emas)',
        actionRoute: '#/proper/kriteria',
        actionLabel: 'Detail Inovasi Sosial'
      });
    }

    return list;
  }

  // ==============================================================
  // 2. VIEW RENDER & MOUNT
  // ==============================================================
  function render(ctx) {
    const pred = calculatePrediction(simState);

    return `
      <div>
        <!-- Hero Banner: Projected Rating & Countdown -->
        <div class="pred-hero">
          <div class="pred-hero-content">
            <div class="pred-hero-left">
              <div class="ai-badge ai-badge--sparkle" style="background:rgba(255,255,255,0.2);color:#ffffff;border-color:rgba(255,255,255,0.3)">
                ${ui.icon('sparkles')} Algoritma Prediksi PROPER &amp; PERCA v2.4
              </div>
              <h2>Proyeksi Prediksi: Peringkat ${pred.rank.toUpperCase()}</h2>
              <p>
                Berdasarkan evaluasi terhadap 11 kriteria ketaatan, 7 kelompok beyond compliance, dan sisa waktu 
                <strong>${simState.daysRemaining} hari</strong> menuju verifikasi resmi KLHK, fasilitas Anda diproyeksikan meraih <strong>Peringkat ${pred.rank}</strong> 
                dengan tingkat kepastian model <strong>${pred.confidence}%</strong>.
              </p>
            </div>

            <div class="pred-hero-rank-badge">
              <div class="pred-rank-label">Prediksi Saat Ini</div>
              <div class="pred-rank-value" style="color:${pred.rank === 'Emas' ? '#FFDF00' : pred.rank === 'Hijau' ? '#A7F3D0' : pred.rank === 'Biru' ? '#93C5FD' : '#FECDD3'}">
                ${pred.rank}
              </div>
              <div class="pred-rank-prob">
                ${pred.rank === 'Emas' ? pred.probEmas : pred.rank === 'Hijau' ? pred.probHijau : pred.rank === 'Biru' ? pred.probBiru : pred.probMerah}% Peluang
              </div>
            </div>
          </div>
        </div>

        <!-- Main Simulation & Probability Grid -->
        <div class="pred-grid">
          <!-- Left: What-If Simulation Sliders -->
          <div class="pred-card">
            <div class="pred-card-header">
              <div class="pred-card-title">
                ${ui.icon('sliders')} What-If Simulation (Simulasi Variabel Regulasi)
              </div>
              <button class="btn btn--ghost btn--sm" id="btnResetSim" style="font-size:11px">
                ${ui.icon('rotate-ccw')} Reset Nilai Asli
              </button>
            </div>

            <p style="margin:0 0 16px;font-size:12px;color:var(--slate);line-height:1.5">
              Geser slider regulasi dan sisa hari di bawah untuk melihat bagaimana perubahan progres di lapangan secara langsung memengaruhi prediksi peringkat:
            </p>

            <div class="sim-controls">
              <!-- Days Slider -->
              <div class="sim-control-group">
                <div class="sim-control-top">
                  <span class="sim-control-label">⏳ Sisa Waktu Menuju Audit KLHK</span>
                  <span class="sim-control-val" id="valDays">${simState.daysRemaining} Hari</span>
                </div>
                <input type="range" class="sim-slider" id="sliderDays" min="7" max="90" step="1" value="${simState.daysRemaining}">
              </div>

              <!-- Limbah B3 Slider -->
              <div class="sim-control-group">
                <div class="sim-control-top">
                  <span class="sim-control-label">${ui.icon('package')} Ketaatan Pengelolaan Limbah B3 (FESTRONIK)</span>
                  <span class="sim-control-val" id="valB3">${simState.b3Score}%</span>
                </div>
                <input type="range" class="sim-slider" id="sliderB3" min="50" max="100" step="1" value="${simState.b3Score}">
              </div>

              <!-- Air Limbah Slider -->
              <div class="sim-control-group">
                <div class="sim-control-top">
                  <span class="sim-control-label">${ui.icon('droplets')} Pengendalian Air Limbah (Oil Catcher)</span>
                  <span class="sim-control-val" id="valWater">${simState.waterScore}%</span>
                </div>
                <input type="range" class="sim-slider" id="sliderWater" min="50" max="100" step="1" value="${simState.waterScore}">
              </div>

              <!-- Emisi Udara Slider -->
              <div class="sim-control-group">
                <div class="sim-control-top">
                  <span class="sim-control-label">${ui.icon('wind')} Pengendalian Emisi Udara (Genset/Pompa PMK)</span>
                  <span class="sim-control-val" id="valAir">${simState.airScore}%</span>
                </div>
                <input type="range" class="sim-slider" id="sliderAir" min="40" max="100" step="1" value="${simState.airScore}">
              </div>

              <!-- Beyond Compliance Slider -->
              <div class="sim-control-group">
                <div class="sim-control-top">
                  <span class="sim-control-label">${ui.icon('sparkles')} Beyond Compliance (LCA, SROI &amp; Ekoinovasi)</span>
                  <span class="sim-control-val" id="valBeyond">${simState.beyondScore}%</span>
                </div>
                <input type="range" class="sim-slider" id="sliderBeyond" min="40" max="100" step="1" value="${simState.beyondScore}">
              </div>

              <!-- Temuan Open Slider -->
              <div class="sim-control-group">
                <div class="sim-control-top">
                  <span class="sim-control-label">${ui.icon('list-checks')} Temuan Lingkungan yang Masih OPEN</span>
                  <span class="sim-control-val" id="valFindings">${simState.openFindings} Temuan</span>
                </div>
                <input type="range" class="sim-slider" id="sliderFindings" min="0" max="8" step="1" value="${simState.openFindings}">
              </div>
            </div>
          </div>

          <!-- Right: Probability Distribution & Live Analytics -->
          <div class="pred-card">
            <div class="pred-card-header">
              <div class="pred-card-title">
                ${ui.icon('pie-chart')} Distribusi Probabilitas Peringkat
              </div>
              <span class="ai-badge ai-badge--sparkle">Monte Carlo Simulation</span>
            </div>

            <p style="margin:0 0 16px;font-size:12px;color:var(--slate);line-height:1.5">
              Peluang pencapaian tiap peringkat dengan kombinasi variabel regulasi saat ini:
            </p>

            <div class="pred-prob-bars" id="predProbBars">
              ${renderProbBars(pred)}
            </div>

            <div style="margin-top:20px;padding:14px;background:#F1F8F4;border-radius:12px;border:1px solid #CDE6D8">
              <div style="font-size:12px;font-weight:700;color:var(--forest);margin-bottom:4px;display:flex;align-items:center;gap:6px">
                ${ui.icon('activity')} Proyeksi Skor pada Hari-H:
              </div>
              <div style="display:flex;justify-content:space-between;font-size:12.5px;color:var(--dark);margin-top:8px">
                <span>Proyeksi Ketaatan (Compliance):</span>
                <strong id="liveProjComp">${pred.projectedComp}% (Target &ge; 95%)</strong>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:12.5px;color:var(--dark);margin-top:6px">
                <span>Proyeksi Beyond Compliance:</span>
                <strong id="liveProjBeyond">${pred.projectedBeyond}% (Target &ge; 70%)</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Actionable AI Gap Analysis: "Apa yang Bisa Dikejar" -->
        <div class="pred-card" style="margin-bottom:22px">
          <div class="pred-card-header">
            <div class="pred-card-title">
              ${ui.icon('target')} Rekomendasi AI: Apa yang Bisa Dikejar? (Prioritas Sprint)
            </div>
            <span style="font-size:11.5px;color:var(--slate)">Disortir berdasarkan Dampak Poin vs Sisa Hari</span>
          </div>

          <div class="gap-analysis-list" id="gapAnalysisList">
            ${pred.actionPlan.map(item => renderGapItem(item)).join('')}
          </div>
        </div>

        <!-- Timeline Roadmap 3 Fase -->
        <div class="pred-card">
          <div class="pred-card-header">
            <div class="pred-card-title">
              ${ui.icon('calendar')} Roadmap Sprint Menuju Verifikasi Audit (Sisa ${simState.daysRemaining} Hari)
            </div>
          </div>

          <div class="pred-roadmap">
            <div class="roadmap-phase">
              <div class="roadmap-phase-title">Fase 1 (Hari 1 – 15)</div>
              <h4>Closing Blocker Ketaatan</h4>
              <ul>
                <li>Selesaikan rekonsiliasi manifest FESTRONIK limbah B3 triwulan.</li>
                <li>Uji laboratorium air limbah outlet oil catcher terakreditasi KAN.</li>
                <li>Upload pelaporan RKL-RPL semesteran ke SIMPEL KLHK.</li>
              </ul>
            </div>

            <div class="roadmap-phase">
              <div class="roadmap-phase-title">Fase 2 (Hari 16 – 30)</div>
              <h4>Pra-Audit Internal &amp; ISO 14001</h4>
              <ul>
                <li>Tutup seluruh temuan audit internal berstatus OPEN.</li>
                <li>Lakukan uji emisi cerobong genset darurat dan pompa PMK.</li>
                <li>Simulasi checklist 5 pilar PERCA holding Pertamina.</li>
              </ul>
            </div>

            <div class="roadmap-phase">
              <div class="roadmap-phase-title">Fase 3 (Hari 31 – ${simState.daysRemaining})</div>
              <h4>Finalisasi Dokumen Beyond &amp; Emas</h4>
              <ul>
                <li>Submit Dokumen Ringkasan Kinerja Pengelolaan Lingkungan (DRKPL).</li>
                <li>Finalisasi laporan SROI dan Dokumen Deskripsi Ekoinovasi (DDE).</li>
                <li>Simulasi wawancara Green Leadership Terminal Manager.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderProbBars(pred) {
    return `
      <!-- Emas -->
      <div class="pred-prob-item">
        <div class="pred-prob-info">
          <span style="color:#B58B12;display:flex;align-items:center;gap:4px">
            <span style="width:8px;height:8px;border-radius:50%;background:#D4A72C"></span> Peringkat EMAS
          </span>
          <span id="probValEmas">${pred.probEmas}%</span>
        </div>
        <div class="pred-prob-track">
          <div class="pred-prob-fill" id="probFillEmas" style="width:${pred.probEmas}%;background:linear-gradient(to right, #D4A72C, #F3C64F)"></div>
        </div>
      </div>

      <!-- Hijau -->
      <div class="pred-prob-item">
        <div class="pred-prob-info">
          <span style="color:#0E7C4F;display:flex;align-items:center;gap:4px">
            <span style="width:8px;height:8px;border-radius:50%;background:#159B63"></span> Peringkat HIJAU (Target Utama)
          </span>
          <span id="probValHijau">${pred.probHijau}%</span>
        </div>
        <div class="pred-prob-track">
          <div class="pred-prob-fill" id="probFillHijau" style="width:${pred.probHijau}%;background:linear-gradient(to right, #087B50, #159B63)"></div>
        </div>
      </div>

      <!-- Biru -->
      <div class="pred-prob-item">
        <div class="pred-prob-info">
          <span style="color:#2563EB;display:flex;align-items:center;gap:4px">
            <span style="width:8px;height:8px;border-radius:50%;background:#3B82C4"></span> Peringkat BIRU (Standar Taat)
          </span>
          <span id="probValBiru">${pred.probBiru}%</span>
        </div>
        <div class="pred-prob-track">
          <div class="pred-prob-fill" id="probFillBiru" style="width:${pred.probBiru}%;background:linear-gradient(to right, #2563EB, #60A5FA)"></div>
        </div>
      </div>

      <!-- Merah -->
      <div class="pred-prob-item">
        <div class="pred-prob-info">
          <span style="color:#E11D48;display:flex;align-items:center;gap:4px">
            <span style="width:8px;height:8px;border-radius:50%;background:#E11D48"></span> Peringkat MERAH (Tidak Taat / Pelanggaran)
          </span>
          <span id="probValMerah">${pred.probMerah}%</span>
        </div>
        <div class="pred-prob-track">
          <div class="pred-prob-fill" id="probFillMerah" style="width:${pred.probMerah}%;background:linear-gradient(to right, #E11D48, #F87171)"></div>
        </div>
      </div>
    `;
  }

  function renderGapItem(item) {
    const badgeClass = item.type === 'blocker' ? 'ai-badge--red' : item.type === 'quickwin' ? 'ai-badge--green' : 'ai-badge--gold';

    return `
      <div class="gap-item gap-item--${item.type}">
        <div class="gap-top">
          <span class="gap-title">${ui.escapeHtml(item.title)}</span>
          <span class="ai-badge ${badgeClass}">${item.tag}</span>
        </div>
        <p class="gap-desc">${ui.escapeHtml(item.desc)}</p>
        <div class="gap-footer">
          <span>${ui.icon('calendar-clock')} Target Selesai: <strong>${item.deadline}</strong> • Dampak: <strong>${item.impact}</strong></span>
          <a class="gap-action-btn" href="${item.actionRoute}">
            ${item.actionLabel} ${ui.icon('arrow-right')}
          </a>
        </div>
      </div>
    `;
  }

  function updateLiveSim(root) {
    const pred = calculatePrediction(simState);

    // Update labels
    const heroRank = root.querySelector('.pred-hero-left h2');
    const heroBadgeVal = root.querySelector('.pred-rank-value');
    const heroBadgeProb = root.querySelector('.pred-rank-prob');
    if (heroRank) heroRank.innerHTML = `Proyeksi Prediksi: Peringkat ${pred.rank.toUpperCase()}`;
    if (heroBadgeVal) {
      heroBadgeVal.textContent = pred.rank;
      heroBadgeVal.style.color = pred.rank === 'Emas' ? '#FFDF00' : pred.rank === 'Hijau' ? '#A7F3D0' : pred.rank === 'Biru' ? '#93C5FD' : '#FECDD3';
    }
    if (heroBadgeProb) {
      const p = pred.rank === 'Emas' ? pred.probEmas : pred.rank === 'Hijau' ? pred.probHijau : pred.rank === 'Biru' ? pred.probBiru : pred.probMerah;
      heroBadgeProb.textContent = `${p}% Peluang`;
    }

    // Update Prob Bars
    const fEmas = root.querySelector('#probFillEmas');
    const vEmas = root.querySelector('#probValEmas');
    const fHijau = root.querySelector('#probFillHijau');
    const vHijau = root.querySelector('#probValHijau');
    const fBiru = root.querySelector('#probFillBiru');
    const vBiru = root.querySelector('#probValBiru');
    const fMerah = root.querySelector('#probFillMerah');
    const vMerah = root.querySelector('#probValMerah');

    if (fEmas) fEmas.style.width = `${pred.probEmas}%`;
    if (vEmas) vEmas.textContent = `${pred.probEmas}%`;
    if (fHijau) fHijau.style.width = `${pred.probHijau}%`;
    if (vHijau) vHijau.textContent = `${pred.probHijau}%`;
    if (fBiru) fBiru.style.width = `${pred.probBiru}%`;
    if (vBiru) vBiru.textContent = `${pred.probBiru}%`;
    if (fMerah) fMerah.style.width = `${pred.probMerah}%`;
    if (vMerah) vMerah.textContent = `${pred.probMerah}%`;

    // Update live projected scores
    const projComp = root.querySelector('#liveProjComp');
    const projBeyond = root.querySelector('#liveProjBeyond');
    if (projComp) projComp.textContent = `${pred.projectedComp}% (Target ≥ 95%)`;
    if (projBeyond) projBeyond.textContent = `${pred.projectedBeyond}% (Target ≥ 70%)`;

    // Update Action Plan
    const gapList = root.querySelector('#gapAnalysisList');
    if (gapList) {
      gapList.innerHTML = pred.actionPlan.map(item => renderGapItem(item)).join('');
      ui.refreshIcons();
    }
  }

  function mount(root, ctx) {
    // Bind Sliders
    const sDays = root.querySelector('#sliderDays');
    const vDays = root.querySelector('#valDays');
    if (sDays) {
      sDays.addEventListener('input', () => {
        simState.daysRemaining = Number(sDays.value);
        if (vDays) vDays.textContent = `${simState.daysRemaining} Hari`;
        updateLiveSim(root);
      });
    }

    const sB3 = root.querySelector('#sliderB3');
    const vB3 = root.querySelector('#valB3');
    if (sB3) {
      sB3.addEventListener('input', () => {
        simState.b3Score = Number(sB3.value);
        if (vB3) vB3.textContent = `${simState.b3Score}%`;
        updateLiveSim(root);
      });
    }

    const sWater = root.querySelector('#sliderWater');
    const vWater = root.querySelector('#valWater');
    if (sWater) {
      sWater.addEventListener('input', () => {
        simState.waterScore = Number(sWater.value);
        if (vWater) vWater.textContent = `${simState.waterScore}%`;
        updateLiveSim(root);
      });
    }

    const sAir = root.querySelector('#sliderAir');
    const vAir = root.querySelector('#valAir');
    if (sAir) {
      sAir.addEventListener('input', () => {
        simState.airScore = Number(sAir.value);
        if (vAir) vAir.textContent = `${simState.airScore}%`;
        updateLiveSim(root);
      });
    }

    const sBeyond = root.querySelector('#sliderBeyond');
    const vBeyond = root.querySelector('#valBeyond');
    if (sBeyond) {
      sBeyond.addEventListener('input', () => {
        simState.beyondScore = Number(sBeyond.value);
        if (vBeyond) vBeyond.textContent = `${simState.beyondScore}%`;
        updateLiveSim(root);
      });
    }

    const sFindings = root.querySelector('#sliderFindings');
    const vFindings = root.querySelector('#valFindings');
    if (sFindings) {
      sFindings.addEventListener('input', () => {
        simState.openFindings = Number(sFindings.value);
        if (vFindings) vFindings.textContent = `${simState.openFindings} Temuan`;
        updateLiveSim(root);
      });
    }

    // Reset button
    const btnReset = root.querySelector('#btnResetSim');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        simState = Object.assign({}, defaultBase);
        if (sDays) sDays.value = simState.daysRemaining;
        if (vDays) vDays.textContent = `${simState.daysRemaining} Hari`;
        if (sB3) sB3.value = simState.b3Score;
        if (vB3) vB3.textContent = `${simState.b3Score}%`;
        if (sWater) sWater.value = simState.waterScore;
        if (vWater) vWater.textContent = `${simState.waterScore}%`;
        if (sAir) sAir.value = simState.airScore;
        if (vAir) vAir.textContent = `${simState.airScore}%`;
        if (sBeyond) sBeyond.value = simState.beyondScore;
        if (vBeyond) vBeyond.textContent = `${simState.beyondScore}%`;
        if (sFindings) sFindings.value = simState.openFindings;
        if (vFindings) vFindings.textContent = `${simState.openFindings} Temuan`;
        updateLiveSim(root);
        ui.toast('Nilai simulasi dikembalikan ke kondisi realtime.', 'info');
      });
    }
  }

  P.views = P.views || {};
  P.views.predictive = { render, mount };
  P.predictive = {
    calculate: calculatePrediction,
    getState: () => simState
  };
})(window);
