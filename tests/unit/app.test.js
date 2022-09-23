const request = require('supertest');

const app = require('../../src/app');

describe('app.js: requests for not found resources', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('should return 404 error if requested not existing route', () =>
    request(app).get('/non-existing-route').expect(404));
});
