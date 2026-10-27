import React, { useState } from 'react';
import {
  GraduationCap,
  Video,
  BookOpen,
  FileCheck,
  FileText,
  Library,
  BookMarked,
  FileSpreadsheet,
  Calendar,
  Clock,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  CreditCard,
  Download,
  Search,
  ArrowRight,
  FolderSync,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AcademicServicesSectionProps {
  onOpenPortalLogin: (role: 'admin' | 'dosen' | 'mahasiswa') => void;
  onOpenGoogleDrive?: () => void;
  onOpenGoogleSheets?: () => void;
}

interface ServiceItem {
  title: string;
  badge: string;
  desc: string;
  url: string;
  icon: React.ElementType;
  color: string;
  isDownload?: boolean;
}

export const AcademicServicesSection: React.FC<AcademicServicesSectionProps> = ({
  onOpenPortalLogin,
  onOpenGoogleDrive,
  onOpenGoogleSheets,
}) => {
  const { academicLinks, currentUser, setActivePortalView } = useApp();
  const [activeSegment, setActiveSegment] = useState<'mahasiswa' | 'dosen'>('mahasiswa');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'tesis' | 'kelas_online' | 'akademik' | 'referensi'>('all');

  // Specific thesis services
  const thesisServicesMahasiswa: ServiceItem[] = [
    {
      title: 'Bimbingan Tesis (SIMPATI)',
      badge: 'Layanan Utama Tesis',
      desc: 'Catat bimbingan, jadwal konsultasi pembimbing 1 & 2, logbook riset, dan tahapan naskah tesis.',
      url: 'https://tesis.unmuhpnk.ac.id/mkm',
      icon: GraduationCap,
      color: 'amber',
    },
    {
      title: 'Pengajuan Outline Tesis',
      badge: 'Tahap Awal Riset',
      desc: 'Ajukan usulan topik penelitian tesis dan pantau proses verifikasi outline dari tim pengelola prodi.',
      url: 'https://tesis.unmuhpnk.ac.id/outline',
      icon: FileText,
      color: 'amber',
    },
    {
      title: 'Pendaftaran Kolokium Proposal & Sidang Tesis',
      badge: 'Ujian Akhir',
      desc: 'Pengunggahan berkas prasyarat sidang, cek jadwal ujian kelayakan, dan penetapan dewan penguji tesis.',
      url: 'https://tesis.unmuhpnk.ac.id/sidang',
      icon: FileCheck,
      color: 'blue',
    },
    {
      title: 'Cek Kemiripan Naskah Tesis (Turnitin)',
      badge: 'Anti-Plagiasi',
      desc: 'Fasilitas uji similaritas naskah proposal dan tesis akhir dengan standar maksimal 20% sebelum didaftarkan sidang.',
      url: 'https://turnitin.unmuhpnk.ac.id',
      icon: Search,
      color: 'purple',
    },
    {
      title: 'Surat Pengambilan Data Penelitian',
      badge: 'Administrasi Riset',
      desc: 'Pengelolaan surat izin survei lapangan, permohonan pengambilan data dan rekomendasi ethical clearance.',
      url: 'https://fikpsi.unmuhpnk.ac.id/layanan-surat',
      icon: Download,
      color: 'emerald',
    },
  ];

  const learningServicesMahasiswa: ServiceItem[] = [
    {
      title: 'Materi dan Video Matrikulasi',
      badge: 'Materi Kuliah',
      desc: 'Unduh bahan ajar kuliah, modul penunjang matrikulasi, dan tonton rekaman penjelasan dosen pengampu.',
      url: 'https://elearning.unmuhpnk.ac.id/course/index.php?categoryid=mkm',
      icon: Video,
      color: 'blue',
    },
    {
      title: 'Kelas Online (LMS Moodle Pascasarjana)',
      badge: 'E-Learning Terpadu',
      desc: 'Akses ruang kuliah virtual, silabus mingguan, kuis daring, forum diskusi kasus, dan unggah tugas terstruktur.',
      url: 'https://elearning.unmuhpnk.ac.id/course/index.php?categoryid=mkm',
      icon: Video,
      color: 'blue',
    },
    {
      title: 'EDOM Dosen Magister',
      badge: 'Mutu Akademik',
      desc: 'Hasil dan formulir evaluasi kinerja dosen oleh mahasiswa (EDOM) untuk penjaminan mutu program studi berkala.',
      url: 'https://mutu.unmuhpnk.ac.id/edom-mkm',
      icon: FileCheck,
      color: 'indigo',
    },
    {
      title: 'Portal Akademik FIKPsi (SIAKAD)',
      badge: 'Sistem Fakultas',
      desc: 'Pengisian rencana studi (KRS) tiap semester, jadwal kuliah, presensi kehadiran, dan transkrip nilai KHS.',
      url: 'https://siakad.unmuhpnk.ac.id',
      icon: FileSpreadsheet,
      color: 'emerald',
    },
    {
      title: 'Perpustakaan Digital & Repository Tesis',
      badge: 'E-Library & Jurnal',
      desc: 'Akses repositori tesis alumni MKM, e-book kesehatan masyarakat, serta akses jurnal internasional terindeks.',
      url: 'https://digilib.unmuhpnk.ac.id',
      icon: Library,
      color: 'indigo',
    },
  ];

  const thesisServicesDosen: ServiceItem[] = [
    {
      title: 'Dashboard Pembimbing & Penguji Tesis (SIMPATI)',
      badge: 'Bimbingan Online',
      desc: 'Review naskah draft tesis mahasiswa bimbingan, verifikasi logbook, dan pemberian catatan revisi real-time.',
      url: 'https://tesis.unmuhpnk.ac.id/dosen',
      icon: GraduationCap,
      color: 'amber',
    },
    {
      title: 'Lembar Penilaian Sidang & Berita Acara Online',
      badge: 'Ujian Kelayakan',
      desc: 'Input nilai ujian proposal, seminar hasil, dan sidang tutup tesis secara terkomputerisasi dengan kalkulasi otomatis.',
      url: 'https://tesis.unmuhpnk.ac.id/evaluasi-sidang',
      icon: FileCheck,
      color: 'blue',
    },
    {
      title: 'Monitoring Progress Mahasiswa Bimbingan',
      badge: 'Evaluasi Studi',
      desc: 'Pantau status pengerjaan tesis mahasiswa dari bab 1 hingga naskah publikasi untuk menjamin kelulusan tepat waktu.',
      url: 'https://tesis.unmuhpnk.ac.id/monitoring',
      icon: Clock,
      color: 'purple',
    },
  ];

  const learningServicesDosen: ServiceItem[] = [
    {
      title: 'LMS Pengampu Mata Kuliah (Kelola Kelas)',
      badge: 'Moodle Pascasarjana',
      desc: 'Upload materi ajar, modul praktikum, penugasan studi kasus kesehatan lahan basah, dan evaluasi hasil belajar.',
      url: 'https://elearning.unmuhpnk.ac.id/dosen',
      icon: Video,
      color: 'blue',
    },
    {
      title: 'SIAKAD Dosen (Input Nilai & Presensi Dosen)',
      badge: 'Nilai & Jadwal',
      desc: 'Input nilai akhir semester (UAS/UTS/Tugas), verifikasi KRS mahasiswa wali, dan absensi dosen pengajar.',
      url: 'https://siakad.unmuhpnk.ac.id/dosen',
      icon: FileSpreadsheet,
      color: 'emerald',
    },
    {
      title: 'OJS Jurnal Kesehatan Masyarakat UM Pontianak',
      badge: 'Publikasi & Reviewer',
      desc: 'Portal reviewer manuskrip ilmiah mahasiswa, pembimbingan artikel hasil riset tesis, dan penerbitan berkala ilmiah terakreditasi SINTA.',
      url: 'https://openjurnal.unmuhpnk.ac.id/index.php/JJUM',
      icon: BookMarked,
      color: 'purple',
    },
    {
      title: 'Sistem Informasi Riset & Pengabdian (BIMA / LPPM)',
      badge: 'Tridharma PT',
      desc: 'Pengajuan hibah penelitian dosen, luaran pengabdian masyarakat wilayah pesisir, dan pelaporan capaian Scopus/SINTA.',
      url: 'https://lppm.unmuhpnk.ac.id',
      icon: BookOpen,
      color: 'teal',
    },
  ];

  const handleOpenDirectPortal = (role: 'dosen' | 'mahasiswa') => {
    if (currentUser?.role === role) {
      setActivePortalView(role);
    } else {
      onOpenPortalLogin(role);
    }
  };

  return (
    <section id="pelayanan-akademik" className="py-20 bg-slate-50 border-t border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5 text-blue-800" />
            Portal Pelayanan Terpadu Pascasarjana
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Menu Pelayanan Perkuliahan & Akses Tesis
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Pusat akses satu pintu untuk seluruh sarana pembelajaran daring, bimbingan tesis intensif, sistem informasi akademik, dan perpustakaan digital bagi Dosen dan Mahasiswa Magister Kesehatan Masyarakat.
          </p>

          {/* Role Segment Switcher (Mahasiswa vs Dosen) */}
          <div className="mt-8 inline-flex p-1.5 bg-slate-200/80 rounded-2xl shadow-inner border border-slate-300">
            <button
              onClick={() => setActiveSegment('mahasiswa')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeSegment === 'mahasiswa'
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>Pelayanan Mahasiswa</span>
              <span className="text-[10px] py-0.5 px-2 bg-blue-800 rounded-full text-blue-100">
                S2 MKM
              </span>
            </button>

            <button
              onClick={() => setActiveSegment('dosen')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeSegment === 'dosen'
                  ? 'bg-emerald-900 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-300" />
              <span>Pelayanan Dosen Pengajar</span>
              <span className="text-[10px] py-0.5 px-2 bg-emerald-800 rounded-full text-emerald-100">
                Pembina & Penguji
              </span>
            </button>
          </div>
        </div>

        {/* Action Bar / Quick Portal Login Callout */}
        <div className="mb-10 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              activeSegment === 'mahasiswa' ? 'bg-blue-100 text-blue-900' : 'bg-emerald-100 text-emerald-900'
            }`}>
              {activeSegment === 'mahasiswa' ? (
                <GraduationCap className="w-6 h-6" />
              ) : (
                <UserCheck className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm sm:text-base">
                  {activeSegment === 'mahasiswa'
                    ? 'Akses Khusus Mahasiswa Aktif S2 MKM'
                    : 'Akses Khusus Dosen Pembina & Penguji'}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded-md">
                  Single Sign-On (SSO)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeSegment === 'mahasiswa'
                  ? 'Login dengan NIM untuk mengakses ruang belajar, status bimbingan tesis, dan transkrip nilai.'
                  : 'Login dengan NIDN untuk mengelola kelas online, input nilai SIAKAD, dan persetujuan sidang tesis.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <button
              onClick={() => handleOpenDirectPortal(activeSegment)}
              className={`w-full md:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-sm flex items-center justify-center gap-2 transition-all ${
                activeSegment === 'mahasiswa'
                  ? 'bg-blue-900 hover:bg-blue-800'
                  : 'bg-emerald-800 hover:bg-emerald-700'
              }`}
            >
              <span>Buka Portal {activeSegment === 'mahasiswa' ? 'Mahasiswa' : 'Dosen'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onOpenGoogleDrive && (
              <button
                onClick={onOpenGoogleDrive}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Buka Google Drive Berkas Akademik"
              >
                <FolderSync className="w-4 h-4 text-amber-600" />
                <span className="hidden sm:inline">Drive</span>
              </button>
            )}

            {onOpenGoogleSheets && (
              <button
                onClick={onOpenGoogleSheets}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Buka Google Sheets Nilai & PMB"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Sheets</span>
              </button>
            )}
          </div>
        </div>

        {/* SECTION CONTENT: DIVIDED INTO TESIS & PEMBELAJARAN */}
        <div className="space-y-12">
          
          {/* GROUP 1: PELAYANAN AKSES TESIS & KARYA ILMIAH */}
          <div>
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {activeSegment === 'mahasiswa'
                      ? 'Layanan Akses Tesis & Riset Mahasiswa'
                      : 'Layanan Bimbingan & Pengujian Tesis Dosen'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Alur bimbingan skripsi/tesis terstandar dari usulan judul, kelayakan etik, hingga sidang komprehensif.
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 hidden sm:inline-block">
                Konsentrasi: Riset Lahan Basah & Kesehatan Kalbar
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {(activeSegment === 'mahasiswa' ? thesisServicesMahasiswa : thesisServicesDosen).map(
                (item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 group-hover:bg-amber-100 group-hover:text-amber-900 transition-colors">
                            {item.badge}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-900 transition-colors leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                        <a
                          href={item.url}
                          target={item.url.startsWith('http') ? '_blank' : '_self'}
                          rel="noreferrer"
                          className="text-xs font-bold text-amber-700 hover:text-amber-900 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                        >
                          <span>{item.isDownload ? 'Unduh Format' : 'Buka Layanan'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {activeSegment === 'mahasiswa' ? 'SIMPATI-MKM' : 'PANEL-PENGUJI'}
                        </span>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* GROUP 2: PELAYANAN PEMBELAJARAN & KELAS ONLINE */}
          <div>
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                  <Video className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {activeSegment === 'mahasiswa'
                      ? 'Layanan Pembelajaran, Kelas Online & SIAKAD'
                      : 'Layanan Pengajaran, Kelas Online & Input Nilai'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Platform perkuliahan blended learning, manajemen materi kuliah, presensi kehadiran, dan sistem informasi akademik.
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 hidden sm:inline-block">
                Hybrid Learning & Akses 24/7
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {(activeSegment === 'mahasiswa' ? learningServicesMahasiswa : learningServicesDosen).map(
                (item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 group-hover:bg-blue-100 group-hover:text-blue-900 transition-colors">
                            {item.badge}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                        <a
                          href={item.url}
                          target={item.url.startsWith('http') ? '_blank' : '_self'}
                          rel="noreferrer"
                          className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                        >
                          <span>Buka Aplikasi</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {activeSegment === 'mahasiswa' ? 'STUDENT-APP' : 'LECTURER-APP'}
                        </span>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Quick Help Box for Thesis & Learning Support */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Bantuan & Layanan Helpdesk Akademik
              </span>
              <h4 className="text-lg font-bold text-white">
                Mengalami Kendala Akun SIMPATI Tesis atau LMS Pembelajaran?
              </h4>
              <p className="text-xs text-blue-200/80 max-w-2xl">
                Tim Administrasi Pascasarjana FIKPsi UM Pontianak siap membantu reset password SIAKAD, aktivasi akun Moodle e-learning, surat pengantar penelitian, dan penjadwalan bimbingan tesis.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="https://wa.me/6281256789012?text=Halo%20Admin%20MKM%20UM%20Pontianak,%20saya%20membutuhkan%20bantuan%20terkait%20layanan%20tesis%20dan%20pembelajaran."
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
              >
                <span>WhatsApp Helpdesk</span>
              </a>

              <button
                onClick={() => onOpenPortalLogin('admin')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors border border-slate-700"
              >
                Admin CMS
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
