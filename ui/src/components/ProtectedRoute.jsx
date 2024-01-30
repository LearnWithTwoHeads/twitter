import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (isEmpty(user)) {
    return <Navigate to="/" />;
  }

  return children;
};

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
