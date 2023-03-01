// import * as dotenv from 'dotenv';
import supertest from 'supertest';
import app from '../app';

const request = supertest(app);

const emailTest = 'admin@mail.com';
const passwordTest = 'myPassword';

let token: string = '';
describe('Auth Test', () => {
  it('POST Login', (done) => {
    const request = supertest(app)
      .post('/login')
      .send({ email: emailTest, password: passwordTest })
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        if (!('data' in res.body)) throw new Error('The data attribute was not found in result');

        if (!('token' in res.body.data)) throw new Error('The token attribute was not found in result');

        if (res.body.data) {
          token = res.body.data.token;
        }
      })
      .end(function (err, res) {
        if (err) return done(err);
        return done();
      });
  });

  it('Get logged in user', (done) => {
    const request = supertest(app)
      .get('/auth/me')
      .auth(token, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        if (res.body.data.email !== emailTest) {
          throw new Error('The email was not found');
        }
      })
      .end(function (err, res) {
        if (err) return done(err);
        return done();
      });
  });
});
