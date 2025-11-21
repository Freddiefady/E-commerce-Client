import { defineStore } from 'pinia';
import api from '@/api/axios';

export const useProductsStore = defineStore('products', {
    state: () => ({
        products: [],
        product: null,
        pagination: null,
        loading: false,
        error: null,
    }),

    getters: {
        totalProducts: (state) => state.pagination?.total || 0,
    },

    actions: {
        async fetchProducts(page = 1) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.get(`/products?page=${page}`);
                this.products = response.data.data.data;
                this.pagination = response.data.data.meta;
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch products';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchProduct(id) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.get(`/products/${id}`);
                this.product = response.data.data;
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch product';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async createProduct(productData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.post('/products', productData);
                this.products.unshift(response.data.data);
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to create product';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateProduct(id, productData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.put(`/products/${id}`, productData);
                const index = this.products.findIndex(p => p.id === id);
                if (index !== -1) {
                    this.products[index] = response.data.data;
                }
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to update product';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteProduct(id) {
            this.loading = true;
            this.error = null;
            try {
                await api.delete(`/products/${id}`);
                this.products = this.products.filter(p => p.id !== id);
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to delete product';
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
});
