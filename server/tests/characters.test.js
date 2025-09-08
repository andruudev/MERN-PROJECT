const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const Character = require('../models/Character');

// Test data
const testCharacter = {
  name: 'Naruto Uzumaki',
  anime: 'Naruto',
  description: 'A young ninja who seeks recognition from his peers and dreams of becoming the Hokage.',
  imageUrl: 'https://example.com/naruto.jpg',
  role: 'Protagonist',
  abilities: ['Rasengan', 'Shadow Clone Jutsu', 'Sage Mode']
};

let testCharacterId;

// Setup in-memory database before tests
beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// Clear test data after each test
afterEach(async () => {
  await Character.deleteMany({});
});

// Disconnect from database after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
  app.close();
});

describe('Character API', () => {
  // Test GET /api/characters
  describe('GET /api/characters', () => {
    it('should return all characters', async () => {
      // Create test characters
      await Character.create([
        { ...testCharacter },
        { 
          name: 'Sasuke Uchiha', 
          anime: 'Naruto',
          description: 'A skilled ninja seeking revenge against his brother.',
          imageUrl: 'https://example.com/sasuke.jpg',
          role: 'Anti-Hero',
          abilities: ['Sharingan', 'Chidori', 'Amaterasu']
        }
      ]);

      const res = await request(app).get('/api/characters');
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(2);
      expect(res.body[0].name).toBe(testCharacter.name);
    });

    it('should filter characters by role', async () => {
      // Create test characters with different roles
      await Character.create([
        { ...testCharacter, role: 'Protagonist' },
        { 
          name: 'Madara Uchiha', 
          anime: 'Naruto',
          description: 'A legendary leader of the Uchiha clan.',
          imageUrl: 'https://example.com/madara.jpg',
          role: 'Antagonist',
          abilities: ['Sharingan', 'Rinnegan', 'Susanoo']
        }
      ]);

      const res = await request(app).get('/api/characters?role=Protagonist');
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(1);
      expect(res.body[0].role).toBe('Protagonist');
    });

    it('should search characters by name', async () => {
      // Create test characters
      await Character.create([
        { ...testCharacter, name: 'Naruto Uzumaki' },
        { 
          name: 'Sasuke Uchiha', 
          anime: 'Naruto',
          description: 'A skilled ninja seeking revenge against his brother.',
          imageUrl: 'https://example.com/sasuke.jpg',
          role: 'Anti-Hero',
          abilities: ['Sharingan', 'Chidori', 'Amaterasu']
        }
      ]);

      const res = await request(app).get('/api/characters?search=Uchiha');
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Sasuke Uchiha');
    });
  });

  // Test GET /api/characters/:id
  describe('GET /api/characters/:id', () => {
    it('should return a single character', async () => {
      const character = await Character.create(testCharacter);
      
      const res = await request(app).get(`/api/characters/${character._id}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toBe(character.name);
      expect(res.body.anime).toBe(character.anime);
    });

    it('should return 404 if character not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/characters/${nonExistentId}`);
      
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Character not found');
    });

    it('should return 400 for invalid ID format', async () => {
      const res = await request(app).get('/api/characters/invalid-id');
      
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Invalid ID format');
    });
  });

  // Test POST /api/characters
  describe('POST /api/characters', () => {
    it('should create a new character', async () => {
      const res = await request(app)
        .post('/api/characters')
        .send(testCharacter);
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toBe(testCharacter.name);
      expect(res.body.anime).toBe(testCharacter.anime);
      expect(res.body.role).toBe(testCharacter.role);
      expect(res.body.abilities).toEqual(expect.arrayContaining(testCharacter.abilities));
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/characters')
        .send({ name: 'Incomplete Character' });
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  // Test PUT /api/characters/:id
  describe('PUT /api/characters/:id', () => {
    it('should update a character', async () => {
      const character = await Character.create(testCharacter);
      const updates = {
        name: 'Naruto Uzumaki (Hokage)',
        role: 'Hokage',
        abilities: [...testCharacter.abilities, 'Kurama Mode']
      };

      const res = await request(app)
        .put(`/api/characters/${character._id}`)
        .send(updates);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe(updates.name);
      expect(res.body.role).toBe(updates.role);
      expect(res.body.abilities).toEqual(expect.arrayContaining(updates.abilities));
    });

    it('should return 404 if character to update is not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/characters/${nonExistentId}`)
        .send({ name: 'Updated Name' });
      
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Character not found');
    });
  });

  // Test DELETE /api/characters/:id
  describe('DELETE /api/characters/:id', () => {
    it('should delete a character', async () => {
      const character = await Character.create(testCharacter);
      
      const res = await request(app).delete(`/api/characters/${character._id}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Character deleted successfully');
      
      // Verify the character is deleted
      const deletedCharacter = await Character.findById(character._id);
      expect(deletedCharacter).toBeNull();
    });

    it('should return 404 if character to delete is not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/characters/${nonExistentId}`);
      
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Character not found');
    });
  });
});
