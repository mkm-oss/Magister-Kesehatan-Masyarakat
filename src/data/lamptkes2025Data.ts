/**
 * Data Struktur Instrumen Akreditasi LAM-PTKes 2025
 * Program Studi Magister Kesehatan Masyarakat (S2 MKM)
 * Buku III: Panduan Penyusunan Laporan Evaluasi Diri (LED)
 * 
 * Hierarki:
 * Kriteria (8 Kriteria) -> Sub-Kriteria -> Elemen Utama (Pertanyaan) -> Butir Pemenuhan -> Dokumen Pendukung
 */

export interface ComplianceItem {
  id: string;
  order: number;
  text: string;
}

export interface MainElement {
  id: string;
  code: string; // e.g. "1.1.1", "2.1.3", "8.1.4"
  criterionId: number;
  subCriterionId: string;
  question: string; // Teks pertanyaan Elemen Utama
  complianceItems: ComplianceItem[]; // Butir/Indikator Pemenuhan Elemen Utama
  defaultNarrative?: string; // Narasi awal/draf institusi
  benchmark?: string; // Standar rujukan SN-Dikti / KKNI level 8 / LAM-PTKes
  tags?: string[];
}

export interface SubCriterion {
  id: string;
  code: string; // e.g. "1.1", "2.1", "2.2"
  name: string;
  criterionId: number;
  guidanceText: string; // Teks deskripsi dan panduan sub-kriteria
  elementCodes: string[];
}

export interface SupportingDocTemplate {
  id: string;
  criterionId: number;
  code: string;
  name: string;
  category: 'Kebijakan/SK' | 'Pedoman/SOP' | 'Laporan Kinerja' | 'Dokumen Kurikulum' | 'MoU/MoA' | 'Dokumen Mutu' | 'Lainnya';
  description: string;
  isMandatory: boolean;
  defaultDrivePath?: string;
}

export interface CriterionLamptkes {
  id: number;
  code: string; // "K1" - "K8"
  number: number;
  name: string;
  shortName: string;
  weight: number; // Bobot persentase relatif
  iconName: string;
  color: string;
  bgGradient: string;
  description: string;
  subCriteria: SubCriterion[];
  supportingDocuments: SupportingDocTemplate[];
}

export interface ElementLedAnswer {
  elementCode: string;
  narrative: string;
  complianceChecked: { [itemOrder: number]: boolean };
  score: number; // 1.0 - 4.0
  status: 'Draft' | 'Review' | 'Final';
  author: string;
  lastUpdated: string;
  version: number;
  assessorScore?: number;
  assessorNotes?: string;
  assessorStatus?: 'Disetujui' | 'Perlu Perbaikan' | 'Belum Dinilai';
  linkedEvidenceIds?: string[];
}

export interface DigitalEvidenceItem {
  id: string;
  code: string;
  title: string;
  criterionId: number;
  elementCode?: string;
  fileType: string;
  cloudProvider: 'Google Drive' | 'OneDrive' | 'Dropbox' | 'Simulasi Upload';
  cloudUrl: string;
  fileSize: string;
  uploadDate: string;
  uploader: string;
  isUserAdded?: boolean;
  verified: boolean;
  notes?: string;
}

// =========================================================================
// DATA RESMI 8 KRITERIA INSTRUMEN LAM-PTKES 2025 BUKU III S2 MKM
// =========================================================================

export const LAMPTKES_CRITERIA: CriterionLamptkes[] = [
  // -----------------------------------------------------------------------
  // KRITERIA 1
  // -----------------------------------------------------------------------
  {
    id: 1,
    number: 1,
    code: 'K1',
    name: 'Visi, Misi, Tujuan, dan Strategi',
    shortName: 'VMTS',
    weight: 8.0,
    iconName: 'Building2',
    color: '#054DA0',
    bgGradient: 'from-blue-900 to-indigo-950',
    description: 'Kejelasan, kerealistikan, dan keterkaitan VMTS UPPS dan Program Studi Magister Kesehatan Masyarakat yang mencerminkan kekhasan wilayah lahan basah tropis, keilmuan magister kesehatan masyarakat, tata nilai keislaman Muhammadiyah, serta partisipasi pemangku kepentingan.',
    subCriteria: [
      {
        id: 'sub-1.1',
        code: '1.1',
        name: 'Keselarasan dan Kebermaknaan Visi, Misi, Tujuan, dan Strategi',
        criterionId: 1,
        guidanceText: 'UPPS dan PS Magister Kesehatan Masyarakat harus memiliki VMTS yang selaras, terukur, dan dijadikan pedoman dalam seluruh pelaksanaan Tridarma Perguruan Tinggi. Rumusan harus mengacu pada visi institusi induk, Standar Nasional Pendidikan Tinggi (SN-Dikti), profil lulusan KKNI Level 8, dan kebutuhan masyarakat lokal, nasional, serta internasional.',
        elementCodes: ['1.1.1', '1.1.2', '1.1.3', '1.1.4', '1.1.5', '1.1.6'],
      },
    ],
    supportingDocuments: [
      {
        id: 'doc-k1-01',
        criterionId: 1,
        code: 'DOC-K1-01',
        name: 'SK Penetapan Renstra UPPS & Renop PS MKM',
        category: 'Kebijakan/SK',
        description: 'Surat Keputusan Rektor/Dekan tentang Rencana Strategis (Renstra) dan Rencana Operasional (Renop) Magister Kesehatan Masyarakat.',
        isMandatory: true,
      },
      {
        id: 'doc-k1-02',
        criterionId: 1,
        code: 'DOC-K1-02',
        name: 'Naskah Akademik Rumusan VMTS MKM',
        category: 'Dokumen Mutu',
        description: 'Naskah perumusan VMTS, analisis SWOT, dan keterkaitan profil lulusan dengan keunggulan kesehatan masyarakat lingkungan lahan basah tropis.',
        isMandatory: true,
      },
      {
        id: 'doc-k1-03',
        criterionId: 1,
        code: 'DOC-K1-03',
        name: 'Notula & Bukti Keterlibatan Pemangku Kepentingan VMTS',
        category: 'Laporan Kinerja',
        description: 'Daftar hadir, berita acara FGD, notula, dan dokumentasi keterlibatan Dinkes, alumni, organisasi profesi (IAKMI/PERSAKMI), dosen, dan maba.',
        isMandatory: true,
      },
      {
        id: 'doc-k1-04',
        criterionId: 1,
        code: 'DOC-K1-04',
        name: 'Dokumen Sosialisasi dan Tingkat Pemahaman VMTS',
        category: 'Laporan Kinerja',
        description: 'Kuesioner, hasil survei, dan evaluasi berkala mengenai tingkat pemahaman sivitas akademika terhadap VMTS program studi.',
        isMandatory: false,
      },
      {
        id: 'doc-k1-05',
        criterionId: 1,
        code: 'DOC-K1-05',
        name: 'Laporan Evaluasi Ketercapaian IKU/IKT Renstra',
        category: 'Laporan Kinerja',
        description: 'Laporan tahunan pengukuran Indikator Kinerja Utama (IKU) dan Indikator Kinerja Tambahan (IKT) bidang VMTS.',
        isMandatory: true,
      },
    ],
  },

  // -----------------------------------------------------------------------
  // KRITERIA 2
  // -----------------------------------------------------------------------
  {
    id: 2,
    number: 2,
    code: 'K2',
    name: 'Kurikulum',
    shortName: 'Kurikulum',
    weight: 20.0,
    iconName: 'BookOpen',
    color: '#0D9488',
    bgGradient: 'from-teal-900 to-emerald-950',
    description: 'Perancangan, struktur, isi, dan metode pengalaman pembelajaran Program Studi Magister Kesehatan Masyarakat berbasis KKNI level 8 dan Outcome-Based Education (OBE) yang mengintegrasikan riset kesehatan lahan basah tropis dan nilai-nilai Al-Islam Kemuhammadiyahan.',
    subCriteria: [
      {
        id: 'sub-2.1',
        code: '2.1',
        name: 'Capaian Pembelajaran Lulusan (CPL)',
        criterionId: 2,
        guidanceText: 'CPL Program Studi Magister Kesehatan Masyarakat harus dirumuskan secara jelas, merujuk pada jenjang KKNI Level 8 (kemampuan mengembangkan IPTEKS kesehatan masyarakat melalui riset interdisipliner/multidisipliner, inovasi kebijakan, dan manajemen pemecahan masalah kesehatan).',
        elementCodes: ['2.1.1', '2.1.2', '2.1.3', '2.1.4', '2.1.5', '2.1.6', '2.1.7'],
      },
      {
        id: 'sub-2.2',
        code: '2.2',
        name: 'Struktur Kurikulum',
        criterionId: 2,
        guidanceText: 'Struktur kurikulum harus logis, koheren, berkesinambungan antara mata kuliah wajib magister, peminatan (AKK, Epidemiologi, K3, Promkes), tesis, serta beban SKS sesuai Standar Nasional Pendidikan Tinggi (36–42 SKS).',
        elementCodes: ['2.2.1', '2.2.2', '2.2.3'],
      },
      {
        id: 'sub-2.3',
        code: '2.3',
        name: 'Isi Kurikulum',
        criterionId: 2,
        guidanceText: 'Isi kurikulum harus mutakhir (evidence-based public health), merefleksikan kemajuan IPTEKS, epidemiologi modern, biostatistika lanjut, kebijakan dan pembiayaan kesehatan, etika kesehatan masyarakat, serta kekhasan ekologi kesehatan wilayah lahan basah.',
        elementCodes: ['2.3.1', '2.3.2', '2.3.3', '2.3.4', '2.3.5', '2.3.6', '2.3.7', '2.3.8', '2.3.9', '2.3.10', '2.3.11'],
      },
      {
        id: 'sub-2.4',
        code: '2.4',
        name: 'Metode dan Pengalaman Pembelajaran',
        criterionId: 2,
        guidanceText: 'Metode pembelajaran harus berpusat pada mahasiswa (Student-Centered Learning / SCL), seperti Case-based Learning (CBL), Project-based Learning (PjBL), simulasi kebijakan kesehatan, residensi lapangan terintegrasi, dan pemanfaatan LMS hybrid.',
        elementCodes: ['2.4.1', '2.4.2', '2.4.3'],
      },
    ],
    supportingDocuments: [
      {
        id: 'doc-k2-01',
        criterionId: 2,
        code: 'DOC-K2-01',
        name: 'Buku Dokumen Kurikulum Program Studi S2 MKM',
        category: 'Dokumen Kurikulum',
        description: 'Buku kurikulum lengkap memuat profil lulusan, CPL, peta kurikulum, matriks keterkaitan CPL-Mata Kuliah, dan konsentrasi keilmuan.',
        isMandatory: true,
      },
      {
        id: 'doc-k2-02',
        criterionId: 2,
        code: 'DOC-K2-02',
        name: 'Kumpulan Rencana Pembelajaran Semester (RPS) Seluruh MK',
        category: 'Dokumen Kurikulum',
        description: 'RPS lengkap berbasis OBE dengan integrasi riset dan pengabdian dosen serta rubrik penilaian performa.',
        isMandatory: true,
      },
      {
        id: 'doc-k2-03',
        criterionId: 2,
        code: 'DOC-K2-03',
        name: 'Laporan Tracer Study & Rekomendasi Pemangku Kepentingan',
        category: 'Laporan Kinerja',
        description: 'Hasil pelacakan lulusan, masukan dinas kesehatan, rumah sakit, dan asosiasi profesi IAKMI dalam peninjauan kurikulum berkala.',
        isMandatory: true,
      },
      {
        id: 'doc-k2-04',
        criterionId: 2,
        code: 'DOC-K2-04',
        name: 'Pedoman Penulisan dan Pembimbingan Tesis S2 MKM',
        category: 'Pedoman/SOP',
        description: 'Buku pedoman baku tesis, tahapan proposal, sidang komprehensif, standar etik kesehatan, dan publikasi ilmiah.',
        isMandatory: true,
      },
    ],
  },

  // -----------------------------------------------------------------------
  // KRITERIA 3
  // -----------------------------------------------------------------------
  {
    id: 3,
    number: 3,
    code: 'K3',
    name: 'Penilaian',
    shortName: 'Penilaian',
    weight: 12.0,
    iconName: 'CheckCircle2',
    color: '#D97706',
    bgGradient: 'from-amber-950 to-orange-950',
    description: 'Sistem dan kebijakan penilaian pembelajaran mahasiswa magister secara komprehensif, transparan, objektif, formatif, dan sumatif untuk menjamin ketercapaian kompetensi level 8 KKNI.',
    subCriteria: [
      {
        id: 'sub-3.1',
        code: '3.1',
        name: 'Kebijakan dan Sistem Penilaian',
        criterionId: 3,
        guidanceText: 'UPPS dan PS memiliki regulasi baku penilaian, bobot penilaian kognitif, afektif, dan psikomotorik, serta sosialisasi kriteria evaluasi kepada mahasiswa pada awal perkuliahan.',
        elementCodes: ['3.1.1', '3.1.2', '3.1.3'],
      },
      {
        id: 'sub-3.2',
        code: '3.2',
        name: 'Penilaian untuk Mendukung Pembelajaran',
        criterionId: 3,
        guidanceText: 'Penilaian formatif, pemberian umpan balik berkala (feedback) terhadap tugas studi kasus, draf artikel ilmiah, dan presentasi seminar tesis.',
        elementCodes: ['3.2.1', '3.2.2', '3.2.3'],
      },
      {
        id: 'sub-3.3',
        code: '3.3',
        name: 'Penilaian untuk Pengambilan Keputusan',
        criterionId: 3,
        guidanceText: 'Proses evaluasi sumatif, penentuan kelulusan mata kuliah, ujian kualifikasi/komprehensif, evaluasi masa studi, dan yudisium kelulusan.',
        elementCodes: ['3.3.1', '3.3.2', '3.3.3', '3.3.4', '3.3.5'],
      },
      {
        id: 'sub-3.4',
        code: '3.4',
        name: 'Penjaminan Mutu Penilaian',
        criterionId: 3,
        guidanceText: 'Mekanisme validasi soal ujian, rubrik penilaian tesis, moderasi nilai, penanganan banding nilai mahasiswa, serta audit berkala mutu asesmen.',
        elementCodes: ['3.4.1', '3.4.2', '3.4.3', '3.4.4', '3.4.5', '3.4.6'],
      },
    ],
    supportingDocuments: [
      {
        id: 'doc-k3-01',
        criterionId: 3,
        code: 'DOC-K3-01',
        name: 'Buku Panduan Akademik dan Sistem Penilaian Pembelajaran',
        category: 'Pedoman/SOP',
        description: 'Ketentuan skala nilai, konversi huruf mutu, kriteria kelulusan minimal magister (B/3.00), dan batas masa studi.',
        isMandatory: true,
      },
      {
        id: 'doc-k3-02',
        criterionId: 3,
        code: 'DOC-K3-02',
        name: 'Rubrik Penilaian Berbasis Kinerja (Rubrik Tesis & Seminar)',
        category: 'Dokumen Mutu',
        description: 'Rubrik analitik dan holistik penilaian proposal, seminar hasil, manuskrip jurnal, dan sidang tesis akhir.',
        isMandatory: true,
      },
      {
        id: 'doc-k3-03',
        criterionId: 3,
        code: 'DOC-K3-03',
        name: 'SOP Penanganan Banding Nilai dan Ujian Remediasi',
        category: 'Pedoman/SOP',
        description: 'Prosedur operasional standar jika mahasiswa mengajukan klarifikasi atau banding nilai akademik.',
        isMandatory: false,
      },
    ],
  },

  // -----------------------------------------------------------------------
  // KRITERIA 4
  // -----------------------------------------------------------------------
  {
    id: 4,
    number: 4,
    code: 'K4',
    name: 'Mahasiswa',
    shortName: 'Mahasiswa',
    weight: 12.0,
    iconName: 'Users',
    color: '#2563EB',
    bgGradient: 'from-blue-950 to-cyan-950',
    description: 'Sistem seleksi dan penerimaan mahasiswa baru (Maba), layanan bimbingan konseling, pengembangan soft-skills, lingkungan kerja dan belajar yang kondusif, serta penjaminan keselamatan dan kesejahteraan mahasiswa.',
    subCriteria: [
      {
        id: 'sub-4.1',
        code: '4.1',
        name: 'Seleksi dan Penerimaan Mahasiswa Baru (Maba)',
        criterionId: 4,
        guidanceText: 'Kebijakan penerimaan Maba program magister yang transparan, akuntabel, inklusif, mempertimbangkan latar belakang S1 kesehatan/non-kesehatan dengan matrikulasi, tes potensi akademik (TPA), kemampuan bahasa Inggris, serta proposal awal penelitian.',
        elementCodes: ['4.1.1', '4.1.2', '4.1.3', '4.1.4', '4.1.5', '4.1.6', '4.1.7'],
      },
      {
        id: 'sub-4.2',
        code: '4.2',
        name: 'Konseling dan Dukungan Mahasiswa',
        criterionId: 4,
        guidanceText: 'Layanan bimbingan akademik oleh Dosen Penasihat Akademik (PA), pendampingan riset tesis, konseling psikologis dan karir, serta beasiswa dan bantuan finansial bagi mahasiswa magister.',
        elementCodes: ['4.2.1', '4.2.2', '4.2.3', '4.2.4', '4.2.5', '4.2.6', '4.2.7'],
      },
      {
        id: 'sub-4.3',
        code: '4.3',
        name: 'Lingkungan Kerja dan Belajar Mahasiswa',
        criterionId: 4,
        guidanceText: 'Penyediaan ruang diskusi mahasiswa pascasarjana, akses internet berkecepatan tinggi, lingkungan belajar daring (LMS), akses e-journal internasional, dan sarana ibadah/istirahat yang representatif.',
        elementCodes: ['4.3.1', '4.3.2', '4.3.3', '4.3.4', '4.3.5', '4.3.6'],
      },
      {
        id: 'sub-4.4',
        code: '4.4',
        name: 'Keselamatan Mahasiswa',
        criterionId: 4,
        guidanceText: 'Prosedur keselamatan dan kesehatan kerja (K3), mitigasi bencana, pencegahan dan penanganan kekerasan seksual (PPKS), asuransi kesehatan, dan penjaminan keselamatan saat riset lapangan di wilayah rawan lahan basah.',
        elementCodes: ['4.4.1', '4.4.2', '4.4.3', '4.4.4', '4.4.5'],
      },
    ],
    supportingDocuments: [
      {
        id: 'doc-k4-01',
        criterionId: 4,
        code: 'DOC-K4-01',
        name: 'Pedoman Penerimaan Mahasiswa Baru (PMB) Pascasarjana',
        category: 'Pedoman/SOP',
        description: 'Brosur, syarat seleksi TPA, TOEFL, portofolio riset, dan mekanisme matrikulasi bagi lulusan di luar ilmu kesehatan.',
        isMandatory: true,
      },
      {
        id: 'doc-k4-02',
        criterionId: 4,
        code: 'DOC-K4-02',
        name: 'Laporan Layanan Bimbingan Akademik dan Konseling',
        category: 'Laporan Kinerja',
        description: 'Rekapitulasi logbook perwalian PA, pendampingan penulisan ilmiah, dan monitoring kemajuan studi mahasiswa per semester.',
        isMandatory: true,
      },
      {
        id: 'doc-k4-03',
        criterionId: 4,
        code: 'DOC-K4-03',
        name: 'Buku Pedoman K3 dan SOP Satgas PPKS Kampus',
        category: 'Pedoman/SOP',
        description: 'Regulasi pencegahan kekerasan seksual, bullying, protokol tanggap darurat, dan jaminan keselamatan praktikum/riset lapangan.',
        isMandatory: true,
      },
    ],
  },

  // -----------------------------------------------------------------------
  // KRITERIA 5
  // -----------------------------------------------------------------------
  {
    id: 5,
    number: 5,
    code: 'K5',
    name: 'Dosen, Tenaga Kependidikan, Penelitian, dan PkM',
    shortName: 'SDM, Riset & PkM',
    weight: 20.0,
    iconName: 'GraduationCap',
    color: '#7C3AED',
    bgGradient: 'from-purple-950 to-indigo-950',
    description: 'Kualifikasi, kecukupan, dan rasio dosen tetap program studi (DTPS berkualifikasi S3 Doktor bidang kesehatan masyarakat), tenaga kependidikan (Tendik), serta produktivitas penelitian dan pengabdian kepada masyarakat (PkM) bereputasi.',
    subCriteria: [
      {
        id: 'sub-5.1',
        code: '5.1',
        name: 'Penetapan dan Kualifikasi Dosen',
        criterionId: 5,
        guidanceText: 'Kecukupan DTPS Magister Kesehatan Masyarakat minimal berkualifikasi Doktor (S3), kesesuaian bidang keahlian dengan mata kuliah yang diampu, serta jabatan fungsional Lektor/Lektor Kepala/Guru Besar.',
        elementCodes: ['5.1.1', '5.1.2', '5.1.3'],
      },
      {
        id: 'sub-5.2',
        code: '5.2',
        name: 'Kinerja dan Perilaku Dosen',
        criterionId: 5,
        guidanceText: 'Beban kerja dosen (BKD/Ewmp) yang seimbang antara pengajaran, pembimbingan tesis, penelitian, PkM, dan tugas institusional, serta penegakan kode etik dosen.',
        elementCodes: ['5.2.1', '5.2.2', '5.2.3', '5.2.4', '5.2.5'],
      },
      {
        id: 'sub-5.3',
        code: '5.3',
        name: 'Pengembangan Profesional Dosen',
        criterionId: 5,
        guidanceText: 'Program terencana pembinaan karir dosen, peningkatan jabatan fungsional Guru Besar, partisipasi konferensi internasional, sertifikasi kompetensi, dan studi lanjut.',
        elementCodes: ['5.3.1', '5.3.2', '5.3.3'],
      },
      {
        id: 'sub-5.4',
        code: '5.4',
        name: 'Pengembangan Tenaga Kependidikan (Tendik)',
        criterionId: 5,
        guidanceText: 'Kualifikasi dan kecukupan pustakawan, laboran, teknisi IT, dan staf administrasi akademik pascasarjana serta program pelatihan peningkatan kompetensi tendik.',
        elementCodes: ['5.4.1', '5.4.2', '5.4.3', '5.4.4'],
      },
      {
        id: 'sub-5.5',
        code: '5.5',
        name: 'Penelitian Bidang Kesehatan Masyarakat',
        criterionId: 5,
        guidanceText: 'Peta jalan penelitian dosen dan mahasiswa magister (fokus wilayah lahan basah tropis), perolehan hibah kompetitif nasional (Kemendiktisaintek/BOPTN/RisetMu), publikasi pada jurnal internasional bereputasi (Scopus/WOS), serta perolehan HKI.',
        elementCodes: ['5.5.1', '5.5.2', '5.5.3', '5.5.4'],
      },
      {
        id: 'sub-5.6',
        code: '5.6',
        name: 'Pengabdian kepada Masyarakat (PkM)',
        criterionId: 5,
        guidanceText: 'Peta jalan PkM, keterlibatan mahasiswa pascasarjana dalam pemecahan masalah kesehatan masyarakat daerah, diseminasi inovasi ke dinas kesehatan dan masyarakat, serta hilirisasi luaran PkM.',
        elementCodes: ['5.6.1', '5.6.2', '5.6.3', '5.6.4'],
      },
    ],
    supportingDocuments: [
      {
        id: 'doc-k5-01',
        criterionId: 5,
        code: 'DOC-K5-01',
        name: 'SK Penugasan & Portofolio Dosen Tetap Program Studi (DTPS)',
        category: 'Kebijakan/SK',
        description: 'Ijazah S3 Doktor, SK Jabatan Fungsional, Sertifikat Pendidik (Serdos), dan rekapitulasi beban kerja BKD semesteran.',
        isMandatory: true,
      },
      {
        id: 'doc-k5-02',
        criterionId: 5,
        code: 'DOC-K5-02',
        name: 'Roadmap & Laporan Kinerja Riset Dosen-Mahasiswa',
        category: 'Laporan Kinerja',
        description: 'Buku peta jalan penelitian magister kesmas, bukti kontrak hibah penelitian, laporan kemajuan, dan repositori artikel Scopus/SINTA.',
        isMandatory: true,
      },
      {
        id: 'doc-k5-03',
        criterionId: 5,
        code: 'DOC-K5-03',
        name: 'Roadmap & Laporan Kinerja Pengabdian Masyarakat (PkM)',
        category: 'Laporan Kinerja',
        description: 'Dokumentasi PkM terpadu penanggulangan stunting, sanitasi lahan basah, malaria, dan pemberdayaan kader posyandu.',
        isMandatory: true,
      },
      {
        id: 'doc-k5-04',
        criterionId: 5,
        code: 'DOC-K5-04',
        name: 'Sertifikat HKI / Hak Cipta / Paten / Rekomendasi Kebijakan',
        category: 'Dokumen Mutu',
        description: 'Sertifikat Hak Cipta Kemenkumham modul edukasi kesehatan, policy brief untuk pemerintah daerah, dan paten inovasi kesehatan.',
        isMandatory: false,
      },
    ],
  },

  // -----------------------------------------------------------------------
  // KRITERIA 6
  // -----------------------------------------------------------------------
  {
    id: 6,
    number: 6,
    code: 'K6',
    name: 'Sarana, Prasarana, dan Keuangan',
    shortName: 'Sarpras & Keuangan',
    weight: 10.0,
    iconName: 'DollarSign',
    color: '#0891B2',
    bgGradient: 'from-cyan-950 to-slate-900',
    description: 'Kecukupan, aksesibilitas, dan kualitas sarana prasarana pembelajaran pascasarjana, laboratorium kesehatan masyarakat terpadu, perpustakaan digital berstandar internasional, serta tata kelola keuangan yang transparan dan berkelanjutan.',
    subCriteria: [
      {
        id: 'sub-6.1',
        code: '6.1',
        name: 'Fasilitas Fisik dan Laboratorium',
        criterionId: 6,
        guidanceText: 'Ketersediaan ruang kuliah representatif ber-AC, proyektor multimedia, smart-board, laboratorium kesehatan masyarakat (Lab Epidemiologi, K3, Toksikologi Lingkungan, Media Promkes), dan ruang kerja mahasiswa tesis.',
        elementCodes: ['6.1.1', '6.1.2'],
      },
      {
        id: 'sub-6.2',
        code: '6.2',
        name: 'Sumber Informasi dan Kepustakaan',
        criterionId: 6,
        guidanceText: 'Perpustakaan cetak dan digital, langganan pangkalan data jurnal internasional (ScienceDirect, ProQuest, PubMed, SpringerLink), software pengolahan data statistik (SPSS, Stata, Epi-Info, NVivo, GIS), dan repositori tesis terindeks.',
        elementCodes: ['6.2.1', '6.2.2', '6.2.3', '6.2.4'],
      },
      {
        id: 'sub-6.3',
        code: '6.3',
        name: 'Sumber Daya Keuangan dan Anggaran',
        criterionId: 6,
        guidanceText: 'Kecukupan alokasi dana operasional pendidikan, penelitian, PkM, pengembangan sarpras, transparansi sistem audit keuangan internal/eksternal, serta upaya revenue generating activities.',
        elementCodes: ['6.3.1', '6.3.2', '6.3.3', '6.3.4'],
      },
    ],
    supportingDocuments: [
      {
        id: 'doc-k6-01',
        criterionId: 6,
        code: 'DOC-K6-01',
        name: 'Laporan Keuangan Teraudit & RKAT PS S2 MKM (3 Tahun)',
        category: 'Laporan Kinerja',
        description: 'Rencana Kerja Anggaran Tahunan (RKAT), laporan realisasi anggaran, dan opini hasil audit akuntan publik / SPI institusi.',
        isMandatory: true,
      },
      {
        id: 'doc-k6-02',
        criterionId: 6,
        code: 'DOC-K6-02',
        name: 'Daftar Inventaris Sarana Prasarana Laboratorium MKM',
        category: 'Laporan Kinerja',
        description: 'Daftar peralatan lab lingkungan, sampling udara/air, instrumen K3, software statistika berlisensi, dan bukti kalibrasi alat.',
        isMandatory: true,
      },
      {
        id: 'doc-k6-03',
        criterionId: 6,
        code: 'DOC-K6-03',
        name: 'Bukti Langganan Database Jurnal Internasional & E-Book',
        category: 'Lainnya',
        description: 'Faktur langganan konsorsium jurnal, bukti akses e-resources Perpustakaan Nasional / institusi, dan data statistik peminjaman e-book.',
        isMandatory: true,
      },
    ],
  },

  // -----------------------------------------------------------------------
  // KRITERIA 7
  // -----------------------------------------------------------------------
  {
    id: 7,
    number: 7,
    code: 'K7',
    name: 'Penjaminan Mutu',
    shortName: 'Penjaminan Mutu',
    weight: 8.0,
    iconName: 'ShieldCheck',
    color: '#16A34A',
    bgGradient: 'from-emerald-950 to-green-950',
    description: 'Implementasi Sistem Penjaminan Mutu Internal (SPMI) secara konsisten dan terencana dengan siklus PPEPP (Penetapan, Pelaksanaan, Evaluasi, Pengendalian, dan Peningkatan) untuk seluruh standar pendidikan, penelitian, dan pengabdian.',
    subCriteria: [
      {
        id: 'sub-7.1',
        code: '7.1',
        name: 'Sistem Penjaminan Mutu Internal (SPMI / Siklus PPEPP)',
        criterionId: 7,
        guidanceText: 'Ketersediaan organ penjaminan mutu di tingkat UPPS dan PS, ketersediaan dokumen SPMI lengkap (Kebijakan, Manual, Standar, dan Formulir), pelaksanaan Audit Mutu Internal (AMI) berkala, Rapat Tinjauan Manajemen (RTM), dan bukti peningkatan mutu berkelanjutan.',
        elementCodes: ['7.1.1', '7.1.2', '7.1.3', '7.1.4', '7.1.5'],
      },
    ],
    supportingDocuments: [
      {
        id: 'doc-k7-01',
        criterionId: 7,
        code: 'DOC-K7-01',
        name: 'Dokumen SPMI Lengkap (Kebijakan, Manual, Standar, Formulir)',
        category: 'Dokumen Mutu',
        description: 'Buku dokumen Standar Penjaminan Mutu Internal yang melampaui SN-Dikti termasuk standar khusus kesehatan masyarakat.',
        isMandatory: true,
      },
      {
        id: 'doc-k7-02',
        criterionId: 7,
        code: 'DOC-K7-02',
        name: 'Laporan Audit Mutu Internal (AMI) & Rekomendasi Temuan',
        category: 'Dokumen Mutu',
        description: 'Laporan hasil AMI tahunan oleh auditor bersertifikat, daftar temuan ketidaksesuaian (KTS), dan observasi.',
        isMandatory: true,
      },
      {
        id: 'doc-k7-03',
        criterionId: 7,
        code: 'DOC-K7-03',
        name: 'Notula & Risalah Rapat Tinjauan Manajemen (RTM)',
        category: 'Dokumen Mutu',
        description: 'Dokumentasi RTM bersama pimpinan fakultas/rektorat, tindakan korektif, dan bukti peningkatan standar mutu (Peningkatan PPEPP).',
        isMandatory: true,
      },
    ],
  },

  // -----------------------------------------------------------------------
  // KRITERIA 8
  // -----------------------------------------------------------------------
  {
    id: 8,
    number: 8,
    code: 'K8',
    name: 'Tata Kelola dan Administrasi',
    shortName: 'Tata Kelola',
    weight: 10.0,
    iconName: 'Layers',
    color: '#4F46E5',
    bgGradient: 'from-slate-900 to-indigo-950',
    description: 'Struktur organisasi, tata pamong, kepemimpinan publik yang efektif dan beretika, sistem pengelolaan administrasi berbasis sistem informasi terintegrasi, kepuasan pemangku kepentingan, serta kemitraan tridarma strategis.',
    subCriteria: [
      {
        id: 'sub-8.1',
        code: '8.1',
        name: 'Tata Kelola dan Kepemimpinan',
        criterionId: 8,
        guidanceText: 'Penerapan prinsip-prinsip Good University Governance (kredibilitas, transparansi, akuntabilitas, tanggung jawab, dan keadilan), kepemimpinan visioner, kejelasan tugas pokok dan fungsi (Tupoksi) kaprodi/sekprodi/GPM, serta keberlanjutan program studi.',
        elementCodes: ['8.1.1', '8.1.2', '8.1.3', '8.1.4', '8.1.5'],
      },
      {
        id: 'sub-8.2',
        code: '8.2',
        name: 'Keterlibatan Mahasiswa dan Dosen',
        criterionId: 8,
        guidanceText: 'Partisipasi aktif sivitas akademika dalam pengambilan keputusan, forum rapat kurikulum, evaluasi dosen oleh mahasiswa (EDOM), organisasi kemahasiswaan himpunan pascasarjana, dan komite etik.',
        elementCodes: ['8.2.1', '8.2.2', '8.2.3'],
      },
      {
        id: 'sub-8.3',
        code: '8.3',
        name: 'Administrasi dan Layanan Operasional',
        criterionId: 8,
        guidanceText: 'Efisiensi sistem administrasi terpadu (SIAKAD, e-office, perpustakaan digital, tracer study), layanan surat-menyurat terdigitalisasi, keamanan data privasi mahasiswa, dan mitigasi risiko operasional.',
        elementCodes: ['8.3.1', '8.3.2', '8.3.3'],
      },
    ],
    supportingDocuments: [
      {
        id: 'doc-k8-01',
        criterionId: 8,
        code: 'DOC-K8-01',
        name: 'Statuta UPPS & Struktur Organisasi Tata Kerja (SOTK)',
        category: 'Kebijakan/SK',
        description: 'Buku Statuta Universitas/Fakultas, rincian uraian tugas, wewenang, dan hierarki kepemimpinan program studi magister.',
        isMandatory: true,
      },
      {
        id: 'doc-k8-02',
        criterionId: 8,
        code: 'DOC-K8-02',
        name: 'Dokumen Kerja Sama (MoU, MoA, IA) Nasional & Internasional',
        category: 'MoU/MoA',
        description: 'Naskah kerja sama aktif dengan Dinkes Kalbar, BKKBN, RS Rujukan, universitas mitra luar negeri, dan laporan bukti realisasi kegiatan.',
        isMandatory: true,
      },
      {
        id: 'doc-k8-03',
        criterionId: 8,
        code: 'DOC-K8-03',
        name: 'Laporan Survei Kepuasan Sivitas Akademika & Tindak Lanjut',
        category: 'Laporan Kinerja',
        description: 'Laporan kepuasan mahasiswa, dosen, tendik, dan pengguna lulusan terhadap layanan tata kelola dan administrasi UPPS.',
        isMandatory: true,
      },
    ],
  },
];

// =========================================================================
// DATA SEED 121 ELEMEN UTAMA & BUTIR PEMENUHAN (SESUAI DOKUMEN BUKU III)
// =========================================================================

export const LAMPTKES_MAIN_ELEMENTS: MainElement[] = [
  // -----------------------------------------------------------------------
  // KRITERIA 1 (1.1.1 s.d. 1.1.6)
  // -----------------------------------------------------------------------
  {
    id: 'el-1.1.1',
    code: '1.1.1',
    criterionId: 1,
    subCriterionId: 'sub-1.1',
    question: 'Bagaimana UPPS dan Program Studi merumuskan Visi, Misi, Tujuan, dan Strategi (VMTS) yang mencerminkan profil lulusan Magister Kesehatan Masyarakat dan keunggulan wilayah lahan basah tropis?',
    benchmark: 'SN-Dikti & Pedoman LAM-PTKes Buku III',
    tags: ['VMTS', 'Perumusan', 'Profil Lulusan'],
    complianceItems: [
      { id: '1.1.1-1', order: 1, text: 'Tersedianya dokumen formal SK perumusan dan penetapan VMTS oleh pimpinan institusi berwenang.' },
      { id: '1.1.1-2', order: 2, text: 'Rumusan visi program studi mencerminkan visi keilmuan magister kesehatan masyarakat berdaya saing dengan kekhasan lokal wilayah lahan basah tropis.' },
      { id: '1.1.1-3', order: 3, text: 'Misi dan tujuan disusun secara operasional, realistis, dan berorientasi pada pencapaian luaran kompetensi lulusan KKNI Level 8.' },
    ],
  },
  {
    id: 'el-1.1.2',
    code: '1.1.2',
    criterionId: 1,
    subCriterionId: 'sub-1.1',
    question: 'Bagaimana mekanisme keterlibatan pemangku kepentingan internal dan eksternal dalam penyusunan, peninjauan, dan pemutakhiran VMTS?',
    benchmark: 'Partisipasi Stakeholder & Analisis Kebutuhan',
    tags: ['Pemangku Kepentingan', 'FGD', 'Alumni', 'Dinkes'],
    complianceItems: [
      { id: '1.1.2-1', order: 1, text: 'Keterlibatan dosen, mahasiswa baru, dan tenaga kependidikan dalam rapat perumusan dan evaluasi VMTS.' },
      { id: '1.1.2-2', order: 2, text: 'Keterlibatan pemangku kepentingan eksternal: Dinas Kesehatan, Rumah Sakit, Organisasi Profesi (IAKMI/PERSAKMI), dan pengguna lulusan.' },
      { id: '1.1.2-3', order: 3, text: 'Terdokumentasikannya notula, daftar hadir, dokumentasi visual, dan berita acara lokakarya penjaringan aspirasi VMTS.' },
    ],
  },
  {
    id: 'el-1.1.3',
    code: '1.1.3',
    criterionId: 1,
    subCriterionId: 'sub-1.1',
    question: 'Bagaimana strategi dan rencana operasional (Renop) yang ditetapkan untuk mencapai tujuan program studi magister dalam kurun waktu rencana strategis?',
    benchmark: 'Rencana Strategis & Indikator Capaian',
    tags: ['Renstra', 'Renop', 'Strategi'],
    complianceItems: [
      { id: '1.1.3-1', order: 1, text: 'Adanya dokumen Renstra UPPS dan Renop Program Studi yang memuat milestone target capaian tahapan 5 tahunan.' },
      { id: '1.1.3-2', order: 2, text: 'Kesesuaian alokasi sumber daya finansial, manusia, dan sarana prasarana terhadap program kerja strategis.' },
      { id: '1.1.3-3', order: 3, text: 'Tersedianya mekanisme mitigasi risiko terhadap hambatan pencapaian sasaran strategis program studi.' },
    ],
  },
  {
    id: 'el-1.1.4',
    code: '1.1.4',
    criterionId: 1,
    subCriterionId: 'sub-1.1',
    question: 'Bagaimana indikator kinerja utama (IKU) dan indikator kinerja tambahan (IKT) ditetapkan dan diukur untuk mengevaluasi ketercapaian VMTS?',
    benchmark: 'Standar IKU Kemendiktisaintek & IKT Institusi',
    tags: ['IKU', 'IKT', 'Evaluasi Kinerja'],
    complianceItems: [
      { id: '1.1.4-1', order: 1, text: 'Ditetapkannya indikator keberhasilan kuantitatif dan kualitatif pada setiap butir tujuan program studi.' },
      { id: '1.1.4-2', order: 2, text: 'Adanya instrumen dan sistem pengukuran IKU/IKT secara periodik (semesteran dan tahunan).' },
      { id: '1.1.4-3', order: 3, text: 'Tersedianya laporan evaluasi capaian IKU/IKT yang dipresentasikan dalam rapat evaluasi pimpinan.' },
    ],
  },
  {
    id: 'el-1.1.5',
    code: '1.1.5',
    criterionId: 1,
    subCriterionId: 'sub-1.1',
    question: 'Bagaimana efektivitas sosialisasi VMTS dilakukan kepada seluruh sivitas akademika dan pemangku kepentingan serta tingkat pemahamannya?',
    benchmark: 'Sosialisasi & Pemahaman Sivitas',
    tags: ['Sosialisasi', 'Survei Pemahaman'],
    complianceItems: [
      { id: '1.1.5-1', order: 1, text: 'Pemanfaatan media komunikasi daring (website portal, media sosial, SIM Kampus) dan luring (banner, buku pedoman).' },
      { id: '1.1.5-2', order: 2, text: 'Pelaksanaan survei berkala tingkat pemahaman VMTS kepada dosen, mahasiswa, tendik, dan mitra kerja.' },
      { id: '1.1.5-3', order: 3, text: 'Tingkat pemahaman sivitas akademika mencapai persentase minimal kategori sangat baik (>85%).' },
    ],
  },
  {
    id: 'el-1.1.6',
    code: '1.1.6',
    criterionId: 1,
    subCriterionId: 'sub-1.1',
    question: 'Bagaimana hasil monitoring dan evaluasi ketercapaian VMTS digunakan untuk perbaikan berkelanjutan dan pemutakhiran rencana tindak lanjut?',
    benchmark: 'Siklus Evaluasi Diri & Tindak Lanjut',
    tags: ['Audit Diri', 'Continuous Improvement', 'RTL'],
    complianceItems: [
      { id: '1.1.6-1', order: 1, text: 'Pelaksanaan tinjauan periodik terhadap capaian VMTS sekurang-kurangnya sekali dalam satu siklus kepengurusan.' },
      { id: '1.1.6-2', order: 2, text: 'Rumusan rekomendasi perbaikan dan rencana tindak lanjut (RTL) yang diintegrasikan ke anggaran tahun berikutnya.' },
    ],
  },

  // -----------------------------------------------------------------------
  // KRITERIA 2 (2.1.1 - 2.4.3) - 24 Elemen
  // -----------------------------------------------------------------------
  // 2.1 Capaian Pembelajaran (2.1.1 - 2.1.7)
  {
    id: 'el-2.1.1',
    code: '2.1.1',
    criterionId: 2,
    subCriterionId: 'sub-2.1',
    question: 'Bagaimana Program Studi merumuskan Capaian Pembelajaran Lulusan (CPL) yang selaras dengan profil lulusan Magister Kesehatan Masyarakat jenjang KKNI Level 8?',
    benchmark: 'Deskriptor KKNI Level 8 & Kesepakatan Asosiasi BKS-IKM',
    complianceItems: [
      { id: '2.1.1-1', order: 1, text: 'CPL mencakup empat dimensi utuh: sikap, pengetahuan mendalam, keterampilan umum, dan keterampilan khusus magister kesmas.' },
      { id: '2.1.1-2', order: 2, text: 'Kesesuaian rumusan dengan deskriptor KKNI jenjang magister (kemampuan riset mandiri dan kepemimpinan sistem kesehatan).' },
      { id: '2.1.1-3', order: 3, text: 'CPL disahkan melalui SK Pimpinan Fakultas dan tercantum dalam Buku Kurikulum resmi.' },
    ],
  },
  {
    id: 'el-2.1.2',
    code: '2.1.2',
    criterionId: 2,
    subCriterionId: 'sub-2.1',
    question: 'Bagaimana keterlibatan asosiasi profesi (IAKMI/PERSAKMI), alumni, dan pakar kesehatan masyarakat dalam proses perumusan dan peninjauan CPL?',
    benchmark: 'Keterlibatan Eksternal Asosiasi Profesi',
    complianceItems: [
      { id: '2.1.2-1', order: 1, text: 'Adanya masukan tertulis dari perwakilan IAKMI dan praktisi dinas kesehatan dalam penentuan kompetensi utama.' },
      { id: '2.1.2-2', order: 2, text: 'Hasil studi pelacakan pengguna lulusan (tracer study) dijadikan dasar penyesuaian profil dan kompetensi.' },
    ],
  },
  {
    id: 'el-2.1.3',
    code: '2.1.3',
    criterionId: 2,
    subCriterionId: 'sub-2.1',
    question: 'Bagaimana CPL mengakomodasi kompetensi abad ke-21, kemampuan berpikir kritis tingkat tinggi (HOTS), dan pemecahan masalah kesehatan berbasis bukti (evidence-based public health)?',
    benchmark: 'Kompetensi Abad 21 & HOTS',
    complianceItems: [
      { id: '2.1.3-1', order: 1, text: 'Integrasi literasi data kesehatan digital, literasi teknologi, dan pemodelan epidemiologi analitik dalam CPL.' },
      { id: '2.1.3-2', order: 2, text: 'Kemampuan formulasi kebijakan kesehatan publik berdasarkan sintesis bukti ilmiah meta-analisis dan surveilans.' },
    ],
  },
  {
    id: 'el-2.1.4',
    code: '2.1.4',
    criterionId: 2,
    subCriterionId: 'sub-2.1',
    question: 'Bagaimana CPL dikomunikasikan secara transparan dan dipahami oleh dosen pengampu mata kuliah serta mahasiswa?',
    benchmark: 'Transparansi CPL di RPS dan Portal',
    complianceItems: [
      { id: '2.1.4-1', order: 1, text: 'CPL dirinci ke dalam CPMK dan Sub-CPMK pada setiap Rencana Pembelajaran Semester (RPS).' },
      { id: '2.1.4-2', order: 2, text: 'Sosialisasi CPL disampaikan dalam kuliah perdana matrikulasi dan dapat diakses di portal akademik SIAKAD.' },
    ],
  },
  {
    id: 'el-2.1.5',
    code: '2.1.5',
    criterionId: 2,
    subCriterionId: 'sub-2.1',
    question: 'Bagaimana sistem asesmen ketercapaian CPL (CPL assessment) dirancang dan dilaksanakan pada setiap semester?',
    benchmark: 'Outcome-Based Education (OBE) Assessment',
    complianceItems: [
      { id: '2.1.5-1', order: 1, text: 'Tersedianya matriks pemetaan mata kuliah terhadap pemenuhan butir-butir CPL.' },
      { id: '2.1.5-2', order: 2, text: 'Adanya instrumen portofolio asesmen ketercapaian CPL mahasiswa per mata kuliah dan per semester.' },
    ],
  },
  {
    id: 'el-2.1.6',
    code: '2.1.6',
    criterionId: 2,
    subCriterionId: 'sub-2.1',
    question: 'Bagaimana hasil pengukuran CPL dianalisis untuk mengidentifikasi kesenjangan kompetensi mahasiswa dan merumuskan perbaikan pembelajaran?',
    benchmark: 'Analisis Capaian Mutu Pembelajaran',
    complianceItems: [
      { id: '2.1.6-1', order: 1, text: 'Adanya laporan ketercapaian CPL angkatan mahasiswa yang dievaluasi dalam rapat pleno prodi.' },
      { id: '2.1.6-2', order: 2, text: 'Tindak lanjut perbaikan pedagogis terhadap butir CPL yang capaiannya masih di bawah ambang batas standar.' },
    ],
  },
  {
    id: 'el-2.1.7',
    code: '2.1.7',
    criterionId: 2,
    subCriterionId: 'sub-2.1',
    question: 'Bagaimana program studi mendokumentasikan pemutakhiran CPL secara berkala sesuai dengan perkembangan ipteks dan dinamika kebijakan kesehatan nasional/global?',
    benchmark: 'Siklus Peninjauan Kurikulum Periodik (4-5 Tahun)',
    complianceItems: [
      { id: '2.1.7-1', order: 1, text: 'Peninjauan berkala kurikulum dan CPL sekurang-kurangnya sekali dalam kurun waktu 4-5 tahun.' },
      { id: '2.1.7-2', order: 2, text: 'Dokumentasi perbandingan perubahan CPL lama dengan CPL baru yang diperkaya keilmuan mutakhir.' },
    ],
  },

  // 2.2 Struktur Kurikulum (2.2.1 - 2.2.3)
  {
    id: 'el-2.2.1',
    code: '2.2.1',
    criterionId: 2,
    subCriterionId: 'sub-2.2',
    question: 'Bagaimana struktur dan beban SKS kurikulum dirancang untuk memastikan penyelesaian studi tepat waktu (4 semester / 36-42 SKS) dengan sebaran yang seimbang?',
    benchmark: 'SN-Dikti Beban Studi Magister (36-42 SKS)',
    complianceItems: [
      { id: '2.2.1-1', order: 1, text: 'Total beban SKS kurikulum berkisar antara 36 sampai 42 SKS yang terbagi logis dalam 4 semester.' },
      { id: '2.2.1-2', order: 2, text: 'Mata kuliah prasyarat, mata kuliah dasar keilmuan kesmas, konsentrasi peminatan, dan tesis terjadwal sistematis.' },
    ],
  },
  {
    id: 'el-2.2.2',
    code: '2.2.2',
    criterionId: 2,
    subCriterionId: 'sub-2.2',
    question: 'Bagaimana struktur kurikulum mengakomodasi peminatan atau konsentrasi keilmuan yang relevan dengan kebutuhan kesehatan masyarakat daerah dan nasional?',
    benchmark: 'Kesesuaian Konsentrasi Keilmuan S2 MKM',
    complianceItems: [
      { id: '2.2.2-1', order: 1, text: 'Ketersediaan paket mata kuliah peminatan (Administrasi Kebijakan Kesehatan, Epidemiologi, K3, Promosi Kesehatan).' },
      { id: '2.2.2-2', order: 2, text: 'Kesesuaian kurikulum peminatan dengan keahlian dosen pengampu dan fasilitas pendukung riset tesis.' },
    ],
  },
  {
    id: 'el-2.2.3',
    code: '2.2.3',
    criterionId: 2,
    subCriterionId: 'sub-2.2',
    question: 'Bagaimana mekanisme fleksibilitas pembelajaran dan rekognisi pembelajaran lampau (RPL) atau transfer kredit diatur dalam struktur kurikulum?',
    benchmark: 'Regulasi RPL & Transfer Kredit',
    complianceItems: [
      { id: '2.2.3-1', order: 1, text: 'Tersedianya pedoman dan SOP alih kredit, matrikulasi, serta pengakuan kompetensi formal/informal sebelumnya.' },
      { id: '2.2.3-2', order: 2, text: 'Transparansi penetapan mata kuliah matrikulasi bagi mahasiswa dengan latar belakang pendidikan sarjana non-kesmas.' },
    ],
  },

  // 2.3 Isi Kurikulum (2.3.1 - 2.3.11)
  {
    id: 'el-2.3.1',
    code: '2.3.1',
    criterionId: 2,
    subCriterionId: 'sub-2.3',
    question: 'Bagaimana isi kurikulum mencakup disiplin inti kesehatan masyarakat (Epidemiologi Lanjut, Biostatistika Terapan, Kebijakan Kesehatan, Kesling-K3, dan Manajemen Program)?',
    benchmark: 'Standar Keilmuan Inti Magister Kesmas',
    complianceItems: [
      { id: '2.3.1-1', order: 1, text: 'Kedalaman materi perkuliahan pada level analisis, evaluasi, dan penciptaan solusi masalah kesehatan populasi.' },
      { id: '2.3.1-2', order: 2, text: 'Pemanfaatan rujukan referensi jurnal ilmiah mutakhir (5-10 tahun terakhir) pada silabus tiap mata kuliah.' },
    ],
  },
  {
    id: 'el-2.3.2',
    code: '2.3.2',
    criterionId: 2,
    subCriterionId: 'sub-2.3',
    question: 'Bagaimana isi kurikulum mengintegrasikan kekhasan dan keunggulan lokal masalah kesehatan lingkungan wilayah lahan basah tropis dan daerah perbatasan?',
    benchmark: 'Keunggulan Distingtif Program Studi',
    complianceItems: [
      { id: '2.3.2-1', order: 1, text: 'Tersedianya mata kuliah atau modul khusus ekologi kesehatan lahan basah tropis dan penyakit tular vektor air.' },
      { id: '2.3.2-2', order: 2, text: 'Kajian kasus kebijakan kesehatan di wilayah terpencil, perbatasan, dan kepulauan (3T) di Kalimantan Barat.' },
    ],
  },
  {
    id: 'el-2.3.3',
    code: '2.3.3',
    criterionId: 2,
    subCriterionId: 'sub-2.3',
    question: 'Bagaimana integrasi hasil penelitian dosen dan pengabdian kepada masyarakat (PkM) terwujud dalam bahan ajar dan modul perkuliahan?',
    benchmark: 'Integrasi Riset dan PkM ke Pembelajaran',
    complianceItems: [
      { id: '2.3.3-1', order: 1, text: 'Pencantuman artikel hasil riset DTPS sebagai bacaan wajib dan bahan telaah kasus dalam RPS.' },
      { id: '2.3.3-2', order: 2, text: 'Hasil kegiatan PkM dosen diadopsi sebagai model intervensi kesehatan berbasis komunitas dalam praktikum.' },
    ],
  },
  {
    id: 'el-2.3.4',
    code: '2.3.4',
    criterionId: 2,
    subCriterionId: 'sub-2.3',
    question: 'Bagaimana nilai-nilai etika profesi kesehatan masyarakat, integritas akademik, dan nilai keislaman/kemuhammadiyahan diinternalisasikan dalam isi kurikulum?',
    benchmark: 'Integrasi Etika & Nilai Karakter Institusi',
    complianceItems: [
      { id: '2.3.4-1', order: 1, text: 'Pembelajaran etika penelitian kesehatan (ethical clearance), anti-plagiasi, dan tata kelola kejujuran ilmiah.' },
      { id: '2.3.4-2', order: 2, text: 'Penanaman nilai etika profetik, kepedulian dhuafa-mustadhafin dalam advokasi kesehatan masyarakat.' },
    ],
  },
  {
    id: 'el-2.3.5',
    code: '2.3.5',
    criterionId: 2,
    subCriterionId: 'sub-2.3',
    question: 'Bagaimana muatan kepemimpinan sistem kesehatan, manajemen strategis, dan komunikasi risiko publik dipelajari mahasiswa?',
    benchmark: 'Leadership & Public Health Policy Competency',
    complianceItems: [
      { id: '2.3.5-1', order: 1, text: 'Substansi simulasi pembuatan naskah kebijakan (policy brief) dan negosiasi anggaran dengan stakeholder kesehatan.' },
      { id: '2.3.5-2', order: 2, text: 'Latihan manajemen krisis kesehatan, wabah, dan komunikasi risiko kedaruratan kesehatan masyarakat.' },
    ],
  },
  {
    id: 'el-2.3.6',
    code: '2.3.6',
    criterionId: 2,
    subCriterionId: 'sub-2.3',
    question: 'Bagaimana muatan ekonomi kesehatan dan pembiayaan program jaminan kesehatan nasional (JKN) diakomodasi dalam isi kurikulum?',
    benchmark: 'Health Economics & Financial Sustainability',
    complianceItems: [
      { id: '2.3.6-1', order: 1, text: 'Analisis efektivitas biaya (cost-effectiveness analysis / CEA) dan utilisasi pelayanan fasilitas primer/rujukan.' },
    ],
  },
  {
    id: 'el-2.3.7',
    code: '2.3.7',
    criterionId: 2,
    subCriterionId: 'sub-2.3',
    question: 'Bagaimana muatan metodologi penelitian kuantitatif lanjut, kualitatif, dan mixed methods dipersiapkan untuk menunjang penyusunan tesis?',
    benchmark: 'Metodologi Penelitian Lanjut KKNI 8',
    complianceItems: [
      { id: '2.3.7-1', order: 1, text: 'Penguasaan rancangan studi observasional, eksperimental, studi kasus mendalam, dan analisis spasial GIS.' },
      { id: '2.3.7-2', order: 2, text: 'Praktik penggunaan software analisis data kuantitatif dan kualitatif bersertifikasi.' },
    ],
  },
  {
    id: 'el-2.3.8',
    code: '2.3.8',
    criterionId: 2,
    subCriterionId: 'sub-2.3',
    question: 'Bagaimana muatan promosi kesehatan dan determinan sosial kesehatan (social determinants of health) dirancang untuk intervensi perubahan perilaku?',
    benchmark: 'Determinan Sosial Kesehatan WHO',
    complianceItems: [
      { id: '2.3.8-1', order: 1, text: 'Pendekatan analisis ketimpangan kesehatan berbasis gender, geografis, kemiskinan, dan kearifan lokal.' },
    ],
  },
  {
    id: 'el-2.3.9',
    code: '2.3.9',
    criterionId: 2,
    subCriterionId: 'sub-2.3',
    question: 'Bagaimana pengawasan kualitas dan validasi isi Rencana Pembelajaran Semester (RPS) dilakukan oleh Gugus Kendali Mutu?',
    benchmark: 'Penjaminan Mutu Dokumen Pembelajaran',
    complianceItems: [
      { id: '2.3.9-1', order: 1, text: 'Tersedianya rubrik telaah RPS oleh Unit Penjaminan Mutu (UPM) sebelum semester berjalan dimulai.' },
      { id: '2.3.9-2', order: 2, text: 'Pemberian masukan dan perbaikan terhadap kedalaman materi dan metode asesmen RPS.' },
    ],
  },
  {
    id: 'el-2.3.10',
    code: '2.3.10',
    criterionId: 2,
    subCriterionId: 'sub-2.3',
    question: 'Bagaimana kurikulum menyediakan ruang mata kuliah pilihan lintas program atau lintas institusi (merdeka belajar pascasarjana)?',
    benchmark: 'Fleksibilitas Belajar & Kolaborasi Antar-Institusi',
    complianceItems: [
      { id: '2.3.10-1', order: 1, text: 'Tersedianya pilihan mata kuliah elektif yang dapat diambil mahasiswa dari program studi mitra.' },
    ],
  },
  {
    id: 'el-2.3.11',
    code: '2.3.11',
    criterionId: 2,
    subCriterionId: 'sub-2.3',
    question: 'Bagaimana kepuasan mahasiswa terhadap kelengkapan dan kemutakhiran isi kurikulum diukur dan ditindaklanjuti?',
    benchmark: 'Survei Kepuasan Kurikulum Mahasiswa',
    complianceItems: [
      { id: '2.3.11-1', order: 1, text: 'Instrumen evaluasi kurikulum yang diisi mahasiswa pada setiap akhir tahun akademik.' },
      { id: '2.3.11-2', order: 2, text: 'Analisis hasil survei dan rekomendasi perbaikan bahan ajar yang disampaikan kepada dosen pengampu.' },
    ],
  },

  // 2.4 Metode dan Pengalaman Pembelajaran (2.4.1 - 2.4.3)
  {
    id: 'el-2.4.1',
    code: '2.4.1',
    criterionId: 2,
    subCriterionId: 'sub-2.4',
    question: 'Bagaimana penerapan metode pembelajaran interaktif berpusat pada mahasiswa (Case-based Method dan Project-based Learning) dilaksanakan pada perkuliahan magister?',
    benchmark: 'IKU 7 Kemendiktisaintek (Metode Kelas Kolaboratif)',
    complianceItems: [
      { id: '2.4.1-1', order: 1, text: 'Persentase mata kuliah yang mengimplementasikan case method dan pemecahan proyek riil kesehatan masyarakat mencapai minimal 50%.' },
      { id: '2.4.1-2', order: 2, text: 'Keterlibatan mahasiswa dalam telaah jurnal (journal reading) dan debat kebijakan kesehatan reguler.' },
    ],
  },
  {
    id: 'el-2.4.2',
    code: '2.4.2',
    criterionId: 2,
    subCriterionId: 'sub-2.4',
    question: 'Bagaimana pembelajaran berbasis teknologi digital (e-learning/LMS) dimanfaatkan untuk mendukung efektivitas interaksi akademik mahasiswa magister yang bekerja?',
    benchmark: 'Infrastruktur LMS & Hybrid Learning',
    complianceItems: [
      { id: '2.4.2-1', order: 1, text: 'Ketersediaan platform LMS interaktif institusi dengan rekam jejak aktivitas belajar, kuis, dan forum diskusi asinkronus.' },
      { id: '2.4.2-2', order: 2, text: 'Keseimbangan proporsi pertemuan sinkronus tatap muka dan asinkronus mandiri sesuai regulasi.' },
    ],
  },
  {
    id: 'el-2.4.3',
    code: '2.4.3',
    criterionId: 2,
    subCriterionId: 'sub-2.4',
    question: 'Bagaimana program studi menyelenggarakan residensi lapangan, praktik tata kelola kesehatan, atau kunjungan institusi kebijakan kesehatan nyata?',
    benchmark: 'Pengalaman Lapangan Riil Pascasarjana',
    complianceItems: [
      { id: '2.4.3-1', order: 1, text: 'Pelaksanaan kegiatan residensi/studi lapang terpadu di dinas kesehatan kabupaten/kota, rumah sakit, atau industri.' },
      { id: '2.4.3-2', order: 2, text: 'Laporan evaluasi residensi mahasiswa yang menghasilkan rekomendasi perbaikan sistem kesehatan nyata.' },
    ],
  },

  // -----------------------------------------------------------------------
  // KRITERIA 3 (3.1.1 - 3.4.6) - 17 Elemen
  // -----------------------------------------------------------------------
  // 3.1 Kebijakan dan Sistem Penilaian (3.1.1 - 3.1.3)
  {
    id: 'el-3.1.1',
    code: '3.1.1',
    criterionId: 3,
    subCriterionId: 'sub-3.1',
    question: 'Bagaimana kebijakan resmi, standar, dan pedoman sistem penilaian akademik program magister ditetapkan dan disosialisasikan?',
    benchmark: 'Pedoman Penilaian Pascasarjana',
    complianceItems: [
      { id: '3.1.1-1', order: 1, text: 'Regulasi formal yang mengatur skala nilai, kriteria kelulusan minimal, dan komponen penilaian multidimensi.' },
      { id: '3.1.1-2', order: 2, text: 'Penyampaian kontrak perkuliahan dan skema penilaian pada pertemuan perdana setiap mata kuliah.' },
    ],
  },
  {
    id: 'el-3.1.2',
    code: '3.1.2',
    criterionId: 3,
    subCriterionId: 'sub-3.1',
    question: 'Bagaimana sistem penilaian menjamin prinsip edukatif, otentik, objektif, akuntabel, dan transparan sesuai SN-Dikti?',
    benchmark: 'Prinsip Penilaian SN-Dikti',
    complianceItems: [
      { id: '3.1.2-1', order: 1, text: 'Penilaian didasarkan pada kriteria capaian yang jelas tanpa diskriminasi subjektif.' },
      { id: '3.1.2-2', order: 2, text: 'Hasil evaluasi dapat diakses oleh mahasiswa melalui sistem informasi akademik (SIAKAD).' },
    ],
  },
  {
    id: 'el-3.1.3',
    code: '3.1.3',
    criterionId: 3,
    subCriterionId: 'sub-3.1',
    question: 'Bagaimana sistem pembobotan penilaian (tugas, kuis, UTS, UAS, dan partisipasi kolaboratif) dikelola?',
    benchmark: 'Standar Pembobotan Nilai Magister',
    complianceItems: [
      { id: '3.1.3-1', order: 1, text: 'Proporsi penilaian tugas analisis mandiri/kelompok memiliki bobot dominan mencerminkan kemandirian magister.' },
      { id: '3.1.3-2', order: 2, text: 'Integrasi penilaian etika dan kedisiplinan akademik dalam nilai akhir mahasiswa.' },
    ],
  },

  // 3.2 Penilaian untuk Mendukung Pembelajaran (3.2.1 - 3.2.3)
  {
    id: 'el-3.2.1',
    code: '3.2.1',
    criterionId: 3,
    subCriterionId: 'sub-3.2',
    question: 'Bagaimana penilaian formatif dan pemberian umpan balik (feedback) konstruktif secara berkala diberikan kepada mahasiswa?',
    benchmark: 'Continuous Feedback & Formative Assessment',
    complianceItems: [
      { id: '3.2.1-1', order: 1, text: 'Pemberian catatan koreksi tertulis pada draf proposal penelitian tesis dan tugas esai kritis.' },
      { id: '3.2.1-2', order: 2, text: 'Waktu pengembalian berkas tugas berumpan balik dilakukan sebelum pelaksanaan ujian sumatif berikutnya.' },
    ],
  },
  {
    id: 'el-3.2.2',
    code: '3.2.2',
    criterionId: 3,
    subCriterionId: 'sub-3.2',
    question: 'Bagaimana proses penilaian sejawat (peer assessment) dan refleksi diri mahasiswa diterapkan untuk menumbuhkan etos ilmiah?',
    benchmark: 'Peer Assessment & Reflektif Ilmiah',
    complianceItems: [
      { id: '3.2.2-1', order: 1, text: 'Implementasi penilaian telaah sejawat saat presentasi seminar usulan penelitian antar mahasiswa.' },
    ],
  },
  {
    id: 'el-3.2.3',
    code: '3.2.3',
    criterionId: 3,
    subCriterionId: 'sub-3.2',
    question: 'Bagaimana bimbingan khusus atau remidiasi diberikan kepada mahasiswa yang mengalami kendala capaian kompetensi akademik?',
    benchmark: 'Program Pendampingan Remediasi Akademik',
    complianceItems: [
      { id: '3.2.3-1', order: 1, text: 'Mekanisme pendampingan intensif bagi mahasiswa dengan indeks prestasi di bawah standar minimal.' },
    ],
  },

  // 3.3 Penilaian untuk Pengambilan Keputusan (3.3.1 - 3.3.5)
  {
    id: 'el-3.3.1',
    code: '3.3.1',
    criterionId: 3,
    subCriterionId: 'sub-3.3',
    question: 'Bagaimana kriteria dan prosedur ujian kualifikasi / komprehensif bagi mahasiswa magister diselenggarakan?',
    benchmark: 'Ujian Komprehensif Magister',
    complianceItems: [
      { id: '3.3.1-1', order: 1, text: 'Ujian komprehensif menguji pemahaman sintesis holistik keilmuan kesehatan masyarakat dan metodologi riset.' },
      { id: '3.3.1-2', order: 2, text: 'Ditetapkannya syarat kelulusan komprehensif sebelum mahasiswa diizinkan maju seminar proposal tesis.' },
    ],
  },
  {
    id: 'el-3.3.2',
    code: '3.3.2',
    criterionId: 3,
    subCriterionId: 'sub-3.3',
    question: 'Bagaimana mekanisme ujian tesis (Seminar Proposal, Seminar Hasil, dan Ujian Tertutup/Terbuka) diselenggarakan secara akuntabel?',
    benchmark: 'Standar Pengujian Tesis S2',
    complianceItems: [
      { id: '3.3.2-1', order: 1, text: 'Susunan dewan penguji tesis terdiri atas pembimbing dan penguji ahli independen bergelar Doktor/Guru Besar.' },
      { id: '3.3.2-2', order: 2, text: 'Penggunaan rubrik baku penilaian orisinalitas riset, metodologi, dan kontribusi ilmiah bagi kesehatan masyarakat.' },
    ],
  },
  {
    id: 'el-3.3.3',
    code: '3.3.3',
    criterionId: 3,
    subCriterionId: 'sub-3.3',
    question: 'Bagaimana syarat kelulusan publikasi karya ilmiah magister pada jurnal ilmiah nasional terakreditasi / internasional bereputasi diverifikasi?',
    benchmark: 'Standar Publikasi Ilmiah Magister SN-Dikti',
    complianceItems: [
      { id: '3.3.3-1', order: 1, text: 'Ketentuan wajib submit/accepted artikel ilmiah pada jurnal minimal SINTA 2 atau jurnal internasional terindeks bereputasi.' },
      { id: '3.3.3-2', order: 2, text: 'Verifikasi bukti Letter of Acceptance (LoA) dan reprint artikel oleh tim verifikasi perpustakaan/GPM.' },
    ],
  },
  {
    id: 'el-3.3.4',
    code: '3.3.4',
    criterionId: 3,
    subCriterionId: 'sub-3.3',
    question: 'Bagaimana kriteria penentuan yudisium dan predikat kelulusan (Pujian/Cum Laude, Sangat Memuaskan, Memuaskan) ditegakkan?',
    benchmark: 'Pedoman Yudisium Kelulusan',
    complianceItems: [
      { id: '3.3.4-1', order: 1, text: 'Penetapan yudisium memperhitungkan IPK minimal, masa studi maksimal, dan tidak ada pengulangan nilai mata kuliah.' },
    ],
  },
  {
    id: 'el-3.3.5',
    code: '3.3.5',
    criterionId: 3,
    subCriterionId: 'sub-3.3',
    question: 'Bagaimana penanganan mahasiswa yang terancam putus studi (Drop-Out / masa studi melampaui batas) ditangani secara berkeadilan?',
    benchmark: 'SOP Peringatan Dini Akademik (Early Warning System)',
    complianceItems: [
      { id: '3.3.5-1', order: 1, text: 'Penerbitan surat peringatan akademik berkala (SP 1, SP 2, SP 3) bagi mahasiswa yang melampaui masa studi normal.' },
      { id: '3.3.5-2', order: 2, text: 'Sesi mediasi khusus bersama pembimbing dan kaprodi sebelum keputusan batas studi final diambil.' },
    ],
  },

  // 3.4 Penjaminan Mutu Penilaian (3.4.1 - 3.4.6)
  {
    id: 'el-3.4.1',
    code: '3.4.1',
    criterionId: 3,
    subCriterionId: 'sub-3.4',
    question: 'Bagaimana proses validasi dan telaah instrumen soal ujian / rubrik tugas dilakukan sebelum diujikan?',
    benchmark: 'Validasi Butir Soal & Rubrik Asesmen',
    complianceItems: [
      { id: '3.4.1-1', order: 1, text: 'Telaah instrumen soal ujian oleh koordinator bidang keilmuan untuk menjamin keselarasan dengan Sub-CPMK.' },
      { id: '3.4.1-2', order: 2, text: 'Tersedianya kisi-kisi dan kunci jawaban / rubrik holistik penilaian tertulis.' },
    ],
  },
  {
    id: 'el-3.4.2',
    code: '3.4.2',
    criterionId: 3,
    subCriterionId: 'sub-3.4',
    question: 'Bagaimana moderasi dan standarisasi penilaian antar-penguji atau antar-dosen tim (team teaching) dilakukan?',
    benchmark: 'Moderasi Penilaian Tim Dosen',
    complianceItems: [
      { id: '3.4.2-1', order: 1, text: 'Rapat koordinasi tim dosen pengampu mata kuliah untuk menyamakan persepsi standar penilaian angka ke huruf mutu.' },
    ],
  },
  {
    id: 'el-3.4.3',
    code: '3.4.3',
    criterionId: 3,
    subCriterionId: 'sub-3.4',
    question: 'Bagaimana mekanisme pencegahan kecurangan akademik, plagiarisme tesis, dan penggunaan alat bantu AI yang tidak etis?',
    benchmark: 'Integritas Akademik & Pengecekan Similaritas Turnitin',
    complianceItems: [
      { id: '3.4.3-1', order: 1, text: 'Kewajiban uji similaritas naskah proposal dan tesis menggunakan Turnitin dengan batas maksimal kesamaan ≤ 20%.' },
      { id: '3.4.3-2', order: 2, text: 'Pemberian sanksi tegas bagi pelanggaran fabrikasi data, falsifikasi, dan plagiarisme ilmiah.' },
    ],
  },
  {
    id: 'el-3.4.4',
    code: '3.4.4',
    criterionId: 3,
    subCriterionId: 'sub-3.4',
    question: 'Bagaimana SOP penanganan sanggahan / banding nilai mahasiswa diatur dan dijamin transparansinya?',
    benchmark: 'SOP Hak Banding Nilai Mahasiswa',
    complianceItems: [
      { id: '3.4.4-1', order: 1, text: 'Tersedianya alur resmi dan batas waktu pengajuan klarifikasi nilai oleh mahasiswa ke bagian akademik.' },
      { id: '3.4.4-2', order: 2, text: 'Transparansi berita acara pemeriksaan ulang berkas ujian oleh tim independen.' },
    ],
  },
  {
    id: 'el-3.4.5',
    code: '3.4.5',
    criterionId: 3,
    subCriterionId: 'sub-3.4',
    question: 'Bagaimana audit internal terhadap distribusi nilai mata kuliah (kurva normalitas nilai) dilakukan?',
    benchmark: 'Audit Mutu Distribusi Nilai',
    complianceItems: [
      { id: '3.4.5-1', order: 1, text: 'Analisis kewajaran sebaran nilai huruf (A, B+, B, C) setiap mata kuliah oleh Gugus Mutu Fakultas.' },
    ],
  },
  {
    id: 'el-3.4.6',
    code: '3.4.6',
    criterionId: 3,
    subCriterionId: 'sub-3.4',
    question: 'Bagaimana hasil audit mutu penilaian ditindaklanjuti untuk peningkatan mutu sistem asesmen semester berikutnya?',
    benchmark: 'Peningkatan Mutu Asesmen Berkelanjutan',
    complianceItems: [
      { id: '3.4.6-1', order: 1, text: 'Pemberian umpan balik kepada dosen terkait kualitas rubrik dan ketepatan waktu pengunggahan nilai.' },
    ],
  },

  // -----------------------------------------------------------------------
  // KRITERIA 4 (4.1.1 - 4.4.5) - 25 Elemen
  // -----------------------------------------------------------------------
  // 4.1 Seleksi dan Penerimaan Mahasiswa Baru (4.1.1 - 4.1.7)
  {
    id: 'el-4.1.1',
    code: '4.1.1',
    criterionId: 4,
    subCriterionId: 'sub-4.1',
    question: 'Bagaimana kebijakan, persyaratan, dan mekanisme seleksi penerimaan mahasiswa baru (Maba) magister dirumuskan dan disahkan?',
    benchmark: 'Pedoman PMB Pascasarjana',
    complianceItems: [
      { id: '4.1.1-1', order: 1, text: 'Pedoman PMB menetapkan syarat IPK minimal sarjana (S1), lulusan program studi terakreditasi, dan kesiapan riset.' },
      { id: '4.1.1-2', order: 2, text: 'Mekanisme seleksi mencakup tes potensi akademik, tes bahasa Inggris, dan wawancara komitmen akademik.' },
    ],
  },
  {
    id: 'el-4.1.2',
    code: '4.1.2',
    criterionId: 4,
    subCriterionId: 'sub-4.1',
    question: 'Bagaimana transparansi dan aksesibilitas informasi penerimaan mahasiswa baru dijamin bagi calon pendaftar dari berbagai daerah?',
    benchmark: 'Transparansi Informasi Publik PMB',
    complianceItems: [
      { id: '4.1.2-1', order: 1, text: 'Ketersediaan portal pendaftaran daring 24/7 dengan petunjuk teknis alur dan estimasi biaya yang gamblang.' },
      { id: '4.1.2-2', order: 2, text: 'Layanan konsultasi PMB melalui helpdesk interaktif dan media sosial resmi.' },
    ],
  },
  {
    id: 'el-4.1.3',
    code: '4.1.3',
    criterionId: 4,
    subCriterionId: 'sub-4.1',
    question: 'Bagaimana program studi menilai portofolio pengalaman kerja di bidang kesehatan dan draft rencana penelitian calon mahasiswa?',
    benchmark: 'Asesmen Portofolio Praktisi & Riset',
    complianceItems: [
      { id: '4.1.3-1', order: 1, text: 'Wawancara pendalaman terhadap draft topik penelitian tesis yang diajukan calon mahasiswa saat pendaftaran.' },
      { id: '4.1.3-2', order: 2, text: 'Pertimbangan pengalaman kerja di dinas kesehatan/faskes sebagai nilai tambah kompetensi awal.' },
    ],
  },
  {
    id: 'el-4.1.4',
    code: '4.1.4',
    criterionId: 4,
    subCriterionId: 'sub-4.1',
    question: 'Bagaimana kebijakan matrikulasi diselenggarakan bagi mahasiswa baru yang berlatar belakang pendidikan sarjana di luar bidang ilmu kesehatan masyarakat?',
    benchmark: 'Standar Program Matrikulasi S2',
    complianceItems: [
      { id: '4.1.4-1', order: 1, text: 'Penyelenggaraan matrikulasi wajib mencakup Pengantar Ilmu Kesehatan Masyarakat, Dasar Epidemiologi, dan Biostatistika.' },
      { id: '4.1.4-2', order: 2, text: 'Evaluasi kelulusan matrikulasi sebagai prasyarat mengikuti mata kuliah semester satu.' },
    ],
  },
  {
    id: 'el-4.1.5',
    code: '4.1.5',
    criterionId: 4,
    subCriterionId: 'sub-4.1',
    question: 'Bagaimana rasio pendaftar terhadap daya tampung (selektivitas) dan tren pertumbuhan jumlah mahasiswa baru dalam 3 tahun terakhir?',
    benchmark: 'Tren Rasio Pendaftar dan Daya Tampung',
    complianceItems: [
      { id: '4.1.5-1', order: 1, text: 'Rasio pendaftar terhadap yang diterima menunjukkan tingkat selektivitas yang sehat (> 1:1.5).' },
      { id: '4.1.5-2', order: 2, text: 'Pertumbuhan jumlah mahasiswa baru stabil dan sesuai dengan kecukupan rasio dosen pembimbing.' },
    ],
  },
  {
    id: 'el-4.1.6',
    code: '4.1.6',
    criterionId: 4,
    subCriterionId: 'sub-4.1',
    question: 'Bagaimana kebijakan non-diskriminasi, inklusivitas, dan pemberian kesempatan bagi mahasiswa penyandang disabilitas atau daerah 3T dijamin?',
    benchmark: 'Prinsip Kesetaraan dan Inklusivitas',
    complianceItems: [
      { id: '4.1.6-1', order: 1, text: 'Regulasi formal yang melarang diskriminasi berbasis gender, suku, agama, dan kondisi fisik.' },
      { id: '4.1.6-2', order: 2, text: 'Pemberian fasilitas penyesuaian bagi calon mahasiswa dari wilayah kepulauan dan pedalaman.' },
    ],
  },
  {
    id: 'el-4.1.7',
    code: '4.1.7',
    criterionId: 4,
    subCriterionId: 'sub-4.1',
    question: 'Bagaimana orientasi mahasiswa baru (Pengenalan Akademik Pascasarjana) dilaksanakan untuk menanamkan budaya riset dan integritas?',
    benchmark: 'Program Induksi Budaya Akademik Pascasarjana',
    complianceItems: [
      { id: '4.1.7-1', order: 1, text: 'Materi orientasi fokus pada penelusuran pustaka internasional, manajemen sitasi (Mendeley/Zotero), dan etika anti-plagiat.' },
    ],
  },

  // 4.2 Konseling dan Dukungan Mahasiswa (4.2.1 - 4.2.7)
  {
    id: 'el-4.2.1',
    code: '4.2.1',
    criterionId: 4,
    subCriterionId: 'sub-4.2',
    question: 'Bagaimana sistem bimbingan akademik oleh Dosen Pembimbing Akademik (DPA) dirancang dan dipantau keefektifannya?',
    benchmark: 'Sistem Pembimbingan Akademik Terstruktur',
    complianceItems: [
      { id: '4.2.1-1', order: 1, text: 'SK penetapan DPA dengan beban bimbingan maksimal yang rasional untuk memantau kemajuan tiap semester.' },
      { id: '4.2.1-2', order: 2, text: 'Logbook bimbingan akademik tercatat pada sistem informasi terintegrasi (minimal 3 kali per semester).' },
    ],
  },
  {
    id: 'el-4.2.2',
    code: '4.2.2',
    criterionId: 4,
    subCriterionId: 'sub-4.2',
    question: 'Bagaimana mekanisme pembimbingan penulisan tesis menjamin mutu ilmiah dan ketepatan waktu penyelesaian tugas akhir?',
    benchmark: 'Standar Pembimbingan Tesis (Komisi Pembimbing)',
    complianceItems: [
      { id: '4.2.2-1', order: 1, text: 'Penetapan 2 dosen pembimbing (Ketua dan Anggota) berkualifikasi Doktor dengan kepakaran relevan.' },
      { id: '4.2.2-2', order: 2, text: 'Jadwal monitoring kemajuan penulisan tesis secara berkala oleh gugus kendali mutu prodi.' },
    ],
  },
  {
    id: 'el-4.2.3',
    code: '4.2.3',
    criterionId: 4,
    subCriterionId: 'sub-4.2',
    question: 'Bagaimana layanan konseling psikologis dan penanganan stres akademik disediakan bagi mahasiswa magister?',
    benchmark: 'Layanan Konseling Psikososial Mahasiswa',
    complianceItems: [
      { id: '4.2.3-1', order: 1, text: 'Tersedianya unit layanan konseling psikologi universitas/fakultas yang menjaga kerahasiaan data mahasiswa.' },
    ],
  },
  {
    id: 'el-4.2.4',
    code: '4.2.4',
    criterionId: 4,
    subCriterionId: 'sub-4.2',
    question: 'Bagaimana program pengembangan soft-skills, kepemimpinan publik, dan kemampuan penulisan ilmiah (scientific writing) diselenggarakan?',
    benchmark: 'Pelatihan Soft-Skills & Scientific Writing',
    complianceItems: [
      { id: '4.2.4-1', order: 1, text: 'Workshop rutin klinik penulisan naskah jurnal internasional, teknik visualisasi data, dan public speaking kebijakan.' },
    ],
  },
  {
    id: 'el-4.2.5',
    code: '4.2.5',
    criterionId: 4,
    subCriterionId: 'sub-4.2',
    question: 'Bagaimana skema bantuan finansial, beasiswa riset, atau keringanan biaya kuliah difasilitasi bagi mahasiswa berprestasi / membutuhkan?',
    benchmark: 'Fasilitasi Beasiswa & Bantuan Finansial',
    complianceItems: [
      { id: '4.2.5-1', order: 1, text: 'Informasi dan rekomendasi beasiswa LPDP, BPI, Beasiswa Kader Muhammadiyah, serta hibah bantuan tesis institusi.' },
    ],
  },
  {
    id: 'el-4.2.6',
    code: '4.2.6',
    criterionId: 4,
    subCriterionId: 'sub-4.2',
    question: 'Bagaimana layanan pembinaan karir dan jejaring alumni memfasilitasi pengembangan profesional mahasiswa pascasarjana?',
    benchmark: 'Career Center & Sinergi Alumni',
    complianceItems: [
      { id: '4.2.6-1', order: 1, text: 'Fasilitasi temu alumni berkala dan bursa karir posisi manajerial kesehatan di tingkat regional/nasional.' },
    ],
  },
  {
    id: 'el-4.2.7',
    code: '4.2.7',
    criterionId: 4,
    subCriterionId: 'sub-4.2',
    question: 'Bagaimana tingkat kepuasan mahasiswa terhadap seluruh layanan dukungan dan bimbingan akademik dievaluasi?',
    benchmark: 'Survei Kepuasan Layanan Mahasiswa',
    complianceItems: [
      { id: '4.2.7-1', order: 1, text: 'Laporan kepuasan mahasiswa tahunan dengan instrumen baku yang dianalisis oleh Unit Penjaminan Mutu.' },
    ],
  },

  // 4.3 Lingkungan Kerja dan Belajar Mahasiswa (4.3.1 - 4.3.6)
  {
    id: 'el-4.3.1',
    code: '4.3.1',
    criterionId: 4,
    subCriterionId: 'sub-4.3',
    question: 'Bagaimana ruang belajar, ruang diskusi pascasarjana, dan fasilitas penunjang belajar mandiri disediakan dengan kualitas memadai?',
    benchmark: 'Standar Fasilitas Ruang Belajar Pascasarjana',
    complianceItems: [
      { id: '4.3.1-1', order: 1, text: 'Ruang kelas ber-AC dengan pencahayaan dan tata suara ergonomis serta meja diskusi kolaboratif.' },
      { id: '4.3.1-2', order: 2, text: 'Ketersediaan student lounge khusus mahasiswa magister untuk bekerja kelompok dan istirahat.' },
    ],
  },
  {
    id: 'el-4.3.2',
    code: '4.3.2',
    criterionId: 4,
    subCriterionId: 'sub-4.3',
    question: 'Bagaimana infrastruktur koneksi internet nirkabel (Wi-Fi) berkecepatan tinggi dapat diakses secara merata di seluruh area kampus?',
    benchmark: 'Konektivitas Internet & Bandwidth Kampus',
    complianceItems: [
      { id: '4.3.2-1', order: 1, text: 'Bandwidth internet memadai dengan cakupan sinyal Wi-Fi di seluruh ruang kuliah, perpustakaan, dan laboratorium.' },
    ],
  },
  {
    id: 'el-4.3.3',
    code: '4.3.3',
    criterionId: 4,
    subCriterionId: 'sub-4.3',
    question: 'Bagaimana suasana akademik (academic atmosphere) yang kondusif dibangun untuk mendorong diskusi ilmiah dan pertukaran gagasan kritis?',
    benchmark: 'Suasana Akademik & Seminar Reguler',
    complianceItems: [
      { id: '4.3.3-1', order: 1, text: 'Penyelenggaraan seminar berkala, stadium generale dengan narasumber pakar nasional/internasional, dan forum ilmiah prodi.' },
    ],
  },
  {
    id: 'el-4.3.4',
    code: '4.3.4',
    criterionId: 4,
    subCriterionId: 'sub-4.3',
    question: 'Bagaimana fasilitas sarana ibadah, sanitasi, kantin sehat, dan ruang istirahat mahasiswa dikelola dengan standar kebersihan tinggi?',
    benchmark: 'Fasilitas Sanitasi & Sarana Ibadah Ramah Lingkungan',
    complianceItems: [
      { id: '4.3.4-1', order: 1, text: 'Kebersihan toilet, ketersediaan air bersih higienis, tempat wudhu dan masjid kampus yang terawat representatif.' },
    ],
  },
  {
    id: 'el-4.3.5',
    code: '4.3.5',
    criterionId: 4,
    subCriterionId: 'sub-4.3',
    question: 'Bagaimana organisasi kemahasiswaan tingkat pascasarjana difasilitasi dalam menyalurkan aspirasi dan kegiatan ilmiah?',
    benchmark: 'Dukungan Organisasi Himpunan Mahasiswa Pascasarjana',
    complianceItems: [
      { id: '4.3.5-1', order: 1, text: 'Adanya Himpunan Mahasiswa Magister Kesehatan Masyarakat (HIMAMIKES) yang aktif dan didanai fakultas.' },
    ],
  },
  {
    id: 'el-4.3.6',
    code: '4.3.6',
    criterionId: 4,
    subCriterionId: 'sub-4.3',
    question: 'Bagaimana kepuasan mahasiswa terhadap lingkungan fisik dan sosial kampus diukur secara obyektif?',
    benchmark: 'Survei Kepuasan Lingkungan Belajar',
    complianceItems: [
      { id: '4.3.6-1', order: 1, text: 'Hasil survei lingkungan belajar menunjukkan skor kepuasan minimal dalam kategori Baik (>80%).' },
    ],
  },

  // 4.4 Keselamatan Mahasiswa (4.4.1 - 4.4.5)
  {
    id: 'el-4.4.1',
    code: '4.4.1',
    criterionId: 4,
    subCriterionId: 'sub-4.4',
    question: 'Bagaimana kebijakan Keselamatan dan Kesehatan Kerja (K3) kampus diimplementasikan di lingkungan laboratorium dan gedung perkuliahan?',
    benchmark: 'Sistem Manajemen K3 Kampus (SMK3)',
    complianceItems: [
      { id: '4.4.1-1', order: 1, text: 'Tersedianya jalur evakuasi bencana, titik kumpul darurat (assembly point), dan APAR yang siap pakai dan terinspeksi.' },
      { id: '4.4.1-2', order: 2, text: 'SOP keselamatan kerja laboratorium kesehatan lingkungan dan pembuangan limbah B3 medis.' },
    ],
  },
  {
    id: 'el-4.4.2',
    code: '4.4.2',
    criterionId: 4,
    subCriterionId: 'sub-4.4',
    question: 'Bagaimana jaminan keselamatan mahasiswa saat melaksanakan penelitian lapangan atau residensi di daerah terpencil / lahan basah?',
    benchmark: 'Protokol Keselamatan Riset Lapangan Terpencil',
    complianceItems: [
      { id: '4.4.2-1', order: 1, text: 'Pemberian briefing mitigasi risiko kecelakaan transportasi air dan paparan patogen di lahan basah.' },
      { id: '4.4.2-2', order: 2, text: 'Fasilitas asuransi kecelakaan/kesehatan selama penugasan lapangan resmi berlangsung.' },
    ],
  },
  {
    id: 'el-4.4.3',
    code: '4.4.3',
    criterionId: 4,
    subCriterionId: 'sub-4.4',
    question: 'Bagaimana regulasi, satgas, dan mekanisme pelaporan pencegahan dan penanganan kekerasan seksual (PPKS) ditegakkan di lingkungan kampus?',
    benchmark: 'Permendikbudristek PPKS & Satgas Terverifikasi',
    complianceItems: [
      { id: '4.4.3-1', order: 1, text: 'Adanya Satgas PPKS institusi dengan kanal aduan rahasia dan pendampingan korban yang berpihak pada keadilan.' },
      { id: '4.4.3-2', order: 2, text: 'Sosialisasi pencegahan pelecehan seksual dan perundungan dalam forum sivitas akademika.' },
    ],
  },
  {
    id: 'el-4.4.4',
    code: '4.4.4',
    criterionId: 4,
    subCriterionId: 'sub-4.4',
    question: 'Bagaimana layanan pertolongan pertama pada kecelakaan (P3K) dan akses ke klinik kesehatan kampus / rumah sakit mitra dikelola?',
    benchmark: 'Fasilitas Layanan Kesehatan Primer Kampus',
    complianceItems: [
      { id: '4.4.4-1', order: 1, text: 'Klinik Pratama institusi beroperasi melayani sivitas dengan tenaga medis dan obat darurat lengkap.' },
    ],
  },
  {
    id: 'el-4.4.5',
    code: '4.4.5',
    criterionId: 4,
    subCriterionId: 'sub-4.4',
    question: 'Bagaimana evaluasi berkala terhadap insiden keselamatan dan efektivitas tindak lanjut pencegahannya dilaksanakan?',
    benchmark: 'Audit Keselamatan & Laporan Insiden K3',
    complianceItems: [
      { id: '4.4.5-1', order: 1, text: 'Pencatatan nihil insiden fatal (zero fatality) dan reviu tahunan protokol keselamatan institusi.' },
    ],
  },

  // -----------------------------------------------------------------------
  // KRITERIA 5 (5.1.1 - 5.6.4) - 23 Elemen
  // -----------------------------------------------------------------------
  // 5.1 Penetapan Dosen (5.1.1 - 5.1.3)
  {
    id: 'el-5.1.1',
    code: '5.1.1',
    criterionId: 5,
    subCriterionId: 'sub-5.1',
    question: 'Bagaimana kualifikasi akademik dan jabatan fungsional Dosen Tetap Program Studi (DTPS) memenuhi persyaratan program magister (minimal S3 Doktor Kesmas)?',
    benchmark: 'Persyaratan Kualifikasi DTPS Magister SN-Dikti',
    complianceItems: [
      { id: '5.1.1-1', order: 1, text: 'Seluruh DTPS memiliki ijazah Doktor (S3) bidang Kesehatan Masyarakat / bidang serumpun kesehatan.' },
      { id: '5.1.1-2', order: 2, text: 'Sebagian besar DTPS memiliki jabatan fungsional minimal Lektor, Lektor Kepala, atau Guru Besar (Profesor).' },
    ],
  },
  {
    id: 'el-5.1.2',
    code: '5.1.2',
    criterionId: 5,
    subCriterionId: 'sub-5.1',
    question: 'Bagaimana kecukupan jumlah DTPS dan rasio dosen terhadap mahasiswa (rasio ideal 1:10 hingga 1:15 untuk jenjang magister) dipertahankan?',
    benchmark: 'Rasio Dosen-Mahasiswa Magister',
    complianceItems: [
      { id: '5.1.2-1', order: 1, text: 'Jumlah DTPS minimal memenuhi ketentuan regulasi dan mampu mengampu seluruh kompetensi peminatan.' },
      { id: '5.1.2-2', order: 2, text: 'Rasio dosen tetap terhadap mahasiswa aktif berada pada rentang ideal menjamin intensitas bimbingan tesis.' },
    ],
  },
  {
    id: 'el-5.1.3',
    code: '5.1.3',
    criterionId: 5,
    subCriterionId: 'sub-5.1',
    question: 'Bagaimana proses rekrutmen, penempatan, dan retensi dosen magister dilakukan secara transparan dan berbasis meritokrasi?',
    benchmark: 'Sistem Seleksi dan Retensi SDM Unggul',
    complianceItems: [
      { id: '5.1.3-1', order: 1, text: 'Prosedur rekrutmen dosen pascasarjana mengutamakan rekam jejak riset, publikasi internasional, dan reputasi ilmiah.' },
    ],
  },

  // 5.2 Kinerja dan Perilaku Dosen (5.2.1 - 5.2.5)
  {
    id: 'el-5.2.1',
    code: '5.2.1',
    criterionId: 5,
    subCriterionId: 'sub-5.2',
    question: 'Bagaimana ekuivalensi waktu mengajar penuh (EWMP) dan beban kerja dosen (BKD) dialokasikan secara seimbang antara pengajaran, riset, PkM, dan pembimbingan tesis?',
    benchmark: 'Standar EWMP 12-16 SKS per Semester',
    complianceItems: [
      { id: '5.2.1-1', order: 1, text: 'Laporan BKD/LKD seluruh DTPS memenuhi batas aman regulasi (12-16 SKS/semester) dengan kinerja tridarma proporsional.' },
      { id: '5.2.1-2', order: 2, text: 'Alokasi waktu memadai untuk pembimbingan tesis dan pendampingan publikasi artikel mahasiswa.' },
    ],
  },
  {
    id: 'el-5.2.2',
    code: '5.2.2',
    criterionId: 5,
    subCriterionId: 'sub-5.2',
    question: 'Bagaimana evaluasi kinerja dosen oleh mahasiswa (EDOM) dilaksanakan setiap akhir semester dan bagaimana tindak lanjut hasilnya?',
    benchmark: 'Evaluasi Dosen oleh Mahasiswa (EDOM)',
    complianceItems: [
      { id: '5.2.2-1', order: 1, text: 'Pelaksanaan survei EDOM secara online mencakup aspek pedagogik, kedisiplinan mengajar, dan komunikasi ilmiah.' },
      { id: '5.2.2-2', order: 2, text: 'Pemberian apresiasi dosen terbaik serta pembinaan bagi dosen yang skor evaluasinya di bawah rerata fakultas.' },
    ],
  },
  {
    id: 'el-5.2.3',
    code: '5.2.3',
    criterionId: 5,
    subCriterionId: 'sub-5.2',
    question: 'Bagaimana penegakan kode etik akademik, integritas ilmiah dosen, dan kepatuhan terhadap norma Al-Islam Kemuhammadiyahan dikelola?',
    benchmark: 'Kode Etik Dosen & Komisi Etik Institusi',
    complianceItems: [
      { id: '5.2.3-1', order: 1, text: 'Tersedianya buku kode etik dosen institusi dan komisi etik yang menangani potensi benturan kepentingan atau pelanggaran.' },
    ],
  },
  {
    id: 'el-5.2.4',
    code: '5.2.4',
    criterionId: 5,
    subCriterionId: 'sub-5.2',
    question: 'Bagaimana keterlibatan dosen sebagai pakar, penilai/reviewer jurnal, staf ahli kebijakan kesehatan daerah, atau pengurus organisasi profesi (IAKMI)?',
    benchmark: 'Rekognisi Kepakaran Dosen di Ranah Publik',
    complianceItems: [
      { id: '5.2.4-1', order: 1, text: 'Bukti SK penugasan dosen sebagai narasumber kementerian/dinas kesehatan, mitra bestari jurnal terakreditasi, atau pengurus IAKMI.' },
    ],
  },
  {
    id: 'el-5.2.5',
    code: '5.2.5',
    criterionId: 5,
    subCriterionId: 'sub-5.2',
    question: 'Bagaimana sistem penghargaan (reward) dan sanksi (punishment) ditegakkan secara adil untuk memotivasi produktivitas kinerja dosen?',
    benchmark: 'Sistem Reward and Punishment Institusi',
    complianceItems: [
      { id: '5.2.5-1', order: 1, text: 'Pemberian insentif publikasi artikel Scopus Q1-Q4, insentif perolehan paten/HKI, dan bantuan konferensi luar negeri.' },
    ],
  },

  // 5.3 Pengembangan Profesional Dosen (5.3.1 - 5.3.3)
  {
    id: 'el-5.3.1',
    code: '5.3.1',
    criterionId: 5,
    subCriterionId: 'sub-5.3',
    question: 'Bagaimana perencanaan strategis dan realisasi peningkatan jenjang jabatan fungsional dosen menuju Lektor Kepala dan Guru Besar?',
    benchmark: 'Peta Jalan Peningkatan Jabatan Fungsional Dosen',
    complianceItems: [
      { id: '5.3.1-1', order: 1, text: 'Adanya program percepatan Guru Besar (Profesor) bagi dosen Lektor Kepala melalui pendampingan publikasi.' },
    ],
  },
  {
    id: 'el-5.3.2',
    code: '5.3.2',
    criterionId: 5,
    subCriterionId: 'sub-5.3',
    question: 'Bagaimana alokasi dana dan fasilitasi dosen untuk mengikuti pelatihan metodologi mutakhir, sertifikasi kompetensi, dan magang industri/klinis?',
    benchmark: 'Anggaran Pengembangan Kapasitas Dosen',
    complianceItems: [
      { id: '5.3.2-1', order: 1, text: 'Realisasi anggaran tahunan khusus pelatihan analisis epidemiologi mutakhir, biostatistika lanjut, dan sertifikasi K3/AMDAL.' },
    ],
  },
  {
    id: 'el-5.3.3',
    code: '5.3.3',
    criterionId: 5,
    subCriterionId: 'sub-5.3',
    question: 'Bagaimana dosen difasilitasi dalam program sabbatical leave, riset kolaborasi internasional (visiting scholar), dan pertukaran pengajar?',
    benchmark: 'Kolaborasi Riset Internasional Dosen',
    complianceItems: [
      { id: '5.3.3-1', order: 1, text: 'Keikutsertaan DTPS dalam program riset bersama dengan universitas mitra di luar negeri di bidang kesehatan masyarakat.' },
    ],
  },

  // 5.4 Pengembangan Tenaga Kependidikan (5.4.1 - 5.4.4)
  {
    id: 'el-5.4.1',
    code: '5.4.1',
    criterionId: 5,
    subCriterionId: 'sub-5.4',
    question: 'Bagaimana kualifikasi, jumlah, dan penempatan tenaga kependidikan (Tendik administrasi akademik, pustakawan, laboran, dan teknisi IT) mendukung program pascasarjana?',
    benchmark: 'Kualifikasi Tendik Berpendidikan Minimal D3/S1',
    complianceItems: [
      { id: '5.4.1-1', order: 1, text: 'Kecukupan staf administrasi berpendidikan S1/D3 dengan keahlian pengoperasian sistem informasi akademik dan e-office.' },
      { id: '5.4.1-2', order: 2, text: 'Ketersediaan pustakawan bersertifikasi dan laboran terlatih K3 laboratorium kesehatan.' },
    ],
  },
  {
    id: 'el-5.4.2',
    code: '5.4.2',
    criterionId: 5,
    subCriterionId: 'sub-5.4',
    question: 'Bagaimana program pelatihan, sertifikasi keahlian, dan studi lanjut bagi tenaga kependidikan direncanakan dan direalisasikan?',
    benchmark: 'Pelatihan Kompetensi Berkelanjutan Tendik',
    complianceItems: [
      { id: '5.4.2-1', order: 1, text: 'Realisasi keikutsertaan tendik dalam workshop pelayanan prima (service excellence), manajemen arsip, dan keamanan siber.' },
    ],
  },
  {
    id: 'el-5.4.3',
    code: '5.4.3',
    criterionId: 5,
    subCriterionId: 'sub-5.4',
    question: 'Bagaimana sistem penilaian kinerja, kenaikan pangkat, dan kesejahteraan tenaga kependidikan dikelola?',
    benchmark: 'Sistem Kinerja & Kesejahteraan Tendik',
    complianceItems: [
      { id: '5.4.3-1', order: 1, text: 'Penilaian SKP tahunan yang objektif, transparan, dan terkait dengan tunjangan kinerja.' },
    ],
  },
  {
    id: 'el-5.4.4',
    code: '5.4.4',
    criterionId: 5,
    subCriterionId: 'sub-5.4',
    question: 'Bagaimana kepuasan dosen dan mahasiswa terhadap kualitas layanan administratif tenaga kependidikan diukur dan ditingkatkan?',
    benchmark: 'Survei Kepuasan Layanan Tendik',
    complianceItems: [
      { id: '5.4.4-1', order: 1, text: 'Tingkat kepuasan layanan administratif mencapai kategori sangat memuaskan (>85%).' },
    ],
  },

  // 5.5 Penelitian (5.5.1 - 5.5.4)
  {
    id: 'el-5.5.1',
    code: '5.5.1',
    criterionId: 5,
    subCriterionId: 'sub-5.5',
    question: 'Bagaimana peta jalan (roadmap) penelitian program studi memandu tema riset dosen dan mahasiswa magister pada fokus unggulan kesehatan lahan basah tropis?',
    benchmark: 'Roadmap Riset Kesmas Lahan Basah Tropis',
    complianceItems: [
      { id: '5.5.1-1', order: 1, text: 'Dokumen peta jalan riset memuat payung penelitian yang jelas dan menjadi rujukan topik tesis mahasiswa.' },
      { id: '5.5.1-2', order: 2, text: 'Kesesuaian minimal 80% judul penelitian dosen dan tesis mahasiswa dengan tema peta jalan unggulan.' },
    ],
  },
  {
    id: 'el-5.5.2',
    code: '5.5.2',
    criterionId: 5,
    subCriterionId: 'sub-5.5',
    question: 'Bagaimana perolehan pendanaan hibah penelitian (hibah kompetitif nasional Kemendikbudristek/BRIN, hibah institusi, dan hibah kerja sama industri/internasional)?',
    benchmark: 'Produktivitas Perolehan Hibah Penelitian',
    complianceItems: [
      { id: '5.5.2-1', order: 1, text: 'Rerata jumlah dana penelitian dosen per tahun mencapai standar unggul (> Rp 25 juta/dosen/tahun).' },
      { id: '5.5.2-2', order: 2, text: 'Keberhasilan memenangkan hibah penelitian terapan tingkat nasional dan kolaborasi internasional.' },
    ],
  },
  {
    id: 'el-5.5.3',
    code: '5.5.3',
    criterionId: 5,
    subCriterionId: 'sub-5.5',
    question: 'Bagaimana produktivitas dan kualitas publikasi hasil penelitian dosen bersama mahasiswa pada jurnal internasional bereputasi (Scopus/WoS) dan jurnal nasional terakreditasi SINTA?',
    benchmark: 'Luaran Publikasi Bereputasi Dosen-Mahasiswa',
    complianceItems: [
      { id: '5.5.3-1', order: 1, text: 'Jumlah publikasi DTPS bersama mahasiswa pada jurnal Scopus/WoS minimal 1 artikel per dosen per tahun.' },
      { id: '5.5.3-2', order: 2, text: 'Rasio sitasi karya ilmiah dosen menunjukkan rekognisi tinggi dalam komunitas ilmu kesehatan masyarakat.' },
    ],
  },
  {
    id: 'el-5.5.4',
    code: '5.5.4',
    criterionId: 5,
    subCriterionId: 'sub-5.5',
    question: 'Bagaimana perolehan Hak Kekayaan Intelektual (Hak Cipta, Paten, Desain Industri) atau naskah rekomendasi kebijakan (Policy Brief) yang dihasilkan dari riset?',
    benchmark: 'Paten, HKI & Policy Brief untuk Pemda',
    complianceItems: [
      { id: '5.5.4-1', order: 1, text: 'Pencatatan sertifikat Hak Cipta modul, buku ajar, instrumen survei kesmas, atau paten teknologi kesehatan.' },
      { id: '5.5.4-2', order: 2, text: 'Penyerahan naskah policy brief kepada Dinas Kesehatan Provinsi/Kabupaten sebagai rujukan regulasi daerah.' },
    ],
  },

  // 5.6 Pengabdian kepada Masyarakat (5.6.1 - 5.6.4)
  {
    id: 'el-5.6.1',
    code: '5.6.1',
    criterionId: 5,
    subCriterionId: 'sub-5.6',
    question: 'Bagaimana peta jalan (roadmap) Pengabdian kepada Masyarakat (PkM) dirancang untuk memecahkan masalah kesehatan masyarakat nyata di Kalimantan Barat?',
    benchmark: 'Roadmap PkM Komunitas & Pemberdayaan',
    complianceItems: [
      { id: '5.6.1-1', order: 1, text: 'Tema PkM fokus pada penanggulangan stunting, sanitasi total berbasis masyarakat di tepi sungai, dan pencegahan DBD/Malaria.' },
      { id: '5.6.1-2', order: 2, text: 'Integrasi keahlian dosen peminatan AKK, Epidemiologi, K3, dan Promkes dalam desa binaan.' },
    ],
  },
  {
    id: 'el-5.6.2',
    code: '5.6.2',
    criterionId: 5,
    subCriterionId: 'sub-5.6',
    question: 'Bagaimana pelibatan mahasiswa magister dalam kegiatan PkM dosen sebagai bagian dari pengalaman advokasi kesehatan masyarakat?',
    benchmark: 'Keterlibatan Mahasiswa Pascasarjana dalam PkM',
    complianceItems: [
      { id: '5.6.2-1', order: 1, text: 'Setiap kegiatan PkM dosen melibatkan minimal 2 mahasiswa magister dalam peran fasilitator/evaluator.' },
    ],
  },
  {
    id: 'el-5.6.3',
    code: '5.6.3',
    criterionId: 5,
    subCriterionId: 'sub-5.6',
    question: 'Bagaimana perolehan dana PkM dari sumber internal institusi, Kemendikbudristek, pemerintah daerah, dan dana CSR perusahaan?',
    benchmark: 'Pendanaan PkM Berkelanjutan',
    complianceItems: [
      { id: '5.6.3-1', order: 1, text: 'Tersedianya pendanaan rutin PkM mandiri institusi dan perolehan hibah kemitraan eksternal.' },
    ],
  },
  {
    id: 'el-5.6.4',
    code: '5.6.4',
    criterionId: 5,
    subCriterionId: 'sub-5.6',
    question: 'Bagaimana luaran kegiatan PkM (publikasi jurnal pengabdian, artikel media massa, video edukasi, dan modul kader) dimanfaatkan masyarakat?',
    benchmark: 'Luaran Nyata & Dampak Sosial PkM',
    complianceItems: [
      { id: '5.6.4-1', order: 1, text: 'Publikasi artikel PkM pada jurnal terakreditasi SINTA dan penyebarluasan media KIE di puskesmas/posyandu.' },
    ],
  },

  // -----------------------------------------------------------------------
  // KRITERIA 6 (6.1.1 - 6.3.4) - 10 Elemen
  // -----------------------------------------------------------------------
  // 6.1 Fasilitas Fisik (6.1.1 - 6.1.2)
  {
    id: 'el-6.1.1',
    code: '6.1.1',
    criterionId: 6,
    subCriterionId: 'sub-6.1',
    question: 'Bagaimana kecukupan, aksesibilitas, dan kualitas ruang perkuliahan, ruang seminar, ruang dosen, dan ruang administrasi pascasarjana?',
    benchmark: 'Standar Sarana Fisik Pendidikan Pascasarjana',
    complianceItems: [
      { id: '6.1.1-1', order: 1, text: 'Ketersediaan ruang kuliah representatif dilengkapi proyektor LCD, pendingin ruangan (AC), dan furnitur ergonomis.' },
      { id: '6.1.1-2', order: 2, text: 'Ruang sidang tesis khusus dengan sarana presentasi multimedia terstandar.' },
    ],
  },
  {
    id: 'el-6.1.2',
    code: '6.1.2',
    criterionId: 6,
    subCriterionId: 'sub-6.1',
    question: 'Bagaimana ketersediaan, pemeliharaan, dan keselamatan laboratorium kesehatan masyarakat (Laboratorium Kesehatan Lingkungan, K3, Epidemiologi & Komputasi Statistik)?',
    benchmark: 'Standar Laboratorium Kesehatan Masyarakat Terakreditasi',
    complianceItems: [
      { id: '6.1.2-1', order: 1, text: 'Peralatan ukur kualitas air, udara, kebisingan, ergonomi kerja, dan kit pemeriksaan spesimen lapangan lengkap.' },
      { id: '6.1.2-2', order: 2, text: 'Jadwal kalibrasi alat laboratorium teratur dan catatan pemeliharaan preventif.' },
    ],
  },

  // 6.2 Sumber Informasi (6.2.1 - 6.2.4)
  {
    id: 'el-6.2.1',
    code: '6.2.1',
    criterionId: 6,
    subCriterionId: 'sub-6.2',
    question: 'Bagaimana ketersediaan koleksi kepustakaan cetak (buku teks kesmas mutakhir, referensi monograf) dan jam layanan perpustakaan?',
    benchmark: 'Standar Koleksi Perpustakaan Magister',
    complianceItems: [
      { id: '6.2.1-1', order: 1, text: 'Jumlah judul buku teks kesehatan masyarakat edisi terbaru (> 200 judul relevan per peminatan).' },
    ],
  },
  {
    id: 'el-6.2.2',
    code: '6.2.2',
    criterionId: 6,
    subCriterionId: 'sub-6.2',
    question: 'Bagaimana aksesibilitas langganan pangkalan data jurnal ilmiah internasional bereputasi (ScienceDirect, SpringerLink, ProQuest, PubMed)?',
    benchmark: 'Langganan Database E-Journal Internasional',
    complianceItems: [
      { id: '6.2.2-1', order: 1, text: 'Bukti sah langganan institusi terhadap jurnal internasional bereputasi yang dapat diakses daring dari rumah oleh mahasiswa.' },
    ],
  },
  {
    id: 'el-6.2.3',
    code: '6.2.3',
    criterionId: 6,
    subCriterionId: 'sub-6.2',
    question: 'Bagaimana ketersediaan lisensi perangkat lunak pengolah data statistik (SPSS, Stata, Epi-Info, NVivo, ArcGIS/QGIS) bagi mahasiswa?',
    benchmark: 'Legalitas Software Pengolahan Data Riset',
    complianceItems: [
      { id: '6.2.3-1', order: 1, text: 'Ketersediaan laboratorium komputer dengan software statistik legal berlisensi institusi untuk praktik analisis mahasiswa.' },
    ],
  },
  {
    id: 'el-6.2.4',
    code: '6.2.4',
    criterionId: 6,
    subCriterionId: 'sub-6.2',
    question: 'Bagaimana repositori digital institusi (e-theses) mengelola keterbukaan naskah karya ilmiah tesis dengan tetap mematuhi hak cipta?',
    benchmark: 'Repositori Digital Terindeks & Hak Cipta',
    complianceItems: [
      { id: '6.2.4-1', order: 1, text: 'Repositori institusi terintegrasi dengan RAMA Kemendikbudristek dan perpustakaan nasional.' },
    ],
  },

  // 6.3 Sumber Daya Keuangan (6.3.1 - 6.3.4)
  {
    id: 'el-6.3.1',
    code: '6.3.1',
    criterionId: 6,
    subCriterionId: 'sub-6.3',
    question: 'Bagaimana proses perencanaan dan pengalokasian anggaran operasional pendidikan program studi magister dalam Rencana Kerja Anggaran Tahunan (RKAT)?',
    benchmark: 'Tata Kelola Anggaran Berkelanjutan',
    complianceItems: [
      { id: '6.3.1-1', order: 1, text: 'Dokumen RKAT disusun partisipatif bersama kaprodi dan disetujui badan pelaksana harian (BPH) / senat.' },
    ],
  },
  {
    id: 'el-6.3.2',
    code: '6.3.2',
    criterionId: 6,
    subCriterionId: 'sub-6.3',
    question: 'Bagaimana realisasi anggaran per mahasiswa per tahun untuk operasional pembelajaran, riset, dan pengabdian masyarakat memenuhi standar kelayakan?',
    benchmark: 'Rerata Biaya Operasional per Mahasiswa (Unit Cost)',
    complianceItems: [
      { id: '6.3.2-1', order: 1, text: 'Alokasi operasional pendidikan per mahasiswa magister mencukupi kebutuhan riset laboratorium dan praktikum lapang.' },
    ],
  },
  {
    id: 'el-6.3.3',
    code: '6.3.3',
    criterionId: 6,
    subCriterionId: 'sub-6.3',
    question: 'Bagaimana transparansi, akuntabilitas, dan pelaksanaan audit keuangan internal (SPI) serta audit eksternal (Kantor Akuntan Publik) dilaksanakan?',
    benchmark: 'Audit Keuangan Opini Wajar Tanpa Pengecualian (WTP)',
    complianceItems: [
      { id: '6.3.3-1', order: 1, text: 'Laporan keuangan teraudit secara berkala dengan perolehan opini Wajar Tanpa Pengecualian (WTP).' },
    ],
  },
  {
    id: 'el-6.3.4',
    code: '6.3.4',
    criterionId: 6,
    subCriterionId: 'sub-6.3',
    question: 'Bagaimana upaya diversifikasi sumber penerimaan dana selain uang kuliah mahasiswa (revenue-generating activities, kerja sama pelatihan kesehatan, konsultansi)?',
    benchmark: 'Diversifikasi Sumber Pendapatan (Non-Tuition Revenue)',
    complianceItems: [
      { id: '6.3.4-1', order: 1, text: 'Perolehan dana dari jasa konsultasi penyusunan dokumen Analisis Mengenai Dampak Lingkungan (AMDAL), pelatihan K3 rumah sakit, dan kerja sama dinas.' },
    ],
  },

  // -----------------------------------------------------------------------
  // KRITERIA 7 (7.1.1 - 7.1.5) - 5 Elemen
  // -----------------------------------------------------------------------
  // 7.1 Sistem Penjaminan Mutu (7.1.1 - 7.1.5)
  {
    id: 'el-7.1.1',
    code: '7.1.1',
    criterionId: 7,
    subCriterionId: 'sub-7.1',
    question: 'Bagaimana keberadaan, struktur organisasi, dan independensi organ penjaminan mutu di tingkat UPPS (Unit Penjaminan Mutu) dan Program Studi (Gugus Kendali Mutu)?',
    benchmark: 'Keberadaan Organ Penjaminan Mutu Formal',
    complianceItems: [
      { id: '7.1.1-1', order: 1, text: 'Tersedianya SK penetapan organ penjaminan mutu dengan tupoksi yang jelas dan terpisah dari pengelola program studi.' },
      { id: '7.1.1-2', order: 2, text: 'Ketersediaan personil auditor mutu internal bersertifikat kompetensi nasional.' },
    ],
  },
  {
    id: 'el-7.1.2',
    code: '7.1.2',
    criterionId: 7,
    subCriterionId: 'sub-7.1',
    question: 'Bagaimana ketersediaan dokumen Sistem Penjaminan Mutu Internal (Kebijakan SPMI, Manual SPMI, Standar SPMI, dan Formulir SPMI) yang melampaui SN-Dikti?',
    benchmark: 'Kelengkapan 4 Buku Dokumen SPMI Siklus PPEPP',
    complianceItems: [
      { id: '7.1.2-1', order: 1, text: 'Tersedianya 4 buku dokumen SPMI mutakhir yang disahkan pimpinan universitas.' },
      { id: '7.1.2-2', order: 2, text: 'Penetapan Standar Pendidikan Tinggi Tambahan (standar kekhasan kemuhammadiyahan dan kesehatan lahan basah tropis).' },
    ],
  },
  {
    id: 'el-7.1.3',
    code: '7.1.3',
    criterionId: 7,
    subCriterionId: 'sub-7.1',
    question: 'Bagaimana keterlaksanaan siklus PPEPP (Penetapan, Pelaksanaan, Evaluasi, Pengendalian, dan Peningkatan) dijalankan secara konsisten pada semua standar tridarma?',
    benchmark: 'Siklus Utuh PPEPP Penjaminan Mutu',
    complianceItems: [
      { id: '7.1.3-1', order: 1, text: 'Bukti pelaksanaan Audit Mutu Internal (AMI) tahunan pada seluruh komponen tridarma di tingkat program studi.' },
      { id: '7.1.3-2', order: 2, text: 'Dokumentasi temuan ketidaksesuaian (KTS) dan rencana tindakan koreksi terverifikasi.' },
    ],
  },
  {
    id: 'el-7.1.4',
    code: '7.1.4',
    criterionId: 7,
    subCriterionId: 'sub-7.1',
    question: 'Bagaimana pelaksanaan Rapat Tinjauan Manajemen (RTM) menindaklanjuti temuan audit mutu dan merumuskan langkah pengendalian?',
    benchmark: 'Pelaksanaan RTM & Tindakan Pengendalian',
    complianceItems: [
      { id: '7.1.4-1', order: 1, text: 'Risalah dan notula resmi RTM pimpinan UPPS yang menghasilkan keputusan strategis peningkatan mutu.' },
    ],
  },
  {
    id: 'el-7.1.5',
    code: '7.1.5',
    criterionId: 7,
    subCriterionId: 'sub-7.1',
    question: 'Bagaimana bukti nyata peningkatan mutu berkelanjutan (continuous quality improvement / benchmarking) tercermin pada capaian indikator kinerja program studi?',
    benchmark: 'Peningkatan Standar Mutu (Continuous Quality Improvement)',
    complianceItems: [
      { id: '7.1.5-1', order: 1, text: 'Adanya penaikan target standar SPMI pada siklus berikutnya setelah target lama terlampaui.' },
      { id: '7.1.5-2', order: 2, text: 'Pelaksanaan benchmarking mutu dengan program studi magister kesehatan masyarakat berakreditasi Unggul di dalam/luar negeri.' },
    ],
  },

  // -----------------------------------------------------------------------
  // KRITERIA 8 (8.1.1 - 8.3.3) - 11 Elemen
  // -----------------------------------------------------------------------
  // 8.1 Tata Kelola (8.1.1 - 8.1.5)
  {
    id: 'el-8.1.1',
    code: '8.1.1',
    criterionId: 8,
    subCriterionId: 'sub-8.1',
    question: 'Bagaimana struktur organisasi UPPS dan Program Studi menjamin kejelasan hierarki, pembagian wewenang, dan efektivitas koordinasi operasional?',
    benchmark: 'SOTK & Kejelasan Tupoksi Pengelola',
    complianceItems: [
      { id: '8.1.1-1', order: 1, text: 'Bagan struktur organisasi formal dilengkapi dengan deskripsi tugas pokok dan fungsi (Tupoksi) tertulis bagi seluruh pejabat.' },
    ],
  },
  {
    id: 'el-8.1.2',
    code: '8.1.2',
    criterionId: 8,
    subCriterionId: 'sub-8.1',
    question: 'Bagaimana prinsip-prinsip Good University Governance (Kredibilitas, Transparansi, Akuntabilitas, Tanggung Jawab, dan Berkeadilan) diterapkan dalam kepemimpinan?',
    benchmark: 'Good University Governance (GUG)',
    complianceItems: [
      { id: '8.1.2-1', order: 1, text: 'Transparansi dalam pengambilan keputusan akademik, pengusulan beasiswa, dan penunjukan pembimbing tesis.' },
      { id: '8.1.2-2', order: 2, text: 'Pertanggungjawaban kinerja pimpinan prodi dalam forum rapat tahunan senat fakultas.' },
    ],
  },
  {
    id: 'el-8.1.3',
    code: '8.1.3',
    criterionId: 8,
    subCriterionId: 'sub-8.1',
    question: 'Bagaimana kepemimpinan publik (public health leadership) dan manajerial ketua program studi mengarahkan program studi mencapai keunggulan daya saing?',
    benchmark: 'Kepemimpinan Visioner & Transformasional',
    complianceItems: [
      { id: '8.1.3-1', order: 1, text: 'Kepemimpinan proaktif merespons peluang kerja sama, pendanaan hibah, dan advokasi kebijakan publik regional.' },
    ],
  },
  {
    id: 'el-8.1.4',
    code: '8.1.4',
    criterionId: 8,
    subCriterionId: 'sub-8.1',
    // Catatan khusus dokumen: Pada elemen 8.1.4 ada penomoran salah ("2." sebagai ganti bullet). Perlakukan sebagai satu butir pemenuhan.
    question: 'Bagaimana keberlanjutan (sustainability) program studi dijamin melalui perencanaan suksesi kepemimpinan, regenerasi dosen, dan rencana penjaminan mutu finansial jangka panjang?',
    benchmark: 'Keberlanjutan & Rencana Suksesi Kepemimpinan',
    complianceItems: [
      { id: '8.1.4-1', order: 1, text: 'Rencana suksesi kepemimpinan akademik dan kaderisasi dosen muda untuk studi lanjut doktoral terencana secara berkesinambungan.' },
    ],
  },
  {
    id: 'el-8.1.5',
    code: '8.1.5',
    criterionId: 8,
    subCriterionId: 'sub-8.1',
    question: 'Bagaimana kerja sama tridarma perguruan tinggi (MoU, MoA, IA) dibangun dengan dinas kesehatan, rumah sakit, universitas luar negeri, dan asosiasi profesi?',
    benchmark: 'Realisasi Kemitraan Strategis Tridarma',
    complianceItems: [
      { id: '8.1.5-1', order: 1, text: 'Keberadaan perjanjian kerja sama resmi (MoA) yang aktif dan memiliki implementasi nyata (Implementation Arrangement).' },
      { id: '8.1.5-2', order: 2, text: 'Evaluasi kepuasan mitra kerja sama terhadap dampak kolaborasi dalam peningkatan mutu pelayanan kesehatan masyarakat.' },
    ],
  },

  // 8.2 Keterlibatan Mahasiswa dan Dosen (8.2.1 - 8.2.3)
  {
    id: 'el-8.2.1',
    code: '8.2.1',
    criterionId: 8,
    subCriterionId: 'sub-8.2',
    question: 'Bagaimana perwakilan mahasiswa dan dosen dilibatkan secara formal dalam forum rapat pertimbangan kebijakan akademik dan kurikulum prodi?',
    benchmark: 'Partisipasi Sivitas Akademika dalam Tata Kelola',
    complianceItems: [
      { id: '8.2.1-1', order: 1, text: 'Undangan dan notula kehadiran perwakilan himpunan mahasiswa magister dalam lokakarya peninjauan kurikulum dan tata tertib.' },
    ],
  },
  {
    id: 'el-8.2.2',
    code: '8.2.2',
    criterionId: 8,
    subCriterionId: 'sub-8.2',
    question: 'Bagaimana kanal penyampaian aspirasi, saran, dan pengaduan sivitas akademika disediakan dan direspons secara cepat oleh pimpinan?',
    benchmark: 'Kanal Aduan & Respon Aspirasi Cepat (Whistleblowing/Feedback)',
    complianceItems: [
      { id: '8.2.2-1', order: 1, text: 'Ketersediaan kotak saran fisik, form pengaduan online, serta rekam jejak tindak lanjut respons maksimal 7 hari kerja.' },
    ],
  },
  {
    id: 'el-8.2.3',
    code: '8.2.3',
    criterionId: 8,
    subCriterionId: 'sub-8.2',
    question: 'Bagaimana iklim kebebasan akademik, kebebasan mimbar akademik, dan otonomi keilmuan dilindungi oleh pimpinan fakultas?',
    benchmark: 'Perlindungan Kebebasan Akademik & Mimbar Ilmiah',
    complianceItems: [
      { id: '8.2.3-1', order: 1, text: 'Regulasi perlindungan hak dosen dan mahasiswa dalam menyuarakan hasil kajian ilmiah tanpa intimidasi pihak manapun.' },
    ],
  },

  // 8.3 Administrasi (8.3.1 - 8.3.3)
  {
    id: 'el-8.3.1',
    code: '8.3.1',
    criterionId: 8,
    subCriterionId: 'sub-8.3',
    question: 'Bagaimana integrasi sistem informasi manajemen (SIAKAD, e-office, SIM Kepegawaian, SIM Riset/PkM, SIM Perpustakaan) mendukung efisiensi tata kelola administrasi?',
    benchmark: 'Sistem Informasi Manajemen Terintegrasi (Enterprise Campus System)',
    complianceItems: [
      { id: '8.3.1-1', order: 1, text: 'Seluruh proses pendaftaran, KRS, penilaian, pengajuan proposal tesis, dan wisuda terlayani dalam satu portal terpadu.' },
      { id: '8.3.1-2', order: 2, text: 'Ketersediaan cadangan data (backup rutin) dan protokol keamanan data pribadi mahasiswa dari kebocoran siber.' },
    ],
  },
  {
    id: 'el-8.3.2',
    code: '8.3.2',
    criterionId: 8,
    subCriterionId: 'sub-8.3',
    question: 'Bagaimana standar operasional prosedur (SOP) persuratan, legalisir ijazah digital, transkrip, dan surat keterangan pendamping ijazah (SKPI) diterapkan?',
    benchmark: 'SOP Layanan Administrasi Terstandarisasi',
    complianceItems: [
      { id: '8.3.2-1', order: 1, text: 'Ketersediaan buku panduan SOP layanan administratif dengan standar waktu penyelesaian layanan yang terukur.' },
      { id: '8.3.2-2', order: 2, text: 'Penerbitan SKPI berbahasa Indonesia dan Inggris berstandar internasional sesuai Permendikbudristek.' },
    ],
  },
  {
    id: 'el-8.3.3',
    code: '8.3.3',
    criterionId: 8,
    subCriterionId: 'sub-8.3',
    question: 'Bagaimana evaluasi berkala terhadap efisiensi dan kepuasan pemangku kepentingan terhadap seluruh layanan administrasi perkantoran UPPS dilakukan?',
    benchmark: 'Survei Kepuasan Layanan Tata Kelola Administrasi',
    complianceItems: [
      { id: '8.3.3-1', order: 1, text: 'Hasil indeks kepuasan masyarakat (IKM) terhadap layanan administrasi berada dalam kategori minimal Sangat Baik (skor > 85).' },
    ],
  },
];

// =========================================================================
// DEFAULT SEED BUKTI DIGITAL REALISTIS & TAUTAN GOOGLE DRIVE
// =========================================================================

export const DEFAULT_LAMPTKES_EVIDENCES: DigitalEvidenceItem[] = [
  {
    id: 'ev-01',
    code: 'BUKTI-K1-01',
    title: 'SK Rektor & Dokumen Renstra UPPS 2024-2028',
    criterionId: 1,
    elementCode: '1.1.1',
    fileType: 'SK/Kebijakan',
    cloudProvider: 'Google Drive',
    cloudUrl: 'https://drive.google.com/drive/folders/1gviyTRdU96dgYbFBlOQkPeFWfeQvP0Ab?usp=sharing',
    fileSize: '4.8 MB',
    uploadDate: '2025-01-15',
    uploader: 'Dr. Rochmawati, S.KM., M.Kes.',
    verified: true,
  },
  {
    id: 'ev-02',
    code: 'BUKTI-K1-02',
    title: 'Notula & Berita Acara Lokakarya VMTS Bersama Dinas Kesehatan',
    criterionId: 1,
    elementCode: '1.1.2',
    fileType: 'Laporan Kinerja',
    cloudProvider: 'Google Drive',
    cloudUrl: 'https://drive.google.com/drive/folders/1gviyTRdU96dgYbFBlOQkPeFWfeQvP0Ab?usp=sharing',
    fileSize: '2.1 MB',
    uploadDate: '2025-01-20',
    uploader: 'Admin Tim Akreditasi',
    verified: true,
  },
  {
    id: 'ev-03',
    code: 'BUKTI-K2-01',
    title: 'Buku Kurikulum S2 MKM Berbasis OBE & KKNI Level 8',
    criterionId: 2,
    elementCode: '2.1.1',
    fileType: 'Dokumen Kurikulum',
    cloudProvider: 'Google Drive',
    cloudUrl: 'https://drive.google.com/drive/folders/1gviyTRdU96dgYbFBlOQkPeFWfeQvP0Ab?usp=sharing',
    fileSize: '12.4 MB',
    uploadDate: '2025-02-05',
    uploader: 'Kaprodi S2 MKM',
    verified: true,
  },
  {
    id: 'ev-04',
    code: 'BUKTI-K2-02',
    title: 'Kompilasi RPS Lengkap Mata Kuliah Peminatan AKK & Epidemiologi',
    criterionId: 2,
    elementCode: '2.2.1',
    fileType: 'Dokumen Kurikulum',
    cloudProvider: 'Google Drive',
    cloudUrl: 'https://drive.google.com/drive/folders/1gviyTRdU96dgYbFBlOQkPeFWfeQvP0Ab?usp=sharing',
    fileSize: '8.6 MB',
    uploadDate: '2025-02-10',
    uploader: 'Gugus Kendali Mutu',
    verified: true,
  },
  {
    id: 'ev-05',
    code: 'BUKTI-K3-01',
    title: 'Buku Pedoman Ujian Tesis & Rubrik Penilaian Holistik',
    criterionId: 3,
    elementCode: '3.3.2',
    fileType: 'Pedoman/SOP',
    cloudProvider: 'Google Drive',
    cloudUrl: 'https://drive.google.com/drive/folders/1gviyTRdU96dgYbFBlOQkPeFWfeQvP0Ab?usp=sharing',
    fileSize: '3.3 MB',
    uploadDate: '2025-02-15',
    uploader: 'Bagian Akademik',
    verified: true,
  },
  {
    id: 'ev-06',
    code: 'BUKTI-K4-01',
    title: 'Pedoman PMB Pascasarjana & Silabus Matrikulasi Mahasiswa Non-Kesmas',
    criterionId: 4,
    elementCode: '4.1.4',
    fileType: 'Pedoman/SOP',
    cloudProvider: 'Google Drive',
    cloudUrl: 'https://drive.google.com/drive/folders/1gviyTRdU96dgYbFBlOQkPeFWfeQvP0Ab?usp=sharing',
    fileSize: '1.9 MB',
    uploadDate: '2025-03-01',
    uploader: 'Panitia PMB',
    verified: true,
  },
  {
    id: 'ev-07',
    code: 'BUKTI-K5-01',
    title: 'Rekapitulasi DTPS Bergelar Doktor (S3) & Publikasi Scopus DTPS',
    criterionId: 5,
    elementCode: '5.1.1',
    fileType: 'Laporan Kinerja',
    cloudProvider: 'Google Drive',
    cloudUrl: 'https://drive.google.com/drive/folders/1gviyTRdU96dgYbFBlOQkPeFWfeQvP0Ab?usp=sharing',
    fileSize: '5.2 MB',
    uploadDate: '2025-03-10',
    uploader: 'Dr. Rochmawati, S.KM., M.Kes.',
    verified: true,
  },
  {
    id: 'ev-08',
    code: 'BUKTI-K5-02',
    title: 'Peta Jalan Riset Unggulan Wilayah Lahan Basah Tropis 2024-2028',
    criterionId: 5,
    elementCode: '5.5.1',
    fileType: 'Laporan Kinerja',
    cloudProvider: 'Google Drive',
    cloudUrl: 'https://drive.google.com/drive/folders/1gviyTRdU96dgYbFBlOQkPeFWfeQvP0Ab?usp=sharing',
    fileSize: '4.1 MB',
    uploadDate: '2025-03-12',
    uploader: 'LPPM UM Pontianak',
    verified: true,
  },
  {
    id: 'ev-09',
    code: 'BUKTI-K6-01',
    title: 'Laporan Audit Keuangan Opini WTP & Inventaris Lab Kesmas',
    criterionId: 6,
    elementCode: '6.3.3',
    fileType: 'Laporan Kinerja',
    cloudProvider: 'Google Drive',
    cloudUrl: 'https://drive.google.com/drive/folders/1gviyTRdU96dgYbFBlOQkPeFWfeQvP0Ab?usp=sharing',
    fileSize: '7.8 MB',
    uploadDate: '2025-03-20',
    uploader: 'Bagian Keuangan & Sarpras',
    verified: true,
  },
  {
    id: 'ev-10',
    code: 'BUKTI-K7-01',
    title: 'Laporan Audit Mutu Internal (AMI) & Notula Rapat Tinjauan Manajemen (RTM)',
    criterionId: 7,
    elementCode: '7.1.3',
    fileType: 'Dokumen Mutu',
    cloudProvider: 'Google Drive',
    cloudUrl: 'https://drive.google.com/drive/folders/1gviyTRdU96dgYbFBlOQkPeFWfeQvP0Ab?usp=sharing',
    fileSize: '6.5 MB',
    uploadDate: '2025-03-25',
    uploader: 'Unit Penjaminan Mutu (UPM)',
    verified: true,
  },
  {
    id: 'ev-11',
    code: 'BUKTI-K8-01',
    title: 'Naskah MoA Aktif dengan Dinas Kesehatan Provinsi Kalimantan Barat & RS Mitra',
    criterionId: 8,
    elementCode: '8.1.5',
    fileType: 'MoU/MoA',
    cloudProvider: 'Google Drive',
    cloudUrl: 'https://drive.google.com/drive/folders/1gviyTRdU96dgYbFBlOQkPeFWfeQvP0Ab?usp=sharing',
    fileSize: '3.7 MB',
    uploadDate: '2025-04-01',
    uploader: 'Unit Kerja Sama Institusi',
    verified: true,
  },
];
