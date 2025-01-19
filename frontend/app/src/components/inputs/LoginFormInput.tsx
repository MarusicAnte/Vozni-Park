interface ILoginFormInput {
  label: string;
  type: string;
  name: string;
  placeholder: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  value: string;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  touched: boolean | undefined;
  errorMessage: string | undefined;
}

function LoginFormInput({
  label,
  type,
  name,
  placeholder,
  onChange,
  value,
  onBlur,
  touched,
  errorMessage,
}: ILoginFormInput) {
  return (
    <div className="flex flex-col items-start mb-4">
      <label className="mb-1 font-semibold">{label}:</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="w-full h-10 rounded-sm px-1 border-2 border-[#cbcbcb]"
        onChange={onChange}
        value={value}
        onBlur={onBlur}
      />
      {touched && errorMessage && (
        <span className="text-red-500 text-sm mt-1">{errorMessage}</span>
      )}
    </div>
  );
}

export default LoginFormInput;
