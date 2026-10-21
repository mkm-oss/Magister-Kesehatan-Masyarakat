import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';

interface FaqSectionProps {
  onOpenConsultation: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenConsultation }) => {
  const { faqs } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-900 bg-blue-50 px-3 py-1 rounded-full">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>PERTANYAAN UMUM CALON MAHASISWA</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight text-balance">
            Semua yang Perlu Anda Ketahui tentang MKM UM Pontianak
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Temukan jawaban atas pertanyaan seputar perkuliahan, matrikulasi, biaya studi, dan jadwal kuliah bagi pekerja profesional.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-blue-900' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions CTA */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Punya Pertanyaan Spesifik Mengenai Persyaratan Anda?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl mx-auto">
              Tim sekretariat akademik Magister Kesehatan Masyarakat FIKPsi UM Pontianak siap membantu konsultasi kurikulum dan skema pembiayaan melalui WhatsApp resmi.
            </p>
          </div>
          <div>
            <button
              onClick={onOpenConsultation}
              className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-sm transition-colors"
            >
              Hubungi Sekretariat PMB S2
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
