const Skeleton = ({ className = "" }) => {
    return (
      <div
        className={`animate-pulse bg-gray-200 rounded-xl ${className}`}
      />
    );
  };
  
  export default Skeleton;
  