import React from 'react';
import { X } from 'lucide-react';
import { GoogleDriveExplorer } from './GoogleDriveExplorer';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Close Header */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-900 text-white border-b border-slate-800">
          <span className="text-xs font-bold text-amber-300">
            Pusat Cloud Storage · Google Workspace for Education
          </span>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Google Drive Explorer Body */}
        <div className="p-3 sm:p-4 max-h-[85vh] overflow-y-auto">
          <GoogleDriveExplorer title="Google Drive Akademik MKM UM Pontianak" />
        </div>
      </div>
    </div>
  );
};
