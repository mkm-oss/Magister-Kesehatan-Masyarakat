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
} from 'lucide-react';
import { GoogleDriveExplorer } from './GoogleDriveExplorer';
import { GoogleSheetsManager } from './GoogleSheetsManager';

export const DosenPortal: React.FC = () => {
  const { currentUser, logout, setActivePortalView, academicLinks } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'drive' | 'sheets'>('overview');

  // Filter links applicable for Dosen
  const dosenLinks = academicLinks.filter(
    (l) => l.targetAudience === 'all' || l.targetAudience === 'dosen'
  );

  const getLinkIcon = (iconName: string) => {
    switch (iconName) {
      case 'Video':
        return <Video className="w-6 h-6 text-blue-600" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-amber-600" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-6 h-6 text-emerald-600" />;
      case 'Library':
        return <Library className="w-6 h-6 text-indigo-600" />;
      case 'BookMarked':
        return <BookMarked className="w-6 h-6 text-purple-600" />;
      default:
        return <ExternalLink className="w-6 h-6 text-blue-600" />;
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Welcome Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
              Selamat Datang di Portal Dosen
            </span>
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

        {/* Tab Navigation for Dosen Portal */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Aplikasi Perkuliahan & Bimbingan</span>
          </button>

          <button
            onClick={() => setActiveTab('drive')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
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
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'sheets'
                ? 'bg-emerald-900 text-white shadow-sm'
                : 'bg-white text-emerald-800 hover:text-emerald-950'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Google Sheets (Rekap Nilai & Presensi)</span>
          </button>
        </div>

        {activeTab === 'sheets' ? (
          /* Google Sheets Integrated Tab */
          <GoogleSheetsManager title="Google Sheets Dosen: Rekapitulasi Nilai & Presensi Perkuliahan MKM" />
        ) : activeTab === 'drive' ? (
          /* Google Drive Integrated Tab */
          <GoogleDriveExplorer title="Google Drive Dosen: Berkas Kuliah & Naskah Bimbingan Tesis" />
        ) : (
          /* Primary Links Hub & Supervision */
          <>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Aplikasi Utama Perkuliahan & Bimbingan Tesis
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tautan langsung terintegrasi untuk menunjang aktivitas Tridharma dan pembelajaran daring pascasarjana.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dosenLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-900 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-blue-50 transition-colors">
                          {getLinkIcon(link.iconName)}
                        </span>
                        <span className="text-[11px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                          {link.badge}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors flex items-center justify-between">
                          <span>{link.title}</span>
                          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-900 group-hover:translate-x-0.5 transition-transform" />
                        </h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                          {link.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span className="truncate max-w-[200px]">{link.url}</span>
                      <span className="text-blue-900 font-bold group-hover:underline">Buka Aplikasi &rarr;</span>
                    </div>
                  </a>
                ))}

                {/* Direct Card to Google Drive */}
                <div
                  onClick={() => setActiveTab('drive')}
                  className="cursor-pointer group bg-gradient-to-br from-amber-50 to-white p-5 rounded-2xl border border-amber-200 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
                        <FolderSync className="w-6 h-6" />
                      </span>
                      <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                        Google Workspace
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors flex items-center justify-between">
                        <span>Google Drive Akademik</span>
                        <ExternalLink className="w-4 h-4 text-amber-600" />
                      </h4>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                        Kelola draf tesis mahasiswa bimbingan, materi kuliah, dan berkas RPS langsung di Google Drive Anda.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between text-[11px] text-amber-800 font-bold">
                    <span>Akses Berkas Cloud</span>
                    <span>Buka Drive &rarr;</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2-Column Section: Mahasiswa Bimbingan Tesis & Jadwal Kuliah */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Daftar Bimbingan Tesis Aktif (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-900" />
                    <h3 className="text-base font-bold text-slate-900">
                      Mahasiswa Bimbingan Tesis MKM
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    Semester Genap 2026
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">Ahmad Fauzi, S.KM. (NIM: 241021004)</span>
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold text-[11px]">
                        Revisi Proposal
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 italic">
                      "Analisis Efisiensi Biaya Klaim BPJS dan Kepuasan Pasien Rawat Inap di RSUD Wilayah Pesisir Kalbar"
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Peminatan: AKK (Manajemen RS)</span>
                      <span>Logbook: 6 Kali Bimbingan</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">dr. Siti Rahma (NIM: 241021012)</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                        Siap Sidang Kolokium
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 italic">
                      "Pemetaan Spasial Daerah Rawan Kejadian Luar Biasa DBD Berdasarkan Kualitas Sanitasi Air Gambut"
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Peminatan: Epidemiologi Penyakit Tropis</span>
                      <span>Logbook: 9 Kali Bimbingan</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">Hendra Irawan, S.T. (NIM: 241021018)</span>
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold text-[11px]">
                        Pengambilan Data
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 italic">
                      "Pengaruh Pajanan Partikulat Debu Sawit Terhadap Kapasitas Fungsi Paru Pekerja Pabrik Kelapa Sawit"
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Peminatan: K3 & Kesehatan Lingkungan</span>
                      <span>Logbook: 4 Kali Bimbingan</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Jadwal Mengajar & Dokumen Panduan (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Jadwal Kuliah Weekend */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <Clock className="w-5 h-5 text-blue-900" />
                    <h3 className="text-base font-bold text-slate-900">Jadwal Kuliah Weekend Ini</h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200/60 space-y-1">
                      <div className="flex justify-between font-bold text-blue-900">
                        <span>Sabtu, 08.00 - 11.30 WIB</span>
                        <span>Hybrid (LMS/Zoom)</span>
                      </div>
                      <div className="font-semibold text-slate-800">
                        Kebijakan Kesehatan & Tata Kelola Sistem Kesehatan
                      </div>
                      <div className="text-slate-500">Kelas MKM Semester I (28 Mahasiswa)</div>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/60 space-y-1">
                      <div className="flex justify-between font-bold text-emerald-900">
                        <span>Minggu, 13.00 - 16.30 WIB</span>
                        <span>R. Pascasarjana Lt. 3</span>
                      </div>
                      <div className="font-semibold text-slate-800">
                        Kolokium Usulan Penelitian Tesis
                      </div>
                      <div className="text-slate-500">MKM Semester III (Sidang Proposal)</div>
                    </div>
                  </div>
                </div>

                {/* Dokumen Akademik */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
                  <h3 className="text-base font-bold text-slate-900">Panduan Akademik & Format</h3>
                  <div className="space-y-2 text-xs">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Pedoman Penulisan Tesis Pascasarjana MKM diunduh.');
                      }}
                      className="p-2.5 rounded-lg border border-slate-200 flex items-center justify-between hover:bg-slate-50 text-slate-700"
                    >
                      <span className="font-medium">1. Pedoman Penulisan Tesis MKM 2026.pdf</span>
                      <Download className="w-4 h-4 text-slate-500" />
                    </a>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Rubrik Penilaian Ujian Sidang diunduh.');
                      }}
                      className="p-2.5 rounded-lg border border-slate-200 flex items-center justify-between hover:bg-slate-50 text-slate-700"
                    >
                      <span className="font-medium">2. Form Penilaian Sidang Tesis Magister.xlsx</span>
                      <Download className="w-4 h-4 text-slate-500" />
                    </a>
                  </div>
                </div>

              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
};
