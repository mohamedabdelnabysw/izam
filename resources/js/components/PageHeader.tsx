import React from 'react';
import {
  Box,
  Typography,
  Container,
} from '@mui/material';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  background?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
}) => {
  return (
    <Box
      sx={{
        background,
        color: '#fff',
        py: 4,
        mb: 3,
      }}
    >
      <Container maxWidth="xl">
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{ mb: 1 }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="h6"
            sx={{ opacity: 0.9, fontWeight: 400 }}
          >
            {subtitle}
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default PageHeader; 