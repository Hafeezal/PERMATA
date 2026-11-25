/* PERMATA - pembungkus Chart.js */
(function (global) {
  const P = global.PERMATA = global.PERMATA || {};
  const instances = [];

  function ready() {
    return !!global.Chart;
  }

  function register(canvas, config) {
    if (!canvas || !ready()) return null;
    const chart = new global.Chart(canvas.getContext('2d'), config);
    instances.push(chart);
    return chart;
  }

  function destroyAll() {
    while (instances.length) {
      const chart = instances.pop();
      try { chart.destroy(); } catch (err) { /* chart sudah tidak aktif */ }
    }
  }

  /* Ulangi animasi grafik yang sedang tampil (dipanggil berkala oleh motion.js) */
  function replay() {
    instances.forEach(chart => {
      try { chart.reset(); chart.update(); } catch (err) { /* abaikan */ }
    });
  }

  function baseOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 650, easing: 'easeOutQuart' },
      layout: { padding: 0 },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#203B32',
          titleFont: { family: 'Inter', size: 10, weight: '600' },
          bodyFont: { family: 'Inter', size: 10 },
          padding: 9,
          cornerRadius: 8,
          displayColors: false,
          caretSize: 5
        }
      }
    };
  }

  function rankColors(rank) {
    if (rank === 'Emas') return ['#D4A72C', '#EBCB6B', '#F7E8B8'];
    if (rank === 'Hijau') return ['#159B63', '#83D94D', '#0B8A57'];
    if (rank === 'Biru') return ['#3B82C4', '#7FB4DF', '#2F6FA8'];
    if (rank === 'Merah') return ['#D9534F', '#EA8F8B', '#B24540'];
    if (rank === 'Hitam') return ['#203B32', '#506A5F', '#7D918A'];
    return ['#DCE6E0', '#EAF1EC', '#F2F6F3'];
  }

  function rankDonut(canvas, rank) {
    const colors = rankColors(rank);
    const values = rank === 'Belum Ditetapkan' || !rank ? [50, 30, 20] : [54, 28, 18];
    return register(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Ketaatan', 'Beyond Compliance', 'Kesiapan Evidence'],
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderWidth: 0,
          hoverOffset: 0,
          spacing: 2
        }]
      },
      options: Object.assign(baseOptions(), {
        cutout: '76%',
        rotation: -90,
        plugins: Object.assign(baseOptions().plugins, {
          tooltip: { enabled: false },
          legend: { display: false }
        })
      })
    });
  }

  function readinessDonut(canvas, percent) {
    const p = Math.max(0, Math.min(100, Math.round(percent)));
    return register(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Terverifikasi', 'Belum terverifikasi'],
        datasets: [{
          data: [p, 100 - p],
          backgroundColor: ['#159B63', '#E7F1EB'],
          borderWidth: 0,
          hoverOffset: 0,
          spacing: 1,
          borderRadius: 6
        }]
      },
      options: Object.assign(baseOptions(), {
        cutout: '76%',
        rotation: -90,
        plugins: Object.assign(baseOptions().plugins, {
          tooltip: { enabled: false },
          legend: { display: false }
        })
      })
    });
  }

  const lastPointPlugin = {
    id: 'lastPointLabel',
    afterDatasetsDraw(chart) {
      const meta = chart.getDatasetMeta(0);
      if (!meta || !meta.data || !meta.data.length) return;
      const point = meta.data[meta.data.length - 1];
      const value = chart.data.datasets[0].data[meta.data.length - 1];
      if (point == null || value == null) return;
      const ctx = chart.ctx;
      const text = value + '%';
      ctx.save();
      ctx.font = '600 9.5px Inter, sans-serif';
      const width = ctx.measureText(text).width + 14;
      const height = 18;
      let x = point.x - width / 2;
      let y = point.y - height - 10;
      x = Math.min(Math.max(x, chart.chartArea.left), chart.chartArea.right - width);
      if (y < chart.chartArea.top + 2) y = point.y + 12;
      ctx.fillStyle = '#0B8A57';
      const r = 9;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + width, y, x + width, y + height, r);
      ctx.arcTo(x + width, y + height, x, y + height, r);
      ctx.arcTo(x, y + height, x, y, r);
      ctx.arcTo(x, y, x + width, y, r);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x + width / 2, y + height / 2 + .5);

      ctx.beginPath();
      ctx.arc(point.x, point.y, 3.4, 0, Math.PI * 2);
      ctx.fillStyle = '#0B8A57';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#fff';
      ctx.stroke();
      ctx.restore();
    }
  };

  function trendLine(canvas, labels, values) {
    const options = baseOptions();
    options.plugins.tooltip.callbacks = {
      label: ctx => `Kepatuhan ${ctx.parsed.y}%`
    };
    options.plugins.tooltip.titleFont = { family: 'Inter', size: 10, weight: '600' };
    options.scales = {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { font: { family: 'Inter', size: 10 }, color: '#94A3B8' }
      },
      y: {
        min: Math.max(0, Math.floor((Math.min.apply(null, values) - 8) / 5) * 5),
        max: Math.min(100, Math.ceil((Math.max.apply(null, values) + 5) / 5) * 5),
        border: { display: false },
        grid: { color: '#EEF4EF', drawTicks: false },
        ticks: {
          stepSize: 5,
          padding: 8,
          font: { family: 'Inter', size: 9.5 },
          color: '#94A3B8',
          callback: value => value + '%'
        }
      }
    };
    options.layout = { padding: { top: 18, right: 8, bottom: 0, left: 0 } };

    return register(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: values,
          borderColor: '#0B8A57',
          borderWidth: 2.4,
          tension: .38,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: '#0B8A57',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
          fill: true,
          backgroundColor: ctx => {
            const area = ctx.chart.chartArea;
            if (!area) return 'rgba(21,155,99,.12)';
            const gradient = ctx.chart.ctx.createLinearGradient(0, area.top, 0, area.bottom);
            gradient.addColorStop(0, 'rgba(21,155,99,.24)');
            gradient.addColorStop(1, 'rgba(21,155,99,.01)');
            return gradient;
          }
        }]
      },
      options,
      plugins: [lastPointPlugin]
    });
  }

  /* 1. Grafik PERCA (Peringkat Kinerja Lingkungan Daerah) */
  function percaChart(canvas, labels, values) {
    const defaultLabels = ['Dokumen Lingkungan', 'Pencemaran Air', 'Limbah B3', 'Pencemaran Udara', 'Pemulihan & Gakkum'];
    const defaultValues = [92, 88, 85, 90, 95];
    const labs = labels && labels.length ? labels : defaultLabels;
    const vals = values && values.length ? values : defaultValues;

    const options = baseOptions();
    options.indexAxis = 'y';
    options.scales = {
      x: {
        min: 0,
        max: 100,
        grid: { color: '#EEF4EF', drawTicks: false },
        ticks: {
          stepSize: 20,
          font: { family: 'Inter', size: 9 },
          color: '#94A3B8',
          callback: v => v + '%'
        }
      },
      y: {
        grid: { display: false },
        ticks: {
          font: { family: 'Inter', size: 10, weight: '550' },
          color: '#203B32'
        }
      }
    };
    options.plugins.tooltip.callbacks = {
      label: ctx => `Capaian: ${ctx.parsed.x}% (Target: 90%)`
    };

    return register(canvas, {
      type: 'bar',
      data: {
        labels: labs,
        datasets: [{
          data: vals,
          backgroundColor: vals.map((v, i) => i === 4 ? '#83D94D' : '#159B63'),
          hoverBackgroundColor: '#0B8A57',
          borderRadius: 6,
          barThickness: 14
        }]
      },
      options
    });
  }

  /* 2. Grafik ISO 14001:2015 (Sistem Manajemen Lingkungan) */
  function iso14001Chart(canvas, labels, values) {
    const defaultLabels = ['K-4 Konteks', 'K-5 Kepemimpinan', 'K-6 Perencanaan', 'K-7 Dukungan', 'K-8 Operasional', 'K-9 Evaluasi', 'K-10 Peningkatan'];
    const defaultValues = [100, 95, 92, 90, 88, 95, 92];
    const labs = labels && labels.length ? labels : defaultLabels;
    const vals = values && values.length ? values : defaultValues;

    const options = baseOptions();
    options.scales = {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Inter', size: 9 }, color: '#64748B' }
      },
      y: {
        min: 60,
        max: 100,
        grid: { color: '#EEF4EF', drawTicks: false },
        ticks: {
          stepSize: 10,
          font: { family: 'Inter', size: 9 },
          color: '#94A3B8',
          callback: v => v + '%'
        }
      }
    };
    options.plugins.tooltip.callbacks = {
      label: ctx => `Pemenuhan Klausul: ${ctx.parsed.y}%`
    };

    return register(canvas, {
      type: 'bar',
      data: {
        labels: labs,
        datasets: [{
          data: vals,
          backgroundColor: vals.map(v => v >= 95 ? '#0B8A57' : v >= 90 ? '#159B63' : '#83D94D'),
          borderRadius: 6,
          barThickness: 16
        }]
      },
      options
    });
  }

  /* 3. Grafik Pengukuran Lingkungan Kerja Terakhir vs Baku Mutu */
  function envWorkEnvChart(canvas, labels, values) {
    const defaultLabels = ['Kebisingan', 'Air Limbah', 'Emisi Genset', 'Udara Ambien', 'Area Kerja'];
    const defaultValues = [74, 32, 48, 85, 42]; // Rasio pemakaian BML (%)
    const labs = labels && labels.length ? labels : defaultLabels;
    const vals = values && values.length ? values : defaultValues;

    const options = baseOptions();
    options.indexAxis = 'y';
    options.scales = {
      x: {
        min: 0,
        max: 100,
        grid: { color: '#EEF4EF', drawTicks: false },
        ticks: {
          stepSize: 20,
          font: { family: 'Inter', size: 9 },
          color: '#94A3B8',
          callback: v => v + '%'
        }
      },
      y: {
        grid: { display: false },
        ticks: {
          font: { family: 'Inter', size: 10, weight: '550' },
          color: '#203B32'
        }
      }
    };
    options.plugins.tooltip.callbacks = {
      label: ctx => `Beban terhadap BML: ${ctx.parsed.x}% (Aman / Memenuhi Standar)`
    };

    return register(canvas, {
      type: 'bar',
      data: {
        labels: labs,
        datasets: [{
          label: 'Rasio BML',
          data: vals,
          backgroundColor: vals.map(v => v > 100 ? '#D9534F' : v >= 80 ? '#E39B2D' : '#0B8A57'),
          borderRadius: 6,
          barThickness: 14
        }]
      },
      options
    });
  }

  P.charts = {
    ready,
    destroyAll,
    replay,
    rankDonut,
    readinessDonut,
    trendLine,
    percaChart,
    iso14001Chart,
    envWorkEnvChart
  };
})(window);
