import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  IconButton,
  Avatar,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const SHIPPING = 15;
const TAX = 12.5;

const OrderSummary: React.FC = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = getTotalPrice();
  const total = subtotal + SHIPPING + TAX;

  const handleCheckout = async () => {
    setError('');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      const orderData = {
        products: items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      };
      const order = await apiService.createOrder(orderData);
      clearCart();
      navigate(`/orders/${order.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      background: '#fff',
      borderRadius: 3,
      boxShadow: 1,
      p: 3,
      minWidth: 340,
      maxWidth: 380,
      mx: 'auto',
    }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Order Summary
      </Typography>
      {items.map((item) => (
        <Box key={item.product_id} display="flex" alignItems="center" mb={2}>
          <Avatar
            src={item.product.image_url}
            alt={item.product.name}
            variant="rounded"
            sx={{ width: 56, height: 56, mr: 2, borderRadius: 2 }}
          />
          <Box flex={1} minWidth={0}>
            <Typography fontWeight={500} noWrap>
              {item.product.name}
            </Typography>
            <Box display="flex" alignItems="center" mt={1}>
              <IconButton size="small" onClick={() => updateQuantity(item.product_id, item.quantity - 1)}>
                <Remove fontSize="small" />
              </IconButton>
              <Typography mx={1}>{item.quantity}</Typography>
              <IconButton size="small" onClick={() => updateQuantity(item.product_id, item.quantity + 1)}>
                <Add fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Box textAlign="right" ml={2}>
            <IconButton size="small" color="error" onClick={() => removeFromCart(item.product_id)}>
              <Delete />
            </IconButton>
            <Typography fontWeight={500} mt={1}>
              ${item.product.price}
            </Typography>
          </Box>
        </Box>
      ))}
      <Divider sx={{ my: 2 }} />
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography color="text.secondary">Subtotal</Typography>
        <Typography>${subtotal}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography color="text.secondary">Shipping</Typography>
        <Typography>${SHIPPING.toFixed(2)}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography color="text.secondary">Tax</Typography>
        <Typography>${TAX.toFixed(2)}</Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography fontWeight={700}>Total</Typography>
        <Typography fontWeight={700} fontSize="1.25rem">
          ${total.toFixed(2)}
        </Typography>
      </Box>
      {error && (
        <Typography color="error" mb={2}>{error}</Typography>
      )}
      <Button
        fullWidth
        variant="contained"
        sx={{
          background: '#000',
          color: '#fff',
          borderRadius: 2,
          fontWeight: 'bold',
          fontSize: '1rem',
          py: 1.5,
          boxShadow: 'none',
          '&:hover': { backgroundColor: '#222' },
        }}
        onClick={handleCheckout}
        disabled={loading || items.length === 0}
      >
        Proceed to Checkout
      </Button>
    </Box>
  );
};

export default OrderSummary; 