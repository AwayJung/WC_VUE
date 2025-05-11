import axios from 'axios';
import store from '@/store';
import router from '@/router';

const loginApi = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        "Content-Type": "application/json",
    },
});

export const login = (loginData) => {
    return loginApi.post("/api/users/login", loginData);
};

// 요청 인터셉터 - 모든 요청에 토큰 추가
loginApi.interceptors.request.use(
    config => {
        const token = store.state.auth.accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 - 토큰 만료 처리
loginApi.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // 401 오류이고, 토큰 만료이며, 재시도하지 않은 요청일 경우
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // 토큰 갱신 시도
                await store.dispatch('auth/refreshToken');

                // 토큰 갱신 성공 시 원래 요청 재시도
                originalRequest.headers.Authorization = `Bearer ${store.state.auth.accessToken}`;
                return loginApi(originalRequest);
            } catch (refreshError) {
                // 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
                store.dispatch('auth/logout');

                // 현재 경로가 로그인 페이지가 아닐 때만 리디렉션
                if (router.currentRoute.path !== '/login') {
                    router.push('/login').catch(err => {
                        if (err.name !== 'NavigationDuplicated') {
                            console.error(err);
                        }
                    });
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

/**
 * 사용자 로그아웃
 * @returns {Promise} 로그아웃 요청 결과
 */
export const logout = async () => {
    try {
        // 1) 서버에 로그아웃 요청
        await loginApi.post('/api/users/logout');

        // 2) 스토어에 저장된 토큰 삭제
        store.dispatch('auth/logout');
        // (auth/logout 액션 안에서 accessToken, refreshToken 등을 초기화하도록 구현)

        // 3) 로그인 페이지로 이동
        if (router.currentRoute.path !== '/login') {
            router.replace('/login').catch(err => {
                if (err.name !== 'NavigationDuplicated') {
                    console.error(err);
                }
            });
        }
    } catch (err) {
        console.error('로그아웃 실패:', err);
        throw err;
    }
};

export default loginApi;