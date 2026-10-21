import React from 'react';
import { X } from 'lucide-react';
import { GoogleSheetsManager } from './GoogleSheetsManager';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAction?: 'none' | 'export_applicants';
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  defaultAction = 'none',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Close Header */}
        <div className="flex items-center justify-between px-6 py-3 bg-emerald-950 text-white border-b border-emerald-900">
          <span className="text-xs font-bold text-emerald-300">
            Google Sheets Akademik · Google Workspace for Education
          </span>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-300 hover:text-white rounded-lg transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Google Sheets Manager Body */}
        <div className="p-3 sm:p-4 max-h-[85vh] overflow-y-auto">
          <GoogleSheetsManager
            title="Google Sheets Akademik MKM UM Pontianak"
            defaultAction={defaultAction}
          />
        </div>
      </div>
    </div>
  );
};
