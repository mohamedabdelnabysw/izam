import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Slider,
  Checkbox,
  FormControlLabel,
  Button,
  Divider,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { Category as CategoryType, ProductFilters } from '../types/api';

interface FilterSidebarProps {
  categories: CategoryType[];
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onClearFilters: () => void;
  onClose?: () => void;
  isMobile?: boolean;
  open?: boolean;
  onToggle?: () => void;
}

const minPrice = 0;
const maxPrice = 1000;

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  filters,
  onFiltersChange,
  onClearFilters,
  onClose,
}) => {
  const [tempFilters, setTempFilters] = useState<ProductFilters>(filters);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setTempFilters(filters);
    setHasChanges(false);
  }, [filters]);

  // --- Category logic with 'All' ---
  const allCategoryId = 0;
  const allSelected = !tempFilters.category_id || tempFilters.category_id.length === 0;
  
  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    let newCategories: number[] = tempFilters.category_id ? [...tempFilters.category_id] : [];
    
    if (categoryId === allCategoryId) {
      // 'All' selected: clear all categories
      newCategories = [];
    } else {
      if (checked) {
        // Add category to selection (allow multiple)
        if (!newCategories.includes(categoryId)) {
          newCategories.push(categoryId);
        }
      } else {
        // Remove category from selection
        newCategories = newCategories.filter((id) => id !== categoryId);
      }
    }
    setTempFilters({ ...tempFilters, category_id: newCategories });
    setHasChanges(true);
  };

  // --- Price ---
  const handlePriceRangeChange = (_: Event, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    setTempFilters({ ...tempFilters, min_price: min, max_price: max });
    setHasChanges(true);
  };

  // --- Apply/Clear ---
  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
    setHasChanges(false);
  };
  const handleClearFilters = () => {
    setTempFilters({ search: '', min_price: minPrice, max_price: maxPrice, category_id: [] });
    onClearFilters();
    setHasChanges(false);
  };

  // --- UI ---
  return (
    <Card sx={{ 
      height: '100%', 
      borderRadius: 2, 
      boxShadow: 2, 
      minWidth: 300, 
      maxWidth: 350,
      maxHeight: 'calc(100vh - 120px)', // Leave space for header and padding
      display: 'flex',
      flexDirection: 'column',
    }}>
      <CardContent sx={{ 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        overflow: 'hidden', // Prevent content from spilling out
      }}>
        {/* Header with close button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexShrink: 0 }}>
          <Typography variant="h5" fontWeight="bold">
            Filters
          </Typography>
          {onClose && (
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: '#666',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              <Close />
            </IconButton>
          )}
        </Box>
        
        {/* Scrollable content area */}
        <Box sx={{ 
          flex: 1, 
          overflowY: 'auto', 
          overflowX: 'hidden',
          '&::-webkit-scrollbar': {
            width: '0px',
            display: 'none',
          },
          '&::-webkit-scrollbar-track': {
            display: 'none',
          },
          '&::-webkit-scrollbar-thumb': {
            display: 'none',
          },
          // For Firefox
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          {/* Price */}
          <Box mb={4}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Price
            </Typography>
            <Slider
              value={[
                tempFilters.min_price ?? minPrice,
                tempFilters.max_price ?? maxPrice,
              ]}
              onChange={handlePriceRangeChange}
              min={minPrice}
              max={maxPrice}
              step={10}
              sx={{
                color: '#000',
                height: 4,
                '& .MuiSlider-thumb': { backgroundColor: '#000', border: '2px solid #fff' },
                '& .MuiSlider-rail': { opacity: 1, backgroundColor: '#000' },
                '& .MuiSlider-track': { backgroundColor: '#000' },
              }}
            />
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Typography variant="body2">${minPrice}</Typography>
              <Typography variant="body2">${maxPrice}</Typography>
            </Box>
          </Box>
          {/* Category */}
          <Box mb={4} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Category
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={allSelected}
                  onChange={() => handleCategoryChange(allCategoryId, true)}
                  sx={{ color: allSelected ? '#2563eb' : undefined }}
                />
              }
              label={<Typography sx={{ color: allSelected ? '#2563eb' : undefined, fontWeight: allSelected ? 600 : 400 }}>All</Typography>}
              sx={{ mb: 1, width: '100%' }}
            />
            {categories.map((category) => (
              <FormControlLabel
                key={category.id}
                control={
                  <Checkbox
                    checked={tempFilters.category_id?.includes(category.id) || false}
                    onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                  />
                }
                label={category.name}
                sx={{ mb: 1, width: '100%' }}
              />
            ))}
          </Box>
        </Box>
        
        {/* Buttons - Fixed at bottom */}
        <Box sx={{ flexShrink: 0, mt: 4 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleApplyFilters}
            sx={{
              backgroundColor: '#000',
              color: '#fff',
              borderRadius: 2,
              fontWeight: 'bold',
              fontSize: '1rem',
              py: 1.5,
              mb: 1.5,
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#222' },
            }}
            disabled={!hasChanges}
          >
            Apply Filter
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={handleClearFilters}
            sx={{ color: '#888', fontWeight: 500, fontSize: '1rem' }}
          >
            Clear all filters
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FilterSidebar; 