import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  List,
  Paper,
  ButtonGroup,
  TextField,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';

import {
  Close,
  Add,
  Remove,
  Delete,
  Send
} from '@mui/icons-material';

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const addToCart = (product) => {
    const existing = cartItems.find(item => item.id === product.id);
    if (existing) {
      setCartItems(cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    setIsDrawerOpen(true);
  };

  const updateQuantity = (id, change) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      setSnackbar({ open: true, message: 'Please fill in all required fields', severity: 'warning' });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          cartItems: cartItems
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSnackbar({ open: true, message: data.message, severity: 'success' });
        setFormData({ name: '', email: '', phone: '', company: '', message: '' });
      } else {
        setSnackbar({ open: true, message: data.error || 'Failed to submit inquiry', severity: 'error' });
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setSnackbar({ open: true, message: 'Network error. Please try again.', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Router basename='/store'>
      <Routes>
        <Route 
          path="/" 
          element={
            <ProductList 
              cartItems={cartItems}
              isDrawerOpen={isDrawerOpen}
              setIsDrawerOpen={setIsDrawerOpen}
              addToCart={addToCart}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
            />
          } 
        />
        <Route
          path="/product/:productId"
          element={
            <ProductDetail
              onAddToCart={addToCart}
              cartItems={cartItems}
              setIsDrawerOpen={setIsDrawerOpen}
            />
          }
        />
      </Routes>
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 500 } }
        }}
      >
        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">
              Inquiry Cart
            </Typography>
            <IconButton onClick={() => setIsDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ p: 3, overflow: 'auto', flexGrow: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Selected Products
          </Typography>
          {cartItems.length === 0 ? (
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: '#f8fafc', my: 2 }}>
              <Typography color="text.secondary">No items added yet</Typography>
            </Paper>
          ) : (
            <List>
              {cartItems.map(item => (
                <Paper key={item.id} sx={{ mb: 2, p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <img 
                      src={item.imageFront || item.variants?.[0]?.imageFront || ''}
                      alt={item.name}
                      style={{ width: 60, height: 60, objectFit: 'contain' }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${item.price} per unit
                      </Typography>
                    </Box>
                    <ButtonGroup size="small">
                      <Button onClick={() => updateQuantity(item.id, -1)}>
                        <Remove fontSize="small" />
                      </Button>
                      <Button disabled>{item.quantity}</Button>
                      <Button onClick={() => updateQuantity(item.id, 1)}>
                        <Add fontSize="small" />
                      </Button>
                    </ButtonGroup>
                    <IconButton color="error" onClick={() => removeItem(item.id)} size="small">
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
            </List>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Your Information
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Full Name"
              required
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Email Address"
              type="email"
              required
              fullWidth
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              label="Phone Number"
              type="tel"
              required
              fullWidth
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <TextField
              label="Company Name (Optional)"
              fullWidth
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
            <TextField
              label="Additional Details"
              multiline
              rows={4}
              fullWidth
              placeholder="Quantities, customization needs, etc."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
              onClick={handleSubmit}
              disabled={submitting}
              sx={{ bgcolor: '#1e293b', '&:hover': { bgcolor: '#0f172a' }, mt: 2 }}
            >
              {submitting ? 'Submitting...' : 'Submit Inquiry'}
            </Button>
          </Box>
        </Box>
      </Drawer>

    </Router>
  );
};

export default App;