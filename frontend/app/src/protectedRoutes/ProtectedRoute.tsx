import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();

  return currentUser ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
