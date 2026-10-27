import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Settings,
  BookOpen,
  GraduationCap,
  Users,
  DollarSign,
  Link as LinkIcon,
  UserCheck,
  RotateCcw,
  Save,
  CheckCircle2,
  Trash2,
  Plus,
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  HelpCircle,
  FolderSync,
  FileSpreadsheet,
  Database,
  Edit2,
  Bell,
  Clock,
  Compass,
  Send,
  Lock,
  KeyRound,
  Key,
  Eye,
  EyeOff,
  X,
  ShieldAlert,
} from 'lucide-react';
import {
  Peminatan,
  SemesterInfo,
  Lecturer,
  AcademicLink,
  PortalMenuItem,
  AnnouncementItem,
  ReminderItem,
  PortalUser,
} from '../data/mkmData';
import { GoogleDriveExplorer } from './GoogleDriveExplorer';
import { GoogleSheetsManager } from './GoogleSheetsManager';
import { SupabaseManager } from './SupabaseManager';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    logout,
    setActivePortalView,
    settings,
    updateSettings,
    peminatans,
    updatePeminatan,
    curriculum,
    updateCurriculum,
    lecturers,
    updateLecturers,
    addLecturer,
    deleteLecturer,
    academicLinks,
    updateAcademicLinks,
    addAcademicLink,
    deleteAcademicLink,
    applicants,
    updateApplicantStatus,
    resetAllDataToDefault,
    portalMenus,
    savePortalMenu,
    deletePortalMenu,
    announcements,
    addAnnouncement,
    deleteAnnouncement,
    reminders,
    addReminder,
    deleteReminder,
    portalUsers,
    addPortalUser,
    updatePortalUser,
    deletePortalUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    | 'settings'
    | 'peminatan'
    | 'curriculum'
    | 'fees'
    | 'lecturers'
    | 'links'
    | 'portal_menu'
    | 'announcements'
    | 'applicants'
    | 'users_security'
    | 'drive'
    | 'sheets'
    | 'supabase'
  >('settings');

  // Kelola User & Password Masuk Portal
  const [adminNewPin, setAdminNewPin] = useState('');
  const [adminConfirmPin, setAdminConfirmPin] = useState('');
  const [adminPinError, setAdminPinError] = useState('');

  // Modal / Form Tambah & Edit Pengguna
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userFormEmail, setUserFormEmail] = useState('');
  const [userFormName, setUserFormName] = useState('');
  const [userFormRole, setUserFormRole] = useState<'admin' | 'dosen' | 'mahasiswa'>('mahasiswa');
  const [userFormNumber, setUserFormNumber] = useState('');
  const [userFormPin, setUserFormPin] = useState('1234');
  const [userFormError, setUserFormError] = useState('');
  const [visiblePins, setVisiblePins] = useState<{ [key: string]: boolean }>({});
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Form Kelola Menu Layanan (Adaptasi dari Apps Script vK)
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [menuTitle, setMenuTitle] = useState('');
  const [menuDesc, setMenuDesc] = useState('');
  const [menuUrl, setMenuUrl] = useState('');
  const [menuCat, setMenuCat] = useState('Akademik');
  const [menuIcon, setMenuIcon] = useState('🎓');
  const [menuOrder, setMenuOrder] = useState(99);
  const [menuTarget, setMenuTarget] = useState<'Semua' | 'Mahasiswa' | 'Dosen'>('Semua');
  const [menuActive, setMenuActive] = useState(true);

  // Form Pengumuman & Agenda Admin
  const [admAnnTitle, setAdmAnnTitle] = useState('');
  const [admAnnContent, setAdmAnnContent] = useState('');
  const [admAnnTarget, setAdmAnnTarget] = useState<'Semua' | 'Mahasiswa' | 'Dosen'>('Semua');
  const [admAnnImportant, setAdmAnnImportant] = useState(false);

  const [admRemTitle, setAdmRemTitle] = useState('');
  const [admRemDate, setAdmRemDate] = useState('');
  const [admRemContent, setAdmRemContent] = useState('');
  const [admRemTarget, setAdmRemTarget] = useState<'Semua' | 'Mahasiswa' | 'Dosen'>('Semua');

  const [successToast, setSuccessToast] = useState('');

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Local state for Site Settings form
  const [formSettings, setFormSettings] = useState(settings);

  // Local state for selected Peminatan to edit
  const [selectedPeminatanId, setSelectedPeminatanId] = useState(peminatans[0]?.id || 'akk');
  const activePeminatan = peminatans.find((p) => p.id === selectedPeminatanId) || peminatans[0];
  const [editingPeminatan, setEditingPeminatan] = useState<Peminatan>(activePeminatan);

  // When selected peminatan changes
  const handleSelectPeminatan = (id: string) => {
    setSelectedPeminatanId(id);
    const target = peminatans.find((p) => p.id === id);
    if (target) setEditingPeminatan({ ...target });
  };

  // Local state for Curriculum editing
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const currentSem = curriculum.find((s) => s.semester === selectedSemester) || curriculum[0];
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseSks, setNewCourseSks] = useState<number>(3);
  const [newCourseCategory, setNewCourseCategory] = useState<'Wajib' | 'Peminatan' | 'Tesis'>('Wajib');

  // Local state for new Lecturer
  const [showAddLecturerModal, setShowAddLecturerModal] = useState(false);
  const [newLecName, setNewLecName] = useState('');
  const [newLecTitle, setNewLecTitle] = useState('');
  const [newLecSpecialty, setNewLecSpecialty] = useState('');
  const [newLecEdu, setNewLecEdu] = useState('');
  const [newLecScopus, setNewLecScopus] = useState(10);
  const [newLecRole, setNewLecRole] = useState('Dosen Tetap MKM');

  // Local state for new Academic Link
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkCategory, setNewLinkCategory] = useState<AcademicLink['category']>('kelas_online');
  const [newLinkTarget, setNewLinkTarget] = useState<AcademicLink['targetAudience']>('all');
  const [newLinkDesc, setNewLinkDesc] = useState('');
  const [newLinkBadge, setNewLinkBadge] = useState('Aplikasi');

  // Save Settings Handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formSettings);
    showToast('Pengaturan umum situs berhasil disimpan!');
  };

  // Save Peminatan Handler
  const handleSavePeminatan = (e: React.FormEvent) => {
    e.preventDefault();
    updatePeminatan(editingPeminatan.id, editingPeminatan);
    showToast(`Data Peminatan ${editingPeminatan.shortName} berhasil diperbarui!`);
  };

  // Add Course to Curriculum Handler
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseCode || !newCourseName) return;

    const updated = curriculum.map((sem) => {
      if (sem.semester === selectedSemester) {
        const newCourses = [
          ...sem.courses,
          {
            code: newCourseCode,
            name: newCourseName,
            sks: Number(newCourseSks),
            category: newCourseCategory,
          },
        ];
        const newTotalSks = newCourses.reduce((acc, c) => acc + c.sks, 0);
        return {
          ...sem,
          courses: newCourses,
          totalSks: newTotalSks,
        };
      }
      return sem;
    });

    updateCurriculum(updated);
    setNewCourseCode('');
    setNewCourseName('');
    showToast(`Mata kuliah berhasil ditambahkan ke Semester ${selectedSemester}!`);
  };

  // Delete Course Handler
  const handleDeleteCourse = (code: string) => {
    const updated = curriculum.map((sem) => {
      if (sem.semester === selectedSemester) {
        const newCourses = sem.courses.filter((c) => c.code !== code);
        const newTotalSks = newCourses.reduce((acc, c) => acc + c.sks, 0);
        return {
          ...sem,
          courses: newCourses,
          totalSks: newTotalSks,
        };
      }
      return sem;
    });

    updateCurriculum(updated);
    showToast(`Mata kuliah ${code} dihapus.`);
  };

  // Add Lecturer Handler
  const handleAddLecturer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLecName.trim()) return;

    addLecturer({
      name: newLecName,
      title: newLecTitle,
      specialty: newLecSpecialty,
      education: newLecEdu,
      scopusArticles: Number(newLecScopus),
      featuredRole: newLecRole,
    });

    setNewLecName('');
    setNewLecTitle('');
    setNewLecSpecialty('');
    setNewLecEdu('');
    setShowAddLecturerModal(false);
    showToast('Dosen pengajar baru berhasil ditambahkan!');
  };

  // Add Link Handler
  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) return;

    addAcademicLink({
      title: newLinkTitle,
      url: newLinkUrl,
      category: newLinkCategory,
      targetAudience: newLinkTarget,
      description: newLinkDesc,
      badge: newLinkBadge,
      iconName: 'ExternalLink',
    });

    setNewLinkTitle('');
    setNewLinkUrl('');
    setNewLinkDesc('');
    setShowAddLinkModal(false);
    showToast('Tautan aplikasi perkuliahan baru berhasil ditambahkan!');
  };

  // --- Handlers: Kelola User & Password Masuk Portal ---
  const handleUpdateAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminPinError('');
    if (!adminNewPin.trim()) {
      setAdminPinError('Password baru tidak boleh kosong.');
      return;
    }
    if (adminNewPin.trim().length < 4) {
      setAdminPinError('Password minimal 4 karakter/digit.');
      return;
    }
    if (adminNewPin.trim() !== adminConfirmPin.trim()) {
      setAdminPinError('Konfirmasi password baru tidak cocok.');
      return;
    }

    const adminUser = portalUsers.find((u) => u.role === 'admin') || portalUsers[0];
    if (adminUser) {
      updatePortalUser(adminUser.id, { pin: adminNewPin.trim() });
      setAdminNewPin('');
      setAdminConfirmPin('');
      showToast(`Password Admin (${adminUser.email}) berhasil diperbarui! Gunakan password baru ini saat masuk portal.`);
    }
  };

  const handleOpenAddUser = () => {
    setEditingUserId(null);
    setUserFormEmail('');
    setUserFormName('');
    setUserFormRole('mahasiswa');
    setUserFormNumber('');
    setUserFormPin('1234');
    setUserFormError('');
    setShowUserModal(true);
  };

  const handleOpenEditUser = (user: PortalUser) => {
    setEditingUserId(user.id);
    setUserFormEmail(user.email);
    setUserFormName(user.name);
    setUserFormRole(user.role);
    setUserFormNumber(user.number || '');
    setUserFormPin(user.pin);
    setUserFormError('');
    setShowUserModal(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    setUserFormError('');
    if (!userFormEmail.trim()) {
      setUserFormError('Email pengguna wajib diisi.');
      return;
    }
    if (!userFormName.trim()) {
      setUserFormError('Nama lengkap pengguna wajib diisi.');
      return;
    }
    if (!userFormPin.trim() || userFormPin.trim().length < 3) {
      setUserFormError('Password/PIN minimal 3 karakter.');
      return;
    }

    if (editingUserId) {
      updatePortalUser(editingUserId, {
        email: userFormEmail.trim(),
        name: userFormName.trim(),
        role: userFormRole,
        number: userFormNumber.trim(),
        pin: userFormPin.trim(),
      });
      showToast(`Data dan Password pengguna "${userFormName}" berhasil diperbarui!`);
    } else {
      // Check duplicate email
      if (portalUsers.some((u) => u.email.toLowerCase() === userFormEmail.trim().toLowerCase())) {
        setUserFormError('Email ini sudah terdaftar. Gunakan alamat email lain.');
        return;
      }
      addPortalUser({
        email: userFormEmail.trim(),
        name: userFormName.trim(),
        role: userFormRole,
        number: userFormNumber.trim(),
        pin: userFormPin.trim(),
      });
      showToast(`Pengguna baru "${userFormName}" berhasil ditambahkan dengan PIN: ${userFormPin.trim()}!`);
    }

    setShowUserModal(false);
  };

  const handleResetPin = (user: PortalUser) => {
    if (window.confirm(`Reset PIN pengguna "${user.name}" (${user.email}) kembali ke default "1234"?`)) {
      updatePortalUser(user.id, { pin: '1234' });
      showToast(`PIN pengguna "${user.name}" telah di-reset ke default 1234.`);
    }
  };

  const handleDeleteUser = (user: PortalUser) => {
    if (user.id === 'user-admin' || (user.role === 'admin' && portalUsers.filter((u) => u.role === 'admin').length <= 1)) {
      alert('Akun Administrator utama tidak dapat dihapus demi keamanan akses sistem.');
      return;
    }
    if (window.confirm(`Hapus pengguna "${user.name}" (${user.email}) dari portal?`)) {
      deletePortalUser(user.id);
      showToast(`Pengguna "${user.name}" berhasil dihapus.`);
    }
  };

  const togglePinVisibility = (id: string) => {
    setVisiblePins((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Bar for Admin */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/UMPontianak_Logo_Warna_2e912afe.png"
              alt="Logo"
              className="h-9 w-auto bg-white/10 p-1 rounded"
            />
            <div>
              <span className="font-bold text-sm block">Panel Administrator CMS</span>
              <span className="text-[11px] text-amber-300 font-medium">
                MKM FIKPsi UM Pontianak · Hak Akses Penuh
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setActivePortalView('landing')}
              className="px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Lihat Tampilan Web</span>
            </button>
            <button
              onClick={logout}
              className="px-3 py-1.5 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900 rounded-lg transition-colors"
            >
              Keluar (Logout)
            </button>
          </div>
        </div>
      </header>

      {/* Success Toast */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Admin Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* Navigation Tabs for CMS */}
        <div className="flex overflow-x-auto gap-2 pb-2 mb-6 border-b border-slate-200 no-scrollbar">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Tampilan & Info PMB</span>
          </button>

          <button
            onClick={() => setActiveTab('peminatan')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'peminatan'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Peminatan Studi (4)</span>
          </button>

          <button
            onClick={() => setActiveTab('curriculum')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'curriculum'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Kurikulum & SKS</span>
          </button>

          <button
            onClick={() => setActiveTab('fees')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'fees'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Biaya & Potongan</span>
          </button>

          <button
            onClick={() => setActiveTab('lecturers')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'lecturers'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Dosen Pengajar</span>
          </button>

          <button
            onClick={() => setActiveTab('links')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'links'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Tautan Aplikasi Kuliah & Tesis</span>
          </button>

          <button
            onClick={() => setActiveTab('portal_menu')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'portal_menu'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Compass className="w-4 h-4 text-blue-600" />
            <span>Kelola Menu Layanan ({portalMenus.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'announcements'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-500" />
            <span>Pengumuman & Agenda</span>
          </button>

          <button
            onClick={() => setActiveTab('applicants')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'applicants'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Pendaftar PMB ({applicants.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users_security')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'users_security'
                ? 'bg-rose-900 text-white shadow-sm ring-2 ring-rose-400'
                : 'bg-white text-rose-800 hover:text-rose-950 hover:bg-rose-50 border border-rose-200'
            }`}
          >
            <Lock className="w-4 h-4 text-rose-600" />
            <span>Kelola User & Password ({portalUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('drive')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'drive'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FolderSync className="w-4 h-4 text-amber-500" />
            <span>Google Drive</span>
          </button>

          <button
            onClick={() => setActiveTab('sheets')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'sheets'
                ? 'bg-emerald-900 text-white shadow-sm'
                : 'bg-white text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Google Sheets (PMB & Nilai)</span>
          </button>

          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'supabase'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50/80'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-500" />
            <span>Database Supabase</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePortalView('sim_akreditasi')}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all flex items-center gap-2 bg-gradient-to-r from-amber-400/20 to-amber-500/20 text-[#92400E] hover:bg-amber-400/30 border border-amber-400/40 ml-auto"
          >
            <span>🏆</span>
            <span>SIM-Akreditasi PRO ➔</span>
          </button>
        </div>

        {/* TAB 1: Site Settings */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Pengaturan Teks Utama & Status Pendaftaran PMB
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Semua perubahan di sini akan langsung tampil pada landing page publik.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Teks Kicker Atas Hero</label>
                <input
                  type="text"
                  value={formSettings.heroKicker}
                  onChange={(e) => setFormSettings({ ...formSettings, heroKicker: e.target.value })}
                  className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Headline Utama (Hero)</label>
                <input
                  type="text"
                  value={formSettings.heroHeadline}
                  onChange={(e) => setFormSettings({ ...formSettings, heroHeadline: e.target.value })}
                  className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Deskripsi Subheadline (Hero)</label>
                <textarea
                  rows={3}
                  value={formSettings.heroSubheadline}
                  onChange={(e) => setFormSettings({ ...formSettings, heroSubheadline: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-lg text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nama Gelombang PMB Aktif</label>
                  <input
                    type="text"
                    value={formSettings.pmbBatchName}
                    onChange={(e) => setFormSettings({ ...formSettings, pmbBatchName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Batas Waktu Pendaftaran</label>
                  <input
                    type="text"
                    value={formSettings.pmbBatchDeadline}
                    onChange={(e) => setFormSettings({ ...formSettings, pmbBatchDeadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Surel Resmi (Email)</label>
                  <input
                    type="email"
                    value={formSettings.officialEmail}
                    onChange={(e) => setFormSettings({ ...formSettings, officialEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nomor WhatsApp Hotline PMB</label>
                  <input
                    type="text"
                    value={formSettings.hotlineWhatsapp}
                    onChange={(e) => setFormSettings({ ...formSettings, hotlineWhatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Alamat Kampus & Sekretariat</label>
                <input
                  type="text"
                  value={formSettings.campusAddress}
                  onChange={(e) => setFormSettings({ ...formSettings, campusAddress: e.target.value })}
                  className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Yakin ingin reset semua data website ke setelan bawaan?')) {
                      resetAllDataToDefault();
                      setFormSettings(settings);
                      showToast('Semua data berhasil direset ke bawaan.');
                    }
                  }}
                  className="px-4 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Seluruh Data ke Bawaan Pabrik</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Pengaturan</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: Peminatan (formerly Konsentrasi) */}
        {activeTab === 'peminatan' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Kelola 4 Peminatan Studi Magister
                </h3>
                <p className="text-xs text-slate-500">
                  Ubah nama, gelar keahlian, deskripsi, prospek karir, dan topik riset tesis masing-masing peminatan.
                </p>
              </div>

              {/* Selector buttons */}
              <div className="flex items-center gap-2">
                {peminatans.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPeminatan(p.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedPeminatanId === p.id
                        ? 'bg-blue-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {p.shortName}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSavePeminatan} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nama Lengkap Peminatan</label>
                  <input
                    type="text"
                    value={editingPeminatan.name}
                    onChange={(e) => setEditingPeminatan({ ...editingPeminatan, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nama Ringkas / Label</label>
                  <input
                    type="text"
                    value={editingPeminatan.shortName}
                    onChange={(e) => setEditingPeminatan({ ...editingPeminatan, shortName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Deskripsi Peminatan</label>
                <textarea
                  rows={3}
                  value={editingPeminatan.description}
                  onChange={(e) => setEditingPeminatan({ ...editingPeminatan, description: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-lg text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Prospek Jabatan & Karir (Pisahkan dengan tanda koma atau baris baru)
                </label>
                <textarea
                  rows={3}
                  value={editingPeminatan.careerProspects.join('\n')}
                  onChange={(e) =>
                    setEditingPeminatan({
                      ...editingPeminatan,
                      careerProspects: e.target.value.split('\n').filter((x) => x.trim()),
                    })
                  }
                  className="w-full px-3.5 py-2 border rounded-lg text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Mata Kuliah Keahlian Peminatan (Satu baris per mata kuliah)
                </label>
                <textarea
                  rows={3}
                  value={editingPeminatan.coreSubjects.join('\n')}
                  onChange={(e) =>
                    setEditingPeminatan({
                      ...editingPeminatan,
                      coreSubjects: e.target.value.split('\n').filter((x) => x.trim()),
                    })
                  }
                  className="w-full px-3.5 py-2 border rounded-lg text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Contoh Topik Tesis Terapan (Satu baris per topik)
                </label>
                <textarea
                  rows={3}
                  value={editingPeminatan.thesisTopics.join('\n')}
                  onChange={(e) =>
                    setEditingPeminatan({
                      ...editingPeminatan,
                      thesisTopics: e.target.value.split('\n').filter((x) => x.trim()),
                    })
                  }
                  className="w-full px-3.5 py-2 border rounded-lg text-xs sm:text-sm"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Peminatan</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: Curriculum & SKS */}
        {activeTab === 'curriculum' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Kelola Struktur Mata Kuliah & SKS
                </h3>
                <p className="text-xs text-slate-500">
                  Tambah, sunting, atau hapus mata kuliah pada tiap semester.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((sem) => (
                  <button
                    key={sem}
                    onClick={() => setSelectedSemester(sem)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedSemester === sem
                        ? 'bg-blue-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Semester {sem}
                  </button>
                ))}
              </div>
            </div>

            {/* Courses Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase">
                    <th className="py-2.5 px-3">Kode MK</th>
                    <th className="py-2.5 px-3">Nama Mata Kuliah</th>
                    <th className="py-2.5 px-3">Kategori</th>
                    <th className="py-2.5 px-3 text-right">SKS</th>
                    <th className="py-2.5 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentSem.courses.map((c) => (
                    <tr key={c.code} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-slate-700">{c.code}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{c.name}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] font-medium text-slate-700">
                          {c.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold">{c.sks} SKS</td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleDeleteCourse(c.code)}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                          title="Hapus mata kuliah"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Course Form */}
            <form onSubmit={handleAddCourse} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Tambah Mata Kuliah ke Semester {selectedSemester}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Kode (e.g. MKM-7105)"
                  value={newCourseCode}
                  onChange={(e) => setNewCourseCode(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-xs font-mono"
                  required
                />
                <input
                  type="text"
                  placeholder="Nama Mata Kuliah"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  className="sm:col-span-2 px-3 py-2 border rounded-lg text-xs font-medium"
                  required
                />
                <div className="flex gap-2">
                  <select
                    value={newCourseCategory}
                    onChange={(e) => setNewCourseCategory(e.target.value as any)}
                    className="px-2 py-2 border rounded-lg text-xs bg-white"
                  >
                    <option value="Wajib">Wajib</option>
                    <option value="Peminatan">Peminatan</option>
                    <option value="Tesis">Tesis</option>
                  </select>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={newCourseSks}
                    onChange={(e) => setNewCourseSks(Number(e.target.value))}
                    className="w-16 px-2 py-2 border rounded-lg text-xs text-center font-bold"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 text-xs font-bold text-white bg-blue-900 rounded-lg hover:bg-blue-800 flex items-center justify-center shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: Fees & Discounts */}
        {activeTab === 'fees' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Kelola Tarif Biaya Studi, Matrikulasi & Subsidi
              </h3>
              <p className="text-xs text-slate-500">
                Nilai ini akan otomatis mengkalkulasi simulasi biaya di landing page publik.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateSettings(formSettings);
                showToast('Tarif biaya pendidikan berhasil diperbarui!');
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Biaya Formulir Pendaftaran (IDR)</label>
                  <input
                    type="number"
                    value={formSettings.registrationFee}
                    onChange={(e) =>
                      setFormSettings({ ...formSettings, registrationFee: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">SPP per Semester (IDR)</label>
                  <input
                    type="number"
                    value={formSettings.baseSppPerSemester}
                    onChange={(e) =>
                      setFormSettings({ ...formSettings, baseSppPerSemester: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Biaya Matrikulasi S1 Non-Kesehatan (IDR)</label>
                  <input
                    type="number"
                    value={formSettings.matriculationFee}
                    onChange={(e) =>
                      setFormSettings({ ...formSettings, matriculationFee: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Dana Pengembangan Pascasarjana (IDR)</label>
                  <input
                    type="number"
                    value={formSettings.baseDevelopmentFee}
                    onChange={(e) =>
                      setFormSettings({ ...formSettings, baseDevelopmentFee: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Potongan Alumni S1 UM Pontianak (IDR)</label>
                  <input
                    type="number"
                    value={formSettings.alumniDiscount}
                    onChange={(e) =>
                      setFormSettings({ ...formSettings, alumniDiscount: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm font-mono text-emerald-700 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Potongan Mitra RS / Dinkes (IDR)</label>
                  <input
                    type="number"
                    value={formSettings.partnerDiscount}
                    onChange={(e) =>
                      setFormSettings({ ...formSettings, partnerDiscount: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm font-mono text-emerald-700 font-bold"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Biaya</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 5: Lecturers */}
        {activeTab === 'lecturers' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Dosen Pengajar & Pembimbing Tesis Pascasarjana
                </h3>
                <p className="text-xs text-slate-500">
                  Total {lecturers.length} dosen aktif terdaftar di sistem.
                </p>
              </div>
              <button
                onClick={() => setShowAddLecturerModal(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Dosen</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lecturers.map((lec) => (
                <div
                  key={lec.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                      {lec.featuredRole}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{lec.name}</h4>
                    <p className="text-xs text-slate-600">{lec.title}</p>
                    <p className="text-xs text-slate-500 italic">{lec.specialty}</p>
                    <div className="text-[11px] text-slate-500 font-mono pt-1">
                      {lec.scopusArticles} Publikasi Scopus · {lec.education}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Hapus dosen ${lec.name}?`)) {
                        deleteLecturer(lec.id);
                        showToast(`Dosen ${lec.name} berhasil dihapus.`);
                      }
                    }}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                    title="Hapus dosen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Modal Add Lecturer */}
            {showAddLecturerModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
                <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
                  <h4 className="text-base font-bold text-slate-900">Tambah Dosen MKM</h4>
                  <form onSubmit={handleAddLecturer} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Nama Lengkap & Gelar (e.g. Dr. H. ..."
                      value={newLecName}
                      onChange={(e) => setNewLecName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Jabatan Akademik (e.g. Lektor Kepala)"
                      value={newLecTitle}
                      onChange={(e) => setNewLecTitle(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Bidang Keahlian / Spesialisasi"
                      value={newLecSpecialty}
                      onChange={(e) => setNewLecSpecialty(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Pendidikan Terakhir"
                      value={newLecEdu}
                      onChange={(e) => setNewLecEdu(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Jumlah Publikasi Scopus"
                      value={newLecScopus}
                      onChange={(e) => setNewLecScopus(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Peran (e.g. Dosen Pembina / Pakar K3)"
                      value={newLecRole}
                      onChange={(e) => setNewLecRole(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddLecturerModal(false)}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-bold text-white bg-blue-900 rounded-lg hover:bg-blue-800"
                      >
                        Simpan Dosen
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: Academic Links (Kelas Online & Tesis) */}
        {activeTab === 'links' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Kelola Tautan Aplikasi Perkuliahan (Kelas Online, Tesis, SIAKAD)
                </h3>
                <p className="text-xs text-slate-500">
                  Tautan ini akan muncul langsung di Portal Dosen dan Portal Mahasiswa.
                </p>
              </div>
              <button
                onClick={() => setShowAddLinkModal(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Tautan Aplikasi</span>
              </button>
            </div>

            <div className="space-y-3">
              {academicLinks.map((link) => (
                <div
                  key={link.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                        {link.badge}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{link.title}</span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        (Untuk: {link.targetAudience.toUpperCase()})
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{link.description}</p>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono text-blue-700 hover:underline flex items-center gap-1"
                    >
                      <span>{link.url}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Hapus tautan ${link.title}?`)) {
                        deleteAcademicLink(link.id);
                        showToast('Tautan berhasil dihapus.');
                      }
                    }}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                    title="Hapus link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Modal Add Link */}
            {showAddLinkModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
                <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
                  <h4 className="text-base font-bold text-slate-900">Tambah Tautan Aplikasi Perkuliahan</h4>
                  <form onSubmit={handleAddLink} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Judul Aplikasi (e.g. Kelas Online Zoom / LMS Baru)"
                      value={newLinkTitle}
                      onChange={(e) => setNewLinkTitle(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                      required
                    />
                    <input
                      type="url"
                      placeholder="URL Tautan (e.g. https://...)"
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
                      required
                    />
                    <textarea
                      rows={2}
                      placeholder="Deskripsi singkat fungsi aplikasi"
                      value={newLinkDesc}
                      onChange={(e) => setNewLinkDesc(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={newLinkCategory}
                        onChange={(e) => setNewLinkCategory(e.target.value as any)}
                        className="px-2 py-2 border rounded-lg text-xs bg-white"
                      >
                        <option value="kelas_online">Kategori: Kelas Online</option>
                        <option value="tesis">Kategori: Tesis</option>
                        <option value="akademik">Kategori: Akademik SIAKAD</option>
                        <option value="referensi">Kategori: Referensi / Perpustakaan</option>
                        <option value="keuangan">Kategori: Keuangan / SPP</option>
                      </select>
                      <select
                        value={newLinkTarget}
                        onChange={(e) => setNewLinkTarget(e.target.value as any)}
                        className="px-2 py-2 border rounded-lg text-xs bg-white"
                      >
                        <option value="all">Muncul di Semua Portal</option>
                        <option value="dosen">Hanya Portal Dosen</option>
                        <option value="mahasiswa">Hanya Portal Mahasiswa</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      placeholder="Badge Tag (e.g. Utama / Bimbingan)"
                      value={newLinkBadge}
                      onChange={(e) => setNewLinkBadge(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddLinkModal(false)}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-bold text-white bg-blue-900 rounded-lg hover:bg-blue-800"
                      >
                        Simpan Tautan
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: Applicants Data */}
        {activeTab === 'applicants' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Data Calon Mahasiswa Baru (PMB S2)
                </h3>
                <p className="text-xs text-slate-500">
                  Total {applicants.length} pendaftar tercatat di basis data.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('sheets')}
                className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-sm transition-all flex items-center gap-2"
                title="Buka panel Google Sheets untuk ekspor atau kelola lembar pendaftar"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Buka di Google Sheets ({applicants.length} Data)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase">
                    <th className="py-2.5 px-3">No. Registrasi</th>
                    <th className="py-2.5 px-3">Nama Lengkap</th>
                    <th className="py-2.5 px-3">Kontak & Instansi</th>
                    <th className="py-2.5 px-3">Peminatan Pilihan</th>
                    <th className="py-2.5 px-3">Status Seleksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applicants.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-blue-900">
                        {app.registrationNumber}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {app.registeredAt}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{app.fullName}</div>
                        <div className="text-[11px] text-slate-500">
                          S1: {app.s1Major} ({app.s1Campus || '-'})
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <a
                          href={`https://wa.me/${app.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <span>WA: {app.whatsapp}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <div className="text-[11px] text-slate-500">
                          {app.currentJob || '-'} · {app.email}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-800">{app.peminatan}</span>
                        <span className="block text-[10px] text-slate-500">{app.category}</span>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={app.status}
                          onChange={(e) =>
                            updateApplicantStatus(app.id, e.target.value as any)
                          }
                          className={`text-xs font-semibold px-2 py-1 rounded border ${
                            app.status === 'Diterima'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : app.status === 'Jadwal Wawancara'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : app.status === 'Lolos Berkas'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-slate-50 text-slate-700 border-slate-300'
                          }`}
                        >
                          <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                          <option value="Lolos Berkas">Lolos Berkas</option>
                          <option value="Jadwal Wawancara">Jadwal Wawancara</option>
                          <option value="Diterima">Diterima</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: Kelola Menu Layanan (Adaptasi dari Apps Script vK) */}
        {activeTab === 'portal_menu' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-blue-600" />
                    <span>{editingMenuId ? '✏️ Ubah Menu Layanan' : '⚙️ Tambah Menu Layanan Baru'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kelola modul layanan yang tampil di portal Mahasiswa dan Dosen (seperti Bimbingan Tesis, Outline, Matrikulasi, EDOM, dll).
                  </p>
                </div>
                {editingMenuId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMenuId(null);
                      setMenuTitle('');
                      setMenuDesc('');
                      setMenuUrl('');
                      setMenuCat('Akademik');
                      setMenuIcon('🎓');
                      setMenuOrder(99);
                      setMenuTarget('Semua');
                      setMenuActive(true);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Batal Edit
                  </button>
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!menuTitle.trim()) return;
                  savePortalMenu({
                    id: editingMenuId || `menu-${Date.now()}`,
                    title: menuTitle.trim(),
                    description: menuDesc.trim(),
                    url: menuUrl.trim(),
                    category: menuCat.trim(),
                    icon: menuIcon.trim() || '📌',
                    order: Number(menuOrder) || 99,
                    targetAudience: menuTarget,
                    active: menuActive,
                  });
                  showToast('Menu layanan berhasil disimpan!');
                  setEditingMenuId(null);
                  setMenuTitle('');
                  setMenuDesc('');
                  setMenuUrl('');
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Menu *</label>
                  <input
                    type="text"
                    required
                    value={menuTitle}
                    onChange={(e) => setMenuTitle(e.target.value)}
                    placeholder="Contoh: Bimbingan Tesis atau Pengajuan Outline"
                    className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Singkat</label>
                  <input
                    type="text"
                    value={menuDesc}
                    onChange={(e) => setMenuDesc(e.target.value)}
                    placeholder="Contoh: Catat bimbingan, jadwal, dan tahapan tesis mahasiswa"
                    className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tautan URL (https://…)</label>
                  <input
                    type="url"
                    value={menuUrl}
                    onChange={(e) => setMenuUrl(e.target.value)}
                    placeholder="https://tesis.unmuhpnk.ac.id/mkm"
                    className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                    <input
                      type="text"
                      value={menuCat}
                      onChange={(e) => setMenuCat(e.target.value)}
                      placeholder="Akademik / Pembelajaran / Mutu / Administrasi"
                      className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ikon (Emoji)</label>
                    <input
                      type="text"
                      value={menuIcon}
                      onChange={(e) => setMenuIcon(e.target.value)}
                      placeholder="🎓, 📝, 🎬, 📊, ✉️, 🏛️"
                      className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Urutan Tampil</label>
                    <input
                      type="number"
                      value={menuOrder}
                      onChange={(e) => setMenuOrder(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ditampilkan Untuk</label>
                    <select
                      value={menuTarget}
                      onChange={(e) => setMenuTarget(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm bg-white"
                    >
                      <option value="Semua">Semua Pengguna</option>
                      <option value="Mahasiswa">Hanya Mahasiswa</option>
                      <option value="Dosen">Hanya Dosen</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Status Menu</label>
                    <select
                      value={menuActive ? 'Ya' : 'Tidak'}
                      onChange={(e) => setMenuActive(e.target.value === 'Ya')}
                      className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm bg-white"
                    >
                      <option value="Ya">Aktif (Tampil)</option>
                      <option value="Tidak">Disembunyikan</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-all shadow-sm flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingMenuId ? 'Simpan Perubahan Menu' : 'Simpan Menu Baru'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Daftar Menu Terdaftar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-900">
                Daftar Menu Layanan Terdaftar ({portalMenus.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portalMenus.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl p-2 rounded-lg bg-white border border-slate-200 shadow-xs">
                            {m.icon || '📌'}
                          </span>
                          <div>
                            <h5 className="font-bold text-sm text-slate-900">{m.title}</h5>
                            <span className="text-[11px] text-slate-500 font-medium">
                              Kategori: {m.category} · Akses: {m.targetAudience}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            m.active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {m.active ? 'Aktif' : 'Disembunyikan'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2">{m.description}</p>
                      <div className="text-[11px] text-blue-800 truncate font-mono mt-1">
                        URL: {m.url || 'belum diatur'}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMenuId(m.id);
                          setMenuTitle(m.title);
                          setMenuDesc(m.description);
                          setMenuUrl(m.url);
                          setMenuCat(m.category);
                          setMenuIcon(m.icon);
                          setMenuOrder(m.order);
                          setMenuTarget(m.targetAudience);
                          setMenuActive(m.active);
                          window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}
                        className="px-3 py-1 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Ubah</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Hapus menu "${m.title}"?`)) {
                            deletePortalMenu(m.id);
                            showToast('Menu berhasil dihapus');
                          }
                        }}
                        className="px-3 py-1 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: Pengumuman & Agenda Prodi */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            {/* Form Publikasi Pengumuman */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                <span>Terbitkan Pengumuman Resmi Prodi</span>
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!admAnnTitle.trim() || !admAnnContent.trim()) return;
                  addAnnouncement({
                    title: admAnnTitle.trim(),
                    content: admAnnContent.trim(),
                    target: admAnnTarget,
                    isImportant: admAnnImportant,
                    authorName: 'Admin Prodi MKM',
                    authorRole: 'Admin',
                  });
                  setAdmAnnTitle('');
                  setAdmAnnContent('');
                  setAdmAnnImportant(false);
                  showToast('Pengumuman prodi berhasil diterbitkan!');
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Pengumuman *</label>
                  <input
                    type="text"
                    required
                    value={admAnnTitle}
                    onChange={(e) => setAdmAnnTitle(e.target.value)}
                    placeholder="Contoh: Jadwal Batas Unggah Proposal Tesis Periode Genap"
                    className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Isi Pengumuman *</label>
                  <textarea
                    rows={3}
                    required
                    value={admAnnContent}
                    onChange={(e) => setAdmAnnContent(e.target.value)}
                    placeholder="Tuliskan detail pengumuman prodi…"
                    className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ditujukan Kepada</label>
                    <select
                      value={admAnnTarget}
                      onChange={(e) => setAdmAnnTarget(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm bg-white"
                    >
                      <option value="Semua">Semua Pengguna</option>
                      <option value="Mahasiswa">Hanya Mahasiswa</option>
                      <option value="Dosen">Hanya Dosen</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="adm-important"
                      checked={admAnnImportant}
                      onChange={(e) => setAdmAnnImportant(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-900"
                    />
                    <label htmlFor="adm-important" className="text-xs font-bold text-slate-700 cursor-pointer">
                      Tandai sebagai Pengumuman Penting
                    </label>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-all shadow-sm flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Terbitkan Pengumuman</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Form Agenda & Pengingat */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span>Tambah Pengingat / Agenda Prodi</span>
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!admRemTitle.trim() || !admRemDate) return;
                  addReminder({
                    title: admRemTitle.trim(),
                    content: admRemContent.trim(),
                    dateTime: admRemDate,
                    target: admRemTarget,
                    authorName: 'Admin Prodi MKM',
                    authorRole: 'Admin',
                  });
                  setAdmRemTitle('');
                  setAdmRemDate('');
                  setAdmRemContent('');
                  showToast('Pengingat agenda berhasil disimpan!');
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Judul Agenda *</label>
                    <input
                      type="text"
                      required
                      value={admRemTitle}
                      onChange={(e) => setAdmRemTitle(e.target.value)}
                      placeholder="Contoh: Rapat Evaluasi Kurikulum Semester Genap"
                      className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal & Waktu *</label>
                    <input
                      type="datetime-local"
                      required
                      value={admRemDate}
                      onChange={(e) => setAdmRemDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan / Lokasi</label>
                    <textarea
                      rows={2}
                      value={admRemContent}
                      onChange={(e) => setAdmRemContent(e.target.value)}
                      placeholder="Ruang rapat atau link Google Meet…"
                      className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ditujukan Kepada</label>
                    <select
                      value={admRemTarget}
                      onChange={(e) => setAdmRemTarget(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 border rounded-lg text-xs sm:text-sm bg-white"
                    >
                      <option value="Semua">Semua Pengguna</option>
                      <option value="Dosen">Hanya Dosen</option>
                      <option value="Mahasiswa">Hanya Mahasiswa</option>
                    </select>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-sm flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Simpan Agenda</span>
                  </button>
                </div>
              </form>
            </div>

            {/* List Pengumuman & Agenda */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Daftar Pengumuman Terbit ({announcements.length})</h4>
                <div className="space-y-3">
                  {announcements.map((a) => (
                    <div key={a.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{a.title}</span>
                        <button
                          type="button"
                          onClick={() => deleteAnnouncement(a.id)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-600">{a.content}</p>
                      <span className="text-[10px] text-slate-400 block">Target: {a.target}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Daftar Agenda ({reminders.length})</h4>
                <div className="space-y-3">
                  {reminders.map((r) => (
                    <div key={r.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{r.title}</span>
                        <button
                          type="button"
                          onClick={() => deleteReminder(r.id)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 block">
                        📅 {new Date(r.dateTime).toLocaleString('id-ID')}
                      </span>
                      <p className="text-xs text-slate-600">{r.content}</p>
                      <span className="text-[10px] text-slate-400 block">Target: {r.target}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: Google Drive Institusi */}
        {activeTab === 'drive' && (
          <GoogleDriveExplorer title="Google Drive Institusi MKM FIKPsi UM Pontianak" />
        )}

        {/* TAB 9: Google Sheets PMB & Nilai */}
        {activeTab === 'sheets' && (
          <GoogleSheetsManager title="Google Sheets PMB & Akademik MKM UM Pontianak" />
        )}

        {/* TAB 10: Supabase Database Manager */}
        {activeTab === 'supabase' && <SupabaseManager />}

        {/* TAB 11: Kelola User & Password Masuk Portal */}
        {activeTab === 'users_security' && (
          <div className="space-y-6">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-blue-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-rose-900/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  <span>Autentikasi & Keamanan Hak Akses Portal</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Kelola Pengguna & Password Masuk Portal
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Kelola data akun mahasiswa, dosen, dan administrator. Anda dapat menambah pengguna baru, 
                  mengedit data akun, serta mengganti kata sandi/PIN untuk autentikasi masuk ke portal.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddUser}
                className="py-3 px-5 rounded-xl font-bold text-xs sm:text-sm bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Pengguna Baru</span>
              </button>
            </div>

            {/* Stat Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block">Total Pengguna</span>
                <span className="text-2xl font-extrabold text-slate-900">{portalUsers.length}</span>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-emerald-600 uppercase block">Administrator</span>
                <span className="text-2xl font-extrabold text-emerald-700">
                  {portalUsers.filter((u) => u.role === 'admin').length}
                </span>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-amber-600 uppercase block">Dosen Terdaftar</span>
                <span className="text-2xl font-extrabold text-amber-700">
                  {portalUsers.filter((u) => u.role === 'dosen').length}
                </span>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-blue-600 uppercase block">Mahasiswa</span>
                <span className="text-2xl font-extrabold text-blue-700">
                  {portalUsers.filter((u) => u.role === 'mahasiswa').length}
                </span>
              </div>
            </div>

            {/* Bagian 1: Ganti Password Admin (Keamanan Akses Masuk) */}
            <div className="bg-white rounded-2xl border border-rose-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      Ganti Password Masuk Administrator
                    </h4>
                    <p className="text-xs text-slate-500">
                      Password ini akan digunakan saat Anda mengklik "Masuk Portal Admin" dari halaman awal.
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
                  <span className="text-slate-500">PIN Admin Saat Ini:</span>
                  <span className="font-mono font-bold text-rose-700">
                    {portalUsers.find((u) => u.role === 'admin')?.pin || '1234'}
                  </span>
                </div>
              </div>

              {adminPinError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{adminPinError}</span>
                </div>
              )}

              <form onSubmit={handleUpdateAdminPassword} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password / PIN Baru Admin
                  </label>
                  <input
                    type="password"
                    placeholder="Minimal 4 karakter/angka"
                    value={adminNewPin}
                    onChange={(e) => setAdminNewPin(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    type="password"
                    placeholder="Ketik ulang password baru"
                    value={adminConfirmPin}
                    onChange={(e) => setAdminConfirmPin(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-rose-700 hover:bg-rose-600 text-white shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Perbarui Password Admin</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Bagian 2: Tabel Kelola Pengguna Portal & Password */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Daftar Pengguna Portal & Kredensial
                  </h4>
                  <p className="text-xs text-slate-500">
                    Klik tombol "Edit" untuk mengubah informasi nama, email, peran, atau kata sandi/PIN pengguna.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="Cari nama, email, NIDN/NIM..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
                  />
                </div>
              </div>

              {/* Table of Users */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Pengguna</th>
                      <th className="py-3 px-4">Peran Akses</th>
                      <th className="py-3 px-4">NIDN / NIM</th>
                      <th className="py-3 px-4">Password / PIN</th>
                      <th className="py-3 px-4">Diperbarui</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {portalUsers
                      .filter((u) => {
                        if (!userSearchTerm.trim()) return true;
                        const s = userSearchTerm.toLowerCase();
                        return (
                          u.name.toLowerCase().includes(s) ||
                          u.email.toLowerCase().includes(s) ||
                          (u.number && u.number.toLowerCase().includes(s))
                        );
                      })
                      .map((u) => {
                        const isVisible = visiblePins[u.id];
                        return (
                          <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                    u.role === 'admin'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : u.role === 'dosen'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}
                                >
                                  {u.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <span className="font-bold text-slate-900 block">{u.name}</span>
                                  <span className="text-[11px] text-slate-500 font-mono">{u.email}</span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  u.role === 'admin'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : u.role === 'dosen'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                                }`}
                              >
                                {u.role === 'admin' ? '⚙️ Admin' : u.role === 'dosen' ? '👨‍🏫 Dosen' : '🎓 Mahasiswa'}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 font-mono text-slate-600">
                              {u.number || '-'}
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                  {isVisible ? u.pin : '••••'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => togglePinVisibility(u.id)}
                                  className="text-slate-400 hover:text-slate-700 p-1 rounded"
                                  title={isVisible ? 'Sembunyikan Password' : 'Lihat Password'}
                                >
                                  {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                              {u.updatedAt || 'Awal'}
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditUser(u)}
                                  className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                                  title="Edit Pengguna & Password"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleResetPin(u)}
                                  className="px-2 py-1 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 font-semibold text-[11px] transition-colors cursor-pointer"
                                  title="Reset PIN ke 1234"
                                >
                                  Reset 1234
                                </button>

                                {u.id !== 'user-admin' && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteUser(u)}
                                    className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                                    title="Hapus Pengguna"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Modal Tambah / Edit Pengguna & Password */}
        {showUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-300">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {editingUserId ? 'Edit Pengguna & Password Portal' : 'Tambah Pengguna Baru Portal'}
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      Sistem Autentikasi MKM UM Pontianak
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="p-1 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveUser} className="p-6 space-y-4">
                {userFormError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{userFormError}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Nama Lengkap & Gelar *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Dr. Budi Santoso, M.Kes atau Ahmad Fauzi"
                    value={userFormName}
                    onChange={(e) => setUserFormName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Email Akun Portal *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="contoh: dosen.baru@unmuhpnk.ac.id"
                      value={userFormEmail}
                      onChange={(e) => setUserFormEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Peran / Hak Akses *
                    </label>
                    <select
                      value={userFormRole}
                      onChange={(e) => setUserFormRole(e.target.value as 'admin' | 'dosen' | 'mahasiswa')}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 bg-white"
                    >
                      <option value="mahasiswa">🎓 Mahasiswa</option>
                      <option value="dosen">👨‍🏫 Dosen</option>
                      <option value="admin">⚙️ Administrator</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Nomor Identitas (NIDN / NIM)
                    </label>
                    <input
                      type="text"
                      placeholder={userFormRole === 'dosen' ? 'NIDN Dosen' : userFormRole === 'mahasiswa' ? 'NIM Mahasiswa' : 'Opsional'}
                      value={userFormNumber}
                      onChange={(e) => setUserFormNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Kata Sandi / PIN Masuk Portal *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 1234 atau password rahasia"
                      value={userFormPin}
                      onChange={(e) => setUserFormPin(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono font-bold text-rose-800"
                    />
                    <span className="text-[10px] text-slate-400 block">
                      Digunakan oleh user untuk login ke portal
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowUserModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingUserId ? 'Simpan Perubahan' : 'Tambahkan Pengguna'}</span>
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
