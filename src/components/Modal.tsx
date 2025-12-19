import { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  body: string;
  technicalDetails: string[];
  technicalDetailsTitle: string;
  icon?: ReactNode;
  variant?: 'blue' | 'teal' | 'purple' | 'green';
}

export function Modal({
  isOpen,
  onClose,
  title,
  body,
  technicalDetails,
  technicalDetailsTitle,
  icon,
  variant = 'blue'
}: ModalProps) {
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

  const variantStyles = {
    blue: {
      headerBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      iconBg: 'bg-white/20',
      dotColor: 'bg-blue-600',
      buttonGradient: 'from-blue-600 to-blue-700'
    },
    teal: {
      headerBg: 'bg-gradient-to-br from-teal-500 to-teal-600',
      iconBg: 'bg-white/20',
      dotColor: 'bg-teal-600',
      buttonGradient: 'from-teal-600 to-teal-700'
    },
    purple: {
      headerBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
      iconBg: 'bg-white/20',
      dotColor: 'bg-purple-600',
      buttonGradient: 'from-purple-600 to-purple-700'
    },
    green: {
      headerBg: 'bg-gradient-to-br from-green-500 to-green-600',
      iconBg: 'bg-white/20',
      dotColor: 'bg-green-600',
      buttonGradient: 'from-green-600 to-green-700'
    }
  };

  const styles = variantStyles[variant];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl animate-scale-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex-shrink-0 ${styles.headerBg} px-6 py-8 rounded-t-2xl relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="flex flex-col items-center text-center space-y-4">
            {icon && (
              <div className={`w-16 h-16 ${styles.iconBg} backdrop-blur-sm rounded-2xl flex items-center justify-center text-white`}>
                {icon}
              </div>
            )}
            <h2 className="text-2xl md:text-3xl font-bold text-white max-w-2xl">
              {title}
            </h2>
          </div>
        </div>

        <div className="px-6 md:px-8 py-8 space-y-8 overflow-y-auto flex-1">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed text-center">
              {body}
            </p>
          </div>

          {technicalDetails && technicalDetails.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className={`w-1 h-6 ${styles.dotColor} rounded-full mr-3`}></span>
                {technicalDetailsTitle}
              </h3>
              <ul className="space-y-3">
                {technicalDetails.map((detail, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-2 h-2 ${styles.dotColor} rounded-full mt-2`}></div>
                    <span className="text-gray-700 leading-relaxed flex-1">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl flex justify-center">
          <button
            onClick={onClose}
            className={`px-8 py-3 bg-gradient-to-r ${styles.buttonGradient} text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
          >
            {technicalDetails.length > 0 ? 'Got it' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
