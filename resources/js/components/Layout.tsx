import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Drawer,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import OrderSummary from './OrderSummary';
import FilterSidebar from './FilterSidebar';
import { Category, ProductFilters } from '../types/api';
import apiService from '../services/api';
import { AppHeader } from './app-header';
import { ShoppingCart, Logout, Person, Login, FilterList } from '@mui/icons-material';
import {
  Badge,
  IconButton,
} from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Filter sidebar state
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    min_price: undefined,
    max_price: undefined,
    category_id: [],
    per_page: 12,
  });

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

  const handleLogout = async () => {
    await logout();
    navigate('/products');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    // You can add logic here to apply filters globally or navigate to products page
    if (window.location.pathname !== '/products') {
      navigate('/products');
    }
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      min_price: undefined,
      max_price: undefined,
      category_id: [],
      per_page: 12,
    });
  };

  const toggleFilterSidebar = () => {
    setFilterSidebarOpen(!filterSidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#EDF2FA' }}>
      <AppHeader />
      <Box sx={{ display: 'flex', flex: 1, alignItems: 'flex-start' }}>
        {/* Filter Toggle Button - Desktop */}
        {/* {!isMobile && !filterSidebarOpen && (
          <Box
            sx={{
              position: 'sticky',
              top: 32,
              alignSelf: 'flex-start',
              zIndex: 2,
              ml: 3,
              mt: 3,
            }}
          >
            <IconButton
              onClick={toggleFilterSidebar}
              sx={{
                backgroundColor: '#f5f5f5',
                color: '#000',
                borderRadius: 2,
                boxShadow: 2,
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                },
              }}
            >
              <FilterList />
            </IconButton>
          </Box>
        )} */}

        {/* Filter Sidebar - Desktop */}
        {/* {!isMobile && filterSidebarOpen && (
          <Box
            sx={{
              minWidth: 280,
              maxWidth: 320,
              position: 'sticky',
              top: 32,
              alignSelf: 'flex-start',
              height: 'fit-content',
              zIndex: 2,
              ml: 2,
              mt: 3,
            }}
          >
            <FilterSidebar
              categories={categories}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              onClose={() => setFilterSidebarOpen(false)}
            />
          </Box>
        )} */}

        {/* <Container component="main" sx={{ flexGrow: 1, py: 3 }}> */}
          {children}
          {/* Order Summary on mobile */}
          {/* <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 4 }}>
            <OrderSummary />
          </Box> */}
        {/* </Container> */}
        
        {/* Order Summary Sidebar on desktop */}
        {/* <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            minWidth: 340,
            maxWidth: 380,
            position: 'sticky',
            top: 32,
            alignSelf: 'flex-start',
            height: 'fit-content',
            zIndex: 2,
            mr: 3,
          }}
        >
          <OrderSummary />
        </Box> */}
      </Box>

      {/* Filter Sidebar - Mobile Drawer
      <Drawer
        anchor="left"
        open={isMobile && filterSidebarOpen}
        onClose={() => setFilterSidebarOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            maxWidth: '80vw',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <FilterSidebar
            categories={categories}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            onClose={() => setFilterSidebarOpen(false)}
          />
        </Box>
      </Drawer> */}
    </Box>
  );
};

export default Layout; 