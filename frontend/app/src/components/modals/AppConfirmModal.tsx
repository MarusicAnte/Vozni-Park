import { IConfirmModalProps } from "../../types";

function AppConfirmModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  message,
}: IConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white px-14 py-7 rounded-md w-fit">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-center gap-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Odustani
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-cyan-900 text-white rounded hover:bg-red-800"
          >
            Popravi
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppConfirmModal;
