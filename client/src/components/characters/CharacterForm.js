import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  Paper,
  Typography,
  IconButton,
  Chip,
  Divider,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import CharacterContext from '../../context/character/CharacterContext';
import AlertContext from '../../context/alert/AlertContext';

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .max(100, 'Name must be at most 100 characters'),
  anime: Yup.string()
    .required('Anime name is required')
    .max(100, 'Anime name must be at most 100 characters'),
  description: Yup.string()
    .required('Description is required')
    .max(1000, 'Description must be at most 1000 characters'),
  imageUrl: Yup.string()
    .required('Image URL is required')
    .url('Must be a valid URL')
    .matches(
      /\.(jpeg|jpg|gif|png|webp|svg)$/i,
      'Must be a valid image URL (jpeg, jpg, gif, png, webp, svg)'
    ),
  role: Yup.string()
    .required('Role is required')
    .oneOf(
      ['Protagonist', 'Antagonist', 'Supporting', 'Villain', 'Anti-Hero', 'Other'],
      'Invalid role'
    ),
  abilities: Yup.array().of(Yup.string().max(50, 'Ability must be at most 50 characters')),
});

const CharacterForm = ({ isEdit = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { id } = useParams();
  
  const characterContext = useContext(CharacterContext);
  const { 
    current, 
    getCharacter, 
    addCharacter, 
    updateCharacter, 
    clearCurrent 
  } = characterContext;
  
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;

  const [newAbility, setNewAbility] = useState('');
  const [loading, setLoading] = useState(isEdit);

  const formik = useFormik({
    initialValues: {
      name: '',
      anime: '',
      description: '',
      imageUrl: '',
      role: 'Other',
      abilities: [],
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        
        const characterData = {
          ...values,
          abilities: values.abilities.filter(ability => ability.trim() !== '')
        };

        if (isEdit && id) {
          await updateCharacter({ ...characterData, _id: id });
          setAlert('Character updated successfully', 'success');
        } else {
          await addCharacter(characterData);
          setAlert('Character added successfully', 'success');
        }
        
        navigate('/');
      } catch (err) {
        console.error('Error saving character:', err);
        setAlert(
          `Error ${isEdit ? 'updating' : 'adding'} character: ${err.message || 'Please try again'}`,
          'error'
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Load character data in edit mode
  useEffect(() => {
    if (isEdit && id) {
      const loadCharacter = async () => {
        try {
          await getCharacter(id);
        } catch (err) {
          setAlert('Error loading character data', 'error');
          navigate('/');
        } finally {
          setLoading(false);
        }
      };
      
      loadCharacter();
    }
    
    return () => {
      if (isEdit) {
        clearCurrent();
      }
    };
    // eslint-disable-next-line
  }, [id, isEdit]);

  // Update form values when current character data is loaded
  useEffect(() => {
    if (isEdit && current) {
      formik.setValues({
        name: current.name || '',
        anime: current.anime || '',
        description: current.description || '',
        imageUrl: current.imageUrl || '',
        role: current.role || 'Other',
        abilities: current.abilities || [],
      });
    }
    // eslint-disable-next-line
  }, [current, isEdit]);

  const handleAddAbility = () => {
    if (newAbility.trim() && !formik.values.abilities.includes(newAbility.trim())) {
      formik.setFieldValue('abilities', [...formik.values.abilities, newAbility.trim()]);
      setNewAbility('');
    }
  };

  const handleRemoveAbility = (abilityToRemove) => {
    formik.setFieldValue(
      'abilities',
      formik.values.abilities.filter((ability) => ability !== abilityToRemove)
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && newAbility.trim()) {
      e.preventDefault();
      handleAddAbility();
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2, textTransform: 'none' }}
        >
          Back
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          {isEdit ? 'Edit Character' : 'Add New Character'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {isEdit 
            ? 'Update the details of this anime character.'
            : 'Fill in the details to add a new anime character to your collection.'}
          }
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Character Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                margin="normal"
                variant="outlined"
              />
              
              <TextField
                fullWidth
                id="anime"
                name="anime"
                label="Anime/Series"
                value={formik.values.anime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.anime && Boolean(formik.errors.anime)}
                helperText={formik.touched.anime && formik.errors.anime}
                margin="normal"
                variant="outlined"
              />
              
              <FormControl 
                fullWidth 
                margin="normal"
                error={formik.touched.role && Boolean(formik.errors.role)}
              >
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Role"
                >
                  <MenuItem value="Protagonist">Protagonist</MenuItem>
                  <MenuItem value="Antagonist">Antagonist</MenuItem>
                  <MenuItem value="Supporting">Supporting</MenuItem>
                  <MenuItem value="Villain">Villain</MenuItem>
                  <MenuItem value="Anti-Hero">Anti-Hero</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
                {formik.touched.role && formik.errors.role && (
                  <FormHelperText>{formik.errors.role}</FormHelperText>
                )}
              </FormControl>
              
              <TextField
                fullWidth
                id="imageUrl"
                name="imageUrl"
                label="Image URL"
                value={formik.values.imageUrl}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.imageUrl && Boolean(formik.errors.imageUrl)}
                helperText={
                  (formik.touched.imageUrl && formik.errors.imageUrl) ||
                  'URL of the character\'s image'
                }
                margin="normal"
                variant="outlined"
              />
              
              {formik.values.imageUrl && (
                <Box mt={2} mb={2} textAlign="center">
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Image Preview:
                  </Typography>
                  <Box
                    component="img"
                    src={formik.values.imageUrl}
                    alt="Character preview"
                    sx={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                    }}
                  />
                </Box>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={
                  (formik.touched.description && formik.errors.description) ||
                  'A brief description of the character (max 1000 characters)'
                }
                margin="normal"
                variant="outlined"
                multiline
                rows={6}
              />
              
              <Box mt={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Abilities & Powers
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Add an ability (e.g., Super Strength)"
                    value={newAbility}
                    onChange={(e) => setNewAbility(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={formik.isSubmitting}
                    sx={{ mr: 1 }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleAddAbility}
                    disabled={!newAbility.trim() || formik.isSubmitting}
                    startIcon={<AddIcon />}
                  >
                    Add
                  </Button>
                </Box>
                <FormHelperText>
                  Press Enter or click Add to add an ability
                </FormHelperText>
                
                <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                  {formik.values.abilities.map((ability, index) => (
                    <Chip
                      key={index}
                      label={ability}
                      onDelete={() => handleRemoveAbility(ability)}
                      color="primary"
                      variant="outlined"
                      size="small"
                      deleteIcon={<DeleteIcon />}
                    />
                  ))}
                  {formik.values.abilities.length === 0 && (
                    <Typography variant="caption" color="text.secondary">
                      No abilities added yet
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 4 }} />
          
          <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              disabled={formik.isSubmitting}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={formik.isSubmitting || !formik.isValid}
              sx={{ textTransform: 'none' }}
              startIcon={
                formik.isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {formik.isSubmitting
                ? isEdit
                  ? 'Updating...'
                  : 'Adding...'
                : isEdit
                ? 'Update Character'
                : 'Add Character'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CharacterForm;
