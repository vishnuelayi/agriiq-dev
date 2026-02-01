import Card from "../ui/Card";
import Button from "../ui/Button";

const ExamCard = ({
  exam,
  mode = "available", // "available" | "owned"
  purchased = false,
  blocked = false,
  remainingAttempts,
  onBuy,
  onStart,
}) => {
  return (
    <Card className="rounded-3xl p-6 flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-gray-50">
      {/* TOP */}
      <div className="space-y-3">
        {/* Purchased Badge */}
        {purchased && mode === "available" && (
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
            Purchased
          </span>
        )}

        <h3 className="text-[#0a1e3d] text-xl font-bold tracking-tight">
          {exam.title}
        </h3>

        <p className="text-gray-500">{exam.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          {exam.questionCount != null && (
            <span>{exam.questionCount} Questions</span>
          )}
          {exam.duration && <span>{exam.duration} min</span>}
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between mt-8">
        {/* AVAILABLE MODE */}
        {mode === "available" && (
          <>
            <span className="text-[#10b981] font-bold text-2xl">
              ₹{exam.price}
            </span>

            {purchased ? (
              <Button disabled className="rounded-full px-6 py-2.5">
                Purchased
              </Button>
            ) : (
              <Button
                onClick={() => onBuy?.(exam)}
                className="rounded-full px-6 py-2.5"
              >
                Buy Exam
              </Button>
            )}
          </>
        )}

        {/* OWNED MODE */}
        {mode === "owned" && (
          <div className="flex items-center justify-between w-full">
            {remainingAttempts !== undefined && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                {remainingAttempts} attempt
                {remainingAttempts !== 1 ? "s" : ""} left
              </span>
            )}

            {blocked ? (
              <Button disabled>Locked</Button>
            ) : (
              <Button onClick={() => onStart?.(exam)}>
                Start Exam
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ExamCard;
