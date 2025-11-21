import { defineStore } from 'pinia';
import api from '@/api/axios';

export const useCartStore = defineStore('cart', {
    state: () => ({
        cart: null,
        items: [],
        loading: false,
        error: null,
    }),

    getters: {
        itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
        cartTotal: (state) => state.cart?.total || 0,
    },

    actions: {
        async fetchCart() {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.get('/cart');
                this.cart = response.data.data;
                this.items = response.data.data.items || [];
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch cart';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async addItem(productId, quantity = 1) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.post('/cart/items', {
                    product_id: productId,
                    quantity,
                });
                this.cart = response.data.data;
                this.items = response.data.data.items || [];
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to add item';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateItem(itemId, productId, quantity) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.put(`/cart/items/${itemId}`, {
                    product_id: productId,
                    quantity,
                });
                this.cart = response.data.data;
                this.items = response.data.data.items || [];
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to update item';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async removeItem(itemId) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.delete(`/cart/items/${itemId}`);
                this.cart = response.data.data;
                this.items = response.data.data.items || [];
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to remove item';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async clearCart() {
            this.loading = true;
            this.error = null;
            try {
                await api.delete('/cart');
                this.cart = null;
                this.items = [];
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to clear cart';
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
});
