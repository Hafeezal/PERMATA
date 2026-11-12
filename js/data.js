/* PERMATA - data dummy terpusat (prototipe) */
(function (global) {
  const P = global.PERMATA = global.PERMATA || {};

  const TODAY = '2026-06-24';
  const HISTORY_PERIODS = ['2023/2024', '2024/2025', '2025/2026', '2026/2027'];

  const facilities = [
    { id: 'all', name: 'Seluruh Fasilitas', short: 'Semua Fasilitas', type: 'Agregat' },
    { id: 'tbbm-a', name: 'Terminal BBM A', short: 'TBBM A', type: 'Terminal BBM' },
    { id: 'tbbm-b', name: 'Terminal BBM B', short: 'TBBM B', type: 'Terminal BBM' },
    { id: 'tbbm-c', name: 'Terminal BBM C', short: 'TBBM C', type: 'Terminal BBM' },
    { id: 'tbbm-d', name: 'Terminal BBM D', short: 'TBBM D', type: 'Terminal BBM' },
    { id: 'dppu-c', name: 'DPPU C', short: 'DPPU C', type: 'DPPU' },
    { id: 'depot-medan', name: 'Depot Medan', short: 'Depot Medan', type: 'Depot' },
    { id: 'depot-plg', name: 'Depot Palembang', short: 'Depot Plg', type: 'Depot' },
    { id: 'it-medan', name: 'Integrated Terminal Medan', short: 'IT Medan', type: 'Integrated Terminal' }
  ];

  const periods = [
    { id: '2024/2025', label: '2024/2025', status: 'Final' },
    { id: '2025/2026', label: '2025/2026', status: 'Final' },
    { id: '2026/2027', label: '2026/2027', status: 'Ongoing' }
  ];

  const profile = {
    name: 'Rangga Aditya',
    role: 'Environmental Officer',
    unit: 'HSSE - Regional I',
    initials: 'RA'
  };

  const facilitiesById = {};
  facilities.forEach(f => { facilitiesById[f.id] = f; });

  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0) / 4294967296;
  }

  function hash2(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    h ^= h >>> 16;
    h = Math.imul(h, 2246822507);
    h ^= h >>> 13;
    h = Math.imul(h, 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  }

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function addDays(iso, days) {
    const d = new Date(iso + 'T00:00:00');
    d.setDate(d.getDate() + days);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  /* ---------------- Obligations ---------------- */
  const OBLIGATION_TYPES = [
    { title: 'Pelaporan RKL-RPL Semester I', cat: 'Persetujuan Lingkungan', criterionId: 'c01', weight: 3 },
    { title: 'Pelaporan RKL-RPL Semester II', cat: 'Persetujuan Lingkungan', criterionId: 'c01', weight: 3 },
    { title: 'Pengujian kualitas air limbah', cat: 'Pengendalian Pencemaran Air', criterionId: 'c02', weight: 3 },
    { title: 'Pengujian emisi cerobong', cat: 'Pengendalian Pencemaran Udara', criterionId: 'c04', weight: 3 },
    { title: 'Pemantauan kualitas udara ambien', cat: 'Pengendalian Pencemaran Udara', criterionId: 'c04', weight: 2 },
    { title: 'Pelaporan pengelolaan limbah B3', cat: 'Pengelolaan Limbah B3', criterionId: 'c05', weight: 3 },
    { title: 'Pemantauan kebisingan lingkungan', cat: 'Pencemaran Lingkungan Lain', criterionId: 'c09', weight: 1 },
    { title: 'Pemutakhiran dokumen persetujuan lingkungan', cat: 'Persetujuan Lingkungan', criterionId: 'c01', weight: 2 },
    { title: 'Kalibrasi peralatan pemantauan', cat: 'Persyaratan Teknis', criterionId: 'c11', weight: 1 },
    { title: 'Simulasi tanggap darurat lingkungan', cat: 'Tanggap Kebencanaan', criterionId: 'b04', weight: 1 }
  ];

  const PICS = ['Rangga Aditya', 'Sari Wulandari', 'Dimas Prakoso', 'Nabila Putri', 'Andi Kurniawan', 'Maya Lestari'];

  const OBLIGATION_PLAN = {
    '2024/2025': { fulfilled: 52, in_progress: 18, not_fulfilled: 6, overdue: 4 },
    '2025/2026': { fulfilled: 58, in_progress: 14, not_fulfilled: 5, overdue: 3 },
    '2026/2027': { fulfilled: 49, in_progress: 20, not_fulfilled: 7, overdue: 4 }
  };

  function buildObligations(period) {
    const plan = OBLIGATION_PLAN[period];
    const pool = [];
    let k = 0;
    Object.keys(plan).forEach(status => {
      for (let n = 0; n < plan[status]; n++) {
        pool.push({ status, key: hash(period + '|' + (k++)) });
      }
    });
    pool.sort((a, b) => a.key - b.key);

    let notFulfilledSeen = 0;
    return pool.map((entry, i) => {
      const type = OBLIGATION_TYPES[i % OBLIGATION_TYPES.length];
      const facility = facilities[1 + (i % (facilities.length - 1))];
      let offset;
      if (entry.status === 'fulfilled') offset = -5 - (i % 30);
      else if (entry.status === 'in_progress') offset = 3 + (i % 26);
      else if (entry.status === 'not_fulfilled') {
        notFulfilledSeen += 1;
        offset = notFulfilledSeen === 5 ? 45 : 4 + notFulfilledSeen * 6;
      } else offset = -3 - (i % 15);

      return {
        id: 'obl-' + period.replace('/', '') + '-' + (i + 1),
        title: type.title,
        cat: type.cat,
        criterionId: type.criterionId,
        weight: type.weight,
        facility: facility.id,
        facilityName: facility.short,
        pic: PICS[i % PICS.length],
        status: entry.status,
        due: addDays(TODAY, offset)
      };
    });
  }

  const obligationsByPeriod = {};
  periods.forEach(p => { obligationsByPeriod[p.id] = buildObligations(p.id); });

  function getObligations(period, facility) {
    const list = obligationsByPeriod[period] || obligationsByPeriod['2025/2026'];
    return facility === 'all' ? list : list.filter(o => o.facility === facility);
  }

  function distributePercent(counts) {
    const keys = Object.keys(counts);
    const total = keys.reduce((s, k) => s + counts[k], 0);
    if (!total) {
      const zero = {};
      keys.forEach(k => { zero[k] = 0; });
      return zero;
    }
    const raw = keys.map(k => (counts[k] / total) * 100);
    const whole = raw.map(Math.floor);
    let rest = 100 - whole.reduce((a, b) => a + b, 0);
    const order = raw
      .map((v, i) => ({ i, frac: v - Math.floor(v) }))
      .sort((a, b) => b.frac - a.frac);
    for (let j = 0; j < order.length && rest > 0; j++) {
      whole[order[j].i] += 1;
      rest -= 1;
    }
    const out = {};
    keys.forEach((k, i) => { out[k] = whole[i]; });
    return out;
  }

  function obligationSummary(period, facility) {
    const list = getObligations(period, facility);
    const counts = { fulfilled: 0, in_progress: 0, not_fulfilled: 0, overdue: 0 };
    list.forEach(o => { counts[o.status] = (counts[o.status] || 0) + 1; });
    const total = list.length || 1;
    const rate = Math.round(((counts.fulfilled + counts.in_progress * 0.75 + counts.not_fulfilled * 0.2) / total) * 100);
    const upcoming = list.filter(o => {
      if (o.status === 'fulfilled' || o.status === 'overdue') return false;
      const d = new Date(o.due + 'T00:00:00').getTime();
      const now = new Date(TODAY + 'T00:00:00').getTime();
      const diff = (d - now) / 86400000;
      return diff >= 0 && diff <= 30;
    }).length;
    return {
      list,
      total: list.length,
      counts,
      pcts: distributePercent(counts),
      complianceRate: clamp(rate, 0, 100),
      upcoming
    };
  }

  /* ---------------- Findings ---------------- */
  const FINDINGS_BASE = {
    all: 24,
    'tbbm-a': 4,
    'tbbm-b': 3,
    'tbbm-c': 4,
    'tbbm-d': 2,
    'dppu-c': 4,
    'depot-medan': 3,
    'depot-plg': 2,
    'it-medan': 2
  };

  function openFindings(period, facility) {
    const base = FINDINGS_BASE[facility] || FINDINGS_BASE.all;
    const delta = period === '2024/2025' ? 4 : period === '2026/2027' ? -3 : 0;
    return Math.max(0, base + delta);
  }

  /* ---------------- Trend ---------------- */
  const TREND_BASE = {
    '2024/2025': [71, 73, 72, 76, 79, 83],
    '2025/2026': [72, 75, 74, 78, 81, 87],
    '2026/2027': [78, 80, 79, 81, 82, 82]
  };

  const FACILITY_TREND_OFFSET = {
    all: 0,
    'tbbm-a': 2,
    'tbbm-b': -2,
    'tbbm-c': -6,
    'tbbm-d': -3,
    'dppu-c': -5,
    'depot-medan': 1,
    'depot-plg': -1,
    'it-medan': -7
  };

  function trendFor(period, facility, lastValue) {
    const base = (TREND_BASE[period] || TREND_BASE['2025/2026']).slice();
    const offset = FACILITY_TREND_OFFSET[facility] || 0;
    const values = base.map(v => clamp(v + offset, 30, 100));
    if (typeof lastValue === 'number') values[values.length - 1] = lastValue;
    return { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'], values };
  }

  /* ---------------- Ratings & history ---------------- */
  const RATINGS = {
    all: ['Biru', 'Hijau', 'Hijau', 'Belum Ditetapkan'],
    'tbbm-a': ['Biru', 'Hijau', 'Hijau', 'Belum Ditetapkan'],
    'tbbm-b': ['Biru', 'Biru', 'Hijau', 'Belum Ditetapkan'],
    'tbbm-c': ['Biru', 'Biru', 'Biru', 'Belum Ditetapkan'],
    'tbbm-d': ['Biru', 'Biru', 'Hijau', 'Belum Ditetapkan'],
    'dppu-c': ['Biru', 'Biru', 'Biru', 'Belum Ditetapkan'],
    'depot-medan': ['Biru', 'Hijau', 'Hijau', 'Belum Ditetapkan'],
    'depot-plg': ['Biru', 'Hijau', 'Hijau', 'Belum Ditetapkan'],
    'it-medan': ['Biru', 'Biru', 'Biru', 'Belum Ditetapkan']
  };

  function rankFor(facility, period) {
    const arr = RATINGS[facility] || RATINGS.all;
    const idx = HISTORY_PERIODS.indexOf(period);
    return arr[idx >= 0 ? idx : 2];
  }

  const HISTORY_STATUS = {
    '2023/2024': 'Final',
    '2024/2025': 'Final',
    '2025/2026': 'Final',
    '2026/2027': 'Ongoing'
  };

  function historyRows(facility) {
    return HISTORY_PERIODS.map(p => ({
      period: p,
      rank: rankFor(facility, p),
      status: HISTORY_STATUS[p]
    }));
  }

  const historyNotes = [
    {
      title: 'Evaluasi 2025/2026',
      text: 'Kesiapan ketaatan meningkat, namun pelaporan limbah B3 dan evidence pencemaran air masih perlu dilengkapi.',
      person: 'Sari Wulandari',
      status: 'Selesai',
      tone: 'green'
    },
    {
      title: 'Rekomendasi',
      text: 'Prioritaskan verifikasi evidence B3, pemutakhiran dokumen lingkungan, dan percepatan pelaporan RKL-RPL.',
      person: 'Rangga Aditya',
      status: 'Berjalan',
      tone: 'amber'
    },
    {
      title: 'Tindak Lanjut',
      text: 'Lakukan review gabungan HSSE dan Environmental Officer setiap akhir bulan sebelum periode penilaian berakhir.',
      person: 'Dimas Prakoso',
      status: 'Terjadwal',
      tone: 'blue'
    }
  ];

  const historyChanges = [
    { title: 'Pengelolaan Limbah B3', desc: 'Naik 12% dibanding periode sebelumnya', icon: 'trending-up', tone: '' },
    { title: 'Sistem Manajemen Lingkungan', desc: 'Naik 8% setelah audit internal', icon: 'trending-up', tone: '' },
    { title: 'Pemeliharaan Sumber Air', desc: 'Turun 5% — program konservasi belum berjalan', icon: 'trending-down', tone: 'warn' },
    { title: 'Instrumen penilaian', desc: 'Subkriteria ekoinovasi ditambahkan pada periode 2025/2026', icon: 'plus-circle', tone: 'red' }
  ];

  /* ---------------- Attention ---------------- */
  const attention = [
    {
      id: 'att-1',
      title: 'Bukti pengelolaan limbah B3 belum diverifikasi',
      meta: 'Terminal BBM A · Limbah B3 · Due 30 Jun 2026',
      facility: 'tbbm-a',
      criterionId: 'c05',
      group: 'compliance',
      tone: 'red',
      status: 'overdue'
    },
    {
      id: 'att-2',
      title: 'Pelaporan RKL-RPL mendekati tenggat',
      meta: 'Terminal BBM B · Persetujuan Lingkungan · Due 5 Jul 2026',
      facility: 'tbbm-b',
      criterionId: 'c01',
      group: 'compliance',
      tone: 'amber',
      status: 'due_soon'
    },
    {
      id: 'att-3',
      title: 'Evidence pengendalian pencemaran air belum lengkap',
      meta: 'Terminal BBM C · Pencemaran Air',
      facility: 'tbbm-c',
      criterionId: 'c02',
      group: 'compliance',
      tone: 'amber',
      status: 'pending'
    },
    {
      id: 'att-4',
      title: 'Peringkat kinerja emisi menjadi prioritas',
      meta: 'DPPU C · Pengendalian Pencemaran Udara',
      facility: 'dppu-c',
      criterionId: 'c04',
      group: 'compliance',
      tone: 'blue',
      status: 'info'
    },
    {
      id: 'att-5',
      title: 'Bukti pengelolaan limbah B3 belum lengkap',
      meta: 'Terminal BBM D · Limbah B3',
      facility: 'tbbm-d',
      criterionId: 'c05',
      group: 'compliance',
      tone: 'amber',
      status: 'pending'
    },
    {
      id: 'att-6',
      title: 'Hasil pengujian air limbah belum tersedia',
      meta: 'Terminal BBM C · Pencemaran Air · Due 26 Jun 2026',
      facility: 'tbbm-c',
      criterionId: 'c02',
      group: 'compliance',
      tone: 'red',
      status: 'overdue'
    }
  ];

  function attentionFor(facility) {
    return facility === 'all' ? attention : attention.filter(a => a.facility === facility);
  }

  /* ---------------- Notifications ---------------- */
  const notifications = [
    {
      id: 'ntf-1',
      title: 'Evidence limbah B3 menunggu verifikasi',
      meta: 'Terminal BBM A · Foto_TPS_Limbah_B3.png',
      time: '18 Jun 2026, 16:10',
      tone: 'amber',
      icon: 'clock',
      route: '#/proper/evidence',
      unread: true
    },
    {
      id: 'ntf-2',
      title: 'Pelaporan RKL-RPL mendekati tenggat',
      meta: 'Terminal BBM B · Due 5 Jul 2026',
      time: '22 Jun 2026, 09:30',
      tone: 'red',
      icon: 'alert-triangle',
      route: '#/criteria/compliance/c01',
      unread: true
    },
    {
      id: 'ntf-3',
      title: 'Hasil pengujian air limbah belum tersedia',
      meta: 'Terminal BBM C · Pencemaran Air',
      time: '23 Jun 2026, 08:15',
      tone: 'red',
      icon: 'droplets',
      route: '#/criteria/compliance/c02',
      unread: true
    },
    {
      id: 'ntf-4',
      title: 'Indikator B3 telah dilengkapi',
      meta: 'Terminal BBM A · Pencatatan timbulan limbah',
      time: '20 Jun 2026, 13:45',
      tone: 'green',
      icon: 'check-circle-2',
      route: '#/criteria/compliance/c05',
      unread: false
    },
    {
      id: 'ntf-5',
      title: 'Peringkat periode 2025/2026 ditetapkan',
      meta: 'Peringkat Hijau · Final Rating',
      time: '19 Jun 2026, 10:00',
      tone: 'green',
      icon: 'award',
      route: '#/proper/riwayat',
      unread: false
    }
  ];

  /* ---------------- Evidence ---------------- */
  const evidence = [
    {
      id: 'ev-01',
      name: 'Logbook_Limbah_B3.pdf',
      type: 'PDF',
      ext: 'pdf',
      size: '2,4 MB',
      date: '2026-06-12',
      uploaded: '2026-06-13',
      uploader: 'Rangga Aditya',
      criterionId: 'c05',
      group: 'compliance',
      facility: 'tbbm-a',
      period: '2025/2026',
      status: 'verified',
      file: 'assets/docs/Logbook_Limbah_B3.pdf',
      indicatorIds: ['c05-i1', 'c05-i2'],
      note: 'Logbook pencatatan timbulan limbah B3 periode Juni 2026.',
      previewTitle: 'LOGBOOK LIMBAH B3',
      previewSub: 'Terminal BBM A · Periode 2025/2026',
      previewLines: [
        'Periode pencatatan : Juni 2026',
        'Lokasi : TPS Limbah B3 - TBBM A',
        'Penanggung jawab : Rangga Aditya',
        '',
        '03/06/2026  Oli bekas (A102d)           120 kg',
        '07/06/2026  Majun terkontaminasi (B304)   35 kg',
        '12/06/2026  Oli bekas (A102d)           110 kg',
        '18/06/2026  Filter bekas (A102d)          45 kg',
        '',
        'Total timbulan Juni 2026: 370 kg'
      ]
    },
    {
      id: 'ev-02',
      name: 'Foto_TPS_Limbah_B3.png',
      type: 'PNG',
      ext: 'img',
      size: '2,4 MB',
      date: '2026-06-18',
      uploaded: '2026-06-18',
      uploader: 'Rangga Aditya',
      criterionId: 'c05',
      group: 'compliance',
      facility: 'tbbm-a',
      period: '2025/2026',
      status: 'pending',
      file: 'assets/docs/Foto_TPS_Limbah_B3.png',
      indicatorIds: ['c05-i3'],
      note: 'Dokumentasi kondisi TPS Limbah B3 setelah penataan ulang.'
    },
    {
      id: 'ev-03',
      name: 'Uji_Air_Limbah.pdf',
      type: 'PDF',
      ext: 'pdf',
      size: '1,1 MB',
      date: '2026-06-10',
      uploaded: '2026-06-15',
      uploader: 'Sari Wulandari',
      criterionId: 'c02',
      group: 'compliance',
      facility: 'tbbm-b',
      period: '2025/2026',
      status: 'verified',
      file: 'assets/docs/Uji_Air_Limbah.pdf',
      indicatorIds: ['c02-i1', 'c02-i2'],
      note: 'Hasil uji kualitas air limbah outlet IPAL.',
      previewTitle: 'HASIL UJI KUALITAS AIR LIMBAH',
      previewSub: 'Terminal BBM B · 10 Juni 2026',
      previewLines: [
        'Titik pengambilan sampel : Outlet IPAL TBBM B',
        '',
        'Parameter        Satuan   Hasil   Baku Mutu   Keterangan',
        'pH               -        7,2     6,0 - 9,0   Memenuhi',
        'BOD              mg/L     24      30          Memenuhi',
        'COD              mg/L     68      100         Memenuhi',
        'TSS              mg/L     28      30          Memenuhi',
        'Minyak & lemak   mg/L     4,1     5,0         Memenuhi',
        '',
        'Kesimpulan: seluruh parameter memenuhi baku mutu.'
      ]
    },
    {
      id: 'ev-04',
      name: 'RKL-RPL_Terminal_B.pdf',
      type: 'PDF',
      ext: 'pdf',
      size: '3,2 MB',
      date: '2026-06-02',
      uploaded: '2026-06-03',
      uploader: 'Sari Wulandari',
      criterionId: 'c01',
      group: 'compliance',
      facility: 'tbbm-b',
      period: '2025/2026',
      status: 'verified',
      file: 'assets/docs/RKL-RPL_Terminal_B.pdf',
      indicatorIds: ['c01-i3'],
      note: 'Laporan pelaksanaan RKL-RPL semester I.',
      previewTitle: 'LAPORAN RKL-RPL SEMESTER I',
      previewSub: 'Terminal BBM B · Januari - Juni 2026',
      previewLines: [
        'Fasilitas : Terminal BBM B',
        'Penyusun : Sari Wulandari (HSSE Supervisor)',
        '',
        'A. Pengelolaan lingkungan',
        '   - Pemeliharaan IPAL dan pemantauan air limbah rutin.',
        '   - Pengujian emisi dan pemantauan udara ambien terlaksana.',
        '',
        'B. Pemantauan lingkungan',
        '   - Hasil pemantauan berada dalam baku mutu.',
        '',
        'Status: Terverifikasi oleh reviewer.'
      ]
    },
    {
      id: 'ev-05',
      name: 'AMDAL_Terminal_A.pdf',
      type: 'PDF',
      ext: 'pdf',
      size: '5,6 MB',
      date: '2026-05-20',
      uploaded: '2026-05-21',
      uploader: 'Nabila Putri',
      criterionId: 'c01',
      group: 'compliance',
      facility: 'tbbm-a',
      period: '2025/2026',
      status: 'need_update',
      file: 'assets/docs/AMDAL_Terminal_A.pdf',
      indicatorIds: ['c01-i1', 'c01-i2'],
      note: 'Dokumen persetujuan lingkungan perlu diperbarui.',
      previewTitle: 'DOKUMEN PERSETUJUAN LINGKUNGAN',
      previewSub: 'Terminal BBM A · Salinan dokumen',
      previewLines: [
        'Nama kegiatan : Pengoperasian Terminal BBM A',
        'Jenis dokumen : AMDAL',
        'Nomor : 660/AMDAL/2021 (contoh)',
        'Tanggal : 12 November 2021',
        '',
        'Dokumen memuat kewajiban pengelolaan dan pemantauan lingkungan.',
        '',
        'Status PERMATA: perlu diperbarui.'
      ]
    },
    {
      id: 'ev-06',
      name: 'Laporan_Emisi_C.pdf',
      type: 'PDF',
      ext: 'pdf',
      size: '1,4 MB',
      date: '2026-06-21',
      uploaded: '2026-06-21',
      uploader: 'Dimas Prakoso',
      criterionId: 'c04',
      group: 'compliance',
      facility: 'tbbm-c',
      period: '2025/2026',
      status: 'pending',
      file: 'assets/docs/Laporan_Emisi_C.pdf',
      indicatorIds: ['c04-i2'],
      note: 'Laporan pengujian emisi cerobong genset dan boiler.',
      previewTitle: 'LAPORAN PENGUJIAN EMISI CEROBONG',
      previewSub: 'Terminal BBM C · 16 Juni 2026',
      previewLines: [
        'Sumber emisi : Genset utama dan boiler',
        '',
        'Parameter     Satuan   Hasil   Baku Mutu   Keterangan',
        'NOx           mg/Nm3   310     400         Memenuhi',
        'SO2           mg/Nm3   180     250         Memenuhi',
        'Partikulat    mg/Nm3   42      75          Memenuhi',
        'Opasitas      %        8       20          Memenuhi',
        '',
        'Status: menunggu verifikasi reviewer.'
      ]
    },
    {
      id: 'ev-07',
      name: 'Sertifikat_ISO14001.pdf',
      type: 'PDF',
      ext: 'pdf',
      size: '0,9 MB',
      date: '2026-05-10',
      uploaded: '2026-05-10',
      uploader: 'Rangga Aditya',
      criterionId: 'b01',
      group: 'beyond',
      facility: 'tbbm-a',
      period: '2025/2026',
      status: 'verified',
      file: 'assets/docs/Sertifikat_ISO14001.pdf',
      indicatorIds: ['b01-i1'],
      note: 'Sertifikat ISO 14001:2015 Terminal BBM A.',
      previewTitle: 'SERTIFIKAT SISTEM MANAJEMEN LINGKUNGAN',
      previewSub: 'Terminal BBM A · ISO 14001:2015',
      previewLines: [
        'Organisasi : PT Pertamina Foundation - TBBM A',
        'Standar : ISO 14001:2015',
        'Nomor : ID-EMS-2024-001 (contoh)',
        'Berlaku : 1 Februari 2024 - 31 Januari 2027',
        '',
        'Lingkup: pengelolaan lingkungan pada kegiatan operasional terminal BBM.'
      ]
    },
    {
      id: 'ev-08',
      name: 'Program_Kampung_Iklim.pdf',
      type: 'PDF',
      ext: 'pdf',
      size: '2,0 MB',
      date: '2026-05-28',
      uploaded: '2026-05-29',
      uploader: 'Maya Lestari',
      criterionId: 'b04',
      group: 'beyond',
      facility: 'tbbm-b',
      period: '2025/2026',
      status: 'verified',
      file: 'assets/docs/Program_Kampung_Iklim.pdf',
      indicatorIds: ['b04-i1', 'b04-i2'],
      note: 'Laporan program pemberdayaan masyarakat Kampung Iklim.',
      previewTitle: 'LAPORAN PROGRAM KAMPUNG IKLIM',
      previewSub: 'Terminal BBM B · Januari - Juni 2026',
      previewLines: [
        'Program : Kampung Iklim Mandiri',
        'Lokasi : Ring 1 Terminal BBM B',
        '',
        'Kegiatan:',
        '1. Pelatihan pengelolaan sampah rumah tangga.',
        '2. Pembuatan biopori dan penanaman pohon.',
        '3. Pendampingan usaha daur ulang.',
        '',
        'Indikator: 3 RW terlibat, 120 peserta, 400 bibit ditanam.'
      ]
    },
    {
      id: 'ev-09',
      name: 'Notulen_Green_Leadership.pdf',
      type: 'PDF',
      ext: 'pdf',
      size: '0,7 MB',
      date: '2026-06-12',
      uploaded: '2026-06-12',
      uploader: 'Andi Kurniawan',
      criterionId: 'b07',
      group: 'beyond',
      facility: 'tbbm-c',
      period: '2025/2026',
      status: 'need_update',
      file: 'assets/docs/Notulen_Green_Leadership.pdf',
      indicatorIds: ['b07-i2'],
      note: 'Notulen rapat program green leadership.',
      previewTitle: 'NOTULEN PROGRAM GREEN LEADERSHIP',
      previewSub: 'Terminal BBM C · 9 Juni 2026',
      previewLines: [
        'Pimpinan rapat : Manager Terminal BBM C',
        'Peserta : 18 karyawan perwakilan unit',
        '',
        'Agenda:',
        '1. Evaluasi capaian program lingkungan semester I.',
        '2. Rencana program kerja hijau semester II.',
        '3. Pembentukan green champion per unit.',
        '',
        'Status PERMATA: perlu diperbarui.'
      ]
    },
    {
      id: 'ev-10',
      name: 'Proposal_Ekoinovasi.pdf',
      type: 'PDF',
      ext: 'pdf',
      size: '1,6 MB',
      date: '2026-06-16',
      uploaded: '2026-06-16',
      uploader: 'Dimas Prakoso',
      criterionId: 'b05',
      group: 'beyond',
      facility: 'depot-medan',
      period: '2025/2026',
      status: 'pending',
      file: 'assets/docs/Proposal_Ekoinovasi.pdf',
      indicatorIds: ['b05-i1'],
      note: 'Proposal pemanenan air hujan untuk kebutuhan operasional.',
      previewTitle: 'PROPOSAL EKOINOVASI',
      previewSub: 'Depot Medan · Pemanenan air hujan',
      previewLines: [
        'Judul : Pemanenan air hujan untuk kebutuhan operasional',
        'Pengusul : Dimas Prakoso',
        '',
        'Target:',
        '- Penurunan pemakaian air tanah 15% pada tahun pertama.',
        '- Kapasitas penampungan 20 m3.',
        '',
        'Status: menunggu verifikasi reviewer.'
      ]
    },
    {
      id: 'ev-11',
      name: 'Laporan_Kebisingan.pdf',
      type: 'PDF',
      ext: 'pdf',
      size: '1,2 MB',
      date: '2026-06-14',
      uploaded: '2026-06-14',
      uploader: 'Nabila Putri',
      criterionId: 'c09',
      group: 'compliance',
      facility: 'it-medan',
      period: '2025/2026',
      status: 'verified',
      file: 'assets/docs/Laporan_Kebisingan.pdf',
      indicatorIds: ['c09-i1'],
      note: 'Hasil pemantauan tingkat kebisingan lingkungan.',
      previewTitle: 'LAPORAN PEMANTAUAN KEBISINGAN',
      previewSub: 'Integrated Terminal Medan · 14 Juni 2026',
      previewLines: [
        'Titik            Hasil (dBA)   Baku Mutu (dBA)',
        'Batas timur      58            70',
        'Batas selatan    56            70',
        'Pemukiman        52            55',
        '',
        'Kesimpulan: tingkat kebisingan di bawah baku mutu.'
      ]
    },
    {
      id: 'ev-12',
      name: 'Bukti_Uji_Emisi_D.pdf',
      type: 'PDF',
      ext: 'pdf',
      size: '1,0 MB',
      date: '2026-06-11',
      uploaded: '2026-06-11',
      uploader: 'Andi Kurniawan',
      criterionId: 'c04',
      group: 'compliance',
      facility: 'tbbm-d',
      period: '2025/2026',
      status: 'verified',
      file: 'assets/docs/Bukti_Uji_Emisi_D.pdf',
      indicatorIds: ['c04-i2'],
      note: 'Ringkasan bukti pengujian emisi sumber tidak bergerak.',
      previewTitle: 'BUKTI PENGUJIAN EMISI',
      previewSub: 'Terminal BBM D · 11 Juni 2026',
      previewLines: [
        'Sumber emisi : Genset darurat',
        'Hasil : seluruh parameter memenuhi baku mutu',
        '',
        'Dokumen pendukung: laporan laboratorium dan sertifikat kalibrasi.',
        '',
        'Status: terverifikasi.'
      ]
    }
  ];

  function activityLogSeed() {
    return [
      { user: 'Rangga Aditya', action: 'mengunggah', detail: 'Logbook_Limbah_B3.pdf', at: '12 Jun 2026, 10:24' },
      { user: 'Sari Wulandari', action: 'menyetujui evidence', detail: 'Uji_Air_Limbah.pdf', at: '15 Jun 2026, 14:05' },
      { user: 'Dimas Prakoso', action: 'memperbarui indikator', detail: 'Penyediaan tempat penyimpanan limbah B3', at: '18 Jun 2026, 09:12' },
      { user: 'Sari Wulandari', action: 'meminta revisi', detail: 'Foto_TPS_Limbah_B3.png', at: '19 Jun 2026, 16:40' },
      { user: 'Admin', action: 'memperbarui periode penilaian', detail: '2025/2026', at: '20 Jun 2026, 08:00' }
    ];
  }

  /* ---------------- Evidence merging ---------------- */
  function mergedEvidence() {
    const st = P.state ? P.state.get() : null;
    const overrides = (st && st.evidenceStatus) || {};
    const deleted = (st && st.evidenceDeleted) || [];
    const uploads = (st && st.uploads) || [];

    return evidence
      .concat(uploads)
      .filter(e => deleted.indexOf(e.id) === -1)
      .map(e => Object.assign({}, e, {
        status: overrides[e.id] || e.status
      }));
  }

  function evidenceForScope(scope) {
    const all = mergedEvidence();
    const st = P.state ? P.state.get() : null;
    const overrides = (st && st.evidenceStatus) || {};
    const deleted = (st && st.evidenceDeleted) || [];
    let list;
    if (scope.period === '2025/2026') {
      list = all.filter(e => (e.period || '2025/2026') === '2025/2026');
    } else {
      const dayShift = { '2023/2024': -730, '2024/2025': -365, '2026/2027': 365 }[scope.period] || 365;
      list = all.map(e => {
        if ((e.period || '2025/2026') === scope.period) return e;
        const cloneId = e.id + '@' + scope.period;
        const h = hash2(scope.period + '|' + e.id);
        let clonedStatus = e.status;
        if (clonedStatus === 'verified') {
          const floor = scope.period === '2026/2027' ? 0.28 : 0.42;
          if (h < floor * 0.28) clonedStatus = 'need_update';
          else if (h < floor) clonedStatus = 'pending';
        }
        return Object.assign({}, e, {
          id: cloneId,
          period: scope.period,
          date: addDays(e.date, dayShift),
          uploaded: addDays(e.uploaded, dayShift),
          status: overrides[cloneId] || clonedStatus
        });
      }).filter(e => deleted.indexOf(e.id) === -1);
    }
    if (scope.facility !== 'all') {
      list = list.filter(e => e.facility === scope.facility);
    }
    return list;
  }

  function evidenceStats(list) {
    const stats = { total: list.length, verified: 0, pending: 0, need_update: 0 };
    list.forEach(e => {
      if (stats[e.status] == null) stats[e.status] = 0;
      stats[e.status] += 1;
    });
    return stats;
  }

  function evidenceForCriterion(criterionId, scope) {
    return evidenceForScope(scope).filter(e => e.criterionId === criterionId);
  }

  /* ---------------- Helpers ---------------- */
  function facility(id) {
    return facilitiesById[id] || facilitiesById.all;
  }

  function facilityName(id) {
    return facility(id).name;
  }

  function facilityShort(id) {
    return facility(id).short;
  }

  function criterionName(id) {
    const c = P.proper ? P.proper.criterion(id) : null;
    return c ? c.name : id;
  }

  function rankTone(rank) {
    return ({ Emas: 'gold', Hijau: 'green', Biru: 'blue', Merah: 'red', Hitam: 'black' })[rank] || 'gray';
  }

  function rankDesc(rank) {
    if (rank === 'Emas') return 'Kinerja lingkungan melampaui persyaratan.';
    if (rank === 'Hijau') return 'Menunjukkan kepatuhan yang baik terhadap kriteria PROPER.';
    if (rank === 'Biru') return 'Kepatuhan dasar terpenuhi, masih ada ruang peningkatan.';
    if (rank === 'Merah') return 'Terdapat ketidaksesuaian yang perlu segera ditindaklanjuti.';
    if (rank === 'Hitam') return 'Terdapat pelanggaran lingkungan yang serius.';
    return 'Peringkat resmi periode ini belum ditetapkan.';
  }

  P.data = {
    TODAY,
    HISTORY_PERIODS,
    facilities,
    facilitiesById,
    periods,
    profile,
    notifications,
    attention,
    evidence,
    historyNotes,
    historyChanges,
    hash,
    hash2,
    clamp,
    addDays,
    obligationsByPeriod,
    getObligations,
    obligationSummary,
    openFindings,
    trendFor,
    rankFor,
    rankTone,
    rankDesc,
    historyRows,
    attentionFor,
    evidenceForScope,
    evidenceStats,
    evidenceForCriterion,
    mergedEvidence,
    facility,
    facilityName,
    facilityShort,
    criterionName,
    activityLogSeed,
    get lastUpdated() { return '24 Jun 2026, 14:30 WIB'; }
  };
})(window);
