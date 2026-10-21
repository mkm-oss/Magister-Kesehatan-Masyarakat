import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, GraduationCap, FileCheck2, Award } from 'lucide-react';

export const Curriculum: React.FC = () => {
  const { curriculum } = useApp();
  const [activeSem, setActiveSem] = useState<number>(1);

  const currentSemester = curriculum.find((s) => s.semester === activeSem) || curriculum[0];

  return (
    <section id="kurikulum" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 mb-2">
            <span>STRUKTUR KURIKULUM</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>TOTAL 38 SKS (3-4 SEMESTER)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight text-balance">
            Kurikulum Terstruktur Berbasis Outcome-Based Education (OBE)
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Disusun mengacu pada Asosiasi Institusi Pendidikan Tinggi Kesehatan Masyarakat Indonesia (AIPTKMI) dan LAM-PTKes, memadukan riset lapangan, kemampuan analitik data, dan penulisan naskah publikasi ilmiah.
          </p>
        </div>

        {/* Semester Navigator Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl max-w-xl">
          {curriculum.map((sem) => {
            const isActive = sem.semester === activeSem;
            return (
              <button
                key={sem.semester}
                onClick={() => setActiveSem(sem.semester)}
                className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all text-center whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-blue-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semester {sem.semester}
              </button>
            );
          })}
        </div>

        {/* Active Semester Display */}
        {currentSemester && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="text-xs font-semibold text-blue-900 uppercase tracking-wide">
                  Fokus Akademik
                </div>
                <h3 className="text-xl font-bold text-slate-900">{currentSemester.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                  {currentSemester.description}
                </p>
              </div>
              <div className="sm:text-right shrink-0">
                <span className="text-xs text-slate-500 font-medium">Beban Semester:</span>
                <div className="text-2xl font-bold text-blue-900 font-mono tabular-nums">
                  {currentSemester.totalSks} SKS
                </div>
              </div>
            </div>

            {/* Courses Table / List */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                    <th className="py-3 px-4">Kode MK</th>
                    <th className="py-3 px-4">Nama Mata Kuliah</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4 text-right">Bobot SKS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70">
                  {currentSemester.courses.map((course) => (
                    <tr key={course.code} className="hover:bg-white transition-colors">
                      <td className="py-3.5 px-4 font-mono text-xs font-medium text-slate-600">
                        {course.code}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {course.name}
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md font-medium ${
                            course.category === 'Wajib'
                              ? 'bg-blue-100 text-blue-800'
                              : course.category === 'Peminatan'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {course.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                        {course.sks} SKS
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Graduation Requirements Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-900 shrink-0">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Publikasi Naskah Ilmiah</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Mahasiswa didampingi dosen pembimbing untuk mempublikasikan artikel di jurnal nasional minimal SINTA 2 atau jurnal internasional terindeks.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-900 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Tesis Berbasis Permasalahan Nyata</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Riset tesis difokuskan pada pemecahan problem kesehatan masyarakat spesifik di tempat kerja mahasiswa, rumah sakit, maupun daerah asalnya.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-lg bg-amber-50 text-amber-900 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Gelar Akademik M.K.M.</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Lulusan berhak menyandang gelar resmi Magister Kesehatan Masyarakat (M.K.M.) yang diakui secara nasional dan internasional.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
