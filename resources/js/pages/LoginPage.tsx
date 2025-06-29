import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/products');
    } catch (err: any) {
      console.error('Login error details:', err.response?.data);
      // Handle Laravel validation errors
      if (err.response?.data?.errors?.email) {
        setError(err.response.data.errors.email[0]);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fafbfc',
      }}
    >
      <Box
        sx={{
          width: '100vw',
          maxWidth: 420,
          mx: 'auto',
          px: 2,
          py: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: '#fff',
          borderRadius: 2,
          boxShadow: 2,
          p: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold" align="center" mb={1}>
          Welcome back
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" mb={3}>
          Please enter your details to sign in
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Typography fontWeight={500} mb={0.5}>
            Email
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            required
            sx={{ mb: 2 }}
          />
          <Typography fontWeight={500} mb={0.5}>
            Password
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            placeholder="Enter your password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((show) => !show)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {error && (
            <Typography color="error" align="center" mb={2}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              background: '#000',
              color: '#fff',
              borderRadius: 2,
              fontWeight: 'bold',
              fontSize: '1rem',
              py: 1.5,
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#222' },
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Login'}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default LoginPage; 