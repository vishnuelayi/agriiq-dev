import Card from "../../ui/Card";
import Button from "../../ui/Button";

const AdminExamCard = ({ exam, actions = [] }) => {
  return (
    <Card className="space-y-3 animate-fade-in">
      <div>
        <h3 className="font-semibold text-gray-900">
          {exam.title}
        </h3>
        <p className="text-xs text-gray-500">
          ₹{exam.price} • {exam.duration} min
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {actions.map((a, i) => (
          <Button
            key={i}
            size="sm"
            variant={a.variant}
            onClick={a.onClick}
          >
            {a.label}
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default AdminExamCard;
