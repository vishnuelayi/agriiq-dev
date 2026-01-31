import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

const CreateExam = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(0);
  const [price, setPrice] = useState(0);

  const [maxReattempts, setMaxReattempts] = useState(1);

  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!title || duration <= 0) return;

    const docRef = await addDoc(collection(db, "exams"), {
      title,
      description,
      duration,
      price,
      maxReattempts,
      status: "draft",
      createdAt: serverTimestamp(),
    });

    navigate(`/admin/exams/${docRef.id}/questions`);
  };

  return (
    <div className="p-4 space-y-3">
      <h1 className="font-bold text-lg">Create Exam</h1>

      <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <input
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Duration (mins)"
        onChange={(e) => setDuration(+e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        onChange={(e) => setPrice(+e.target.value)}
      />
      <input
        type="number"
        min={1}
        placeholder="Max Reattempts"
        onChange={(e) => setMaxReattempts(+e.target.value)}
      />

      <button onClick={handleCreate}>Create & Add Questions</button>
    </div>
  );
};

export default CreateExam;
