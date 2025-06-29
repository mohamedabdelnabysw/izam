import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { useCart } from '../contexts/CartContext';
import OrderSummary from '../components/OrderSummary';

const CartPage: React.FC = () => {
  const { items } = useCart();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fff', width: '100vw', p: 0 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'flex-start',
          width: '100%',
          minHeight: '100vh',
          gap: { xs: 3, md: 4 },
          background: 'transparent',
          px: { xs: 1, md: 4 },
          pt: { xs: 2, md: 4 },
        }}
      >
        {/* Cart Items */}
        <Box sx={{ flex: 1, width: '100%', background: '#fff', borderRadius: 3, boxShadow: 2, p: 4, minHeight: '80vh' }}>
          <Typography variant="h4" fontWeight="bold" mb={4}>
            Your cart
          </Typography>
          {items.length === 0 ? (
            <Typography variant="body1">Your cart is empty.</Typography>
          ) : (
            items.map((item) => (
              <Box key={item.product_id} display="flex" alignItems="center" mb={3} p={2} sx={{ border: '1px solid #eee', borderRadius: 2 }}>
                <img src={item.product.image_url} alt={item.product.name} style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, marginRight: 24 }} />
                <Box flex={1} minWidth={0}>
                  <Typography fontWeight={600} fontSize={18} mb={1}>{item.product.name}</Typography>
                  <Typography fontWeight={700} fontSize={16} mb={0.5}>${item.product.price}</Typography>
                  <Typography color="text.secondary" fontSize={14} mb={1}>Stock: {item.product.quantity}</Typography>
                  <Typography color="text.secondary" fontSize={14} mb={1}>Quantity: {item.quantity}</Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>
        {/* Order Summary */}
        <Box sx={{ flex: '0 0 380px', width: 380, ml: 0, background: '#fff', borderRadius: 3, boxShadow: 2, p: 0 }}>
          <OrderSummary />
        </Box>
      </Box>
    </Box>
  );
};

export default CartPage; 