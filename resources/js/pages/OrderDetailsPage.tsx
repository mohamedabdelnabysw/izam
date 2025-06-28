import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent } from '@mui/material';

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Order Details
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6">
            Order #{id}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Order details will be implemented here.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderDetailsPage; 