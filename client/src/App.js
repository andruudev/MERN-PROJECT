import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// Context Providers
import AlertState from './context/alert/AlertState';
import CharacterState from './context/character/CharacterState';

// Components
import Navbar from './components/layout/Navbar';
import Alert from './components/layout/Alert';

// Pages
import Home from './pages/Home';
import Character from './pages/Character';
import CharacterForm from './components/characters/CharacterForm';
import NotFound from './pages/NotFound';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontWeight: 500,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 500,
      fontSize: '2rem',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.75rem',
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.2,
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.2,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            boxShadow: '0 8px 30px 0 rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AlertState>
        <CharacterState>
          <Router>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                backgroundColor: 'background.default',
              }}
            >
              <Navbar />
              <Alert />
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  py: 4,
                  px: { xs: 2, sm: 3 },
                }}
              >
                <Container maxWidth="lg">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/characters" element={<Home />} />
                    <Route path="/characters/add" element={<CharacterForm />} />
                    <Route path="/characters/edit/:id" element={<CharacterForm isEdit />} />
                    <Route path="/characters/:id" element={<Character />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Container>
              </Box>
              
              {/* Footer */}
              <Box
                component="footer"
                sx={{
                  py: 3,
                  px: 2,
                  mt: 'auto',
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                      ? theme.palette.grey[200]
                      : theme.palette.grey[800],
                }}
              >
                <Container maxWidth="lg">
                  <Typography variant="body2" color="text.secondary" align="center">
                    {`© ${new Date().getFullYear()} Anime Characters Collection. All rights reserved.`}
                  </Typography>
                </Container>
              </Box>
            </Box>
          </Router>
        </CharacterState>
      </AlertState>
    </ThemeProvider>
  );
}

export default App;
