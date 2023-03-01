import { config } from './conf';
import supertest from 'supertest';
import app from '../app';
import * as fs from 'fs';

let request: any;
let token: string = '';

beforeAll(async () => {
  // login
  const user: any = await supertest(app)
    .post('/login')
    .send({ email: config.emailTest, password: config.passwordTest })
    .expect('Content-Type', /json/)
    .expect(async (res) => {
      if (!('data' in res.body)) throw new Error('The data attribute was not found in result');

      if (!('token' in res.body.data)) throw new Error('The token attribute was not found in result');

      if (res.body.data) {
        token = res.body.data.token;
      }
    });
});

beforeEach(async () => {
  request = supertest.agent(app).set('Authorization', 'bearer ' + token);
});

afterAll(() => {});

describe('Auth Test', () => {
  it('Get logged in user', (done) => {
    request
      .get('/auth/me')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res: any) => {
        if (res.body.data.email !== config.emailTest) {
          throw new Error('The email was not found');
        }
      })
      .end(function (err: any, res: any) {
        if (err) return done(err);
        return done();
      });
  });
});
