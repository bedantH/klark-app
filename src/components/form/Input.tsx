const Input: React.FC<{
  value?: string;
  placeholder?: string;
  customClassName?: string;
  onChange?: (value: string) => void;
  handleKeyDown?: (value: string) => void;
}> = ({ placeholder, customClassName, value, onChange, handleKeyDown }) => {
  return (
    <input
      className={`border bg-white border-gray-300 rounded-full px-4 py-3 pr-10 w-full mx-auto text-sm placeholder:text-sm focus-within:border-blue-500 focus-within:shadow-none focus:outline-none focus:ring-0 ${
        customClassName || ""
      }`}
      placeholder={placeholder}
      value={value}
      onChange={(e) => {
        if (onChange) {
          onChange(e.currentTarget.value);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (handleKeyDown) {
            handleKeyDown(e.currentTarget.value);
          }
        }
      }}
      type="text"
      autoComplete="off"
      autoCorrect="off"
      spellCheck="false"
    />
  );
};

export default Input;
