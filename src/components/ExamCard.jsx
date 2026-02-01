import Card from "../ui/Card";
import Button from "../ui/Button";

const ExamCard = ({
  exam,
  mode = "available", // available | owned
  blocked = false,
  onBuy,
  onStart,
}) => {
  return (
    <Card className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">
          {exam.title}
        </h3>

        {exam.description && (
          <p className="text-sm text-muted">
            {exam.description}
          </p>
        )}

        <div className="text-sm text-muted flex justify-between">
          {exam.questionCount != null && (
            <span>{exam.questionCount} Questions</span>
          )}
          {exam.duration && (
            <span>{exam.duration} min</span>
          )}
        </div>

        <div className="pt-2">
          {mode === "available" && (
            <div className="flex items-center justify-between">
              <span className="font-semibold text-primary">
                ₹{exam.price}
              </span>
              <Button onClick={() => onBuy(exam)}>
                Buy Exam
              </Button>
            </div>
          )}

          {mode === "owned" && (
            blocked ? (
              <p className="text-sm text-red-600 font-medium">
                Reattempt limit reached
              </p>
            ) : (
              <Button onClick={() => onStart(exam)}>
                Start Exam
              </Button>
            )
          )}
        </div>
      </div>
    </Card>
  );
};

export default ExamCard;
