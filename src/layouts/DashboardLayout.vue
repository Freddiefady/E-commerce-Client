<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navbar -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <span class="text-xl font-bold text-blue-600">E-Commerce</span>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link
                to="/dashboard"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="isActive('/dashboard') ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
              >
                Dashboard
              </router-link>
              <router-link
                to="/products"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="isActive('/products') ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
              >
                Products
              </router-link>
              <router-link
                to="/orders"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="isActive('/orders') ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
              >
                Orders
              </router-link>
              <router-link
                to="/cart"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="isActive('/cart') ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
              >
                Cart
                <span v-if="cartStore.itemCount > 0" class="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {{ cartStore.itemCount }}
                </span>
              </router-link>
            </div>
          </div>
          <div class="flex items-center">
            <span class="text-gray-700 mr-4">{{ authStore.user?.name }}</span>
            <button
              @click="handleLogout"
              class="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Page Content -->
    <main class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { onMounted } from 'vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const cartStore = useCartStore();

onMounted(() => {
  cartStore.fetchCart();
});

const isActive = (path) => {
  return route.path === path;
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>
