const ExamCard = ({ exam }) => {
    return (
      <div className="border rounded p-4 space-y-2">
        <h3 className="text-lg font-semibold">{exam.title}</h3>
        <p className="text-sm text-gray-600">{exam.description}</p>
  
        <div className="text-sm flex justify-between">
          <span>Questions: {exam.questionCount}</span>
          <span>Duration: {exam.durationMinutes} min</span>
        </div>
  
        <div className="flex justify-between items-center pt-2">
          <span className="font-semibold">₹{exam.price}</span>
          <button
            disabled
            className="bg-gray-300 text-gray-600 px-4 py-1 rounded cursor-not-allowed"
          >
            Buy (Coming Soon)
          </button>
        </div>
      </div>
    );
  };
  
  export default ExamCard;
  