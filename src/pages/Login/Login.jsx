import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { userStore } from "@/store";
import { loginApi } from "@/api";

function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    // try {
    //   const user = await loginApi({
    //     id: "admin",
    //     password: "1234",
    //   });
    //   userStore.login(user);
    //   navigate("/", { replace: true });
    // } catch (e) {
    //   alert("로그인 실패");
    // }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Login</h1>
      <p>관리자 계정으로 로그인하세요.</p>

      <button onClick={handleLogin}>로그인</button>
    </div>
  );
}

export default observer(Login);
