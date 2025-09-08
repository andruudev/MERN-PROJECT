const express = require('express');
const router = express.Router();
const Character = require('../models/Character');

// @desc    Get all characters
// @route   GET /api/characters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, role, sort } = req.query;
    const query = {};
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    // Filter by role
    if (role) {
      query.role = role;
    }
    
    // Sorting
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'name-asc') sortOption = { name: 1 };
    if (sort === 'name-desc') sortOption = { name: -1 };
    if (sort === 'anime') sortOption = { anime: 1, name: 1 };
    
    const characters = await Character.find(query).sort(sortOption);
    res.json(characters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Get single character
// @route   GET /api/characters/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    res.json(character);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Character not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Create a character
// @route   POST /api/characters
// @access  Public (in a real app, you'd want to protect this route)
router.post('/', async (req, res) => {
  try {
    const { name, anime, description, imageUrl, abilities, role } = req.body;
    
    const newCharacter = new Character({
      name,
      anime,
      description,
      imageUrl,
      abilities: Array.isArray(abilities) ? abilities : [abilities].filter(Boolean),
      role: role || 'Other'
    });
    
    const character = await newCharacter.save();
    res.status(201).json(character);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ error: messages });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Update a character
// @route   PUT /api/characters/:id
// @access  Public (in a real app, you'd want to protect this route)
router.put('/:id', async (req, res) => {
  try {
    const { name, anime, description, imageUrl, abilities, role } = req.body;
    
    const characterFields = {
      name,
      anime,
      description,
      imageUrl,
      role: role || 'Other'
    };
    
    if (abilities) {
      characterFields.abilities = Array.isArray(abilities) 
        ? abilities 
        : [abilities].filter(Boolean);
    }
    
    let character = await Character.findById(req.params.id);
    
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    character = await Character.findByIdAndUpdate(
      req.params.id,
      { $set: characterFields },
      { new: true, runValidators: true }
    );
    
    res.json(character);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Character not found' });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ error: messages });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Delete a character
// @route   DELETE /api/characters/:id
// @access  Public (in a real app, you'd want to protect this route)
router.delete('/:id', async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    await character.remove();
    res.json({ message: 'Character removed' });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Character not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
