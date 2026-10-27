export interface Peminatan {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  description: string;
  careerProspects: string[];
  coreSubjects: string[];
  thesisTopics: string[];
  iconName: string;
}

export interface SemesterCourse {
  code: string;
  name: string;
  sks: number;
  category: 'Wajib' | 'Peminatan' | 'Tesis';
}

export interface SemesterInfo {
  semester: number;
  title: string;
  totalSks: number;
  description: string;
  courses: SemesterCourse[];
}

export interface Lecturer {
  id: string;
  name: string;
  title: string;
  specialty: string;
  education: string;
  scopusArticles: number;
  featuredRole: string;
}

export interface Testimonial {
  name: string;
  role: string;
  agency: string;
  batch: string;
  quote: string;
  avatarInitial: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: 'Pendaftaran' | 'Perkuliahan' | 'Biaya' | 'Tesis';
}

export interface AcademicLink {
  id: string;
  title: string;
  category: 'kelas_online' | 'tesis' | 'akademik' | 'referensi' | 'keuangan';
  targetAudience: 'all' | 'dosen' | 'mahasiswa';
  url: string;
  description: string;
  badge: string;
  iconName: string;
}

export interface PortalMenuItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: 'Akademik' | 'Pembelajaran' | 'Mutu' | 'Administrasi' | 'Keuangan' | string;
  icon: string; // Emoji icon e.g. 🎓, 📝, 🎬, 📊, ✉️, 🏛️
  order: number;
  active: boolean;
  targetAudience: 'Semua' | 'Mahasiswa' | 'Dosen';
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  isImportant: boolean;
  target: 'Semua' | 'Mahasiswa' | 'Dosen';
  authorName: string;
  authorRole: 'Admin' | 'Dosen';
  createdAt: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  content: string;
  dateTime: string;
  target: 'Semua' | 'Mahasiswa' | 'Dosen' | 'Saya';
  authorName: string;
  authorRole: 'Admin' | 'Dosen' | 'Mahasiswa';
}

export interface ApplicantRecord {
  id: string;
  registrationNumber: string;
  fullName: string;
  whatsapp: string;
  email: string;
  s1Major: string;
  s1Campus: string;
  currentJob: string;
  peminatan: string;
  category: string;
  notes: string;
  status: 'Menunggu Verifikasi' | 'Lolos Berkas' | 'Jadwal Wawancara' | 'Diterima';
  registeredAt: string;
}

export interface SiteSettings {
  heroKicker: string;
  heroHeadline: string;
  heroSubheadline: string;
  announcementText: string;
  pmbBatchName: string;
  pmbBatchDeadline: string;
  baseSppPerSemester: number;
  baseDevelopmentFee: number;
  matriculationFee: number;
  registrationFee: number;
  alumniDiscount: number;
  partnerDiscount: number;
  thesisExamFee: number;
  officialEmail: string;
  hotlineWhatsapp: string;
  campusAddress: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  heroKicker: 'FIKPsi UM Pontianak · Pendidikan Pascasarjana Terakreditasi',
  heroHeadline: 'Mencetak Pemimpin & Analis Kesehatan Berdaya Saing Global',
  heroSubheadline:
    'Program Studi Magister Kesehatan Masyarakat (S2) FIKPsi Universitas Muhammadiyah Pontianak menyiapkan magister handal dengan spesialisasi kepemimpinan fasilitas kesehatan, epidemiologi penyakit tropis, K3 industri perkebunan, dan intervensi kesehatan wilayah lahan basah Kalimantan.',
  announcementText: 'Penerimaan Mahasiswa Baru Gelombang 1 dibuka hingga 31 Mei 2026. Kuota terbatas!',
  pmbBatchName: 'Gelombang I TA 2026/2027',
  pmbBatchDeadline: '31 Mei 2026',
  baseSppPerSemester: 7500000,
  baseDevelopmentFee: 4500000,
  matriculationFee: 1500000,
  registrationFee: 500000,
  alumniDiscount: 1500000,
  partnerDiscount: 1000000,
  thesisExamFee: 3500000,
  officialEmail: 'mkm@unmuhpnk.ac.id',
  hotlineWhatsapp: '+62 812-5678-9012',
  campusAddress: 'Gedung Pascasarjana FIKPsi UM Pontianak, Jl. Jenderal Ahmad Yani No. 111, Pontianak 78124',
};

export const DEFAULT_PEMINATAN_DATA: Peminatan[] = [
  {
    id: 'akk',
    name: 'Administrasi & Kebijakan Kesehatan (AKK)',
    shortName: 'Manajemen RS & Pelayanan Kesehatan',
    badge: 'Peminatan Terfavorit',
    description:
      'Menyiapkan pimpinan strategis, manajer fasilitas kesehatan (Rumah Sakit, Klinik, Puskesmas, Asuransi BPJS), dan analis kebijakan publik yang piawai mengelola sistem kesehatan yang efektif, efisien, dan bermutu tinggi.',
    careerProspects: [
      'Direktur & Manajer Rumah Sakit (Pemerintah & Swasta)',
      'Kepala Puskesmas & Kepala Bidang Dinas Kesehatan',
      'Analis Kebijakan Kesehatan di Kemenkes / Bappeda',
      'Konsultan Akreditasi Fasilitas Pelayanan Kesehatan',
      'Manajer Mutu & Operasional Asuransi Kesehatan',
    ],
    coreSubjects: [
      'Manajemen Strategik & Kepemimpinan Pelayanan Kesehatan',
      'Analisis Kebijakan Kesehatan & Ekonomi Kesehatan Mikro',
      'Sistem Pembiayaan & Asuransi Kesehatan Nasional (JKN)',
      'Manajemen Mutu Pelayanan & Patient Safety Terpadu',
      'Hukum & Etika Administrasi Kesehatan',
    ],
    thesisTopics: [
      'Evaluasi Efisiensi Pelayanan BPJS di Rumah Sakit Daerah Kalbar',
      'Analisis Kebijakan Pengendalian Biaya Operasional Fasilitas Kesehatan',
      'Strategi Peningkatan Mutu Layanan Rawat Inap Berbasis Lean Hospital',
    ],
    iconName: 'Building2',
  },
  {
    id: 'epid',
    name: 'Epidemiologi & Pengendalian Penyakit Tropis',
    shortName: 'Epidemiologi Lapangan & Penyakit Tropis',
    badge: 'Unggulan Riset Wilayah',
    description:
      'Berfokus pada investigasi wabah, surveilans penyakit menular & tidak menular, rancang bangun intervensi penyakit tropis (DBD, Malaria, Filariasis, TBC), serta analisis data spasial kesehatan berbasis lahan basah.',
    careerProspects: [
      'Epidemiolog Lapangan (Field Epidemiologist)',
      'Manajer Program Pencegahan & Pengendalian Penyakit (P2P) Dinkes',
      'Peneliti di Balai Litbangkes / BRIN / WHO / Unicef',
      'Analis Surveilans & Intelijen Kesehatan Masyarakat',
      'Tenaga Ahli Karantina Kesehatan Pelabuhan & Perbatasan',
    ],
    coreSubjects: [
      'Epidemiologi Penyakit Tropis & Zoonosis',
      'Sistem Surveilans Kesehatan Masyarakat Terapan',
      'Sistem Informasi Geografis (SIG) & Spasial Epidemiologi',
      'Investigasi Kejadian Luar Biasa (KLB) & Outbreak Response',
      'Biostatistik Multivariat & Pemodelan Data Kesehatan',
    ],
    thesisTopics: [
      'Pemodelan Spasial Risiko Endemisitas Malaria di Pemukiman Perkebunan',
      'Faktor Determinan Kejadian Stunting Balita di Wilayah Pesisir Kalbar',
      'Efektivitas Intervensi Surveilans Terpadu Penyakit TBC Berbasis Komunitas',
    ],
    iconName: 'Activity',
  },
  {
    id: 'k3-lingkungan',
    name: 'Kesehatan Lingkungan & Keselamatan Kesehatan Kerja (K3)',
    shortName: 'K3 Industri & Kesehatan Lingkungan',
    badge: 'Tinggi Serapan Kerja',
    description:
      'Membekali kompetensi mendalam dalam manajemen risiko bahaya industri (perkebunan sawit, pertambangan, pabrik, pelabuhan), sanitasi lingkungan lahan gambut/pesisir, toksikologi industri, dan pemenuhan regulasi AMDAL/SMK3.',
    careerProspects: [
      'HSE / K3 Manager di Sektor Sawit, Tambang, & Energi',
      'Auditor Sistem Manajemen K3 (SMK3 & ISO 45001)',
      'Sanitarian & Ahli Kesehatan Lingkungan Instansi Pemerintah',
      'Konsultan AMDAL, Sanitasi Perairan, & Pengelolaan Limbah Medis',
      'Pengawas Ketenagakerjaan Bidang Norma K3',
    ],
    coreSubjects: [
      'Sistem Manajemen Keselamatan & Kesehatan Kerja (SMK3)',
      'Toksikologi Industri & Higiene Perusahaan Lanjut',
      'Sanitasi Lingkungan Pesisir & Ekosistem Lahan Gambut',
      'Analisis Risiko Kesehatan Lingkungan (ARKL)',
      'Manajemen Pengolahan Limbah Medis & Industri Berbahaya (B3)',
    ],
    thesisTopics: [
      'Analisis Risiko Paparan Logam Berat pada Sumber Air Sungai Kapuas',
      'Studi Ergonomi & Pencegahan Cumulative Trauma Disorders pada Petani Kelapa Sawit',
      'Evaluasi Efektivitas Instalasi Pengolahan Air Limbah (IPAL) Rumah Sakit',
    ],
    iconName: 'ShieldCheck',
  },
  {
    id: 'promkes',
    name: 'Promosi Kesehatan & Ilmu Perilaku',
    shortName: 'Promosi Kesehatan Komunitas',
    badge: 'Pemberdayaan Masyarakat',
    description:
      'Mengembangkan keahlian dalam rekayasa perilaku sehat, komunikasi krisis kesehatan, advokasi pemangku kebijakan, serta pemberdayaan masyarakat adat dan komunitas pesisir untuk gaya hidup sehat berkesinambungan.',
    careerProspects: [
      'Pranata Humas & Komunikasi Promkes Kemenkes / Dinkes',
      'Program Manager di NGO / Lembaga Donor Kesehatan Internasional',
      'Konsultan Kampanye Sosial & Perubahan Perilaku (SBCC)',
      'Koordinator CSR Bidang Kesehatan Perusahaan',
      'Pendidik & Fasilitator Pemberdayaan Masyarakat Desa',
    ],
    coreSubjects: [
      'Teori & Model Perubahan Perilaku Kesehatan Terapan',
      'Perencanaan & Evaluasi Program Promosi Kesehatan',
      'Komunikasi Kesehatan Digital & Advokasi Kebijakan',
      'Antropologi & Sosiologi Kesehatan Masyarakat',
      'Pemberdayaan Komunitas Berbasis Kearifan Lokal',
    ],
    thesisTopics: [
      'Efektivitas Edukasi Berbasis Media Sosial Terhadap Literasi Imunisasi',
      'Pengaruh Modal Sosial Terhadap Keberhasilan Program Sanitasi Total Berbasis Masyarakat',
      'Model Komunikasi Kesehatan Ibu Hamil pada Komunitas Perairan Sungai',
    ],
    iconName: 'Users',
  },
];

export const DEFAULT_CURRICULUM_DATA: SemesterInfo[] = [
  {
    semester: 1,
    title: 'Semester I: Landasan Teori & Metodologi Inti',
    totalSks: 11,
    description:
      'Membangun pemahaman filosofis, etika keislaman, penguasaan metodologi analisis data kesehatan kuantitatif, serta tinjauan kritis terhadap determinan kesehatan.',
    courses: [
      { code: 'MKM-7101', name: 'Filsafat Ilmu, Bioetika, & Nilai Al-Islam Kemuhammadiyahan', sks: 2, category: 'Wajib' },
      { code: 'MKM-7102', name: 'Biostatistika Terapan & Analisis Data Kesehatan', sks: 3, category: 'Wajib' },
      { code: 'MKM-7103', name: 'Epidemiologi Lanjut & Surveilans Kesehatan', sks: 3, category: 'Wajib' },
      { code: 'MKM-7104', name: 'Kebijakan Kesehatan & Tata Kelola Sistem Kesehatan', sks: 3, category: 'Wajib' },
    ],
  },
  {
    semester: 2,
    title: 'Semester II: Spesialisasi Peminatan & Desain Intervensi',
    totalSks: 12,
    description:
      'Fokus pada pendalaman keahlian spesifik peminatan studi yang dipilih mahasiswa serta perancangan riset empiris berbasis wilayah tropis.',
    courses: [
      { code: 'MKM-7201', name: 'Metodologi Penelitian Kesehatan & Desain Studi', sks: 3, category: 'Wajib' },
      { code: 'MKM-7202', name: 'Kesehatan Lingkungan Wilayah Pesisir & Lahan Basah Tropis', sks: 3, category: 'Wajib' },
      { code: 'MKM-72XX', name: 'Mata Kuliah Keahlian Peminatan I', sks: 3, category: 'Peminatan' },
      { code: 'MKM-72XY', name: 'Mata Kuliah Keahlian Peminatan II', sks: 3, category: 'Peminatan' },
    ],
  },
  {
    semester: 3,
    title: 'Semester III: Bimbingan Riset, Seminar & Publikasi Ilmiah',
    totalSks: 9,
    description:
      'Tahap pengesahan proposal tesis, pelaksanaan pengambilan data lapangan, dan pendampingan penulisan artikel ilmiah untuk jurnal bereputasi.',
    courses: [
      { code: 'MKM-7301', name: 'Mata Kuliah Pilihan Peminatan III', sks: 3, category: 'Peminatan' },
      { code: 'MKM-7302', name: 'Kolokium & Seminar Usulan Penelitian (Proposal Tesis)', sks: 2, category: 'Tesis' },
      { code: 'MKM-7303', name: 'Penulisan Naskah Ilmiah & Publikasi Jurnal Bereputasi', sks: 4, category: 'Tesis' },
    ],
  },
  {
    semester: 4,
    title: 'Semester IV: Penyelesaian Tesis & Sidang Magister',
    totalSks: 6,
    description:
      'Analisis hasil riset tesis, uji kelayakan naskah akhir, dan ujian sidang magister untuk meraih gelar resmi Magister Kesehatan Masyarakat (M.K.M.).',
    courses: [
      { code: 'MKM-7401', name: 'Penelitian Lapangan & Analisis Hasil Tesis', sks: 2, category: 'Tesis' },
      { code: 'MKM-7402', name: 'Ujian Sidang Tertutup / Terbuka Tesis Magister', sks: 4, category: 'Tesis' },
    ],
  },
];

export const DEFAULT_LECTURERS_DATA: Lecturer[] = [
  {
    id: 'lec-1',
    name: 'Prof. Dr. apt. Hj. Nurmainah, M.Si.',
    title: 'Guru Besar / Peneliti Kesehatan Masyarakat',
    specialty: 'Farmakoepidemiologi & Manajemen Mutu Pelayanan Kesehatan',
    education: 'Doktor Farmasi Klinis & Kebijakan Obat Komunitas',
    scopusArticles: 38,
    featuredRole: 'Dosen Pembina Riset Pascasarjana',
  },
  {
    id: 'lec-2',
    name: 'Dr. Rochmawati, S.KM., M.Kes.',
    title: 'Lektor Kepala / Dekan FIKPsi UM Pontianak',
    specialty: 'Administrasi Kebijakan Kesehatan & Kepemimpinan RS',
    education: 'Doktor Ilmu Kesehatan Masyarakat',
    scopusArticles: 24,
    featuredRole: 'Pakar Tata Kelola Fasilitas Kesehatan',
  },
  {
    id: 'lec-3',
    name: 'Dr. Marlenywati, S.KM., M.Kes.',
    title: 'Ketua Program Studi MKM / Dosen Tetap',
    specialty: 'Epidemiologi Penyakit Menular & Kesehatan Pesisir',
    education: 'Doktor Epidemiologi Lapangan',
    scopusArticles: 19,
    featuredRole: 'Pakar Analisis Spasial Penyakit Lahan Basah',
  },
  {
    id: 'lec-4',
    name: 'Dr. Abrori, S.Pd.I., M.Kes.',
    title: 'Dosen Senior / Peneliti Promkes',
    specialty: 'Promosi Kesehatan, Perilaku & Bioetika Islam',
    education: 'Doktor Perilaku & Pemberdayaan Komunitas',
    scopusArticles: 22,
    featuredRole: 'Pakar Komunikasi Krisis & Pemberdayaan Masyarakat',
  },
  {
    id: 'lec-5',
    name: 'Dr. Ismael Saleh, S.KM., M.Sc.',
    title: 'Dosen K3 & Toksikologi Lingkungan',
    specialty: 'Keselamatan & Kesehatan Kerja (K3) Industri Perkebunan',
    education: 'Doktor Ergonomi & Higiene Industri',
    scopusArticles: 16,
    featuredRole: 'Auditor & Praktisi Sistem Manajemen K3',
  },
];

export const DEFAULT_ACADEMIC_LINKS: AcademicLink[] = [
  {
    id: 'link-lms',
    title: 'Kelas Online (LMS Moodle Pascasarjana)',
    category: 'kelas_online',
    targetAudience: 'all',
    url: 'https://elearning.unmuhpnk.ac.id/course/index.php?categoryid=mkm',
    description: 'Portal perkuliahan daring, materi kuliah, penugasan, presensi digital, dan rekaman kelas interaktif.',
    badge: 'Aplikasi Utama',
    iconName: 'Video',
  },
  {
    id: 'link-tesis',
    title: 'Sistem Informasi Bimbingan Tesis (SIMPATI)',
    category: 'tesis',
    targetAudience: 'all',
    url: 'https://tesis.unmuhpnk.ac.id/mkm',
    description: 'Pengajuan judul, monitoring logbook bimbingan dosen pembimbing, pendaftaran kolokium proposal, dan sidang tesis.',
    badge: 'Layanan Tesis',
    iconName: 'GraduationCap',
  },
  {
    id: 'link-siakad',
    title: 'SIAKAD Terpadu (KRS & Nilai KHS)',
    category: 'akademik',
    targetAudience: 'all',
    url: 'https://siakad.unmuhpnk.ac.id',
    description: 'Pengisian KRS online, input nilai dosen, transkrip nilai semester, dan status registrasi akademik mahasiswa.',
    badge: 'Sistem Akademik',
    iconName: 'FileSpreadsheet',
  },
  {
    id: 'link-elib',
    title: 'Perpustakaan Digital & E-Resources',
    category: 'referensi',
    targetAudience: 'all',
    url: 'https://digilib.unmuhpnk.ac.id',
    description: 'Akses repository tesis pascasarjana, e-book kesehatan, dan langganan database jurnal internasional (Scopus, ScienceDirect, ProQuest).',
    badge: 'Referensi Riset',
    iconName: 'Library',
  },
  {
    id: 'link-ojs',
    title: 'OJS Jurnal Kesehatan Masyarakat UM Pontianak',
    category: 'referensi',
    targetAudience: 'all',
    url: 'https://openjurnal.unmuhpnk.ac.id/index.php/JJUM',
    description: 'Portal submit manuskrip ilmiah, review artikel, dan publikasi penelitian pascasarjana terindeks SINTA.',
    badge: 'Publikasi Ilmiah',
    iconName: 'BookMarked',
  },
  {
    id: 'link-keuangan',
    title: 'Sistem Informasi Keuangan & Virtual Account SPP',
    category: 'keuangan',
    targetAudience: 'mahasiswa',
    url: 'https://keuangan.unmuhpnk.ac.id/va-payment',
    description: 'Cek tagihan SPP semester, konfirmasi pembayaran angsuran, dan unduh kuitansi resmi universitas.',
    badge: 'Keuangan',
    iconName: 'CreditCard',
  },
];

// Adaptasi Menu Layanan Inti dari Portal MKM Apps Script (MENU_AWAL)
export const DEFAULT_PORTAL_MENUS: PortalMenuItem[] = [
  {
    id: 'menu-1',
    title: 'Bimbingan Tesis',
    description: 'Catat logbook bimbingan, jadwal konsultasi pembimbing 1 & 2, dan tahapan naskah tesis',
    url: 'https://tesis.unmuhpnk.ac.id/mkm',
    category: 'Akademik',
    icon: '🎓',
    order: 1,
    active: true,
    targetAudience: 'Semua',
  },
  {
    id: 'menu-2',
    title: 'Pengajuan Outline Tesis',
    description: 'Ajukan usulan topik penelitian dan pantau proses verifikasi outline tesis',
    url: 'https://tesis.unmuhpnk.ac.id/outline',
    category: 'Akademik',
    icon: '📝',
    order: 2,
    active: true,
    targetAudience: 'Semua',
  },
  {
    id: 'menu-3',
    title: 'Materi dan Video Matrikulasi',
    description: 'Unduh bahan ajar kuliah, modul RPS dan tonton rekaman penjelasan dosen pengampu',
    url: 'https://elearning.unmuhpnk.ac.id/course/index.php?categoryid=mkm',
    category: 'Pembelajaran',
    icon: '🎬',
    order: 3,
    active: true,
    targetAudience: 'Semua',
  },
  {
    id: 'menu-4',
    title: 'EDOM Dosen Magister',
    description: 'Evaluasi Dosen Oleh Mahasiswa (EDOM) untuk penjaminan mutu mutu akademik berkala',
    url: 'https://mutu.unmuhpnk.ac.id/edom-mkm',
    category: 'Mutu',
    icon: '📊',
    order: 4,
    active: true,
    targetAudience: 'Semua',
  },
  {
    id: 'menu-5',
    title: 'Surat Pengambilan Data',
    description: 'Pengelolaan surat permohonan izin survei, pengambilan data dan uji kelayakan etik (EC)',
    url: 'https://fikpsi.unmuhpnk.ac.id/layanan-surat',
    category: 'Administrasi',
    icon: '✉️',
    order: 5,
    active: true,
    targetAudience: 'Semua',
  },
  {
    id: 'menu-6',
    title: 'Portal Akademik FIKPsi',
    description: 'Sistem informasi layanan akademik fakultas, pengisian KRS, dan rekapitulasi nilai KHS',
    url: 'https://siakad.unmuhpnk.ac.id',
    category: 'Administrasi',
    icon: '🏛️',
    order: 6,
    active: true,
    targetAudience: 'Semua',
  },
  {
    id: 'menu-7',
    title: 'Cek Uji Turnitin Anti-Plagiasi',
    description: 'Fasilitas pengecekan similaritas naskah proposal dan tesis pascasarjana',
    url: 'https://turnitin.unmuhpnk.ac.id',
    category: 'Akademik',
    icon: '🔍',
    order: 7,
    active: true,
    targetAudience: 'Semua',
  },
  {
    id: 'menu-8',
    title: 'Perpustakaan & Repositori Tesis',
    description: 'Akses repository tesis pascasarjana, e-book dan jurnal internasional terindeks',
    url: 'https://digilib.unmuhpnk.ac.id',
    category: 'Pembelajaran',
    icon: '📚',
    order: 8,
    active: true,
    targetAudience: 'Semua',
  },
];

export const DEFAULT_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'inf-1',
    title: 'Jadwal Pengumpulan Draf Outline Tesis Gelombang I',
    content: 'Batas akhir pengumpulan draf outline tesis semester ini adalah tanggal 30 bulan berjalan. Silakan unggah berkas lengkap melalui menu Pengajuan Outline Tesis.',
    isImportant: true,
    target: 'Mahasiswa',
    authorName: 'Dr. Rochmawati, S.KM., M.Kes.',
    authorRole: 'Dosen',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'inf-2',
    title: 'Jadwal Rapat Koordinasi Kurikulum MKM & Beban Mengajar',
    content: 'Rapat koordinasi kurikulum dan beban mengajar semester genap akan dilaksanakan di Ruang Rapat Lt. 2 FIKPsi UM Pontianak pada hari Rabu pukul 10.00 WIB.',
    isImportant: true,
    target: 'Dosen',
    authorName: 'Admin Prodi MKM',
    authorRole: 'Admin',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: 'inf-3',
    title: 'Workshop Metodologi Penelitian Kesehatan Masyarakat',
    content: 'Diadakan hari Sabtu pukul 09.00 WIB secara daring melalui Google Meet. Tautan ruang kelas dan materi telah dibagikan di menu Pembelajaran.',
    isImportant: false,
    target: 'Semua',
    authorName: 'Admin Prodi MKM',
    authorRole: 'Admin',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const DEFAULT_REMINDERS: ReminderItem[] = [
  {
    id: 'ing-1',
    title: 'Batas Penyerahan Revisi Proposal Tesis',
    content: 'Serahkan revisi naskah proposal kepada dosen pembimbing utama dan pembimbing pendamping.',
    dateTime: new Date(Date.now() + 2 * 86400000).toISOString(),
    target: 'Mahasiswa',
    authorName: 'Dr. Rochmawati, S.KM., M.Kes.',
    authorRole: 'Dosen',
  },
  {
    id: 'ing-2',
    title: 'Kuliah Matrikulasi Biostatistik Lanjutan',
    content: 'Pembahasan modul 3 analisis multivariat dan penugasan mandiri di LMS.',
    dateTime: new Date(Date.now() + 4 * 86400000).toISOString(),
    target: 'Semua',
    authorName: 'Admin Prodi MKM',
    authorRole: 'Admin',
  },
  {
    id: 'ing-3',
    title: 'Batas Pengisian Nilai Ujian Sisipan & KHS',
    content: 'Input nilai ujian mahasiswa melalui portal akademik SIAKAD fakultas.',
    dateTime: new Date(Date.now() + 3 * 86400000).toISOString(),
    target: 'Dosen',
    authorName: 'Admin Prodi MKM',
    authorRole: 'Admin',
  },
];

export const DEFAULT_TESTIMONIALS_DATA: Testimonial[] = [
  {
    name: 'dr. Hendra Pratama, M.K.M.',
    role: 'Direktur Pelayanan Medis',
    agency: 'RSUD Kabupaten di Kalimantan Barat',
    batch: 'Alumni Angkatan 2023',
    quote:
      'Fleksibilitas kuliah hybrid di MKM UM Pontianak sangat membantu saya yang bertugas aktif di RSUD. Bimbingan tesisnya sangat aplikatif, topik riset saya langsung diterapkan untuk efisiensi sistem rujukan pasien.',
    avatarInitial: 'HP',
  },
  {
    name: 'Siti Rahmawati, S.KM., M.K.M.',
    role: 'Kepala Seksi P2P (Pencegahan & Pengendalian Penyakit)',
    agency: 'Dinas Kesehatan Kabupaten Sambas',
    batch: 'Alumni Angkatan 2024',
    quote:
      'Keunggulan riset pesisir dan lahan basahnya sangat tepat sasaran untuk kondisi riil Kalbar. Dosen-dosennya sabar membimbing publikasi ilmiah hingga artikel saya tembus jurnal terakreditasi internasional.',
    avatarInitial: 'SR',
  },
  {
    name: 'Bambang Kusumo, S.T., M.K.M.',
    role: 'Senior HSE & Sustainability Manager',
    agency: 'Perusahaan Agroindustri Kelapa Sawit Nasional',
    batch: 'Alumni Angkatan 2022',
    quote:
      'Meskipun S1 saya Teknik, program matrikulasi di FIKPsi UM Pontianak menyetarakan pemahaman saya tentang epidemiologi dan kesehatan kerja industri. Karir saya di bidang K3 korporasi melesat cepat.',
    avatarInitial: 'BK',
  },
];

export const DEFAULT_FAQS_DATA: FaqItem[] = [
  {
    category: 'Pendaftaran',
    question: 'Apakah lulusan S1 non-kesehatan (misal: Hukum, Teknik, Manajemen) bisa mendaftar?',
    answer:
      'Bisa! Lulusan S1 dari semua program studi yang terakreditasi BAN-PT/LAM-PTKes dapat mendaftar. Bagi calon mahasiswa berlatar belakang non-kesehatan, diwajibkan mengikuti program Matrikulasi Dasar Kesehatan Masyarakat (diselenggarakan sebelum perkuliahan reguler dimulai) untuk menyamakan dasar-dasar ilmu kesehatan masyarakat.',
  },
  {
    category: 'Perkuliahan',
    question: 'Bagaimana metode perkuliahan bagi mahasiswa yang bekerja di luar Kota Pontianak?',
    answer:
      'MKM FIKPsi UM Pontianak menerapkan sistem Blended / Hybrid Learning yang ramah pekerja profesional. Sebagian besar perkuliahan tatap muka dijadwalkan pada hari Jumat sore, Sabtu, dan Minggu, didukung oleh platform Learning Management System (LMS) interaktif untuk penugasan dan diskusi daring.',
  },
  {
    category: 'Biaya',
    question: 'Apakah biaya SPP perkuliahan dapat diangsur selama masa studi?',
    answer:
      'Ya, UM Pontianak menyediakan skema angsuran biaya pendidikan yang fleksibel. Mahasiswa dapat mengangsur SPP semesteran hingga 2 sampai 3 kali cicilan sesuai jadwal kalender akademik yang ditetapkan oleh bagian keuangan universitas.',
  },
  {
    category: 'Tesis',
    question: 'Berapa lama masa studi tercepat yang bisa ditempuh mahasiswa?',
    answer:
      'Masa studi normal dirancang selesai dalam 4 semester (2 tahun). Namun, dengan strategi penyiapan proposal tesis sejak semester 2 dan bimbingan intensif, mahasiswa berprestasi dapat menyelesaikan program ini dalam 3 semester (1,5 tahun) termasuk publikasi naskah ilmiah.',
  },
  {
    category: 'Pendaftaran',
    question: 'Apa saja dokumen persyaratan yang perlu dipersiapkan saat mendaftar?',
    answer:
      'Dokumen yang dibutuhkan meliputi: 1) Salinan ijazah & transkrip S1 terlegalisir (IPK min 2.75); 2) Scan KTP & Kartu Keluarga; 3) Pasfoto formal berlatar merah/biru; 4) Surat izin/rekomendasi belajar dari pimpinan instansi (jika bekerja); 5) Surat keterangan sehat; dan 6) Bukti transfer pembayaran pendaftaran.',
  },
];

export const DEFAULT_INITIAL_APPLICANTS: ApplicantRecord[] = [
  {
    id: 'app-001',
    registrationNumber: 'MKM-UMP-2026-1042',
    fullName: 'dr. Muhammad Farhan, Sp.A',
    whatsapp: '081254398712',
    email: 'm.farhan.ped@gmail.com',
    s1Major: 'Kedokteran Umum',
    s1Campus: 'Universitas Tanjungpura',
    currentJob: 'Dokter RSUD di Kab. Ketapang',
    peminatan: 'Administrasi & Kebijakan Kesehatan (AKK)',
    category: 'Mitra Dinkes/RS',
    notes: 'Ingin mendalami tata kelola manajemen RS dan akreditasi pelayanan anak',
    status: 'Lolos Berkas',
    registeredAt: '2026-10-18 14:20',
  },
  {
    id: 'app-002',
    registrationNumber: 'MKM-UMP-2026-2189',
    fullName: 'Nurul Hidayati, S.KM.',
    whatsapp: '085245891234',
    email: 'nurul.hidayati.skm@gmail.com',
    s1Major: 'Kesehatan Masyarakat',
    s1Campus: 'UM Pontianak',
    currentJob: 'Staf Seksi Surveilans Dinkes Sintang',
    peminatan: 'Epidemiologi & Pengendalian Penyakit Tropis',
    category: 'Alumni UMP',
    notes: 'Rencana riset spasial endemisitas DBD di daerah aliran sungai',
    status: 'Jadwal Wawancara',
    registeredAt: '2026-10-19 09:45',
  },
  {
    id: 'app-003',
    registrationNumber: 'MKM-UMP-2026-3401',
    fullName: 'Reza Anugerah, S.T.',
    whatsapp: '082155678910',
    email: 'reza.hse.sawit@perkebunan.co.id',
    s1Major: 'Teknik Lingkungan',
    s1Campus: 'Institut Teknologi Bandung',
    currentJob: 'K3 & Environmental Officer PT Sawit Makmur Kalbar',
    peminatan: 'Kesehatan Lingkungan & Keselamatan Kesehatan Kerja (K3)',
    category: 'Umum',
    notes: 'Membutuhkan matrikulasi; fokus ke SMK3 industri perkebunan',
    status: 'Menunggu Verifikasi',
    registeredAt: '2026-10-20 11:15',
  },
];

export const TESTIMONIALS_DATA = DEFAULT_TESTIMONIALS_DATA;
export const FAQS_DATA = DEFAULT_FAQS_DATA;

// Model Pengguna & Kredensial Password Portal (Adaptasi tabel Pengguna dari Code.gs)
export interface PortalUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'dosen' | 'mahasiswa';
  number?: string; // NIDN / NIM
  pin: string; // Password / PIN masuk portal
  updatedAt?: string;
}

export const DEFAULT_PORTAL_USERS: PortalUser[] = [
  {
    id: 'user-admin',
    email: 'admin@contoh.ac.id',
    name: 'Admin Prodi MKM',
    role: 'admin',
    number: '',
    pin: '1234',
    updatedAt: '2026-10-26 12:00',
  },
  {
    id: 'user-dosen',
    email: 'dosen@contoh.ac.id',
    name: 'Dr. Rochmawati, S.KM., M.Kes.',
    role: 'dosen',
    number: '1102047801',
    pin: '1234',
    updatedAt: '2026-10-26 12:00',
  },
  {
    id: 'user-mhs',
    email: 'mahasiswa@contoh.ac.id',
    name: 'Ahmad Fauzi, S.KM.',
    role: 'mahasiswa',
    number: '241021004',
    pin: '1234',
    updatedAt: '2026-10-26 12:00',
  },
];

