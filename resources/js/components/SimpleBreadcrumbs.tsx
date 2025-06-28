import React from 'react';
import {
  Box,
  Typography,
  Link,
} from '@mui/material';
import { ChevronRight } from '@mui/icons-material';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface SimpleBreadcrumbsProps {
  items: BreadcrumbItem[];
}

const SimpleBreadcrumbs: React.FC<SimpleBreadcrumbsProps> = ({ items }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      mb: 3,
      flexWrap: 'wrap',
      gap: 0.5,
    }}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight sx={{ color: '#666', fontSize: '1.2rem' }} />
          )}
          {item.href && item.href.length > 0 ? (
            <Link
              href={item.href}
              sx={{
                color: '#666',
                textDecoration: 'none',
                '&:hover': {
                  color: '#000',
                  textDecoration: 'underline',
                },
                fontSize: '0.9rem',
              }}
            >
              {item.label}
            </Link>
          ) : (
            <Typography
              sx={{
                color: '#000',
                fontWeight: 500,
                fontSize: '0.9rem',
              }}
            >
              {item.label}
            </Typography>
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default SimpleBreadcrumbs; 