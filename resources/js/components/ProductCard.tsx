import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Badge,
} from '@mui/material';
import { Add, Remove, ShoppingCart } from '@mui/icons-material';
import { Product } from '../types/api';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { getItemQuantity, updateQuantity, addToCart, removeFromCart } = useCart();
  const quantityInCart = getItemQuantity(product.id);

  // Determine product badges based on product data
  const getProductBadges = () => {
    const badges = [];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const createdAt = new Date(product.created_at);
    if (createdAt > thirtyDaysAgo) {
      badges.push({ label: 'New', color: '#10b981', bgColor: '#d1fae5' });
    }
    if (product.price < 50) {
      badges.push({ label: 'Sale', color: '#ef4444', bgColor: '#fee2e2' });
    }
    if (product.quantity > 100) {
      badges.push({ label: 'Popular', color: '#f59e0b', bgColor: '#fef3c7' });
    }
    return badges;
  };
  const badges = getProductBadges();

  const handleQtyChange = (newQty: number) => {
    if (newQty < 1) {
      removeFromCart(product.id);
      return;
    }
    if (newQty > product.quantity) return;
    if (quantityInCart > 0) {
      updateQuantity(product.id, newQty);
    } else {
      addToCart(product, newQty);
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: '#fff',
      }}
    >
      {/* Product Image */}
      <Box sx={{ position: 'relative' }}>
        {product.image_url ? (
          <CardMedia
            component="img"
            height="200"
            image={product.image_url}
            alt={product.name}
            sx={{ objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              height: 200,
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShoppingCart sx={{ fontSize: 48, color: '#ccc' }} />
          </Box>
        )}
        {/* Quantity Badge */}
        {quantityInCart > 0 && (
          <Badge
            badgeContent={quantityInCart}
            color="primary"
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              zIndex: 2,
              '& .MuiBadge-badge': {
                fontSize: '1.1rem',
                width: 36,
                height: 36,
                borderRadius: '50%',
                boxShadow: 2,
              },
            }}
          />
        )}
        {/* Product Badges */}
        <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {badges.map((badge, index) => (
            <Chip
              key={index}
              label={badge.label}
              size="small"
              sx={{
                backgroundColor: badge.bgColor,
                color: badge.color,
                fontWeight: 'bold',
                fontSize: '0.7rem',
                height: '20px',
                '& .MuiChip-label': {
                  px: 1,
                },
              }}
            />
          ))}
        </Box>
        {/* Category Badge */}
        <Chip
          label={product.category.name}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 'medium',
            fontSize: '0.7rem',
          }}
        />
      </Box>
      {/* Product Content */}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        {/* Product Name */}
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            fontSize: '1.1rem',
            lineHeight: 1.3,
            mb: 1,
          }}
        >
          {product.name}
        </Typography>
        {/* Category and Stock Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Chip
            label={product.category.name}
            size="small"
            sx={{ fontWeight: 500, fontSize: '0.8rem', background: '#f3f3f3' }}
          />
          <Typography variant="body2" color="#888" sx={{ ml: 1 }}>
            Stock: {product.quantity}
          </Typography>
        </Box>
        {/* Price */}
        <Typography 
          variant="h5" 
          sx={{ fontWeight: 'bold', mb: 2, fontSize: '1.25rem' }}
        >
          ${product.price}
        </Typography>
        {/* Quantity Selector */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0, mb: 2, background: '#f8f8fa', borderRadius: 2, width: 'fit-content', px: 1 }}>
          <IconButton
            size="small"
            onClick={() => handleQtyChange((quantityInCart || 0) - 1)}
            disabled={!quantityInCart || quantityInCart <= 1}
            sx={{ borderRadius: 2, color: '#888' }}
          >
            <Remove />
          </IconButton>
          <Typography sx={{ mx: 2, minWidth: 20, textAlign: 'center', fontWeight: 500 }}>{quantityInCart || 1}</Typography>
          <IconButton
            size="small"
            onClick={() => handleQtyChange((quantityInCart || 0) + 1)}
            disabled={quantityInCart >= product.quantity}
            sx={{ borderRadius: 2, color: '#888' }}
          >
            <Add />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard; 