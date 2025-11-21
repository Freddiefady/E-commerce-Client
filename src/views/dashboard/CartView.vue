<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Shopping Cart</h1>

    <!-- Loading -->
    <div v-if="cartStore.loading" class="text-center py-8">
      Loading cart...
    </div>

    <!-- Cart Items -->
    <div v-else-if="cartStore.items.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Items List -->
      <div class="lg:col-span-2">
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in cartStore.items" :key="item.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ item.product.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${{ item.product.price }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="updateQuantity(item, item.quantity - 1)"
                      :disabled="item.quantity <= 1"
                      class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span class="px-2">{{ item.quantity }}</span>
                    <button
                      @click="updateQuantity(item, item.quantity + 1)"
                      class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${{ (item.product.price * item.quantity).toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    @click="removeItem(item.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4">
          <button
            @click="clearCart"
            class="text-red-600 hover:text-red-900"
          >
            Clear Cart
          </button>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-bold mb-4">Order Summary</h2>

          <div class="space-y-2 mb-4">
            <div class="flex justify-between">
              <span class="text-gray-600">Items ({{ cartStore.itemCount }})</span>
              <span>${{ cartStore.cartTotal.toFixed(2) }}</span>
            </div>
          </div>

          <div class="border-t pt-4 mb-4">
            <div class="flex justify-between font-bold">
              <span>Total</span>
              <span>${{ cartStore.cartTotal.toFixed(2) }}</span>
            </div>
          </div>

          <button
            @click="showCheckoutModal = true"
            class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>

    <!-- Empty Cart -->
    <div v-else class="text-center py-8">
      <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
      </svg>
      <p class="text-gray-500">Your cart is empty</p>
      <router-link to="/products" class="mt-4 inline-block text-blue-500 hover:underline">
        Browse Products
      </router-link>
    </div>

    <!-- Checkout Modal -->
    <div v-if="showCheckoutModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Checkout</h2>

        <form @submit.prevent="handleCheckout">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Delivery Address</label>
            <textarea
              v-model="checkoutForm.address"
              required
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your delivery address"
            ></textarea>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
            <input
              v-model="checkoutForm.phone"
              type="tel"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number"
            />
          </div>

          <div class="border-t pt-4 mb-4">
            <div class="flex justify-between font-bold">
              <span>Total</span>
              <span>${{ cartStore.cartTotal.toFixed(2) }}</span>
            </div>
          </div>

          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="showCheckoutModal = false"
              class="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {{ submitting ? 'Placing Order...' : 'Place Order' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Order Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="text-xl font-bold mb-2">Order Placed Successfully!</h2>
        <p class="text-gray-600 mb-4">Order #: {{ orderNumber }}</p>
        <button
          @click="goToOrders"
          class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          View Orders
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useOrdersStore } from '@/stores/orders';

const router = useRouter();
const cartStore = useCartStore();
const ordersStore = useOrdersStore();

const showCheckoutModal = ref(false);
const showSuccessModal = ref(false);
const submitting = ref(false);
const orderNumber = ref('');

const checkoutForm = reactive({
  address: '',
  phone: '',
});

onMounted(() => {
  cartStore.fetchCart();
});

const updateQuantity = async (item, newQuantity) => {
  if (newQuantity < 1) return;
  try {
    await cartStore.updateItem(item.id, item.product.id, newQuantity);
  } catch (error) {
    alert(error.response?.data?.message || 'Failed to update quantity');
  }
};

const removeItem = async (itemId) => {
  try {
    await cartStore.removeItem(itemId);
  } catch (error) {
    alert(error.response?.data?.message || 'Failed to remove item');
  }
};

const clearCart = async () => {
  if (confirm('Are you sure you want to clear your cart?')) {
    try {
      await cartStore.clearCart();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to clear cart');
    }
  }
};

const handleCheckout = async () => {
  submitting.value = true;
  try {
    const response = await ordersStore.createOrder({
      address: checkoutForm.address,
      phone: checkoutForm.phone,
    });
    orderNumber.value = response.data.order_number;
    showCheckoutModal.value = false;
    showSuccessModal.value = true;
    await cartStore.fetchCart();
  } catch (error) {
    alert(error.response?.data?.message || 'Failed to place order');
  } finally {
    submitting.value = false;
  }
};

const goToOrders = () => {
  showSuccessModal.value = false;
  router.push('/orders');
};
</script>
