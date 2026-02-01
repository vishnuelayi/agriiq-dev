const ExamCardSkeleton = () => {
    return (
      <div className="animate-pulse bg-white rounded-3xl p-6 space-y-4 border border-gray-100">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="flex justify-between items-center mt-6">
          <div className="h-6 bg-gray-200 rounded w-20" />
          <div className="h-9 bg-gray-200 rounded w-28" />
        </div>
      </div>
    );
  };
  
  export default ExamCardSkeleton;
  