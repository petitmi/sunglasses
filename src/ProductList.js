import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import {
  AppBar,
  Toolbar,
  Badge,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Container,
  Box,
  Paper,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  Divider
  
} from '@mui/material';
import {
  ShoppingCart,
} from '@mui/icons-material';

// 8-bit pixel art style component
const PixelBox = ({ children, ...props }) => (
  <Box
    {...props}
    sx={{
      ...props.sx,
      imageRendering: 'pixelated',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 2px)',
        pointerEvents: 'none',
        zIndex: 1
      }
    }}
  />
);

const ProductList = ({ 
  cartItems, 
  setIsDrawerOpen, 
  addToCart
}) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  useEffect(() => {
    fetchProducts();
    fetchContactInfo();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

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

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#1A1A1A' }}>
      {/* 8-bit Header */}
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
              letterSpacing: '2px'
            }}
          >
            🕶️ {contactInfo?.companyName || 'FUNXTER'}
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

      {/* 8-bit Hero Section */}
      <Box 
    sx={{ 
        bgcolor: '#2D2D2D', 
        color: 'white', 
        py: 8,
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '6px solid #FF6B9D',
        '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(255, 107, 157, 0.05) 25%, rgba(255, 107, 157, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 107, 157, 0.05) 75%, rgba(255, 107, 157, 0.05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(255, 107, 157, 0.05) 25%, rgba(255, 107, 157, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 107, 157, 0.05) 75%, rgba(255, 107, 157, 0.05) 76%, transparent 77%, transparent)
        `,
        backgroundSize: '50px 50px',
        opacity: 0.3
        }
    }}
    >
    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>

        {/* HERO GRID */}
        <Box
        sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 6
        }}
        >

        {/* LEFT: HERO TEXT */}
        <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>

            <Typography
            variant="h2"
            sx={{
                fontFamily: "'Press Start 2P'",
                fontSize: { xs: '1.4rem', md: '2.3rem' },
                color: '#FFC947',
                textShadow: '4px 4px 0 #2D2D2D, 5px 5px 0 #FF6B9D, 6px 6px 0 #7C4DFF',
                mb: 3,
                letterSpacing: '3px'
            }}
            >
            WHOLESALE
            <br />
            SUNGLASSES
            </Typography>

            <Typography
            sx={{
                color: '#00E5FF',
                mb: 4,
                fontFamily: "'Press Start 2P'",
                fontSize: '0.7rem',
                lineHeight: 2,
                textShadow: '2px 2px 0 #2D2D2D'
            }}
            >
            QUALITY EYEWEAR • WORLDWIDE
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>

            <Chip 
                label="LOW MOQ" 
                sx={{ 
                bgcolor: '#00FF88',
                color: '#2D2D2D',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '0.6rem',
                fontWeight: 900,
                border: '3px solid #2D2D2D',
                boxShadow: '4px 4px 0 #7C4DFF',
                px: 1,
                height: 'auto',
                py: 1
                }} 
            />
            <Chip 
                label="CUSTOM" 
                sx={{ 
                bgcolor: '#FF6B9D',
                color: 'white',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '0.6rem',
                fontWeight: 900,
                border: '3px solid #2D2D2D',
                boxShadow: '4px 4px 0 #7C4DFF',
                px: 1,
                height: 'auto',
                py: 1
                }} 
            />
            <Chip 
                label="FAST SHIP" 
                sx={{ 
                bgcolor: '#00E5FF',
                color: '#2D2D2D',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '0.6rem',
                fontWeight: 900,
                border: '3px solid #2D2D2D',
                boxShadow: '4px 4px 0 #7C4DFF',
                px: 1,
                height: 'auto',
                py: 1
                }} 
            />

            </Box>

        </Box>


        {/* RIGHT: PERSONAL MESSAGE */}
        <Box sx={{ flex: 1, width: '100%' }}>

            <Paper
            elevation={0}
            sx={{
                p: 4,
                bgcolor: '#2D2D2D',
                border: '4px solid #FF6B9D',
                boxShadow: '8px 8px 0 #7C4DFF',
                position: 'relative'
            }}
            >

            <Box
                sx={{
                position: 'absolute',
                top: -12,
                left: 20,
                bgcolor: '#FFC947',
                color: '#2D2D2D',
                px: 2,
                py: 0.5,
                fontFamily: "'Press Start 2P'",
                fontSize: '0.7rem',
                border: '3px solid #2D2D2D',
                boxShadow: '4px 4px 0 #FF6B9D'
                }}
            >
                ABOUT
            </Box>

            <Typography
                sx={{
                fontFamily: "'VT323'",
                fontSize: '1.3rem',
                color: '#F5F5F5',
                mb: 3,
                lineHeight: 2,
                letterSpacing: '0.5px'
                }}
            >
                Hey! I'm the{' '}
    <a 
        href="https://xmmz.me" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ 
            color: '#00E5FF', 
            textDecoration: 'none',
            borderBottom: '2px dotted #00E5FF',
            transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.color = '#FFC947'}
        onMouseLeave={(e) => e.target.style.color = '#00E5FF'}
    >
        solo human
    </a>  behind funxter, running this little corner
                from Vancouver. Quality and cool sunglasses through a connection
                that lets us offer designs you'd normally pay 10x–50x for.
                <br />
                <span style={{ color: '#00FF88', fontWeight: 'bold' }}>
                Welcome in.
                </span>
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>

                <Typography
                sx={{
                    color: '#00E5FF',
                    fontFamily: "'Press Start 2P'",
                    fontSize: '0.6rem'
                }}
                >
                MORE LOOT →
                </Typography>

                <Button
                href="https://www.etsy.com/shop/funxter"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                    bgcolor: '#F56400',
                    color: 'white',
                    fontFamily: "'Press Start 2P'",
                    fontSize: '0.65rem',
                    fontWeight: 900,
                    border: '3px solid #2D2D2D',
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
                🛍️ ETSY SHOP
                </Button>

            </Box>

            </Paper>

        </Box>

        </Box>

    </Container>
    </Box>



      <Container maxWidth="xl" sx={{ py: 8, bgcolor: '#1A1A1A' }}>
        <Box
          sx={{
            textAlign: 'center',
            mb: 6,
            pb: 4,
            borderBottom: '4px dashed #FF6B9D'
          }}
        >
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom 
            sx={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: { xs: '1.2rem', md: '2rem' },
              color: '#FFC947',
              textShadow: '3px 3px 0 #2D2D2D, 4px 4px 0 #FF6B9D',
              mb: 2,
              letterSpacing: '2px'
            }}
          >
            - INVENTORY -
          </Typography>
          <Typography
            sx={{
              fontFamily: "'VT323', monospace",
              fontSize: '1.2rem',
              color: '#00E5FF'
            }}
          >
            SELECT YOUR GEAR
          </Typography>
        </Box>
        {products.length === 0 ? (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 6, 
              textAlign: 'center', 
              bgcolor: '#2D2D2D',
              border: '4px solid #7C4DFF',
              boxShadow: '8px 8px 0 #FF6B9D'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{
                color: '#00E5FF',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '0.8rem'
              }}
            >
              NO ITEMS FOUND
            </Typography>
          </Paper>
        ) : (
          <Box 
            sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 4,
              justifyContent: { xs: 'center', sm: 'flex-start' }
            }}
          >
            {products.map(product => (
              <Card 
                key={product.id}
                sx={{ 
                  width: { 
                    xs: '100%', 
                    sm: '47%',
                    md: '30%',
                    lg: '22%'
                  },
                  display: 'flex', 
                  flexDirection: 'column',
                  bgcolor: '#2D2D2D',
                  border: '4px solid #00E5FF',
                  boxShadow: '6px 6px 0 #7C4DFF',
                  cursor: 'pointer',
                  transition: 'all 0.1s',
                  '&:hover': { 
                    transform: 'translate(-2px, -2px)',
                    boxShadow: '8px 8px 0 #FF6B9D',
                    borderColor: '#FF6B9D'
                  } 
                }}
                onClick={() => navigate(`/product/${product.id}`)}
              >
            <Box
                onMouseEnter={() => setIsFlipped(product.id)}   // Desktop
                onMouseLeave={() => setIsFlipped(null)}
                onClick={(e) => {
                    e.stopPropagation(); // Prevent card navigation
                    setIsFlipped(isFlipped === product.id ? null : product.id);
                }}
                  sx={{
                    height: 240,
                    bgcolor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                    borderBottom: '3px solid #7C4DFF',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    component="img"
                    src={isFlipped === product.id ? product.imageSide : product.imageFront}
                    alt={product.name}
                    sx={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      transition: 'all 0.2s',
                      filter: 'contrast(1.1) saturate(1.2)',
                      imageRendering: 'auto'
                    }}
                  />
                  <Box
                    sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        bgcolor: '#00E5FF',
                        border: '2px solid #2D2D2D',
                        borderRadius: '50%',
                        p: 0.8,
                        display: { xs: 'flex', md: 'none' },
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '2px 2px 0 #7C4DFF'
                    }}
                    >
                    <FlipCameraAndroidIcon
                        sx={{ fontSize: 18, color: '#2D2D2D' }}
                    />
                    </Box>
                  {isFlipped === product.id && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
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

                <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    sx={{ 
                      mb: 1.5,
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      fontFamily: "'Press Start 2P', monospace",
                      color: '#FFC947',
                      textShadow: '2px 2px 0 #2D2D2D'
                    }}
                  >
                    {product.name}
                  </Typography>
                  {product.colorway && (
                    <Chip 
                      label={product.colorway} 
                      size="small" 
                      sx={{ 
                        mb: 2, 
                        bgcolor: '#7C4DFF',
                        color: 'white',
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: '0.5rem',
                        border: '2px solid #2D2D2D',
                        alignSelf: 'flex-start',
                        height: 'auto',
                        py: 0.5
                      }} 
                    />
                  )}
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 2.5, 
                      flexGrow: 1,
                      lineHeight: 1.6,
                      fontSize: '0.85rem',
                      color: '#E0E0E0',
                      fontFamily: "'VT323', monospace",
                      fontSize: '1.1rem'
                    }}
                  >
                    {product.description}
                  </Typography>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-end',
                      mt: 'auto',
                      pt: 2,
                      borderTop: '2px dashed #7C4DFF'
                    }}
                  >
                    <Box>
                      <Typography 
                        variant="h5" 
                        sx={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: '0.6rem',
                          color: '#00FF88',
                          textShadow: '2px 2px 0 #2D2D2D'
                        }}
                      >
                        Price: {product.price}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{
                          color: '#00E5FF',
                          fontFamily: "'VT323', monospace",
                          fontSize: '0.9rem'
                        }}
                      >
                        per unit
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography 
                        variant="caption" 
                        sx={{
                          color: '#00E5FF',
                          fontFamily: "'VT323', monospace",
                          fontSize: '0.9rem'
                        }}
                      >
                        MOQ
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: '0.7rem',
                          color: '#FF6B9D'
                        }}
                      >
                        {product.moq}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2.5, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ 
                      bgcolor: '#FF6B9D', 
                      color: 'white',
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: '0.65rem',
                      border: '3px solid #2D2D2D',
                      boxShadow: '4px 4px 0 #C2185B',
                      py: 1.5,
                      fontWeight: 900,
                      '&:hover': {
                        bgcolor: '#FF3D00',
                        transform: 'translate(2px, 2px)',
                        boxShadow: '2px 2px 0 #C2185B'
                      },
                      transition: 'all 0.1s'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    + ADD TO CART
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
      </Container>

      {/* 8-bit Footer */}
      <Box 
        sx={{ 
          bgcolor: '#2D2D2D', 
          color: 'white', 
          py: 6, 
          mt: 8,
          borderTop: '6px solid #FF6B9D',
          position: 'relative'
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

export default ProductList;