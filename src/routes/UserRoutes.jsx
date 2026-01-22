import useAuth from "../hooks/useAuth";
import UserOtpLogin from "../auth/UserOtpLogin";
import UserDashboard from "../users/UserDashboard";

const UserRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <UserOtpLogin />;
  }

  return <UserDashboard />;
};

export default UserRoutes;
