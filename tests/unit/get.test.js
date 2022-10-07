const request = require('supertest');
const hash = require('../../src/hash');
const app = require('../../src/app');
const { readFragmentData } = require('../../src/model/data');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });
  // TODO: we'll need to add tests to check the contents of the fragments array later

  test('authenticated users get an empty fragments array', async () => {
    const res = await request(app).get('/v1/fragments/').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.fragments).toEqual([]);
  });

  test('authenticated user gets fragment array by ID', async () => {
    const req = await request(app)
      .post('/v1/fragments/')
      .auth('user1@email.com', 'password1')
      .send('This is a testing fragment')
      .set('Content-type', 'text/plain');
    const fragment = await readFragmentData(hash('user1@email.com'), req.body.fragment.id);
    const id = req.body.fragment.id;
    const res = await request(app)
      .get('/v1/fragments/' + id)
      .auth('user1@email.com', 'password1');

    expect(res.text).toBe(fragment.toString());
  });

  test('invalid ID for the GET request should give an appropriate error', async () => {
    const res = await request(app)
      .get('/v1/fragments/invalidID')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
    expect(res.body.error.message).toBe('Unknown Fragment');
  });
});
