import React, { useState, useMemo } from 'react';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText,
  FolderSync,
  Upload,
  Link as LinkIcon,
  ExternalLink,
  ShieldCheck,
  Users,
  BookOpen,
  GraduationCap,
  Building2,
  DollarSign,
  Layers,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Copy,
  Save,
  MessageSquare,
  History,
  UserCheck,
  Sliders,
  Eye,
  Download,
  Check,
  RotateCcw,
  Sparkles,
  Star,
  X,
  ChevronDown,
  ChevronUp,
  Share2,
  FileSpreadsheet,
  HardDrive,
  BarChart3,
  Activity,
  Send,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  Clock,
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

// ==========================================
// DATA STRUCTURES & INTERFACES
// ==========================================

export interface SubIndicator {
  id: string;
  code: string;
  title: string;
  weight: number; // percentage of criteria
  desc: string;
  score: number; // 1.0 - 4.0
  status: 'Lengkap' | 'Review' | 'Draft' | 'Belum Lengkap';
  ledStatus: 'Final' | 'Review' | 'Draft';
  lkpsStatus: 'Valid' | 'Perlu Update' | 'Belum Diisi';
  evidenceCount: number;
  evidenceTarget: number;
  pic: string;
  notes?: string;
  assessorScore?: number;
  assessorNotes?: string;
  assessorStatus?: 'Disetujui' | 'Perlu Perbaikan' | 'Belum Dinilai';
}

export interface Criterion {
  id: number;
  name: string;
  shortName: string;
  weight: number; // percentage of 100
  code: string;
  iconName: string;
  color: string;
  subIndicators: SubIndicator[];
  syaratPerlu?: boolean;
  syaratPerluThreshold?: number;
}

export interface DigitalEvidence {
  id: string;
  code: string;
  title: string;
  criterionId: number;
  indicatorCode: string;
  fileType: 'SK' | 'Pedoman/SOP' | 'Laporan' | 'MoA/MoU' | 'Sertifikat' | 'Borang LKPS' | 'Naskah LED' | 'Lainnya';
  cloudProvider: 'Google Drive' | 'OneDrive' | 'Dropbox' | 'Simulasi Upload';
  cloudUrl: string;
  fileSize: string;
  uploadDate: string;
  uploader: string;
  verified: boolean;
}

export interface DiscussionComment {
  id: string;
  authorName: string;
  authorRole: 'Admin Tim Akreditasi' | 'Dosen Tim Penyusun' | 'Asesor Audit' | 'Perwakilan Mahasiswa';
  criterionId: number;
  indicatorCode?: string;
  text: string;
  timestamp: string;
  urgency: 'Normal' | 'Penting' | 'Mendesak';
  avatarBg: string;
}

export interface AuditTrailLog {
  id: string;
  action: 'Update Skor' | 'Unggah Berkas' | 'Verifikasi Asesor' | 'Update Dokumen' | 'Komentar';
  description: string;
  actor: string;
  role: string;
  timestamp: string;
  criterionCode?: string;
}

// ==========================================
// INITIAL REALISTIC DATA FOR S2 MKM
// ==========================================

const INITIAL_CRITERIA: Criterion[] = [
  {
    id: 1,
    code: 'C1',
    name: 'Visi, Misi, Tujuan, dan Strategi',
    shortName: 'VMTS',
    weight: 5.0,
    iconName: 'Building2',
    color: '#054DA0',
    subIndicators: [
      {
        id: 'c1-1',
        code: 'C.1.1',
        title: 'Keselarasan VMTS UPPS dan Program Studi MKM',
        weight: 50,
        desc: 'Kejelasan, kerealistikan, dan keterkaitan VMTS fokus kesehatan wilayah lahan basah tropis.',
        score: 3.85,
        status: 'Lengkap',
        ledStatus: 'Final',
        lkpsStatus: 'Valid',
        evidenceCount: 6,
        evidenceTarget: 6,
        pic: 'Dr. Rochmawati, S.KM., M.Kes.',
        assessorScore: 3.80,
        assessorNotes: 'VMTS telah disusun sangat partisipatif melibatkan dinkes dan alumni.',
        assessorStatus: 'Disetujui',
      },
      {
        id: 'c1-2',
        code: 'C.1.2',
        title: 'Strategi Pencapaian & Indikator Kinerja Utama (IKU/IKT)',
        weight: 50,
        desc: 'Peta jalan pencapaian sasaran strategis, baseline, target terukur, dan alokasi sumber daya.',
        score: 3.70,
        status: 'Lengkap',
        ledStatus: 'Final',
        lkpsStatus: 'Valid',
        evidenceCount: 5,
        evidenceTarget: 5,
        pic: 'Admin Tim Akreditasi',
        assessorScore: 3.75,
        assessorNotes: 'Indikator IKU/IKT telah sesuai Permendikbudristek No. 53/2023.',
        assessorStatus: 'Disetujui',
      },
    ],
  },
  {
    id: 2,
    code: 'C2',
    name: 'Tata Pamong, Tata Kelola, dan Kerjasama',
    shortName: 'Tata Kelola & Kerjasama',
    weight: 7.5,
    iconName: 'ShieldCheck',
    color: '#0E9549',
    subIndicators: [
      {
        id: 'c2-1',
        code: 'C.2.1',
        title: 'Sistem Tata Pamong & Kepemimpinan Publik',
        weight: 35,
        desc: 'Struktur organisasi, pembagian tugas fungsional, dan kepemimpinan operasional prodi.',
        score: 3.80,
        status: 'Lengkap',
        ledStatus: 'Final',
        lkpsStatus: 'Valid',
        evidenceCount: 7,
        evidenceTarget: 7,
        pic: 'Dr. Rochmawati, S.KM., M.Kes.',
        assessorScore: 3.70,
        assessorNotes: 'Struktur tata pamong sangat kredibel dan akuntabel.',
        assessorStatus: 'Disetujui',
      },
      {
        id: 'c2-2',
        code: 'C.2.2',
        title: 'Sistem Penjaminan Mutu Internal (SPMI) Siklus PPEPP',
        weight: 35,
        desc: 'Keterlaksanaan siklus Penetapan, Pelaksanaan, Evaluasi, Pengendalian, dan Peningkatan mutu.',
        score: 3.75,
        status: 'Lengkap',
        ledStatus: 'Final',
        lkpsStatus: 'Valid',
        evidenceCount: 8,
        evidenceTarget: 8,
        pic: 'Gugus Kendali Mutu FIKPsi',
        assessorScore: 3.70,
        assessorNotes: 'Laporan Audit Mutu Internal (AMI) 3 tahun terakhir lengkap terarsipkan.',
        assessorStatus: 'Disetujui',
      },
      {
        id: 'c2-3',
        code: 'C.2.3',
        title: 'Kerjasama Tridharma (Nasional & Internasional)',
        weight: 30,
        desc: 'Kerjasama bidang pendidikan, riset, dan PkM dengan Dinas Kesehatan, Balai Litbangkes, dan Industri.',
        score: 3.65,
        status: 'Review',
        ledStatus: 'Review',
        lkpsStatus: 'Valid',
        evidenceCount: 11,
        evidenceTarget: 12,
        pic: 'Unit Kerjasama FIKPsi',
        assessorScore: 3.60,
        assessorNotes: 'Perlu menambahkan laporan realisasi implementasi (IA) untuk MoU internasional.',
        assessorStatus: 'Perlu Perbaikan',
      },
    ],
  },
  {
    id: 3,
    code: 'C3',
    name: 'Mahasiswa',
    shortName: 'Mahasiswa',
    weight: 7.5,
    iconName: 'Users',
    color: '#0891B2',
    subIndicators: [
      {
        id: 'c3-1',
        code: 'C.3.1',
        title: 'Sistem Seleksi PMB & Rasio Keketatan Pendaftar',
        weight: 50,
        desc: 'Efektivitas sistem pendaftaran daring, wawancara akademik, dan seleksi calon mahasiswa magister.',
        score: 3.70,
        status: 'Lengkap',
        ledStatus: 'Final',
        lkpsStatus: 'Valid',
        evidenceCount: 6,
        evidenceTarget: 6,
        pic: 'Panitia PMB MKM',
        assessorScore: 3.70,
        assessorNotes: 'Pendaftar meningkat 24% dari 3 tahun sebelumnya.',
        assessorStatus: 'Disetujui',
      },
      {
        id: 'c3-2',
        code: 'C.3.2',
        title: 'Layanan Pembinaan Minat, Karir, & Bimbingan Tesis',
        weight: 50,
        desc: 'Akses konseling penulisan tesis, pelatihan penulisan artikel ilmiah Scopus, dan pembinaan softskill.',
        score: 3.80,
        status: 'Lengkap',
        ledStatus: 'Final',
        lkpsStatus: 'Valid',
        evidenceCount: 5,
        evidenceTarget: 5,
        pic: 'Admin Kemahasiswaan',
        assessorScore: 3.80,
        assessorNotes: 'Layanan bimbingan tesis online melalui SIMPATI berjalan efektif.',
        assessorStatus: 'Disetujui',
      },
    ],
  },
  {
    id: 4,
    code: 'C4',
    name: 'Sumber Daya Manusia (SDM)',
    shortName: 'SDM Dosen & Tendik',
    weight: 15.0,
    iconName: 'GraduationCap',
    color: '#D97706',
    syaratPerlu: true,
    syaratPerluThreshold: 3.5,
    subIndicators: [
      {
        id: 'c4-1',
        code: 'C.4.1',
        title: 'Kualifikasi Akademik DTPS Bergelar Doktor (S3)',
        weight: 35,
        desc: 'Persentase Dosen Tetap berpendidikan S3 di bidang Kesehatan Masyarakat dan rumpun relevan.',
        score: 3.85,
        status: 'Lengkap',
        ledStatus: 'Final',
        lkpsStatus: 'Valid',
        evidenceCount: 9,
        evidenceTarget: 9,
        pic: 'Ketua Program Studi MKM',
        assessorScore: 3.85,
        assessorNotes: 'Sebanyak 68% DTPS telah bergelar Doktor dari kampus terkemuka.',
        assessorStatus: 'Disetujui',
      },
      {
        id: 'c4-2',
        code: 'C.4.2',
        title: 'Jabatan Akademik DTPS (Guru Besar & Lektor Kepala)',
        weight: 35,
        desc: 'Rasio dosen berkualifikasi Lektor Kepala dan Guru Besar dalam pembimbingan tesis.',
        score: 3.75,
        status: 'Lengkap',
        ledStatus: 'Final',
        lkpsStatus: 'Valid',
        evidenceCount: 7,
        evidenceTarget: 7,
        pic: 'Bagian Kepegawaian UM Pontianak',
        assessorScore: 3.70,
        assessorNotes: 'Kecukupan jabatan fungsional sangat baik memenuhi syarat perlu unggul.',
        assessorStatus: 'Disetujui',
      },
      {
        id: 'c4-3',
        code: 'C.4.3',
        title: 'Beban Kerja Dosen (BKD) & Rekognisi Kepakaran',
        weight: 30,
        desc: 'Kesesuaian beban mengajar, membimbing, dan rekognisi sebagai narasumber atau reviewer internasional.',
        score: 3.70,
        status: 'Lengkap',
        ledStatus: 'Final',
        lkpsStatus: 'Valid',
        evidenceCount: 6,
        evidenceTarget: 6,
        pic: 'Admin Tim Akreditasi',
        assessorScore: 3.65,
        assessorNotes: 'Rekognisi kepakaran dosen di bidang epidemiologi dan K3 sangat menonjol.',
        assessorStatus: 'Disetujui',
      },
    ],
  },
  {
    id: 5,
    code: 'C5',
    name: 'Keuangan, Sarana, dan Prasarana',
    shortName: 'Keuangan & Sarpras',
    weight: 10.0,
    iconName: 'DollarSign',
    color: '#2563EB',
    subIndicators: [
      {
        id: 'c5-1',
        code: 'C.5.1',
        title: 'Kecukupan & Realisasi Anggaran Operasional & Riset',
        weight: 50,
        desc: 'Biaya operasional pembelajaran per mahasiswa, alokasi dana penelitian dosen dan mahasiswa.',
        score: 3.65,
        status: 'Review',
        ledStatus: 'Review',
        lkpsStatus: 'Valid',
        evidenceCount: 5,
        evidenceTarget: 6,
        pic: 'Wakil Rektor II / Keuangan FIKPsi',
        assessorScore: 3.60,
        assessorNotes: 'Anggaran stabil, disarankan menambah alokasi hibah publikasi Q1/Q2.',
        assessorStatus: 'Disetujui',
      },
      {
        id: 'c5-2',
        code: 'C.5.2',
        title: 'Sarana Laboratorium Kesmas, Smart Classroom, & E-Library',
        weight: 50,
        desc: 'Laboratorium epidemiologi terapan, akses database Scopus, ProQuest, dan smart interactive panel.',
        score: 3.80,
        status: 'Lengkap',
        ledStatus: 'Final',
        lkpsStatus: 'Valid',
        evidenceCount: 8,
        evidenceTarget: 8,
        pic: 'Kepala Lab & Perpustakaan',
        assessorScore: 3.80,
        assessorNotes: 'Sarana smart classroom dan perpustakaan digital sangat memadai.',
        assessorStatus: 'Disetujui',
      },
    ],
  },
  {
    id: 6,
    code: 'C6',
    name: 'Pendidikan',
    shortName: 'Kurikulum & Pembelajaran',
    weight: 17.5,
    iconName: 'BookOpen',
    color: '#7C3AED',
    syaratPerlu: true,
    syaratPerluThreshold: 3.5,
    subIndicators: [
      {
        id: 'c6-1',
        code: 'C.6.1',
        title: 'Kurikulum MKM Berbasis Outcome-Based Education (OBE)',
        weight: 35,
        desc: 'Kesesuaian CPL dengan standar AIPTKMI, kedalaman 4 peminatan studi, dan silabus RPS modern.',
        score: 3.90,
        status: 'Lengkap',
        ledStatus: 'Final',
        lkpsStatus: 'Valid',
        evidenceCount: 10,
        evidenceTarget: 10,
        pic: 'Tim Pengembang Kurikulum MKM',
        assessorScore: 3.90,
        assessorNotes: 'Peta kurikulum OBE telah terstruktur sangat rapi dan relevan dengan industri.',
        assessorStatus: 'Disetujui',
      },
      {
        id: 'c6-2',
        code: 'C.6.2',
        title: 'Integrasi Hasil Riset & PkM dalam Bahan Ajar',
        weight: 30,
        desc: 'Pemanfaatan publikasi riset dosen dan mahasiswa sebagai modul rujukan dalam perkuliahan.',
        score: 3.75,
        status: 'Lengkap',
        ledStatus: 'Final',
        lkpsStatus: 'Valid',
        evidenceCount: 7,
        evidenceTarget: 7,
        pic: 'Dr. Rochmawati, S.KM., M.Kes.',
        assessorScore: 3.75,
        assessorNotes: 'Integrasi riset lahan basah terlihat nyata di modul epidemiologi.',
        assessorStatus: 'Disetujui',
      },
      {
        id: 'c6-3',
        code: 'C.6.3',
        title: 'Sistem Pembelajaran Hybrid & Monitoring Bimbingan Tesis',
        weight: 35,
        desc: 'Platform Moodle LMS, monitoring logbook bimbingan tesis, dan kepuasan mahasiswa (EDOM).',
        score: 3.85,
        status: 'Lengkap',
        ledStatus: 'Final',
        lkpsStatus: 'Valid',
        evidenceCount: 8,
        evidenceTarget: 8,
        pic: 'Gugus Kendali Mutu FIKPsi',
        assessorScore: 3.80,
        assessorNotes: 'Sistem logbook digital tesis memudahkan pemantauan ketepatan masa studi.',
        assessorStatus: 'Disetujui',
      },
    ],
  },
  {
    id: 7,
    code: 'C7',
    name: 'Penelitian',
    shortName: 'Penelitian',
    weight: 12.5,
    iconName: 'Activity',
    color: '#EA580C',
    subIndicators: [
      {
        id: 'c7-1',
        code: 'C.7.1',
        title: 'Roadmap Riset Kesmas Wilayah Lahan Basah Tropis',
        weight: 40,
        desc: 'Kesesuaian tema penelitian dosen dengan keunggulan spesifik wilayah Kalimantan Barat.',
        score: 3.85,
        status: 'Lengkap',
        ledStatus: 'Final',
        lkpsStatus: 'Valid',
        evidenceCount: 6,
        evidenceTarget: 6,
        pic: 'Ketua LPPM / Koordinator Riset',
        assessorScore: 3.80,
        assessorNotes: 'Roadmap riset spesifik dan memiliki keunikan pembeda nasional.',
        assessorStatus: 'Disetujui',
      },
      {
        id: 'c7-2',
        code: 'C.7.2',
        title: 'Keterlibatan Mahasiswa Tesis dalam Penelitian Dosen',
        weight: 60,
        desc: 'Rasio mahasiswa magister yang menyusun tesis berpayung riset hibah dosen (Kemendikbud/BRIN/Internal).',
        score: 3.75,
        status: 'Lengkap',
        ledStatus: 'Final',
        lkpsStatus: 'Valid',
        evidenceCount: 8,
        evidenceTarget: 8,
        pic: 'Dr. Rochmawati, S.KM., M.Kes.',
        assessorScore: 3.70,
        assessorNotes: 'Kolaborasi riset payung dosen-mahasiswa berjalan sangat baik.',
        assessorStatus: 'Disetujui',
      },
    ],
  },
  {
    id: 8,
    code: 'C8',
    name: 'Pengabdian kepada Masyarakat (PkM)',
    shortName: 'Pengabdian (PkM)',
    weight: 7.5,
    iconName: 'HeartHandshake',
    color: '#059669',
    subIndicators: [
      {
        id: 'c8-1',
        code: 'C.8.1',
        title: 'Roadmap PkM & Kemitraan Komunitas Pesisir/Gambut',
        weight: 50,
        desc: 'Penerapan kepakaran kesmas untuk penanganan stunting, sanitasi total, dan kesehatan petani sawit.',
        score: 3.80,
        status: 'Lengkap',
        ledStatus: 'Final',
        lkpsStatus: 'Valid',
        evidenceCount: 6,
        evidenceTarget: 6,
        pic: 'Koordinator PkM FIKPsi',
        assessorScore: 3.80,
        assessorNotes: 'Dampak program PkM diakui luas oleh Pemda Sambas & Kubu Raya.',
        assessorStatus: 'Disetujui',
      },
      {
        id: 'c8-2',
        code: 'C.8.2',
        title: 'Keterlibatan Mahasiswa Magister dalam Program PkM',
        weight: 50,
        desc: 'Partisipasi mahasiswa dalam advokasi kebijakan kesehatan dan intervensi perubahan perilaku.',
        score: 3.70,
        status: 'Lengkap',
        ledStatus: 'Final',
        lkpsStatus: 'Valid',
        evidenceCount: 5,
        evidenceTarget: 5,
        pic: 'Admin Tim Akreditasi',
        assessorScore: 3.70,
        assessorNotes: 'Keterlibatan mahasiswa mencapai 85% dari total populasi.',
        assessorStatus: 'Disetujui',
      },
    ],
  },
  {
    id: 9,
    code: 'C9',
    name: 'Luaran dan Capaian Tridharma',
    shortName: 'Luaran & Publikasi',
    weight: 17.5,
    iconName: 'Award',
    color: '#BE185D',
    syaratPerlu: true,
    syaratPerluThreshold: 3.5,
    subIndicators: [
      {
        id: 'c9-1',
        code: 'C.9.1',
        title: 'Rata-rata IPK Lulusan & Ketepatan Masa Studi Tesis',
        weight: 35,
        desc: 'Rata-rata IPK lulusan (target ≥ 3.75) dan persentase kelulusan tepat waktu dalam 3-4 semester.',
        score: 3.80,
        status: 'Lengkap',
        ledStatus: 'Final',
        lkpsStatus: 'Valid',
        evidenceCount: 7,
        evidenceTarget: 7,
        pic: 'Admin Akademik & SIAKAD',
        assessorScore: 3.80,
        assessorNotes: 'Rata-rata IPK lulusan 3.82 dengan masa studi rata-rata 3.6 semester.',
        assessorStatus: 'Disetujui',
      },
      {
        id: 'c9-2',
        code: 'C.9.2',
        title: 'Publikasi Ilmiah Mahasiswa & Dosen (Scopus & SINTA 1-2)',
        weight: 40,
        desc: 'Jumlah artikel ilmiah tesis yang dipublikasikan di jurnal internasional bereputasi dan nasional terakreditasi.',
        score: 3.70,
        status: 'Review',
        ledStatus: 'Review',
        lkpsStatus: 'Valid',
        evidenceCount: 14,
        evidenceTarget: 15,
        pic: 'Unit Publikasi & Jurnal MKM',
        assessorScore: 3.65,
        assessorNotes: 'Produktivitas publikasi sudah sangat tinggi, lengkapi bukti korespondensi naskah.',
        assessorStatus: 'Perlu Perbaikan',
      },
      {
        id: 'c9-3',
        code: 'C.9.3',
        title: 'HKI, Paten, & Hasil Tracer Study Kepuasan Pengguna',
        weight: 25,
        desc: 'Sertifikat Hak Cipta modul/buku kesmas dan survei kepuasan pimpinan instansi tempat alumni bekerja.',
        score: 3.75,
        status: 'Lengkap',
        ledStatus: 'Final',
        lkpsStatus: 'Valid',
        evidenceCount: 8,
        evidenceTarget: 8,
        pic: 'Unit Tracer Study FIKPsi',
        assessorScore: 3.75,
        assessorNotes: 'Pengguna lulusan (Dinkes & RS) menyatakan sangat puas atas kompetensi alumni.',
        assessorStatus: 'Disetujui',
      },
    ],
  },
];

const INITIAL_EVIDENCES: DigitalEvidence[] = [
  {
    id: 'ev-1',
    code: 'BKT-C1-01',
    title: 'SK Rektor Penetapan VMTS Magister Kesehatan Masyarakat UM Pontianak',
    criterionId: 1,
    indicatorCode: 'C.1.1',
    fileType: 'SK',
    cloudProvider: 'Google Drive',
    cloudUrl: 'https://drive.google.com/drive/folders/mkm-akreditasi-c1',
    fileSize: '2.4 MB (PDF)',
    uploadDate: '2026-10-15',
    uploader: 'Admin Tim Akreditasi',
    verified: true,
  },
  {
    id: 'ev-2',
    code: 'BKT-C1-02',
    title: 'Notulensi & Daftar Hadir Lokakarya Penyusunan VMTS bersama Stakeholder & Dinkes',
    criterionId: 1,
    indicatorCode: 'C.1.1',
    fileType: 'Laporan',
    cloudProvider: 'Google Drive',
    cloudUrl: 'https://drive.google.com/file/d/vmts-lokakarya-notula',
    fileSize: '4.8 MB (PDF)',
    uploadDate: '2026-10-16',
    uploader: 'Dr. Rochmawati, S.KM., M.Kes.',
    verified: true,
  },
  {
    id: 'ev-3',
    code: 'BKT-C2-01',
    title: 'Manual Mutu & Standar SPMI Siklus PPEPP FIKPsi UM Pontianak',
    criterionId: 2,
    indicatorCode: 'C.2.2',
    fileType: 'Pedoman/SOP',
    cloudProvider: 'OneDrive',
    cloudUrl: 'https://onedrive.live.com/?id=spmi-manual-mutu-mkm',
    fileSize: '5.1 MB (PDF)',
    uploadDate: '2026-10-18',
    uploader: 'Gugus Kendali Mutu',
    verified: true,
  },
  {
    id: 'ev-4',
    code: 'BKT-C2-02',
    title: 'Naskah MoA Kerjasama Riset & Magang Tesis dengan Dinas Kesehatan Prov. Kalbar',
    criterionId: 2,
    indicatorCode: 'C.2.3',
    fileType: 'MoA/MoU',
    cloudProvider: 'Google Drive',
    cloudUrl: 'https://drive.google.com/drive/folders/moa-dinkes-kalbar',
    fileSize: '3.6 MB (PDF)',
    uploadDate: '2026-10-19',
    uploader: 'Unit Kerjasama FIKPsi',
    verified: false,
  },
  {
    id: 'ev-5',
    code: 'BKT-C4-01',
    title: 'Portofolio Ijazah & Rekap Kualifikasi S3 DTPS Program Studi MKM',
    criterionId: 4,
    indicatorCode: 'C.4.1',
    fileType: 'Sertifikat',
    cloudProvider: 'Google Drive',
    cloudUrl: 'https://drive.google.com/drive/folders/ijazah-s3-dtps',
    fileSize: '12.8 MB (PDF)',
    uploadDate: '2026-10-20',
    uploader: 'Admin Tim Akreditasi',
    verified: true,
  },
  {
    id: 'ev-6',
    code: 'BKT-C6-01',
    title: 'Dokumen Kurikulum OBE Lengkap & Peta Capaian Pembelajaran Lulusan (CPL)',
    criterionId: 6,
    indicatorCode: 'C.6.1',
    fileType: 'Pedoman/SOP',
    cloudProvider: 'Google Drive',
    cloudUrl: 'https://drive.google.com/drive/folders/kurikulum-obe-mkm',
    fileSize: '8.4 MB (PDF)',
    uploadDate: '2026-10-21',
    uploader: 'Tim Pengembang Kurikulum',
    verified: true,
  },
  {
    id: 'ev-7',
    code: 'BKT-C6-02',
    title: 'Buku Panduan Penulisan & Logbook Digital Bimbingan Tesis Pascasarjana',
    criterionId: 6,
    indicatorCode: 'C.6.3',
    fileType: 'Pedoman/SOP',
    cloudProvider: 'OneDrive',
    cloudUrl: 'https://onedrive.live.com/?id=panduan-tesis-mkm',
    fileSize: '3.9 MB (PDF)',
    uploadDate: '2026-10-22',
    uploader: 'Dr. Rochmawati, S.KM., M.Kes.',
    verified: true,
  },
  {
    id: 'ev-8',
    code: 'BKT-C9-01',
    title: 'Kompilasi Artikel Publikasi Ilmiah Mahasiswa Magister di Jurnal Scopus & SINTA',
    criterionId: 9,
    indicatorCode: 'C.9.2',
    fileType: 'Laporan',
    cloudProvider: 'Google Drive',
    cloudUrl: 'https://drive.google.com/drive/folders/publikasi-scopus-mhs',
    fileSize: '16.5 MB (PDF)',
    uploadDate: '2026-10-24',
    uploader: 'Unit Publikasi MKM',
    verified: false,
  },
];

const INITIAL_COMMENTS: DiscussionComment[] = [
  {
    id: 'comm-1',
    authorName: 'Dr. Rochmawati, S.KM., M.Kes.',
    authorRole: 'Dosen Tim Penyusun',
    criterionId: 6,
    indicatorCode: 'C.6.1',
    text: 'RPS untuk peminatan K3 Industri dan Epidemiologi Tropis sudah diselaraskan dengan standar AIPTKMI terbaru. Mohon tim LKPS memasukkan matriks CPL ke tabel 5.a.',
    timestamp: '2026-10-25 10:30',
    urgency: 'Penting',
    avatarBg: 'bg-blue-600',
  },
  {
    id: 'comm-2',
    authorName: 'Dr. Ir. Asesor Audit Eksternal, M.Kes.',
    authorRole: 'Asesor Audit',
    criterionId: 2,
    indicatorCode: 'C.2.3',
    text: 'Pada Kriteria 2 (C.2.3), bukti kerjasama internasional perlu dilengkapi bukti luaran riil (joint research / visiting professor). Mohon segera diunggah.',
    timestamp: '2026-10-25 14:15',
    urgency: 'Mendesak',
    avatarBg: 'bg-amber-600',
  },
  {
    id: 'comm-3',
    authorName: 'Admin Tim Akreditasi',
    authorRole: 'Admin Tim Akreditasi',
    criterionId: 2,
    indicatorCode: 'C.2.3',
    text: 'Siap Prof. Bukti korespondensi joint lecture dengan universitas mitra di Malaysia sedang disiapkan oleh bagian Urusan Internasional.',
    timestamp: '2026-10-25 16:45',
    urgency: 'Normal',
    avatarBg: 'bg-emerald-600',
  },
  {
    id: 'comm-4',
    authorName: 'Ahmad Fauzi, S.KM.',
    authorRole: 'Perwakilan Mahasiswa',
    criterionId: 3,
    indicatorCode: 'C.3.2',
    text: 'Layanan bimbingan tesis SIMPATI sudah kami rasakan sangat responsif. Umpan balik dosen pembimbing dapat termonitor secara real-time.',
    timestamp: '2026-10-26 09:20',
    urgency: 'Normal',
    avatarBg: 'bg-purple-600',
  },
];

const INITIAL_AUDIT_LOGS: AuditTrailLog[] = [
  {
    id: 'log-1',
    action: 'Verifikasi Asesor',
    description: 'Asesor menyetujui penilaian Kriteria 1 (VMTS) dengan skor 3.78.',
    actor: 'Dr. Ir. Asesor Audit Eksternal, M.Kes.',
    role: 'Asesor Audit',
    timestamp: '2026-10-26 15:30',
    criterionCode: 'C1',
  },
  {
    id: 'log-2',
    action: 'Unggah Berkas',
    description: 'Menambahkan bukti MoA Kerjasama Dinkes Kalbar (BKT-C2-02) via Google Drive.',
    actor: 'Unit Kerjasama FIKPsi',
    role: 'Admin Tim Akreditasi',
    timestamp: '2026-10-26 14:10',
    criterionCode: 'C2',
  },
  {
    id: 'log-3',
    action: 'Update Skor',
    description: 'Simulasi nilai Kriteria 6 (Pendidikan) diperbarui dari 3.80 menjadi 3.85.',
    actor: 'Dr. Rochmawati, S.KM., M.Kes.',
    role: 'Dosen Tim Penyusun',
    timestamp: '2026-10-26 11:45',
    criterionCode: 'C6',
  },
  {
    id: 'log-4',
    action: 'Update Dokumen',
    description: 'Status dokumen LKPS Kriteria 4 (SDM) diverifikasi Valid oleh Tim Penjamin Mutu.',
    actor: 'Gugus Kendali Mutu',
    role: 'Admin Tim Akreditasi',
    timestamp: '2026-10-25 17:00',
    criterionCode: 'C4',
  },
];

// ==========================================
// COMPONENT PROPS
// ==========================================

interface SimAkreditasiProProps {
  onBackToPortal?: () => void;
}

export const SimAkreditasiPro: React.FC<SimAkreditasiProProps> = ({ onBackToPortal }) => {
  // App Mode: Admin / Tim Akreditasi vs Asesor Audit
  const [activeRole, setActiveRole] = useState<'admin' | 'assessor'>('admin');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'criteria' | 'repository' | 'assessment_sheet' | 'discussions'>('dashboard');

  // Criteria State (for interactive simulation & grading)
  const [criteria, setCriteria] = useState<Criterion[]>(INITIAL_CRITERIA);
  const [selectedCriterionId, setSelectedCriterionId] = useState<number>(1);
  const [expandedCriteriaIds, setExpandedCriteriaIds] = useState<number[]>([1, 4, 6]);

  // Evidence Repository State
  const [evidences, setEvidences] = useState<DigitalEvidence[]>(INITIAL_EVIDENCES);
  const [evidenceSearch, setEvidenceSearch] = useState('');
  const [evidenceFilterCrit, setEvidenceFilterCrit] = useState<number | 'all'>('all');
  const [evidenceFilterType, setEvidenceFilterType] = useState<string>('all');

  // Modals for Evidence
  const [isAddEvidenceOpen, setIsAddEvidenceOpen] = useState(false);
  const [isSimUploadOpen, setIsSimUploadOpen] = useState(false);
  const [newEvTitle, setNewEvTitle] = useState('');
  const [newEvCode, setNewEvCode] = useState('');
  const [newEvCritId, setNewEvCritId] = useState<number>(1);
  const [newEvIndicator, setNewEvIndicator] = useState('C.1.1');
  const [newEvType, setNewEvType] = useState<DigitalEvidence['fileType']>('SK');
  const [newEvProvider, setNewEvProvider] = useState<DigitalEvidence['cloudProvider']>('Google Drive');
  const [newEvUrl, setNewEvUrl] = useState('');
  const [newEvSize, setNewEvSize] = useState('2.5 MB (PDF)');

  // Discussions & Audit Trail State
  const [comments, setComments] = useState<DiscussionComment[]>(INITIAL_COMMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditTrailLog[]>(INITIAL_AUDIT_LOGS);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentCritId, setNewCommentCritId] = useState<number>(1);
  const [newCommentUrgency, setNewCommentUrgency] = useState<'Normal' | 'Penting' | 'Mendesak'>('Normal');
  const [activeDiscussionSubTab, setActiveDiscussionSubTab] = useState<'threads' | 'audit_trail'>('threads');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string>('');
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // ==========================================
  // REAL-TIME SCORE & STATUS COMPUTATIONS
  // ==========================================

  const {
    totalScore,
    assessorTotalScore,
    accreditationRank,
    syaratPerluSatisfied,
    criteriaScores,
  } = useMemo(() => {
    let weightedSum = 0;
    let assessorWeightedSum = 0;
    const scoresMap: { [key: number]: { adminScore: number; assessorScore: number } } = {};

    criteria.forEach((crit) => {
      // Calculate average score of sub-indicators
      const subSum = crit.subIndicators.reduce((acc, sub) => acc + sub.score, 0);
      const critAvgScore = crit.subIndicators.length > 0 ? subSum / crit.subIndicators.length : 0;

      const subAssessorSum = crit.subIndicators.reduce((acc, sub) => acc + (sub.assessorScore ?? sub.score), 0);
      const critAssessorAvg = crit.subIndicators.length > 0 ? subAssessorSum / crit.subIndicators.length : 0;

      scoresMap[crit.id] = {
        adminScore: critAvgScore,
        assessorScore: critAssessorAvg,
      };

      // Weighted score contribution (scale to 400 points standard BAN-PT)
      // Score = sum(critAvg * weight) * 100 / 100 * 100 = critAvg * weight
      weightedSum += (critAvgScore * crit.weight * 100) / 100;
      assessorWeightedSum += (critAssessorAvg * crit.weight * 100) / 100;
    });

    // Total score in standard BAN-PT 400 scale (Score = (weightedSum / 4) * 400 = weightedSum * 100)
    // Here each weight is in % (sums to 100), critAvg is 1.0 - 4.0.
    // Total Score = sum(critAvg * weight / 100) * 100 = 1.0 to 4.0.
    // Standard BAN-PT score = (avg 1-4) * 100 = 100 to 400!
    const normalizedScore = weightedSum * 100 / 100; // range ~ 100 to 400
    const finalScore = Number((normalizedScore * 100).toFixed(1)); // e.g. 3.72 * 100 = 372.0
    const finalAssessorScore = Number((assessorWeightedSum * 100).toFixed(1));

    // Syarat Perlu Akreditasi Unggul check
    // Kriteria 4 (SDM) >= 3.5, Kriteria 6 (Pendidikan) >= 3.5, Kriteria 9 (Luaran) >= 3.5
    const k4Score = scoresMap[4]?.adminScore ?? 0;
    const k6Score = scoresMap[6]?.adminScore ?? 0;
    const k9Score = scoresMap[9]?.adminScore ?? 0;
    const isSyaratPerluMet = k4Score >= 3.5 && k6Score >= 3.5 && k9Score >= 3.5;

    // Predikat determination
    // Unggul: Score >= 361 AND Syarat Perlu Met
    // Baik Sekali: Score >= 301
    // Baik: Score >= 200
    // Tidak Terakreditasi: < 200
    let rank: 'UNGGUL' | 'BAIK SEKALI' | 'BAIK' | 'TIDAK TERAKREDITASI' = 'BAIK';
    if (finalScore >= 361) {
      rank = isSyaratPerluMet ? 'UNGGUL' : 'BAIK SEKALI';
    } else if (finalScore >= 301) {
      rank = 'BAIK SEKALI';
    } else if (finalScore >= 200) {
      rank = 'BAIK';
    } else {
      rank = 'TIDAK TERAKREDITASI';
    }

    return {
      totalScore: finalScore,
      assessorTotalScore: finalAssessorScore,
      accreditationRank: rank,
      syaratPerluSatisfied: isSyaratPerluMet,
      criteriaScores: scoresMap,
    };
  }, [criteria]);

  // Total evidences count
  const totalEvidenceCount = evidences.length;
  const verifiedEvidenceCount = evidences.filter((e) => e.verified).length;

  // Chart Data: Radar Chart (Capaian vs Target Unggul)
  const radarChartData = useMemo(() => {
    return criteria.map((c) => {
      const avg = criteriaScores[c.id]?.adminScore ?? 0;
      const assessorAvg = criteriaScores[c.id]?.assessorScore ?? 0;
      return {
        subject: c.code,
        fullName: c.shortName,
        Capaian: Number(avg.toFixed(2)),
        Asesor: Number(assessorAvg.toFixed(2)),
        TargetUnggul: 3.75,
      };
    });
  }, [criteria, criteriaScores]);

  // Chart Data: Bar Chart (Skor per Kriteria)
  const barChartData = useMemo(() => {
    return criteria.map((c) => {
      const avg = criteriaScores[c.id]?.adminScore ?? 0;
      return {
        name: c.code,
        fullName: c.shortName,
        Skor: Number(avg.toFixed(2)),
        Bobot: c.weight,
      };
    });
  }, [criteria, criteriaScores]);

  // Chart Data: Dokumen Status Distribution
  const docStatusData = useMemo(() => {
    let lengkap = 0;
    let review = 0;
    let draft = 0;
    let belum = 0;

    criteria.forEach((c) => {
      c.subIndicators.forEach((s) => {
        if (s.status === 'Lengkap') lengkap++;
        else if (s.status === 'Review') review++;
        else if (s.status === 'Draft') draft++;
        else belum++;
      });
    });

    return [
      { name: 'Lengkap', value: lengkap, color: '#0E9549' },
      { name: 'Review', value: review, color: '#D97706' },
      { name: 'Draft', value: draft, color: '#2563EB' },
      { name: 'Belum', value: belum, color: '#DC2626' },
    ];
  }, [criteria]);

  // Timeline Progress Data
  const progressTimelineData = [
    { month: 'Bln 1', Kesiapan: 35 },
    { month: 'Bln 2', Kesiapan: 52 },
    { month: 'Bln 3', Kesiapan: 68 },
    { month: 'Bln 4', Kesiapan: 79 },
    { month: 'Bln 5', Kesiapan: 88 },
    { month: 'Bln 6 (Saat Ini)', Kesiapan: 93 },
  ];

  // ==========================================
  // HANDLERS
  // ==========================================

  // Update Indicator Score (Simulator)
  const handleUpdateIndicatorScore = (critId: number, subId: string, newScore: number) => {
    setCriteria((prev) =>
      prev.map((c) => {
        if (c.id === critId) {
          return {
            ...c,
            subIndicators: c.subIndicators.map((s) =>
              s.id === subId ? { ...s, score: Math.min(4.0, Math.max(1.0, Number(newScore.toFixed(2)))) } : s
            ),
          };
        }
        return c;
      })
    );
  };

  // Update Assessor Assessment
  const handleUpdateAssessorScore = (
    critId: number,
    subId: string,
    score: number,
    notes: string,
    status: 'Disetujui' | 'Perlu Perbaikan' | 'Belum Dinilai'
  ) => {
    setCriteria((prev) =>
      prev.map((c) => {
        if (c.id === critId) {
          return {
            ...c,
            subIndicators: c.subIndicators.map((s) =>
              s.id === subId ? { ...s, assessorScore: score, assessorNotes: notes, assessorStatus: status } : s
            ),
          };
        }
        return c;
      })
    );

    // Add Audit Log
    const targetSub = criteria.find((c) => c.id === critId)?.subIndicators.find((s) => s.id === subId);
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        action: 'Verifikasi Asesor',
        description: `Asesor memberikan nilai ${score.toFixed(2)} pada ${targetSub?.code || 'Indikator'} status: ${status}`,
        actor: 'Dr. Ir. Asesor Audit Eksternal, M.Kes.',
        role: 'Asesor Audit',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        criterionCode: `C${critId}`,
      },
      ...prev,
    ]);

    showToast('Penilaian & catatan deskriptif asesor berhasil disimpan!');
  };

  // Preset Simulator
  const handleApplyPreset = (presetType: 'unggul' | 'real' | 'ambang') => {
    if (presetType === 'unggul') {
      setCriteria((prev) =>
        prev.map((c) => ({
          ...c,
          subIndicators: c.subIndicators.map((s) => ({ ...s, score: 3.85 })),
        }))
      );
      showToast('Simulasi Target Unggul diterapkan (Skor Proyeksi 385.0)');
    } else if (presetType === 'ambang') {
      setCriteria((prev) =>
        prev.map((c) => ({
          ...c,
          subIndicators: c.subIndicators.map((s) => ({ ...s, score: 3.25 })),
        }))
      );
      showToast('Simulasi Ambang Batas Baik Sekali diterapkan (Skor 325.0)');
    } else {
      setCriteria(INITIAL_CRITERIA);
      showToast('Reset nilai ke data riil eksisting.');
    }
  };

  // Add Evidence Link
  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvTitle.trim()) return;

    const newEvidence: DigitalEvidence = {
      id: `ev-${Date.now()}`,
      code: newEvCode.trim() || `BKT-C${newEvCritId}-${evidences.length + 1}`,
      title: newEvTitle.trim(),
      criterionId: newEvCritId,
      indicatorCode: newEvIndicator,
      fileType: newEvType,
      cloudProvider: newEvProvider,
      cloudUrl: newEvUrl.trim() || 'https://drive.google.com/drive/folders/mkm-akreditasi',
      fileSize: newEvSize,
      uploadDate: new Date().toISOString().slice(0, 10),
      uploader: activeRole === 'admin' ? 'Admin Tim Akreditasi' : 'Asesor Audit',
      verified: activeRole === 'assessor',
    };

    setEvidences((prev) => [newEvidence, ...prev]);

    // Update indicator evidence count
    setCriteria((prev) =>
      prev.map((c) => {
        if (c.id === newEvCritId) {
          return {
            ...c,
            subIndicators: c.subIndicators.map((s) =>
              s.code === newEvIndicator ? { ...s, evidenceCount: s.evidenceCount + 1 } : s
            ),
          };
        }
        return c;
      })
    );

    // Audit Log
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        action: 'Unggah Berkas',
        description: `Tautan berkas digital "${newEvidence.title}" ditambahkan ke ${newEvidence.indicatorCode}`,
        actor: activeRole === 'admin' ? 'Admin Tim Akreditasi' : 'Asesor Audit',
        role: activeRole === 'admin' ? 'Admin Tim Akreditasi' : 'Asesor Audit',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        criterionCode: `C${newEvCritId}`,
      },
      ...prev,
    ]);

    setNewEvTitle('');
    setNewEvCode('');
    setNewEvUrl('');
    setIsAddEvidenceOpen(false);
    showToast('Tautan bukti digital berhasil disimpan ke repositori cloud!');
  };

  // Delete Evidence
  const handleDeleteEvidence = (id: string) => {
    setEvidences((prev) => prev.filter((e) => e.id !== id));
    showToast('Bukti digital telah dihapus.');
  };

  // Toggle Verify Evidence
  const handleToggleVerifyEvidence = (id: string) => {
    setEvidences((prev) =>
      prev.map((e) => (e.id === id ? { ...e, verified: !e.verified } : e))
    );
    showToast('Status verifikasi bukti diperbarui!');
  };

  // Add Comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: DiscussionComment = {
      id: `comm-${Date.now()}`,
      authorName: activeRole === 'admin' ? 'Admin Tim Akreditasi' : 'Dr. Ir. Asesor Audit Eksternal, M.Kes.',
      authorRole: activeRole === 'admin' ? 'Admin Tim Akreditasi' : 'Asesor Audit',
      criterionId: newCommentCritId,
      text: newCommentText.trim(),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      urgency: newCommentUrgency,
      avatarBg: activeRole === 'admin' ? 'bg-[#054DA0]' : 'bg-[#D97706]',
    };

    setComments((prev) => [newComment, ...prev]);

    // Audit log
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        action: 'Komentar',
        description: `Catatan baru diposting pada Kriteria ${newCommentCritId} oleh ${newComment.authorName}`,
        actor: newComment.authorName,
        role: newComment.authorRole,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        criterionCode: `C${newCommentCritId}`,
      },
      ...prev,
    ]);

    setNewCommentText('');
    showToast('Catatan diskusi kolaboratif berhasil diposting!');
  };

  // Filtered Evidences
  const filteredEvidences = useMemo(() => {
    return evidences.filter((ev) => {
      const matchSearch =
        ev.title.toLowerCase().includes(evidenceSearch.toLowerCase()) ||
        ev.code.toLowerCase().includes(evidenceSearch.toLowerCase()) ||
        ev.indicatorCode.toLowerCase().includes(evidenceSearch.toLowerCase());
      const matchCrit = evidenceFilterCrit === 'all' || ev.criterionId === evidenceFilterCrit;
      const matchType = evidenceFilterType === 'all' || ev.fileType === evidenceFilterType;
      return matchSearch && matchCrit && matchType;
    });
  }, [evidences, evidenceSearch, evidenceFilterCrit, evidenceFilterType]);

  // Toggle Accordion Criterion
  const toggleCriterionAccordion = (id: number) => {
    setExpandedCriteriaIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC] text-[#16202E] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col antialiased">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#032B5B] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold border border-[#F5BA13]/30 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#F5BA13]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ==========================================
          TOP INSTITUTIONAL HEADER & APP BRANDING
          ========================================== */}
      <header className="bg-white border-b border-[#DCE5F0] sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Brand & Program Studi Info */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/UMPontianak_Logo_Warna_2e912afe.png"
              alt="Logo Universitas Muhammadiyah Pontianak"
              className="h-11 w-auto object-contain bg-white p-0.5 rounded shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-[#032B5B] block leading-tight">
                  SIM-Akreditasi PRO
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF3FC] text-[#054DA0] border border-[#054DA0]/20 uppercase">
                  9 Kriteria LAM-PTKes
                </span>
              </div>
              <p className="text-[11px] text-[#5B6B82] font-semibold">
                Sistem Informasi Akreditasi & Asesmen Program Studi Magister Kesehatan Masyarakat (S2) FIKPsi UM Pontianak
              </p>
            </div>
          </div>

          {/* Header Controls: Role Switcher & Back Button */}
          <div className="flex items-center gap-3">
            
            {/* DUAL-MODE ROLE TOGGLE (Admin vs Asesor) */}
            <div className="bg-[#F4F7FC] p-1 rounded-xl border border-[#DCE5F0] flex items-center shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setActiveRole('admin');
                  showToast('Beralih ke Mode Admin Tim Akreditasi PS');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  activeRole === 'admin'
                    ? 'bg-[#054DA0] text-white shadow-xs'
                    : 'text-[#5B6B82] hover:text-[#032B5B]'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Admin Tim PS</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveRole('assessor');
                  setActiveTab('assessment_sheet');
                  showToast('Mode Asesor Audit Eksternal Aktif');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  activeRole === 'assessor'
                    ? 'bg-[#D97706] text-white shadow-xs'
                    : 'text-[#5B6B82] hover:text-[#032B5B]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Asesor Audit</span>
              </button>
            </div>

            {/* Back to Portal Button */}
            {onBackToPortal && (
              <button
                type="button"
                onClick={onBackToPortal}
                className="px-3 py-2 text-xs font-bold text-[#054DA0] bg-[#EBF3FC] hover:bg-[#d9ebfd] border border-[#054DA0]/20 rounded-xl transition-all flex items-center gap-1.5"
                title="Kembali ke Portal MKM"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Portal MKM</span>
              </button>
            )}

          </div>

        </div>

        {/* Dynamic Mode Notification Bar */}
        <div className={`px-4 sm:px-8 py-1.5 text-xs font-bold flex items-center justify-between border-t border-b transition-colors ${
          activeRole === 'admin'
            ? 'bg-[#EBF3FC] text-[#054DA0] border-[#054DA0]/20'
            : 'bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]/30'
        }`}>
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
            <span className="flex items-center gap-1.5">
              {activeRole === 'admin' ? (
                <>
                  <UserCheck className="w-4 h-4 text-[#054DA0]" />
                  <span>Mode Penyusunan Aktif: Hak akses penuh mengedit indikator LED/LKPS, mengunggah bukti, dan simulator nilai.</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#D97706]" />
                  <span>Mode Asesor Audit Aktif: Penilaian mandiri skala 1-4, verifikasi keabsahan bukti, dan catatan rekomendasi asesmen lapangan.</span>
                </>
              )}
            </span>

            <span className="text-[11px] font-mono opacity-90 hidden md:inline">
              Instrumen: LAM-PTKes IAPS S2 Kesmas v2.1
            </span>
          </div>
        </div>
      </header>

      {/* ==========================================
          MAIN NAVIGATION TABS (5 CORE MODULES)
          ========================================== */}
      <div className="bg-white border-b border-[#DCE5F0] sticky top-[105px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none">
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'bg-[#054DA0] text-white shadow-xs'
                : 'text-[#5B6B82] hover:text-[#032B5B] hover:bg-[#EBF3FC]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Executive Dashboard & Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('criteria')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'criteria'
                ? 'bg-[#054DA0] text-white shadow-xs'
                : 'text-[#5B6B82] hover:text-[#032B5B] hover:bg-[#EBF3FC]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Pemetaan 9 Kriteria</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-current font-mono">
              LED/LKPS
            </span>
          </button>

          <button
            onClick={() => setActiveTab('repository')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'repository'
                ? 'bg-[#054DA0] text-white shadow-xs'
                : 'text-[#5B6B82] hover:text-[#032B5B] hover:bg-[#EBF3FC]'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Repository Bukti Digital</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#E8F7EE] text-[#0E9549] font-bold">
              {evidences.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('assessment_sheet')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'assessment_sheet'
                ? 'bg-[#D97706] text-white shadow-xs'
                : 'text-[#5B6B82] hover:text-[#032B5B] hover:bg-[#FFFBEB]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Lembar Asesmen Asesor</span>
            {activeRole === 'assessor' && (
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('discussions')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'discussions'
                ? 'bg-[#054DA0] text-white shadow-xs'
                : 'text-[#5B6B82] hover:text-[#032B5B] hover:bg-[#EBF3FC]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Diskusi & Audit Trail</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#EBF3FC] text-[#054DA0] font-bold">
              {comments.length}
            </span>
          </button>

        </div>
      </div>

      {/* ==========================================
          MAIN CONTENT CONTAINER
          ========================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        
        {/* ============================================================
            MODULE 1: EXECUTIVE DASHBOARD & REAL-TIME VALUE SIMULATOR
            ============================================================ */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Top Score Banner: Akreditasi Real-time Aggregator */}
            <div className="rounded-2xl bg-gradient-to-r from-[#032B5B] via-[#054DA0] to-[#0E9549] text-white p-6 sm:p-8 shadow-md relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-32 w-48 h-48 rounded-full bg-[#F5BA13]/20 blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                
                {/* Score Projection Details */}
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-[#FFDE72] text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#F5BA13]" />
                    <span>Proyeksi Status Akreditasi Terkini</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                    SIMULASI NILAI AKREDITASI: {totalScore} / 400
                  </h2>

                  <p className="text-xs sm:text-sm text-[#D3E5FA] leading-relaxed">
                    Berdasarkan asesmen mandiri terhadap 9 Kriteria LAM-PTKes. 
                    {syaratPerluSatisfied
                      ? ' Seluruh Syarat Perlu Akreditasi Unggul (SDM, Kurikulum, Luaran) berhasil terpenuhi.'
                      : ' Perhatian: Ada kriteria syarat perlu belum mencapai ambang batas minimal 3.50.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <span className="text-xs bg-white/20 px-3 py-1 rounded-lg backdrop-blur-xs font-semibold">
                      Nilai Riil Asesor: <strong>{assessorTotalScore}</strong>
                    </span>
                    <span className="text-xs bg-white/20 px-3 py-1 rounded-lg backdrop-blur-xs font-semibold">
                      Target Nilai: <strong>≥ 361.0 (Unggul)</strong>
                    </span>
                  </div>
                </div>

                {/* Predikat Badge Big Card */}
                <div className="bg-white/15 backdrop-blur-md p-5 rounded-2xl border border-white/25 text-center min-w-[260px] shadow-lg space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D3E5FA] block">
                    Predikat Hasil Asesmen
                  </span>

                  <div className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#F5BA13] to-[#E5AC0B] text-[#16202E] font-black text-2xl sm:text-3xl tracking-tight shadow-md flex items-center justify-center gap-2">
                    <Award className="w-7 h-7 text-[#16202E]" />
                    <span>{accreditationRank}</span>
                  </div>

                  <div className="text-[11px] text-white/90 pt-1 flex items-center justify-center gap-1.5 font-medium">
                    {syaratPerluSatisfied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
                        <span>Syarat Perlu Terpenuhi</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-[#FCA5A5]" />
                        <span>Syarat Perlu Belum Lengkap</span>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Quick KPI Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#DCE5F0] shadow-xs flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#EBF3FC] text-[#054DA0] flex items-center justify-center text-xl shrink-0">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-[#032B5B] block leading-tight">
                    9 / 9
                  </span>
                  <span className="text-xs text-[#5B6B82] font-semibold">Kriteria Terpetakan</span>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#DCE5F0] shadow-xs flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#E8F7EE] text-[#0E9549] flex items-center justify-center text-xl shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-[#032B5B] block leading-tight">
                    92%
                  </span>
                  <span className="text-xs text-[#5B6B82] font-semibold">Kesiapan LED & LKPS</span>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#DCE5F0] shadow-xs flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center text-xl shrink-0">
                  <HardDrive className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-[#032B5B] block leading-tight">
                    {verifiedEvidenceCount} / {totalEvidenceCount}
                  </span>
                  <span className="text-xs text-[#5B6B82] font-semibold">Bukti Terverifikasi</span>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#DCE5F0] shadow-xs flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#FEE4E2] text-[#DC2626] flex items-center justify-center text-xl shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-[#032B5B] block leading-tight">
                    3 / 3
                  </span>
                  <span className="text-xs text-[#5B6B82] font-semibold">Syarat Perlu Lolos</span>
                </div>
              </div>

            </div>

            {/* Visual Recharts Grid: Radar Chart + Bar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Radar Chart: Capaian vs Target Unggul (7 cols) */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#EEF3F8] pb-3">
                  <div>
                    <h3 className="font-extrabold text-base text-[#032B5B] flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#054DA0]" />
                      <span>Radar Capaian 9 Kriteria Akreditasi</span>
                    </h3>
                    <p className="text-xs text-[#5B6B82]">
                      Perbandingan Capaian Mandiri Tim PS vs Penilaian Asesor vs Target Unggul (3.75)
                    </p>
                  </div>
                </div>

                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                      <PolarGrid stroke="#DCE5F0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#032B5B', fontSize: 11, fontWeight: 700 }} />
                      <PolarRadiusAxis angle={30} domain={[2.0, 4.0]} tick={{ fill: '#5B6B82', fontSize: 10 }} />
                      <Radar name="Capaian Tim PS" dataKey="Capaian" stroke="#054DA0" fill="#054DA0" fillOpacity={0.4} />
                      <Radar name="Nilai Asesor" dataKey="Asesor" stroke="#D97706" fill="#D97706" fillOpacity={0.25} />
                      <Radar name="Target Unggul" dataKey="TargetUnggul" stroke="#0E9549" strokeDasharray="3 3" fill="none" />
                      <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart: Bobot vs Skor Tertimbang (5 cols) */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#EEF3F8] pb-3">
                  <div>
                    <h3 className="font-extrabold text-base text-[#032B5B] flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#0E9549]" />
                      <span>Skor Rata-Rata per Kriteria (1.0 - 4.0)</span>
                    </h3>
                    <p className="text-xs text-[#5B6B82]">
                      Skor rata-rata indikator per kriteria instrumen
                    </p>
                  </div>
                </div>

                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EEF3F8" />
                      <XAxis dataKey="name" tick={{ fill: '#032B5B', fontSize: 11, fontWeight: 700 }} />
                      <YAxis domain={[2.5, 4.0]} tick={{ fill: '#5B6B82', fontSize: 11 }} />
                      <Tooltip formatter={(value: any) => [`${value} / 4.0`, 'Skor Rata-rata']} />
                      <Bar dataKey="Skor" fill="#054DA0" radius={[6, 6, 0, 0]}>
                        {barChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.Skor >= 3.75 ? '#0E9549' : entry.Skor >= 3.5 ? '#054DA0' : '#D97706'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Real-time Simulator Panel */}
            <div className="bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#EEF3F8] pb-4">
                <div>
                  <h3 className="font-extrabold text-base text-[#032B5B] flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-[#054DA0]" />
                    <span>Simulator Nilai Akreditasi Interaktif</span>
                  </h3>
                  <p className="text-xs text-[#5B6B82]">
                    Geser slider nilai indikator untuk menguji sensitivitas skor agregat dan melihat dampak langsung terhadap predikat kelulusan akreditasi.
                  </p>
                </div>

                {/* Preset Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('unggul')}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#E8F7EE] text-[#0E9549] hover:bg-[#d0f0dc] transition-colors border border-[#0E9549]/20"
                  >
                    Target Unggul (385.0)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('ambang')}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#FEF3C7] text-[#92400E] hover:bg-[#fde68a] transition-colors border border-[#F59E0B]/20"
                  >
                    Ambang Baik Sekali (325.0)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('real')}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#F4F7FC] text-[#5B6B82] hover:bg-[#EBF3FC] transition-colors border border-[#DCE5F0] flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Riil</span>
                  </button>
                </div>
              </div>

              {/* Sliders Grid for 9 Criteria */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {criteria.map((c) => {
                  const currentCritScore = criteriaScores[c.id]?.adminScore ?? 3.5;
                  const isSyarat = c.syaratPerlu;

                  return (
                    <div
                      key={c.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isSyarat
                          ? 'border-[#054DA0]/30 bg-[#EBF3FC]/30'
                          : 'border-[#DCE5F0] bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-extrabold text-xs text-[#032B5B] flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-white text-[#054DA0] border border-[#DCE5F0] font-mono">
                            {c.code}
                          </span>
                          <span className="truncate max-w-[140px]" title={c.name}>
                            {c.shortName}
                          </span>
                        </span>

                        <span className="font-extrabold text-sm text-[#054DA0] font-mono">
                          {currentCritScore.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#5B6B82] mb-2 font-medium">
                        <span>Bobot: <strong>{c.weight}%</strong></span>
                        {isSyarat && (
                          <span className="text-[10px] text-[#D97706] font-bold bg-[#FEF3C7] px-1.5 py-0.2 rounded">
                            Syarat Perlu (≥ 3.5)
                          </span>
                        )}
                      </div>

                      {/* Slider controls primary sub-indicator for quick test */}
                      <input
                        type="range"
                        min="2.0"
                        max="4.0"
                        step="0.05"
                        value={currentCritScore}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          // Distribute across all sub-indicators in this criterion
                          c.subIndicators.forEach((s) => {
                            handleUpdateIndicatorScore(c.id, s.id, val);
                          });
                        }}
                        className="w-full h-1.5 bg-[#DCE5F0] rounded-lg appearance-none cursor-pointer accent-[#054DA0]"
                      />

                      <div className="flex justify-between text-[10px] text-[#5B6B82] mt-1 font-mono">
                        <span>2.0 (Cukup)</span>
                        <span>3.0 (Baik)</span>
                        <span>4.0 (Unggul)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Syarat Perlu Compliance Card */}
            <div className="bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-[#032B5B] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#0E9549]" />
                <span>Status Pemenuhan Syarat Perlu Peringkat Akreditasi Unggul</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="p-4 rounded-xl border border-[#E8F7EE] bg-[#E8F7EE]/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0E9549]">Kriteria 4: SDM Dosen (Doktor)</span>
                    <CheckCircle2 className="w-4 h-4 text-[#0E9549]" />
                  </div>
                  <p className="text-xs text-[#16202E]">
                    Skor: <strong>{criteriaScores[4]?.adminScore.toFixed(2)} / 3.50</strong> minimal
                  </p>
                  <p className="text-[11px] text-[#5B6B82]">
                    Persentase DTPS bergelar Doktor 68% (Target LAM-PTKes ≥ 50%).
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-[#E8F7EE] bg-[#E8F7EE]/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0E9549]">Kriteria 6: Kurikulum & Pembelajaran</span>
                    <CheckCircle2 className="w-4 h-4 text-[#0E9549]" />
                  </div>
                  <p className="text-xs text-[#16202E]">
                    Skor: <strong>{criteriaScores[6]?.adminScore.toFixed(2)} / 3.50</strong> minimal
                  </p>
                  <p className="text-[11px] text-[#5B6B82]">
                    Kurikulum OBE terstruktur dan integrasi riset tesis termonitoring rapi.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-[#E8F7EE] bg-[#E8F7EE]/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0E9549]">Kriteria 9: Luaran & Publikasi Scopus</span>
                    <CheckCircle2 className="w-4 h-4 text-[#0E9549]" />
                  </div>
                  <p className="text-xs text-[#16202E]">
                    Skor: <strong>{criteriaScores[9]?.adminScore.toFixed(2)} / 3.50</strong> minimal
                  </p>
                  <p className="text-[11px] text-[#5B6B82]">
                    Rata-rata IPK lulusan 3.82 dan publikasi jurnal terakreditasi melampaui target.
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ============================================================
            MODULE 2: PEMETAAN 9 KRITERIA (BAN-PT / LAM-PTKes)
            ============================================================ */}
        {activeTab === 'criteria' && (
          <div className="space-y-6">
            
            {/* Criteria Overview Bar */}
            <div className="bg-white p-5 rounded-2xl border border-[#DCE5F0] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-lg text-[#032B5B]">
                  Pemetaan 9 Kriteria Instrumen Akreditasi Program Studi (IAPS)
                </h3>
                <p className="text-xs text-[#5B6B82]">
                  Laporan Evaluasi Diri (LED), Laporan Kinerja Program Studi (LKPS), ketersediaan berkas bukti, dan PIC penanggung jawab kriteria.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setExpandedCriteriaIds([1, 2, 3, 4, 5, 6, 7, 8, 9])}
                  className="px-3 py-1.5 text-xs font-bold text-[#054DA0] bg-[#EBF3FC] rounded-lg hover:bg-[#d5e7fc] transition-colors"
                >
                  Buka Semua
                </button>
                <button
                  type="button"
                  onClick={() => setExpandedCriteriaIds([])}
                  className="px-3 py-1.5 text-xs font-bold text-[#5B6B82] bg-[#F4F7FC] rounded-lg hover:bg-[#EBF3FC] transition-colors"
                >
                  Tutup Semua
                </button>
              </div>
            </div>

            {/* Accordion List for 9 Criteria */}
            <div className="space-y-4">
              {criteria.map((crit) => {
                const isExpanded = expandedCriteriaIds.includes(crit.id);
                const avgScore = criteriaScores[crit.id]?.adminScore ?? 3.5;
                const totalSub = crit.subIndicators.length;
                const lengkapSub = crit.subIndicators.filter((s) => s.status === 'Lengkap').length;
                const progressPct = Math.round((lengkapSub / totalSub) * 100);

                return (
                  <div
                    key={crit.id}
                    className="bg-white rounded-2xl border border-[#DCE5F0] shadow-xs overflow-hidden transition-all"
                  >
                    {/* Criterion Header Clickable */}
                    <div
                      onClick={() => toggleCriterionAccordion(crit.id)}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#F8FAFC] transition-colors select-none"
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className="w-12 h-12 rounded-xl text-white font-extrabold flex items-center justify-center text-sm shadow-xs shrink-0"
                          style={{ backgroundColor: crit.color }}
                        >
                          {crit.code}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-base text-[#032B5B]">
                              Kriteria {crit.id}: {crit.name}
                            </h4>
                            {crit.syaratPerlu && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B]/20">
                                Syarat Perlu
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#5B6B82] mt-0.5">
                            Bobot: <strong>{crit.weight}%</strong> · {totalSub} Sub-Indikator Instrumen
                          </p>
                        </div>
                      </div>

                      {/* Header Right Status Badges */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-xs text-[#5B6B82] block">Skor Kriteria:</span>
                          <span className="font-extrabold text-base text-[#054DA0] font-mono">
                            {avgScore.toFixed(2)} / 4.0
                          </span>
                        </div>

                        <div className="hidden md:block w-28 bg-[#EEF3F8] rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-[#0E9549] h-2.5 rounded-full transition-all"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>

                        <div className="p-1 rounded-lg bg-[#F4F7FC] text-[#5B6B82]">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>
                    </div>

                    {/* Sub-Indicators Table (Expanded) */}
                    {isExpanded && (
                      <div className="border-t border-[#EEF3F8] p-5 bg-[#FAFBFD] space-y-4">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-[#DCE5F0] text-[#5B6B82] uppercase text-[10px] font-bold tracking-wider">
                                <th className="pb-3 px-3">Kode & Indikator</th>
                                <th className="pb-3 px-3">Bobot</th>
                                <th className="pb-3 px-3">Status Dokumen</th>
                                <th className="pb-3 px-3">LED / LKPS</th>
                                <th className="pb-3 px-3">Bukti Digital</th>
                                <th className="pb-3 px-3">Skor Tim</th>
                                <th className="pb-3 px-3">PIC</th>
                                <th className="pb-3 px-3 text-right">Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EEF3F8]">
                              {crit.subIndicators.map((sub) => (
                                <tr key={sub.id} className="hover:bg-white transition-colors">
                                  
                                  {/* Kode & Judul */}
                                  <td className="py-3 px-3 max-w-xs">
                                    <span className="font-extrabold text-[#032B5B] block font-mono">
                                      {sub.code}
                                    </span>
                                    <span className="font-semibold text-slate-800 block text-xs">
                                      {sub.title}
                                    </span>
                                    <span className="text-[11px] text-[#5B6B82] line-clamp-1 mt-0.5">
                                      {sub.desc}
                                    </span>
                                  </td>

                                  {/* Bobot */}
                                  <td className="py-3 px-3 font-mono font-bold text-slate-700">
                                    {sub.weight}%
                                  </td>

                                  {/* Status Kesiapan */}
                                  <td className="py-3 px-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      sub.status === 'Lengkap'
                                        ? 'bg-[#E8F7EE] text-[#0E9549]'
                                        : sub.status === 'Review'
                                        ? 'bg-[#FFFBEB] text-[#D97706]'
                                        : 'bg-[#FEE4E2] text-[#DC2626]'
                                    }`}>
                                      {sub.status}
                                    </span>
                                  </td>

                                  {/* LED / LKPS */}
                                  <td className="py-3 px-3">
                                    <div className="space-y-1">
                                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-medium block">
                                        LED: <strong>{sub.ledStatus}</strong>
                                      </span>
                                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-medium block">
                                        LKPS: <strong>{sub.lkpsStatus}</strong>
                                      </span>
                                    </div>
                                  </td>

                                  {/* Bukti Digital Indicator */}
                                  <td className="py-3 px-3">
                                    <div className="flex items-center gap-1.5">
                                      <FolderSync className="w-3.5 h-3.5 text-[#054DA0]" />
                                      <span className="font-mono font-bold text-slate-800">
                                        {sub.evidenceCount} / {sub.evidenceTarget}
                                      </span>
                                      {sub.evidenceCount >= sub.evidenceTarget && (
                                        <Check className="w-3.5 h-3.5 text-[#0E9549]" />
                                      )}
                                    </div>
                                  </td>

                                  {/* Skor Tim PS */}
                                  <td className="py-3 px-3 font-mono font-extrabold text-[#054DA0] text-sm">
                                    {sub.score.toFixed(2)}
                                  </td>

                                  {/* PIC */}
                                  <td className="py-3 px-3 text-[#5B6B82] font-medium text-[11px] whitespace-nowrap">
                                    {sub.pic}
                                  </td>

                                  {/* Actions */}
                                  <td className="py-3 px-3 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveTab('repository');
                                          setEvidenceFilterCrit(crit.id);
                                          setEvidenceSearch(sub.code);
                                        }}
                                        className="p-1.5 rounded-lg text-[#054DA0] hover:bg-[#EBF3FC] transition-colors"
                                        title="Buka Berkas Bukti Indikator Ini"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveTab('assessment_sheet');
                                          setSelectedCriterionId(crit.id);
                                        }}
                                        className="p-1.5 rounded-lg text-[#D97706] hover:bg-[#FFFBEB] transition-colors"
                                        title="Buka Lembar Asesmen"
                                      >
                                        <Edit3 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>

                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ============================================================
            MODULE 3: REPOSITORY BUKTI DIGITAL (CLOUD DRIVE & UPLOAD)
            ============================================================ */}
        {activeTab === 'repository' && (
          <div className="bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-xs space-y-6">
            
            {/* Header Repository & Action Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EEF3F8] pb-5">
              <div>
                <h3 className="font-extrabold text-lg text-[#032B5B] flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-[#054DA0]" />
                  <span>Repository Bukti Digital Akreditasi (Cloud Storage)</span>
                </h3>
                <p className="text-xs text-[#5B6B82]">
                  Pusat arsip berkas bukti akreditasi terintegrasi Google Drive, OneDrive, dan berkas pendukung simulasi.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsAddEvidenceOpen(true)}
                  className="px-3.5 py-2 text-xs font-bold bg-[#054DA0] hover:bg-[#032B5B] text-white rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Tautan Cloud</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSimUploadOpen(true)}
                  className="px-3.5 py-2 text-xs font-bold bg-[#E8F7EE] hover:bg-[#d5f3df] text-[#0E9549] rounded-xl transition-all flex items-center gap-1.5 border border-[#0E9549]/20"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Berkas Pendukung</span>
                </button>
              </div>
            </div>

            {/* Filters Toolbar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              
              {/* Search input (5 cols) */}
              <div className="md:col-span-5 relative">
                <Search className="w-4 h-4 text-[#5B6B82] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={evidenceSearch}
                  onChange={(e) => setEvidenceSearch(e.target.value)}
                  placeholder="Cari nama bukti, kode (BKT-C1), indikator…"
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#DCE5F0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#054DA0]"
                />
              </div>

              {/* Filter Criterion (4 cols) */}
              <div className="md:col-span-4">
                <select
                  value={evidenceFilterCrit}
                  onChange={(e) => setEvidenceFilterCrit(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCE5F0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#054DA0]"
                >
                  <option value="all">Semua Kriteria (C1 - C9)</option>
                  {criteria.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}: {c.shortName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter File Type (3 cols) */}
              <div className="md:col-span-3">
                <select
                  value={evidenceFilterType}
                  onChange={(e) => setEvidenceFilterType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCE5F0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#054DA0]"
                >
                  <option value="all">Semua Tipe Dokumen</option>
                  <option value="SK">SK Rektor / Dekan</option>
                  <option value="Pedoman/SOP">Pedoman & SOP</option>
                  <option value="Laporan">Laporan Kinerja / AMI</option>
                  <option value="MoA/MoU">MoU / MoA Kerjasama</option>
                  <option value="Sertifikat">Sertifikat & Akreditasi</option>
                  <option value="Borang LKPS">Borang LKPS</option>
                </select>
              </div>

            </div>

            {/* Evidences Table List */}
            {filteredEvidences.length > 0 ? (
              <div className="overflow-x-auto border border-[#DCE5F0] rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-[#5B6B82] uppercase text-[10px] font-bold border-b border-[#DCE5F0]">
                    <tr>
                      <th className="py-3 px-4">Kode Bukti</th>
                      <th className="py-3 px-4">Judul Dokumen & Indikator</th>
                      <th className="py-3 px-4">Tipe Berkas</th>
                      <th className="py-3 px-4">Penyedia Cloud</th>
                      <th className="py-3 px-4">Ukuran</th>
                      <th className="py-3 px-4">Status Verifikasi</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEF3F8]">
                    {filteredEvidences.map((ev) => (
                      <tr key={ev.id} className="hover:bg-[#FAFBFD] transition-colors">
                        
                        {/* Kode */}
                        <td className="py-3 px-4 font-mono font-bold text-[#054DA0]">
                          {ev.code}
                        </td>

                        {/* Judul & Indikator */}
                        <td className="py-3 px-4 max-w-sm">
                          <span className="font-bold text-slate-900 block text-xs">
                            {ev.title}
                          </span>
                          <span className="text-[11px] text-[#5B6B82] font-mono mt-0.5 block">
                            Indikator: <strong>{ev.indicatorCode}</strong> (Kriteria {ev.criterionId}) · Oleh {ev.uploader}
                          </span>
                        </td>

                        {/* Tipe Dokumen */}
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF3FC] text-[#054DA0]">
                            {ev.fileType}
                          </span>
                        </td>

                        {/* Cloud Provider */}
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                            {ev.cloudProvider === 'Google Drive' ? '📁 Google Drive' : '☁️ OneDrive'}
                          </span>
                        </td>

                        {/* Ukuran & Tanggal */}
                        <td className="py-3 px-4 text-[11px] text-[#5B6B82] font-mono">
                          {ev.fileSize}
                        </td>

                        {/* Status Verifikasi Asesor */}
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleVerifyEvidence(ev.id)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all ${
                              ev.verified
                                ? 'bg-[#E8F7EE] text-[#0E9549] hover:bg-[#d2f3dc]'
                                : 'bg-[#FEF3C7] text-[#92400E] hover:bg-[#fde68a]'
                            }`}
                            title="Klik untuk ubah verifikasi"
                          >
                            {ev.verified ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Terverifikasi</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3" />
                                <span>Menunggu Review</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Aksi Tautan */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={ev.cloudUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 text-xs font-bold text-[#054DA0] bg-[#EBF3FC] hover:bg-[#d7ebfe] rounded-lg transition-colors inline-flex items-center gap-1"
                            >
                              <span>Buka ↗</span>
                            </a>

                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard?.writeText(ev.cloudUrl);
                                showToast('Tautan cloud berhasil disalin!');
                              }}
                              className="p-1.5 text-[#5B6B82] hover:text-[#032B5B] rounded-lg hover:bg-slate-100"
                              title="Salin Tautan"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteEvidence(ev.id)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                              title="Hapus Bukti"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-[#5B6B82] space-y-2 border border-dashed border-[#DCE5F0] rounded-xl">
                <Search className="w-8 h-8 mx-auto text-[#054DA0]/40" />
                <p className="font-bold text-sm text-[#032B5B]">Tidak ada bukti digital yang sesuai filter</p>
                <p className="text-xs">Coba gunakan kata kunci lain atau klik "Tambah Tautan Cloud" di atas.</p>
              </div>
            )}

          </div>
        )}

        {/* ============================================================
            MODULE 4: LEMBAR ASESMEN ASESOR (ASESOR MODE AUDIT)
            ============================================================ */}
        {activeTab === 'assessment_sheet' && (
          <div className="space-y-6">
            
            {/* Asesor Workspace Banner */}
            <div className="p-6 rounded-2xl bg-[#032B5B] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#F5BA13] text-[#16202E] text-[10px] font-extrabold uppercase">
                  <span>LEMBAR KERJA ASESOR AUDIT RESMI</span>
                </div>
                <h3 className="text-xl font-extrabold text-white">
                  Lembar Penilaian & Catatan Deskriptif Asesmen Kecukupan (AK)
                </h3>
                <p className="text-xs text-[#D3E5FA]">
                  Asesor menguji kesesuaian dokumen LED & LKPS, memberikan skor skala 1-4, dan menyusun catatan audit lapangan.
                </p>
              </div>

              {/* Criterion Selector */}
              <div className="flex items-center gap-2 bg-white/10 p-2 rounded-xl backdrop-blur-xs">
                <span className="text-xs text-[#D3E5FA] font-bold">Pilih Kriteria:</span>
                <select
                  value={selectedCriterionId}
                  onChange={(e) => setSelectedCriterionId(Number(e.target.value))}
                  className="bg-white text-[#16202E] text-xs font-bold px-3 py-1.5 rounded-lg focus:outline-none"
                >
                  {criteria.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}: {c.shortName} ({c.weight}%)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Assessment Cards per Indicator in Selected Criterion */}
            {(() => {
              const currentCrit = criteria.find((c) => c.id === selectedCriterionId) || criteria[0];

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-base text-[#032B5B]">
                      Daftar Sub-Indikator: {currentCrit.code} - {currentCrit.name}
                    </h4>
                    <span className="text-xs text-[#5B6B82] font-semibold">
                      Bobot Total Kriteria: <strong>{currentCrit.weight}%</strong>
                    </span>
                  </div>

                  {currentCrit.subIndicators.map((sub) => {
                    const currentScore = sub.assessorScore ?? sub.score;
                    const currentNotes = sub.assessorNotes ?? '';
                    const currentStatus = sub.assessorStatus ?? 'Belum Dinilai';

                    return (
                      <div
                        key={sub.id}
                        className="bg-white rounded-2xl border border-[#DCE5F0] p-6 shadow-xs space-y-4"
                      >
                        {/* Indicator Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EEF3F8] pb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="px-2 py-0.5 rounded-md font-mono font-extrabold text-xs bg-[#EBF3FC] text-[#054DA0] border border-[#054DA0]/20">
                              {sub.code}
                            </span>
                            <h5 className="font-extrabold text-sm text-[#032B5B]">
                              {sub.title}
                            </h5>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs text-[#5B6B82]">
                              Nilai Tim PS: <strong>{sub.score.toFixed(2)}</strong>
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              currentStatus === 'Disetujui'
                                ? 'bg-[#E8F7EE] text-[#0E9549]'
                                : currentStatus === 'Perlu Perbaikan'
                                ? 'bg-[#FEE4E2] text-[#DC2626]'
                                : 'bg-[#FEF3C7] text-[#92400E]'
                            }`}>
                              {currentStatus}
                            </span>
                          </div>
                        </div>

                        {/* Description & Target */}
                        <p className="text-xs text-[#5B6B82] leading-relaxed">
                          {sub.desc}
                        </p>

                        {/* Assessor Rating Form (Score 1.0 - 4.0) */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#F8FAFC] p-4 rounded-xl border border-[#DCE5F0]/80">
                          
                          {/* Score Input Slider (4 cols) */}
                          <div className="md:col-span-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-[#032B5B]">
                                Nilai Asesor (1.00 - 4.00):
                              </label>
                              <span className="text-base font-extrabold text-[#D97706] font-mono">
                                {currentScore.toFixed(2)}
                              </span>
                            </div>

                            <input
                              type="range"
                              min="1.0"
                              max="4.0"
                              step="0.05"
                              value={currentScore}
                              onChange={(e) => {
                                handleUpdateAssessorScore(
                                  currentCrit.id,
                                  sub.id,
                                  parseFloat(e.target.value),
                                  currentNotes,
                                  currentStatus
                                );
                              }}
                              className="w-full h-2 bg-[#DCE5F0] rounded-lg appearance-none cursor-pointer accent-[#D97706]"
                            />

                            <div className="flex justify-between text-[10px] text-[#5B6B82] font-mono">
                              <span>1.0 (Buruk)</span>
                              <span>2.0 (Cukup)</span>
                              <span>3.0 (Baik)</span>
                              <span>4.0 (Unggul)</span>
                            </div>
                          </div>

                          {/* Descriptive Notes Textarea (6 cols) */}
                          <div className="md:col-span-6 space-y-1">
                            <label className="text-xs font-bold text-[#032B5B]">
                              Catatan Deskriptif & Temuan Bukti Asesor:
                            </label>
                            <textarea
                              rows={2}
                              value={currentNotes}
                              onChange={(e) => {
                                handleUpdateAssessorScore(
                                  currentCrit.id,
                                  sub.id,
                                  currentScore,
                                  e.target.value,
                                  currentStatus
                                );
                              }}
                              placeholder="Kelebihan, kelemahan, kelengkapan berkas fisik, dan rekomendasi asesmen lapangan..."
                              className="w-full p-2.5 text-xs rounded-lg border border-[#DCE5F0] bg-white focus:outline-none focus:border-[#D97706]"
                            />
                          </div>

                          {/* Verification Status (2 cols) */}
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-[#032B5B] block">
                              Verifikasi:
                            </label>
                            <select
                              value={currentStatus}
                              onChange={(e) => {
                                handleUpdateAssessorScore(
                                  currentCrit.id,
                                  sub.id,
                                  currentScore,
                                  currentNotes,
                                  e.target.value as any
                                );
                              }}
                              className="w-full p-2 text-xs rounded-lg border border-[#DCE5F0] bg-white font-bold text-slate-800 focus:outline-none"
                            >
                              <option value="Disetujui">Disetujui</option>
                              <option value="Perlu Perbaikan">Revisi</option>
                              <option value="Belum Dinilai">Pending</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => showToast(`Catatan ${sub.code} tersimpan!`)}
                              className="w-full py-1.5 px-2 bg-[#054DA0] hover:bg-[#032B5B] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                            >
                              <Save className="w-3 h-3" />
                              <span>Simpan</span>
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

          </div>
        )}

        {/* ============================================================
            MODULE 5: CATATAN DISKUSI & AUDIT TRAIL KOLABORATIF
            ============================================================ */}
        {activeTab === 'discussions' && (
          <div className="bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-xs space-y-6">
            
            {/* Sub-tab Switcher: Diskusi Tim vs Log Audit Trail */}
            <div className="flex items-center justify-between border-b border-[#EEF3F8] pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-[#032B5B]">
                  Kolaborasi Tim & Audit Trail Akreditasi
                </h3>
                <p className="text-xs text-[#5B6B82]">
                  Ruang komunikasi terkoordinasi antar tim penyusun dan rekam jejak perubahan data instrumen.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-[#F4F7FC] p-1 rounded-xl border border-[#DCE5F0]">
                <button
                  type="button"
                  onClick={() => setActiveDiscussionSubTab('threads')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    activeDiscussionSubTab === 'threads'
                      ? 'bg-[#054DA0] text-white shadow-xs'
                      : 'text-[#5B6B82] hover:text-[#032B5B]'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Forum Diskusi ({comments.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDiscussionSubTab('audit_trail')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    activeDiscussionSubTab === 'audit_trail'
                      ? 'bg-[#054DA0] text-white shadow-xs'
                      : 'text-[#5B6B82] hover:text-[#032B5B]'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Log Riwayat Audit ({auditLogs.length})</span>
                </button>
              </div>
            </div>

            {/* SUB-VIEW 1: FORUM DISKUSI */}
            {activeDiscussionSubTab === 'threads' && (
              <div className="space-y-6">
                
                {/* Form Kirim Catatan Baru */}
                <form
                  onSubmit={handleAddComment}
                  className="p-4 rounded-xl border border-[#DCE5F0] bg-[#F8FAFC] space-y-3"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="font-extrabold text-xs text-[#032B5B] flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-[#054DA0]" />
                      <span>Tulis Catatan / Diskusi Koordinasi Baru</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <select
                        value={newCommentCritId}
                        onChange={(e) => setNewCommentCritId(Number(e.target.value))}
                        className="p-1.5 text-xs rounded-lg border border-[#DCE5F0] bg-white font-semibold"
                      >
                        {criteria.map((c) => (
                          <option key={c.id} value={c.id}>
                            Kriteria {c.id}: {c.shortName}
                          </option>
                        ))}
                      </select>

                      <select
                        value={newCommentUrgency}
                        onChange={(e) => setNewCommentUrgency(e.target.value as any)}
                        className="p-1.5 text-xs rounded-lg border border-[#DCE5F0] bg-white font-semibold"
                      >
                        <option value="Normal">Prioritas: Normal</option>
                        <option value="Penting">Prioritas: Penting</option>
                        <option value="Mendesak">Prioritas: Mendesak</option>
                      </select>
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    required
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Tuliskan catatan tindak lanjut, kekurangan data LKPS, atau instruksi revisi bukti..."
                    className="w-full p-3 text-xs rounded-xl border border-[#DCE5F0] bg-white focus:outline-none focus:border-[#054DA0]"
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold text-white bg-[#054DA0] hover:bg-[#032B5B] rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Catatan</span>
                    </button>
                  </div>
                </form>

                {/* Comment Feed */}
                <div className="space-y-3">
                  {comments.map((comm) => (
                    <div
                      key={comm.id}
                      className={`p-4 rounded-xl border transition-all ${
                        comm.urgency === 'Mendesak'
                          ? 'border-[#DC2626] bg-[#FEF2F2]'
                          : comm.urgency === 'Penting'
                          ? 'border-[#D97706] bg-[#FFFBEB]'
                          : 'border-[#DCE5F0] bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full ${comm.avatarBg} text-white font-extrabold flex items-center justify-center text-xs shadow-xs`}>
                            {comm.authorName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-extrabold text-xs text-[#032B5B] block">
                              {comm.authorName}
                            </span>
                            <span className="text-[10px] text-[#5B6B82] font-semibold">
                              {comm.authorRole} · {comm.timestamp}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF3FC] text-[#054DA0]">
                            Kriteria {comm.criterionId}
                          </span>
                          {comm.urgency !== 'Normal' && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              comm.urgency === 'Mendesak' ? 'bg-[#FEE4E2] text-[#DC2626]' : 'bg-[#FEF3C7] text-[#92400E]'
                            }`}>
                              {comm.urgency}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-[#16202E] leading-relaxed whitespace-pre-wrap pl-10">
                        {comm.text}
                      </p>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* SUB-VIEW 2: AUDIT TRAIL (REKAM JEJAK AKTIVITAS) */}
            {activeDiscussionSubTab === 'audit_trail' && (
              <div className="space-y-4">
                <div className="overflow-x-auto border border-[#DCE5F0] rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8FAFC] text-[#5B6B82] uppercase text-[10px] font-bold border-b border-[#DCE5F0]">
                      <tr>
                        <th className="py-3 px-4">Waktu</th>
                        <th className="py-3 px-4">Aksi</th>
                        <th className="py-3 px-4">Deskripsi Perubahan</th>
                        <th className="py-3 px-4">Pelaku / Aktor</th>
                        <th className="py-3 px-4">Kriteria</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EEF3F8]">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-[#FAFBFD] transition-colors">
                          <td className="py-3 px-4 font-mono text-[11px] text-[#5B6B82] whitespace-nowrap">
                            {log.timestamp}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              log.action === 'Update Skor'
                                ? 'bg-[#EBF3FC] text-[#054DA0]'
                                : log.action === 'Unggah Berkas'
                                ? 'bg-[#E8F7EE] text-[#0E9549]'
                                : log.action === 'Verifikasi Asesor'
                                ? 'bg-[#FEF3C7] text-[#92400E]'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {log.action}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-800 max-w-md">
                            {log.description}
                          </td>
                          <td className="py-3 px-4 text-[#5B6B82] whitespace-nowrap">
                            <strong>{log.actor}</strong> ({log.role})
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-[#054DA0]">
                            {log.criterionCode || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* ==========================================
          MODAL: TAMBAH TAUTAN CLOUD DRIVE
          ========================================== */}
      {isAddEvidenceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#DCE5F0] overflow-hidden p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF3F8]">
              <h4 className="font-extrabold text-base text-[#032B5B] flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-[#054DA0]" />
                <span>Tambah Tautan Bukti Digital Cloud</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsAddEvidenceOpen(false)}
                className="p-1 text-[#5B6B82] hover:text-[#032B5B] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEvidence} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#16202E] mb-1">
                  Judul Dokumen / Nama Berkas *
                </label>
                <input
                  type="text"
                  required
                  value={newEvTitle}
                  onChange={(e) => setNewEvTitle(e.target.value)}
                  placeholder="Contoh: SK Rektor Penetapan Kurikulum OBE MKM 2026"
                  className="w-full px-3 py-2 rounded-lg border border-[#DCE5F0] focus:outline-none focus:border-[#054DA0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#16202E] mb-1">
                    Kriteria Terkait *
                  </label>
                  <select
                    value={newEvCritId}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      setNewEvCritId(id);
                      const defaultInd = criteria.find((c) => c.id === id)?.subIndicators[0]?.code || 'C.1.1';
                      setNewEvIndicator(defaultInd);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE5F0] bg-white focus:outline-none"
                  >
                    {criteria.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code}: {c.shortName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#16202E] mb-1">
                    Sub-Indikator *
                  </label>
                  <select
                    value={newEvIndicator}
                    onChange={(e) => setNewEvIndicator(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE5F0] bg-white focus:outline-none"
                  >
                    {criteria.find((c) => c.id === newEvCritId)?.subIndicators.map((s) => (
                      <option key={s.id} value={s.code}>
                        {s.code} - {s.title.slice(0, 24)}…
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#16202E] mb-1">
                    Tipe Berkas
                  </label>
                  <select
                    value={newEvType}
                    onChange={(e) => setNewEvType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE5F0] bg-white focus:outline-none"
                  >
                    <option value="SK">SK Rektor / Dekan</option>
                    <option value="Pedoman/SOP">Pedoman / SOP</option>
                    <option value="Laporan">Laporan Kinerja / AMI</option>
                    <option value="MoA/MoU">MoA / Kerjasama</option>
                    <option value="Sertifikat">Sertifikat / Akreditasi</option>
                    <option value="Borang LKPS">Borang LKPS</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#16202E] mb-1">
                    Penyedia Cloud
                  </label>
                  <select
                    value={newEvProvider}
                    onChange={(e) => setNewEvProvider(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE5F0] bg-white focus:outline-none"
                  >
                    <option value="Google Drive">Google Drive</option>
                    <option value="OneDrive">Microsoft OneDrive</option>
                    <option value="Dropbox">Dropbox</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#16202E] mb-1">
                  Tautan Cloud URL (Shareable Link) *
                </label>
                <input
                  type="url"
                  required
                  value={newEvUrl}
                  onChange={(e) => setNewEvUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full px-3 py-2 rounded-lg border border-[#DCE5F0] focus:outline-none focus:border-[#054DA0] font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EEF3F8]">
                <button
                  type="button"
                  onClick={() => setIsAddEvidenceOpen(false)}
                  className="px-4 py-2 font-bold text-[#5B6B82] hover:bg-[#F4F7FC] rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-[#054DA0] hover:bg-[#032B5B] rounded-lg shadow-xs transition-colors"
                >
                  Simpan Tautan Bukti
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: SIMULASI UPLOAD BERKAS PENDUKUNG
          ========================================== */}
      {isSimUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#DCE5F0] overflow-hidden p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF3F8]">
              <h4 className="font-extrabold text-base text-[#032B5B] flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#0E9549]" />
                <span>Simulasi Unggah Berkas Pendukung Akreditasi</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsSimUploadOpen(false)}
                className="p-1 text-[#5B6B82] hover:text-[#032B5B] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border-2 border-dashed border-[#054DA0]/40 rounded-2xl p-8 text-center space-y-3 bg-[#EBF3FC]/40">
              <div className="w-14 h-14 rounded-full bg-[#EBF3FC] text-[#054DA0] mx-auto flex items-center justify-center text-2xl shadow-inner">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <p className="font-extrabold text-sm text-[#032B5B]">
                  Pilih berkas dokumen PDF/Excel atau drag & drop ke area ini
                </p>
                <p className="text-xs text-[#5B6B82] mt-1">
                  Format yang didukung: PDF, DOCX, XLSX. Maksimal 25 MB per dokumen.
                </p>
              </div>

              <input
                type="file"
                id="sim-file-input"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const newEvidence: DigitalEvidence = {
                      id: `ev-${Date.now()}`,
                      code: `BKT-SIM-${evidences.length + 1}`,
                      title: file.name.replace(/\.[^/.]+$/, ''),
                      criterionId: 6,
                      indicatorCode: 'C.6.1',
                      fileType: 'Pedoman/SOP',
                      cloudProvider: 'Simulasi Upload',
                      cloudUrl: 'https://drive.google.com/drive/folders/simulasi-mkm',
                      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                      uploadDate: new Date().toISOString().slice(0, 10),
                      uploader: activeRole === 'admin' ? 'Admin Tim Akreditasi' : 'Asesor Audit',
                      verified: true,
                    };
                    setEvidences((prev) => [newEvidence, ...prev]);
                    setIsSimUploadOpen(false);
                    showToast(`Berkas "${file.name}" berhasil diunggah ke repository!`);
                  }
                }}
              />

              <label
                htmlFor="sim-file-input"
                className="inline-block px-4 py-2 bg-[#054DA0] hover:bg-[#032B5B] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors"
              >
                Pilih Berkas dari Komputer
              </label>
            </div>

            <p className="text-[11px] text-[#5B6B82] text-center">
              Berkas yang diunggah akan otomatis ditambahkan ke daftar bukti digital dan diindeks per kriteria.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
