import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Auth Views
import LoginView from '@/views/auth/LoginView.vue';
import RegisterView from '@/views/auth/RegisterView.vue';

// Dashboard Views
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import DashboardView from '@/views/dashboard/DashboardView.vue';
import ProductsView from '@/views/dashboard/ProductsView.vue';
import OrdersView from '@/views/dashboard/OrdersView.vue';
import CartView from '@/views/dashboard/CartView.vue';

const routes = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: { guest: true },
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterView,
        meta: { guest: true },
    },
    {
        path: '/',
        component: DashboardLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: 'dashboard',
                name: 'dashboard',
                component: DashboardView,
            },
            {
                path: 'products',
                name: 'products',
                component: ProductsView,
            },
            {
                path: 'orders',
                name: 'orders',
                component: OrdersView,
            },
            {
                path: 'cart',
                name: 'cart',
                component: CartView,
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation guards
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login');
    } else if (to.meta.guest && authStore.isAuthenticated) {
        next('/dashboard');
    } else {
        next();
    }
});

export default router;
