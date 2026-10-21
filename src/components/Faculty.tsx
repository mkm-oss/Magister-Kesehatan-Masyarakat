import React from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, Award, BookOpen } from 'lucide-react';

export const Faculty: React.FC = () => {
  const { lecturers } = useApp();

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 mb-2">
            <span>TENAGA PENGAJAR & PEMBIMBING</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>GURU BESAR & DOKTOR</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight text-balance">
            Dibimbing Langsung oleh Pakar & Peneliti Bereputasi
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Dosen MKM FIKPsi UM Pontianak terdiri dari para akademisi bergelar Doktor (Ph.D) dan Guru Besar dengan keahlian di bidang kebijakan kesehatan, epidemiologi terapan, manajemen rumah sakit, serta K3 industri.
          </p>
        </div>

        {/* Faculty Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lecturers.map((lecturer) => (
            <div
              key={lecturer.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                {/* Header tag */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md">
                    {lecturer.featuredRole}
                  </span>
                  <div className="flex items-center gap-1 text-slate-500 font-mono">
                    <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                    <span>{lecturer.scopusArticles} Publikasi</span>
                  </div>
                </div>

                {/* Name & Academic Title */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {lecturer.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">
                    {lecturer.title}
                  </p>
                </div>

                {/* Specialty */}
                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="font-semibold text-slate-700">Bidang Keahlian:</div>
                  <div className="leading-relaxed">{lecturer.specialty}</div>
                </div>
              </div>

              {/* Education Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                <GraduationCap className="w-4 h-4 text-blue-700 shrink-0" />
                <span className="line-clamp-1">{lecturer.education}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Advisory banner */}
        <div className="p-6 rounded-2xl bg-blue-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-bold text-white">Kuliah Tamu & Visiting Professor</h4>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              Program studi secara berkala menghadirkan Guru Besar tamu dari universitas ternama nasional, pejabat Kementerian Kesehatan RI, serta praktisi manajemen rumah sakit internasional untuk kuliah umum pascasarjana.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 bg-blue-800/80 px-4 py-2 rounded-lg text-xs font-medium text-amber-300 border border-blue-700">
            <Award className="w-4 h-4" />
            <span>Kolaborasi Riset Nasional</span>
          </div>
        </div>

      </div>
    </section>
  );
};
