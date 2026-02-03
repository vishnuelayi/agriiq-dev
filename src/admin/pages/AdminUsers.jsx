import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import SkeletonCard from "../../ui/SkeletonCard";
import { fetchAllUsers, toggleUserBlock } from "../../services/userService";
import { toast } from "sonner";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchAllUsers();
      setUsers(data.filter((u) => u.role !== "admin"));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleBlock = async (user) => {
    try {
      await toggleUserBlock(user.id, !user.blocked);
      toast.success(
        user.blocked ? "User unblocked" : "User blocked"
      );
      loadUsers();
    } catch (err) {
      console.error(err);
      toast.error("Action failed");
    }
  };

  return (
    <AdminLayout title="Users">
      <section className="space-y-3">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}

        {!loading && users.length === 0 && (
          <Card>
            <p className="text-sm text-gray-500">
              No users found
            </p>
          </Card>
        )}

        {!loading &&
          users.map((user) => (
            <Card
              key={user.id}
              className="flex items-center justify-between"
            >
              <div className="space-y-1">
                <p className="font-medium text-sm">
                  {user.phone}
                </p>
                <p className="text-xs text-gray-500">
                  Joined{" "}
                  {user.createdAt?.toDate
                    ? user.createdAt
                        .toDate()
                        .toLocaleDateString()
                    : "—"}
                </p>
              </div>

              <Button
                size="sm"
                variant={user.blocked ? "primary" : "danger"}
                onClick={() => handleToggleBlock(user)}
              >
                {user.blocked ? "Unblock" : "Block"}
              </Button>
            </Card>
          ))}
      </section>
    </AdminLayout>
  );
};

export default AdminUsers;
