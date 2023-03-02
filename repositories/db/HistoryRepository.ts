import { Request } from 'express';
import db from '../../configs/database';
import log from '../../configs/winstonLogger';
import Pagination from '../../lib/Pagination';
import WebsiteRepository from './WebsitesRepository';

export default class HistoryRepository {
  body: Request['body'];
  params: Request['params'];
  query: Request['query'];
  req: Request;

  constructor(req: Request) {
    this.body = req.body;
    this.params = req.params;
    this.query = req.query;
    this.req = req;
  }

  createHistory = async (uuid: string, message: string, status: string, code: number) => {
    try {
      const webRepo: WebsiteRepository = new WebsiteRepository(this.req);
      const web = await webRepo.getWebsiteByUUID(uuid);

      if (web) {
        const fields = {
          websiteId: web.id,
          message: message,
          status: status,
          code: code,
        };
        const data = await db.history.create({ data: this.body });

        return data;
      } else {
        return false;
      }
    } catch (err) {
      log.error(`${err} :: ${__filename}`);
    }
  };
}
