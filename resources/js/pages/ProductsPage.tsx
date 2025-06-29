import React, { useState, useEffect } from 'react';
import {
  Box,
  Pagination,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
} from '@mui/material';
import { FilterList } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { Product, Category, ProductFilters } from '../types/api';
import ProductCard from '../components/ProductCard';
import ProductsHeader from '../components/ProductsHeader';
import SearchBar from '../components/SearchBar';
import SimpleBreadcrumbs from '../components/SimpleBreadcrumbs';
import FilterSidebar from '../components/FilterSidebar';
import OrderSummary from '../components/OrderSummary';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  const { addToCart, items } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Filter sidebar open/close state
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);

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
        }, currentPage);
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
  }, [filters, currentPage]);

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    if (currentPage !== 1) setCurrentPage(1); // Only reset if not already on page 1
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      min_price: undefined,
      max_price: undefined,
      category_id: [],
      per_page: 12,
    });
    if (currentPage !== 1) setCurrentPage(1);
  };

  const handleSearchChange = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    if (currentPage !== 1) setCurrentPage(1);
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

  // Toggle logic
  const handleToggleFilterSidebar = () => setFilterSidebarOpen((open) => !open);
  const handleCloseFilterSidebar = () => setFilterSidebarOpen(false);

  if (loading && products.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#EDF2FA', width: '100vw', p: 0 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'flex-start',
          width: '100%',
          minHeight: '100vh',
          gap: isMobile ? 3 : 4,
          background: 'transparent',
          px: isMobile ? 1 : 4,
          pt: isMobile ? 2 : 4,
        }}
      >
        {/* Desktop: Filter Toggle Button */}
        {!isMobile && !filterSidebarOpen && (
          <Box sx={{ flex: '0 0 48px', width: 48, display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', height: '100%' }}>
            <IconButton onClick={handleToggleFilterSidebar} sx={{ mt: 0, ml: 0, background: '#f5f5f5', color: '#000', borderRadius: 2, boxShadow: 2 }}>
              <FilterList />
            </IconButton>
          </Box>
        )}
        {/* Desktop: Filter Sidebar */}
        {!isMobile && filterSidebarOpen && (
          <Box sx={{ flex: '0 0 320px', width: 320, background: '#fff', borderRadius: 3, boxShadow: 2, p: 0, minHeight: '80vh' }}>
            <FilterSidebar
              categories={categories}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              onClose={handleCloseFilterSidebar}
            />
          </Box>
        )}
        {/* Product List */}
        <Box sx={{ flex: 1, width: '100%', px: isMobile ? 0 : 0, py: 0, background: isMobile ? 'transparent' : '#fff', borderRadius: 3, boxShadow: isMobile ? 0 : 2, p: isMobile ? 2 : 4, minHeight: '80vh' }}>
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
            onToggleFilters={handleToggleFilterSidebar}
            activeFiltersCount={getActiveFiltersCount()}
            onCartClick={() => {}}
          />
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box display="grid" gridTemplateColumns={isMobile ? '1fr' : 'repeat(3, 1fr)'} gap={2} mt={3}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </Box>
          {/* Pagination */}
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, page) => setCurrentPage(page)}
              color="primary"
              sx={{
                background: '#fff',
                borderRadius: 2,
                px: 2,
                py: 1,
                boxShadow: 0,
                '.MuiPagination-ul': {
                  justifyContent: 'center',
                  gap: 2,
                },
                '.MuiPaginationItem-root': {
                  borderRadius: '8px',
                  minWidth: 40,
                  minHeight: 40,
                  fontWeight: 500,
                  fontSize: '1.1rem',
                  color: '#b0b7c3',
                  background: 'transparent',
                  transition: 'all 0.2s',
                },
                '.Mui-selected': {
                  background: '#000',
                  color: '#fff',
                  borderRadius: '8px',
                  boxShadow: 0,
                },
                '.MuiPaginationItem-previousNext': {
                  color: '#b0b7c3',
                  fontWeight: 400,
                  fontSize: '1.1rem',
                },
              }}
            />
          </Box>
        </Box>
        {/* Mobile: Order Summary below products */}
        {/* {isMobile && (
          <Box sx={{ width: '100%', mt: 3, background: '#fff', borderRadius: 3, boxShadow: 2, p: 2 }}>
            <OrderSummary />
          </Box>
        )} */}
        {/* Desktop: Order Summary right */}
        {!isMobile && (
          <Box sx={{ flex: '0 0 380px', width: 380, ml: 0, background: '#fff', borderRadius: 3, boxShadow: 2, p: 0 }}>
            <OrderSummary />
          </Box>
        )}
        {/* Mobile: Drawer for Filter Sidebar (from right) */}
        {isMobile && (
          <Drawer
            anchor="right"
            open={filterSidebarOpen}
            onClose={handleCloseFilterSidebar}
            PaperProps={{ sx: { width: 320 } }}
          >
            <FilterSidebar
              categories={categories}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              onClose={handleCloseFilterSidebar}
              isMobile
            />
          </Drawer>
        )}
      </Box>
    </Box>
  );
};

export default ProductsPage; 