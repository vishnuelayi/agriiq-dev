import { useParams } from "react-router-dom";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";

const ManageQuestions = () => {
  const { examId } = useParams();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState(0);

  const addQuestion = async () => {
    if (!question) return;

    await addDoc(collection(db, "questions", examId, "items"), {
      question,
      options,
      correctOption,
    });

    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectOption(0);
  };

  return (
    <div className="p-4 space-y-3">
      <h2 className="font-bold">Add Question</h2>

      <input placeholder="Question" value={question} onChange={(e) => setQuestion(e.target.value)} />

      {options.map((opt, i) => (
        <input
          key={i}
          placeholder={`Option ${i + 1}`}
          value={opt}
          onChange={(e) => {
            const copy = [...options];
            copy[i] = e.target.value;
            setOptions(copy);
          }}
        />
      ))}

      <select value={correctOption} onChange={(e) => setCorrectOption(+e.target.value)}>
        <option value={0}>Option 1</option>
        <option value={1}>Option 2</option>
        <option value={2}>Option 3</option>
        <option value={3}>Option 4</option>
      </select>

      <button onClick={addQuestion}>Add Question</button>
    </div>
  );
};

export default ManageQuestions;
