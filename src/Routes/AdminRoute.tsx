import { useAppSelector } from "../app/hooks/redux-hooks";
import { getIsAdmin } from "../features/auth/authSlice";
import { Navigate, useLocation } from "react-router-dom";

interface hasChildren {
  children: JSX.Element;
}

const AdminRoute = ({ children }: hasChildren) => {
  const location = useLocation();
  const isAdmin = useAppSelector(getIsAdmin);

  return isAdmin ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default AdminRoute;
