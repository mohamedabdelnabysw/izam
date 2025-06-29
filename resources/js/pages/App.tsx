import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import Layout from '../components/Layout';
import ProductsPage from './ProductsPage';
import LoginPage from './LoginPage';
import OrderDetailsPage from './OrderDetailsPage';
import CartPage from './CartPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} />
            <Route path="/cart" element={<CartPage />} />
            {/* Add more routes as needed */}
          </Routes>
        </Layout>
      </CartProvider>
    </AuthProvider>
  );
};

export default App; 