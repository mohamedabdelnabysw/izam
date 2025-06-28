import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Pagination,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Add, Remove, Delete, ShoppingCart } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { Product, Category, ProductFilters } from '../types/api';
import ProductCard from '../components/ProductCard';
import ProductsHeader from '../components/ProductsHeader';
import SearchBar from '../components/SearchBar';
import SimpleBreadcrumbs from '../components/SimpleBreadcrumbs';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  
  // Filters state
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    min_price: undefined,
    max_price: undefined,
    category_id: [],
    per_page: 12,
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const { addToCart, items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await apiService.getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await apiService.getProducts({
          ...filters,
          per_page: 12,
        });
        setProducts(response.data);
        setTotalPages(response.pagination.last_page);
        setTotalItems(response.pagination.total);
        setCurrentPage(response.pagination.current_page);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error loading products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [filters]);

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      min_price: undefined,
      max_price: undefined,
      category_id: [],
      per_page: 12,
    });
    setCurrentPage(1);
  };

  const handleSearchChange = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setCurrentPage(1);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.min_price !== undefined || filters.max_price !== undefined) count++;
    if (filters.category_id && filters.category_id.length > 0) count++;
    return count;
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    if (isAuthenticated) {
      addToCart(product, quantity);
    } else {
      console.warn('User is not authenticated');
    }
  };

  const handleSubmitOrder = async () => {
    if (!isAuthenticated) {
      setError('Please login to place an order');
      setCartOpen(false);
      navigate('/login');
      return;
    }

    try {
      const orderData = {
        products: items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      };

      const order = await apiService.createOrder(orderData);
      clearCart();
      setCartOpen(false);
      navigate(`/orders/${order.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating order');
    }
  };

  if (loading && products.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ p: 3 }}>
        {/* Breadcrumbs */}
        <SimpleBreadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products' }
          ]}
        />

        {/* Search Bar */}
        <SearchBar
          value={filters.search ?? ''}
          onChange={handleSearchChange}
          placeholder="Search products by name, description, or category..."
        />

        {/* Results Header */}
        <ProductsHeader
          totalItems={totalItems}
          isMobile={isMobile}
          onToggleFilters={() => {}} // This is now handled in Layout
          activeFiltersCount={getActiveFiltersCount()}
          onCartClick={() => setCartOpen(true)}
        />

        {/* Products Grid */}
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(3, 1fr)',
              xl: 'repeat(3, 1fr)'
            },
            gap: 3,
            mt: 3
          }}
        >
          {products.map((product) => (
            <ProductCard 
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </Box>

        {/* No Products Message */}
        {!loading && products.length === 0 && (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 8,
              backgroundColor: '#fff',
              borderRadius: 2,
              mt: 3,
            }}
          >
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No products found
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Try adjusting your search or filter criteria
            </Typography>
          </Box>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, page) => setCurrentPage(page)}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        )}
      </Box>

      {/* Cart Dialog */}
      <Dialog open={cartOpen} onClose={() => setCartOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <ShoppingCart />
            Shopping Cart ({items.length} items)
          </Box>
        </DialogTitle>
        <DialogContent>
          {items.length === 0 ? (
            <Typography>Your cart is empty</Typography>
          ) : (
            <List>
              {items.map((item) => (
                <React.Fragment key={item.product_id}>
                  <ListItem>
                    <ListItemText
                      primary={item.product.name}
                      secondary={`$${item.product.price} each`}
                    />
                    <ListItemSecondaryAction>
                      <Box display="flex" alignItems="center" gap={1}>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        >
                          <Remove />
                        </IconButton>
                        <Typography>{item.quantity}</Typography>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        >
                          <Add />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => removeFromCart(item.product_id)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
          
          {items.length > 0 && (
            <Box mt={2}>
              <Typography variant="h6">
                Total: ${getTotalPrice().toFixed(2)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCartOpen(false)}>Continue Shopping</Button>
          {items.length > 0 && (
            <>
              <Button onClick={clearCart} color="error">
                Clear Cart
              </Button>
              <Button onClick={handleSubmitOrder} variant="contained">
                Place Order
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductsPage; 