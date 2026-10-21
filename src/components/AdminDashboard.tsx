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
} from 'lucide-react';
import { Peminatan, SemesterInfo, Lecturer, AcademicLink } from '../data/mkmData';

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
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'settings' | 'peminatan' | 'curriculum' | 'fees' | 'lecturers' | 'links' | 'applicants'
  >('settings');

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
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Data Calon Mahasiswa Baru (PMB S2)
                </h3>
                <p className="text-xs text-slate-500">
                  Total {applicants.length} pendaftar tercatat di basis data.
                </p>
              </div>
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

      </div>
    </div>
  );
};
