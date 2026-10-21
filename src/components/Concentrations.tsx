import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Activity, ShieldCheck, Users, Briefcase, BookOpen, Lightbulb, ArrowRight, Check } from 'lucide-react';

interface ConcentrationsProps {
  onSelectPeminatanForRegistration: (peminatanName: string) => void;
}

export const Concentrations: React.FC<ConcentrationsProps> = ({
  onSelectPeminatanForRegistration,
}) => {
  const { peminatans } = useApp();
  const [selectedId, setSelectedId] = useState<string>(peminatans[0]?.id || 'akk');

  const activePeminatan = peminatans.find((c) => c.id === selectedId) || peminatans[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-5 h-5" />;
      case 'Activity':
        return <Activity className="w-5 h-5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      case 'Users':
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  if (!activePeminatan) return null;

  return (
    <section id="peminatan" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 mb-2">
            <span>PEMINATAN KEAHLIAN</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{peminatans.length} PEMINATAN STRATEGIS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight text-balance">
            Peminatan Pascasarjana Sesuai Kebutuhan Sektor Kesehatan Masa Depan
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Setiap mahasiswa dapat memilih peminatan keahlian yang selaras dengan jenjang karir, kebutuhan instansi, serta arah riset tesis yang ingin ditekuni.
          </p>
        </div>

        {/* Interactive Segmented Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {peminatans.map((item) => {
            const isSelected = item.id === selectedId;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-900 text-white border-blue-900 shadow-md ring-2 ring-blue-900/20'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`p-2 rounded-lg ${
                        isSelected ? 'bg-white/10 text-white' : 'bg-blue-50 text-blue-900'
                      }`}
                    >
                      {getIcon(item.iconName)}
                    </span>
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-amber-400 text-slate-900 font-semibold'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <h3
                    className={`font-bold text-sm sm:text-base leading-snug ${
                      isSelected ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {item.shortName}
                  </h3>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200/20 text-xs font-medium flex items-center justify-between">
                  <span className={isSelected ? 'text-blue-100' : 'text-slate-500'}>
                    Pelajari Rincian
                  </span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 ${
                      isSelected ? 'text-amber-400 translate-x-0.5' : 'text-slate-400'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Peminatan Detailed Showcase */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Overview & Career Prospects */}
            <div className="lg:col-span-7 space-y-6">
              
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 mb-1">
                  <span>PEMINATAN TERPILIH</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-amber-600 font-medium">{activePeminatan.badge}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {activePeminatan.name}
                </h3>
                <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                  {activePeminatan.description}
                </p>
              </div>

              {/* Career prospects */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <Briefcase className="w-4 h-4 text-blue-900" />
                  <span>Prospek Jabatan & Karir Lulusan</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activePeminatan.careerProspects.map((career, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-700 flex items-start gap-2"
                    >
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{career}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA for this specific peminatan */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onSelectPeminatanForRegistration(activePeminatan.name)}
                  className="px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow transition-colors flex items-center gap-2"
                >
                  <span>Pilih Peminatan Ini & Daftar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-xs text-slate-500">
                  Pilihan peminatan dapat dikonfirmasi resmi pada semester 2
                </span>
              </div>

            </div>

            {/* Right Column: Core Subjects & Sample Thesis Topics */}
            <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-slate-200 lg:pl-8">
              
              {/* Core subjects */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-blue-900" />
                  <span>Mata Kuliah Keahlian Utama</span>
                </div>
                <div className="space-y-2">
                  {activePeminatan.coreSubjects.map((sub, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-100 text-xs sm:text-sm text-slate-800"
                    >
                      <span className="font-semibold text-blue-900 mr-2">{i + 1}.</span>
                      {sub}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample thesis topics */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Contoh Arah Riset Tesis Terapan</span>
                </div>
                <div className="space-y-2 text-xs text-slate-600">
                  {activePeminatan.thesisTopics.map((topic, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-amber-50/40 border border-amber-200/60 italic leading-relaxed"
                    >
                      "{topic}"
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
