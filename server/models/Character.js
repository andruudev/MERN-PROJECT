const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for the character'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  anime: {
    type: String,
    required: [true, 'Please provide the anime name'],
    trim: true,
    maxlength: [100, 'Anime name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL'],
    match: [
      /^(https?:\/\/).+\.(jpg|jpeg|png|webp|gif|svg)$/i,
      'Please provide a valid image URL'
    ]
  },
  abilities: [{
    type: String,
    trim: true
  }],
  role: {
    type: String,
    enum: ['Protagonist', 'Antagonist', 'Supporting', 'Villain', 'Anti-Hero', 'Other'],
    default: 'Other'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add text index for search functionality
characterSchema.index({ name: 'text', anime: 'text', description: 'text' });

module.exports = mongoose.model('Character', characterSchema);
