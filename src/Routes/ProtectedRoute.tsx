import { useAppSelector } from "../app/hooks/redux-hooks";
import { getIsLogged } from "../features/auth/authSlice";
import { Navigate, useLocation } from "react-router-dom";

interface hasChildren {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: hasChildren) => {
  const location = useLocation();
  const canBelogged = useAppSelector(getIsLogged);

  return canBelogged ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default ProtectedRoute;
