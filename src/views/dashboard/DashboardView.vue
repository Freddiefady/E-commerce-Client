<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Products -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-gray-500 text-sm">Total Products</p>
            <p class="text-2xl font-bold text-gray-800">{{ stats.totalProducts }}</p>
          </div>
        </div>
      </div>

      <!-- Total Orders -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-gray-500 text-sm">Total Orders</p>
            <p class="text-2xl font-bold text-gray-800">{{ stats.totalOrders }}</p>
          </div>
        </div>
      </div>

      <!-- Cart Items -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-gray-500 text-sm">Cart Items</p>
            <p class="text-2xl font-bold text-gray-800">{{ cartStore.itemCount }}</p>
          </div>
        </div>
      </div>

      <!-- Welcome -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 text-purple-600">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-gray-500 text-sm">Welcome</p>
            <p class="text-lg font-bold text-gray-800">{{ authStore.user?.name }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="mt-8 text-center text-gray-500">
      Loading statistics...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useProductsStore } from '@/stores/products';
import { useOrdersStore } from '@/stores/orders';
import { useCartStore } from '@/stores/cart';

const authStore = useAuthStore();
const productsStore = useProductsStore();
const ordersStore = useOrdersStore();
const cartStore = useCartStore();

const loading = ref(true);
const stats = ref({
  totalProducts: 0,
  totalOrders: 0,
});

onMounted(async () => {
  try {
    await Promise.all([
      productsStore.fetchProducts(),
      ordersStore.fetchOrders(),
    ]);
    stats.value.totalProducts = productsStore.totalProducts;
    stats.value.totalOrders = ordersStore.totalOrders;
  } catch (error) {
    console.error('Failed to load stats:', error);
  } finally {
    loading.value = false;
  }
});
</script>
