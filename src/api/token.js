import Cookies from "js-cookie";

export const getToken = () => {
    try {
        return Cookies.get(import.meta.env.VITE_COOKIES_NAME);
    } catch (e) {
        console.error("토큰 파싱 실패:", e);
        return null;
    }
}