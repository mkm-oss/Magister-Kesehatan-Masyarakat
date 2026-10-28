import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  Search,
  Star,
  Bell,
  Plus,
  X,
  Compass,
  FileSpreadsheet,
  FolderSync,
  LogOut,
  ChevronRight,
  Info,
} from 'lucide-react';
import { GoogleDriveExplorer } from './GoogleDriveExplorer';
import { GoogleSheetsManager } from './GoogleSheetsManager';
import { PortalMenuItem, AnnouncementItem, ReminderItem } from '../data/mkmData';

// Fallback icon resolver to guarantee original menu icons are always preserved
const resolveMenuIcon = (item: PortalMenuItem): string => {
  if (item.icon && item.icon.trim()) return item.icon;
  const t = item.title.toLowerCase();
  if (t.includes('bimbingan')) return '🎓';
  if (t.includes('outline')) return '📝';
  if (t.includes('matrikulasi') || t.includes('materi')) return '🎬';
  if (t.includes('edom')) return '📊';
  if (t.includes('surat')) return '✉️';
  if (t.includes('siakad') || t.includes('akademik')) return '🏛️';
  if (t.includes('turnitin') || t.includes('plagiasi')) return '🔍';
  if (t.includes('perpustakaan') || t.includes('repositori')) return '📚';
  return '📌';
};

export const MahasiswaPortal: React.FC = () => {
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
    addReminder,
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

  // Modal tambah pengingat pribadi
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderNotes, setReminderNotes] = useState('');

  // Filter menu aktif untuk mahasiswa
  const availableMenus = portalMenus.filter(
    (m) => m.active && (m.targetAudience === 'Semua' || m.targetAudience === 'Mahasiswa')
  );

  // Filter pengumuman untuk mahasiswa
  const studentAnnouncements = announcements.filter(
    (a) => a.target === 'Semua' || a.target === 'Mahasiswa'
  );

  // Filter agenda untuk mahasiswa
  const studentReminders = reminders.filter(
    (r) => r.target === 'Semua' || r.target === 'Mahasiswa' || r.target === 'Saya'
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

  // Menu tersemat (Favorit)
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

  const handleSavePersonalReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTitle.trim() || !reminderDate) return;
    addReminder({
      title: reminderTitle.trim(),
      content: reminderNotes.trim(),
      dateTime: reminderDate,
      target: 'Saya',
      authorName: currentUser?.name || 'Mahasiswa MKM',
      authorRole: 'Mahasiswa',
    });
    setReminderTitle('');
    setReminderDate('');
    setReminderNotes('');
    setIsAddReminderOpen(false);
  };

  // Greeting berdasarkan waktu
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat pagi';
    if (hour < 15) return 'Selamat siang';
    if (hour < 18) return 'Selamat sore';
    return 'Selamat malam';
  };

  const todayFormatted = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#F4F7FC] text-[#16202E] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Header – Tema Asli: Background Putih Bersih dengan Garis Border & Indikator Mode Mahasiswa */}
      <header className="bg-white border-b border-[#DCE5F0] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/UMPontianak_Logo_Warna_2e912afe.png"
              alt="Logo Universitas Muhammadiyah Pontianak"
              className="h-10 w-auto object-contain bg-white p-0.5 rounded shadow-xs"
            />
            <div className="leading-tight">
              <span className="font-extrabold text-sm sm:text-base text-[#032B5B] block">
                Portal Mahasiswa MKM
              </span>
              <span className="text-[11px] text-[#5B6B82] font-semibold">
                FIKPsi · Universitas Muhammadiyah Pontianak
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Indikator Mode Mahasiswa & Tanggal */}
            <div className="hidden md:flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EBF3FC] text-[#054DA0] border border-[#054DA0]/20">
                <span>🎓</span>
                <span>Mode Mahasiswa</span>
              </span>
              <span className="text-xs text-[#5B6B82] font-medium">
                {todayFormatted}
              </span>
            </div>

            {/* Navigasi Keluar / Ke Halaman Utama */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActivePortalView('landing')}
                className="px-3 py-1.5 text-xs font-bold text-[#054DA0] bg-[#EBF3FC] hover:bg-[#d8e8f9] rounded-lg transition-all flex items-center gap-1.5 border border-[#054DA0]/15"
                title="Kembali ke gerbang utama"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Halaman Utama</span>
              </button>

              <button
                type="button"
                onClick={logout}
                className="px-3 py-1.5 text-xs font-bold text-[#D92D20] bg-[#FEE4E2] hover:bg-[#fcd5d3] rounded-lg transition-all flex items-center gap-1.5"
                title="Keluar dari portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full space-y-6">
        
        {/* Hero Banner Mahasiswa – Tema Asli .hero2 Gradient Biru Institusi + Aksen Gold */}
        <div className="relative overflow-hidden rounded-[18px] bg-gradient-to-r from-[#032B5B] via-[#054DA0] to-[#0c67d1] text-white p-6 sm:p-8 shadow-md">
          {/* Radial amber glow decoration from original stylesheet */}
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[radial-gradient(circle,rgba(245,186,19,0.28)_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-[#FFDE72] text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                <span>🎓</span>
                <span>{getGreeting()}, {currentUser?.name || 'Mahasiswa MKM'}!</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Selamat Datang di Portal Mahasiswa
              </h2>
              <p className="text-xs sm:text-sm text-[#D3E5FA] leading-relaxed">
                Pusat layanan akademik mandiri: pantau bimbingan tesis, unduh materi matrikulasi, 
                pantau pengumuman resmi program studi, dan cek agenda perkuliahan aktif.
              </p>

              {/* Action Buttons inside Hero Banner */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('directory')}
                  className="px-4 py-2 rounded-lg font-bold text-xs sm:text-sm bg-[#F5BA13] hover:bg-[#E5AC0B] text-[#16202E] transition-all flex items-center gap-2 shadow-xs active:scale-[0.98]"
                >
                  <span>🧭 Jelajahi Semua Menu</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddReminderOpen(true)}
                  className="px-4 py-2 rounded-lg font-bold text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 transition-all flex items-center gap-2 active:scale-[0.98]"
                >
                  <span>⏰ Buat Pengingat</span>
                </button>
              </div>
            </div>

            {/* Quick Student Badge / Academic Progress */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-white min-w-[240px] space-y-2.5">
              <div className="flex items-center gap-2.5 pb-2 border-b border-white/15">
                <div className="w-10 h-10 rounded-xl bg-[#F5BA13] text-[#16202E] font-extrabold flex items-center justify-center text-lg shadow-sm">
                  🎓
                </div>
                <div>
                  <span className="font-extrabold text-sm block leading-tight">
                    {currentUser?.name || 'Ahmad Fauzi, S.KM.'}
                  </span>
                  <span className="text-[11px] text-[#FFDE72] font-mono">
                    {currentUser?.identifier || 'NIM: 241021004'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-0.5">
                <div>
                  <span className="text-[#D3E5FA] text-[10px] block">Semester:</span>
                  <span className="font-bold text-white text-xs">II (Genap)</span>
                </div>
                <div>
                  <span className="text-[#D3E5FA] text-[10px] block">SKS Lulus:</span>
                  <span className="font-bold text-[#FFDE72] text-xs font-mono">11 / 38 SKS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation – Tema Asli: Pill Tabs dengan Ikon Emoji & Counter Badge */}
        <div className="flex items-center gap-2 border-b border-[#DCE5F0] pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#054DA0] text-white shadow-sm'
                : 'bg-white text-[#5B6B82] hover:text-[#054DA0] hover:bg-[#EBF3FC] border border-[#DCE5F0]'
            }`}
          >
            <span>🏠</span>
            <span>Beranda</span>
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'directory'
                ? 'bg-[#054DA0] text-white shadow-sm'
                : 'bg-white text-[#5B6B82] hover:text-[#054DA0] hover:bg-[#EBF3FC] border border-[#DCE5F0]'
            }`}
          >
            <span>🧭</span>
            <span>Direktori Menu Layanan ({availableMenus.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'announcements'
                ? 'bg-[#054DA0] text-white shadow-sm'
                : 'bg-white text-[#5B6B82] hover:text-[#054DA0] hover:bg-[#EBF3FC] border border-[#DCE5F0]'
            }`}
          >
            <span>📢</span>
            <span>Pengumuman</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'announcements' ? 'bg-white text-[#054DA0]' : 'bg-[#FFF3D6] text-[#B27B00]'
            }`}>
              {studentAnnouncements.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('agenda')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'agenda'
                ? 'bg-[#054DA0] text-white shadow-sm'
                : 'bg-white text-[#5B6B82] hover:text-[#054DA0] hover:bg-[#EBF3FC] border border-[#DCE5F0]'
            }`}
          >
            <span>⏰</span>
            <span>Pengingat & Agenda</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'agenda' ? 'bg-white text-[#054DA0]' : 'bg-[#E8F7EE] text-[#0E9549]'
            }`}>
              {studentReminders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('drive')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'drive'
                ? 'bg-[#054DA0] text-white shadow-sm'
                : 'bg-white text-[#5B6B82] hover:text-[#054DA0] hover:bg-[#EBF3FC] border border-[#DCE5F0]'
            }`}
          >
            <FolderSync className="w-4 h-4 text-[#F5BA13]" />
            <span>Google Drive</span>
          </button>

          <button
            onClick={() => setActiveTab('sheets')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'sheets'
                ? 'bg-[#0E9549] text-white shadow-sm'
                : 'bg-white text-[#0E9549] hover:bg-[#E8F7EE] border border-[#DCE5F0]'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-[#0E9549]" />
            <span>Google Sheets</span>
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
            
            {/* 4 Stats Cards (.st2) – Tema Asli: Border #DCE5F0, Icon Box Berwarna, Nilai Bold #032B5B */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Stat 1: Menu Tersedia */}
              <div
                onClick={() => setActiveTab('directory')}
                className="bg-white p-4 rounded-xl border border-[#DCE5F0] shadow-xs cursor-pointer hover:border-[#054DA0] hover:shadow-md transition-all flex items-center gap-3.5 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#EBF3FC] text-[#054DA0] flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                  🧭
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-[#032B5B] block leading-tight">
                    {availableMenus.length}
                  </span>
                  <span className="text-xs text-[#5B6B82] font-semibold">Menu Tersedia</span>
                </div>
              </div>

              {/* Stat 2: Pengumuman Baru */}
              <div
                onClick={() => setActiveTab('announcements')}
                className="bg-white p-4 rounded-xl border border-[#DCE5F0] shadow-xs cursor-pointer hover:border-[#F5BA13] hover:shadow-md transition-all flex items-center gap-3.5 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FFF3D6] text-[#B27B00] flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                  📢
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-[#032B5B] block leading-tight">
                    {studentAnnouncements.length}
                  </span>
                  <span className="text-xs text-[#5B6B82] font-semibold">Pengumuman Baru</span>
                </div>
              </div>

              {/* Stat 3: Agenda Mendatang */}
              <div
                onClick={() => setActiveTab('agenda')}
                className="bg-white p-4 rounded-xl border border-[#DCE5F0] shadow-xs cursor-pointer hover:border-[#0E9549] hover:shadow-md transition-all flex items-center gap-3.5 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E8F7EE] text-[#0E9549] flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                  ⏰
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-[#032B5B] block leading-tight">
                    {studentReminders.length}
                  </span>
                  <span className="text-xs text-[#5B6B82] font-semibold">Agenda Mendatang</span>
                </div>
              </div>

              {/* Stat 4: Menu Tersemat (Favorit) */}
              <div
                onClick={() => setActiveTab('directory')}
                className="bg-white p-4 rounded-xl border border-[#DCE5F0] shadow-xs cursor-pointer hover:border-[#D92D20] hover:shadow-md transition-all flex items-center gap-3.5 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FEE4E2] text-[#D92D20] flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                  ⭐
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-[#032B5B] block leading-tight">
                    {pinnedMenus.length}
                  </span>
                  <span className="text-xs text-[#5B6B82] font-semibold">Menu Tersemat</span>
                </div>
              </div>

            </div>

            {/* 2-Columns Layout: Menu Tersemat/Layanan Cepat di Kiri & Agenda/Pengumuman di Kanan */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Kolom Kiri (8 cols): Grid Kartu Menu (.mc) Asli */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#032B5B] flex items-center gap-2">
                      <span>{pinnedMenus.length > 0 ? '⭐ Menu Tersemat (Favorit)' : '⚡ Layanan Cepat Mahasiswa'}</span>
                    </h3>
                    <p className="text-xs text-[#5B6B82]">
                      {pinnedMenus.length > 0 
                        ? 'Akses cepat ke menu layanan yang telah Anda sematkan' 
                        : 'Klik tanda bintang (★) untuk menyematkan modul layanan penting ke beranda'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('directory')}
                    className="text-xs font-bold text-[#054DA0] hover:text-[#032B5B] hover:underline flex items-center gap-1"
                  >
                    <span>Lihat Semua ({availableMenus.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Grid Kartu Menu Layanan (.mc) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickDisplayMenus.map((item) => {
                    const isPinned = favoriteMenuIds.includes(item.id);
                    const iconEmoji = resolveMenuIcon(item);

                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl border-[1.5px] border-[#DCE5F0] hover:border-[#054DA0] p-5 shadow-xs hover:shadow-[0_4px_16px_-2px_rgba(5,77,160,0.08)] transition-all flex flex-col justify-between group"
                      >
                        <div>
                          {/* Header Kartu: Ikon Box 52x52 + Bintang Favorit */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-[52px] h-[52px] rounded-[14px] bg-[#EBF3FC] text-[#054DA0] flex items-center justify-center text-[26px] shadow-inner group-hover:scale-105 transition-transform">
                              <span>{iconEmoji}</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleFavoriteMenu(item.id)}
                              className={`p-1.5 rounded-lg text-lg transition-transform hover:scale-110 ${
                                isPinned
                                  ? 'text-[#F5BA13]'
                                  : 'text-[#C3CDDA] hover:text-[#F5BA13]'
                              }`}
                              title={isPinned ? 'Lepas sematan' : 'Sematkan ke Beranda'}
                              aria-label={isPinned ? 'Lepas sematan' : 'Sematkan menu'}
                            >
                              <span>{isPinned ? '★' : '☆'}</span>
                            </button>
                          </div>

                          {/* Judul & Deskripsi Menu Asli */}
                          <h4 className="text-[15px] sm:text-[16px] font-extrabold text-[#032B5B] mb-1.5 group-hover:text-[#054DA0] transition-colors leading-[1.35]">
                            {item.title}
                          </h4>
                          <p className="text-[13px] text-[#5B6B82] line-clamp-2 leading-relaxed mb-3">
                            {item.description}
                          </p>

                          {/* Sub-menu jika ada */}
                          {item.subMenus && item.subMenus.filter((s) => s.active).length > 0 && (
                            <div className="mb-3 space-y-1.5 bg-[#F8FAFC] p-2.5 rounded-lg border border-[#DCE5F0]/70">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#054DA0] block">
                                Sub-Menu & Formulir:
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
                                    className="w-full text-left px-2 py-1.5 rounded-md bg-white hover:bg-[#EBF3FC] text-slate-800 hover:text-[#054DA0] border border-slate-200/60 flex items-center justify-between text-xs transition-colors cursor-pointer"
                                  >
                                    <span className="flex items-center gap-1.5 truncate">
                                      <span>{sub.icon || '📌'}</span>
                                      <span className="font-semibold truncate">{sub.title}</span>
                                    </span>
                                    <ChevronRight className="w-3 h-3 text-[#5B6B82] shrink-0" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Footer Kartu: Kategori (.tg) & Tautan (Buka Layanan ↗) */}
                        <div className="pt-3 border-t border-[#EEF3F8] flex items-center justify-between mt-auto">
                          <span className="text-[11.5px] font-bold px-2.5 py-0.5 rounded-full bg-[#EBF3FC] text-[#054DA0]">
                            {item.category}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenMenu(item.url)}
                            className="text-[13px] font-extrabold text-[#054DA0] hover:text-[#032B5B] hover:underline inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                          >
                            <span>{item.url?.startsWith('/halaman/') ? 'Buka Halaman ➔' : 'Buka Layanan ↗'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Kolom Kanan (4 cols): Agenda (.ag) & Pengumuman Terbaru (.cmt) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Agenda & Jadwal Card */}
                <div className="bg-white rounded-xl border border-[#DCE5F0] p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EEF3F8] pb-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#032B5B] flex items-center gap-1.5">
                      <span>⏰</span>
                      <span>Agenda & Jadwal</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsAddReminderOpen(true)}
                      className="text-[11px] font-bold text-[#054DA0] hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {studentReminders.length > 0 ? (
                      studentReminders.slice(0, 4).map((rem) => {
                        const d = new Date(rem.dateTime);
                        return (
                          <div key={rem.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-[#F8FAFC] border border-[#DCE5F0]/60">
                            <div className="w-11 h-11 rounded-lg bg-[#EBF3FC] text-[#054DA0] flex flex-col items-center justify-center shrink-0 text-center leading-none border border-[#054DA0]/20">
                              <span className="font-extrabold text-sm">{d.getDate()}</span>
                              <span className="text-[9px] font-bold uppercase mt-0.5">
                                {d.toLocaleDateString('id-ID', { month: 'short' })}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="font-bold text-xs text-[#032B5B] block truncate">
                                {rem.title}
                              </span>
                              <p className="text-[11px] text-[#5B6B82] line-clamp-1 mt-0.5">
                                {rem.content || 'Agenda akademik prodi'}
                              </p>
                              <span className="text-[10px] font-bold text-[#054DA0] block mt-1">
                                ⏳ {getTimeRemaining(rem.dateTime)}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-[#5B6B82] py-2 text-center">
                        Tidak ada agenda dalam waktu dekat.
                      </p>
                    )}
                  </div>
                </div>

                {/* Pengumuman Terbaru Card */}
                <div className="bg-white rounded-xl border border-[#DCE5F0] p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EEF3F8] pb-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#032B5B] flex items-center gap-1.5">
                      <span>📢</span>
                      <span>Pengumuman Terbaru</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setActiveTab('announcements')}
                      className="text-[11px] font-bold text-[#054DA0] hover:underline"
                    >
                      Semua ({studentAnnouncements.length}) →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {studentAnnouncements.length > 0 ? (
                      studentAnnouncements.slice(0, 3).map((ann) => (
                        <div key={ann.id} className="p-3 rounded-lg bg-[#F8FAFC] border border-[#DCE5F0]/60 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-[#032B5B] line-clamp-1">
                              {ann.title}
                            </span>
                            {ann.isImportant && (
                              <span className="text-[10px] font-bold bg-[#FEE4E2] text-[#D92D20] px-1.5 py-0.2 rounded-full shrink-0">
                                Penting
                              </span>
                            )}
                          </div>
                          <p className="text-[11.5px] text-[#5B6B82] line-clamp-2 leading-relaxed">
                            {ann.content}
                          </p>
                          <span className="text-[10px] text-[#5B6B82]/80 block pt-1">
                            Oleh {ann.authorName} · {new Date(ann.createdAt).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-[#5B6B82] py-2 text-center">
                        Belum ada pengumuman terbaru.
                      </p>
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: DIREKTORI MENU LAYANAN LENGKAP */}
        {activeTab === 'directory' && (
          <div className="bg-white rounded-xl border border-[#DCE5F0] p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-[#032B5B]">
                Direktori Layanan & Modul Mahasiswa
              </h3>
              <p className="text-xs text-[#5B6B82]">
                Akses lengkap modul bimbingan tesis, pengajuan outline, video matrikulasi, evaluasi EDOM, dan surat administrasi akademik.
              </p>
            </div>

            {/* Toolbar Asli: Search Box Rounded-Full + Category Chips */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative max-w-sm w-full">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#5B6B82]">
                  🔍
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari layanan atau menu…"
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-full border border-[#DCE5F0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#054DA0] transition-colors"
                />
              </div>

              {/* Category Filter Chips (.chips) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#054DA0] text-white border border-[#054DA0] shadow-xs'
                        : 'bg-white text-[#5B6B82] hover:text-[#054DA0] hover:bg-[#EBF3FC] border border-[#DCE5F0]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Menus (.grid) */}
            {filteredMenus.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMenus.map((item) => {
                  const isPinned = favoriteMenuIds.includes(item.id);
                  const iconEmoji = resolveMenuIcon(item);

                  return (
                    <div
                      key={item.id}
                      className="rounded-xl border-[1.5px] border-[#DCE5F0] hover:border-[#054DA0] p-5 hover:shadow-[0_4px_16px_-2px_rgba(5,77,160,0.08)] transition-all flex flex-col justify-between group bg-white"
                    >
                      <div>
                        {/* Header Box 52x52 with Icon */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-[52px] h-[52px] rounded-[14px] bg-[#EBF3FC] text-[#054DA0] flex items-center justify-center text-[26px] shadow-inner group-hover:scale-105 transition-transform">
                            <span>{iconEmoji}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleFavoriteMenu(item.id)}
                            className={`p-1.5 rounded-lg text-lg transition-transform hover:scale-110 ${
                              isPinned
                                ? 'text-[#F5BA13]'
                                : 'text-[#C3CDDA] hover:text-[#F5BA13]'
                            }`}
                            title={isPinned ? 'Lepas sematan' : 'Sematkan ke Beranda'}
                            aria-label={isPinned ? 'Lepas sematan' : 'Sematkan menu'}
                          >
                            <span>{isPinned ? '★' : '☆'}</span>
                          </button>
                        </div>

                        <h4 className="text-[15px] sm:text-[16px] font-extrabold text-[#032B5B] mb-1.5 group-hover:text-[#054DA0] transition-colors leading-[1.35]">
                          {item.title}
                        </h4>
                        <p className="text-[13px] text-[#5B6B82] line-clamp-2 leading-relaxed mb-3">
                          {item.description}
                        </p>

                        {/* Sub-menu jika ada */}
                        {item.subMenus && item.subMenus.filter((s) => s.active).length > 0 && (
                          <div className="mb-3 space-y-1.5 bg-[#F8FAFC] p-2.5 rounded-lg border border-[#DCE5F0]/70">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#054DA0] block">
                              Sub-Menu & Formulir:
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
                                  className="w-full text-left px-2 py-1.5 rounded-md bg-white hover:bg-[#EBF3FC] text-slate-800 hover:text-[#054DA0] border border-slate-200/60 flex items-center justify-between text-xs transition-colors cursor-pointer"
                                >
                                  <span className="flex items-center gap-1.5 truncate">
                                    <span>{sub.icon || '📌'}</span>
                                    <span className="font-semibold truncate">{sub.title}</span>
                                  </span>
                                  <ChevronRight className="w-3 h-3 text-[#5B6B82] shrink-0" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-[#EEF3F8] flex items-center justify-between mt-auto">
                        <span className="text-[11.5px] font-bold px-2.5 py-0.5 rounded-full bg-[#EBF3FC] text-[#054DA0]">
                          {item.category}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOpenMenu(item.url)}
                          className="text-[13px] font-extrabold text-[#054DA0] hover:text-[#032B5B] hover:underline inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                        >
                          <span>{item.url?.startsWith('/halaman/') ? 'Buka Halaman ➔' : 'Buka Layanan ↗'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-[#5B6B82] space-y-2 border border-dashed border-[#DCE5F0] rounded-xl">
                <div className="text-3xl">🔍</div>
                <p className="font-bold text-sm text-[#032B5B]">Tidak ada menu yang sesuai</p>
                <p className="text-xs">Coba gunakan kata kunci lain atau pilih filter kategori "Semua".</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PENGUMUMAN PRODI */}
        {activeTab === 'announcements' && (
          <div className="bg-white rounded-xl border border-[#DCE5F0] p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-[#032B5B] flex items-center gap-2">
                <span>📢</span>
                <span>Pengumuman Resmi Pascasarjana MKM</span>
              </h3>
              <p className="text-xs text-[#5B6B82]">
                Informasi jadwal, batas pendaftaran ujian tesis, dan edaran akademik resmi dari pengelola program studi.
              </p>
            </div>

            <div className="space-y-4">
              {studentAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className={`p-5 rounded-xl border transition-all ${
                    ann.isImportant
                      ? 'border-[#F5BA13] bg-[#FEF8E7]/50 border-l-4 shadow-xs'
                      : 'border-[#DCE5F0] bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h4 className="text-base font-extrabold text-[#032B5B]">
                      {ann.title}
                    </h4>
                    {ann.isImportant && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEE4E2] text-[#D92D20] border border-[#D92D20]/20 shrink-0">
                        Penting
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#5B6B82] mb-3 font-semibold">
                    Diterbitkan oleh <strong>{ann.authorName}</strong> ({ann.authorRole}) · {new Date(ann.createdAt).toLocaleDateString('id-ID', { dateStyle: 'full' })}
                  </div>
                  <p className="text-xs sm:text-sm text-[#16202E] leading-relaxed whitespace-pre-wrap">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PENGINGAT & AGENDA */}
        {activeTab === 'agenda' && (
          <div className="bg-white rounded-xl border border-[#DCE5F0] p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-[#032B5B] flex items-center gap-2">
                  <span>⏰</span>
                  <span>Agenda & Pengingat Akademik</span>
                </h3>
                <p className="text-xs text-[#5B6B82]">
                  Pantau batas penyerahan tesis, jadwal kuliah, dan tambahkan pengingat pribadi.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddReminderOpen(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#054DA0] hover:bg-[#032B5B] rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Pengingat Pribadi</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentReminders.map((rem) => {
                const d = new Date(rem.dateTime);
                return (
                  <div key={rem.id} className="p-4 rounded-xl border border-[#DCE5F0] bg-[#F8FAFC] flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-[#054DA0] text-white flex flex-col items-center justify-center shrink-0 shadow-xs leading-none">
                      <span className="font-extrabold text-base">{d.getDate()}</span>
                      <span className="text-[10px] font-bold uppercase mt-0.5">
                        {d.toLocaleDateString('id-ID', { month: 'short' })}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-extrabold text-sm text-[#032B5B] truncate">{rem.title}</h4>
                        <span className="text-[11px] font-bold text-[#0E9549] bg-[#E8F7EE] px-2 py-0.5 rounded-full shrink-0">
                          {getTimeRemaining(rem.dateTime)}
                        </span>
                      </div>
                      <p className="text-xs text-[#5B6B82] whitespace-pre-wrap">{rem.content}</p>
                      <span className="text-[10px] text-[#5B6B82]/80 block pt-1">
                        Dibuat oleh: {rem.authorName} ({rem.authorRole}) · Jam {d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: GOOGLE DRIVE */}
        {activeTab === 'drive' && (
          <div className="bg-white rounded-xl border border-[#DCE5F0] p-6 shadow-xs">
            <GoogleDriveExplorer />
          </div>
        )}

        {/* TAB 6: GOOGLE SHEETS */}
        {activeTab === 'sheets' && (
          <div className="bg-white rounded-xl border border-[#DCE5F0] p-6 shadow-xs">
            <GoogleSheetsManager />
          </div>
        )}

      </div>

      {/* Modal Tambah Pengingat Pribadi */}
      {isAddReminderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#DCE5F0] overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF3F8]">
              <h4 className="font-extrabold text-base text-[#032B5B] flex items-center gap-2">
                <span>⏰</span>
                <span>Tambah Pengingat Pribadi</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsAddReminderOpen(false)}
                className="p-1 text-[#5B6B82] hover:text-[#032B5B] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePersonalReminder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#16202E] mb-1">
                  Judul Pengingat / Agenda *
                </label>
                <input
                  type="text"
                  required
                  value={reminderTitle}
                  onChange={(e) => setReminderTitle(e.target.value)}
                  placeholder="Contoh: Batas Pengumpulan Outline Tesis"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCE5F0] bg-white focus:outline-none focus:border-[#054DA0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#16202E] mb-1">
                  Tanggal & Jam *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCE5F0] bg-white focus:outline-none focus:border-[#054DA0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#16202E] mb-1">
                  Catatan / Keterangan
                </label>
                <textarea
                  rows={3}
                  value={reminderNotes}
                  onChange={(e) => setReminderNotes(e.target.value)}
                  placeholder="Detail berkas yang perlu disiapkan, ruang kelas, link, dll…"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCE5F0] bg-white focus:outline-none focus:border-[#054DA0]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EEF3F8]">
                <button
                  type="button"
                  onClick={() => setIsAddReminderOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#5B6B82] hover:bg-[#F4F7FC] rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#054DA0] hover:bg-[#032B5B] rounded-lg shadow-xs transition-colors"
                >
                  Simpan Pengingat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

