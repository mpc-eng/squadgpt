const request = require('supertest');
const fastify = require('fastify')();

// Import the app
require('../src/index.js');

describe('API Endpoints', () => {
  beforeAll(async () => {
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(fastify.server)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('version');
    });
  });

  describe('POST /api/idea/submit', () => {
    it('should accept valid idea submission', async () => {
      const validIdea = {
        idea: 'A fitness tracking app for busy professionals',
        stage: 'Aperture',
        prdContext: 'Test context'
      };

      const response = await request(fastify.server)
        .post('/api/idea/submit')
        .send(validIdea)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
    });

    it('should reject invalid idea submission', async () => {
      const invalidIdea = {
        idea: '', // Empty idea
        stage: 'InvalidStage'
      };

      const response = await request(fastify.server)
        .post('/api/idea/submit')
        .send(invalidIdea)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should reject idea that is too long', async () => {
      const longIdea = {
        idea: 'A'.repeat(2001), // Exceeds max length
        stage: 'Aperture'
      };

      const response = await request(fastify.server)
        .post('/api/idea/submit')
        .send(longIdea)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/chat', () => {
    it('should accept valid chat message', async () => {
      const validChat = {
        message: 'Hello, can you help me with product discovery?',
        stage: 'Aperture',
        prdContext: 'Test context',
        conversationHistory: []
      };

      const response = await request(fastify.server)
        .post('/api/chat')
        .send(validChat)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('response');
    });

    it('should reject empty message', async () => {
      const invalidChat = {
        message: '',
        stage: 'Aperture'
      };

      const response = await request(fastify.server)
        .post('/api/chat')
        .send(invalidChat)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/prd/summarize', () => {
    it('should accept valid PRD summarization request', async () => {
      const validRequest = {
        section: 'problemStatement',
        content: 'Users struggle to track their fitness goals',
        stage: 'Discovery'
      };

      const response = await request(fastify.server)
        .post('/api/prd/summarize')
        .send(validRequest)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('summary');
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits', async () => {
      const requests = Array(101).fill().map(() => 
        request(fastify.server)
          .get('/health')
          .expect(200)
      );

      const responses = await Promise.all(requests);
      const lastResponse = responses[responses.length - 1];
      
      expect(lastResponse.status).toBe(429);
    });
  });
}); 