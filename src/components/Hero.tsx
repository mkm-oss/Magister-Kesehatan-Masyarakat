import React from 'react';
import { ArrowRight, Download, Calculator, CheckCircle2, Award, Calendar, GraduationCap } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeroProps {
  onOpenRegister: () => void;
  onOpenBrochure: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenRegister, onOpenBrochure }) => {
  const { settings, peminatans } = useApp();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Split 2 columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            
            {/* Editorial kicker */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-900">
              <span className="uppercase tracking-wider">{settings.heroKicker}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance">
              {settings.heroHeadline}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              {settings.heroSubheadline}
            </p>

            {/* Trust highlights bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-slate-700">
                  Jadwal fleksibel (Hybrid weekend) untuk dokter & tenaga medis aktif
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-slate-700">
                  Bimbingan publikasi jurnal nasional SINTA & internasional terindeks
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-slate-700">
                  Terbuka untuk sarjana kesehatan & non-kesehatan (jalur matrikulasi)
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-slate-700">
                  Skema cicilan biaya kuliah fleksibel tanpa bunga
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                onClick={onOpenRegister}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 group whitespace-nowrap"
              >
                <span>Daftar PMB Pascasarjana</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="#biaya"
                className="px-5 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <Calculator className="w-4 h-4 text-slate-500" />
                <span>Simulasi Biaya Studi</span>
              </a>

              <button
                onClick={onOpenBrochure}
                className="px-4 py-3.5 text-sm font-medium text-slate-600 hover:text-blue-900 transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Brosur</span>
              </button>
            </div>

            {/* Admission status note */}
            <div className="text-xs text-slate-500 pt-1 flex items-center gap-2">
              <span className="font-semibold text-slate-700">Penerimaan Mahasiswa Baru:</span>
              <span>{settings.pmbBatchName} dibuka hingga {settings.pmbBatchDeadline}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-medium">Kuota Terbatas</span>
            </div>

          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative card frame */}
              <div className="overflow-hidden rounded-2xl bg-white shadow-xl border border-slate-200">
                <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full bg-slate-100">
                  <img
                    src="/src/assets/images/hero_mkm_pontianak_1792546642247.jpg"
                    alt="Mahasiswa Pascasarjana Magister Kesehatan Masyarakat UM Pontianak"
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent pointer-events-none" />
                  
                  {/* Photo caption tag */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs font-semibold tracking-wide uppercase text-amber-300">
                      Riset Kolaboratif Pascasarjana
                    </p>
                    <p className="text-sm font-medium text-slate-100 line-clamp-1">
                      Fakultas Ilmu Kesehatan & Psikologi UM Pontianak
                    </p>
                  </div>
                </div>

                {/* Bottom Quick Feature Highlights */}
                <div className="p-4 sm:p-5 bg-white divide-y divide-slate-100 text-xs text-slate-600 space-y-2">
                  <div className="flex items-center justify-between pb-2">
                    <span className="font-medium text-slate-700">Penyelenggara:</span>
                    <span className="font-semibold text-slate-900">Universitas Muhammadiyah Pontianak</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="font-medium text-slate-700">Gelar Resmi:</span>
                    <span className="font-semibold text-blue-900">M.K.M. (Magister Kesehatan Masyarakat)</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-medium text-slate-700">Metode:</span>
                    <span className="font-semibold text-slate-900">Hybrid / Weekend Terpadu</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 4-Column Metric Strip (Updated to Peminatan) */}
        <div className="mt-14 pt-8 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-blue-900 mb-1">
              <Award className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Akreditasi Program</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-slate-900">Baik Sekali</span>
            <span className="text-xs text-slate-500 mt-0.5">Surat Keputusan LAM-PTKes</span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-blue-900 mb-1">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Masa Studi Terarah</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tabular-nums">38 SKS</span>
            <span className="text-xs text-slate-500 mt-0.5">Ditempuh dalam 3 - 4 Semester</span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-blue-900 mb-1">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Peminatan Studi</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {peminatans.length} Peminatan
            </span>
            <span className="text-xs text-slate-500 mt-0.5">AKK, Epidemiologi, K3, & Promkes</span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-blue-900 mb-1">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Sistem Perkuliahan</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-slate-900">Blended Hybrid</span>
            <span className="text-xs text-slate-500 mt-0.5">Daring & Tatap Muka Akhir Pekan</span>
          </div>

        </div>

      </div>
    </section>
  );
};
