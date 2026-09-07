import React, { useState, useEffect } from 'react';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';

import {
  Container,
  AppBar,
  Toolbar,
  Badge,
  Grid,
  Box,
  Typography,
  Button,
  Chip,
  Paper,
  CircularProgress,
  Breadcrumbs,
  Link,
  Divider,
  Card,
  CardMedia,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import {
  Close,
  ArrowBack,
  ShoppingCart,
  CheckCircle
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetail = ({ 
    onAddToCart,
    cartItems,
    setIsDrawerOpen
  }) => {  
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [contactInfo, setContactInfo] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/\s\w/g, l => l.toUpperCase());
  };
  
  
  useEffect(() => {
    fetchProductDetail();
    fetchContactInfo();
  }, [productId]);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/contact-info');
      if (!response.ok) throw new Error('Failed to fetch contact info');
      const data = await response.json();
      setContactInfo(data);
    } catch (error) {
      console.error('Error fetching contact info:', error);
    }
  };

  const fetchProductDetail = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) throw new Error('Product not found');
      const data = await response.json();
      console.log("PRODUCT DATA:", data);

      setProduct(data);
      // Set first variant with valid details as default
      const firstValidVariant = data.variants?.find(v => v.variety !== undefined) || data.variants?.[0];
      setSelectedVariant(firstValidVariant?.variety ?? null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setSnackbar({ open: true, message: 'Product not found', severity: 'error' });
      setLoading(false);
    }
  };
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleVariantChange = (variantId) => {
    setSelectedVariant(variantId);
  };

  const handleAddToCart = () => {
    if (product) {
      onAddToCart(product);
      setSnackbar({ open: true, message: 'Added to inquiry cart!', severity: 'success' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!product) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5">Product not found</Typography>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to Products
        </Button>
      </Container>
    );
  }

  const currentVariantData = product.variants?.find(v => v.variety === selectedVariant) || product.variants?.[0] || {};
  const hasDetails = currentVariantData.details && Object.keys(currentVariantData.details).length > 0;

  return (
    <Box sx={{ bgcolor: '#1A1A1A', minHeight: '100vh' }}>

    {/* 8-bit AppBar */}
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: '#2D2D2D',
        borderBottom: '4px solid #FF6B9D',
        boxShadow: '0 4px 0 #C2185B'
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Typography
          variant="h5"
          component="div"
          sx={{ 
            flexGrow: 1, 
            fontWeight: 900,
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '1.2rem',
            color: '#FFC947',
            textShadow: '3px 3px 0 #2D2D2D, 4px 4px 0 #FF6B9D',
            cursor: 'pointer',
            letterSpacing: '2px'
          }}
          onClick={() => navigate('/')}
        >
          🕶️ FUNXTER
        </Typography>

        <Button
            startIcon={
              <Badge 
                badgeContent={totalItems}
                sx={{
                  '& .MuiBadge-badge': {
                    bgcolor: '#FF3D00',
                    color: 'white',
                    fontWeight: 900,
                    border: '2px solid #2D2D2D'
                  }
                }}
              >
                <ShoppingCart />
              </Badge>
            }
            onClick={() => setIsDrawerOpen(true)}
            sx={{ 
              bgcolor: '#00E5FF',
              color: '#2D2D2D',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '0.6rem',
              border: '3px solid #2D2D2D',
              boxShadow: '4px 4px 0 #7C4DFF',
              px: 2,
              py: 1,
              '&:hover': {
                bgcolor: '#00FF88',
                transform: 'translate(2px, 2px)',
                boxShadow: '2px 2px 0 #7C4DFF'
              },
              transition: 'all 0.1s'
            }}
          >
            CART
        </Button>

      </Toolbar>
    </AppBar>

    {/* Page Content */}
    <Box sx={{ py: 4 }}>
      <Container
        maxWidth="xl"
        disableGutters
        sx={{ px: { xs: 2, sm: 3, md: 6 } }}
        >

        {/* 8-bit Breadcrumbs */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Link 
            underline="hover" 
            onClick={() => navigate('/')} 
            sx={{ 
              cursor: 'pointer',
              fontFamily: "'VT323', monospace",
              fontSize: '1.2rem',
              color: '#00E5FF',
              '&:hover': { color: '#FFC947' }
            }}
          >
            PRODUCTS
          </Link>
          <Typography sx={{ color: '#7C4DFF', fontFamily: "'VT323', monospace", fontSize: '1.2rem' }}>
            &gt;
          </Typography>
          <Typography 
            sx={{ 
              color: '#FF6B9D',
              fontFamily: "'VT323', monospace",
              fontSize: '1.2rem'
            }}
          >
            {product.name}
          </Typography>
        </Box>

        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/')}
          sx={{ 
            mb: 3,
            bgcolor: '#7C4DFF',
            color: 'white',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '0.6rem',
            border: '3px solid #2D2D2D',
            boxShadow: '4px 4px 0 #FF6B9D',
            px: 2,
            py: 1,
            '&:hover': {
              bgcolor: '#C2185B',
              transform: 'translate(2px, 2px)',
              boxShadow: '2px 2px 0 #FF6B9D'
            },
            transition: 'all 0.1s'
          }}
        >
          BACK
        </Button>

        <Box
        sx={{
            display: 'flex',
            gap: 4,
            flexDirection: { xs: 'column', md: 'row' }
        }}
        >
          {/* Left side - 8-bit Images */}
          <Box sx={{ flex: 6 }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                bgcolor: '#2D2D2D',
                border: '4px solid #00E5FF',
                boxShadow: '8px 8px 0 #7C4DFF'
              }}
            >
              <Box 
                sx={{ position: 'relative', mb: 2, bgcolor: '#FFFFFF', p: 2, border: '3px solid #7C4DFF' }}
                onMouseEnter={() => setIsFlipped(true)}   // Desktop hover
                onMouseLeave={() => setIsFlipped(false)}
                onClick={() => setIsFlipped(prev => !prev)} // Mobile tap
              >
                <img
                  src={isFlipped ? currentVariantData.imageSide : currentVariantData.imageFront}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '500px',
                    objectFit: 'contain',
                    display: 'block',
                    filter: 'contrast(1.1) saturate(1.2)',
                    transition: 'all 0.3s ease'
                  }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 12,
                        right: 12,
                        bgcolor: '#00E5FF',
                        border: '2px solid #2D2D2D',
                        borderRadius: '50%',
                        p: 1,
                        display: { xs: 'flex', md: 'none' }, // Only show on mobile
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '2px 2px 0 #7C4DFF'
                    }}
                    >
                    <FlipCameraAndroidIcon
                        sx={{ fontSize: 20, color: '#2D2D2D' }}
                    />
                    </Box>

                {isFlipped && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      bgcolor: '#FF3D00',
                      color: 'white',
                      px: 1.5,
                      py: 0.5,
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: '0.5rem',
                      border: '2px solid #2D2D2D',
                      animation: 'blink 1s infinite'
                    }}
                  >
                    SIDE VIEW
                  </Box>
                )}
              </Box>
            {/* Color Variants */}
            {product.variants && product.variants.length > 1 && (
                <Box sx={{ mb: 4 }}>
                  <Typography 
                    variant="subtitle1" 
                    gutterBottom
                    sx={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: '0.8rem',
                      color: '#00FF88',
                      mb: 2
                    }}
                  >
                    COLOURS
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {product.variants.map(variant => (
                      <Card
                        key={variant.variety}
                        onClick={() => handleVariantChange(variant.variety)}
                        sx={{
                          width: 100,
                          cursor: 'pointer',
                          bgcolor: '#1A1A1A',
                          border: selectedVariant === variant.variety ? '4px solid #FFC947' : '3px solid #7C4DFF',
                          boxShadow: selectedVariant === variant.variety ? '4px 4px 0 #FF6B9D' : 'none',
                          transition: 'all 0.1s',
                          '&:hover': { 
                            borderColor: '#00FF88'
                          }
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={variant.imageFront}
                          alt={variant.colorway || 'Variant'}
                          sx={{ height: 80, objectFit: 'contain', p: 1 }}
                        />
                        {variant.colorway && (
                          <Box sx={{ p: 1, textAlign: 'center', bgcolor: '#2D2D2D', borderTop: '2px solid #7C4DFF' }}>
                            <Typography 
                              variant="caption" 
                              sx={{
                                fontFamily: "'VT323', monospace",
                                fontSize: '0.9rem',
                                color: '#00E5FF'
                              }}
                            >
                              {variant.colorway}
                            </Typography>
                          </Box>
                        )}
                      </Card>
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>

            {/* 8-bit Product Info */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                bgcolor: '#2D2D2D',
                border: '4px solid #FF6B9D',
                boxShadow: '8px 8px 0 #7C4DFF',
                mt: 3 
              }}
            >
              <Typography 
                variant="h4" 
                gutterBottom
                sx={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '1.2rem',
                  color: '#FFC947',
                  textShadow: '2px 2px 0 #7C4DFF',
                  mb: 3,
                  lineHeight: 1.8
                }}
              >
                {product.name}
              </Typography>

              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, pb: 3, borderBottom: '3px dashed #7C4DFF' }}>
                <Typography 
                  variant="h3" 
                  sx={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '0.8rem',
                    color: '#00FF88',
                    textShadow: '3px 3px 0 #2D2D2D'
                  }}
                >
                  Price: {product.price}
                </Typography>
                {/* <Typography 
                  variant="body2" 
                  sx={{
                    color: '#00E5FF',
                    fontFamily: "'VT323', monospace",
                    fontSize: '1.1rem'
                  }}
                >
                  per unit
                </Typography> */}
              </Box>

              {product.moq && (
                <Box sx={{ mb: 3 }}>
                  <Chip 
                    label={`MOQ: ${product.moq}`} 
                    sx={{ 
                      bgcolor: '#7C4DFF',
                      color: 'white',
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: '0.6rem',
                      border: '3px solid #2D2D2D',
                      fontWeight: 900,
                      height: 'auto',
                      py: 1
                    }}
                  />
                </Box>
              )}



              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 3,
                  color: '#E0E0E0',
                  fontFamily: "'VT323', monospace",
                  fontSize: '1.2rem',
                  lineHeight: 1.7
                }}
              >
                {product.description}
              </Typography>

              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                sx={{ 
                  bgcolor: '#FF6B9D',
                  color: 'white',
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '0.7rem',
                  border: '3px solid #2D2D2D',
                  boxShadow: '6px 6px 0 #C2185B',
                  py: 2,
                  mb: 2,
                  fontWeight: 900,
                  '&:hover': {
                    bgcolor: '#FF3D00',
                    transform: 'translate(2px, 2px)',
                    boxShadow: '4px 4px 0 #C2185B'
                  },
                  transition: 'all 0.1s'
                }}
              >
                + ADD TO CART
              </Button>

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle sx={{ fontSize: 18, color: '#00FF88' }} />
                <Typography 
                  variant="body2" 
                  sx={{
                    color: '#00E5FF',
                    fontFamily: "'VT323', monospace",
                    fontSize: '1rem'
                  }}
                >
                  Custom branding available
                </Typography>
              </Box>
            </Paper>
           </Box>
           
          {/* Right side - 8-bit Specifications */}
          {hasDetails && (
            <Box sx={{ flex: 6 }}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  bgcolor: '#2D2D2D',
                  border: '4px solid #00E5FF',
                  boxShadow: '8px 8px 0 #7C4DFF'
                }}
              >
                <Typography 
                  variant="h5" 
                  gutterBottom
                  sx={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '1rem',
                    color: '#FFC947',
                    textShadow: '2px 2px 0 #7C4DFF',
                    mb: 3
                  }}
                >
                  SPECS
                </Typography>
                <Divider sx={{ mb: 3, borderColor: '#7C4DFF', borderWidth: '2px' }} />

                {/* Basic Appearance */}
                {currentVariantData.details.basicAppearance && (
                  <Box sx={{ mb: 3 }}>
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: '0.7rem',
                        color: '#FF6B9D',
                        mb: 2
                      }}
                    >
                      APPEARANCE
                    </Typography>
                    <Table size="small">
                      <TableBody>
                        {Object.entries(currentVariantData.details.basicAppearance).map(([key, value]) => (
                          <TableRow key={key} sx={{ '&:hover': { bgcolor: 'rgba(124, 77, 255, 0.1)' } }}>
                            <TableCell sx={{ 
                              fontWeight: 'bold', 
                              width: '40%', 
                              border: 0,
                              color: '#00E5FF',
                              fontFamily: "'VT323', monospace",
                              fontSize: '1.1rem'
                            }}>
                              {formatKey(key)}:
                            </TableCell>
                            <TableCell sx={{ 
                              border: 0,
                              color: '#E0E0E0',
                              fontFamily: "'VT323', monospace",
                              fontSize: '1.1rem'
                            }}>
                              {value}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                )}

                {/* Frame Design */}
                {currentVariantData.details.frameDesign && (
                  <Box sx={{ mb: 3 }}>
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: '0.7rem',
                        color: '#FF6B9D',
                        mb: 2
                      }}
                    >
                      FRAME
                    </Typography>
                    <Table size="small">
                      <TableBody>
                        {Object.entries(currentVariantData.details.frameDesign).map(([key, value]) => (
                          <TableRow key={key} sx={{ '&:hover': { bgcolor: 'rgba(124, 77, 255, 0.1)' } }}>
                            <TableCell sx={{ 
                              fontWeight: 'bold', 
                              width: '40%', 
                              border: 0,
                              color: '#00E5FF',
                              fontFamily: "'VT323', monospace",
                              fontSize: '1.1rem'
                            }}>
                              {formatKey(key)}:
                            </TableCell>
                            <TableCell sx={{ 
                              border: 0,
                              color: '#E0E0E0',
                              fontFamily: "'VT323', monospace",
                              fontSize: '1.1rem'
                            }}>
                              {value}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                )}

                {/* Lens Features */}
                {currentVariantData.details.lensFeatures && (
                  <Box sx={{ mb: 3 }}>
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: '0.7rem',
                        color: '#FF6B9D',
                        mb: 2
                      }}
                    >
                      LENS
                    </Typography>
                    <Table size="small">
                      <TableBody>
                        {Object.entries(currentVariantData.details.lensFeatures).map(([key, value]) => (
                          <TableRow key={key} sx={{ '&:hover': { bgcolor: 'rgba(124, 77, 255, 0.1)' } }}>
                            <TableCell sx={{ 
                              fontWeight: 'bold', 
                              width: '40%', 
                              border: 0,
                              color: '#00E5FF',
                              fontFamily: "'VT323', monospace",
                              fontSize: '1.1rem'
                            }}>
                              {formatKey(key)}:
                            </TableCell>
                            <TableCell sx={{ 
                              border: 0,
                              color: '#E0E0E0',
                              fontFamily: "'VT323', monospace",
                              fontSize: '1.1rem'
                            }}>
                              {value}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                )}

                {/* Material & Structure */}
                {currentVariantData.details.materialStructure && (
                  <Box sx={{ mb: 3 }}>
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: '0.7rem',
                        color: '#FF6B9D',
                        mb: 2
                      }}
                    >
                      MATERIAL
                    </Typography>
                    <Table size="small">
                      <TableBody>
                        {Object.entries(currentVariantData.details.materialStructure).map(([key, value]) => (
                          <TableRow key={key} sx={{ '&:hover': { bgcolor: 'rgba(124, 77, 255, 0.1)' } }}>
                            <TableCell sx={{ 
                              fontWeight: 'bold', 
                              width: '40%', 
                              border: 0,
                              color: '#00E5FF',
                              fontFamily: "'VT323', monospace",
                              fontSize: '1.1rem'
                            }}>
                              {formatKey(key)}:
                            </TableCell>
                            <TableCell sx={{ 
                              border: 0,
                              color: '#E0E0E0',
                              fontFamily: "'VT323', monospace",
                              fontSize: '1.1rem'
                            }}>
                              {value}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                )}

                {/* Wearing & Adaptation */}
                {currentVariantData.details.wearingAdaptation && (
                  <Box sx={{ mb: 3 }}>
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: '0.7rem',
                        color: '#FF6B9D',
                        mb: 2
                      }}
                    >
                      WEARING
                    </Typography>
                    <Table size="small">
                      <TableBody>
                        {Object.entries(currentVariantData.details.wearingAdaptation).map(([key, value]) => (
                          <TableRow key={key} sx={{ '&:hover': { bgcolor: 'rgba(124, 77, 255, 0.1)' } }}>
                            <TableCell sx={{ 
                              fontWeight: 'bold', 
                              width: '40%', 
                              border: 0,
                              color: '#00E5FF',
                              fontFamily: "'VT323', monospace",
                              fontSize: '1.1rem'
                            }}>
                              {formatKey(key)}:
                            </TableCell>
                            <TableCell sx={{ 
                              border: 0,
                              color: '#E0E0E0',
                              fontFamily: "'VT323', monospace",
                              fontSize: '1.1rem'
                            }}>
                              {value}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                )}

                {/* Usage Scenarios */}
                {currentVariantData.details.usageScenarios && (
                  <Box>
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: '0.7rem',
                        color: '#FF6B9D',
                        mb: 2
                      }}
                    >
                      USAGE
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{
                        color: '#E0E0E0',
                        fontFamily: "'VT323', monospace",
                        fontSize: '1.1rem',
                        lineHeight: 1.7
                      }}
                    >
                      {currentVariantData.details.usageScenarios}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          )}
        </Box>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>

    {/* 8-bit Footer */}
    <Box 
      sx={{ 
        bgcolor: '#2D2D2D', 
        color: 'white', 
        py: 6, 
        mt: 8,
        borderTop: '6px solid #FF6B9D'
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            gap: 4,
            mb: 4
          }}
        >
          <Box>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '1rem',
                color: '#FFC947',
                textShadow: '2px 2px 0 #7C4DFF',
                mb: 2
              }}
            >
              🕶️ {contactInfo?.companyName || 'FUNXTER'}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#00E5FF',
                fontFamily: "'VT323', monospace",
                fontSize: '1.1rem',
                mb: 2 
              }}
            >
              Quality wholesale sunglasses
              <br />
              from Vancouver
            </Typography>
          </Box>
          
          <Box>
            <Typography 
              variant="subtitle2" 
              gutterBottom 
              sx={{ 
                color: '#00FF88',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '0.7rem',
                mb: 2
              }}
            >
              CONTACT
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#E0E0E0',
                fontFamily: "'VT323', monospace",
                fontSize: '1rem',
                mb: 1 
              }}
            >
              📧 {contactInfo?.email || 'funxter.van@gmail.com'}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#E0E0E0',
                fontFamily: "'VT323', monospace",
                fontSize: '1rem',
                mb: 1 
              }}
            >
              📞 {contactInfo?.phone || '+1 (236) 123-4567'}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#E0E0E0',
                fontFamily: "'VT323', monospace",
                fontSize: '1rem'
              }}
            >
              📍 {contactInfo?.address || 'Vancouver, BC'}
            </Typography>
          </Box>

          <Box>
            <Typography 
              variant="subtitle2" 
              gutterBottom 
              sx={{ 
                color: '#00FF88',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '0.7rem',
                mb: 2
              }}
            >
              MORE STUFF
            </Typography>
            <Button
              href="https://www.etsy.com/shop/funxter"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                bgcolor: '#F56400',
                color: 'white',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '0.6rem',
                border: '3px solid #1A1A1A',
                boxShadow: '4px 4px 0 #C2185B',
                px: 2,
                py: 1,
                '&:hover': {
                  bgcolor: '#FF3D00',
                  transform: 'translate(2px, 2px)',
                  boxShadow: '2px 2px 0 #C2185B'
                },
                transition: 'all 0.1s'
              }}
            >
              ETSY →
            </Button>
          </Box>
        </Box>

        <Divider 
          sx={{ 
            borderColor: '#7C4DFF',
            borderWidth: '2px',
            borderStyle: 'dashed',
            my: 3 
          }} 
        />

        <Typography 
          variant="body2" 
          align="center" 
          sx={{ 
            color: '#7C4DFF',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '0.6rem'
          }}
        >
          © {new Date().getFullYear()} FUNXTER • MADE WITH ♥ IN YVR
        </Typography>
      </Container>
    </Box>

    {/* Add Google Fonts */}
    <style>
      {`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');
        
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}
    </style>
  </Box>
);
};

export default ProductDetail;