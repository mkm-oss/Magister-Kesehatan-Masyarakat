import React, { useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  User,
  Eye,
  Tag,
  Share2,
  Printer,
  Edit3,
  FileText,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CustomPageViewerProps {
  slug?: string;
  onBack?: () => void;
  onEditPage?: (pageId: string) => void;
}

export const CustomPageViewer: React.FC<CustomPageViewerProps> = ({
  slug,
  onBack,
  onEditPage,
}) => {
  const {
    customPages,
    updateCustomPage,
    activePageSlug,
    setActivePageSlug,
    setActivePortalView,
    currentUser,
  } = useApp();

  const targetSlug = slug || activePageSlug;
  const page = customPages.find((p) => p.slug === targetSlug) || customPages[0];

  // Increment view counter once per load
  useEffect(() => {
    if (page && page.id) {
      updateCustomPage(page.id, { views: (page.views || 0) + 1 });
    }
  }, [page?.id]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setActivePortalView('landing');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: page?.title,
        text: page?.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan halaman berhasil disalin!');
    }
  };

  if (!page) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <FileText className="w-16 h-16 text-slate-600 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-xs text-slate-400 max-w-md mb-6">
          Halaman yang Anda tuju mungkin belum diterbitkan atau telah dipindahkan oleh Administrator.
        </p>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>
    );
  }

  // Related other published pages
  const otherPages = customPages
    .filter((p) => p.id !== page.id && p.isPublished)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header Bar */}
      <header className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition flex items-center gap-1.5 text-xs font-bold border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
              <span>Portal MKM</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span>Halaman Informasi</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-slate-200 font-semibold truncate max-w-[200px]">
                {page.category}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(currentUser?.role === 'superadmin' || currentUser?.role === 'admin') && (
              <button
                onClick={() => {
                  if (onEditPage) {
                    onEditPage(page.id);
                  } else {
                    setActivePortalView('admin');
                  }
                }}
                className="px-3 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition flex items-center gap-1.5 shadow-md"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Halaman (Superadmin)</span>
              </button>
            )}

            <button
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition border border-slate-700"
              title="Bagikan Tautan"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => window.print()}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition border border-slate-700"
              title="Cetak Halaman"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Article */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
        <article className="bg-slate-950/70 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          
          {/* Category, Icon & Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                {page.icon || '📄'}
              </span>
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  {page.category}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Slug: /{page.slug}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full font-bold bg-blue-950 text-blue-300 border border-blue-800/40">
                Target: {page.targetAudience}
              </span>
              <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                {page.isPublished ? 'Dipublikasikan' : 'Draf'}
              </span>
            </div>
          </div>

          {/* Article Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {page.title}
            </h1>
            {page.excerpt && (
              <p className="text-sm sm:text-base text-slate-300 mt-3 font-medium leading-relaxed border-l-4 border-blue-500 pl-4 py-1 italic bg-blue-950/20 rounded-r-xl">
                {page.excerpt}
              </p>
            )}
          </div>

          {/* Metadata: Author, Date, Views */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-400 py-3 border-y border-slate-800/80 font-mono">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>Oleh: <strong className="text-slate-200">{page.author}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Diperbarui: <strong className="text-slate-200">{page.updatedAt || page.createdAt}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>{page.views || 1} Kali Dilihat</span>
            </div>
          </div>

          {/* Rendered Body Content */}
          <div
            className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed space-y-4 pt-2 font-sans
              [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-blue-300 [&>h3]:mt-6 [&>h3]:mb-2
              [&>h4]:text-base [&>h4]:font-bold [&>h4]:text-slate-100 [&>h4]:mt-4 [&>h4]:mb-1
              [&>p]:leading-relaxed [&>p]:text-slate-300
              [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-1.5 [&>ul]:text-slate-300
              [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-1.5 [&>ol]:text-slate-300
              [&>table]:w-full [&>table]:border [&>table]:border-slate-700 [&>table]:my-4
              [&>table_th]:border [&>table_th]:border-slate-700 [&>table_th]:p-2.5 [&>table_th]:bg-slate-800
              [&>table_td]:border [&>table_td]:border-slate-800 [&>table_td]:p-2.5"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />

          {/* Post Footer Callout */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-800/40 text-xs text-slate-300 flex items-center justify-between gap-4 mt-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white block">Punya Pertanyaan Terkait Halaman Ini?</span>
                <span className="text-slate-400 text-[11px]">Hubungi Sekretariat Program Studi Magister Kesehatan Masyarakat FIKPsi.</span>
              </div>
            </div>

            <a
              href="https://wa.me/6281256789012"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition flex items-center gap-1.5 whitespace-nowrap shadow-md"
            >
              <span>Hubungi Hotline</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </article>

        {/* Other Pages Section */}
        {otherPages.length > 0 && (
          <div className="mt-12 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Halaman Informasi Lainnya</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {otherPages.map((op) => (
                <div
                  key={op.id}
                  onClick={() => setActivePageSlug(op.slug)}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-blue-500/50 transition cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg">{op.icon || '📄'}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {op.category}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-blue-300 transition line-clamp-2">
                      {op.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {op.excerpt}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>/{op.slug}</span>
                    <span className="text-blue-400 font-bold group-hover:translate-x-1 transition flex items-center gap-0.5">
                      Buka <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
