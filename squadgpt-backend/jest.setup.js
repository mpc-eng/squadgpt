// Jest setup file
require('dotenv').config({ path: '.env.test' });

// Mock OpenAI API calls for testing
jest.mock('@langchain/openai', () => ({
  ChatOpenAI: jest.fn().mockImplementation(() => ({
    call: jest.fn().mockResolvedValue({ text: 'Mocked AI response' })
  }))
}));

// Global test timeout
jest.setTimeout(10000); 