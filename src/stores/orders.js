import { defineStore } from 'pinia';
import api from '@/api/axios';

export const useOrdersStore = defineStore('orders', {
    state: () => ({
        orders: [],
        order: null,
        pagination: null,
        loading: false,
        error: null,
    }),

    getters: {
        totalOrders: (state) => state.pagination?.total || 0,
    },

    actions: {
        async fetchOrders(page = 1) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.get(`/orders?page=${page}`);
                this.orders = response.data.data.data;
                this.pagination = response.data.data.meta;
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch orders';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchOrder(id) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.get(`/orders/${id}`);
                this.order = response.data.data;
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch order';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async createOrder(orderData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.post('/orders', orderData);
                this.orders.unshift(response.data.data);
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to create order';
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
});
