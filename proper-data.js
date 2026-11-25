/* PERMATA - Master Data Kriteria PROPER
   Berdasarkan Permen LH/BPLH No. 7 Tahun 2025 & Panduan Bentuk Penerapan Kriteria PROPER PT Pertamina Patra Niaga (PT PPN)
*/
(function (global) {
  const P = global.PERMATA = global.PERMATA || {};

  const STATUS_META = {
    verified: { label: 'Terverifikasi', tone: 'green', icon: 'check-circle-2' },
    pending: { label: 'Menunggu Verifikasi', tone: 'amber', icon: 'clock' },
    revisi: { label: 'Perlu Perbaikan', tone: 'red', icon: 'alert-triangle' },
    empty: { label: 'Belum Diisi', tone: 'gray', icon: 'circle-dashed' }
  };

  const GROUPS = {
    compliance: {
      id: 'compliance',
      title: 'Kriteria Ketaatan',
      subtitle: '11 Aspek Penilaian Ketaatan Lingkungan',
      icon: 'shield-check',
      target: 95,
      description: 'Menilai ketaatan terhadap peraturan perundang-undangan lingkungan hidup (Pasal 17 ayat 3-6 Permen LH/BPLH No. 7/2025).'
    },
    beyond: {
      id: 'beyond',
      title: 'Kriteria Beyond Compliance',
      subtitle: '7 Kelompok Kinerja Melebihi Ketaatan',
      icon: 'award',
      target: 85,
      description: 'Menilai inovasi, efisiensi sumber daya, dan keberlanjutan yang melampaui kepatuhan dasar (Pasal 17 ayat 7-8 Permen LH/BPLH No. 7/2025).'
    }
  };

  const criteria = [
    /* ==========================================================================
       11 ASPEK KELOMPOK KETAATAN (COMPLIANCE) - PERMEN LH/BPLH 7/2025
       ========================================================================== */
    {
      id: 'c01',
      group: 'compliance',
      no: '01',
      code: 'C-01',
      name: 'Persetujuan Lingkungan',
      icon: 'file-check-2',
      tagline: 'Dokumen Persetujuan, AMDAL/UKL-UPL, dan RKL-RPL',
      pic: 'Sari Wulandari',
      due: '2026-07-05',
      description: 'Memastikan fasilitas memiliki Persetujuan Lingkungan (AMDAL / UKL-UPL) yang sah dan sesuai kapasitas serta kegiatan aktual, serta komitmen RKL-RPL dipantau dan dilaporkan secara berkala (Pasal 17(3), 19(1)(a), dan 20 Permen LH/BPLH 7/2025).',
      laws: [
        { ref: 'PP No. 22 Tahun 2021', about: 'Penyelenggaraan Perlindungan dan Pengelolaan Lingkungan Hidup' },
        { ref: 'Permen LHK No. 4 Tahun 2021', about: 'Penapisan Usaha Wajib AMDAL, UKL-UPL, atau SPPL' },
        { ref: 'Permen LH/BPLH No. 7 Tahun 2025', about: 'Pasal 17 ayat (3) & Pasal 19 ayat (1) huruf a' }
      ],
      practicalGuide: [
        { title: 'Fuel Terminal', text: 'Penerimaan BBM dari kapal/pipa, kapasitas tangki timbun, loading bay mobil tangki, dan jalur pipa harus tercakup dalam Persetujuan Lingkungan. Jika ada penambahan kapasitas tangki, lakukan pengurusan perubahan izin.' },
        { title: 'SPBU & DPPU', text: 'Persetujuan Lingkungan (UKL-UPL/SPPL) mencakup kapasitas tangki pendam, jumlah dispenser, sistem drainase, separator BBM, dan genset emergency.' },
        { title: 'Pelaksanaan Komitmen', text: 'Setiap komitmen RKL-RPL memiliki jadwal pemantauan, titik koordinat pantau, PIC penanggung jawab, dan dilaporkan ke SIMPEL/DLH per semester.' }
      ],
      companyPractice: [
        'Memiliki SK Persetujuan Lingkungan dan dokumen AMDAL / UKL-UPL yang termutakhirkan.',
        'Laporan pelaksanaan RKL-RPL Semester I dan II disampaikan tepat waktu melalui portal SIMPEL KLHK.',
        'Tersedia matriks kesesuaian operasional lapangan terhadap arahan dokumen lingkungan.'
      ],
      evidenceDocs: [
        { name: 'Persetujuan_Lingkungan_Terminal_A.pdf', type: 'AMDAL / UKL-UPL', size: '2.4 MB', date: '2025-01-15' },
        { name: 'Laporan_RKL_RPL_Semester_I_2026.pdf', type: 'Laporan Pelaksanaan', size: '4.8 MB', date: '2026-06-20' },
        { name: 'Bukti_Tanda_Terima_SIMPEL_KLHK.pdf', type: 'Bukti Pelaporan', size: '380 KB', date: '2026-06-22' }
      ],
      evidencePhotos: [
        { name: 'Papan_Persetujuan_Lingkungan.jpg', caption: 'Papan informasi izin lingkungan di gerbang utama fasilitas' },
        { name: 'Area_Buffer_Zone_Fasilitas.jpg', caption: 'Zona penyangga hijau sesuai dokumen RKL-RPL' }
      ],
      indicators: [
        { id: 'c01-i1', title: 'Kepemilikan Persetujuan Lingkungan Sah', desc: 'Memiliki AMDAL/UKL-UPL sesuai kapasitas aktual.', weight: 30, status: 'verified', pic: 'Sari Wulandari' },
        { id: 'c01-i2', title: 'Kesesuaian Kegiatan Operasional', desc: 'Tidak ada perubahan kapasitas/proses tanpa persetujuan perubahan.', weight: 25, status: 'verified', pic: 'Sari Wulandari' },
        { id: 'c01-i3', title: 'Pelaksanaan Pemantauan RKL-RPL', desc: 'Parameter lingkungan dipantau sesuai matriks.', weight: 25, status: 'verified', pic: 'Rangga Aditya' },
        { id: 'c01-i4', title: 'Pelaporan Berkala Semesteran', desc: 'Pelaporan SIMPEL/DLH tepat waktu.', weight: 20, status: 'verified', pic: 'Rangga Aditya' }
      ]
    },
    {
      id: 'c02',
      group: 'compliance',
      no: '02',
      code: 'C-02',
      name: 'Pengendalian Pencemaran Air',
      icon: 'droplets',
      tagline: 'Pengelolaan Air Limbah, IPAL/OWS, dan Baku Mutu',
      pic: 'Nabila Putri',
      due: '2026-06-26',
      description: 'Inventarisasi sumber air limbah (memisahkan air limbah domestik dan operasional/proses), pengelolaan melalui IPAL/Oil-Water Separator (OWS), kepatuhan Persetujuan Teknis & SLO, pengujian laboratorium terakreditasi, dan pemenuhan baku mutu (Pasal 17(3) & 19(1)(b) Permen LH/BPLH 7/2025).',
      laws: [
        { ref: 'PP No. 22 Tahun 2021', about: 'Penyelenggaraan Perlindungan dan Pengelolaan Lingkungan Hidup' },
        { ref: 'Permen LH/BPLH No. 11 Tahun 2025', about: 'Baku Mutu Air Limbah Domestik (mencabut Permen LHK P.68/2016)' },
        { ref: 'Permen LHK No. 5 Tahun 2021', about: 'Persetujuan Teknis & SLO Pembuangan Air Limbah' }
      ],
      practicalGuide: [
        { title: 'Fuel Terminal', text: 'Air limbah domestik dari kantor diarahkan ke STP/biofilter. Air dari area pencucian mobil tangki dan area loading yang berpotensi kena hidrokarbon dialirkan ke Oil-Water Separator (OWS) terkalibrasi.' },
        { title: 'SPBU', text: 'Air limpasan area dispenser disalurkan melewati oil catcher sebelum dibuang, sedangkan limbah toilet dikelola mandiri via septic tank kedap.' },
        { title: 'Operasional Sehari-hari', text: 'Operator mencatat debit harian, kondisi fisik OWS, pembersihan lumpur/minyak secara terjadwal, dan pengambilan sampel uji tiap bulan.' }
      ],
      companyPractice: [
        'Memisahkan secara fisik saluran air limbah domestik dan saluran limpasan berpotensi tercemar minyak.',
        'Unit OWS 3 kompartemen beroperasi optimal dengan skim oil pump otomatis.',
        'Uji kualitas air limbah rutin tiap bulan di laboratorium lingkungan terakreditasi KAN.'
      ],
      evidenceDocs: [
        { name: 'Persetujuan_Teknis_Air_Limbah_2025.pdf', type: 'Pertek & SLO', size: '1.9 MB', date: '2025-04-10' },
        { name: 'Hasil_Uji_Lab_Air_Limbah_Mei_2026.pdf', type: 'Sertifikat Hasil Uji', size: '850 KB', date: '2026-05-28' },
        { name: 'Logbook_Debit_Harian_OWS.pdf', type: 'Catatan Operasional', size: '1.2 MB', date: '2026-06-15' }
      ],
      evidencePhotos: [
        { name: 'Unit_Oil_Water_Separator.jpg', caption: 'Unit OWS 3 kompartemen dan bak penampung minyak' },
        { name: 'Titik_Penaatan_Sampling_Outfall.jpg', caption: 'Titik sampling air limbah berizin dengan papan koordinat' }
      ],
      indicators: [
        { id: 'c02-i1', title: 'Inventarisasi & Pemisahan Jalur Air Limbah', desc: 'Air domestik dan operasional terpisah.', weight: 20, status: 'verified', pic: 'Nabila Putri' },
        { id: 'c02-i2', title: 'Operasional & Pemeliharaan IPAL/OWS', desc: 'Fasilitas OWS berfungsi baik dan dirawat.', weight: 20, status: 'verified', pic: 'Nabila Putri' },
        { id: 'c02-i3', title: 'Pengujian Mutu Laboratorium', desc: 'Uji berkala lab KAN sesuai baku mutu.', weight: 25, status: 'verified', pic: 'Nabila Putri' },
        { id: 'c02-i4', title: 'Pemenuhan Parameter Baku Mutu', desc: 'Parameter pH, COD, TSS, Minyak & Lemak taat.', weight: 25, status: 'verified', pic: 'Nabila Putri' },
        { id: 'c02-i5', title: 'Kompetensi Personel Pengolah Air', desc: 'Sertifikat POPAL/PPPA operator.', weight: 10, status: 'verified', pic: 'Nabila Putri' }
      ]
    },
    {
      id: 'c03',
      group: 'compliance',
      no: '03',
      code: 'C-03',
      name: 'Pemeliharaan Sumber Air',
      icon: 'waves',
      tagline: 'Kesesuaian Penggunaan Air & Ketentuan AMDK',
      pic: 'Fajar Nugroho',
      due: '2026-07-15',
      description: 'Berdasarkan Pasal 17 ayat (4) Permen LH/BPLH 7/2025, penilaian kriteria ini dikhususkan bagi usaha yang memproduksi Air Minum Dalam Kemasan (AMDK). Fasilitas distribusi BBM PT PPN melengkapi catatan izin pengambilan air tanah (SIPA) dan meter air secara transparan.',
      laws: [
        { ref: 'Permen LH/BPLH No. 7 Tahun 2025', about: 'Pasal 17 ayat (4), Pasal 19 ayat (1) huruf c' },
        { ref: 'UU No. 17 Tahun 2019', about: 'Sumber Daya Air' }
      ],
      practicalGuide: [
        { title: 'Status Fasilitas Non-AMDK', text: 'Untuk Fuel Terminal / DPPU / SPBU yang bukan produsen AMDK, cantumkan penetapan bahwa kriteria ini tidak dinilai wajib PROPER berdasarkan Pasal 17(4).' },
        { title: 'Kepatuhan Internal Fasilitas', text: 'Tetap kelola pemanfaatan air tanah/permukaan secara tertib: miliki izin pengusahaan air tanah (SIPA) aktif, pasang meter air di sumur dalam, dan catat volume pemakaian bulanan.' }
      ],
      companyPractice: [
        'Memiliki dokumen SIPA sumur dalam yang masih berlaku.',
        'Pencatatan meteran debit air tanah harian/bulanan tertata rapi.',
        'Dokumen penapisan non-AMDK tersedia dalam berkas administrasi PROPER.'
      ],
      evidenceDocs: [
        { name: 'Surat_Izin_Pengambilan_Air_Tanah_SIPA.pdf', type: 'Izin Legal', size: '1.4 MB', date: '2024-08-19' },
        { name: 'Catatan_Debit_Meter_Air_Bulanan.pdf', type: 'Logbook Penggunaan', size: '520 KB', date: '2026-06-01' },
        { name: 'Surat_Penetapan_Cakupan_Non_AMDK.pdf', type: 'Kajian Penapisan', size: '310 KB', date: '2026-01-10' }
      ],
      evidencePhotos: [
        { name: 'Meteran_Air_Sumur_Dalam.jpg', caption: 'Water meter terkalibrasi di sumur air tanah dalam' },
        { name: 'Papan_Informasi_SIPA.jpg', caption: 'Papan izin pengusahaan air tanah di lokasi sumur' }
      ],
      indicators: [
        { id: 'c03-i1', title: 'Kepemilikan Izin Pengambilan Air (SIPA)', desc: 'Izin pemanfaatan air tanah sah dan berlaku.', weight: 35, status: 'verified', pic: 'Fajar Nugroho' },
        { id: 'c03-i2', title: 'Pemasangan & Pencatatan Water Meter', desc: 'Meter air berfungsi dan dicatat rutin.', weight: 35, status: 'verified', pic: 'Fajar Nugroho' },
        { id: 'c03-i3', title: 'Penapisan Status Kriteria PROPER', desc: 'Penetapan status non-AMDK terdokumentasi.', weight: 30, status: 'verified', pic: 'Fajar Nugroho' }
      ]
    },
    {
      id: 'c04',
      group: 'compliance',
      no: '04',
      code: 'C-04',
      name: 'Pengendalian Pencemaran Udara',
      icon: 'wind',
      tagline: 'Emisi Genset, Uji Cerobong, Udara Ambien, dan VOC',
      pic: 'Dimas Prasetyo',
      due: '2026-07-20',
      description: 'Inventarisasi seluruh sumber emisi (bergerak, tidak bergerak, dan fugitif), pemenuhan Persetujuan Teknis & SLO emisi jika diwajibkan, uji emisi cerobong genset/boiler berkala, pemantauan udara ambien, kebauan, kebisingan, serta pengendalian uap BBM/VOC (Pasal 17(3) & 19(1)(d) Permen LH/BPLH 7/2025).',
      laws: [
        { ref: 'PP No. 22 Tahun 2021', about: 'Penyelenggaraan Perlindungan dan Pengelolaan Lingkungan Hidup' },
        { ref: 'Permen LHK No. 11 Tahun 2021', about: 'Baku Mutu Emisi Mesin dengan Pembakaran Dalam (Genset)' },
        { ref: 'Permen LH/BPLH No. 7 Tahun 2025', about: 'Pasal 17 ayat (3) & Pasal 19 ayat (1) huruf d' }
      ],
      practicalGuide: [
        { title: 'Fuel Terminal', text: 'Inventarisasi sumber emisi: genset emergency, fire pump engine, uap tangki BBM, filling shed. Pasang lubang sampling dan tangga pengaman cerobong genset sesuai standar.' },
        { title: 'SPBU & DPPU', text: 'Pemeliharaan dispenser BBM dan nozzle, uji genset operasional, pemantauan kualitas udara ambien dan kebisingan pagar batas.' },
        { title: 'Pengujian Berkala', text: 'Uji laboratorium terakreditasi parameter SO2, NOx, CO, Partikulat, dan Opasitas sesuai jam kerja mesin yang diwajibkan.' }
      ],
      companyPractice: [
        'Cerobong genset telah dilengkapi sampling port dan lantai kerja aman.',
        'Uji emisi cerobong genset dan uji udara ambien semesteran memenuhi baku mutu.',
        'Sistem Vapor Recovery Unit (VRU) / vapor balance beroperasi di area pengisian mobil tangki.'
      ],
      evidenceDocs: [
        { name: 'Hasil_Uji_Emisi_Cerobong_Genset_2026.pdf', type: 'Sertifikat Uji Lab', size: '1.6 MB', date: '2026-05-18' },
        { name: 'Hasil_Pemantauan_Udara_Ambien_Kebisingan.pdf', type: 'Laporan Laboratorium', size: '1.4 MB', date: '2026-05-20' },
        { name: 'Logbook_Jam_Operasi_Genset.pdf', type: 'Catatan Operasional', size: '480 KB', date: '2026-06-10' }
      ],
      evidencePhotos: [
        { name: 'Cerobong_Genset_Sampling_Port.jpg', caption: 'Cerobong genset dengan lubang sampling dan tangga bordes' },
        { name: 'Vapor_Recovery_Filling_Shed.jpg', caption: 'Fasilitas vapor recovery di area loading bay mobil tangki' }
      ],
      indicators: [
        { id: 'c04-i1', title: 'Inventarisasi Sumber Emisi Lengkap', desc: 'Daftar genset, kapasitas, jam kerja tercatat.', weight: 20, status: 'verified', pic: 'Dimas Prasetyo' },
        { id: 'c04-i2', title: 'Kelayakan Teknis Cerobong Emisi', desc: 'Sampling port, tangga, lubang uji memenuhi kaidah.', weight: 20, status: 'verified', pic: 'Dimas Prasetyo' },
        { id: 'c04-i3', title: 'Uji Emisi Cerobong Sesuai Jadwal', desc: 'Uji lab berkala terakreditasi KAN.', weight: 25, status: 'verified', pic: 'Dimas Prasetyo' },
        { id: 'c04-i4', title: 'Pemenuhan Baku Mutu Emisi & Ambien', desc: 'Parameter SO2, NOx, CO, Kebisingan taat.', weight: 25, status: 'verified', pic: 'Dimas Prasetyo' },
        { id: 'c04-i5', title: 'Sertifikasi Kompetensi Operator Emisi', desc: 'Sertifikat PPPU personel.', weight: 10, status: 'verified', pic: 'Dimas Prasetyo' }
      ]
    },
    {
      id: 'c05',
      group: 'compliance',
      no: '05',
      code: 'C-05',
      name: 'Pengelolaan Limbah B3',
      icon: 'alert-triangle',
      tagline: 'TPS Limbah B3, Neraca, Manifest Festronik, & Pengolah Berizin',
      pic: 'Rizky Anggara',
      due: '2026-06-30',
      description: 'Identifikasi dan pemilahan limbah B3 (oli bekas, sludge tangki/OWS, filter/majun terkontaminasi, baterai bekas), penyimpanan di TPS Limbah B3 berizin/berintek, pencatatan logbook & neraca berkala, penyerahan kepada transporter & pengolah berizin via Festronik (Pasal 17(3) & 19(1)(e) Permen LH/BPLH 7/2025).',
      laws: [
        { ref: 'PP No. 22 Tahun 2021', about: 'Penyelenggaraan Perlindungan dan Pengelolaan Lingkungan Hidup' },
        { ref: 'Permen LHK No. 6 Tahun 2021', about: 'Tata Cara dan Persyaratan Pengelolaan Limbah B3' },
        { ref: 'Permen LH/BPLH No. 7 Tahun 2025', about: 'Pasal 17 ayat (3) & Pasal 19 ayat (1) huruf e' }
      ],
      practicalGuide: [
        { title: 'Fuel Terminal & SPBU', text: 'Simpan oli bekas, majun tercemar minyak, dan sludge tangki di TPS B3 beratap, lantai kedap dan berparit tampung ceceran (bundwall), pasang simbol dan label B3 standar, serta sediakan spill kit tanggap darurat.' },
        { title: 'Pencatatan & Neraca', text: 'Catat setiap limbah masuk dan keluar di logbook TPS B3 harian. Susun neraca limbah B3 triwulanan dan jangan simpan melebihi batas waktu (90/180 hari).' },
        { title: 'Penyerahan Limbah', text: 'Serahkan hanya kepada pengangkut dan pengolah berizin KLHK resmi, dengan bukti manifest elektronik (Festronik).' }
      ],
      companyPractice: [
        'Bangunan TPS Limbah B3 memenuhi standar teknis Permen LHK 6/2021 dengan simbol dan label terkini.',
        'Tersedia Spill Kit, eyewash station, dan APAR di dalam area TPS B3.',
        'Pencatatan neraca dan serah terima limbah B3 melalui Festronik 100% tercatat.'
      ],
      evidenceDocs: [
        { name: 'Persetujuan_Teknis_TPS_Limbah_B3.pdf', type: 'Izin / Rintek TPS', size: '2.1 MB', date: '2025-02-11' },
        { name: 'Logbook_dan_Neraca_Limbah_B3_Q2_2026.pdf', type: 'Catatan Neraca', size: '920 KB', date: '2026-06-15' },
        { name: 'Manifest_Festronik_Pengangkutan_Limbah.pdf', type: 'Festronik KLHK', size: '1.1 MB', date: '2026-06-18' }
      ],
      evidencePhotos: [
        { name: 'Bangunan_TPS_Limbah_B3.jpg', caption: 'TPS Limbah B3 beratap, lantai kedap, dan berlabel simbol B3' },
        { name: 'Drum_Kemasan_dan_Spill_Kit.jpg', caption: 'Kemasan drum tersusun rapi dengan secondary containment dan spill kit' }
      ],
      indicators: [
        { id: 'c05-i1', title: 'Identifikasi & Pencatatan Logbook B3', desc: 'Pencatatan jenis dan masa simpan limbah B3.', weight: 20, status: 'verified', pic: 'Rizky Anggara' },
        { id: 'c05-i2', title: 'Standar Teknis TPS Limbah B3', desc: 'Atap, lantai kedap, secondary containment, simbol/label.', weight: 25, status: 'verified', pic: 'Rizky Anggara' },
        { id: 'c05-i3', title: 'Penyusunan Neraca Limbah B3', desc: 'Rekonsiliasi stok timbulan, kirim, dan sisa.', weight: 20, status: 'verified', pic: 'Rizky Anggara' },
        { id: 'c05-i4', title: 'Legalitas Pengangkut & Festronik', desc: 'Kontrak transporter dan manifest Festronik sah.', weight: 25, status: 'verified', pic: 'Rizky Anggara' },
        { id: 'c05-i5', title: 'Kesiapan Tanggap Darurat Tumpahan', desc: 'SOP, spill kit, dan pelatihan tanggap tumpahan.', weight: 10, status: 'verified', pic: 'Rizky Anggara' }
      ]
    },
    {
      id: 'c06',
      group: 'compliance',
      no: '06',
      code: 'C-06',
      name: 'Pengelolaan Limbah Non-B3',
      icon: 'recycle',
      tagline: 'Penyimpanan, Pemanfaatan, dan Neraca Limbah Non-B3',
      pic: 'Bambang Sudibyo',
      due: '2026-07-25',
      description: 'Pengelolaan material sisa industri yang telah dipastikan bukan limbah B3 (besi scrap, kayu palet, kemasan industri tidak terkontaminasi), pencatatan timbulan, dan penyerahan ke pemanfaat resmi (Pasal 17(3) & 19(1)(f) Permen LH/BPLH 7/2025).',
      laws: [
        { ref: 'PP No. 22 Tahun 2021', about: 'Pengelolaan Limbah Non-B3' },
        { ref: 'Permen LH/BPLH No. 7 Tahun 2025', about: 'Pasal 17 ayat (3) & Pasal 19 ayat (1) huruf f' }
      ],
      practicalGuide: [
        { title: 'Identifikasi Material', text: 'Pastikan material sisa seperti besi tua, pipa bekas, kardus packing suku cadang, dan palet kayu tidak terkontaminasi bahan bakar atau oli. Jika terkontaminasi, klasifikasikan sebagai B3.' },
        { title: 'Penyimpanan & Pencatatan', text: 'Simpan terpisah di area khusus scrap yang tertata rapi. Catat volume masuk-keluar dalam neraca limbah non-B3.' },
        { title: 'Pemanfaatan', text: 'Serahkan kepada pihak pendaur ulang/pemanfaat dengan Berita Acara Serah Terima (BAST) dan nota timbang resmi.' }
      ],
      companyPractice: [
        'Area penyimpanan sementara material scrap dan palet kayu bersih dan terkelompok.',
        'Tersedia buku catatan timbulan dan pengeluaran limbah non-B3.',
        'Pemanfaatan kembali material palet dan penjualan scrap besi melalui lelang resmi.'
      ],
      evidenceDocs: [
        { name: 'Catatan_Neraca_Limbah_Non_B3_2026.pdf', type: 'Catatan Neraca', size: '640 KB', date: '2026-06-05' },
        { name: 'Berita_Acara_Serah_Terima_Scrap_Besi.pdf', type: 'BAST & Timbang', size: '780 KB', date: '2026-05-14' }
      ],
      evidencePhotos: [
        { name: 'Tempat_Penyimpanan_Scrap_Non_B3.jpg', caption: 'Area penampungan besi scrap dan palet kayu terpilah rapi' }
      ],
      indicators: [
        { id: 'c06-i1', title: 'Identifikasi Bebas Kontaminasi B3', desc: 'Pemastian material bersih dari minyak.', weight: 25, status: 'verified', pic: 'Bambang Sudibyo' },
        { id: 'c06-i2', title: 'Ketertiban Area Penyimpanan', desc: 'Area penyimpanan teratur dan tidak mencemari.', weight: 25, status: 'verified', pic: 'Bambang Sudibyo' },
        { id: 'c06-i3', title: 'Pencatatan Neraca Limbah Non-B3', desc: 'Pencatatan jumlah timbulan dan pemanfaatan.', weight: 25, status: 'verified', pic: 'Bambang Sudibyo' },
        { id: 'c06-i4', title: 'Bukti Serah Terima / Pemanfaatan', desc: 'BAST dan nota timbang tersimpan.', weight: 25, status: 'verified', pic: 'Bambang Sudibyo' }
      ]
    },
    {
      id: 'c07',
      group: 'compliance',
      no: '07',
      code: 'C-07',
      name: 'Pengelolaan Bahan Berbahaya dan Beracun (B3)',
      icon: 'flask-conical',
      tagline: 'Bahan Kimia, SDS, Label Simbol B3, & Bebas PCBs',
      pic: 'Hendro Kusumo',
      due: '2026-07-28',
      description: 'Pengelolaan bahan kimia/pelumas yang digunakan dalam operasional fasilitas, ketersediaan Safety Data Sheet (SDS/MSDS), pelabelan simbol bahaya, penyimpanan aman, prosedur tanggap tumpahan, dan inventarisasi PCBs pada trafo listrik (Pasal 17(3) & 19(1)(g) Permen LH/BPLH 7/2025).',
      laws: [
        { ref: 'PP No. 74 Tahun 2001', about: 'Pengelolaan Bahan Berbahaya dan Beracun (B3)' },
        { ref: 'Permen LH/BPLH No. 7 Tahun 2025', about: 'Pasal 17 ayat (3) & Pasal 19 ayat (1) huruf g (Pengaturan PCBs)' }
      ],
      practicalGuide: [
        { title: 'Gudang Bahan Kimia & Pelumas', text: 'Simpan pelumas baru, thinner, zat aditif, dan bahan kimia pengolahan air di gudang berventilasi baik, berlantai kedap, dan dilengkapi secondary containment.' },
        { title: 'SDS & Simbol', text: 'Setiap kemasan bahan kimia terpasang label bahaya dan tersedia lembar SDS dalam bahasa Indonesia di lokasi kerja.' },
        { title: 'Inventarisasi PCBs', text: 'Inventarisasi seluruh transformator dan kapasitor listrik; pastikan bebas minyak isolasi PCBs dengan surat keterangan pabrikan atau hasil uji dielectric test.' }
      ],
      companyPractice: [
        'Daftar inventarisasi seluruh bahan kimia dan pelumas aktif terdata lengkap.',
        'Lembar SDS terpasang di dinding gudang penyimpanan bahan kimia.',
        'Seluruh trafo listrik telah diuji dan bersertifikat non-PCBs.'
      ],
      evidenceDocs: [
        { name: 'Daftar_Inventaris_Bahan_B3_dan_SDS.pdf', type: 'Daftar B3 & SDS', size: '2.8 MB', date: '2026-03-12' },
        { name: 'Sertifikat_Uji_Trafo_Bebas_PCBs.pdf', type: 'Sertifikat Non-PCBs', size: '890 KB', date: '2025-11-20' }
      ],
      evidencePhotos: [
        { name: 'Gudang_Penyimpanan_Pelumas_B3.jpg', caption: 'Gudang pelumas berventilasi dengan simbol B3 dan SDS' },
        { name: 'Papan_Identifikasi_Trafo_Non_PCBs.jpg', caption: 'Transformator gardu induk dengan stiker identifikasi bebas PCBs' }
      ],
      indicators: [
        { id: 'c07-i1', title: 'Inventarisasi Bahan B3 Lengkap', desc: 'Daftar bahan kimia, pelumas, dan volume stok.', weight: 25, status: 'verified', pic: 'Hendro Kusumo' },
        { id: 'c07-i2', title: 'Ketersediaan SDS & Simbol B3', desc: 'SDS terpasang dan kemasan berlabel simbol.', weight: 25, status: 'verified', pic: 'Hendro Kusumo' },
        { id: 'c07-i3', title: 'Standar Penyimpanan Aman', desc: 'Ventilasi, secondary containment, dan APD.', weight: 25, status: 'verified', pic: 'Hendro Kusumo' },
        { id: 'c07-i4', title: 'Inventarisasi Peralatan Bebas PCBs', desc: 'Identifikasi trafo listrik bebas senyawa PCBs.', weight: 25, status: 'verified', pic: 'Hendro Kusumo' }
      ]
    },
    {
      id: 'c08',
      group: 'compliance',
      no: '08',
      code: 'C-08',
      name: 'Pengendalian Kerusakan Lahan',
      icon: 'mountain',
      tagline: 'Perlindungan Kualitas Tanah & Integritas Fasilitas Distribusi',
      pic: 'Fajar Nugroho',
      due: '2026-08-05',
      description: 'Pasal 17 ayat (5) Permen LH/BPLH 7/2025 membatasi bidang ini pada kegiatan pertambangan/biomassa. Untuk fasilitas distribusi BBM PT PPN, kriteria ini dipenuhi melalui pencegahan pencemaran tanah, tanggul tangki timbun (bundwall), dan perlindungan integritas perpipaan.',
      laws: [
        { ref: 'Permen LH/BPLH No. 7 Tahun 2025', about: 'Pasal 17 ayat (5), Pasal 19 ayat (1) huruf h' },
        { ref: 'PP No. 22 Tahun 2021', about: 'Baku Mutu Kerusakan Tanah' }
      ],
      practicalGuide: [
        { title: 'Status Fasilitas Distribusi', text: 'Kriteria khusus tambang tidak dinilai wajib pada Fuel Terminal / SPBU biasa. Dokumentasikan penapisan ruang lingkup operasional fasilitas.' },
        { title: 'Pencegahan Kebocoran Tanah', text: 'Periksa berkala integritas dasar tangki timbun, tanggul bundwall kedap minyak, pengujian proteksi katodik pipa bawah tanah, dan sumur pantau kualitas air tanah/tanah.' }
      ],
      companyPractice: [
        'Tanggul bundwall tangki timbun kedap minyak dan teruji kapasitas penampungannya.',
        'Sistem cathodic protection pipa bawah tanah dipantau berkala.',
        'Sumur pantau air tanah di sekitar area tangki timbun dipantau per semester.'
      ],
      evidenceDocs: [
        { name: 'Laporan_Inspeksi_Integritas_Bundwall.pdf', type: 'Laporan Teknis', size: '1.5 MB', date: '2026-04-22' },
        { name: 'Hasil_Pengukuran_Cathodic_Protection.pdf', type: 'Laporan Uji Pipa', size: '920 KB', date: '2026-05-10' }
      ],
      evidencePhotos: [
        { name: 'Tanggul_Bundwall_Tangki_Timbun.jpg', caption: 'Tanggul pengaman bundwall tangki kedap minyak dan bersih' }
      ],
      indicators: [
        { id: 'c08-i1', title: 'Penapisan Ruang Lingkup Sektoral', desc: 'Identifikasi batasan Pasal 17(5) untuk fasilitas PPN.', weight: 30, status: 'verified', pic: 'Fajar Nugroho' },
        { id: 'c08-i2', title: 'Integritas Bundwall & Tanggul Tangki', desc: 'Tanggul kedap minyak dan tidak bocor.', weight: 35, status: 'verified', pic: 'Fajar Nugroho' },
        { id: 'c08-i3', title: 'Pemantauan Proteksi Pipa & Sumur Pantau', desc: 'Proteksi katodik dan sumur pantau aktif.', weight: 35, status: 'verified', pic: 'Fajar Nugroho' }
      ]
    },
    {
      id: 'c09',
      group: 'compliance',
      no: '09',
      code: 'C-09',
      name: 'Pengendalian Kerusakan Ekosistem Gambut',
      icon: 'trees',
      tagline: 'Pemeriksaan Batas KHG & Pencegahan Karhutla',
      pic: 'Fajar Nugroho',
      due: '2026-08-10',
      description: 'Pasal 17 ayat (6) Permen LH/BPLH 7/2025 membatasi bidang ini pada usaha di lahan gambut dalam Kesatuan Hidrologis Gambut (KHG). Fasilitas PT PPN membuktikan status kesesuaian lokasi melalui peta overlay resmi batas KHG KLHK dan menjaga pencegahan kebakaran di batas pagar.',
      laws: [
        { ref: 'Permen LH/BPLH No. 7 Tahun 2025', about: 'Pasal 17 ayat (6), Pasal 19 ayat (1) huruf i' },
        { ref: 'PP No. 71/2014 jo PP No. 57/2016', about: 'Perlindungan dan Pengelolaan Ekosistem Gambut' }
      ],
      practicalGuide: [
        { title: 'Overlay Peta Spasial KHG', text: 'Periksa titik koordinat fasilitas terhadap Peta Kesatuan Hidrologis Gambut (KHG) Nasional KLHK. Jika di luar lahan gambut, tandai status Tidak Relevan Berdasarkan Lokasi dengan lampiran peta overlay resmi.' },
        { title: 'Jika Berada Dekat Gambut', text: 'Siapkan sarana pemadam dan sekat bakar di perimeter fasilitas untuk mencegah rembetan kebakaran hutan/lahan (karhutla).' }
      ],
      companyPractice: [
        'Tersedia dokumen resmi peta overlay koordinat fasilitas terhadap peta fungsi ekosistem gambut KLHK.',
        'Sistem hydrant perimeter dan tim tanggap darurat karhutla siap siaga.'
      ],
      evidenceDocs: [
        { name: 'Peta_Overlay_Lokasi_Fasilitas_terhadap_KHG.pdf', type: 'Kajian Spasial GIS', size: '3.2 MB', date: '2025-10-14' },
        { name: 'Kajian_Penapisan_Ekosistem_Gambut.pdf', type: 'Dokumen Penapisan', size: '750 KB', date: '2026-01-20' }
      ],
      evidencePhotos: [
        { name: 'Peta_GIS_Overlay_Fasilitas.jpg', caption: 'Peta hasil overlay koordinat fasilitas terhadap batas ekosistem gambut' }
      ],
      indicators: [
        { id: 'c09-i1', title: 'Pemeriksaan Spasial Koordinat terhadap KHG', desc: 'Overlay resmi peta KLHK.', weight: 50, status: 'verified', pic: 'Fajar Nugroho' },
        { id: 'c09-i2', title: 'Kesiapsiagaan Sekat Bakar & Karhutla', desc: 'Pemantauan perimeter pagar fasilitas.', weight: 50, status: 'verified', pic: 'Fajar Nugroho' }
      ]
    },
    {
      id: 'c10',
      group: 'compliance',
      no: '10',
      code: 'C-10',
      name: 'Pengelolaan Sampah',
      icon: 'trash-2',
      tagline: 'Pemilahan Sumber, Pengurangan Sampah, & 3R',
      pic: 'Siti Rahmawati',
      due: '2026-08-15',
      description: 'Pengelolaan sampah domestik/kantor secara terpisah dari limbah B3/non-B3, penyediaan stasiun tempat sampah terpilah, pengurangan barang sekali pakai, pencatatan data timbulan sampah, pembuatan kompos, dan kemitraan dengan bank sampah/DLH (Pasal 17(3) & 19(1)(j) Permen LH/BPLH 7/2025).',
      laws: [
        { ref: 'UU No. 18 Tahun 2008', about: 'Pengelolaan Sampah' },
        { ref: 'PP No. 81 Tahun 2012', about: 'Pengelolaan Sampah Rumah Tangga' },
        { ref: 'Permen LH/BPLH No. 7 Tahun 2025', about: 'Pasal 17 ayat (3) & Pasal 19 ayat (1) huruf j' }
      ],
      practicalGuide: [
        { title: 'Pemilahan Sumber', text: 'Sediakan tempat sampah dengan warna berbeda untuk organik, anorganik (kertas/plastik), dan residu di setiap ruangan kantor, kantin, dan area publik terminal.' },
        { title: 'Pencatatan Data', text: 'Timbang dan catat timbulan sampah bulanan (kg/bulan), hitung persentase sampah terkelola vs sampah residu yang dibuang ke TPA.' },
        { title: 'Program 3R', text: 'Terapkan kebijakan tanpa botol plastik sekali pakai, komposting daun kering taman fasilitas, dan serahkan sampah anorganik ke bank sampah binaan.' }
      ],
      companyPractice: [
        'Tempat sampah terpilah 3 warna tersedia di seluruh gedung kantor dan kantin.',
        'Data timbulan sampah dicatat bulanan dengan tren pengurangan residu ke TPA.',
        'Program komposting mandiri sampah organik untuk taman penghijauan.'
      ],
      evidenceDocs: [
        { name: 'Catatan_Data_Timbulan_Sampah_2026.pdf', type: 'Catatan Timbulan', size: '540 KB', date: '2026-06-10' },
        { name: 'SOP_Pemilahan_dan_Pengurangan_Sampah.pdf', type: 'SOP Internal', size: '820 KB', date: '2025-05-19' },
        { name: 'MoU_Kerjasama_Bank_Sampah_Masyarakat.pdf', type: 'Perjanjian 3R', size: '980 KB', date: '2025-09-01' }
      ],
      evidencePhotos: [
        { name: 'Stasiun_Sampah_Terpilah_3_Warna.jpg', caption: 'Stasiun pemilahan sampah organik, anorganik, dan residu' },
        { name: 'Rumah_Kompos_Organik_Terminal.jpg', caption: 'Unit pengolahan kompos mandiri sampah daun fasilitas' }
      ],
      indicators: [
        { id: 'c10-i1', title: 'Penyediaan Sarana Pemilahan Sampah', desc: 'Tempat sampah terpilah di seluruh titik.', weight: 25, status: 'verified', pic: 'Siti Rahmawati' },
        { id: 'c10-i2', title: 'Pencatatan Timbulan Sampah Berkala', desc: 'Data berat dan volume sampah tercatat.', weight: 25, status: 'verified', pic: 'Siti Rahmawati' },
        { id: 'c10-i3', title: 'Program Pengurangan & Komposting', desc: 'Komposting organik dan reduksi plastik.', weight: 25, status: 'verified', pic: 'Siti Rahmawati' },
        { id: 'c10-i4', title: 'Kemitraan Daur Ulang / Bank Sampah', desc: 'Kerja sama bank sampah atau DLH.', weight: 25, status: 'verified', pic: 'Siti Rahmawati' }
      ]
    },
    {
      id: 'c11',
      group: 'compliance',
      no: '11',
      code: 'C-11',
      name: 'Audit Lingkungan Hidup yang Diwajibkan Berkala',
      icon: 'clipboard-check',
      tagline: 'Penapisan Wajib Audit, Audit SML ISO 14001, & Tindak Lanjut',
      pic: 'Rangga Aditya',
      due: '2026-08-20',
      description: 'Inventarisasi status kewajiban audit berkala berdasarkan peraturan perundangan atau penetapan Menteri. Untuk fasilitas yang tidak masuk daftar wajib audit menteri, perusahaan secara berkala melaksanakan audit kepatuhan lingkungan dan audit SML ISO 14001 serta menindaklanjuti temuan hingga selesai (Pasal 17(3) & 19(1)(k) Permen LH/BPLH 7/2025).',
      laws: [
        { ref: 'UU No. 32 Tahun 2009', about: 'Pasal 48-51 (Audit Lingkungan Hidup)' },
        { ref: 'Permen LH No. 3 Tahun 2013', about: 'Audit Lingkungan Hidup' },
        { ref: 'Permen LH/BPLH No. 7 Tahun 2025', about: 'Pasal 17 ayat (3) & Pasal 19 ayat (1) huruf k' }
      ],
      practicalGuide: [
        { title: 'Penapisan Status Audit', text: 'Periksa apakah fasilitas masuk kategori kilang atau ada penetapan wajib audit khusus oleh Menteri. Jika tidak ada penetapan khusus, dokumentasikan hasil penapisan hukum secara formal.' },
        { title: 'Audit Kepatuhan Internal', text: 'Laksanakan audit kepatuhan internal tahunan mencakup seluruh izin lingkungan, baku mutu, OWS, TPS B3, dan pemenuhan pelaporan.' },
        { title: 'Tindak Lanjut Temuan', text: 'Setiap temuan ketidaksesuaian wajib memiliki rencana tindakan korektif (Corrective Action Plan), target waktu penyelesaian, dan bukti verifikasi penutupan.' }
      ],
      companyPractice: [
        'Dokumen penapisan kewajiban audit lingkungan telah disusun dan dimutakhirkan.',
        'Laporan Audit Internal Kepatuhan Lingkungan dan Audit ISO 14001 tahunan tersedia lengkap.',
        '95% temuan audit kepatuhan telah berhasil diselesaikan dan ditutup.'
      ],
      evidenceDocs: [
        { name: 'Hasil_Penapisan_Kewajiban_Audit_Lingkungan.pdf', type: 'Kajian Regulasi', size: '610 KB', date: '2026-01-15' },
        { name: 'Laporan_Audit_Kepatuhan_Lingkungan_Internal_2025.pdf', type: 'Laporan Audit', size: '2.5 MB', date: '2025-12-10' },
        { name: 'Matriks_Tindak_Lanjut_Temuan_Audit.pdf', type: 'Corrective Action Plan', size: '890 KB', date: '2026-05-30' }
      ],
      evidencePhotos: [
        { name: 'Closing_Meeting_Audit_Lingkungan.jpg', caption: 'Rapat penutupan audit kepatuhan lingkungan bersama pimpinan fasilitas' }
      ],
      indicators: [
        { id: 'c11-i1', title: 'Penapisan Kewajiban Audit Formal', desc: 'Identifikasi dasar hukum wajib audit.', weight: 25, status: 'verified', pic: 'Rangga Aditya' },
        { id: 'c11-i2', title: 'Pelaksanaan Audit Kepatuhan Lingkungan', desc: 'Audit internal berkala terselenggara.', weight: 25, status: 'verified', pic: 'Rangga Aditya' },
        { id: 'c11-i3', title: 'Kompetensi Auditor Lingkungan', desc: 'Auditor memiliki sertifikasi kompetensi.', weight: 25, status: 'verified', pic: 'Rangga Aditya' },
        { id: 'c11-i4', title: 'Penyelesaian Tindak Lanjut Temuan', desc: 'Temuan audit ditindaklanjuti dan closed.', weight: 25, status: 'verified', pic: 'Rangga Aditya' }
      ]
    },

    /* ==========================================================================
       7 KELOMPOK KINERJA MELEBIHI KETAATAN (BEYOND COMPLIANCE) - PERMEN 7/2025
       ========================================================================== */
    {
      id: 'b01',
      group: 'beyond',
      no: '01',
      code: 'B-01',
      name: 'Sistem Manajemen Lingkungan',
      icon: 'shield-check',
      tagline: 'ISO 14001:2015, Sasaran Lingkungan, & Tinjauan Manajemen',
      pic: 'Sari Wulandari',
      due: '2026-09-01',
      description: 'Penerapan Sistem Manajemen Lingkungan (SML) berstandar internasional ISO 14001:2015, integrasi kebijakan lingkungan ke seluruh fungsi operasi, identifikasi aspek/dampak risiko, dan tinjauan manajemen berkala (Pasal 17(7) Permen LH/BPLH 7/2025).',
      laws: [
        { ref: 'ISO 14001:2015', about: 'Environmental Management Systems - Requirements' },
        { ref: 'Permen LH/BPLH No. 7 Tahun 2025', about: 'Pasal 17 ayat (7) & Pasal 24 (Prasyarat Hijau/Emas)' }
      ],
      practicalGuide: [
        { title: 'Implementasi SML', text: 'Bukan sekadar menyimpan sertifikat, tetapi menunjukkan implementasi nyata identifikasi aspek-dampak risiko lingkungan dan sasaran penurunan dampak.' },
        { title: 'Tinjauan Manajemen', text: 'Pimpinan fasilitas memimpin rapat tinjauan manajemen lingkungan berkala untuk mengevaluasi capaian target tahunan.' }
      ],
      companyPractice: [
        'Sertifikat ISO 14001:2015 terakreditasi KAN aktif berlaku hingga 2027.',
        'Program sasaran lingkungan dipantau setiap triwulan dengan KPI terukur.'
      ],
      evidenceDocs: [
        { name: 'Sertifikat_ISO14001_Terminal_A.pdf', type: 'Sertifikat ISO', size: '1.8 MB', date: '2024-06-12' },
        { name: 'Notulen_Tinjauan_Manajemen_SML_2026.pdf', type: 'Notulen Rapat', size: '1.3 MB', date: '2026-04-18' }
      ],
      evidencePhotos: [
        { name: 'Struktur_Tim_Penerapan_SML.jpg', caption: 'Papan struktur tim tanggap dan pengelola SML fasilitas' }
      ],
      indicators: [
        { id: 'b01-i1', title: 'Sertifikasi ISO 14001 Aktif', desc: 'Sertifikat SML masih berlaku.', weight: 30, status: 'verified', pic: 'Sari Wulandari' },
        { id: 'b01-i2', title: 'Sasaran & Program Kerja Lingkungan', desc: 'KPI lingkungan terukur.', weight: 25, status: 'verified', pic: 'Sari Wulandari' },
        { id: 'b01-i3', title: 'Pelaksanaan Audit Internal SML', desc: 'Audit klausul 4-10 terselenggara.', weight: 25, status: 'verified', pic: 'Sari Wulandari' },
        { id: 'b01-i4', title: 'Tinjauan Manajemen Berkala', desc: 'Evaluasi berkala bersama pimpinan.', weight: 20, status: 'verified', pic: 'Sari Wulandari' }
      ]
    },
    {
      id: 'b02',
      group: 'beyond',
      no: '02',
      code: 'B-02',
      name: 'Penilaian Daur Hidup (LCA)',
      icon: 'orbit',
      tagline: 'Life Cycle Assessment Cradle-to-Grave Rantai Distribusi',
      pic: 'Dr. Aditya Pratama',
      due: '2026-09-15',
      description: 'Kajian Life Cycle Assessment (LCA) berbasis ISO 14040/14044 untuk menghitung potensi beban lingkungan dan jejak karbon (carbon footprint) pada rantai pasok penerimaan, penyimpanan, dan penyaluran BBM (Pasal 17(7) Permen LH/BPLH 7/2025).',
      laws: [
        { ref: 'ISO 14040:2006 & ISO 14044:2006', about: 'Life Cycle Assessment Principles and Framework' },
        { ref: 'Permen LH/BPLH No. 7 Tahun 2025', about: 'Pasal 17 ayat (7)' }
      ],
      practicalGuide: [
        { title: 'Ruang Lingkup Kajian', text: 'Tentukan unit fungsi (misal: per 1 kiloliter BBM disalurkan) dan inventarisasi konsumsi energi listrik, bahan bakar armada tangki, dan kehilangan uap.' },
        { title: 'Tindak Lanjut Hasil', text: 'Hasil kajian LCA dijadikan dasar program efisiensi energi pompa dan optimasi rute mobil tangki.' }
      ],
      companyPractice: [
        'Laporan kajian LCA lengkap dengan batas sistem gate-to-gate distribusi BBM telah ditinjau pihak independen.',
        'Rekomendasi kajian LCA telah diterapkan pada program efisiensi energi pompa.'
      ],
      evidenceDocs: [
        { name: 'Laporan_Kajian_LCA_Distribusi_BBM.pdf', type: 'Laporan LCA', size: '5.2 MB', date: '2025-11-30' },
        { name: 'Surat_Keterangan_Verifikasi_Kritis_LCA.pdf', type: 'Peer Review', size: '720 KB', date: '2026-02-14' }
      ],
      evidencePhotos: [
        { name: 'Diagram_Alir_Inventori_LCA.jpg', caption: 'Peta batas sistem dan inventori emisi rantai distribusi BBM' }
      ],
      indicators: [
        { id: 'b02-i1', title: 'Laporan Kajian LCA Terstandar', desc: 'Berdasarkan kaidah ISO 14040/44.', weight: 35, status: 'verified', pic: 'Dr. Aditya Pratama' },
        { id: 'b02-i2', title: 'Data Inventori Emisi & Energi Terverifikasi', desc: 'Data kuantitatif akurat.', weight: 35, status: 'verified', pic: 'Dr. Aditya Pratama' },
        { id: 'b02-i3', title: 'Implementasi Rekomendasi Perbaikan', desc: 'Tindak lanjut program efisiensi nyata.', weight: 30, status: 'pending', pic: 'Dr. Aditya Pratama' }
      ]
    },
    {
      id: 'b03',
      group: 'beyond',
      no: '03',
      code: 'B-03',
      name: 'Pemanfaatan Sumber Daya',
      icon: 'gauge',
      tagline: '7 Pilar: Efisiensi Energi, Emisi, Air, 3R B3, 3R Non-B3, Sampah, & Kehati',
      pic: 'Dimas Prasetyo',
      due: '2026-09-20',
      description: 'Program efisiensi sumber daya terukur mencakup: (1) Efisiensi energi, (2) Penurunan emisi GRK, (3) Efisiensi air & penurunan beban pencemar, (4) 3R limbah B3, (5) 3R limbah non-B3, (6) Pengelolaan sampah, dan (7) Keanekaragaman hayati (Pasal 17(7) Permen LH/BPLH 7/2025).',
      laws: [
        { ref: 'Permen LH/BPLH No. 7 Tahun 2025', about: 'Pasal 17 ayat (7) & Lampiran Teknis DRKPL' }
      ],
      practicalGuide: [
        { title: 'Efisiensi Energi', text: 'Penggantian motor pompa BBM dengan inverter VFD dan pemasangan solar PV rooftop menghasilkan penghematan listrik terukur (GJ/tahun).' },
        { title: 'Efisiensi Air & 3R', text: 'Pemanfaatan air kondensat AC dan daur ulang air uji pompa hidran, perpanjangan umur pelumas mesin genset melalui filtrasi.' },
        { title: 'Kehati', text: 'Konservasi tanaman endemik lokal dan penanaman pohon mangrove di pesisir sekitar fasilitas.' }
      ],
      companyPractice: [
        'Program instalasi PLTS Rooftop 50 kWp di gedung kantor terminal BBM.',
        'Daur ulang air uji hidran menghemat 1.200 m3 air per tahun.',
        'Program pelestarian mangrove dan kehati di pesisir pantai binaan.'
      ],
      evidenceDocs: [
        { name: 'Laporan_Efisiensi_Energi_dan_Penurunan_Emisi.pdf', type: 'Laporan Kinerja', size: '2.4 MB', date: '2026-05-15' },
        { name: 'Neraca_Penghematan_Air_dan_3R.pdf', type: 'Neraca Efisiensi', size: '1.1 MB', date: '2026-05-20' },
        { name: 'Kajian_Indeks_Keanekaragaman_Hayati_Kehati.pdf', type: 'Laporan Kehati', size: '3.6 MB', date: '2025-12-05' }
      ],
      evidencePhotos: [
        { name: 'PLTS_Rooftop_Gedung_Terminal.jpg', caption: 'Panel surya PLTS rooftop terpasang di atas atap kantor terminal' },
        { name: 'Area_Konservasi_Pohon_Endemik.jpg', caption: 'Kawasan konservasi flora endemik di dalam area penyangga fasilitas' }
      ],
      indicators: [
        { id: 'b03-i1', title: 'Baseline & Target Efisiensi Terukur', desc: 'Data pembanding konsumsi energi dan air.', weight: 25, status: 'verified', pic: 'Dimas Prasetyo' },
        { id: 'b03-i2', title: 'Program Efisiensi Energi & Penurunan Emisi', desc: 'Penghematan GJ dan ton CO2eq.', weight: 25, status: 'verified', pic: 'Dimas Prasetyo' },
        { id: 'b03-i3', title: 'Pengurangan & 3R Limbah B3/Non-B3', desc: 'Reduksi limbah oli dan material scrap.', weight: 25, status: 'verified', pic: 'Dimas Prasetyo' },
        { id: 'b03-i4', title: 'Program Perlindungan Keanekaragaman Hayati', desc: 'Indeks kehati H meningkat.', weight: 25, status: 'verified', pic: 'Dimas Prasetyo' }
      ]
    },
    {
      id: 'b04',
      group: 'beyond',
      no: '04',
      code: 'B-04',
      name: 'Pemberdayaan Masyarakat dan Tanggap Kebencanaan',
      icon: 'heart-handshake',
      tagline: 'CSR Berkelanjutan, Binaan UMKM, & Kesiapsiagaan Bencana',
      pic: 'Indra Gunawan',
      due: '2026-09-25',
      description: 'Program pemberdayaan masyarakat berbasis pemetaan sosial (social mapping) yang menjawab kebutuhan riil kelompok rentan di sekitar fasilitas, pembinaan kemandirian UMKM/nelayan, serta pelatihan kesiapsiagaan bencana bersama masyarakat dan BPBD (Pasal 17(7) Permen LH/BPLH 7/2025).',
      laws: [
        { ref: 'Permen LH/BPLH No. 7 Tahun 2025', about: 'Pasal 17 ayat (7)' },
        { ref: 'ISO 26000:2010', about: 'Guidance on Social Responsibility' }
      ],
      practicalGuide: [
        { title: 'Pemetaan Sosial', text: 'Lakukan survei kebutuhan komunitas di desa ring 1 fasilitas secara partisipatif; hindari sekadar donasi lepas.' },
        { title: 'Penguatan Ekonomi', text: 'Bina kelompok nelayan pengolahan hasil tangkapan laut atau UMKM olahan limbah daur ulang hingga mandiri secara finansial.' },
        { title: 'Tanggap Bencana', text: 'Bentuk forum desa tanggap bencana, berikan edukasi keselamatan bahaya kebakaran/banjir, dan simulasikan evakuasi darurat.' }
      ],
      companyPractice: [
        'Program binaan UMKM Pengolahan Ikan Desa Pesisir Ring 1 telah mandiri dan memiliki izin edar.',
        'Latihan rutin simulasi tanggap darurat kebakaran lingkungan bersama warga dan BPBD.'
      ],
      evidenceDocs: [
        { name: 'Dokumen_Social_Mapping_Wilayah_Ring_1.pdf', type: 'Kajian Sosial', size: '4.1 MB', date: '2025-08-20' },
        { name: 'Laporan_Program_Pemberdayaan_UMKM.pdf', type: 'Laporan CSR', size: '2.9 MB', date: '2026-05-10' },
        { name: 'MoU_Simulasi_Tanggap_Bencana_BPBD.pdf', type: 'Perjanjian Kerjasama', size: '1.2 MB', date: '2025-11-05' }
      ],
      evidencePhotos: [
        { name: 'Kegiatan_Pemberdayaan_UMKM_Warga.jpg', caption: 'Pelatihan pengemasan dan standardisasi higienis produk UMKM binaan' },
        { name: 'Simulasi_Kebakaran_Bersama_Warga.jpg', caption: 'Latihan tanggap darurat pemadaman api bersama warga sekitar terminal' }
      ],
      indicators: [
        { id: 'b04-i1', title: 'Ketersediaan Social Mapping Mutakhir', desc: 'Pemetaan profil masalah dan potensi warga.', weight: 25, status: 'verified', pic: 'Indra Gunawan' },
        { id: 'b04-i2', title: 'Rencana Strategis & Keberlanjutan Program', desc: 'Renstra CSR 5 tahunan.', weight: 25, status: 'verified', pic: 'Indra Gunawan' },
        { id: 'b04-i3', title: 'Capaian Kemandirian Kelompok Binaan', desc: 'Peningkatan pendapatan penerima manfaat.', weight: 25, status: 'verified', pic: 'Indra Gunawan' },
        { id: 'b04-i4', title: 'Program Kesiapsiagaan Tanggap Bencana', desc: 'Simulasi dan sarana tanggap bencana warga.', weight: 25, status: 'verified', pic: 'Indra Gunawan' }
      ]
    },
    {
      id: 'b05',
      group: 'beyond',
      no: '05',
      code: 'B-05',
      name: 'Ekoinovasi',
      icon: 'sparkles',
      tagline: 'Inovasi Proses Ramah Lingkungan & Manfaat Terverifikasi',
      pic: 'Dr. Aditya Pratama',
      due: '2026-09-28',
      description: 'Pengembangan dan implementasi inovasi teknologi, proses, atau sistem operasional baru yang terbukti menurunkan dampak lingkungan secara signifikan, efisien secara biaya, dan memiliki potensi replikasi (Pasal 17(7) Permen LH/BPLH 7/2025).',
      laws: [
        { ref: 'Permen LH/BPLH No. 7 Tahun 2025', about: 'Pasal 17 ayat (7) & Panduan Ekoinovasi PROPER' }
      ],
      practicalGuide: [
        { title: 'Kriteria Kebaruan', text: 'Inovasi harus memiliki kebaruan (novelty), sudah beroperasi minimal 1 tahun di fasilitas, dan bukan sekadar ide atau desain di atas kertas.' },
        { title: 'Kuantifikasi Manfaat', text: 'Ukur manfaat lingkungan secara kuantitatif: penurunan konsumsi BBM (liter/tahun), reduksi limbah B3 (ton/tahun), dan efisiensi biaya operasional (Rp/tahun).' }
      ],
      companyPractice: [
        'Sistem otomatisasi sensor level OWS terhubung IoT untuk deteksi tumpahan minyak secara real-time.',
        'Sistem pemanfaatan gas buang uap BBM filling shed menurunkan konsentrasi emisi fugitif hingga 85%.'
      ],
      evidenceDocs: [
        { name: 'Proposal_dan_Kajian_Teknis_Ekoinovasi.pdf', type: 'Kajian Teknis', size: '3.4 MB', date: '2025-09-18' },
        { name: 'Laporan_Verifikasi_Manfaat_Ekoinovasi.pdf', type: 'Laporan Dampak', size: '1.7 MB', date: '2026-04-12' }
      ],
      evidencePhotos: [
        { name: 'Instalasi_Sensor_IoT_Sistem_Ekoinovasi.jpg', caption: 'Pemasangan sensor otomatisasi IoT deteksi hidrokarbon OWS' }
      ],
      indicators: [
        { id: 'b05-i1', title: 'Keterbaruan & Orisinalitas Inovasi', desc: 'Memiliki aspek novelty yang terbukti.', weight: 30, status: 'verified', pic: 'Dr. Aditya Pratama' },
        { id: 'b05-i2', title: 'Implementasi Nyata pada Fasilitas', desc: 'Sistem telah berjalan operasional.', weight: 35, status: 'verified', pic: 'Dr. Aditya Pratama' },
        { id: 'b05-i3', title: 'Kuantifikasi Manfaat Lingkungan & Ekonomi', desc: 'Data penghematan dan penurunan emisi.', weight: 35, status: 'verified', pic: 'Dr. Aditya Pratama' }
      ]
    },
    {
      id: 'b06',
      group: 'beyond',
      no: '06',
      code: 'B-06',
      name: 'Inovasi Sosial',
      icon: 'share-2',
      tagline: 'Social Return on Investment (SROI) & Ekonomi Sirkular',
      pic: 'Indra Gunawan',
      due: '2026-10-05',
      description: 'Penerapan solusi baru yang menyelesaikan permasalahan sosial-lingkungan masyarakat secara berkelanjutan, dinilai menggunakan metodologi Social Return on Investment (SROI) untuk membuktikan rasio nilai manfaat sosial terhadap investasi (Pasal 17(8) Permen LH/BPLH 7/2025).',
      laws: [
        { ref: 'Permen LH/BPLH No. 7 Tahun 2025', about: 'Pasal 17 ayat (8) (Kewajiban Pengukuran Metode SROI)' }
      ],
      practicalGuide: [
        { title: 'Metodologi SROI', text: 'Susun Theory of Change, identifikasi pemangku kepentingan, tetapkan indikator outcome, hitung deadweight, displacement, attribution, dan drop-off secara transparan.' },
        { title: 'Contoh Nyata', text: 'Program Bank Sampah Mandiri binaan terminal yang mengonversi sampah terpilah menjadi tabungan emas dan modal usaha warga (rasio SROI > 1:3).' }
      ],
      companyPractice: [
        'Kajian SROI Program Desa Berdikari Energi Mandiri menghasilkan rasio 1:3.45.',
        'Laporan dampak sosial telah diverifikasi oleh konsultan / akademisi independen.'
      ],
      evidenceDocs: [
        { name: 'Laporan_Kajian_SROI_Program_Inovasi_Sosial.pdf', type: 'Kajian SROI', size: '4.6 MB', date: '2026-03-22' },
        { name: 'Buku_Tabungan_dan_Laporan_Bank_Sampah.pdf', type: 'Data Finansial', size: '1.5 MB', date: '2026-05-18' }
      ],
      evidencePhotos: [
        { name: 'Aktivitas_Bank_Sampah_Inovasi_Sosial.jpg', caption: 'Penimbangan sampah anorganik di Bank Sampah binaan terminal' }
      ],
      indicators: [
        { id: 'b06-i1', title: 'Laporan Kajian Metodologi SROI Lengkap', desc: 'Berdasarkan standar perhitungan SROI.', weight: 35, status: 'verified', pic: 'Indra Gunawan' },
        { id: 'b06-i2', title: 'Nilai Rasio SROI Positif (> 1.0)', desc: 'Manfaat sosial melebihi nilai investasi.', weight: 35, status: 'verified', pic: 'Indra Gunawan' },
        { id: 'b06-i3', title: 'Keberlanjutan Mandiri oleh Komunitas', desc: 'Program terus berjalan tanpa ketergantungan.', weight: 30, status: 'verified', pic: 'Indra Gunawan' }
      ]
    },
    {
      id: 'b07',
      group: 'beyond',
      no: '07',
      code: 'B-07',
      name: 'Kepemimpinan Hijau (Green Leadership)',
      icon: 'crown',
      tagline: 'Komitmen Pimpinan, Alokasi Anggaran, & Budaya Lingkungan',
      pic: 'General Manager Fasilitas',
      due: '2026-10-10',
      description: 'Bukti nyata komitmen pimpinan tertinggi fasilitas dalam menetapkan visi, target lingkungan ambisius, alokasi anggaran investasi fasilitas ramah lingkungan, tinjauan berkala, dan keteladanan dalam membangun budaya HSSE peduli lingkungan (Pasal 17(7) Permen LH/BPLH 7/2025).',
      laws: [
        { ref: 'Permen LH/BPLH No. 7 Tahun 2025', about: 'Pasal 17 ayat (7) & Panduan Green Leadership' }
      ],
      practicalGuide: [
        { title: 'Bukan Sekadar Tanda Tangan', text: 'Tunjukkan bukti keterlibatan aktif pimpinan: turun langsung ke lapangan (management walkthrough), memimpin rapat tinjauan manajemen, dan alokasi anggaran belanja modal (CAPEX) lingkungan.' },
        { title: 'Keteladanan & Budaya', text: 'Pimpinan menginisiasi program efisiensi energi kantor dan mewajibkan tindak lanjut 100% temuan audit lingkungan.' }
      ],
      companyPractice: [
        'Komitmen tertulis kebijakan Green Terminal ditandatangani General Manager.',
        'Alokasi anggaran CAPEX/OPEX lingkungan terealisasi 100% pada perbaikan OWS dan PLTS.',
        'Kegiatan Leadership Environmental Walk rutin setiap bulan.'
      ],
      evidenceDocs: [
        { name: 'Surat_Komitmen_Kebijakan_Green_Terminal_GM.pdf', type: 'Surat Komitmen', size: '920 KB', date: '2026-01-08' },
        { name: 'Bukti_Alokasi_Anggaran_Investasi_Lingkungan.pdf', type: 'Rencana Kerja Anggaran', size: '1.4 MB', date: '2026-02-01' },
        { name: 'Notulen_Leadership_Environmental_Walk.pdf', type: 'Notulen & Tindak Lanjut', size: '850 KB', date: '2026-05-25' }
      ],
      evidencePhotos: [
        { name: 'Management_Walkthrough_Fasilitas.jpg', caption: 'Pimpinan fasilitas melakukan inspeksi berkala di area OWS dan TPS B3' }
      ],
      indicators: [
        { id: 'b07-i1', title: 'Kebijakan & Komitmen Visi Lingkungan Pimpinan', desc: 'Visi dan target terarah tertulis.', weight: 30, status: 'verified', pic: 'General Manager Fasilitas' },
        { id: 'b07-i2', title: 'Alokasi Nyata Anggaran Investasi Lingkungan', desc: 'Dukungan anggaran perbaikan fasilitas.', weight: 35, status: 'verified', pic: 'General Manager Fasilitas' },
        { id: 'b07-i3', title: 'Kegiatan Leadership Walkthrough Rutin', desc: 'Inspeksi berkala dan evaluasi temuan.', weight: 35, status: 'verified', pic: 'General Manager Fasilitas' }
      ]
    }
  ];

  function groupOf(criterionId) {
    const c = criteria.find(item => item.id === criterionId);
    return c ? GROUPS[c.group] : null;
  }

  function byGroup(groupId) {
    return criteria.filter(item => item.group === groupId);
  }

  function criterion(id) {
    return criteria.find(item => item.id === id);
  }

  function indicator(id) {
    for (const c of criteria) {
      const match = c.indicators.find(i => i.id === id);
      if (match) return { indicator: match, criterion: c };
    }
    return null;
  }

  function baseScore(criterion, scope) {
    const defaultScope = scope.period === '2025/2026' && scope.facility === 'tbbm-a';
    if (defaultScope) {
      const verifiedWeight = criterion.indicators
        .filter(i => i.status === 'verified')
        .reduce((sum, i) => sum + i.weight, 0);
      const total = criterion.indicators.reduce((sum, i) => sum + i.weight, 0);
      return total ? Math.round((verifiedWeight / total) * 100) : 0;
    }
    const h = P.data.hash2(scope.period + '|' + scope.facility + '|' + criterion.id);
    return 60 + Math.round(h * 38);
  }

  P.proper = {
    groups: GROUPS,
    statusMeta: STATUS_META,
    criteria,
    groupOf,
    byGroup,
    criterion,
    indicator,
    baseScore
  };
})(window);
