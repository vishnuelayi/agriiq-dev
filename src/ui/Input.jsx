const Input = ({
    label,
    error,
    className = "",
    ...props
  }) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
  
        <input
          className={`w-full rounded-[var(--radius-xl)] border border-gray-300 px-3 py-2 text-sm focus:border-[color:var(--color-primary)] focus:ring-2 focus:ring-green-100 outline-none transition ${className}`}
          {...props}
        />
  
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  };
  
  export default Input;
  