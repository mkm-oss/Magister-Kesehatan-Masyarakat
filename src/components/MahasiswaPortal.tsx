import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Video,
  GraduationCap,
  FileSpreadsheet,
  Library,
  BookMarked,
  CreditCard,
  ExternalLink,
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  AlertCircle,
  CheckCircle2,
  FileCheck,
  FolderSync,
} from 'lucide-react';
import { GoogleDriveExplorer } from './GoogleDriveExplorer';

export const MahasiswaPortal: React.FC = () => {
  const { currentUser, logout, setActivePortalView, academicLinks } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'drive'>('overview');

  // Filter links for Mahasiswa
  const mahasiswaLinks = academicLinks.filter(
    (l) => l.targetAudience === 'all' || l.targetAudience === 'mahasiswa'
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
      case 'CreditCard':
        return <CreditCard className="w-6 h-6 text-rose-600" />;
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
              <span className="font-bold text-sm block">Portal Mahasiswa Pascasarjana</span>
              <span className="text-[11px] text-amber-300 font-medium">
                MKM FIKPsi UM Pontianak
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
        
        {/* Welcome Student Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
              Portal Akademik Mahasiswa
            </span>
            <h2 className="text-2xl font-extrabold text-white">
              {currentUser?.name || 'Ahmad Fauzi, S.KM.'}
            </h2>
            <p className="text-xs text-blue-200 font-mono">
              {currentUser?.identifier || 'NIM: 241021004'} · Peminatan Administrasi & Kebijakan Kesehatan (AKK)
            </p>
          </div>

          {/* Key Academic Metrics */}
          <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 text-center text-xs">
            <div className="px-2">
              <span className="text-slate-300 block text-[10px]">Semester:</span>
              <span className="font-bold text-white text-sm">II (Genap)</span>
            </div>
            <div className="px-2 border-x border-white/10">
              <span className="text-slate-300 block text-[10px]">SKS Lulus:</span>
              <span className="font-bold text-amber-300 text-sm font-mono">11 / 38 SKS</span>
            </div>
            <div className="px-2">
              <span className="text-slate-300 block text-[10px]">IPK Sementara:</span>
              <span className="font-bold text-emerald-300 text-sm font-mono">3.84</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation for Mahasiswa Portal */}
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
            <span>Menu Perkuliahan & Tesis</span>
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
            <span>Google Drive Mahasiswa (Upload Tesis & Berkas)</span>
          </button>
        </div>

        {activeTab === 'drive' ? (
          /* Google Drive Integrated Tab */
          <GoogleDriveExplorer title="Google Drive Mahasiswa: Unggah Proposal, Draf Tesis & Tugas Kuliah" />
        ) : (
          /* Primary Links Hub (Kelas Online & Tesis) */
          <>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Menu Layanan Aplikasi Perkuliahan & Tesis
                </h3>
                <p className="text-xs text-slate-500">
                  Akses cepat ke platform perkuliahan daring, administrasi bimbingan tesis, nilai, dan referensi jurnal.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mahasiswaLinks.map((link) => (
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

                {/* Direct Google Drive Card for Mahasiswa */}
                <div
                  onClick={() => setActiveTab('drive')}
                  className="cursor-pointer group bg-gradient-to-br from-blue-50 to-white p-5 rounded-2xl border border-blue-200 shadow-sm hover:shadow-md hover:border-blue-500 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="p-2.5 rounded-xl bg-blue-100 text-blue-900">
                        <FolderSync className="w-6 h-6" />
                      </span>
                      <span className="text-[11px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                        Google Workspace
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors flex items-center justify-between">
                        <span>Google Drive Mahasiswa</span>
                        <ExternalLink className="w-4 h-4 text-blue-600" />
                      </h4>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                        Unggah draf proposal tesis, kuesioner riset, dan tugas kuliah langsung ke Google Drive Anda.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-blue-100 flex items-center justify-between text-[11px] text-blue-900 font-bold">
                    <span>Akses Berkas Cloud</span>
                    <span>Buka Drive &rarr;</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2-Column Section: Monitoring Tesis & Jadwal Kuliah Weekend */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Status Tesis Saya (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-900" />
                    <h3 className="text-base font-bold text-slate-900">
                      Status Bimbingan Tesis (SIMPATI)
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                    Judul Disetujui
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="text-xs text-slate-500 font-semibold">Judul Usulan Tesis:</div>
                  <p className="text-sm font-bold text-slate-900 leading-snug">
                    "Analisis Efisiensi Biaya Klaim BPJS dan Kepuasan Pasien Rawat Inap di RSUD Wilayah Pesisir Kalimantan Barat"
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200/70 text-xs text-slate-600">
                    <div>
                      <strong>Pembimbing I:</strong> Dr. Rochmawati, S.KM., M.Kes.
                    </div>
                    <div>
                      <strong>Pembimbing II:</strong> Prof. Dr. apt. Hj. Nurmainah, M.Si.
                    </div>
                  </div>

                  {/* Progress Bar Tesis */}
                  <div className="pt-2 space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Progres: Penyusunan Bab 1-3 (Proposal)</span>
                      <span className="font-bold text-blue-900 font-mono">50%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-900 h-full rounded-full w-1/2"></div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Target Seminar Proposal: Juni 2026</span>
                  <button
                    onClick={() => setActiveTab('drive')}
                    className="font-bold text-blue-900 hover:underline flex items-center gap-1"
                  >
                    <span>Unggah Draf Proposal ke Google Drive &rarr;</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Jadwal Kuliah & Unduhan Template (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Jadwal Kuliah Weekend Mahasiswa */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <Clock className="w-5 h-5 text-blue-900" />
                    <h3 className="text-base font-bold text-slate-900">Jadwal Kuliah Weekend Ini</h3>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200/70 space-y-1">
                      <div className="flex justify-between font-bold text-blue-900">
                        <span>Sabtu, 08.00 - 11.30 WIB</span>
                        <span>LMS / Daring</span>
                      </div>
                      <div className="font-semibold text-slate-800">
                        Metodologi Penelitian Kesehatan Lanjut
                      </div>
                      <div className="text-slate-500">Dosen: Dr. Marlenywati, M.Kes.</div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>Minggu, 09.00 - 12.30 WIB</span>
                        <span>Kampus UMP Lt. 3</span>
                      </div>
                      <div className="font-semibold text-slate-800">
                        Kesehatan Lingkungan Wilayah Lahan Basah Tropis
                      </div>
                      <div className="text-slate-500">Dosen: Dr. Ismael Saleh, M.Sc.</div>
                    </div>
                  </div>
                </div>

                {/* Template Dokumen Mahasiswa */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
                  <h3 className="text-base font-bold text-slate-900">Download Template Akademik</h3>
                  <div className="space-y-2 text-xs">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Template Usulan Penelitian Tesis diunduh.');
                      }}
                      className="p-2.5 rounded-lg border border-slate-200 flex items-center justify-between hover:bg-slate-50 text-slate-700"
                    >
                      <span className="font-medium">Template Proposal Tesis MKM.docx</span>
                      <Download className="w-4 h-4 text-slate-500" />
                    </a>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Template Naskah Artikel Publikasi Jurnal diunduh.');
                      }}
                      className="p-2.5 rounded-lg border border-slate-200 flex items-center justify-between hover:bg-slate-50 text-slate-700"
                    >
                      <span className="font-medium">Format Artikel Jurnal SINTA.docx</span>
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
