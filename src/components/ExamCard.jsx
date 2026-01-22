const ExamCard = ({ exam, onBuy }) => {
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
            onClick={() => onBuy(exam)}
            className="bg-green-600 text-white px-4 py-1 rounded"
          >
            Buy Exam
          </button>
        </div>
      </div>
    );
  };
  
  export default ExamCard;
  
  