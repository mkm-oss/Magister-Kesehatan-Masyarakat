import React from 'react';
import { Microscope, MapPin, Sparkles, FileText, CheckCircle, ShieldAlert } from 'lucide-react';

export const VisionAdvantage: React.FC = () => {
  return (
    <section id="profil" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 mb-2">
            <span>PROFIL PROGRAM STUDI</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>FIKPsi UM PONTIANAK</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight text-balance">
            Visi Keunggulan Berbasis Kearifan Wilayah Pesisir & Lahan Basah Tropis
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Program Studi Magister Kesehatan Masyarakat FIKPsi Universitas Muhammadiyah Pontianak berdiri sebagai pusat rujukan pendidikan pascasarjana kesehatan di Kalimantan Barat. Kami mengintegrasikan bukti ilmiah mutakhir, analisis kebijakan komprehensif, dan kepekaan sosio-kultural lokal.
          </p>
        </div>

        {/* 2-Column Vision & Mission Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-900 mb-3">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold text-slate-900">Visi Program Studi</h3>
              </div>
              <p className="text-slate-700 leading-relaxed italic text-sm sm:text-base">
                "Menjadi Program Studi Magister Kesehatan Masyarakat yang unggul dalam pengembangan ilmu dan teknologi kesehatan berbasis wilayah pesisir dan lahan basah tropis, berjiwa entrepreneurship, serta berlandaskan nilai-nilai Al-Islam dan Kemuhammadiyahan pada tahun 2030."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-500">
              <span>Fakultas Ilmu Kesehatan & Psikologi</span>
              <span aria-hidden="true">·</span>
              <span>Keputusan Senat Akademik</span>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-900 mb-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Misi Tridharma Perguruan Tinggi</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-blue-900 shrink-0">01.</span>
                  <span>Menyelenggarakan pendidikan pascasarjana bermutu tinggi dengan kurikulum mutakhir berorientasi pemecahan masalah kesehatan nyata.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-blue-900 shrink-0">02.</span>
                  <span>Mengembangkan riset inovatif di bidang epidemiologi, manajemen RS, sanitasi air gambut, dan keselamatan kerja agroindustri tropis.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-blue-900 shrink-0">03.</span>
                  <span>Mendharmabaktikan kepakaran dalam advokasi kebijakan publik dan pengabdian masyarakat guna mengentaskan stunting dan disparitas kesehatan.</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-500">
              <span>Tridharma Pascasarjana Berkelanjutan</span>
            </div>
          </div>

        </div>

        {/* Feature Bento Grid with Real Photographic Proof */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          
          {/* Card 1: Visual Feature - Wetland & Coastal Field Research */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm flex flex-col">
            <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
              <img
                src="/src/assets/images/health_field_research_1792546643822.jpg"
                alt="Riset Lapangan Kesehatan Pesisir dan Lahan Basah Tropis Kalimantan Barat"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="text-xs uppercase tracking-wider font-semibold text-amber-300">Laboratorium Lapangan Nyata</span>
                <h4 className="text-lg font-bold text-white mt-0.5">Riset Kesehatan Lahan Basah & Pesisir Sungai Kapuas</h4>
              </div>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-sm text-slate-600 leading-relaxed">
                Kondisi geografis Kalimantan Barat dengan bentang perairan gambut dan aliran sungai menghadirkan tantangan kesehatan khas: sanitasi air bersih, penyakit tular vektor (DBD & Malaria), paparan pestisida di perkebunan sawit, hingga stunting pesisir. Mahasiswa MKM dilatih melakukan intervensi kesehatan terukur yang langsung berdampak pada masyarakat.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-slate-700">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Kemitraan Dinkes Provinsi & 14 Kabupaten/Kota
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Kajian Terapan AMDAL & K3 Perkebunan
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Visual Feature - Academic Atmosphere & Seminars */}
          <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm flex flex-col">
            <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
              <img
                src="/src/assets/images/lab_academic_seminar_1792546642817.jpg"
                alt="Diskusi Kebijakan dan Kolokium Pascasarjana FIKPsi UM Pontianak"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="text-xs uppercase tracking-wider font-semibold text-blue-300">Diskusi Pakar & Praktisi</span>
                <h4 className="text-lg font-bold text-white mt-0.5">Kolokium Ilmiah & Kepemimpinan RS</h4>
              </div>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-sm text-slate-600 leading-relaxed">
                Pembelajaran dirancang partisipatif melalui studi kasus manajerial RS nyata, perumusan naskah kebijakan (policy brief), dan pengawalan naskah publikasi ilmiah hingga tembus jurnal bereputasi nasional terakreditasi SINTA dan internasional.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-blue-900">
                <Microscope className="w-4 h-4 text-blue-600" />
                <span>Bimbingan Intensif Tesis Berstandar Baku</span>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Keunggulan Tambahan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          
          <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-sm transition-all">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-sm mb-4">
              01
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">Fleksibilitas Blended Learning</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Kuliah dirancang khusus untuk aparatur sipil negara (ASN), dokter spesialis/umum, perawat, dan manajer perusahaan dengan perpaduan kuliah tatap muka akhir pekan dan penugasan daring terstruktur.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-sm transition-all">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-sm mb-4">
              02
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">Koneksi Luas Rumah Sakit & Dinkes</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Didukung jejaring kerjasama dengan RSUD dr. Soedarso, RS Swasta, Dinkes Kalbar, BKKBN, dan industri agroindustri perkebunan sawit terkemuka di Kalimantan Barat.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-sm transition-all">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm mb-4">
              03
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">Peluang Lulus 1,5 Tahun (3 Semester)</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Pendampingan penulisan usulan penelitian sejak semester 2 memungkinkan mahasiswa berdedikasi tinggi menyelesaikan tesis dan sidang kelayakan dalam kurun waktu 3 semester.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-sm transition-all">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold text-sm mb-4">
              04
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">Etika Bioetika Berlandaskan Islam</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Menghasilkan sarjana pascasarjana yang tidak hanya cakap secara teknis metodologis, tetapi juga memiliki integritas moral, amanah kepemimpinan, dan nilai kemanusiaan universal.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
