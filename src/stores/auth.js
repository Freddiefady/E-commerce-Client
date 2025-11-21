import { defineStore } from 'pinia';
import api from '@/api/axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        getUser: (state) => state.user,
    },

    actions: {
        async register(name, email, password, password_confirmation) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.post('/auth/register', {
                    name,
                    email,
                    password,
                    password_confirmation,
                });
                const { token, user } = response.data.data;
                this.setAuth(token, user);
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Registration failed';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async login(email, password) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.post('/auth/login', { email, password });
                const { token, user } = response.data.data;
                this.setAuth(token, user);
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Login failed';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async logout() {
            try {
                await api.post('/auth/logout');
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                this.clearAuth();
            }
        },

        async fetchUser() {
            try {
                const response = await api.get('/auth/me');
                this.user = response.data.data;
                localStorage.setItem('user', JSON.stringify(this.user));
                return this.user;
            } catch (error) {
                this.clearAuth();
                throw error;
            }
        },

        setAuth(token, user) {
            this.token = token;
            this.user = user;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        },

        clearAuth() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
    },
});
