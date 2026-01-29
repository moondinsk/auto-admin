import { observer } from "mobx-react-lite";
import { userStore } from "@/store";
import { useState } from "react";
import { getUsersApi } from "@/api";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // getUsersApi().then(setUsers);
  }, []);

  return <></>;
}

export default observer(Users);
