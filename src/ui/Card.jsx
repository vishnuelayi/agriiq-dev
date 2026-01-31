const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-[color:var(--color-surface)] rounded-[var(--radius-xl)] shadow-[var(--shadow-soft)] p-4 transition-all ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
