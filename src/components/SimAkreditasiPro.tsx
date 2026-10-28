import React, { useState, useMemo, useEffect } from 'react';
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
  Printer,
  HelpCircle,
  FileCheck,
  Info,
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
} from 'recharts';
import {
  LAMPTKES_CRITERIA,
  LAMPTKES_MAIN_ELEMENTS,
  DEFAULT_LAMPTKES_EVIDENCES,
  CriterionLamptkes,
  SubCriterion,
  MainElement,
  SupportingDocTemplate,
  DigitalEvidenceItem,
  ElementLedAnswer,
} from '../data/lamptkes2025Data';

// Default Master Google Drive URL
export const GDRIVE_AKREDITASI_FOLDER_URL =
  'https://drive.google.com/drive/folders/1gviyTRdU96dgYbFBlOQkPeFWfeQvP0Ab?usp=sharing';

// Discussion comment and audit trail interfaces
export interface DiscussionComment {
  id: string;
  authorName: string;
  authorRole: 'Admin Tim Akreditasi' | 'Dosen Tim Penyusun' | 'Asesor Audit' | 'Perwakilan Mahasiswa';
  criterionId: number;
  elementCode?: string;
  text: string;
  timestamp: string;
  urgency: 'Normal' | 'Penting' | 'Mendesak';
  avatarBg: string;
}

export interface AuditTrailLog {
  id: string;
  action: 'Update Narasi LED' | 'Update Skor' | 'Unggah Berkas' | 'Verifikasi Asesor' | 'Update Dokumen' | 'Komentar';
  description: string;
  actor: string;
  role: string;
  timestamp: string;
  elementCode?: string;
  criterionNumber?: number;
}

const INITIAL_COMMENTS: DiscussionComment[] = [
  {
    id: 'comm-1',
    authorName: 'Dr. Rochmawati, S.KM., M.Kes.',
    authorRole: 'Dosen Tim Penyusun',
    criterionId: 1,
    elementCode: '1.1.2',
    text: 'Bukti berita acara FGD perumusan VMTS bersama Dinkes Kalbar dan PERSAKMI sudah dimasukkan ke Drive Kriteria 1. Mohon dicek kembali naskahnya.',
    timestamp: '2026-10-27 09:30',
    urgency: 'Penting',
    avatarBg: 'bg-blue-600',
  },
  {
    id: 'comm-2',
    authorName: 'Prof. Dr. Ir. H. Sudirman, M.Kes.',
    authorRole: 'Asesor Audit',
    criterionId: 2,
    elementCode: '2.1.1',
    text: 'Rumusan CPL Magister MKM sudah sangat baik mengakomodasi KKNI Level 8 dan keunggulan lahan basah tropis. Pastikan tracer study angkatan pertama disajikan lengkap.',
    timestamp: '2026-10-27 10:15',
    urgency: 'Normal',
    avatarBg: 'bg-emerald-600',
  },
  {
    id: 'comm-3',
    authorName: 'Admin Tim Akreditasi',
    authorRole: 'Admin Tim Akreditasi',
    criterionId: 5,
    elementCode: '5.5.3',
    text: 'Publikasi internasional bereputasi DTPS MKM bertambah 4 artikel Scopus Q1-Q2 di tahun 2024. Repositori bukti sudah diperbarui.',
    timestamp: '2026-10-26 15:20',
    urgency: 'Normal',
    avatarBg: 'bg-indigo-600',
  },
];

const INITIAL_AUDIT_LOGS: AuditTrailLog[] = [
  {
    id: 'log-1',
    action: 'Update Narasi LED',
    description: 'Narasi Elemen 2.1.3 (Kompetensi Abad 21 dan Evidence-Based Public Health) diperbarui ke versi 2.1.',
    actor: 'Dr. Rochmawati, S.KM., M.Kes.',
    role: 'Dosen Tim Penyusun',
    timestamp: '2026-10-27 11:20',
    elementCode: '2.1.3',
    criterionNumber: 2,
  },
  {
    id: 'log-2',
    action: 'Verifikasi Asesor',
    description: 'Asesor memverifikasi Elemen 1.1.1 dengan skor 3.90 (Sangat Sesuai).',
    actor: 'Prof. Dr. Asesor LAM-PTKes',
    role: 'Asesor Audit',
    timestamp: '2026-10-27 10:45',
    elementCode: '1.1.1',
    criterionNumber: 1,
  },
  {
    id: 'log-3',
    action: 'Unggah Berkas',
    description: 'Dokumen BUKTI-K5-02 (Roadmap Riset Lahan Basah Tropis) ditautkan ke folder Google Drive.',
    actor: 'Admin Akreditasi',
    role: 'Admin Tim Akreditasi',
    timestamp: '2026-10-26 14:10',
    criterionNumber: 5,
  },
];

// Helper to generate starter draft answers for all 121 elements
const generateDefaultAnswers = (): { [code: string]: ElementLedAnswer } => {
  const result: { [code: string]: ElementLedAnswer } = {};

  LAMPTKES_MAIN_ELEMENTS.forEach((el, index) => {
    // Generate starter narrative based on element context
    const initialChecked: { [order: number]: boolean } = {};
    el.complianceItems.forEach((ci) => {
      // Default to checked for most to show high readiness
      initialChecked[ci.order] = true;
    });

    // Realistic baseline score between 3.65 and 3.95
    const baseScore = Number((3.65 + ((index % 5) * 0.06)).toFixed(2));

    let sampleNarrative = `Program Studi Magister Kesehatan Masyarakat (S2 MKM) FIKPsi Universitas Muhammadiyah Pontianak telah memenuhi elemen ${el.code} secara terencana dan konsisten. `;
    
    if (el.criterionId === 1) {
      sampleNarrative += `Perumusan dan pelaksanaan Visi, Misi, Tujuan, dan Strategi (VMTS) berakar kuat pada nilai keislaman Muhammadiyah dan keunggulan ekologi kesehatan wilayah lahan basah tropis, serta disahkan melalui SK Dekan dan Surat Keputusan Rektor. Partisipasi seluruh pemangku kepentingan (Dinas Kesehatan Prov Kalbar, Rumah Sakit Mitra, IAKMI, dan alumni) terdokumentasi dalam notula serta berita acara resmi.`;
    } else if (el.criterionId === 2) {
      sampleNarrative += `Kurikulum S2 MKM disusun berlandaskan Outcome-Based Education (OBE) dan Standar Nasional Pendidikan Tinggi jenjang KKNI Level 8 (beban 38 SKS). Mata kuliah inti, peminatan (AKK, Epidemiologi, K3, Promkes), serta penulisan tesis memadukan kajian evidence-based public health mutakhir dengan rujukan jurnal internasional bereputasi dan modul lapangan terintegrasi.`;
    } else if (el.criterionId === 3) {
      sampleNarrative += `Sistem penilaian menerapkan prinsip transparansi, otentisitas, dan akuntabilitas melalui penilaian formatif, rubrik komprehensif ujian tesis, dan pengecekan uji similaritas Turnitin (ambang batas maksimal 20%). Mekanisme banding nilai dan evaluasi berkala distribusi mutu nilai terkelola dalam SIAKAD terpadu.`;
    } else if (el.criterionId === 4) {
      sampleNarrative += `Proses seleksi penerimaan mahasiswa baru (Maba) berjalan kompetitif dan inklusif dengan tes potensi akademik, TOEFL, wawancara portofolio, serta matrikulasi bagi lulusan non-kesehatan masyarakat. Layanan bimbingan akademik terstruktur, student lounge pascasarjana, dan satgas PPKS menjamin lingkungan belajar yang aman dan kondusif.`;
    } else if (el.criterionId === 5) {
      sampleNarrative += `Seluruh Dosen Tetap Program Studi (DTPS) berkualifikasi Doktor (S3) bidang kesehatan masyarakat dengan jabatan Lektor Kepala hingga Guru Besar. Peta jalan penelitian dan pengabdian kepada masyarakat (PkM) difokuskan pada penanggulangan masalah kesehatan lahan basah tropis dengan produktivitas publikasi Scopus/WoS dan perolehan Hak Cipta terdaftar.`;
    } else if (el.criterionId === 6) {
      sampleNarrative += `Fasilitas fisik meliputi ruang kuliah multimedia, Laboratorium Kesehatan Lingkungan dan K3 terstandarisasi, akses penuh ke pangkalan data e-journal internasional (ScienceDirect, SpringerLink, ProQuest), serta lisensi software statistik (SPSS, Epi-Info, NVivo). Tata kelola keuangan memperoleh predikat Wajar Tanpa Pengecualian (WTP).`;
    } else if (el.criterionId === 7) {
      sampleNarrative += `Sistem Penjaminan Mutu Internal (SPMI) terlaksana secara terstruktur melalui siklus PPEPP (Penetapan, Pelaksanaan, Evaluasi, Pengendalian, dan Peningkatan). Audit Mutu Internal (AMI) berkala dan Rapat Tinjauan Manajemen (RTM) menghasilkan peningkatan target standar mutu secara berkelanjutan.`;
    } else {
      sampleNarrative += `Tata kelola UPPS dan Program Studi mencerminkan Good University Governance yang transparan, akuntabel, dan partisipatif. Layanan administrasi terdigitalisasi dalam enterprise campus system dengan kerja sama tridarma aktif bersama instansi kesehatan pemerintah dan mitra internasional.`;
    }

    result[el.code] = {
      elementCode: el.code,
      narrative: sampleNarrative,
      complianceChecked: initialChecked,
      score: baseScore,
      status: 'Final',
      author: 'Dr. Rochmawati, S.KM., M.Kes.',
      lastUpdated: '2026-10-27 10:00',
      version: 2,
      assessorScore: Number((baseScore - 0.05).toFixed(2)),
      assessorNotes: 'Bukti sahih lengkap dan narasi sangat komprehensif.',
      assessorStatus: 'Disetujui',
    };
  });

  return result;
};

interface SimAkreditasiProProps {
  onBackToPortal?: () => void;
}

export const SimAkreditasiPro: React.FC<SimAkreditasiProProps> = ({ onBackToPortal }) => {
  // Mode: Admin Tim Akreditasi vs Asesor Audit
  const [activeRole, setActiveRole] = useState<'admin' | 'assessor'>('admin');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'led_form' | 'repository' | 'assessor_sheet' | 'discussions' | 'export_led'>('dashboard');

  // Master Google Drive URL
  const [masterGdriveUrl, setMasterGdriveUrl] = useState<string>(() => {
    return localStorage.getItem('mkm_sim_akreditasi_gdrive_url') || GDRIVE_AKREDITASI_FOLDER_URL;
  });
  const [isEditMasterDriveOpen, setIsEditMasterDriveOpen] = useState(false);
  const [tempMasterGdriveUrl, setTempMasterGdriveUrl] = useState(masterGdriveUrl);

  // Selected Criterion and Sub-Criterion for Navigation
  const [selectedCritNumber, setSelectedCritNumber] = useState<number>(1);
  const activeCriterion = useMemo(() => {
    return LAMPTKES_CRITERIA.find((c) => c.number === selectedCritNumber) || LAMPTKES_CRITERIA[0];
  }, [selectedCritNumber]);

  const [selectedSubCritCode, setSelectedSubCritCode] = useState<string>('1.1');

  // When selected criterion changes, select its first sub-criterion
  useEffect(() => {
    if (activeCriterion.subCriteria.length > 0) {
      setSelectedSubCritCode(activeCriterion.subCriteria[0].code);
    }
  }, [activeCriterion]);

  // Selected Element for detailed editing
  const [selectedElementCode, setSelectedElementCode] = useState<string>('1.1.1');
  const activeElement = useMemo(() => {
    return LAMPTKES_MAIN_ELEMENTS.find((el) => el.code === selectedElementCode) || LAMPTKES_MAIN_ELEMENTS[0];
  }, [selectedElementCode]);

  // Search & Filter for Elements
  const [elementSearchQuery, setElementSearchQuery] = useState('');
  const [elementStatusFilter, setElementStatusFilter] = useState<'all' | 'Final' | 'Review' | 'Draft'>('all');

  // LED Answers State with persistence
  const [answers, setAnswers] = useState<{ [code: string]: ElementLedAnswer }>(() => {
    try {
      const saved = localStorage.getItem('mkm_lamptkes_2025_answers');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return generateDefaultAnswers();
  });

  // Digital Evidences State with persistence
  const [evidences, setEvidences] = useState<DigitalEvidenceItem[]>(() => {
    try {
      const saved = localStorage.getItem('mkm_lamptkes_2025_evidences');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_LAMPTKES_EVIDENCES;
  });

  // Dynamic Supporting Documents State (allows adding custom types beyond default list)
  const [customSupportingDocs, setCustomSupportingDocs] = useState<SupportingDocTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('mkm_lamptkes_2025_custom_docs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Modal: Add Custom Supporting Document
  const [isAddCustomDocOpen, setIsAddCustomDocOpen] = useState(false);
  const [newDocCritId, setNewDocCritId] = useState<number>(1);
  const [newDocName, setNewDocName] = useState('');
  const [newDocCode, setNewDocCode] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<SupportingDocTemplate['category']>('Kebijakan/SK');
  const [newDocDesc, setNewDocDesc] = useState('');
  const [newDocMandatory, setNewDocMandatory] = useState(true);

  // Modal: Add Digital Evidence
  const [isAddEvidenceOpen, setIsAddEvidenceOpen] = useState(false);
  const [newEvTitle, setNewEvTitle] = useState('');
  const [newEvCode, setNewEvCode] = useState('');
  const [newEvCritId, setNewEvCritId] = useState<number>(1);
  const [newEvElementCode, setNewEvElementCode] = useState('1.1.1');
  const [newEvType, setNewEvType] = useState('SK/Kebijakan');
  const [newEvProvider, setNewEvProvider] = useState<DigitalEvidenceItem['cloudProvider']>('Google Drive');
  const [newEvUrl, setNewEvUrl] = useState(masterGdriveUrl);
  const [newEvSize, setNewEvSize] = useState('3.2 MB (PDF)');

  // Discussions and Audit Trail
  const [comments, setComments] = useState<DiscussionComment[]>(INITIAL_COMMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditTrailLog[]>(INITIAL_AUDIT_LOGS);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentCritId, setNewCommentCritId] = useState<number>(1);
  const [newCommentUrgency, setNewCommentUrgency] = useState<'Normal' | 'Penting' | 'Mendesak'>('Normal');
  const [activeDiscussionSubTab, setActiveDiscussionSubTab] = useState<'threads' | 'audit_trail'>('threads');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('mkm_lamptkes_2025_answers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem('mkm_lamptkes_2025_evidences', JSON.stringify(evidences));
  }, [evidences]);

  useEffect(() => {
    localStorage.setItem('mkm_lamptkes_2025_custom_docs', JSON.stringify(customSupportingDocs));
  }, [customSupportingDocs]);

  useEffect(() => {
    localStorage.setItem('mkm_sim_akreditasi_gdrive_url', masterGdriveUrl);
  }, [masterGdriveUrl]);

  // -------------------------------------------------------------------------
  // METRICS & SCORE SIMULATOR CALCULATIONS (8 KRITERIA LAM-PTKES)
  // -------------------------------------------------------------------------

  // Calculate scores per criterion
  const criteriaScores = useMemo(() => {
    return LAMPTKES_CRITERIA.map((crit) => {
      const critElements = LAMPTKES_MAIN_ELEMENTS.filter((el) => el.criterionId === crit.id);
      if (critElements.length === 0) return { ...crit, avgScore: 4.0, assessorAvgScore: 4.0, progressPct: 100, elementCount: 0 };

      let totalScore = 0;
      let totalAssessorScore = 0;
      let filledElements = 0;

      critElements.forEach((el) => {
        const ans = answers[el.code];
        if (ans) {
          totalScore += ans.score;
          totalAssessorScore += ans.assessorScore || ans.score;
          if (ans.narrative && ans.narrative.trim().length > 30) {
            filledElements++;
          }
        } else {
          totalScore += 3.5;
          totalAssessorScore += 3.5;
        }
      });

      const avgScore = Number((totalScore / critElements.length).toFixed(2));
      const assessorAvgScore = Number((totalAssessorScore / critElements.length).toFixed(2));
      const progressPct = Math.round((filledElements / critElements.length) * 100);

      return {
        ...crit,
        avgScore,
        assessorAvgScore,
        progressPct,
        elementCount: critElements.length,
        filledElements,
      };
    });
  }, [answers]);

  // Overall Weighted Score
  const totalWeight = useMemo(() => {
    return LAMPTKES_CRITERIA.reduce((sum, c) => sum + c.weight, 0);
  }, []);

  const totalProdiScore = useMemo(() => {
    const weightedSum = criteriaScores.reduce((sum, c) => sum + c.avgScore * c.weight, 0);
    return Number((weightedSum / totalWeight).toFixed(2));
  }, [criteriaScores, totalWeight]);

  const totalAssessorScore = useMemo(() => {
    const weightedSum = criteriaScores.reduce((sum, c) => sum + c.assessorAvgScore * c.weight, 0);
    return Number((weightedSum / totalWeight).toFixed(2));
  }, [criteriaScores, totalWeight]);

  // Accreditation Grade Calculation (LAM-PTKes Scale)
  const getAccreditationGrade = (score: number) => {
    if (score >= 3.61) {
      return {
        title: 'Unggul',
        badgeColor: 'bg-emerald-600 text-white',
        border: 'border-emerald-500',
        textColor: 'text-emerald-400',
        desc: 'Memenuhi seluruh kriteria mutu secara istimewa dan melampaui Standar Nasional Pendidikan Tinggi (SN-Dikti).',
      };
    } else if (score >= 3.01) {
      return {
        title: 'Baik Sekali',
        badgeColor: 'bg-blue-600 text-white',
        border: 'border-blue-500',
        textColor: 'text-blue-400',
        desc: 'Memenuhi Standar Nasional Pendidikan Tinggi dengan kinerja sangat memuaskan.',
      };
    } else if (score >= 2.0) {
      return {
        title: 'Baik',
        badgeColor: 'bg-amber-600 text-white',
        border: 'border-amber-500',
        textColor: 'text-amber-400',
        desc: 'Memenuhi standar minimal penyelenggaraan program studi magister.',
      };
    } else {
      return {
        title: 'Tidak Terakreditasi',
        badgeColor: 'bg-rose-600 text-white',
        border: 'border-rose-500',
        textColor: 'text-rose-400',
        desc: 'Belum memenuhi ambang batas minimum kriteria LAM-PTKes.',
      };
    }
  };

  const prodiGrade = getAccreditationGrade(totalProdiScore);
  const assessorGrade = getAccreditationGrade(totalAssessorScore);

  // Overall LED completion percentage
  const totalElementsCount = LAMPTKES_MAIN_ELEMENTS.length; // 121
  const totalCompletedElements = useMemo(() => {
    return Object.values(answers).filter((a) => a.narrative && a.narrative.trim().length > 30).length;
  }, [answers]);
  const overallProgressPct = Math.round((totalCompletedElements / totalElementsCount) * 100);

  // Filtered elements list for navigation
  const filteredElements = useMemo(() => {
    return LAMPTKES_MAIN_ELEMENTS.filter((el) => {
      // Filter by criterion
      if (el.criterionId !== selectedCritNumber) return false;

      // Filter by sub-criterion if selected
      if (selectedSubCritCode && el.subCriterionId !== `sub-${selectedSubCritCode}`) {
        // If sub-criterion is selected, match
      }

      // Filter by search query (code or question)
      if (elementSearchQuery.trim()) {
        const q = elementSearchQuery.toLowerCase();
        const matchCode = el.code.toLowerCase().includes(q);
        const matchQuestion = el.question.toLowerCase().includes(q);
        const matchBenchmark = el.benchmark?.toLowerCase().includes(q) || false;
        if (!matchCode && !matchQuestion && !matchBenchmark) return false;
      }

      // Filter by status
      if (elementStatusFilter !== 'all') {
        const ans = answers[el.code];
        if (!ans || ans.status !== elementStatusFilter) return false;
      }

      return true;
    });
  }, [selectedCritNumber, selectedSubCritCode, elementSearchQuery, elementStatusFilter, answers]);

  // Combined supporting documents for active criterion (default + user added)
  const currentCriterionSupportingDocs = useMemo(() => {
    const def = activeCriterion.supportingDocuments;
    const custom = customSupportingDocs.filter((d) => d.criterionId === activeCriterion.id);
    return [...def, ...custom];
  }, [activeCriterion, customSupportingDocs]);

  // -------------------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------------------

  // Update LED Narrative
  const handleUpdateNarrative = (elementCode: string, newText: string) => {
    setAnswers((prev) => {
      const existing = prev[elementCode] || {
        elementCode,
        narrative: '',
        complianceChecked: {},
        score: 3.8,
        status: 'Draft',
        author: 'Dr. Rochmawati, S.KM., M.Kes.',
        lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
        version: 1,
      };
      return {
        ...prev,
        [elementCode]: {
          ...existing,
          narrative: newText,
          lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
          version: existing.version + 1,
        },
      };
    });
  };

  // Toggle Compliance Checkbox
  const handleToggleCompliance = (elementCode: string, order: number) => {
    setAnswers((prev) => {
      const existing = prev[elementCode];
      const currentChecked = existing?.complianceChecked || {};
      const newChecked = { ...currentChecked, [order]: !currentChecked[order] };

      return {
        ...prev,
        [elementCode]: {
          ...existing,
          complianceChecked: newChecked,
          lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
        },
      };
    });
  };

  // Update Element Score & Status
  const handleUpdateScore = (elementCode: string, score: number) => {
    setAnswers((prev) => ({
      ...prev,
      [elementCode]: {
        ...prev[elementCode],
        score,
        lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
      },
    }));
  };

  const handleUpdateStatus = (elementCode: string, status: 'Draft' | 'Review' | 'Final') => {
    setAnswers((prev) => ({
      ...prev,
      [elementCode]: {
        ...prev[elementCode],
        status,
        lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
      },
    }));
    showToast(`Status Elemen ${elementCode} diubah menjadi "${status}".`);
  };

  // Assessor Review Handlers
  const handleUpdateAssessorReview = (elementCode: string, assessorScore: number, notes: string, status: 'Disetujui' | 'Perlu Perbaikan') => {
    setAnswers((prev) => ({
      ...prev,
      [elementCode]: {
        ...prev[elementCode],
        assessorScore,
        assessorNotes: notes,
        assessorStatus: status,
      },
    }));

    // Add audit log
    const newLog: AuditTrailLog = {
      id: `log-${Date.now()}`,
      action: 'Verifikasi Asesor',
      description: `Asesor memperbarui penilaian Elemen ${elementCode} (Skor: ${assessorScore}, Status: ${status}).`,
      actor: 'Asesor Audit',
      role: 'Asesor Audit',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      elementCode,
      criterionNumber: activeCriterion.number,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`Penilaian Asesor untuk Elemen ${elementCode} berhasil disimpan.`);
  };

  // Save Master Drive URL
  const handleSaveMasterDriveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempMasterGdriveUrl.trim()) return;
    setMasterGdriveUrl(tempMasterGdriveUrl.trim());
    setIsEditMasterDriveOpen(false);
    showToast('Tautan Master Google Drive berhasil diperbarui!');
  };

  // Copy Master Drive URL
  const handleCopyDriveUrl = () => {
    navigator.clipboard.writeText(masterGdriveUrl);
    showToast('Tautan Google Drive berhasil disalin ke papan klip!');
  };

  // Add Custom Supporting Document Handler
  const handleAddCustomDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    const newDoc: SupportingDocTemplate = {
      id: `doc-custom-${Date.now()}`,
      criterionId: newDocCritId,
      code: newDocCode.trim() || `DOC-K${newDocCritId}-CUST`,
      name: newDocName.trim(),
      category: newDocCategory,
      description: newDocDesc.trim() || 'Dokumen pendukung kriteria tambahan prodi.',
      isMandatory: newDocMandatory,
    };

    setCustomSupportingDocs((prev) => [...prev, newDoc]);
    setIsAddCustomDocOpen(false);
    setNewDocName('');
    setNewDocCode('');
    setNewDocDesc('');
    showToast(`Dokumen pendukung baru berhasil ditambahkan ke Kriteria ${newDocCritId}!`);
  };

  // Add Digital Evidence Item
  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvTitle.trim()) return;

    const newEvidence: DigitalEvidenceItem = {
      id: `ev-${Date.now()}`,
      code: newEvCode.trim() || `BUKTI-K${newEvCritId}-${Date.now().toString().slice(-3)}`,
      title: newEvTitle.trim(),
      criterionId: newEvCritId,
      elementCode: newEvElementCode,
      fileType: newEvType,
      cloudProvider: newEvProvider,
      cloudUrl: newEvUrl.trim() || masterGdriveUrl,
      fileSize: newEvSize,
      uploadDate: new Date().toISOString().split('T')[0],
      uploader: 'Tim Akreditasi',
      verified: true,
      isUserAdded: true,
    };

    setEvidences((prev) => [newEvidence, ...prev]);
    setIsAddEvidenceOpen(false);
    setNewEvTitle('');
    setNewEvCode('');
    showToast('Bukti digital baru berhasil ditambahkan dan ditautkan ke Google Drive!');
  };

  // Reset to default seed
  const handleResetToDefault = () => {
    if (window.confirm('Reset seluruh narasi LED, penilaian, dan repositori ke data awal resmi LAM-PTKes 2025? Perubahan lokal akan dikembalikan.')) {
      setAnswers(generateDefaultAnswers());
      setEvidences(DEFAULT_LAMPTKES_EVIDENCES);
      setCustomSupportingDocs([]);
      setMasterGdriveUrl(GDRIVE_AKREDITASI_FOLDER_URL);
      localStorage.removeItem('mkm_lamptkes_2025_answers');
      localStorage.removeItem('mkm_lamptkes_2025_evidences');
      localStorage.removeItem('mkm_lamptkes_2025_custom_docs');
      localStorage.removeItem('mkm_sim_akreditasi_gdrive_url');
      showToast('Sistem berhasil di-reset ke data default instrumen LAM-PTKes 2025.');
    }
  };

  // Add comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComm: DiscussionComment = {
      id: `comm-${Date.now()}`,
      authorName: activeRole === 'admin' ? 'Admin Tim Akreditasi' : 'Asesor Audit',
      authorRole: activeRole === 'admin' ? 'Admin Tim Akreditasi' : 'Asesor Audit',
      criterionId: newCommentCritId,
      elementCode: selectedElementCode,
      text: newCommentText.trim(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      urgency: newCommentUrgency,
      avatarBg: activeRole === 'admin' ? 'bg-indigo-600' : 'bg-emerald-600',
    };

    setComments((prev) => [newComm, ...prev]);
    setNewCommentText('');
    showToast('Catatan diskusi berhasil dipublikasikan!');
  };

  // -------------------------------------------------------------------------
  // RADAR CHART DATA PREPARATION
  // -------------------------------------------------------------------------
  const radarChartData = useMemo(() => {
    return criteriaScores.map((c) => ({
      subject: c.code,
      fullName: c.shortName,
      SkorProdi: c.avgScore,
      SkorAsesor: c.assessorAvgScore,
      AmbangUnggul: 3.61,
      fullMark: 4.0,
    }));
  }, [criteriaScores]);

  // Bar chart data preparation
  const barChartData = useMemo(() => {
    return criteriaScores.map((c) => ({
      name: c.code,
      shortName: c.shortName,
      'Skor Prodi': c.avgScore,
      'Skor Asesor': c.assessorAvgScore,
      Bobot: c.weight,
    }));
  }, [criteriaScores]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-400 animate-bounce text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          TOP INSTITUTIONAL HEADER & NAVIGATION BAR
      ========================================================================= */}
      <header className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo & Context */}
            <div className="flex items-center gap-4">
              <img
                src="/assets/aistudio/UMPontianak_Logo_Warna_2e912afe.png"
                alt="Logo UM Pontianak"
                className="h-12 w-auto bg-white/10 p-1.5 rounded-xl border border-white/20 shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
                    SIM-Akreditasi PRO
                  </span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    LAM-PTKes 2025
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium hidden sm:block">
                  Instrumen Buku III: Laporan Evaluasi Diri (LED) · S2 Magister Kesehatan Masyarakat FIKPsi UM Pontianak
                </p>
              </div>
            </div>

            {/* Quick Actions & Role Switcher */}
            <div className="flex items-center gap-3">
              {/* Google Drive Direct Folder Button */}
              <a
                href={masterGdriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Buka Repositori Berkas Akreditasi di Google Drive"
                className="hidden md:flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 rounded-xl transition shadow-sm hover:scale-[1.02]"
              >
                <HardDrive className="w-4 h-4 text-emerald-400" />
                <span>Google Drive Berkas</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>

              {/* Edit Drive Link Modal Trigger */}
              <button
                onClick={() => {
                  setTempMasterGdriveUrl(masterGdriveUrl);
                  setIsEditMasterDriveOpen(true);
                }}
                title="Ubah Tautan Folder Google Drive Master"
                className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition border border-slate-700"
              >
                <LinkIcon className="w-4 h-4" />
              </button>

              {/* Mode Toggle: Admin Tim Akreditasi vs Asesor Audit */}
              <div className="bg-slate-800/90 p-1 rounded-xl border border-slate-700 flex items-center">
                <button
                  onClick={() => setActiveRole('admin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    activeRole === 'admin'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Tim Prodi</span>
                </button>
                <button
                  onClick={() => setActiveRole('assessor')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    activeRole === 'assessor'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Asesor Audit</span>
                </button>
              </div>

              {/* Back to Portal / Landing */}
              {onBackToPortal && (
                <button
                  onClick={onBackToPortal}
                  className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition flex items-center gap-1.5 border border-slate-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Kembali</span>
                </button>
              )}
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-800/80 no-scrollbar text-xs font-semibold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-2 rounded-lg transition whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Executive Dashboard & Simulator Nilai</span>
            </button>

            <button
              onClick={() => setActiveTab('led_form')}
              className={`px-3.5 py-2 rounded-lg transition whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'led_form'
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Penyusunan LED (8 Kriteria & 121 Elemen)</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-900 text-blue-200 font-mono">
                {overallProgressPct}%
              </span>
            </button>

            <button
              onClick={() => setActiveTab('repository')}
              className={`px-3.5 py-2 rounded-lg transition whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'repository'
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <FolderSync className="w-4 h-4" />
              <span>Repositori Berkas & Dokumen Pendukung</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-700 text-slate-300">
                {evidences.length} Berkas
              </span>
            </button>

            <button
              onClick={() => setActiveTab('assessor_sheet')}
              className={`px-3.5 py-2 rounded-lg transition whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'assessor_sheet'
                  ? 'bg-emerald-600 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Lembar Asesmen (Asesor)</span>
            </button>

            <button
              onClick={() => setActiveTab('export_led')}
              className={`px-3.5 py-2 rounded-lg transition whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'export_led'
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Ekspor Dokumen LED (Word / PDF)</span>
            </button>

            <button
              onClick={() => setActiveTab('discussions')}
              className={`px-3.5 py-2 rounded-lg transition whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'discussions'
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Diskusi & Audit Trail</span>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN CONTENT AREA
      ========================================================================= */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Banner Informational LAM-PTKes 2025 */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-800/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-blue-600/20 border border-blue-500/40 rounded-xl text-blue-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Instrumen Akreditasi LAM-PTKes 2025 (Buku III: LED Program Studi Magister Kesehatan Masyarakat)
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Struktur data 8 Kriteria mencakup 121 Elemen Utama, Butir Pemenuhan Standar, dan Dokumen Pendukung Berkas Terhubung Cloud Drive.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={handleCopyDriveUrl}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition flex items-center gap-1.5 border border-slate-700"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Salin Link G-Drive</span>
            </button>
            <button
              onClick={handleResetToDefault}
              className="px-3 py-1.5 text-xs font-semibold bg-rose-950/40 hover:bg-rose-900 text-rose-300 rounded-lg transition flex items-center gap-1.5 border border-rose-800/50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* =======================================================================
            TAB 1: EXECUTIVE DASHBOARD & SIMULATOR NILAI
        ======================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1: Simulasi Skor Prodi */}
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-sm relative overflow-hidden group hover:border-blue-500/50 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Skor Evaluasi Diri (Prodi)
                  </span>
                  <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-4xl font-extrabold text-white font-mono">{totalProdiScore}</span>
                  <span className="text-xs font-bold text-slate-400">/ 4.00</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-extrabold ${prodiGrade.badgeColor}`}>
                    {prodiGrade.title}
                  </span>
                  <span className="text-[11px] text-slate-400">Predikat Simulasi</span>
                </div>
              </div>

              {/* Card 2: Skor Validasi Asesor */}
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-sm relative overflow-hidden group hover:border-emerald-500/50 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Skor Validasi Asesor
                  </span>
                  <div className="p-2 bg-emerald-600/20 text-emerald-400 rounded-lg">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-4xl font-extrabold text-emerald-400 font-mono">{totalAssessorScore}</span>
                  <span className="text-xs font-bold text-slate-400">/ 4.00</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-extrabold ${assessorGrade.badgeColor}`}>
                    {assessorGrade.title}
                  </span>
                  <span className="text-[11px] text-slate-400">Hasil Audit Lapangan</span>
                </div>
              </div>

              {/* Card 3: Progres Pengisian LED */}
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-sm relative overflow-hidden group hover:border-indigo-500/50 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Progres Narasi LED
                  </span>
                  <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-4xl font-extrabold text-white font-mono">{overallProgressPct}%</span>
                  <span className="text-xs font-bold text-slate-400">
                    ({totalCompletedElements} / {totalElementsCount} Elemen)
                  </span>
                </div>
                <div className="mt-3 w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${overallProgressPct}%` }}
                  />
                </div>
              </div>

              {/* Card 4: Ketersediaan Berkas Digital */}
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-sm relative overflow-hidden group hover:border-amber-500/50 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Bukti Digital Terhubung
                  </span>
                  <div className="p-2 bg-amber-600/20 text-amber-400 rounded-lg">
                    <FolderSync className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-4xl font-extrabold text-white font-mono">{evidences.length}</span>
                  <span className="text-xs font-bold text-slate-400">Berkas Terverifikasi</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Google Drive Sync:</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                  </span>
                </div>
              </div>
            </div>

            {/* Charts Row: Radar & Bar Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart: Pemetaan 8 Kriteria */}
              <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/80 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-400" />
                      <span>Diagram Radar 8 Kriteria LAM-PTKes 2025</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Perbandingan Capaian Prodi vs Ambang Syarat Unggul (3.61)
                    </p>
                  </div>
                  <span className="text-[11px] px-2 py-1 rounded bg-slate-700 text-slate-300 font-mono">
                    8 Kriteria
                  </span>
                </div>

                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarChartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 4]} tick={{ fill: '#64748b', fontSize: 10 }} />
                      <Radar name="Skor Prodi" dataKey="SkorProdi" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                      <Radar name="Skor Asesor" dataKey="SkorAsesor" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                      <Radar name="Ambang Unggul (3.61)" dataKey="AmbangUnggul" stroke="#f59e0b" strokeDasharray="3 3" fill="none" />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '0.75rem',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart: Detail Skor & Bobot per Kriteria */}
              <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/80 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-emerald-400" />
                      <span>Distribusi Skor per Kriteria (K1 - K8)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Evaluasi Kinerja Komprehensif S2 Magister Kesehatan Masyarakat
                    </p>
                  </div>
                  <span className="text-[11px] px-2 py-1 rounded bg-slate-700 text-slate-300 font-mono">
                    Bobot 100%
                  </span>
                </div>

                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis domain={[0, 4]} tick={{ fill: '#64748b', fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '0.75rem',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      <Bar dataKey="Skor Prodi" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Skor Asesor" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 8 Criteria Overview Cards Table */}
            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/80 shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-blue-400" />
                    <span>Rangkuman 8 Kriteria LAM-PTKes 2025</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Klik pada kriteria untuk langsung menyusun atau meninjau narasi Elemen Utama
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('led_form')}
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition flex items-center gap-2 shadow-md"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Buka Form Penyusunan LED</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {criteriaScores.map((crit) => (
                  <div
                    key={crit.id}
                    onClick={() => {
                      setSelectedCritNumber(crit.number);
                      setActiveTab('led_form');
                    }}
                    className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/60 transition cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-blue-900/50 text-blue-300 font-mono border border-blue-700/40">
                          {crit.code}
                        </span>
                        <span className="text-xs font-bold text-amber-400 font-mono">
                          Bobot {crit.weight}%
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white group-hover:text-blue-300 transition line-clamp-1">
                        {crit.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {crit.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-700/60">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-400">Skor / Asesor:</span>
                        <span className="font-extrabold font-mono text-white">
                          {crit.avgScore} <span className="text-emerald-400">/ {crit.assessorAvgScore}</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span>{crit.elementCount} Elemen Utama</span>
                        <span className="font-mono text-blue-400 font-bold">{crit.progressPct}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${crit.progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =======================================================================
            TAB 2: PENYUSUNAN LED (8 KRITERIA & 121 ELEMEN UTAMA)
        ======================================================================= */}
        {activeTab === 'led_form' && (
          <div className="space-y-6">
            {/* Criteria Selector Header Bar */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-md">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Pilih Kriteria Akreditasi (Instrumen 8 Kriteria LAM-PTKes):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {LAMPTKES_CRITERIA.map((crit) => {
                  const scoreInfo = criteriaScores.find((c) => c.id === crit.id);
                  const isSelected = selectedCritNumber === crit.number;
                  return (
                    <button
                      key={crit.id}
                      onClick={() => setSelectedCritNumber(crit.number)}
                      className={`p-3 rounded-xl text-left transition border flex flex-col justify-between ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-400 shadow-lg scale-[1.02]'
                          : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black font-mono">{crit.code}</span>
                          <span className={`text-[10px] font-bold ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                            {crit.weight}%
                          </span>
                        </div>
                        <span className="text-xs font-bold block mt-1 line-clamp-1">
                          {crit.shortName}
                        </span>
                      </div>
                      <div className="mt-2 text-[10px] flex items-center justify-between opacity-90 font-mono">
                        <span>{scoreInfo?.avgScore || 3.8}</span>
                        <span>{scoreInfo?.progressPct || 100}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-Criteria Navigation & Search Bar */}
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/80 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* Sub-Criteria Pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                <span className="text-xs font-bold text-slate-400 whitespace-nowrap">Sub-Kriteria:</span>
                {activeCriterion.subCriteria.map((sub) => {
                  const isSubSelected = selectedSubCritCode === sub.code;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setSelectedSubCritCode(sub.code);
                        if (sub.elementCodes.length > 0) {
                          setSelectedElementCode(sub.elementCodes[0]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition border ${
                        isSubSelected
                          ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      <span>{sub.code} {sub.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Search Element Code / Keyword */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={elementSearchQuery}
                    onChange={(e) => setElementSearchQuery(e.target.value)}
                    placeholder="Cari kode (misal 2.1.3)..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  {elementSearchQuery && (
                    <button
                      onClick={() => setElementSearchQuery('')}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <select
                  value={elementStatusFilter}
                  onChange={(e) => setElementStatusFilter(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">Semua Status</option>
                  <option value="Final">Final</option>
                  <option value="Review">Review</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Split Screen Layout: Element Navigation on Left, Full Editor on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Element List Selection */}
              <div className="lg:col-span-4 space-y-2 max-h-[800px] overflow-y-auto pr-1">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1 pb-1">
                  <span className="font-bold">Daftar Elemen ({filteredElements.length})</span>
                  <span>Kriteria {activeCriterion.number}</span>
                </div>

                {filteredElements.map((el) => {
                  const ans = answers[el.code];
                  const isSelected = selectedElementCode === el.code;
                  const complianceCount = el.complianceItems.length;
                  const checkedCount = Object.values(ans?.complianceChecked || {}).filter(Boolean).length;

                  return (
                    <div
                      key={el.id}
                      onClick={() => setSelectedElementCode(el.code)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-blue-900/40 border-blue-500 shadow-md ring-1 ring-blue-500'
                          : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-black font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                            {el.code}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              ans?.status === 'Final'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                                : ans?.status === 'Review'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {ans?.status || 'Draft'}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-200 line-clamp-2">
                          {el.question}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          {checkedCount}/{complianceCount} Butir
                        </span>
                        <span className="font-extrabold text-white font-mono">
                          Skor: {ans?.score.toFixed(2) || '3.80'}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {filteredElements.length === 0 && (
                  <div className="p-8 text-center bg-slate-800/40 rounded-xl border border-slate-700 text-slate-400 text-xs">
                    Tidak ada elemen yang cocok dengan pencarian "{elementSearchQuery}".
                  </div>
                )}
              </div>

              {/* Right Column: Full Element LED Editor */}
              <div className="lg:col-span-8 space-y-6">
                {activeElement ? (
                  <div className="p-6 rounded-2xl bg-slate-800/70 border border-slate-700/80 shadow-xl space-y-6">
                    {/* Element Header & Meta */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/70">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black font-mono px-3 py-1 rounded-lg bg-blue-600 text-white shadow-sm">
                            Elemen {activeElement.code}
                          </span>
                          <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-800/40">
                            {activeCriterion.shortName} · Kriteria {activeCriterion.number}
                          </span>
                          <span className="text-xs text-slate-400">
                            Versi {answers[activeElement.code]?.version || 1}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Penulis: <span className="text-slate-200 font-semibold">{answers[activeElement.code]?.author || 'Dr. Rochmawati, S.KM., M.Kes.'}</span> · Terakhir disimpan: <span className="text-slate-200 font-mono">{answers[activeElement.code]?.lastUpdated || '2026-10-27 10:00'}</span>
                        </p>
                      </div>

                      {/* Status Selector & Score Input */}
                      <div className="flex items-center gap-3">
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-0.5">Status LED:</label>
                          <select
                            value={answers[activeElement.code]?.status || 'Draft'}
                            onChange={(e) => handleUpdateStatus(activeElement.code, e.target.value as any)}
                            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white font-bold focus:outline-none focus:border-blue-500"
                          >
                            <option value="Draft">Draft</option>
                            <option value="Review">Review</option>
                            <option value="Final">Final</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 block mb-0.5">Skor Mandiri (1-4):</label>
                          <input
                            type="number"
                            step="0.05"
                            min="1.0"
                            max="4.0"
                            value={answers[activeElement.code]?.score || 3.8}
                            onChange={(e) => handleUpdateScore(activeElement.code, parseFloat(e.target.value) || 3.8)}
                            className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono font-bold text-center text-blue-400 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Question (Elemen Utama) Box */}
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700">
                      <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block mb-1">
                        Elemen Utama (Pertanyaan Instrumen LAM-PTKes):
                      </span>
                      <p className="text-sm font-bold text-white leading-relaxed">
                        {activeElement.question}
                      </p>
                      {activeElement.benchmark && (
                        <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-amber-400" />
                          <span>Standar Rujukan: <strong className="text-slate-300">{activeElement.benchmark}</strong></span>
                        </div>
                      )}
                    </div>

                    {/* Panduan Sub-Kriteria (Guidance Panel) */}
                    <details className="rounded-xl bg-indigo-950/30 border border-indigo-800/40 p-3 group">
                      <summary className="text-xs font-bold text-indigo-300 cursor-pointer flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-indigo-400" />
                          <span>Panduan Sub-Kriteria & Siklus PPEPP (Klik untuk membaca)</span>
                        </span>
                        <ChevronDown className="w-4 h-4 group-open:rotate-180 transition" />
                      </summary>
                      <div className="mt-3 text-xs text-slate-300 leading-relaxed border-t border-indigo-900/50 pt-2 space-y-2">
                        <p>
                          <strong>Sub-Kriteria {selectedSubCritCode}:</strong> {activeCriterion.subCriteria.find((s) => s.code === selectedSubCritCode)?.guidanceText || activeCriterion.description}
                        </p>
                        <p className="text-[11px] text-indigo-300">
                          <strong>Siklus PPEPP LAM-PTKes:</strong> Pastikan narasi menguraikan aspek Penetapan (kebijakan/SK), Pelaksanaan (bukti implementasi riil), Evaluasi (capaian target IKU/IKT), Pengendalian (tindakan atas kendala), dan Peningkatan (benchmarking & standar baru).
                        </p>
                      </div>
                    </details>

                    {/* Butir Pemenuhan Standar (Checklist) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Butir / Indikator Pemenuhan terhadap Elemen Utama:</span>
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {Object.values(answers[activeElement.code]?.complianceChecked || {}).filter(Boolean).length} / {activeElement.complianceItems.length} Terpenuhi
                        </span>
                      </div>

                      <div className="space-y-2">
                        {activeElement.complianceItems.map((item) => {
                          const isChecked = !!answers[activeElement.code]?.complianceChecked?.[item.order];
                          return (
                            <label
                              key={item.id}
                              className={`flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer ${
                                isChecked
                                  ? 'bg-emerald-950/30 border-emerald-800/50 text-slate-200'
                                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleCompliance(activeElement.code, item.order)}
                                className="mt-0.5 h-4 w-4 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-900 cursor-pointer"
                              />
                              <span className="text-xs leading-relaxed">{item.text}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Narasi Evaluasi Diri (LED Textarea) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                          <Edit3 className="w-4 h-4 text-blue-400" />
                          <span>Narasi Evaluasi Diri (Jawaban Komprehensif Program Studi):</span>
                        </label>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {answers[activeElement.code]?.narrative?.length || 0} Karakter
                        </span>
                      </div>

                      <textarea
                        rows={7}
                        value={answers[activeElement.code]?.narrative || ''}
                        onChange={(e) => handleUpdateNarrative(activeElement.code, e.target.value)}
                        placeholder="Uraikan evaluasi diri program studi secara analitis mencakup kebijakan, pelaksanaan, evaluasi kendala, dan rencana perbaikan berkelanjutan..."
                        className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                      />
                    </div>

                    {/* Dokumen Pendukung & Bukti Tertaut */}
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                          <FolderSync className="w-4 h-4 text-amber-400" />
                          <span>Tautan Dokumen Pendukung & Bukti Sahih:</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <a
                            href={masterGdriveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/60 rounded-lg hover:bg-emerald-900 transition flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Buka G-Drive</span>
                          </a>
                          <button
                            onClick={() => {
                              setNewEvCritId(activeCriterion.number);
                              setNewEvElementCode(activeElement.code);
                              setIsAddEvidenceOpen(true);
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition flex items-center gap-1 shadow-sm"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Tautkan Berkas</span>
                          </button>
                        </div>
                      </div>

                      {/* Display Evidences Linked to this Criterion / Element */}
                      <div className="space-y-1.5">
                        {evidences
                          .filter((ev) => ev.criterionId === activeCriterion.number)
                          .slice(0, 3)
                          .map((ev) => (
                            <div
                              key={ev.id}
                              className="p-2.5 rounded-lg bg-slate-800/70 border border-slate-700/60 flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-blue-400" />
                                <div>
                                  <span className="font-semibold text-slate-200 block">{ev.title}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {ev.code} · {ev.fileType} · {ev.fileSize}
                                  </span>
                                </div>
                              </div>
                              <a
                                href={ev.cloudUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 text-[10px] font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Lihat</span>
                              </a>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Mode Asesor Section (Audit & Feedbacks) */}
                    {activeRole === 'assessor' && (
                      <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-600/50 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>Lembar Penilaian Asesor Audit (Elemen {activeElement.code})</span>
                          </span>
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-emerald-900/60 text-emerald-200 border border-emerald-700/40">
                            Mode Asesor Aktif
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[11px] font-bold text-slate-300 block mb-1">
                              Skor Asesor (Skala 1.0 - 4.0):
                            </label>
                            <input
                              type="number"
                              step="0.05"
                              min="1.0"
                              max="4.0"
                              defaultValue={answers[activeElement.code]?.assessorScore || answers[activeElement.code]?.score || 3.8}
                              id={`assessor-score-${activeElement.code}`}
                              className="w-full bg-slate-900 border border-emerald-600/60 rounded-lg p-2 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-400"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-300 block mb-1">
                              Status Validasi Asesor:
                            </label>
                            <select
                              defaultValue={answers[activeElement.code]?.assessorStatus || 'Disetujui'}
                              id={`assessor-status-${activeElement.code}`}
                              className="w-full bg-slate-900 border border-emerald-600/60 rounded-lg p-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
                            >
                              <option value="Disetujui">Disetujui (Memenuhi Standar)</option>
                              <option value="Perlu Perbaikan">Perlu Perbaikan Bukti</option>
                              <option value="Belum Dinilai">Belum Dinilai</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-300 block mb-1">
                            Catatan Deskriptif & Rekomendasi Asesor:
                          </label>
                          <textarea
                            rows={3}
                            defaultValue={answers[activeElement.code]?.assessorNotes || 'Bukti sahih lengkap dan narasi sangat komprehensif.'}
                            id={`assessor-notes-${activeElement.code}`}
                            placeholder="Tuliskan catatan kualitatif, temuan audit lapangan, atau rekomendasi peningkatan..."
                            className="w-full bg-slate-900 border border-emerald-600/60 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              const scoreVal = parseFloat((document.getElementById(`assessor-score-${activeElement.code}`) as HTMLInputElement)?.value) || 3.8;
                              const statusVal = (document.getElementById(`assessor-status-${activeElement.code}`) as HTMLSelectElement)?.value as any || 'Disetujui';
                              const notesVal = (document.getElementById(`assessor-notes-${activeElement.code}`) as HTMLTextAreaElement)?.value || '';
                              handleUpdateAssessorReview(activeElement.code, scoreVal, notesVal, statusVal);
                            }}
                            className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition shadow-md flex items-center gap-1.5"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Simpan Penilaian Asesor</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-slate-800/40 rounded-2xl border border-slate-700 text-slate-400">
                    Pilih elemen di sebelah kiri untuk melihat dan menyusun Laporan Evaluasi Diri.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =======================================================================
            TAB 3: REPOSITORI BERKAS & DOKUMEN PENDUKUNG (TIDAK TERBATAS)
        ======================================================================= */}
        {activeTab === 'repository' && (
          <div className="space-y-6">
            {/* Top Repository Actions Bar */}
            <div className="p-6 rounded-2xl bg-slate-800/70 border border-slate-700 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FolderSync className="w-5 h-5 text-blue-400" />
                  <span>Repositori Dokumen Pendukung & Bukti Digital LAM-PTKes</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Folder Cloud Terpadu: <a href={masterGdriveUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline font-mono">{masterGdriveUrl}</a>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddCustomDocOpen(true)}
                  className="px-3.5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Tambah Jenis Dokumen Pendukung</span>
                </button>

                <button
                  onClick={() => {
                    setNewEvCritId(selectedCritNumber);
                    setIsAddEvidenceOpen(true);
                  }}
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition flex items-center gap-1.5 shadow-md"
                >
                  <Upload className="w-4 h-4" />
                  <span>Unggah / Tautkan Bukti</span>
                </button>
              </div>
            </div>

            {/* Dokumen Pendukung Wajib LAM-PTKes Acuan Buku III */}
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/80 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <span>Daftar Dokumen Pendukung Kriteria {activeCriterion.number} ({activeCriterion.name})</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Sifat dokumen "tidak terbatas pada daftar", program studi dapat menambahkan jenis dokumen pendukung baru sesuai kebutuhan.
                  </p>
                </div>

                {/* Criterion selector */}
                <select
                  value={selectedCritNumber}
                  onChange={(e) => setSelectedCritNumber(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-blue-500"
                >
                  {LAMPTKES_CRITERIA.map((c) => (
                    <option key={c.id} value={c.number}>
                      {c.code} - {c.shortName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentCriterionSupportingDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40">
                          {doc.code}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            doc.isMandatory
                              ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {doc.isMandatory ? 'Wajib LAM-PTKes' : 'Opsional'}
                        </span>
                      </div>

                      <h5 className="text-xs font-bold text-white">{doc.name}</h5>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                        {doc.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-semibold">{doc.category}</span>
                      <a
                        href={masterGdriveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg transition flex items-center gap-1 border border-slate-700"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Buka di G-Drive</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabel Berkas Bukti Digital Sahih */}
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/80 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-blue-400" />
                  <span>Daftar Berkas Bukti Sahih Tersimpan ({evidences.length} Berkas)</span>
                </h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700">
                    <tr>
                      <th className="p-3">Kode Bukti</th>
                      <th className="p-3">Judul Berkas & Elemen</th>
                      <th className="p-3">Kriteria</th>
                      <th className="p-3">Penyedia Cloud</th>
                      <th className="p-3">Ukuran & Tanggal</th>
                      <th className="p-3">Status Verifikasi</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {evidences.map((ev) => (
                      <tr key={ev.id} className="hover:bg-slate-800/50 transition">
                        <td className="p-3 font-mono font-bold text-blue-400">{ev.code}</td>
                        <td className="p-3">
                          <span className="font-semibold text-white block">{ev.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Elemen: {ev.elementCode || 'Kriteria Umum'} · Pengunggah: {ev.uploader}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-300">Kriteria {ev.criterionId}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-slate-900 text-emerald-400 border border-slate-700 font-semibold text-[11px]">
                            {ev.cloudProvider}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400 font-mono text-[11px]">
                          {ev.fileSize} · {ev.uploadDate}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/50 flex items-center gap-1 w-fit">
                            <Check className="w-3 h-3" /> Terverifikasi
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <a
                            href={ev.cloudUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 text-xs font-semibold bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white rounded-lg transition inline-flex items-center gap-1 border border-blue-500/30"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Akses</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================================
            TAB 4: LEMBAR ASESMEN ASESOR (AUDIT 8 KRITERIA)
        ======================================================================= */}
        {activeTab === 'assessor_sheet' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-600/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">
                    Lembar Kerja Asesmen Lapangan (AL) LAM-PTKes 2025
                  </h3>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Format Penilaian Asesor Independen terhadap 8 Kriteria Laporan Evaluasi Diri (LED) S2 Magister Kesehatan Masyarakat.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-right">
                  <span className="text-[11px] text-slate-400 block">Skor Akhir Asesor:</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">{totalAssessorScore}</span>
                  <span className={`ml-2 text-xs font-extrabold px-2 py-0.5 rounded ${assessorGrade.badgeColor}`}>
                    {assessorGrade.title}
                  </span>
                </div>
              </div>
            </div>

            {/* Assessment Table per Criterion */}
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/80 shadow-md">
              <h4 className="text-sm font-bold text-white mb-4">
                Rekapitulasi Penilaian 8 Kriteria oleh Asesor
              </h4>

              <div className="space-y-4">
                {criteriaScores.map((crit) => (
                  <div
                    key={crit.id}
                    className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black font-mono px-2.5 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800/40">
                          {crit.code}
                        </span>
                        <div>
                          <h5 className="text-xs font-bold text-white">{crit.name}</h5>
                          <span className="text-[11px] text-slate-400">
                            Bobot: {crit.weight}% · {crit.elementCount} Elemen Utama
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Skor Prodi:</span>
                          <span className="font-bold text-blue-400">{crit.avgScore}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Skor Asesor:</span>
                          <span className="font-bold text-emerald-400">{crit.assessorAvgScore}</span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedCritNumber(crit.number);
                            setActiveRole('assessor');
                            setActiveTab('led_form');
                          }}
                          className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition"
                        >
                          Audit Elemen
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =======================================================================
            TAB 5: EKSPOR DOKUMEN LED (WORD / PRINT FORMAT BUKU III)
        ======================================================================= */}
        {activeTab === 'export_led' && (
          <div className="space-y-6">
            {/* Export Toolbar */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Printer className="w-4 h-4 text-blue-400" />
                  <span>Pratinjau Dokumen Naskah LED LAM-PTKes 2025</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Naskah lengkap terurut Kriteria 1 sampai Kriteria 8, dilengkapi penomoran elemen resmi dan daftar dokumen pendukung.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition flex items-center gap-2 shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Simpan PDF</span>
                </button>
                <button
                  onClick={() => {
                    const printContents = document.getElementById('led-document-export-container')?.innerHTML;
                    if (!printContents) return;
                    const blob = new Blob([`
                      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                      <head><meta charset='utf-8'><title>LED S2 MKM LAM-PTKes 2025</title>
                      <style>
                        body { font-family: 'Times New Roman', serif; line-height: 1.5; color: #000; padding: 2cm; }
                        h1, h2, h3, h4 { color: #003366; }
                        table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px; }
                        th, td { border: 1px solid #000; padding: 6px; font-size: 11pt; }
                        th { background-color: #f2f2f2; }
                      </style>
                      </head>
                      <body>${printContents}</body></html>
                    `], { type: 'application/msword;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `LED_S2_MKM_LAMPTKes_2025.doc`;
                    link.click();
                    showToast('Dokumen Word (.doc) berhasil diunduh!');
                  }}
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition flex items-center gap-2 shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Dokumen Word (.doc)</span>
                </button>
              </div>
            </div>

            {/* Print Container Preview */}
            <div
              id="led-document-export-container"
              className="p-8 sm:p-12 rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200 print:shadow-none print:border-none print:p-0 space-y-8 font-serif leading-relaxed"
            >
              {/* Document Header */}
              <div className="text-center border-b-2 border-slate-900 pb-6">
                <img
                  src="/assets/aistudio/UMPontianak_Logo_Warna_2e912afe.png"
                  alt="Logo"
                  className="h-16 w-auto mx-auto mb-3"
                />
                <h1 className="text-lg font-black uppercase tracking-wider text-slate-900">
                  Laporan Evaluasi Diri (LED)
                </h1>
                <h2 className="text-base font-bold text-slate-800">
                  Program Studi Magister Kesehatan Masyarakat (S2 MKM)
                </h2>
                <h3 className="text-sm font-semibold text-slate-700">
                  Fakultas Ilmu Kesehatan dan Psikologi · Universitas Muhammadiyah Pontianak
                </h3>
                <p className="text-xs text-slate-600 mt-2 font-sans">
                  Sesuai Pedoman Penyusunan Laporan Evaluasi Diri (Buku III) Instrumen LAM-PTKes 2025
                </p>
              </div>

              {/* Document Executive Summary */}
              <div className="space-y-2 text-xs font-sans border-b border-slate-300 pb-4">
                <div className="flex justify-between">
                  <span>Skor Rerata Evaluasi Diri (Prodi): <strong>{totalProdiScore} / 4.00</strong></span>
                  <span>Predikat Akreditasi: <strong>{prodiGrade.title}</strong></span>
                </div>
                <div className="flex justify-between">
                  <span>Total Kriteria: <strong>8 Kriteria</strong></span>
                  <span>Total Elemen Utama: <strong>121 Elemen</strong></span>
                </div>
              </div>

              {/* Orderly Criteria 1 to 8 Iteration */}
              {LAMPTKES_CRITERIA.map((crit) => {
                const critElements = LAMPTKES_MAIN_ELEMENTS.filter((el) => el.criterionId === crit.id);
                return (
                  <div key={crit.id} className="space-y-6 pt-6 border-b border-slate-300 pb-8 page-break-before">
                    <div className="border-l-4 border-blue-900 pl-4">
                      <h3 className="text-base font-black text-blue-950 uppercase">
                        Kriteria {crit.number}: {crit.name}
                      </h3>
                      <p className="text-xs text-slate-600 font-sans mt-0.5">
                        Bobot Kriteria: {crit.weight}% · Deskripsi: {crit.description}
                      </p>
                    </div>

                    {/* Sub-Criteria Iteration */}
                    {crit.subCriteria.map((sub) => {
                      const subElements = critElements.filter((el) => el.subCriterionId === sub.id);
                      return (
                        <div key={sub.id} className="space-y-4 pl-2">
                          <h4 className="text-sm font-bold text-slate-900 font-sans border-b border-slate-200 pb-1">
                            Sub-Kriteria {sub.code}: {sub.name}
                          </h4>
                          <p className="text-xs text-slate-700 italic font-sans">
                            {sub.guidanceText}
                          </p>

                          {/* Elements inside Sub-Criterion */}
                          <div className="space-y-5">
                            {subElements.map((el) => {
                              const ans = answers[el.code];
                              return (
                                <div key={el.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs font-sans space-y-2">
                                  <div className="flex items-center justify-between font-bold">
                                    <span className="font-mono text-blue-900 font-black">
                                      Elemen {el.code}
                                    </span>
                                    <span className="text-slate-600 font-mono">
                                      Skor: {ans?.score || 3.8} / 4.00
                                    </span>
                                  </div>
                                  <p className="font-bold text-slate-900">
                                    {el.question}
                                  </p>

                                  {/* Compliance points */}
                                  <div className="pl-4 border-l-2 border-slate-300 space-y-1 text-[11px] text-slate-700">
                                    <span className="font-semibold block text-slate-800">Pemenuhan Elemen Utama:</span>
                                    {el.complianceItems.map((ci) => (
                                      <div key={ci.id} className="flex items-center gap-1.5">
                                        <span className="text-emerald-700 font-bold">✓</span>
                                        <span>{ci.text}</span>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Narrative Text */}
                                  <div className="pt-2 text-slate-800 leading-relaxed font-serif text-[12px]">
                                    <strong className="font-sans text-[11px] block text-blue-950 mb-1">
                                      Narasi Evaluasi Diri Program Studi:
                                    </strong>
                                    {ans?.narrative || 'Narasi dalam proses finalisasi tim penyusun.'}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                    {/* Supporting Documents List for this Criterion */}
                    <div className="mt-4 pt-3 border-t border-slate-200 text-xs font-sans">
                      <strong className="block text-slate-900 mb-2">
                        Dokumen Pendukung Kriteria {crit.number}:
                      </strong>
                      <ul className="list-disc pl-5 space-y-1 text-slate-700 text-[11px]">
                        {crit.supportingDocuments.map((doc) => (
                          <li key={doc.id}>
                            <strong>{doc.code}</strong>: {doc.name} ({doc.category}) - <em>{doc.description}</em>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =======================================================================
            TAB 6: DISKUSI & AUDIT TRAIL
        ======================================================================= */}
        {activeTab === 'discussions' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveDiscussionSubTab('threads')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeDiscussionSubTab === 'threads'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Catatan Diskusi Tim Penyusun ({comments.length})</span>
              </button>
              <button
                onClick={() => setActiveDiscussionSubTab('audit_trail')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeDiscussionSubTab === 'audit_trail'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <History className="w-4 h-4" />
                <span>Audit Trail & Riwayat Perubahan ({auditLogs.length})</span>
              </button>
            </div>

            {activeDiscussionSubTab === 'threads' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Form Add Comment */}
                <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-800/70 border border-slate-700 shadow-xl space-y-4">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Send className="w-4 h-4 text-blue-400" />
                    <span>Kirim Catatan / Ulasan Diskusi</span>
                  </h4>

                  <form onSubmit={handleAddComment} className="space-y-4">
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Terkait Kriteria:</label>
                      <select
                        value={newCommentCritId}
                        onChange={(e) => setNewCommentCritId(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-bold"
                      >
                        {LAMPTKES_CRITERIA.map((c) => (
                          <option key={c.id} value={c.number}>
                            {c.code} - {c.shortName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Tingkat Urgensi:</label>
                      <select
                        value={newCommentUrgency}
                        onChange={(e) => setNewCommentUrgency(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="Normal">Normal</option>
                        <option value="Penting">Penting</option>
                        <option value="Mendesak">Mendesak</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Pesan Diskusi:</label>
                      <textarea
                        rows={4}
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Tuliskan catatan perbaikan berkas, notula koordinasi, atau instruksi..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition shadow-md flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publikasikan Catatan</span>
                    </button>
                  </form>
                </div>

                {/* Comment List */}
                <div className="lg:col-span-7 space-y-4">
                  {comments.map((comm) => (
                    <div
                      key={comm.id}
                      className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/80 shadow-md space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${comm.avatarBg}`}>
                            {comm.authorName.charAt(0)}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">{comm.authorName}</span>
                            <span className="text-[10px] text-slate-400">{comm.authorRole}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-mono">
                            Kriteria {comm.criterionId}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              comm.urgency === 'Mendesak'
                                ? 'bg-rose-950 text-rose-300'
                                : comm.urgency === 'Penting'
                                ? 'bg-amber-950 text-amber-300'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {comm.urgency}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed pl-9">
                        {comm.text}
                      </p>

                      <div className="text-[10px] text-slate-500 text-right font-mono">
                        {comm.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeDiscussionSubTab === 'audit_trail' && (
              <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 shadow-md">
                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-400" />
                  <span>Log Rekam Jejak Aktivitas & Audit Perubahan Sistem</span>
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700 font-semibold">
                      <tr>
                        <th className="p-3">Waktu</th>
                        <th className="p-3">Aksi</th>
                        <th className="p-3">Deskripsi Kegiatan</th>
                        <th className="p-3">Pengguna</th>
                        <th className="p-3">Peran</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-800/40 transition">
                          <td className="p-3 font-mono text-slate-400 text-[11px]">{log.timestamp}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40 font-bold text-[10px]">
                              {log.action}
                            </span>
                          </td>
                          <td className="p-3 text-slate-200">{log.description}</td>
                          <td className="p-3 font-semibold text-white">{log.actor}</td>
                          <td className="p-3 text-slate-400 text-[11px]">{log.role}</td>
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

      {/* =========================================================================
          MODALS
      ========================================================================= */}

      {/* MODAL 1: Edit Master Google Drive URL */}
      {isEditMasterDriveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-emerald-400" />
                <span>Ubah Tautan Master Google Drive</span>
              </h3>
              <button
                onClick={() => setIsEditMasterDriveOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMasterDriveUrl} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">URL Folder Google Drive:</label>
                <input
                  type="url"
                  value={tempMasterGdriveUrl}
                  onChange={(e) => setTempMasterGdriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/..."
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Tautan ini akan digunakan sebagai direktori utama bukti dokumen akreditasi S2 MKM.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditMasterDriveOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition shadow-md"
                >
                  Simpan Tautan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Custom Supporting Document (Tidak Terbatas pada Daftar) */}
      {isAddCustomDocOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Tambah Jenis Dokumen Pendukung Baru</span>
              </h3>
              <button
                onClick={() => setIsAddCustomDocOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomDoc} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Kriteria Sasaran:</label>
                  <select
                    value={newDocCritId}
                    onChange={(e) => setNewDocCritId(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {LAMPTKES_CRITERIA.map((c) => (
                      <option key={c.id} value={c.number}>
                        {c.code} - {c.shortName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Kategori Dokumen:</label>
                  <select
                    value={newDocCategory}
                    onChange={(e) => setNewDocCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Kebijakan/SK">Kebijakan/SK</option>
                    <option value="Pedoman/SOP">Pedoman/SOP</option>
                    <option value="Laporan Kinerja">Laporan Kinerja</option>
                    <option value="Dokumen Kurikulum">Dokumen Kurikulum</option>
                    <option value="MoU/MoA">MoU/MoA</option>
                    <option value="Dokumen Mutu">Dokumen Mutu</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Nama Dokumen Pendukung:</label>
                <input
                  type="text"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="Contoh: Dokumen Analisis Beban Kerja dan Rencana Suksesi Tendik"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Kode Dokumen (Opsional):</label>
                <input
                  type="text"
                  value={newDocCode}
                  onChange={(e) => setNewDocCode(e.target.value)}
                  placeholder="Contoh: DOC-K5-TAMBAHAN-01"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Deskripsi & Ruang Lingkup Dokumen:</label>
                <textarea
                  rows={3}
                  value={newDocDesc}
                  onChange={(e) => setNewDocDesc(e.target.value)}
                  placeholder="Jelaskan isi dan peranan dokumen ini terhadap pemenuhan kriteria..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="mandatory-doc"
                  checked={newDocMandatory}
                  onChange={(e) => setNewDocMandatory(e.target.checked)}
                  className="rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-950"
                />
                <label htmlFor="mandatory-doc" className="text-xs text-slate-300 cursor-pointer">
                  Tandai sebagai dokumen pendukung wajib institusi
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddCustomDocOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition shadow-md"
                >
                  Tambahkan Dokumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Add Digital Evidence Item */}
      {isAddEvidenceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-400" />
                <span>Tautkan Berkas Bukti Sahih Baru</span>
              </h3>
              <button
                onClick={() => setIsAddEvidenceOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEvidence} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Kriteria Sasaran:</label>
                  <select
                    value={newEvCritId}
                    onChange={(e) => setNewEvCritId(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {LAMPTKES_CRITERIA.map((c) => (
                      <option key={c.id} value={c.number}>
                        {c.code} - {c.shortName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Kode Elemen Tertaut:</label>
                  <input
                    type="text"
                    value={newEvElementCode}
                    onChange={(e) => setNewEvElementCode(e.target.value)}
                    placeholder="misal: 1.1.2 atau 5.5.1"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Judul / Nama Berkas Bukti:</label>
                <input
                  type="text"
                  value={newEvTitle}
                  onChange={(e) => setNewEvTitle(e.target.value)}
                  placeholder="Contoh: Berita Acara Lokakarya Kurikulum Bersama Pakar Kesmas"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Tipe Dokumen:</label>
                  <select
                    value={newEvType}
                    onChange={(e) => setNewEvType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="SK/Kebijakan">SK/Kebijakan</option>
                    <option value="Pedoman/SOP">Pedoman/SOP</option>
                    <option value="Laporan Kinerja">Laporan Kinerja</option>
                    <option value="Dokumen Kurikulum">Dokumen Kurikulum</option>
                    <option value="MoU/MoA">MoU/MoA</option>
                    <option value="Dokumen Mutu">Dokumen Mutu</option>
                    <option value="Sertifikat">Sertifikat</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Penyedia Cloud:</label>
                  <select
                    value={newEvProvider}
                    onChange={(e) => setNewEvProvider(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Google Drive">Google Drive</option>
                    <option value="OneDrive">OneDrive</option>
                    <option value="Dropbox">Dropbox</option>
                    <option value="Simulasi Upload">Simulasi Upload</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">URL Cloud Berkas (Google Drive):</label>
                <input
                  type="url"
                  value={newEvUrl}
                  onChange={(e) => setNewEvUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddEvidenceOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition shadow-md"
                >
                  Tautkan Berkas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
