import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";

const PrivateRoute = () => {
  const auth = useAuth();
  return (auth.checkIfLoggedIn()) ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
