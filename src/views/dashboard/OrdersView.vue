<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Orders</h1>

    <!-- Loading -->
    <div v-if="ordersStore.loading" class="text-center py-8">
      Loading orders...
    </div>

    <!-- Orders Table -->
    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in ordersStore.orders" :key="order.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ order.order_number }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(order.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="getStatusClass(order.status)"
                class="px-2 py-1 text-xs font-medium rounded-full"
              >
                {{ order.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              ${{ order.total }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <button
                @click="viewOrderDetails(order)"
                class="text-blue-600 hover:text-blue-900"
              >
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="!ordersStore.loading && ordersStore.orders.length === 0" class="text-center py-8 text-gray-500">
      No orders found.
    </div>

    <!-- Order Details Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Order Details</h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div v-if="selectedOrder" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">Order Number</p>
              <p class="font-medium">{{ selectedOrder.order_number }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Status</p>
              <span
                :class="getStatusClass(selectedOrder.status)"
                class="px-2 py-1 text-xs font-medium rounded-full"
              >
                {{ selectedOrder.status }}
              </span>
            </div>
            <div>
              <p class="text-sm text-gray-500">Address</p>
              <p class="font-medium">{{ selectedOrder.address }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Phone</p>
              <p class="font-medium">{{ selectedOrder.phone }}</p>
            </div>
          </div>

          <div class="border-t pt-4">
            <h3 class="font-bold mb-2">Items</h3>
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="item in selectedOrder.items" :key="item.id">
                  <td class="px-4 py-2 text-sm">{{ item.product_name }}</td>
                  <td class="px-4 py-2 text-sm">{{ item.quantity }}</td>
                  <td class="px-4 py-2 text-sm">${{ item.unit_price }}</td>
                  <td class="px-4 py-2 text-sm">${{ item.subtotal }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="border-t pt-4 text-right">
            <p class="text-lg font-bold">Total: ${{ selectedOrder.total }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useOrdersStore } from '@/stores/orders';

const ordersStore = useOrdersStore();
const showModal = ref(false);
const selectedOrder = ref(null);

onMounted(() => {
  ordersStore.fetchOrders();
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const viewOrderDetails = async (order) => {
  try {
    await ordersStore.fetchOrder(order.id);
    selectedOrder.value = ordersStore.order;
    showModal.value = true;
  } catch (error) {
    alert('Failed to load order details');
  }
};

const closeModal = () => {
  showModal.value = false;
  selectedOrder.value = null;
};
</script>
