import React from 'react';
import {
  Box,
  Typography,
  Button,
  Chip
} from '@mui/material';
import { FilterList } from '@mui/icons-material';

interface ProductsHeaderProps {
  totalItems: number;
  isMobile: boolean;
  onToggleFilters: () => void;
  activeFiltersCount: number;
  onCartClick: () => void;
}

const ProductsHeader: React.FC<ProductsHeaderProps> = ({
  totalItems,
  isMobile,
  onToggleFilters,
  activeFiltersCount,
}) => {

  return (
    <Box sx={{ 
      mb: 3, 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 2,
    }}>
      <Box>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: '#000' }}>
          All Products
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body1" color="textSecondary">
            {totalItems} {totalItems === 1 ? 'product' : 'products'} found
          </Typography>
          {activeFiltersCount > 0 && (
            <Chip
              label={`${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} active`}
              color="primary"
              variant="outlined"
              size="small"
              sx={{
                borderColor: '#000',
                color: '#000',
                '& .MuiChip-label': {
                  fontWeight: 500,
                },
              }}
            />
          )}
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    
        
        {/* Mobile Filter Button */}
        {isMobile && (
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={onToggleFilters}
            sx={{ 
              borderRadius: 2,
              borderColor: '#000',
              color: '#000',
              '&:hover': {
                borderColor: '#222',
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            Filters
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ProductsHeader; 