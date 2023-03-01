import { Request } from 'express';
import db from '../configs/database';
import log from '../configs/winstonLogger';

export default class WebsiteRepository {
  body: Request['body'];
  params: Request['params'];

  constructor(req: Request) {
    this.body = req.body;
    this.params = req.params;
  }

  createWebsite = async () => {
    try {
      const user = await db.websites.create({ data: this.body });
      return user;
    } catch (err) {
      log.error(`${err} :: ${__filename}`);
    }
  };
}
