/* PERMATA - Dashboard Overview (Kinerja Lingkungan, PROPER, PERCA, ISO 14001, & Lingkungan Kerja) */
(function (global) {
  const P = global.PERMATA = global.PERMATA || {};
  const data = P.data;
  const ui = P.ui;
  const rd = P.readiness;

  function render(ctx) {
    const scope = ctx.scope;
    const snapshot = rd.properSnapshot(scope);
    const summary = data.obligationSummary(scope.period, scope.facility);
    const attention = data.attentionFor(scope.facility);
    const facilityName = data.facilityName(scope.facility);

    const rankLabel = snapshot.rank === 'Belum Ditetapkan' ? 'Belum Ditetapkan' : 'Peringkat ' + snapshot.rank;
    const overall = snapshot.overall;

    // Hitung dinamis nilai PERCA, Status Pemantauan, dan Temuan
    const percaIdx = P.percaCalc ? P.percaCalc.index() : 90;
    const monSummary = P.monitoringCalc ? P.monitoringCalc.summary() : { total: 20, ok: 20, near: 0, over: 0 };
    const findingsList = P.state ? P.state.findings() : [];
    const openCount = findingsList.filter(f => f.status === 'open').length;
    const procCount = findingsList.filter(f => f.status === 'in_process').length;
    const closedCount = findingsList.filter(f => f.status === 'closed').length;

    return `
      <div class="dash-stack">
        <!-- TOP KPI METRICS (Clean & Modern) -->
        <div class="kpi-grid">
          <article class="kpi-card">
            <div class="kpi-icon">${ui.icon('gauge')}</div>
            <div class="kpi-main">
              <span class="kpi-label">Kepatuhan Lingkungan</span>
              <strong class="kpi-value">${summary.complianceRate}%</strong>
              <div class="kpi-note">${facilityName}</div>
            </div>
          </article>

          <article class="kpi-card">
            <div class="kpi-icon">${ui.icon('award')}</div>
            <div class="kpi-main">
              <span class="kpi-label">Kesiapan PROPER</span>
              <strong class="kpi-value">${overall}%</strong>
              <div class="kpi-note">${rankLabel} · Periode ${scope.period}</div>
            </div>
            <button class="kpi-go" type="button" data-go-proper aria-label="Buka PROPER">${ui.icon('arrow-up-right')}</button>
          </article>

          <article class="kpi-card">
            <div class="kpi-icon">${ui.icon('scale')}</div>
            <div class="kpi-main">
              <span class="kpi-label">Indeks Capaian PERCA</span>
              <strong class="kpi-value">${percaIdx}%</strong>
              <div class="kpi-note">Peringkat Utama Daerah</div>
            </div>
            <button class="kpi-go" type="button" data-go-perca aria-label="Buka PERCA">${ui.icon('arrow-up-right')}</button>
          </article>

          <article class="kpi-card">
            <div class="kpi-icon">${ui.icon('list-checks')}</div>
            <div class="kpi-main">
              <span class="kpi-label">Tracking Temuan</span>
              <strong class="kpi-value">${findingsList.length} <span style="font-size:14px;font-weight:550;color:var(--slate)">Temuan</span></strong>
              <div class="kpi-note">
                <span style="color:var(--red);font-weight:600">${openCount} OPEN</span> · 
                <span style="color:var(--amber);font-weight:600">${procCount} PROCESS</span> · 
                <span style="color:var(--forest);font-weight:600">${closedCount} CLOSED</span>
              </div>
            </div>
            <button class="kpi-go" type="button" data-go-findings aria-label="Buka Tracking Temuan">${ui.icon('arrow-up-right')}</button>
          </article>
        </div>

        <!-- 4 GRAFIK UTAMA PENGELOLAAN LINGKUNGAN (STYLE & SHAPE SERAGAM DENGAN PROPER) -->
        <div class="dash-grid-2x2">
          <!-- 1. GRAFIK PROPER -->
          <section class="panel chart-panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">${ui.icon('award')}Kinerja & Kesiapan PROPER</div>
                <div class="panel-sub">Evaluasi kesiapan 11 kriteria ketaatan dan 7 beyond compliance.</div>
              </div>
              <a class="link-more" href="#/proper/kriteria">Detail PROPER ${ui.icon('arrow-right')}</a>
            </div>
            <div class="chart-panel-body">
              <div class="donut-wrap">
                <canvas id="rankDonut" width="160" height="160"></canvas>
                <div class="donut-center">
                  <span class="donut-rank">${snapshot.rank}</span>
                  <span class="donut-period">${scope.period}</span>
                </div>
              </div>
              <div class="chart-side-info">
                <div class="metric-row">
                  <div class="metric-header">
                    <span>Kriteria Ketaatan (11 Aspek)</span>
                    <strong>${snapshot.compliance.score}%</strong>
                  </div>
                  ${ui.progress(snapshot.compliance.score)}
                </div>
                <div class="metric-row" style="margin-top:12px">
                  <div class="metric-header">
                    <span>Beyond Compliance (7 Kelompok)</span>
                    <strong>${snapshot.beyond.score}%</strong>
                  </div>
                  ${ui.progress(snapshot.beyond.score, 'lime')}
                </div>
                <div class="status-chip-row" style="margin-top:14px">
                  <span class="badge badge--green"><span class="dot"></span>${rankLabel}</span>
                  <span class="badge badge--gray">${overall}% Siap Audit</span>
                </div>
              </div>
            </div>
          </section>

          <!-- 2. GRAFIK PERCA -->
          <section class="panel chart-panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">${ui.icon('scale')}Capaian Kinerja PERCA</div>
                <div class="panel-sub">Program Penilaian Peringkat Kinerja Pengelolaan Lingkungan Daerah.</div>
              </div>
              <a class="link-more" href="#/perca">Detail PERCA ${ui.icon('arrow-right')}</a>
            </div>
            <div class="chart-canvas-box">
              <canvas id="percaCanvas" height="180"></canvas>
            </div>
            <div class="panel-foot-note">
              <span>Rata-rata pemenuhan pilar PERCA: <strong>${percaIdx}%</strong> (melampaui target minimum 90%).</span>
            </div>
          </section>

          <!-- 3. GRAFIK ISO 14001:2015 -->
          <section class="panel chart-panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">${ui.icon('shield-check')}Sistem Manajemen Lingkungan (ISO 14001:2015)</div>
                <div class="panel-sub">Tingkat pemenuhan klausul SML & efektivitas pengendalian operasional.</div>
              </div>
              <span class="badge badge--green">95% Temuan Ditutup</span>
            </div>
            <div class="chart-canvas-box">
              <canvas id="isoCanvas" height="180"></canvas>
            </div>
            <div class="panel-foot-note">
              <span>Seluruh klausul audit internal telah terverifikasi dengan tindakan korektif aktif.</span>
            </div>
          </section>

          <!-- 4. GRAFIK STATUS PENGUKURAN LINGKUNGAN KERJA TERAKHIR -->
          <section class="panel chart-panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">${ui.icon('activity')}Pengukuran Lingkungan Kerja Terakhir</div>
                <div class="panel-sub">Kebisingan, air limbah, emisi genset, udara ambien vs Baku Mutu (BML).</div>
              </div>
              <a class="link-more" href="#/monitoring">Lihat BML ${ui.icon('arrow-right')}</a>
            </div>
            <div class="chart-canvas-box">
              <canvas id="envWorkCanvas" height="180"></canvas>
            </div>
            <div class="panel-foot-note">
              <span>Status pemantauan: <strong>${monSummary.ok} parameter memenuhi</strong>${monSummary.near ? `, ${monSummary.near} mendekati BML` : ''}${monSummary.over ? `, ${monSummary.over} melebihi BML` : ''}.</span>
            </div>
          </section>
        </div>

        <!-- PERHATIAN PRIORITAS (CLEAN & MINIMALIST) -->
        <section class="panel">
          <div class="panel-head">
            <div>
              <div class="panel-title">${ui.icon('alert-circle')}Perhatian & Tindak Lanjut Prioritas</div>
              <div class="panel-sub">Agenda pemenuhan bukti dan kewajiban terdekat pada cakupan fasilitas.</div>
            </div>
            <a class="link-more" href="#/audit/tracking">Semua Temuan (${findingsList.length}) ${ui.icon('arrow-right')}</a>
          </div>
          <div class="attention-clean-list">
            ${attention.map(item => `
              <div class="attention-clean-item">
                <div class="att-title-col">
                  <strong>${ui.escapeHtml(item.title)}</strong>
                  <span>${ui.escapeHtml(item.subtitle)} · ${data.facilityShort(item.facility)}</span>
                </div>
                <div class="att-action-col">
                  ${ui.attentionBadge(item.status)}
                  <a class="btn btn--ghost btn--sm" href="#/criteria/${item.group}/${item.criterionId}">Buka Kriteria</a>
                </div>
              </div>`).join('')}
          </div>
        </section>
      </div>`;
  }

  function mount(root, ctx) {
    const P = window.PERMATA;
    if (!P.charts || !P.charts.ready()) return;
    const scope = ctx.scope;

    // 1. Chart Donut PROPER
    const rankCanvas = root.querySelector('#rankDonut');
    if (rankCanvas) {
      const rank = data.rankFor(scope.facility, scope.period);
      P.charts.rankDonut(rankCanvas, rank);
    }

    // 2. Chart PERCA (Dinamis dari P.percaCalc)
    const percaCanvas = root.querySelector('#percaCanvas');
    if (percaCanvas && P.percaCalc) {
      const rows = P.percaCalc.rows();
      const labels = rows.map(r => r.aspect.name);
      const values = rows.map(r => r.score);
      P.charts.percaChart(percaCanvas, labels, values);
    }

    // 3. Chart ISO 14001:2015
    const isoCanvas = root.querySelector('#isoCanvas');
    if (isoCanvas) {
      P.charts.iso14001Chart(isoCanvas);
    }

    // 4. Chart Lingkungan Kerja Terakhir (Dinamis dari P.monitoringCalc)
    const envWorkCanvas = root.querySelector('#envWorkCanvas');
    if (envWorkCanvas && P.monitoringCalc) {
      const catSums = P.monitoringCalc.categorySummary();
      const labels = catSums.map(c => c.label);
      const values = catSums.map(c => Math.min(100, c.pct));
      P.charts.envWorkEnvChart(envWorkCanvas, labels, values);
    }

    // Event listener tombol navigasi cepat
    const btnGoProper = root.querySelector('[data-go-proper]');
    if (btnGoProper) {
      btnGoProper.addEventListener('click', () => P.nav.navigate('#/proper/kriteria'));
    }
    const btnGoPerca = root.querySelector('[data-go-perca]');
    if (btnGoPerca) {
      btnGoPerca.addEventListener('click', () => P.nav.navigate('#/perca'));
    }
    const btnGoFindings = root.querySelector('[data-go-findings]');
    if (btnGoFindings) {
      btnGoFindings.addEventListener('click', () => P.nav.navigate('#/audit/tracking'));
    }
  }

  P.views = P.views || {};
  P.views.dashboard = { render, mount };
})(window);
