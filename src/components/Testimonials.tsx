import React from 'react';
import { TESTIMONIALS_DATA } from '../data/mkmData';
import { Quote, Building, Award } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 mb-2">
            <span>SUARA ALUMNI & MAHASISWA</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>REKAM JEJAK KELULUSAN</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight text-balance">
            Kiprah Nyata Lulusan di Berbagai Sektor Strategis
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Alumni Magister Kesehatan Masyarakat UM Pontianak mengabdi di rumah sakit pemerintah & swasta, dinas kesehatan kabupaten/kota, instansi kementerian, serta perusahaan multinasional.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS_DATA.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-7 flex flex-col justify-between hover:bg-white hover:shadow-md transition-all"
            >
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-blue-200" />
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-900 text-amber-300 font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                  {item.avatarInitial}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                  <p className="text-xs font-medium text-blue-900">{item.role}</p>
                  <p className="text-[11px] text-slate-500">{item.agency} · {item.batch}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Institutional Stakeholders Bar */}
        <div className="p-6 rounded-2xl bg-slate-100/80 border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-600">
          <span className="text-slate-900 font-bold">Instansi Asal Mahasiswa & Alumni:</span>
          <span className="px-3 py-1 bg-white rounded-md border border-slate-200">Dinas Kesehatan Prov. Kalbar & Kab/Kota</span>
          <span className="px-3 py-1 bg-white rounded-md border border-slate-200">RSUD dr. Soedarso Pontianak</span>
          <span className="px-3 py-1 bg-white rounded-md border border-slate-200">RS Swasta & Klinik Pratama</span>
          <span className="px-3 py-1 bg-white rounded-md border border-slate-200">Perusahaan Perkebunan Sawit & Tambang</span>
          <span className="px-3 py-1 bg-white rounded-md border border-slate-200">Puskesmas Perbatasan & Pedalaman</span>
        </div>

      </div>
    </section>
  );
};
