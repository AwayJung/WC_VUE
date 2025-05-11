// src/store/auth.js
import { login } from '@/api/login.js';
import loginApi from '@/api/login.js';

const state = {
    accessToken: null,
    refreshToken: null,
    user: null,
    isAuthenticated: false
};

const getters = {
    isAuthenticated: state => !!state.accessToken,
    currentUser: state => state.user
};

const actions = {
    // 로그인 액션
    async login({ commit }, credentials) {
        try {
            const response = await login({
                loginEmail: credentials.email,
                password: credentials.password
            });

            // API 응답 구조에 맞게 데이터 추출
            const { data } = response.data;

            if (data) {
                // Vuex에 인증 정보 저장
                commit('SET_AUTH_DATA', {
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    user: {
                        name: data.name,
                        loginEmail: data.loginEmail,
                        // 기타 필요한 사용자 정보
                    }
                });
                return Promise.resolve(data);
            }
        } catch (error) {
            return Promise.reject(error);
        }
    },

    // 로그아웃 액션
    async logout({ commit }) {
        try {
            // Axios 인스턴스(loginApi)에 등록된
            // 요청 인터셉터가 Authorization 헤더를 자동으로 추가함
            await loginApi.post('/api/users/logout');
        } catch (e) {
            // 네트워크 에러여도 무시하고 클라이언트 토큰은 반드시 제거
        }
        // 1) 메모리 초기화
        commit('CLEAR_AUTH_DATA');

        // 2) vuex-persistedstate 기본 키(vuex)를 삭제해 로컬스토리지 초기화
        localStorage.removeItem('vuex');
    },

    // 토큰 갱신 액션
    async refreshToken({ commit, state }) {
        try {
            const response = await loginApi.post('/api/users/refresh', {}, {
                headers: {
                    'refreshToken': state.refreshToken
                }
            });

            const { data } = response.data;

            if (data) {
                commit('UPDATE_TOKENS', {
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken
                });
                return Promise.resolve(data);
            }
        } catch (error) {
            // 갱신 실패시 로그아웃 처리
            commit('CLEAR_AUTH_DATA');
            return Promise.reject(error);
        }
    }
};

const mutations = {
    SET_AUTH_DATA(state, { accessToken, refreshToken, user }) {
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.user = user;
        state.isAuthenticated = true;
    },

    UPDATE_TOKENS(state, { accessToken, refreshToken }) {
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
    },

    CLEAR_AUTH_DATA(state) {
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
        state.isAuthenticated = false;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};