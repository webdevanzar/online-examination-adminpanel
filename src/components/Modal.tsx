import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const sizeClasses: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-7xl",
};

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;

  const onBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClose();
  };

  const onContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-999">
      <div className="absolute inset-0 bg-black/70" onClick={onBackdrop} />
      <div className="absolute inset-0 p-4 flex items-center justify-center">
        <div
          className={`w-full ${sizeClasses[size]} bg-white rounded-lg shadow-xl border border-gray-100 m-4 sm:m-0`}
          onClick={onContentClick}
        >
          <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold pr-4">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors shrink-0"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-5 h-5 sm:w-6 sm:h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4 sm:p-6 max-h-[70vh] sm:max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-visible">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
