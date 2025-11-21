<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Products</h1>
      <button
        @click="openCreateModal"
        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Add Product
      </button>
    </div>

    <!-- Loading -->
    <div v-if="productsStore.loading" class="text-center py-8">
      Loading products...
    </div>

    <!-- Products Table -->
    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="product in productsStore.products" :key="product.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${{ product.price }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.available_in_stock }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="product.stock_status === 'in_stock' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                class="px-2 py-1 text-xs font-medium rounded-full"
              >
                {{ product.stock_status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
              <button
                @click="openEditModal(product)"
                class="text-blue-600 hover:text-blue-900"
              >
                Edit
              </button>
              <button
                @click="handleDelete(product.id)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
              <button
                @click="addToCart(product.id)"
                class="text-green-600 hover:text-green-900"
              >
                Add to Cart
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="!productsStore.loading && productsStore.products.length === 0" class="text-center py-8 text-gray-500">
      No products found.
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">{{ isEditing ? 'Edit Product' : 'Add Product' }}</h2>

        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Small Description</label>
            <input
              v-model="form.small_description"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Description</label>
            <textarea
              v-model="form.description"
              required
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2">Price</label>
              <input
                v-model="form.price"
                type="number"
                step="0.01"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2">Stock</label>
              <input
                v-model="form.available_in_stock"
                type="number"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">SKU</label>
            <input
              v-model="form.sku"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {{ submitting ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useProductsStore } from '@/stores/products';
import { useCartStore } from '@/stores/cart';

const productsStore = useProductsStore();
const cartStore = useCartStore();

const showModal = ref(false);
const isEditing = ref(false);
const submitting = ref(false);
const editingId = ref(null);

const form = reactive({
  name: '',
  small_description: '',
  description: '',
  price: '',
  available_in_stock: '',
  sku: '',
  quantity: 1,
  status: true,
});

onMounted(() => {
  productsStore.fetchProducts();
});

const resetForm = () => {
  form.name = '';
  form.small_description = '';
  form.description = '';
  form.price = '';
  form.available_in_stock = '';
  form.sku = '';
  form.quantity = 1;
  form.status = true;
};

const openCreateModal = () => {
  isEditing.value = false;
  editingId.value = null;
  resetForm();
  showModal.value = true;
};

const openEditModal = (product) => {
  isEditing.value = true;
  editingId.value = product.id;
  form.name = product.name;
  form.small_description = product.small_description;
  form.description = product.description;
  form.price = product.price;
  form.available_in_stock = product.available_in_stock;
  form.sku = product.sku;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const handleSubmit = async () => {
  submitting.value = true;
  try {
    if (isEditing.value) {
      await productsStore.updateProduct(editingId.value, { ...form });
    } else {
      await productsStore.createProduct({ ...form });
    }
    closeModal();
    productsStore.fetchProducts();
  } catch (error) {
    alert(error.response?.data?.message || 'Failed to save product');
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await productsStore.deleteProduct(id);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete product');
    }
  }
};

const addToCart = async (productId) => {
  try {
    await cartStore.addItem(productId, 1);
    alert('Product added to cart!');
  } catch (error) {
    alert(error.response?.data?.message || 'Failed to add to cart');
  }
};
</script>
