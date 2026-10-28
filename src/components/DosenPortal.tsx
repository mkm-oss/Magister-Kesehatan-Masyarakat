import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Video,
  GraduationCap,
  FileSpreadsheet,
  Library,
  BookMarked,
  ExternalLink,
  ArrowLeft,
  Calendar,
  Users,
  FileText,
  Clock,
  CheckCircle,
  Download,
  AlertCircle,
  FolderSync,
  Search,
  Star,
  Bell,
  Sparkles,
  Plus,
  X,
  Compass,
  Send,
  Trash2,
} from 'lucide-react';
import { GoogleDriveExplorer } from './GoogleDriveExplorer';
import { GoogleSheetsManager } from './GoogleSheetsManager';
import { PortalMenuItem, AnnouncementItem, ReminderItem } from '../data/mkmData';

export const DosenPortal: React.FC = () => {
  const {
    currentUser,
    logout,
    setActivePortalView,
    setActivePageSlug,
    portalMenus,
    announcements,
    reminders,
    favoriteMenuIds,
    toggleFavoriteMenu,
    addAnnouncement,
    deleteAnnouncement,
    addReminder,
    deleteReminder,
  } = useApp();

  const handleOpenMenu = (url?: string) => {
    if (!url) return;
    if (url.startsWith('/halaman/')) {
      const slug = url.replace('/halaman/', '');
      setActivePageSlug(slug);
      setActivePortalView('custom_page');
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const [activeTab, setActiveTab] = useState<
    'overview' | 'directory' | 'announcements' | 'agenda' | 'drive' | 'sheets'
  >('overview');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Form Tambah Pengumuman Baru (Khusus Dosen & Admin)
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnTarget, setNewAnnTarget] = useState<'Semua' | 'Mahasiswa' | 'Dosen'>('Mahasiswa');
  const [newAnnImportant, setNewAnnImportant] = useState(false);

  // Form Tambah Pengingat / Agenda
  const [newRemTitle, setNewRemTitle] = useState('');
  const [newRemDate, setNewRemDate] = useState('');
  const [newRemContent, setNewRemContent] = useState('');
  const [newRemTarget, setNewRemTarget] = useState<'Semua' | 'Mahasiswa' | 'Dosen' | 'Saya'>('Mahasiswa');

  // Filter menu untuk dosen
  const availableMenus = portalMenus.filter(
    (m) => m.active && (m.targetAudience === 'Semua' || m.targetAudience === 'Dosen')
  );

  // Pengumuman yang relevan untuk dosen
  const visibleAnnouncements = announcements.filter(
    (a) => a.target === 'Semua' || a.target === 'Dosen' || a.authorName === currentUser?.name
  );

  // Agenda untuk dosen
  const visibleReminders = reminders.filter(
    (r) => r.target === 'Semua' || r.target === 'Dosen' || r.authorName === currentUser?.name || r.target === 'Saya'
  );

  // Kategori unik
  const categories = ['Semua', ...Array.from(new Set(availableMenus.map((m) => m.category)))];

  // Menu yang difilter
  const filteredMenus = availableMenus.filter((m) => {
    const matchCat = selectedCategory === 'Semua' || m.category === selectedCategory;
    const matchQuery =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  // Menu tersemat
  const pinnedMenus = availableMenus.filter((m) => favoriteMenuIds.includes(m.id));
  const quickDisplayMenus = pinnedMenus.length > 0 ? pinnedMenus : availableMenus.slice(0, 6);

  // Helper sisa waktu
  const getTimeRemaining = (dateStr: string) => {
    const target = new Date(dateStr).getTime();
    if (isNaN(target)) return '';
    const diff = target - Date.now();
    const hours = Math.round(diff / (1000 * 60 * 60));
    if (diff < 0) return 'sudah lewat';
    if (hours < 1) return 'kurang dari 1 jam lagi';
    if (hours < 24) return `${hours} jam lagi`;
    const days = Math.round(hours / 24);
    return `${days} hari lagi`;
  };

  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnContent.trim()) return;
    addAnnouncement({
      title: newAnnTitle.trim(),
      content: newAnnContent.trim(),
      target: newAnnTarget,
      isImportant: newAnnImportant,
      authorName: currentUser?.name || 'Dr. Rochmawati, S.KM., M.Kes.',
      authorRole: 'Dosen',
    });
    setNewAnnTitle('');
    setNewAnnContent('');
    setNewAnnImportant(false);
  };

  const handleSaveReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRemTitle.trim() || !newRemDate) return;
    addReminder({
      title: newRemTitle.trim(),
      content: newRemContent.trim(),
      dateTime: newRemDate,
      target: newRemTarget,
      authorName: currentUser?.name || 'Dr. Rochmawati, S.KM., M.Kes.',
      authorRole: 'Dosen',
    });
    setNewRemTitle('');
    setNewRemDate('');
    setNewRemContent('');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat pagi';
    if (hour < 15) return 'Selamat siang';
    if (hour < 18) return 'Selamat sore';
    return 'Selamat malam';
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/UMPontianak_Logo_Warna_2e912afe.png"
              alt="Logo"
              className="h-9 w-auto bg-white/10 p-1 rounded"
            />
            <div>
              <span className="font-bold text-sm block">Portal Akademik Dosen</span>
              <span className="text-[11px] text-amber-300 font-medium">
                Magister Kesehatan Masyarakat · FIKPsi UM Pontianak
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActivePortalView('landing')}
              className="px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Halaman Utama</span>
            </button>
            <button
              onClick={logout}
              className="px-3 py-1.5 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900 rounded-lg transition-colors"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* Welcome Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
              <span>{getGreeting()}</span>
              <span>· Mode Dosen</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              {currentUser?.name || 'Dr. Rochmawati, S.KM., M.Kes.'}
            </h2>
            <p className="text-xs text-blue-200 font-mono">
              {currentUser?.identifier || 'NIDN: 1102047801'} · Dosen Pembina & Penguji Pascasarjana
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-xs">
            <Calendar className="w-4 h-4 text-amber-300" />
            <div>
              <span className="text-slate-300 block text-[10px]">Tahun Akademik:</span>
              <span className="font-bold text-white">2026/2027 (Genap)</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🏠</span>
            <span>Beranda Dosen</span>
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'directory'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4 text-amber-500" />
            <span>Direktori Menu Dosen ({availableMenus.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'announcements'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-500" />
            <span>Kelola Pengumuman</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-900 font-bold">
              {visibleAnnouncements.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('agenda')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'agenda'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Agenda & Pengingat</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-900 font-bold">
              {visibleReminders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('drive')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'drive'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderSync className="w-4 h-4 text-amber-500" />
            <span>Google Drive Dosen</span>
          </button>

          <button
            onClick={() => setActiveTab('sheets')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'sheets'
                ? 'bg-emerald-900 text-white shadow-sm'
                : 'bg-white text-emerald-800 hover:text-emerald-950'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Google Sheets Akademik</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePortalView('sim_akreditasi')}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 whitespace-nowrap bg-gradient-to-r from-amber-400/20 to-amber-500/20 text-[#92400E] hover:bg-amber-400/30 border border-amber-400/40 ml-auto"
          >
            <span>🏆</span>
            <span>SIM-Akreditasi PRO ➔</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW / BERANDA */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                onClick={() => setActiveTab('directory')}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-blue-500 transition-all flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-2xl font-bold">
                  🎓
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-slate-900 block leading-tight">
                    {availableMenus.length}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Menu Tugas Dosen</span>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('announcements')}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-blue-500 transition-all flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-2xl font-bold">
                  📢
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-slate-900 block leading-tight">
                    {visibleAnnouncements.length}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Pengumuman Aktif</span>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('agenda')}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-emerald-500 transition-all flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl font-bold">
                  ⏰
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-slate-900 block leading-tight">
                    {visibleReminders.length}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Agenda & Ujian</span>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('directory')}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-purple-500 transition-all flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center text-2xl font-bold">
                  ⭐
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-slate-900 block leading-tight">
                    {pinnedMenus.length}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Menu Tersemat</span>
                </div>
              </div>
            </div>

            {/* 2-Columns Layout: Menu Tersemat & Agenda */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Quick / Pinned Service Cards */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <span>{pinnedMenus.length > 0 ? '⭐ Menu Tersemat (Favorit)' : '⚡ Layanan Utama Dosen'}</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Akses cepat bimbingan tesis, review outline, evaluasi EDOM, dan perkuliahan
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('directory')}
                    className="text-xs font-bold text-blue-900 hover:underline"
                  >
                    Lihat Semua ({availableMenus.length}) →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickDisplayMenus.map((item) => {
                    const isPinned = favoriteMenuIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                              {item.icon || '📌'}
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleFavoriteMenu(item.id)}
                              className={`p-1.5 rounded-lg transition-all ${
                                isPinned
                                  ? 'text-amber-500 hover:text-amber-600 bg-amber-50'
                                  : 'text-slate-300 hover:text-amber-400 hover:bg-slate-50'
                              }`}
                              title={isPinned ? 'Lepas sematan' : 'Sematkan ke Beranda'}
                            >
                              <Star className={`w-5 h-5 ${isPinned ? 'fill-amber-400' : ''}`} />
                            </button>
                          </div>

                          <h4 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-blue-900 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                            {item.description}
                          </p>

                          {/* Sub-menu jika ada */}
                          {item.subMenus && item.subMenus.filter((s) => s.active).length > 0 && (
                            <div className="mb-3 space-y-1.5 bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/60">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                                Sub-Menu & Berkas:
                              </span>
                              <div className="space-y-1">
                                {item.subMenus.filter((s) => s.active).map((sub) => (
                                  <button
                                    key={sub.id}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenMenu(sub.url);
                                    }}
                                    className="w-full text-left px-2 py-1.5 rounded-md bg-white hover:bg-amber-100 text-slate-800 hover:text-amber-950 border border-slate-200/60 flex items-center justify-between text-xs transition-colors cursor-pointer"
                                  >
                                    <span className="flex items-center gap-1.5 truncate">
                                      <span>{sub.icon || '📌'}</span>
                                      <span className="font-semibold truncate">{sub.title}</span>
                                    </span>
                                    <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">
                            {item.category}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenMenu(item.url)}
                            className="text-xs font-bold text-blue-900 hover:text-blue-700 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                          >
                            <span>{item.url?.startsWith('/halaman/') ? 'Buka Halaman' : 'Buka Layanan'}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Agenda & Announcements */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Agenda Sidang & Mengajar Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>Agenda Mengajar & Sidang</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setActiveTab('agenda')}
                      className="text-[11px] font-bold text-blue-900 hover:underline"
                    >
                      Kelola →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {visibleReminders.slice(0, 3).map((rem) => {
                      const d = new Date(rem.dateTime);
                      return (
                        <div key={rem.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                          <div className="w-11 h-11 rounded-lg bg-amber-100 text-amber-900 flex flex-col items-center justify-center shrink-0 text-center leading-none">
                            <span className="font-extrabold text-sm">{d.getDate()}</span>
                            <span className="text-[9px] font-bold uppercase mt-0.5">
                              {d.toLocaleDateString('id-ID', { month: 'short' })}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-bold text-xs text-slate-900 block truncate">
                              {rem.title}
                            </span>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {rem.content || 'Agenda kegiatan akademik'}
                            </p>
                            <span className="text-[10px] font-semibold text-emerald-700 block mt-1">
                              ⏳ {getTimeRemaining(rem.dateTime)} · Target: {rem.target}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pengumuman Terbaru Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-blue-600" />
                      <span>Pengumuman Prodi</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setActiveTab('announcements')}
                      className="text-[11px] font-bold text-blue-900 hover:underline"
                    >
                      Terbitkan +
                    </button>
                  </div>

                  <div className="space-y-3">
                    {visibleAnnouncements.slice(0, 3).map((ann) => (
                      <div key={ann.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900 line-clamp-1">
                            {ann.title}
                          </span>
                          {ann.isImportant && (
                            <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full shrink-0">
                              Penting
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                          {ann.content}
                        </p>
                        <span className="text-[10px] text-slate-400 block pt-1">
                          Untuk: {ann.target} · {new Date(ann.createdAt).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: DIREKTORI MENU DOSEN */}
        {activeTab === 'directory' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Direktori Tugas & Layanan Dosen
              </h3>
              <p className="text-xs text-slate-500">
                Akses aplikasi bimbingan tesis, persetujuan outline naskah, laporan EDOM, dan input nilai SIAKAD.
              </p>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari menu layanan atau kata kunci…"
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-blue-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMenus.map((item) => {
                const isPinned = favoriteMenuIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 p-5 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group bg-slate-50/50"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-100/60 border border-amber-200 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shadow-inner">
                          {item.icon || '📌'}
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleFavoriteMenu(item.id)}
                          className={`p-1.5 rounded-lg transition-all ${
                            isPinned
                              ? 'text-amber-500 bg-amber-50'
                              : 'text-slate-300 hover:text-amber-400 hover:bg-slate-100'
                          }`}
                          title={isPinned ? 'Lepas sematan' : 'Sematkan ke Beranda'}
                        >
                          <Star className={`w-5 h-5 ${isPinned ? 'fill-amber-400' : ''}`} />
                        </button>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-blue-900 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                        {item.description}
                      </p>

                      {/* Sub-menu jika ada */}
                      {item.subMenus && item.subMenus.filter((s) => s.active).length > 0 && (
                        <div className="mb-3 space-y-1.5 bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/60">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                            Sub-Menu & Berkas:
                          </span>
                          <div className="space-y-1">
                            {item.subMenus.filter((s) => s.active).map((sub) => (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenMenu(sub.url);
                                }}
                                className="w-full text-left px-2 py-1.5 rounded-md bg-white hover:bg-amber-100 text-slate-800 hover:text-amber-950 border border-slate-200/60 flex items-center justify-between text-xs transition-colors cursor-pointer"
                              >
                                <span className="flex items-center gap-1.5 truncate">
                                  <span>{sub.icon || '📌'}</span>
                                  <span className="font-semibold truncate">{sub.title}</span>
                                </span>
                                <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">
                        {item.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenMenu(item.url)}
                        className="text-xs font-bold text-blue-900 hover:text-blue-700 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                      >
                        <span>{item.url?.startsWith('/halaman/') ? 'Buka Halaman' : 'Buka Layanan'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: KELOLA PENGUMUMAN (ADAPTASI DARI APPS SCRIPT) */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            
            {/* Form Publikasi Pengumuman */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                <span>Terbitkan Pengumuman Baru</span>
              </h3>
              <p className="text-xs text-slate-500">
                Publikasikan instruksi perkuliahan, jadwal kolokium, atau pengumuman bimbingan kepada mahasiswa.
              </p>

              <form onSubmit={handlePublishAnnouncement} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Judul Pengumuman *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAnnTitle}
                    onChange={(e) => setNewAnnTitle(e.target.value)}
                    placeholder="Contoh: Jadwal Batas Penyerahan Draf Outline Tesis"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Isi Pengumuman *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={newAnnContent}
                    onChange={(e) => setNewAnnContent(e.target.value)}
                    placeholder="Tuliskan isi detail pengumuman secara rinci…"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ditujukan Kepada
                    </label>
                    <select
                      value={newAnnTarget}
                      onChange={(e) => setNewAnnTarget(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Mahasiswa">Hanya Mahasiswa</option>
                      <option value="Semua">Semua Pengguna</option>
                      <option value="Dosen">Sesama Dosen</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="important-check"
                      checked={newAnnImportant}
                      onChange={(e) => setNewAnnImportant(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-900"
                    />
                    <label htmlFor="important-check" className="text-xs font-bold text-slate-700 cursor-pointer">
                      Tandai sebagai Pengumuman Penting (Prioritas)
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>Terbitkan Pengumuman</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Daftar Pengumuman Terbit */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-900">
                Pengumuman Terdaftar ({visibleAnnouncements.length})
              </h4>

              <div className="space-y-4">
                {visibleAnnouncements.map((ann) => {
                  const canDelete = currentUser?.role === 'admin' || ann.authorName === currentUser?.name;
                  return (
                    <div
                      key={ann.id}
                      className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 relative"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-sm text-slate-900">{ann.title}</h5>
                            {ann.isImportant && (
                              <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                                Penting
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 block">
                            Oleh: <strong>{ann.authorName}</strong> ({ann.authorRole}) · Target: <strong>{ann.target}</strong> · {new Date(ann.createdAt).toLocaleDateString('id-ID')}
                          </span>
                        </div>

                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => deleteAnnouncement(ann.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus Pengumuman"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap pt-1">
                        {ann.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: AGENDA & PENGINGAT (ADAPTASI DARI APPS SCRIPT) */}
        {activeTab === 'agenda' && (
          <div className="space-y-6">
            
            {/* Form Buat Agenda Baru */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span>Buat Pengingat / Agenda Akademik</span>
              </h3>
              <p className="text-xs text-slate-500">
                Atur jadwal kolokium proposal, batas pengisian nilai KHS, dan agenda penting kegiatan prodi.
              </p>

              <form onSubmit={handleSaveReminder} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Judul Agenda / Pengingat *
                    </label>
                    <input
                      type="text"
                      required
                      value={newRemTitle}
                      onChange={(e) => setNewRemTitle(e.target.value)}
                      placeholder="Contoh: Sidang Proposal Tesis Gelombang II"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tanggal & Jam *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={newRemDate}
                      onChange={(e) => setNewRemDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Keterangan / Lokasi
                    </label>
                    <textarea
                      rows={2}
                      value={newRemContent}
                      onChange={(e) => setNewRemContent(e.target.value)}
                      placeholder="Ruang sidang, link zoom, atau catatan teknis…"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ditujukan Kepada
                    </label>
                    <select
                      value={newRemTarget}
                      onChange={(e) => setNewRemTarget(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Mahasiswa">Semua Mahasiswa</option>
                      <option value="Semua">Semua Pengguna</option>
                      <option value="Dosen">Sesama Dosen</option>
                      <option value="Saya">Pribadi (Saya Sendiri)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Simpan Pengingat</span>
                  </button>
                </div>
              </form>
            </div>

            {/* List Agenda */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-900">
                Daftar Agenda & Pengingat ({visibleReminders.length})
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visibleReminders.map((rem) => {
                  const d = new Date(rem.dateTime);
                  const canDelete = currentUser?.role === 'admin' || rem.authorName === currentUser?.name;
                  return (
                    <div
                      key={rem.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-4 justify-between"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-amber-600 text-white flex flex-col items-center justify-center shrink-0 shadow-sm leading-none">
                          <span className="font-extrabold text-base">{d.getDate()}</span>
                          <span className="text-[10px] font-bold uppercase mt-0.5">
                            {d.toLocaleDateString('id-ID', { month: 'short' })}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-sm text-slate-900">{rem.title}</h5>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              {getTimeRemaining(rem.dateTime)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 whitespace-pre-wrap">{rem.content}</p>
                          <span className="text-[10px] text-slate-400 block pt-1">
                            Target: {rem.target} · Dibuat oleh {rem.authorName}
                          </span>
                        </div>
                      </div>

                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => deleteReminder(rem.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                          title="Hapus Agenda"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: GOOGLE DRIVE */}
        {activeTab === 'drive' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <GoogleDriveExplorer />
          </div>
        )}

        {/* TAB 6: GOOGLE SHEETS */}
        {activeTab === 'sheets' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <GoogleSheetsManager />
          </div>
        )}

      </div>
    </div>
  );
};
