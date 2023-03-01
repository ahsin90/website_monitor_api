import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes/indexRoute';
// import db from './configs/database';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(router);

Promise.all([testDB()])
  .then((x) => {
    startServer();
  })
  .catch((x) => {
    console.log('[APP] Could not start server because of error in DB connection.');
  });

function startServer() {
  app.listen(port, () => {
    console.log(`[APP] Listening on port ${port}`);
  });
}

function testDB() {
  return true;
  // return new Promise(async (resolve, reject) => {
  //   try {
  //     await db.authenticate();
  //     console.log('[DB] Connection has been established successfully.');
  //     resolve(true);
  //   } catch (error) {
  //     console.error('[DB] Unable to connect to the database:', error);
  //     reject(error);
  //   }
  // });
}
