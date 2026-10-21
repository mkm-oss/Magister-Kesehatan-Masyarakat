import React, { useState } from 'react';
import { Calculator, Check, AlertCircle, ArrowRight, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FeeCalculatorProps {
  onOpenConsultation: () => void;
}

export const FeeCalculator: React.FC<FeeCalculatorProps> = ({ onOpenConsultation }) => {
  const { settings } = useApp();
  const [applicantType, setApplicantType] = useState<'umum' | 'alumni' | 'mitra'>('umum');
  const [backgroundType, setBackgroundType] = useState<'linier' | 'non_linier'>('linier');
  const [paymentPlan, setPaymentPlan] = useState<'lunas' | 'cicilan'>('cicilan');

  // Pricing from live settings
  const regFee = settings.registrationFee;
  const baseSppPerSemester = settings.baseSppPerSemester;
  const baseDevelopmentFee = settings.baseDevelopmentFee;
  const matriculationFee = backgroundType === 'non_linier' ? settings.matriculationFee : 0;
  const examThesisFee = settings.thesisExamFee;

  // Discount based on applicant type
  const discount =
    applicantType === 'alumni'
      ? settings.alumniDiscount
      : applicantType === 'mitra'
      ? settings.partnerDiscount
      : 0;

  const totalDevelopmentFee = Math.max(0, baseDevelopmentFee - discount);
  const totalTuition4Semesters = baseSppPerSemester * 4;
  const totalProgramCost = regFee + matriculationFee + totalDevelopmentFee + totalTuition4Semesters + examThesisFee;

  // Semester 1 initial payment
  const devFeeSem1 = Math.round(totalDevelopmentFee / 2);
  const sem1Total = baseSppPerSemester + devFeeSem1 + matriculationFee;
  const sem1Installment = Math.round(sem1Total / 3);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section id="biaya" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 mb-2">
            <span>TRANSPARANSI BIAYA PENDIDIKAN</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>SKEMA ANGSURAN RESMI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight text-balance">
            Simulasi Biaya Studi & Skema Pembayaran Fleksibel
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Komitmen kami menghadirkan pendidikan pascasarjana berkualitas tinggi yang terjangkau bagi para tenaga kesehatan, dokter, dan praktisi dengan skema cicilan resmi tanpa bunga.
          </p>
        </div>

        {/* Interactive Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column */}
          <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
            
            {/* Step 1: Kategori Calon Mahasiswa */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>1. Kategori Calon Mahasiswa</span>
                <span className="text-xs font-normal text-slate-500">Pilih status pendaftar</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setApplicantType('umum')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    applicantType === 'umum'
                      ? 'bg-blue-900 text-white border-blue-900 shadow-sm font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold">Umum / Mandiri</div>
                  <div className={`mt-0.5 text-[11px] ${applicantType === 'umum' ? 'text-blue-100' : 'text-slate-500'}`}>
                    Tarif Reguler
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setApplicantType('alumni')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    applicantType === 'alumni'
                      ? 'bg-blue-900 text-white border-blue-900 shadow-sm font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold">Alumni UM Pontianak</div>
                  <div className={`mt-0.5 text-[11px] ${applicantType === 'alumni' ? 'text-amber-300' : 'text-amber-600 font-medium'}`}>
                    Hemat {formatIDR(settings.alumniDiscount)}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setApplicantType('mitra')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    applicantType === 'mitra'
                      ? 'bg-blue-900 text-white border-blue-900 shadow-sm font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold">Mitra Dinkes / RS</div>
                  <div className={`mt-0.5 text-[11px] ${applicantType === 'mitra' ? 'text-amber-300' : 'text-amber-600 font-medium'}`}>
                    Hemat {formatIDR(settings.partnerDiscount)}
                  </div>
                </button>
              </div>
            </div>

            {/* Step 2: Latar Belakang Pendidikan S1 */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>2. Latar Belakang Pendidikan S1</span>
                <span className="text-xs font-normal text-slate-500">Linier atau Non-Linier</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setBackgroundType('linier')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    backgroundType === 'linier'
                      ? 'bg-blue-900 text-white border-blue-900 shadow-sm font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold">S1 Rumpun Kesehatan</div>
                  <div className={`mt-0.5 text-[11px] ${backgroundType === 'linier' ? 'text-blue-100' : 'text-slate-500'}`}>
                    SKM, Dokter, Perawat, Bidan, Farmasi (Tanpa Matrikulasi)
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setBackgroundType('non_linier')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    backgroundType === 'non_linier'
                      ? 'bg-blue-900 text-white border-blue-900 shadow-sm font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold">S1 Non-Kesehatan</div>
                  <div className={`mt-0.5 text-[11px] ${backgroundType === 'non_linier' ? 'text-blue-100' : 'text-slate-500'}`}>
                    Hukum, Manajemen, Teknik (+ Matrikulasi {formatIDR(settings.matriculationFee)})
                  </div>
                </button>
              </div>
            </div>

            {/* Step 3: Opsi Pola Pembayaran */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>3. Skema Pembayaran SPP Tiap Semester</span>
                <span className="text-xs font-normal text-slate-500">Pilihan termin pembayaran</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentPlan('cicilan')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    paymentPlan === 'cicilan'
                      ? 'bg-blue-900 text-white border-blue-900 shadow-sm font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold">Skema Cicilan 3x per Semester</div>
                  <div className={`mt-0.5 text-[11px] ${paymentPlan === 'cicilan' ? 'text-amber-300' : 'text-slate-500'}`}>
                    Paling diminati pekerja & nakes
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentPlan('lunas')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    paymentPlan === 'lunas'
                      ? 'bg-blue-900 text-white border-blue-900 shadow-sm font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold">Pembayaran Lunas per Semester</div>
                  <div className={`mt-0.5 text-[11px] ${paymentPlan === 'lunas' ? 'text-blue-100' : 'text-slate-500'}`}>
                    Satu kali bayar setiap registrasi semester
                  </div>
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-slate-500 pt-2 bg-white/70 p-3 rounded-lg border border-slate-200">
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Biaya di atas belum termasuk biaya hidup pribadi di Pontianak. Biaya pendaftaran awal {formatIDR(settings.registrationFee)} dibayarkan saat mengajukan formulir seleksi PMB.
              </span>
            </div>

          </div>

          {/* Results Summary Column */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-semibold text-blue-900 uppercase tracking-wide">
                  Ringkasan Estimasi
                </span>
                <h3 className="text-xl font-bold text-slate-900">Rincian Finansial</h3>
              </div>
              <div className="p-2 rounded-lg bg-blue-50 text-blue-900">
                <Calculator className="w-5 h-5" />
              </div>
            </div>

            {/* Breakdown item list */}
            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>SPP per Semester (Tetap):</span>
                <span className="font-semibold font-mono tabular-nums text-slate-900">
                  {formatIDR(baseSppPerSemester)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Dana Pengembangan Institusi:</span>
                <span className="font-semibold font-mono tabular-nums text-slate-900">
                  {formatIDR(totalDevelopmentFee)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                  <span>Potongan Subsidi ({applicantType === 'alumni' ? 'Alumni' : 'Mitra'}):</span>
                  <span className="font-semibold font-mono tabular-nums">- {formatIDR(discount)}</span>
                </div>
              )}

              {matriculationFee > 0 && (
                <div className="flex items-center justify-between text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">
                  <span>Program Matrikulasi S1 Non-Kesehatan:</span>
                  <span className="font-semibold font-mono tabular-nums">+ {formatIDR(matriculationFee)}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span>Biaya Tesis & Wisuda (Semester Akhir):</span>
                <span className="font-semibold font-mono tabular-nums text-slate-900">
                  {formatIDR(examThesisFee)}
                </span>
              </div>
            </div>

            {/* Payment Schedule Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                {paymentPlan === 'cicilan' ? 'Skema Cicilan Semester 1:' : 'Total Bayar Semester 1:'}
              </div>

              {paymentPlan === 'cicilan' ? (
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-200/80">
                    <span>Termin 1 (Registrasi Awal):</span>
                    <span className="font-bold text-blue-900 font-mono tabular-nums">{formatIDR(sem1Installment)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-200/80">
                    <span>Termin 2 (Sebelum UTS):</span>
                    <span className="font-bold text-blue-900 font-mono tabular-nums">{formatIDR(sem1Installment)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-200/80">
                    <span>Termin 3 (Sebelum UAS):</span>
                    <span className="font-bold text-blue-900 font-mono tabular-nums">{formatIDR(sem1Installment)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-xl font-bold text-blue-900 font-mono tabular-nums">
                  {formatIDR(sem1Total)}
                </div>
              )}
            </div>

            {/* Total Overall */}
            <div className="pt-4 border-t border-slate-200 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Estimasi Total Hingga Lulus (4 Semester):</span>
                <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {formatIDR(totalProgramCost)}
                </span>
              </div>
            </div>

            {/* Action */}
            <button
              onClick={onOpenConsultation}
              className="w-full py-3.5 px-4 text-xs sm:text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow transition-colors flex items-center justify-center gap-2"
            >
              <span>Konsultasi Skema Pembiayaan</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>

      </div>
    </section>
  );
};
