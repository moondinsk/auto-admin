import axios from "axios";
import {getToken} from "@/api/token.js";
import {getLoadingStore} from "@/store/loading/loadingStore.js";

let delayTimer = null;
const DELAY = 500;

// Axios 인스턴스 생성
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// 요청 인터셉터 설정
instance.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        getLoadingStore().startLoading();
        if (!delayTimer) {
            delayTimer = setTimeout(() => {
                getLoadingStore().setLoadingState(true);
            }, DELAY);
        }

        return config;
    },
    (error) => Promise.reject(error),
);

// 응답 인터셉터 설정

instance.interceptors.response.use(
    function (response) {
        getLoadingStore().setLoadingState(false);
        if (delayTimer) {
            clearTimeout(delayTimer);
            delayTimer = null;
        }
        return response;
    },
    function (error) {
        if (error.config) {
            getLoadingStore().setLoadingState(false);
            if (delayTimer) {
                clearTimeout(delayTimer);
                delayTimer = null;
            }
        }
        const res = error.response;
        let errorData = {
            code: error.code || "UNKNOWN",
            status: res?.status,
            message: error.message || "알 수 없는 오류입니다.",
        };
        if(res){
            if(res.status === 401){
                // error?status=401 만료된 토큰 에러 페이지로 보내기
            }
        }
        return Promise.reject(errorData);
    }
);

export default instance;
