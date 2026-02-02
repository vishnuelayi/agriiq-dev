import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import Button from "../ui/Button";

const AdminTopbar = ({ title }) => {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-gray-900">
        {title}
      </h2>

      <Button variant="danger" onClick={handleLogout}>
        Logout
      </Button>
    </header>
  );
};

export default AdminTopbar;
