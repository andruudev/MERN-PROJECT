import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Home as HomeIcon, Search as SearchIcon } from '@mui/icons-material';

export default function NotFound() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 6 },
          textAlign: 'center',
          borderRadius: 2,
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[100]} 100%)`,
        }}
      >
        <Box
          component="span"
          sx={{
            display: 'inline-block',
            fontSize: '6rem',
            fontWeight: 700,
            color: theme.palette.primary.main,
            lineHeight: 1,
            mb: 2,
            textShadow: '4px 4px 0 rgba(0,0,0,0.05)',
          }}
        >
          404
        </Box>
        
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 2,
          }}
        >
          Oops! Page not found
        </Typography>
        
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            maxWidth: '600px',
            mx: 'auto',
            mb: 4,
            fontSize: '1.1rem',
            lineHeight: 1.6,
          }}
        >
          We're sorry, but the page you are looking for doesn't exist or has been moved.
          Please check the URL or return to the homepage.
        </Typography>
        
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 2,
            justifyContent: 'center',
            mt: 4,
          }}
        >
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            color="primary"
            size="large"
            startIcon={<HomeIcon />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: theme.shadows[2],
              '&:hover': {
                boxShadow: theme.shadows[4],
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease-in-out',
              },
            }}
          >
            Back to Home
          </Button>
          
          <Button
            component={RouterLink}
            to="/characters"
            variant="outlined"
            color="primary"
            size="large"
            startIcon={<SearchIcon />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease-in-out',
              },
            }}
          >
            Browse Characters
          </Button>
        </Box>
        
        <Box mt={6}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              fontSize: '0.85rem',
              fontStyle: 'italic',
              '& a': {
                color: theme.palette.primary.main,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              },
            }}
          >
            If you believe this is a mistake, please contact support at{' '}
            <a href="mailto:support@animeapp.com">support@animeapp.com</a>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
