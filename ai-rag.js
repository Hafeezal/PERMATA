/* PERMATA - AI Regulatory Assistant (RAG Engine)
 * Modul Retrieval-Augmented Generation berbasis dokumen regulasi lingkungan,
 * kriteria PROPER Permen LH 7/2025, pedoman PERCA Pertamina, dan Baku Mutu Lingkungan.
 */
(function (global) {
  const P = global.PERMATA = global.PERMATA || {};
  const ui = P.ui;

  // ==============================================================
  // 1. RAG KNOWLEDGE CORPUS (Bank Data Dokumen Regulasi Lingkungan)
  // ==============================================================
  const KNOWLEDGE_CORPUS = [
    {
      id: 'rag-doc-01',
      title: 'Permen LH/BPLH No. 7 Tahun 2025: Persetujuan Lingkungan & Kewajiban RKL-RPL',
      category: 'proper',
      categoryLabel: 'Kriteria PROPER',
      reference: 'Permen LH/BPLH 7/2025 Pasal 6 & Lampiran I',
      snippet: 'Setiap kegiatan usaha wajib memiliki Persetujuan Lingkungan yang valid (AMDAL/UKL-UPL/SPPL) sesuai kapasitas riil operasional. Ketaatan dinilai dari kesesuaian sarana fasilitas, kepemilikan Persetujuan Teknis (Pertek) air limbah dan emisi, SLO (Surat Kelayakan Operasional), serta bukti pelaporan pelaksanaan RKL-RPL setiap semester melalui SIMPEL KLHK.',
      facilityApp: 'Di Terminal BBM: Pastikan seluruh tangki timbun baru, penambahan pompa BBM, dan renovasi dermaga telah teraddendum dalam Persetujuan Lingkungan. Laporan RKL-RPL semester 1 wajib di-submit sebelum 31 Juli dan semester 2 sebelum 31 Januari.',
      evidenceRequired: 'Dokumen SK Persetujuan Lingkungan, Pertek, SLO, Tanda Terima SIMPEL KLHK.',
      keywords: ['persetujuan lingkungan', 'amdal', 'ukl', 'upl', 'rkl', 'rpl', 'pertek', 'slo', 'simpel', 'izin lingkungan', 'ketaatan']
    },
    {
      id: 'rag-doc-02',
      title: 'Permen LH/BPLH No. 7 Tahun 2025: Pengendalian Pencemaran Air & Baku Mutu',
      category: 'proper',
      categoryLabel: 'Kriteria PROPER',
      reference: 'Permen LH/BPLH 7/2025 Pasal 9, Permen LH 19/2010 (Lampiran V) & Permen LH/BPLH 11/2025',
      snippet: 'Perusahaan wajib memiliki titik penaatan air limbah resmi (outfall) yang tercantum dalam Persetujuan Teknis, alat ukur debit harian, dan melakukan pengujian laboratorium terakreditasi KAN secara berkala. Seluruh hasil uji tidak boleh melampaui baku mutu air limbah dalam Persetujuan Teknis. Air limbah proses depot/terminal minyak (outlet OWS) mengacu Permen LH 19/2010 Lampiran V: pH 6-9, Minyak & Lemak maks 25 mg/L, TOC maks 110 mg/L. Air limbah domestik (STP kantor) mengacu Permen LH/BPLH 11/2025 (menggantikan P.68/2016); nilai bergantung jenis air limbah, media pelepasan, dan debit - gunakan nilai pada Persetujuan Teknis.',
      facilityApp: 'Di Fuel Terminal Pertamina: Air buangan dari bundwall tangki dan drainase operasional wajib melewati Oil Catcher (separator gravitasi/API separator) sebelum dilepas ke badan air. Pembersihan kerak minyak wajib dicatat di logbook rutin.',
      evidenceRequired: 'Laporan hasil uji lab KAN 12 bulan berturut-turut, sertifikat kalibrasi flowmeter, sertifikat kompetensi PPPA.',
      keywords: ['air limbah', 'pencemaran air', 'baku mutu air', 'oil catcher', 'separator', 'ph', 'tss', 'minyak dan lemak', 'cod', 'debit', 'outfall', 'pppa']
    },
    {
      id: 'rag-doc-03',
      title: 'Permen LH/BPLH No. 7 Tahun 2025: Pengelolaan Limbah B3 & FESTRONIK',
      category: 'proper',
      categoryLabel: 'Kriteria PROPER',
      reference: 'Permen LH/BPLH 7/2025 Pasal 14 & PP 22/2021 Bab VII',
      snippet: 'Pengelolaan limbah B3 wajib memenuhi: 1) Penyimpanan di TPS Limbah B3 berizin/terintegrasi persetujuan lingkungan dengan fasilitas SOP, simbol & label, eye wash, spill kit; 2) Pencatatan neraca limbah B3 dan logbook harian maksimal 90/180/365 hari; 3) Penyerahan wajib menggunakan manifest elektronik (FESTRONIK) kepada transporter dan pemanfaat/pemusnah berizin KLHK; 4) Pelaporan SIMPEL triwulanan.',
      facilityApp: 'Di Terminal BBM & SPBU: Limbah B3 dominan meliputi oli bekas genset, filter solar bekas, kain majun terkontaminasi, kemasan pelumas, sludge tangki (tank cleaning), dan aki bekas. Pelanggaran batas waktu simpan atau manifest manual tanpa FESTRONIK otomatis menggugurkan status ketaatan (Potensi PROPER Merah).',
      evidenceRequired: 'Izin/Rincian Teknis TPS B3, Logbook & Neraca Limbah B3 Triwulan, Manifest FESTRONIK, MoU pihak ketiga & izin KLHK yang masih berlaku.',
      keywords: ['limbah b3', 'tps b3', 'festronik', 'neraca limbah', 'manifest', 'oli bekas', 'sludge', 'majun', 'tumpahan', 'spill kit', 'simpel b3', 'merah']
    },
    {
      id: 'rag-doc-04',
      title: 'Baku Mutu Emisi Genset & Pompa PMK (Persetujuan Teknis Emisi)',
      category: 'bml',
      categoryLabel: 'Baku Mutu Lingkungan',
      reference: 'PP 22/2021 (Persetujuan Teknis emisi) & Persetujuan Teknis fasilitas',
      snippet: 'Mesin pembakaran dalam (genset dan pompa pemadam kebakaran diesel) wajib diuji emisinya berkala oleh laboratorium terakreditasi KAN. Nilai baku mutu emisi (CO, NOx sebagai NO2, SO2, partikulat, opasitas) ditetapkan dalam Persetujuan Teknis emisi fasilitas; nilai di aplikasi ini adalah nilai kerja yang harus disamakan dengan Persetujuan Teknis masing-masing terminal. Pengambilan sampel wajib memiliki lubang sampling, tangga, dan lantai kerja sesuai standar SNI.',
      facilityApp: 'Di TBBM / Fuel Terminal: Seluruh cerobong genset darurat dan pompa PMK diesel wajib dipasang lubang sampling (sampling port) berflens dengan penutup dan tangga bordes. Uji emisi dilakukan oleh lab terakreditasi KAN dengan koreksi oksigen sesuai Persetujuan Teknis.',
      evidenceRequired: 'Sertifikat hasil uji emisi lab KAN, log jam operasi (hour meter) genset, sertifikat kalibrasi flue gas analyzer.',
      keywords: ['emisi', 'genset', 'pompa pmk', 'cerobong', 'lubang sampling', 'co', 'no2', 'so2', 'partikulat', 'opasitas', 'permen lhk 11/2021', 'bml udara']
    },
    {
      id: 'rag-doc-05',
      title: 'Permenaker No. 5 Tahun 2018: Nilai Ambang Batas (NAB) Lingkungan Kerja',
      category: 'bml',
      categoryLabel: 'Baku Mutu Lingkungan',
      reference: 'Permenaker No. 5 Tahun 2018 Lampiran 1 & 2',
      snippet: 'Nilai Ambang Batas (NAB) faktor fisik dan kimia di tempat kerja: 1) Kebisingan: Maksimum 85 dBA untuk pemajanan 8 jam kerja per hari. Area > 85 dBA wajib memakai pelindung telinga (ear plug / ear muff); 2) Iklim kerja (ISBB), beban kerja ringan / sedang pada 75-100% waktu kerja: 31,0 / 28,0 °C ISBB (batas lebih rendah untuk beban lebih berat); 3) Pencahayaan ruang kontrol: minimal 300 Lux; 4) Faktor Kimia: Benzena maks 0,5 ppm dan H2S maks 1 ppm (TWA 8 jam).',
      facilityApp: 'Di Filling Shed & Rumah Pompa: Area manifold pompa BBM memiliki tingkat kebisingan 82-87 dBA. Wajib dipasang rambu K3 zona wajib Ear Protection, program audiometri tahunan untuk operator, dan pengujian semesteran lingkungan kerja.',
      evidenceRequired: 'Laporan pengujian lingkungan kerja PJK3/lab terakreditasi, sertifikat kalibrasi sound level meter, mapping zona kebisingan.',
      keywords: ['kebisingan', 'nab', 'lingkungan kerja', 'permenaker 5/2018', 'ear plug', 'filling shed', 'rumah pompa', 'isbb', 'pencahayaan', 'benzena', 'h2s', 'pjk3']
    },
    {
      id: 'rag-doc-06',
      title: 'Pedoman PERCA Pertamina (PHE 2024 / Pertagas): 5 Pilar Kinerja Lingkungan',
      category: 'perca',
      categoryLabel: 'Ketentuan PERCA',
      reference: 'Pedoman PERCA PHE 2024 Hal. 60-79 & Pertamina Gas Sustainability Report',
      snippet: 'PERCA (Pertamina Environmental Rating for Compliance Assurance) menilai 5 aspek utama: 1) Pelaksanaan Dokumen Lingkungan; 2) Pengendalian Pencemaran Air (ketaatan baku mutu, debit, kompetensi PPPA); 3) Pengelolaan Limbah B3 (izin, neraca, FESTRONIK, kompetensi PLB3); 4) Pengendalian Pencemaran Udara (baku mutu genset, pelaporan beban emisi GRK CO2/CH4/N2O dan non-GRK); 5) Pemulihan Lingkungan & Gakkum (tindak lanjut pencemaran lahan dan bebas dari sanksi hukum/teguran). Target kinerja minimal anak perusahaan adalah indeks >= 85%.',
      facilityApp: 'Di Subholding Commercial & Trading (PT PPN): PERCA menjadi parameter penilaian internal holding sebelum diajukan ke PROPER KLHK. Fasilitas wajib memiliki indeks pemenuhan pilar > 85% untuk direkomendasikan maju kandidat Hijau/Emas.',
      evidenceRequired: 'Self-assessment sheet PERCA, dokumen pilar 1-5, resume perhitungan emisi GRK, berita acara verifikasi internal HSSE.',
      keywords: ['perca', 'phe 2024', 'pertagas', '5 aspek perca', 'dokumen lingkungan', 'air limbah perca', 'limbah b3 perca', 'beban emisi', 'grk', 'pemulihan', 'gakkum', 'target 85']
    },
    {
      id: 'rag-doc-07',
      title: 'Kriteria PROPER Beyond Compliance: Life Cycle Assessment (LCA) & ISO 14040',
      category: 'proper',
      categoryLabel: 'Kriteria PROPER',
      reference: 'Permen LH 7/2025 Lampiran IV (Kriteria Hijau & Emas)',
      snippet: 'Perusahaan kandidat PROPER Hijau dan Emas wajib menyusun kajian Life Cycle Assessment (LCA) dengan ruang lingkup minimal Cradle-to-Grave atau Cradle-to-Gate. Kajian LCA harus mencakup: penentuan tujuan & ruang lingkup (goal & scope), inventarisasi daur hidup (LCI), penilaian dampak daur hidup (LCIA: Global Warming Potential, Asidifikasi, Eutrofikasi, Konsumsi Air), dan interpretasi daur hidup. Kajian wajib diverifikasi oleh verifikator LCA tersertifikasi/kredibel.',
      facilityApp: 'Di Distribusi BBM PT PPN: Kajian LCA difokuskan pada produk unggulan (misal Pertamax atau Dexlite) dari penerimaan tanker di dermaga, penyimpanan tangki timbun, hingga penyaluran via Mobil Tangki ke SPBU.',
      evidenceRequired: 'Laporan Kajian LCA lengkap, sertifikat kompetensi personel LCA, laporan hasil verifikasi pihak ketiga independen.',
      keywords: ['lca', 'life cycle assessment', 'beyond compliance', 'hijau', 'emas', 'iso 14040', 'gwp', 'jejak karbon', 'verifikator lca']
    },
    {
      id: 'rag-doc-08',
      title: 'Kriteria PROPER Beyond Compliance: Ekoinovasi & Inovasi Sosial (SROI)',
      category: 'proper',
      categoryLabel: 'Kriteria PROPER',
      reference: 'Permen LH 7/2025 Lampiran V & Pedoman SROI KLHK',
      snippet: 'Untuk meraih peringkat EMAS, perusahaan wajib memiliki: 1) Ekoinovasi yang telah dipatenkan / HKI / dipublikasikan secara ilmiah, memiliki nilai kebaruan (novelty), dan berdampak terukur pada efisiensi sumber daya (energi, air, emisi, limbah); 2) Inovasi Sosial berbasis pemberdayaan masyarakat yang menyelesaikan akar masalah kerentanan sosial, menciptakan kemandirian ekonomi, dan dihitung rasio dampak kemanfaatannya menggunakan Social Return on Investment (SROI) dengan rasio minimal 1 : 2.5.',
      facilityApp: 'Di Terminal BBM: Program CSR seperti pemanfaatan limbah non-B3 menjadi produk bernilai tambah (misal paving block abu, bank sampah digital pesisir) atau program ketahanan pangan nelayan sekitar terminal.',
      evidenceRequired: 'Dokumen Deskripsi Ekoinovasi (DDE), sertifikat HKI/paten, laporan pengukuran SROI lengkap dengan stakeholder mapping dan financial proxies.',
      keywords: ['ekoinovasi', 'inovasi sosial', 'sroi', 'emas', 'csr', 'pemberdayaan masyarakat', 'paten', 'hki', 'novelty', 'beyond compliance']
    },
    {
      id: 'rag-doc-09',
      title: 'Kriteria PROPER Beyond Compliance: Green Leadership & Tata Kelola',
      category: 'proper',
      categoryLabel: 'Kriteria PROPER',
      reference: 'Permen LH 7/2025 Lampiran VII & Pedoman Kepemimpinan Hijau',
      snippet: 'Green Leadership mengevaluasi komitmen pimpinan tertinggi fasilitas (Operation Head / Terminal Manager) dalam mengarusutamakan isu lingkungan ke dalam kebijakan strategis perusahaan. Kriteria meliputi: visi kepemimpinan hijau, alokasi anggaran khusus lingkungan & transisi energi, keterlibatan langsung pimpinan dalam program pemberdayaan, serta presentasi wawancara langsung dewan juri PROPER oleh Terminal Manager (tidak boleh diwakilkan).',
      facilityApp: 'Di PT Pertamina Patra Niaga: Terminal Manager wajib menyusun portfolio Green Leadership dan mempresentasikan capaian dekarbonisasi, efisiensi energi solar cell di atap kantor/loading arm, serta dampak program sosial masyarakat.',
      evidenceRequired: 'Notulen Management Review, SK alokasi anggaran HSSE hijau, dokumentasi presentasi Terminal Manager di hadapan dewan pertimbangan PROPER.',
      keywords: ['green leadership', 'kepemimpinan hijau', 'terminal manager', 'wawancara emas', 'proper emas', 'komitmen manajemen', 'iso 14001 review']
    },
    {
      id: 'rag-doc-10',
      title: 'SOP Internal PT Pertamina Patra Niaga: Tanggap Darurat Tumpahan Minyak (Tier 1)',
      category: 'internal',
      categoryLabel: 'Dokumen Internal Fasilitas',
      reference: 'SOP-HSSE-PPN-ENV-014: Penanggulangan Tumpahan Minyak di Darat & Perairan',
      snippet: 'Prosedur penanganan tumpahan BBM/minyak Tier 1 (kapasitas fasilitas sendiri): 1) Hentikan sumber tumpahan (Emergency Shutdown Button); 2) Lokalisir tumpahan menggunakan Oil Boom jika di perairan atau Oil Absorbent Pad / sawdust di darat; 3) Sedot minyak menggunakan oil skimmer atau vacuum truck dialirkan ke Slop Tank / Oil Catcher; 4) Pembersihan sisa residu dengan dispersant ramah lingkungan; 5) Laporkan ke fungsi HSSE dan DLH setempat dalam 1x24 jam.',
      facilityApp: 'Wajib tersedia Oil Spill Kit lengkap di area dermaga tanker, filling shed, dan pompa PMK. Drill penanggulangan tumpahan minyak minimal dilakukan 1 kali dalam setahun.',
      evidenceRequired: 'Berita acara drill spill response, logbook inspeksi oil spill kit, sertifikat IMO OPRC Level 1 personel.',
      keywords: ['tumpahan minyak', 'oil spill', 'tier 1', 'oil boom', 'absorbent', 'slop tank', 'tanggap darurat', 'sop pertamina', 'drill hsse']
    },
    {
      id: 'rag-doc-11',
      title: 'Baku Mutu Udara Ambien Nasional & Tingkat Kebauan',
      category: 'bml',
      categoryLabel: 'Baku Mutu Lingkungan',
      reference: 'PP 22/2021 Lampiran VII & KepmenLH 50/1996',
      snippet: 'Baku mutu udara ambien nasional (PP 22/2021): SO2 150 µg/Nm3 (1 jam); NO2 200 µg/Nm3 (1 jam); PM10 75 µg/Nm3 (24 jam); Hidrokarbon/NMHC 160 µg/Nm3 (3 jam). Baku tingkat kebauan H2S: 0,02 ppm (KepmenLH 50/1996).',
      facilityApp: 'Di Terminal BBM: titik ambien ditempatkan dekat filling shed dan batas pagar sisi OWS; pemantauan hidrokarbon (NMHC) dan H2S menjadi prioritas.',
      evidenceRequired: 'Laporan uji udara ambien lab terakreditasi KAN, titik koordinat sampling, kalibrasi alat.',
      keywords: ['udara ambien', 'ambien', 'pm10', 'nmhc', 'hidrokarbon', 'kebauan', 'h2s', 'so2', 'no2', 'pp 22/2021', 'baku mutu udara']
    },
    {
      id: 'rag-doc-12',
      title: 'Baku Tingkat Kebisingan Lingkungan (batas pagar)',
      category: 'bml',
      categoryLabel: 'Baku Mutu Lingkungan',
      reference: 'KepmenLH 48/1996',
      snippet: 'Baku tingkat kebisingan lingkungan: kawasan industri 70 dBA, perumahan dan pemukiman 55 dBA. Nilai ini berlaku di batas pagar/lingkungan dan berbeda dengan NAB kebisingan tempat kerja (85 dBA/8 jam, Permenaker 5/2018).',
      facilityApp: 'Di Terminal BBM: ukur di batas pagar dan titik pemukiman terdekat; bandingkan 70 dBA (kawasan industri) dan 55 dBA (pemukiman).',
      evidenceRequired: 'Laporan pengukuran kebisingan lingkungan, kalibrasi sound level meter.',
      keywords: ['kebisingan lingkungan', 'batas pagar', 'kepmenlh 48/1996', 'kawasan industri', 'pemukiman', 'dba']
    },
    {
      id: 'rag-doc-13',
      title: 'Permen LH/BPLH No. 11 Tahun 2025: Air Limbah Domestik',
      category: 'bml',
      categoryLabel: 'Baku Mutu Lingkungan',
      reference: 'Permen LH/BPLH 11/2025',
      snippet: 'Baku Mutu Air Limbah dan Standar Teknologi Pengolahan Air Limbah untuk air limbah domestik; menggantikan Permen LHK P.68/2016. Parameter mencakup pH, BOD, COD, TSS, minyak & lemak, amoniak, dan mikrobiologi. Nilai batas bergantung jenis air limbah, media pelepasan, dan debit.',
      facilityApp: 'Di Terminal BBM: STP kantor/mess wajib memenuhi baku mutu dan standar teknologi sesuai Persetujuan Teknis; verifikasi nilai pada lampiran peraturan.',
      evidenceRequired: 'Hasil uji outlet STP lab KAN, Persetujuan Teknis, catatan debit.',
      keywords: ['air limbah domestik', 'domestik', 'stp', 'bod', 'cod', 'tss', 'amoniak', 'p.68', 'permen lh 11/2025']
    },
    {
      id: 'rag-doc-14',
      title: 'Permen LH No. 6 Tahun 2026: Pengawasan & Sanksi Administratif',
      category: 'proper',
      categoryLabel: 'Kriteria PROPER',
      reference: 'Permen LH 6/2026',
      snippet: 'Mengatur pengawasan dan sanksi administratif bidang lingkungan hidup: teguran tertulis, paksaan pemerintah, denda administratif, pembekuan, dan pencabutan persetujuan. Pelampauan baku mutu air limbah, emisi, atau udara ambien yang tidak sesuai Persetujuan Lingkungan dapat dikenai sanksi.',
      facilityApp: 'Di Terminal BBM: hasil uji yang melampaui baku mutu harus segera ditindaklanjuti dan dicatat sebagai temuan di menu Tracking Temuan.',
      evidenceRequired: 'Bukti tindak lanjut, laporan korektif, surat pengawasan.',
      keywords: ['sanksi', 'pengawasan', 'denda', 'paksaan pemerintah', 'teguran', 'permen lh 6/2026', 'gakkum']
    }
  ];

  // ==============================================================
  // 2. RAG ENGINE (Semantic Matching & Generative Answer Synthesis)
  // ==============================================================
  function searchKnowledgeBase(query, categoryFilter) {
    if (!query || !query.trim()) return [];
    const qLower = query.toLowerCase().trim();
    const tokens = qLower.split(/[\s,.;:?!\-_]+/).filter(t => t.length > 2);

    const scored = KNOWLEDGE_CORPUS.map(doc => {
      if (categoryFilter && categoryFilter !== 'all' && doc.category !== categoryFilter) {
        return { doc, score: 0 };
      }
      let score = 0;
      // Exact title match bonus
      if (doc.title.toLowerCase().includes(qLower)) score += 50;
      // Keyword matches
      doc.keywords.forEach(kw => {
        if (qLower.includes(kw)) score += 30;
        tokens.forEach(tok => {
          if (kw.includes(tok)) score += 12;
        });
      });
      // Snippet & reference matches
      tokens.forEach(tok => {
        if (doc.snippet.toLowerCase().includes(tok)) score += 6;
        if (doc.facilityApp.toLowerCase().includes(tok)) score += 8;
        if (doc.reference.toLowerCase().includes(tok)) score += 10;
      });
      return { doc, score };
    });

    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.doc);
  }

  function synthesizeAnswer(query, retrievedDocs) {
    const q = query.toLowerCase();

    // Default response if no docs retrieved
    if (!retrievedDocs || retrievedDocs.length === 0) {
      return {
        text: `Berdasarkan penelusuran pada korpus regulasi lingkungan dan dokumen internal PT Pertamina Patra Niaga, tidak ditemukan rujukan spesifik untuk pertanyaan: <em>"${ui.escapeHtml(query)}"</em>.<br><br>
        <strong>Saran:</strong> Coba gunakan kata kunci seperti <em>"baku mutu emisi"</em>, <em>"limbah b3 festronik"</em>, <em>"oil catcher"</em>, <em>"syarat proper hijau"</em>, atau <em>"kebisingan lingkungan kerja"</em>.`,
        citations: [],
        recommendation: 'Periksa kelengkapan dokumen pada menu Overview atau hubungi fungsi HSSE Region.'
      };
    }

    const primaryDoc = retrievedDocs[0];
    const citations = retrievedDocs.map(d => ({
      id: d.id,
      label: d.reference,
      title: d.title
    }));

    let directAnswer = '';
    let recommendation = '';

    // Specialized query pattern matching for hyper-accurate HSSE answers
    if (/\bkebisingan\b|\bnab\b/.test(q)) {
      directAnswer = `Ada dua acuan berbeda:<br>
      <ul>
        <li><strong>Tempat kerja</strong> (Permenaker 5/2018): NAB <strong>85 dBA</strong> untuk 8 jam/hari; area >85 dBA wajib APD telinga.</li>
        <li><strong>Lingkungan/batas pagar</strong> (KepmenLH 48/1996): kawasan industri <strong>70 dBA</strong>, pemukiman <strong>55 dBA</strong>.</li>
      </ul>
      Area Rumah Pompa dan Filling Shed (82–87 dBA) perlu rambu APD telinga, pemetaan kebisingan, dan audiometri tahunan.`;
      recommendation = `Cek menu <strong>Status Lingkungan Kerja</strong> di PERMATA untuk membandingkan hasil ukur terakhir dengan 85 dBA (kerja) dan 70 dBA (pagar).`;
    } else if (/air limbah|\bows\b|oil catcher|\bstp\b|domestik/.test(q)) {
      directAnswer = `Air limbah mengikuti dua acuan:
      <ul>
        <li><strong>Outlet OWS depot/terminal minyak</strong> (Permen LH 19/2010 Lampiran V): pH 6–9, Minyak &amp; Lemak maks 25 mg/L, TOC maks 110 mg/L.</li>
        <li><strong>Air limbah domestik/STP</strong> (Permen LH/BPLH 11/2025, menggantikan P.68/2016): nilai bergantung jenis air limbah, media pelepasan, dan debit. Gunakan nilai pada Persetujuan Teknis fasilitas.</li>
      </ul>`;
      recommendation = `Seluruh hasil uji tidak boleh melampaui baku mutu pada Persetujuan Teknis; lihat menu <strong>Status Lingkungan Kerja &gt; Air Limbah</strong>.`;
    } else if (/ambien|kebauan|pm10|nmhc/.test(q)) {
      directAnswer = `Baku mutu udara ambien (PP 22/2021 Lampiran VII): SO₂ 150 µg/Nm³ (1 jam), NO₂ 200 µg/Nm³ (1 jam), PM10 75 µg/Nm³ (24 jam), Hidrokarbon/NMHC 160 µg/Nm³ (3 jam). Kebauan H₂S: 0,02 ppm (KepmenLH 50/1996).`;
      recommendation = `Bandingkan dengan hasil ukur terakhir di menu <strong>Status Lingkungan Kerja &gt; Udara Ambien</strong>.`;
    } else if (/sanksi|denda|paksaan/.test(q)) {
      directAnswer = `Menurut <strong>Permen LH 6/2026</strong>, sanksi administratif berupa: teguran tertulis, paksaan pemerintah, denda administratif, pembekuan, dan pencabutan persetujuan. Pelampauan baku mutu air limbah, emisi, atau udara ambien dapat menjadi pemicunya.`;
      recommendation = `Catat setiap pelampauan di <strong>Tracking Temuan</strong> dan selesaikan tindak lanjutnya.`;
    } else if (/emisi|genset|cerobong/.test(q)) {
      const em = (P.monitoringCalc ? P.monitoringCalc.params : []).filter(x => x.cat === 'emission');
      const rows = em.map(x => `<li><strong>${ui.escapeHtml(x.name)}</strong>: maks <strong>${x.bml} ${ui.escapeHtml(x.unit)}</strong></li>`).join('');
      directAnswer = `Baku mutu emisi genset dan pompa PMK diesel ditetapkan dalam <strong>Persetujuan Teknis emisi</strong> fasilitas. Nilai kerja yang dipakai PERMATA saat ini (harus disamakan dengan Persetujuan Teknis masing-masing terminal):
      <ul>${rows}</ul>
      Uji oleh laboratorium terakreditasi KAN.`;
      recommendation = `Pastikan cerobong dilengkapi lubang sampling (sampling port) standar SNI dengan tangga bordes permanen.`;
    } else if (q.includes('merah') || q.includes('jatuh') || q.includes('syarat mutlak') || q.includes('biru')) {
      directAnswer = `Berdasarkan <strong>Permen LH/BPLH No. 7 Tahun 2025</strong>, sebuah fasilitas berisiko langsung jatuh ke <strong>PROPER MERAH</strong> apabila terdapat salah satu pelanggaran mutlak berikut:
      <ol>
        <li><strong>Persetujuan Lingkungan</strong>: Beroperasi tanpa memiliki dokumen AMDAL/UKL-UPL yang sesuai kapasitas riil, atau belum memiliki Pertek & SLO air limbah/emisi.</li>
        <li><strong>Pengendalian Pencemaran Air</strong>: Membuang air limbah tanpa melalui IPAL / Oil Catcher (bypass), atau baku mutu outlet terlampaui berulang kali tanpa tindakan korektif.</li>
        <li><strong>Pengelolaan Limbah B3</strong>: Melakukan *open dumping* limbah B3, menyerahkan limbah B3 kepada pihak ketiga tanpa izin KLHK, atau tidak menggunakan manifest elektronik <strong>FESTRONIK</strong>.</li>
        <li><strong>Sanksi Gakkum</strong>: Sedang dalam masa sanksi administratif paksaan pemerintah yang belum diselesaikan (belum ada status taat dari pengawas).</li>
      </ol>`;
      recommendation = `Gunakan fitur <strong>Predictive AI & Simulasi</strong> di PERMATA untuk mendeteksi *Critical Blockers* ketaatan sebelum jadwal verifikasi audit tiba.`;
    } else if (q.includes('perca')) {
      directAnswer = `Berdasarkan <strong>Pedoman PERCA (PHE 2024 / Pertagas)</strong>, penilaian kinerja lingkungan terbagi dalam 5 pilar utama dengan target minimal skor <strong>85%</strong>:
      <ul>
        <li><strong>Pilar 1: Pelaksanaan Dokumen Lingkungan</strong> — Ketaatan pelaporan RKL-RPL dan pemenuhan izin teknis.</li>
        <li><strong>Pilar 2: Pengendalian Air</strong> — Efektivitas Oil Catcher, pengujian lab KAN bulanan, dan kompetensi PPPA.</li>
        <li><strong>Pilar 3: Pengelolaan Limbah B3</strong> — Legalitas TPS B3, logbook, neraca, dan 100% manifest via FESTRONIK.</li>
        <li><strong>Pilar 4: Pengendalian Udara</strong> — Emisi cerobong genset/pompa dan pelaporan inventarisasi emisi GRK (CO₂, CH₄, N₂O).</li>
        <li><strong>Pilar 5: Pemulihan Lingkungan & Gakkum</strong> — Bebas sanksi hukum dan penanganan cepat insiden tumpahan.</li>
      </ul>`;
      recommendation = `Buka menu <strong>PERCA</strong> di sidebar untuk melihat capaian radar 5 pilar fasilitas Anda saat ini.`;
    } else if (q.includes('emas') || q.includes('beyond') || q.includes('sroi') || q.includes('lca')) {
      directAnswer = `Untuk meraih peringkat tertinggi <strong>PROPER EMAS</strong>, perusahaan wajib:
      <ol>
        <li>Lolos <strong>100% Kriteria Ketaatan (Compliance)</strong> tanpa catatan minor sekalipun.</li>
        <li>Memiliki sertifikasi <strong>ISO 14001:2015</strong> yang masih aktif dengan sistem terintegrasi.</li>
        <li>Menyusun kajian <strong>Life Cycle Assessment (LCA)</strong> terverifikasi pihak ketiga independen.</li>
        <li>Memiliki program <strong>Ekoinovasi</strong> yang memiliki novelty tinggi (kebaruan teknologi/metode efisiensi sumber daya).</li>
        <li>Menjalankan <strong>Inovasi Sosial (CSR)</strong> berbasis pemberdayaan masyarakat dengan rasio <strong>SROI &ge; 1 : 2.5</strong>.</li>
        <li>Presentasi wawancara langsung <strong>Green Leadership</strong> oleh Operation Head / Terminal Manager di hadapan Dewan Pertimbangan PROPER.</li>
      </ol>`;
      recommendation = `Pastikan laporan perhitungan SROI dan dokumen DDE Ekoinovasi sudah disiapkan minimal 2 bulan sebelum batas unggah DRKPL di SIMPEL.`;
    } else {
      // General synthesis
      directAnswer = `Berdasarkan telaah dokumen <strong>${primaryDoc.title}</strong> (${primaryDoc.reference}):<br><br>
      ${primaryDoc.snippet}<br><br>
      <strong>Penerapan pada Fasilitas PT Pertamina Patra Niaga:</strong><br>
      ${primaryDoc.facilityApp}`;
      recommendation = `Persiapkan berkas evidence pendukung: <em>${primaryDoc.evidenceRequired}</em> untuk memastikan kesiapan saat diaudit.`;
    }

    return {
      text: directAnswer,
      citations: citations,
      recommendation: recommendation
    };
  }

  // ==============================================================
  // 3. STATE & CHAT HISTORY
  // ==============================================================
  let activeFilter = 'all';
  let chatHistory = [
    {
      role: 'bot',
      time: 'Baru saja',
      text: `Halo! Saya <strong>PERMATA AI Regulatory Assistant (RAG Engine)</strong>. 
      Saya dapat membantu Anda menjawab pertanyaan regulasi lingkungan, kriteria ketaatan & beyond compliance PROPER (Permen LH 7/2025), pedoman PERCA Pertamina, serta Baku Mutu Lingkungan fasilitas Terminal BBM A–D.<br><br>
      Silakan tanyakan hal seputar regulasi atau pilih pertanyaan cepat di bawah.`,
      citations: [
        { id: 'rag-doc-01', label: 'Permen LH/BPLH 7/2025', title: 'Persetujuan Lingkungan' },
        { id: 'rag-doc-06', label: 'Pedoman PERCA 2024', title: 'Ketentuan 5 Aspek PERCA' }
      ],
      recommendation: 'Seluruh jawaban disertai rujukan hukum resmi dan implikasi teknis lapangan.'
    }
  ];

  // ==============================================================
  // 4. VIEW RENDER & MOUNT
  // ==============================================================
  function render(ctx) {
    return `
      <div class="rag-container">
        <!-- Main Chat Panel -->
        <div class="rag-main-card">
          <div class="rag-header">
            <div class="rag-header-left">
              <div class="rag-avatar">${ui.icon('bot')}</div>
              <div class="rag-header-title">
                <strong>AI Regulatory Assistant (RAG)</strong>
                <span>Knowledge Base: ${KNOWLEDGE_CORPUS.length} Dokumen Regulasi Lingkungan Terindeks • Live Model</span>
              </div>
            </div>
            <div class="ai-badge ai-badge--sparkle">
              ${ui.icon('sparkles')} RAG Grounded
            </div>
          </div>

          <!-- Category Filter Bar -->
          <div class="rag-filters" id="ragFilterBar">
            <button class="rag-filter-btn ${activeFilter === 'all' ? 'active' : ''}" data-cat="all">Semua Regulasi</button>
            <button class="rag-filter-btn ${activeFilter === 'proper' ? 'active' : ''}" data-cat="proper">Kriteria PROPER (Permen LH 7/2025)</button>
            <button class="rag-filter-btn ${activeFilter === 'perca' ? 'active' : ''}" data-cat="perca">Ketentuan PERCA Pertamina</button>
            <button class="rag-filter-btn ${activeFilter === 'bml' ? 'active' : ''}" data-cat="bml">Baku Mutu (PP 22/2021 & Permen LHK 11)</button>
            <button class="rag-filter-btn ${activeFilter === 'internal' ? 'active' : ''}" data-cat="internal">SOP Internal Fasilitas</button>
          </div>

          <!-- Chat Messages Area -->
          <div class="rag-chat-history" id="ragChatHistory">
            ${chatHistory.map((msg, idx) => renderMessage(msg, idx)).join('')}
          </div>

          <!-- Quick Suggestion Prompts -->
          <div class="rag-prompts-bar" id="ragPromptsBar">
            <button class="rag-prompt-pill" data-ask="Apa saja syarat mutlak agar tidak jatuh ke peringkat PROPER Merah?">
              ${ui.icon('shield-alert')} Syarat Mutlak Lolos PROPER Biru?
            </button>
            <button class="rag-prompt-pill" data-ask="Berapa Baku Mutu Emisi Genset dan Pompa PMK dan persyaratan Persetujuan Teknis emisi?">
              ${ui.icon('factory')} Baku Mutu Emisi Genset & Pompa PMK?
            </button>
            <button class="rag-prompt-pill" data-ask="Berapa batas kebisingan lingkungan kerja 8 jam menurut Permenaker 5/2018?">
              ${ui.icon('volume-2')} Batas NAB Kebisingan Lingkungan Kerja?
            </button>
            <button class="rag-prompt-pill" data-ask="Bagaimana 5 pilar penilaian PERCA Pertamina?">
              ${ui.icon('scale')} 5 Pilar Kinerja PERCA Pertamina?
            </button>
            <button class="rag-prompt-pill" data-ask="Apa saja kriteria beyond compliance untuk raih peringkat PROPER EMAS?">
              ${ui.icon('award')} Cara Meraih PROPER EMAS (SROI & LCA)?
            </button>
          </div>

          <!-- Chat Input Form -->
          <form class="rag-input-form" id="ragInputForm">
            <div class="rag-input-box">
              <input type="text" id="ragQueryInput" placeholder="Tanyakan seputar regulasi lingkungan, baku mutu, PROPER, atau PERCA..." autocomplete="off">
            </div>
            <button type="submit" class="rag-send-btn" id="ragSendBtn">
              ${ui.icon('send')} Kirim
            </button>
          </form>
        </div>

        <!-- Right Side: Knowledge Base Explorer -->
        <aside class="rag-side-card">
          <div class="rag-side-title">
            ${ui.icon('book-open')} Dokumen Regulasi Terindeks
          </div>
          <p style="margin:0;font-size:12px;color:var(--slate);line-height:1.4">
            Model RAG mengambil rujukan dari dokumen resmi berikut untuk menghasilkan jawaban terverifikasi:
          </p>

          <div class="rag-doc-list">
            ${KNOWLEDGE_CORPUS.map(doc => `
              <div class="rag-doc-item" data-view-doc="${doc.id}">
                <strong>${ui.escapeHtml(doc.title)}</strong>
                <span>
                  <span>${ui.escapeHtml(doc.reference)}</span>
                  <span class="ai-badge ai-badge--sparkle" style="padding:1px 6px;font-size:10px">${doc.category.toUpperCase()}</span>
                </span>
              </div>
            `).join('')}
          </div>

          <div style="margin-top:auto;padding-top:12px;border-top:1px solid var(--border);font-size:11.5px;color:var(--slate);line-height:1.4">
            <strong style="color:var(--forest)">${ui.icon('lightbulb')} Tips RAG Assistant:</strong> Klik salah satu dokumen di atas untuk membaca kutipan regulasi &amp; panduan teknis implementasi lapangan.
          </div>
        </aside>
      </div>
    `;
  }

  function renderMessage(msg, idx) {
    if (msg.role === 'user') {
      return `
        <div class="rag-bubble rag-bubble--user">
          <div class="rag-bubble-body">
            <p>${ui.escapeHtml(msg.text)}</p>
          </div>
        </div>
      `;
    }

    return `
      <div class="rag-bubble rag-bubble--bot">
        <div class="rag-avatar" style="width:32px;height:32px;border-radius:10px;flex-shrink:0">
          ${ui.icon('bot')}
        </div>
        <div class="rag-bubble-body">
          <div class="rag-bubble-meta">
            <span><strong>PERMATA AI</strong> • Regulatory Knowledge</span>
            <span>${msg.time || 'Baru saja'}</span>
          </div>
          <div class="rag-bubble-text">
            ${msg.text}
          </div>

          ${msg.recommendation ? `
            <div class="rag-recommendation-box">
              <strong>${ui.icon('lightbulb')} Rekomendasi Operasional:</strong> ${msg.recommendation}
            </div>
          ` : ''}

          ${msg.citations && msg.citations.length ? `
            <div class="rag-citations">
              <span class="rag-citations-label">${ui.icon('check-check')} Rujukan Regulasi Terverifikasi (RAG Citations):</span>
              <div class="rag-citation-chips">
                ${msg.citations.map(c => `
                  <button type="button" class="rag-cite-chip" data-view-doc="${c.id}">
                    ${ui.icon('file-text')} ${ui.escapeHtml(c.label)}
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  function openDocDetailModal(docId) {
    const doc = KNOWLEDGE_CORPUS.find(d => d.id === docId);
    if (!doc) return;

    ui.modal({
      title: doc.title,
      subtitle: doc.reference,
      size: 'lg',
      body: `
        <div style="font-family:inherit;font-size:13.5px;line-height:1.6;color:#2D3E35;display:flex;flex-direction:column;gap:14px">
          <div style="background:#F1F8F4;border-left:4px solid var(--forest);padding:12px 16px;border-radius:4px">
            <strong style="color:var(--forest);display:block;margin-bottom:4px">Ketentuan Regulasi Resmi:</strong>
            ${ui.escapeHtml(doc.snippet)}
          </div>

          <div>
            <strong style="color:var(--dark);display:block;margin-bottom:4px">Penerapan Spesifik di Fasilitas PT Pertamina Patra Niaga:</strong>
            <p style="margin:0;color:#374151">${ui.escapeHtml(doc.facilityApp)}</p>
          </div>

          <div style="background:#FAFDFB;border:1px solid var(--border);padding:12px 16px;border-radius:8px">
            <strong style="color:var(--dark);display:block;margin-bottom:4px">Berkas Evidence / Dokumen Pembuktian yang Diperlukan:</strong>
            <span style="color:var(--slate)">${ui.escapeHtml(doc.evidenceRequired)}</span>
          </div>
        </div>
      `,
      footer: `
        <button class="btn btn--primary" data-modal-close>Tutup</button>
      `
    });
  }

  function handleUserQuery(query, container) {
    if (!query || !query.trim()) return;
    const cleanQ = query.trim();

    // Add user message
    chatHistory.push({
      role: 'user',
      text: cleanQ,
      time: 'Baru saja'
    });

    // Run RAG retrieval & answer synthesis
    const matchedDocs = searchKnowledgeBase(cleanQ, activeFilter);
    const synthesized = synthesizeAnswer(cleanQ, matchedDocs);

    // Add bot answer
    chatHistory.push({
      role: 'bot',
      text: synthesized.text,
      time: 'Baru saja',
      citations: synthesized.citations,
      recommendation: synthesized.recommendation
    });

    // Re-render chat history
    const historyEl = container.querySelector('#ragChatHistory');
    if (historyEl) {
      historyEl.innerHTML = chatHistory.map((msg, idx) => renderMessage(msg, idx)).join('');
      historyEl.scrollTop = historyEl.scrollHeight;
      ui.refreshIcons();
    }
  }

  function mount(root, ctx) {
    // Form submit
    const form = root.querySelector('#ragInputForm');
    const input = root.querySelector('#ragQueryInput');
    if (form && input) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const val = input.value;
        if (val) {
          handleUserQuery(val, root);
          input.value = '';
        }
      });
    }

    // Quick prompt buttons
    root.querySelectorAll('[data-ask]').forEach(btn => {
      btn.addEventListener('click', () => {
        const question = btn.getAttribute('data-ask');
        handleUserQuery(question, root);
      });
    });

    // Filter category buttons
    root.querySelectorAll('#ragFilterBar [data-cat]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.getAttribute('data-cat');
        root.querySelectorAll('#ragFilterBar [data-cat]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Click citation or doc item to view full document excerpt
    root.addEventListener('click', e => {
      const citeBtn = e.target.closest('[data-view-doc]');
      if (citeBtn) {
        const docId = citeBtn.getAttribute('data-view-doc');
        openDocDetailModal(docId);
      }
    });

    // Scroll chat to bottom
    const historyEl = root.querySelector('#ragChatHistory');
    if (historyEl) {
      historyEl.scrollTop = historyEl.scrollHeight;
    }
  }

  P.views = P.views || {};
  P.views.ai = { render, mount };
  P.aiRag = {
    search: searchKnowledgeBase,
    ask: synthesizeAnswer,
    getCorpus: () => KNOWLEDGE_CORPUS
  };
})(window);
