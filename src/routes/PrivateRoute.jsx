import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { userStore } from "@/store";

function PrivateRoute({ children }) {
  if (!userStore.isLogin) {
    return <Navigate to="/login" replace />;
  }

  if (!userStore.isAdmin) {
    return <Navigate to="/403" replace />;
  }

  return children;
}

export default observer(PrivateRoute);
