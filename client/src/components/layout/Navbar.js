import React, { useState, useContext, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Home as HomeIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import CharacterContext from '../../context/character/CharacterContext';
import AlertContext from '../../context/alert/AlertState';

const Navbar = () => {
  const characterContext = useContext(CharacterContext);
  const alertContext = useContext(AlertContext);
  const { filterCharacters, clearFilter } = characterContext;
  const { setAlert } = alertContext;
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchText, setSearchText] = useState('');
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  useEffect(() => {
    if (searchText !== '') {
      filterCharacters(searchText);
    } else {
      clearFilter();
    }
    // eslint-disable-next-line
  }, [searchText]);

  const handleSearchChange = e => {
    setSearchText(e.target.value);
  };

  const handleAddClick = () => {
    navigate('/characters/add');
  };

  const handleMobileMenuOpen = event => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleUserMenuOpen = event => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    // Handle logout logic here
    setUserMenuAnchor(null);
    setAlert('Logged out successfully', 'success');
    navigate('/');
  };

  const mobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchor}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(mobileMenuAnchor)}
      onClose={handleMobileMenuClose}
    >
      <MenuItem
        component={RouterLink}
        to="/"
        onClick={handleMobileMenuClose}
      >
        <HomeIcon sx={{ mr: 1 }} />
        Home
      </MenuItem>
      <MenuItem
        component={RouterLink}
        to="/characters/add"
        onClick={handleMobileMenuClose}
      >
        <AddIcon sx={{ mr: 1 }} />
        Add Character
      </MenuItem>
    </Menu>
  );

  const userMenu = (
    <Menu
      anchorEl={userMenuAnchor}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(userMenuAnchor)}
      onClose={handleUserMenuClose}
    >
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMobileMenuOpen}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          Anime Characters
        </Typography>

        {!isMobile && (
          <Box sx={{ flexGrow: 1, maxWidth: 500, mx: 4 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Search characters..."
              value={searchText}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'background.paper',
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        )}

        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Home">
              <IconButton
                color="inherit"
                component={RouterLink}
                to="/"
                size="large"
              >
                <HomeIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
              }}
            >
              Add Character
            </Button>
          </Box>
        )}

        <Box sx={{ ml: 2 }}>
          <IconButton
            onClick={handleUserMenuOpen}
            size="large"
            edge="end"
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              <InfoIcon />
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>

      {isMobile && (
        <Box sx={{ p: 2, backgroundColor: 'background.paper' }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search characters..."
            value={searchText}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
                borderRadius: 2,
              },
            }}
          />
        </Box>
      )}

      {mobileMenu}
      {userMenu}
    </AppBar>
  );
};

export default Navbar;
