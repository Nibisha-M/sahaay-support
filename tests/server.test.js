const request = require('supertest');
const server = require('../server');

describe('Sahaay V3 Backend API Tests', () => {
  describe('Security & Static Routing', () => {
    it('GET / should return 200 and include security headers', async () => {
      const res = await request(server).get('/');
      expect(res.statusCode).toEqual(200);
      expect(res.headers).toHaveProperty('x-frame-options', 'DENY');
      expect(res.headers).toHaveProperty('x-content-type-options', 'nosniff');
      expect(res.headers).toHaveProperty('content-security-policy');
      expect(res.text).toContain('Sahaay Support');
    });

    it('GET /patient should return the Patient Dashboard', async () => {
      const res = await request(server).get('/patient');
      expect(res.statusCode).toEqual(200);
      expect(res.text).toContain('Patient Dashboard');
    });
  });

  describe('Crisis API /crises', () => {
    it('POST /crises should return 400 for invalid JSON payload', async () => {
      const res = await request(server)
        .post('/crises')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }');
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Invalid JSON payload');
    });

    it('POST /crises should return a valid crisis response for valid JSON', async () => {
      const payload = {
        trigger_tile: 'Overdose Emergency',
        district: 'Ernakulam'
      };
      const res = await request(server)
        .post('/crises')
        .set('Content-Type', 'application/json')
        .send(payload);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('distress_score', 10);
      expect(res.body.emergency_script).toContain('Ernakulam');
      expect(res.body).toHaveProperty('call_helpline', true);
    });
  });

  describe('Radar API /safety_resources', () => {
    it('GET /safety_resources should return filtered results by district', async () => {
      const res = await request(server).get('/safety_resources?district=Thrissur');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('district', 'Thrissur');
      expect(res.body.resources).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ district: 'Thrissur' })
        ])
      );
    });
  });
});
