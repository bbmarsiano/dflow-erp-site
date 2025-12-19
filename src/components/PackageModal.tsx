import { useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

export function PackageModal({
  isOpen,
  onClose,
  title,
  content,
  ctaLabel,
  onCtaClick
}: PackageModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCta = () => {
    if (onCtaClick) {
      onCtaClick();
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-xl shadow-2xl animate-scale-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 bg-gradient-to-br from-blue-600 to-teal-600 px-6 py-8 rounded-t-xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white max-w-2xl mx-auto">
              {title}
            </h2>
          </div>
        </div>

        <div className="px-6 md:px-8 py-8 overflow-y-auto flex-1">
          <div
            className="prose prose-lg max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        <div className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-xl flex justify-center gap-4">
          {ctaLabel && (
            <button
              onClick={handleCta}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
