// import * as dotenv from 'dotenv';
import supertest from 'supertest';
import app from '../app';

const request = supertest(app);

const emailTest = 'admin@mail.com';
const passwordTest = 'myPassword';

let userData = null;
describe('Login endpoint', () => {
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
          userData = res.body.data;
        }
      })
      .end(function (err, res) {
        if (err) return done(err);
        return done();
      });
  });
});

console.log(userData);
