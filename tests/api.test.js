const request = require('supertest');
const app = require('../server');

describe('Weather API', () => {
  it('GET /weather без city → 400', async () => {
    const res = await request(app).get('/weather');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'City is required');
  });
});
