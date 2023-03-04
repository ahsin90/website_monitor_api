import { config } from './conf';
import supertest from 'supertest';
// import app from '../app';

const app = config.urlTest;

let request: any;
let token: string = '';
let uuid: string = '';

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

// random string
let str: string = (Math.random() + 1).toString(36).substring(2);

const websiteData = {
  name: `Test ${str}`,
  url: `https://test-${str}.com`,
};

describe('Websites Test', () => {
  it('Create a website', (done) => {
    request
      .post('/auth/websites/create')
      .send(websiteData)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res: any) => {
        if (res.body.data.uuid) {
          uuid = res.body.data.uuid;
        } else {
          throw new Error('The UUID was not found');
        }
      })
      .end(function (err: any, res: any) {
        if (err) return done(err);
        return done();
      });
  });

  it('Update the website', (done) => {
    request
      .put(`/auth/websites/update/${uuid}`)
      .send(websiteData)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res: any) => {
        if (res.body.data.uuid) {
          uuid = res.body.data.uuid;
        } else {
          throw new Error('The UUID was not found');
        }
      })
      .end(function (err: any, res: any) {
        if (err) return done(err);
        return done();
      });
  });

  it('Get a single data', (done) => {
    request
      .get(`/auth/websites/get/${uuid}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res: any) => {
        if (res.body.data.uuid) {
          uuid = res.body.data.uuid;
        } else {
          throw new Error('The UUID was not found');
        }
      })
      .end(function (err: any, res: any) {
        if (err) return done(err);
        return done();
      });
  });

  it('Get list and search ', (done) => {
    request
      .get(`/auth/websites/list?limit=5&page=0&search=Test`)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res: any) => {
        if (res.body.data && res.body.data.totalItems > 0) {
          // console.log(res.body.data.rows);
        } else {
          throw new Error('The UUID was not found');
        }
      })
      .end(function (err: any, res: any) {
        if (err) return done(err);
        return done();
      });
  });

  it('Delete data', (done) => {
    request
      .delete(`/auth/websites/delete/${uuid}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res: any) => {
        if (res.body.data.uuid) {
          uuid = res.body.data.uuid;
        } else {
          throw new Error('The UUID was not found');
        }
      })
      .end(function (err: any, res: any) {
        if (err) return done(err);
        return done();
      });
  });
});
