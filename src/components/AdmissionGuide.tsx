import React from 'react';
import { Calendar, FileCheck, CheckCircle2, ArrowRight, UserCheck, CreditCard, Award, HelpCircle } from 'lucide-react';

interface AdmissionGuideProps {
  onOpenRegister: () => void;
}

export const AdmissionGuide: React.FC<AdmissionGuideProps> = ({ onOpenRegister }) => {
  return (
    <section id="pendaftaran" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 mb-2">
            <span>PENERIMAAN MAHASISWA BARU (PMB)</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>TAHUN AKADEMIK 2026/2027</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight text-balance">
            Jalur & Persyaratan Pendaftaran Pascasarjana
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Proses seleksi dirancang transparan, ringkas, dan dapat dilakukan secara penuh dari mana saja secara online melalui sistem terpadu FIKPsi UM Pontianak.
          </p>
        </div>

        {/* Gelombang PMB Timeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Gelombang 1 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border-2 border-blue-900 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white bg-blue-900 px-3 py-1 rounded-full uppercase tracking-wider">
                  Sedang Berlangsung
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Prioritas Beasiswa / Potongan
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">Gelombang I (Reguler & Mitra)</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Direkomendasikan bagi calon mahasiswa dari instansi, rumah sakit, dan dinas kesehatan untuk pengurusan izin belajar lebih awal.
                </p>
              </div>

              <div className="space-y-2 pt-2 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Masa Pendaftaran:</span>
                  <span className="font-semibold text-slate-900">1 Januari - 31 Mei 2026</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Seleksi Wawancara:</span>
                  <span className="font-semibold text-slate-900">Setiap Sabtu Pekan Berjalan</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-500">Pengumuman Kelulusan:</span>
                  <span className="font-semibold text-emerald-700">Maks. 3 Hari Kerja Pasca Wawancara</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Batas Waktu: 31 Mei 2026</span>
              <button
                onClick={onOpenRegister}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <span>Daftar Gelombang 1</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Gelombang 2 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  Gelombang Berikutnya
                </span>
                <span className="text-xs text-slate-500">Sisa Kuota Terbatas</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">Gelombang II (Susulan & Umum)</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Dibuka untuk melengkapi kuota kelas reguler dan kelas hybrid akhir pekan tahun akademik baru.
                </p>
              </div>

              <div className="space-y-2 pt-2 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Masa Pendaftaran:</span>
                  <span className="font-semibold text-slate-900">1 Juni - 31 Agustus 2026</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Matrikulasi Non-Kesehatan:</span>
                  <span className="font-semibold text-slate-900">Minggu ke-1 September 2026</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-500">Kuliah Perdana:</span>
                  <span className="font-semibold text-blue-900">Pertengahan September 2026</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Batas Waktu: 31 Agustus 2026</span>
              <button
                onClick={onOpenRegister}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>Daftar / Booking Seat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* 4 Langkah Pendaftaran */}
        <div className="space-y-8">
          <div className="max-w-2xl">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              4 Langkah Praktis Menjadi Mahasiswa Pascasarjana MKM
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Ikuti alur pendaftaran terintegrasi tanpa perlu antre di loket kampus:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 font-bold flex items-center justify-center text-sm">
                01
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Pengisian Formulir Online</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Isi data diri, latar belakang pendidikan S1, instansi asal, dan peminatan studi yang diinginkan melalui form di portal ini.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 font-bold flex items-center justify-center text-sm">
                02
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Pembayaran & Unggah Berkas</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Membayar biaya seleksi pendaftaran Rp 500.000 via rekening resmi universitas dan unggah scan ijazah serta transkrip S1.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 font-bold flex items-center justify-center text-sm">
                03
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Wawancara & Rencana Studi</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mengikuti wawancara singkat bersama dosen pakar (bisa daring via Zoom) mengenai motivasi dan rencana topik tesis.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-900 font-bold flex items-center justify-center text-sm">
                04
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Registrasi & Mulai Studi</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mendapatkan Nomor Induk Mahasiswa (NIM), aktivasi akun LMS e-learning pascasarjana, dan mengikuti kuliah perdana.
              </p>
            </div>

          </div>
        </div>

        {/* Syarat Berkas Kelengkapan */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-base mb-4">
            <FileCheck className="w-5 h-5" />
            <span>Persyaratan Berkas Kelengkapan Calon Mahasiswa</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-700">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Salinan Ijazah S1 (Legalisir) dengan IPK minimal 2.75</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Salinan Transkrip Akademik S1 resmi (Legalisir)</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Scan KTP dan Kartu Keluarga (KK) yang masih berlaku</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Pasfoto formal berwarna terbaru (file digital)</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Surat Izin / Rekomendasi Pimpinan Instansi (bagi karyawan/ASN)</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Surat Keterangan Sehat dari Fasilitas Kesehatan / RS</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
