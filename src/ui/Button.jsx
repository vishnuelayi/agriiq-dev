const Button = ({
    children,
    variant = "primary",
    type = "button",
    disabled = false,
    className = "",
    ...props
  }) => {
    const base =
      "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-[var(--radius-xl)] transition-all duration-200 active:scale-95 focus:outline-none";
  
    const variants = {
      primary:
        "bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary-dark)] shadow-[var(--shadow-soft)]",
      ghost:
        "bg-transparent text-[color:var(--color-primary)] hover:bg-green-50",
      danger:
        " bg-[color:var(--color-danger)] text-white hover:bg-red-500",
    };
  
    const disabledStyles =
      "opacity-60 cursor-not-allowed active:scale-100";
  
    return (
      <button
        type={type}
        disabled={disabled}
        className={`${base} ${variants[variant]} ${
          disabled ? disabledStyles : ""
        } ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };
  
  export default Button;
  