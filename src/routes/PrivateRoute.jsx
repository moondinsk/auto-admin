import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";

const PrivateRoute = observer(({ children }) => {
  const { userStore } = useStore();
  if (!userStore.isLogin) {
    return <Navigate to="/login" replace />;
  }

  if (!userStore.isAdmin) {
    return <Navigate to="/403" replace />;
  }

  return children;
});

export default PrivateRoute;
