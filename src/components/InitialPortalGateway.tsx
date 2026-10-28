import React from 'react';
import {
  GraduationCap,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Video,
  FileCheck,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  Lock,
  Sparkles,
  Info,
  Award,
  ExternalLink,
  FolderSync,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface InitialPortalGatewayProps {
  onOpenPortalLogin: (role: 'admin' | 'dosen' | 'mahasiswa') => void;
  onOpenRegister: () => void;
  onOpenBrochure: () => void;
}

export const InitialPortalGateway: React.FC<InitialPortalGatewayProps> = ({
  onOpenPortalLogin,
  onOpenRegister,
  onOpenBrochure,
}) => {
  const { setActivePortalView } = useApp();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-400">
      {/* Background ambient accents */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* TAMPILAN AWAL: LOGO INSTITUSI */}
        <div className="mb-6 flex flex-col items-center animate-fade-in">
          <div className="relative p-3 sm:p-4 rounded-3xl bg-white/95 shadow-2xl ring-4 ring-amber-400/80 mb-4 backdrop-blur-md transition-transform hover:scale-105 duration-300">
            <img
              src="/assets/aistudio/UMPontianak_Logo_Warna_2e912afe.png"
              alt="Logo Universitas Muhammadiyah Pontianak"
              className="h-20 sm:h-24 md:h-28 w-auto object-contain"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Sistem Informasi & Pelayanan Akademik Terpadu</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white max-w-3xl leading-snug">
            UNIVERSITAS MUHAMMADIYAH PONTIANAK
          </h1>
          <p className="text-sm sm:text-base font-semibold text-blue-200 mt-1">
            Fakultas Ilmu Kesehatan dan Psikologi · Program Studi Magister Kesehatan Masyarakat (MKM)
          </p>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-2 leading-relaxed">
            Pusat pelayanan akademik terintegrasi untuk mahasiswa dan dosen. Akses modul bimbingan tesis, 
            ruang pembelajaran perkuliahan, dan administrasi pascasarjana.
          </p>
        </div>

        {/* SPOTLIGHT BANNER: SIM-AKREDITASI PRO (9 Kriteria LAM-PTKes) */}
        <div className="w-full max-w-5xl mb-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-900/90 via-slate-900/95 to-emerald-950/90 border-2 border-amber-400/60 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 text-left backdrop-blur-md">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Sistem Unggulan · Akreditasi Program Studi S2 MKM</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              SIM-Akreditasi PRO (Sistem Informasi Akreditasi & Asesmen)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Executive Dashboard, Simulator Nilai Real-time (Target Unggul), Pemetaan 9 Kriteria (LED & LKPS), 
              Repository Bukti Digital Cloud, dan Portal Mode Asesor Audit Eksternal.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <a
              href="https://drive.google.com/drive/folders/1gviyTRdU96dgYbFBlOQkPeFWfeQvP0Ab?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-[0.98] transition-all cursor-pointer"
              title="Buka Folder Google Drive Utama Bukti Akreditasi"
            >
              <FolderSync className="w-4 h-4" />
              <span>Drive Bukti ↗</span>
            </a>
            <button
              type="button"
              onClick={() => setActivePortalView('sim_akreditasi')}
              className="py-3 px-5 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 whitespace-nowrap active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Buka SIM-Akreditasi PRO</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PROMPT INSTRUKSI PILIHAN MASUK */}
        <div className="w-full max-w-5xl my-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px bg-slate-700 flex-1 max-w-xs" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-300 bg-slate-800/80 px-4 py-1.5 rounded-full border border-slate-700">
              PILIHAN MASUK PORTAL
            </span>
            <div className="h-px bg-slate-700 flex-1 max-w-xs" />
          </div>

          {/* 3 PILIHAN MASUK: MAHASISWA, DOSEN, DAN ADMIN */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            {/* KARTU 1: MAHASISWA */}
            <div className="group relative rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 border-blue-500/40 hover:border-blue-400 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all pointer-events-none" />
              
              <div className="p-6 relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-inner">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Siswa / Mahasiswa
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                    Portal Mahasiswa
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Layanan mandiri mahasiswa untuk tesis, perkuliahan daring, dan administrasi akademik.
                  </p>
                </div>

                {/* Sub-menu fitur mahasiswa */}
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <FileCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Bimbingan & Outline Tesis:</strong> Bimbingan berkala, pengajuan outline tesis, cek Turnitin, & jadwal ujian sidang.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Video className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span><strong>Materi & Pembelajaran:</strong> Video matrikulasi, kelas daring LMS Moodle, & materi kuliah dosen.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Administrasi & Mutu:</strong> Surat pengambilan data penelitian, evaluasi EDOM dosen, & SIAKAD FIKPsi.</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Mahasiswa - Wajib Password */}
              <div className="p-6 pt-0 relative z-10 space-y-2">
                <button
                  type="button"
                  onClick={() => onOpenPortalLogin('mahasiswa')}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-blue-200" />
                  <span>Masuk Portal Mahasiswa (Wajib Password)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onOpenPortalLogin('mahasiswa')}
                  className="w-full py-2 text-center text-xs text-blue-300 hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Lock className="w-3 h-3" />
                  <span>Autentikasi NIM & Kata Sandi</span>
                </button>
              </div>
            </div>

            {/* KARTU 2: DOSEN */}
            <div className="group relative rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 border-amber-500/40 hover:border-amber-400 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
              
              <div className="p-6 relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300 shadow-inner">
                    <UserCheck className="w-8 h-8" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Tenaga Pengajar
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    Portal Dosen
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Layanan dosen untuk pembimbingan tesis, perkuliahan, dan evaluasi hasil belajar mahasiswa.
                  </p>
                </div>

                {/* Sub-menu fitur dosen */}
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <GraduationCap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Bimbingan & Review Tesis:</strong> Review draf outline tesis, catatan logbook, & pengujian sidang tesis.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Video className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span><strong>Perkuliahan & Pengajaran:</strong> Unggah materi/video matrikulasi, ruang kelas virtual, & silabus RPS.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Mutu & Penilaian:</strong> Hasil evaluasi EDOM dosen magister, agenda prodi, & input nilai SIAKAD.</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Dosen - Wajib Password */}
              <div className="p-6 pt-0 relative z-10 space-y-2">
                <button
                  type="button"
                  onClick={() => onOpenPortalLogin('dosen')}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30 hover:shadow-amber-400/50 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-slate-950" />
                  <span>Masuk Portal Dosen (Wajib Password)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onOpenPortalLogin('dosen')}
                  className="w-full py-2 text-center text-xs text-amber-300 hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Lock className="w-3 h-3" />
                  <span>Autentikasi NIDN & Kata Sandi</span>
                </button>
              </div>
            </div>

            {/* KARTU 3: ADMIN */}
            <div className="group relative rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 border-emerald-500/40 hover:border-emerald-400 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
              
              <div className="p-6 relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-inner">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Pengelola Sistem
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Portal Admin
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Pusat kendali prodi untuk manajemen menu layanan, pengumuman penting, dan database akademik.
                  </p>
                </div>

                {/* Sub-menu fitur admin */}
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <Layers className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Kelola Menu Layanan:</strong> Tambah, edit, dan atur visibilitas modul tesis, pembelajaran, & surat.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Pengumuman & Agenda:</strong> Publikasikan pengumuman penting, broadcast agenda, & verifikasi PMB.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span><strong>Database & Cloud:</strong> Integrasi Supabase PostgreSQL, Google Drive explorer, & Google Sheets.</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Admin - Wajib Password */}
              <div className="p-6 pt-0 relative z-10 space-y-2">
                <button
                  type="button"
                  onClick={() => onOpenPortalLogin('admin')}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/50 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-emerald-200" />
                  <span>Masuk Portal Admin (Wajib Password)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onOpenPortalLogin('admin')}
                  className="w-full py-2 text-center text-xs text-emerald-300 hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Lock className="w-3 h-3" />
                  <span>Autentikasi Sandi / PIN Administrator</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Gateway Helper Text */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Pilih salah satu portal di atas untuk masuk langsung ke sistem pelayanan tesis & pembelajaran.</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">© Program Studi MKM FIKPsi Universitas Muhammadiyah Pontianak</span>
          </div>
        </div>

      </div>
    </section>
  );
};
