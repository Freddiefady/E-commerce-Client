# E-Commerce Dashboard (Vue.js)

A modern Vue.js 3 dashboard for managing an e-commerce platform. This frontend connects to the Laravel E-Commerce API.

## Features

- 🔐 Authentication (Login/Register with JWT)
- 📊 Dashboard with statistics
- 📦 Products Management (CRUD)
- 🛒 Shopping Cart
- 📋 Orders Management
- 🎨 Tailwind CSS styling
- 🔄 Pinia State Management

## Requirements

- Node.js >= 18
- npm >= 9
- E-Commerce API running on `http://localhost:8000`

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Freddiefady/E-commerce-Client.git
cd e-commerce-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure API URL (Optional)

The API URL is configured in `src/api/axios.js`. Default is `http://localhost:8000/api`. If you use Herd change to name server like `e-commerce-test/api`

```javascript
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    // ...
});
```

## Running the Application

### Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── api/
│   └── axios.js          # Axios instance with interceptors
├── components/
│   ├── AppHeader.vue     # Navigation header
│   ├── AppSidebar.vue    # Dashboard sidebar
│   └── ...
├── layouts/
│   ├── AuthLayout.vue    # Layout for auth pages
│   └── DashboardLayout.vue # Layout for dashboard
├── router/
│   └── index.js          # Vue Router configuration
├── stores/
│   ├── auth.js           # Authentication store
│   ├── cart.js           # Shopping cart store
│   ├── orders.js         # Orders store
│   └── products.js       # Products store
├── views/
│   ├── auth/
│   │   ├── LoginView.vue
│   │   └── RegisterView.vue
│   └── dashboard/
│       ├── DashboardView.vue
│       ├── ProductsView.vue
│       ├── CartView.vue
│       └── OrdersView.vue
├── App.vue
└── main.js
```

## Pages

### Authentication

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | User login form |
| Register | `/register` | User registration form |

### Dashboard (Protected)

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/` | Statistics overview |
| Products | `/products` | Products CRUD table |
| Cart | `/cart` | Shopping cart management |
| Orders | `/orders` | Orders list and details |

## Environment Variables (Optional)

Create a `.env` file for environment-specific configuration:

```env
VITE_API_URL=http://localhost:8000/api
```

Then use in code:

```javascript
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
});
```

## Tech Stack

- **Vue.js 3** - Progressive JavaScript Framework
- **Vite** - Next Generation Frontend Tooling
- **Pinia** - State Management
- **Vue Router** - Official Router
- **Axios** - HTTP Client
- **Tailwind CSS** - Utility-First CSS Framework

## License

MIT License
