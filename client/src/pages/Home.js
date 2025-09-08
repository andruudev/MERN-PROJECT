import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import CharacterContext from '../context/character/CharacterContext';

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const characterContext = useContext(CharacterContext);
  
  const {
    characters,
    filtered,
    getCharacters,
    loading,
    clearFilter,
    filterCharacters,
  } = characterContext;

  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    getCharacters();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (searchText !== '') {
      filterCharacters(searchText);
    } else {
      clearFilter();
    }
    // eslint-disable-next-line
  }, [searchText]);

  const handleAddClick = () => {
    navigate('/characters/add');
  };

  const handleCharacterClick = (id) => {
    navigate(`/characters/${id}`);
  };

  const handleRoleFilterChange = (event) => {
    setRoleFilter(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const filterAndSortCharacters = () => {
    let result = filtered ? [...filtered] : [...characters];

    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter((character) => character.role === roleFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'anime':
        result.sort((a, b) => a.anime.localeCompare(b.anime));
        break;
      default: // 'newest'
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  };

  const filteredAndSortedCharacters = filterAndSortCharacters();

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'Protagonist', label: 'Protagonist' },
    { value: 'Antagonist', label: 'Antagonist' },
    { value: 'Supporting', label: 'Supporting' },
    { value: 'Villain', label: 'Villain' },
    { value: 'Anti-Hero', label: 'Anti-Hero' },
    { value: 'Other', label: 'Other' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'anime', label: 'By Anime' },
  ];

  if (loading && characters.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          py: 6,
          mb: 4,
          borderRadius: 2,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Anime Characters Collection
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, maxWidth: '700px' }}>
            Discover and manage your favorite anime characters. Add new
            characters, edit existing ones, or explore the collection.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Add New Character
          </Button>
        </Container>
      </Box>

      {/* Search and Filter Section */}
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            mb: 4,
            alignItems: { xs: 'stretch', md: 'center' },
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search characters by name, anime, or ability..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 },
            }}
            sx={{ maxWidth: { md: '400px' } }}
          />

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              '& > *': { minWidth: { xs: '100%', sm: '200px' } },
            }}
          >
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Filter by Role</InputLabel>
              <Select
                value={roleFilter}
                onChange={handleRoleFilterChange}
                label="Filter by Role"
                sx={{ borderRadius: 2 }}
              >
                {roleOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={handleSortChange}
                label="Sort By"
                sx={{ borderRadius: 2 }}
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Character Grid */}
        {filteredAndSortedCharacters.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="300px"
            textAlign="center"
            p={4}
            sx={{ backgroundColor: 'background.paper', borderRadius: 2 }}
          >
            <Typography variant="h5" gutterBottom>
              No characters found
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {characters.length === 0
                ? 'Get started by adding your first character!'
                : 'Try adjusting your search or filters.'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              sx={{ borderRadius: 2 }}
            >
              Add Character
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredAndSortedCharacters.map((character) => (
              <Grid item key={character._id} xs={12} sm={6} md={4} lg={3}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                    },
                  }}
                  onClick={() => handleCharacterClick(character._id)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      character.imageUrl ||
                      'https://via.placeholder.com/300x200?text=No+Image'
                    }
                    alt={character.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={1}
                    >
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {character.name}
                      </Typography>
                      <Chip
                        label={character.role}
                        size="small"
                        color={
                          character.role === 'Protagonist'
                            ? 'primary'
                            : character.role === 'Antagonist'
                            ? 'error'
                            : character.role === 'Supporting'
                            ? 'success'
                            : 'default'
                        }
                        sx={{ ml: 1, flexShrink: 0 }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                      sx={{
                        fontStyle: 'italic',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {character.anime}
                    </Typography>
                    <Box
                      sx={{
                        mt: 1,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 0.5,
                      }}
                    >
                      {character.abilities &&
                        character.abilities
                          .slice(0, 3)
                          .map((ability, index) => (
                            <Chip
                              key={index}
                              label={ability}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                      {character.abilities && character.abilities.length > 3 && (
                        <Chip
                          label={`+${character.abilities.length - 3} more`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
