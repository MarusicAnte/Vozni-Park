import React from "react";

interface AppCancelModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
}

const AppCancelModal: React.FC<AppCancelModalProps> = ({
  isOpen,
  title,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-md w-1/3">
        <h3 className="text-xl font-semibold mb-10">{title}</h3>
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded-md ml-4"
          >
            Odustani
          </button>
          <button
            onClick={onSubmit}
            className="bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Otkaži
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppCancelModal;
