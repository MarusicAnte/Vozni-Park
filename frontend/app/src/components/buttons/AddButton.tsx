import React from "react";

interface AddButtonProps {
  onClick: () => void;
  isDisabled: boolean;
  buttonText: string;
}

const AddButton: React.FC<AddButtonProps> = ({
  onClick,
  isDisabled,
  buttonText,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`${
        isDisabled
          ? "bg-gray-400 cursor-not-allowed opacity-50"
          : "bg-green-600"
      } text-white px-3 py-2 rounded`}
    >
      {buttonText}
    </button>
  );
};

export default AddButton;
