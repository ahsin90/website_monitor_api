import { Request } from 'express';
import db from '../../configs/database';
import log from '../../configs/winstonLogger';
import Pagination from '../../lib/Pagination';

export default class WebsiteRepository {
  body: Request['body'];
  params: Request['params'];
  query: Request['query'];

  constructor(req: Request) {
    this.body = req.body;
    this.params = req.params;
    this.query = req.query;
  }

  createWebsite = async () => {
    try {
      const user = await db.websites.create({ data: this.body });
      return user;
    } catch (err) {
      log.error(`${err} :: ${__filename}`);
    }
  };

  getWebsiteByUrl = async (url: string) => {
    const web = await db.websites.findUnique({
      where: {
        url: url,
      },
    });

    return web;
  };

  getWebsiteByUUID = async (uuid: string) => {
    const web = await db.websites.findUnique({
      where: {
        uuid: uuid,
      },
    });

    return web;
  };

  updateWebsite = async () => {
    try {
      const uuid = this.params.uuid;

      const isWeb = await this.getWebsiteByUUID(uuid);

      if (isWeb) {
        // update data
        const web = await db.websites.update({
          where: {
            id: isWeb.id,
          },
          data: this.body,
        });

        return web;
      } else {
        return false;
      }
    } catch (err) {
      log.error(`${err} :: ${__filename}`);
    }
  };

  listWebsite = async () => {
    try {
      const limit: number = this.query.limit ? +this.query.limit : 10;
      const page: number = this.query.page ? +this.query.page : 0;
      const search: any = this.query.search;

      const results = await db.websites.findMany({
        skip: page,
        take: limit,
        where: {
          name: {
            startsWith: search,
          },
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      });

      const count = await db.websites.count({
        select: {
          _all: true, // Count all records
        },
      });

      const preData = {
        rows: results,
        count: count._all,
      };

      const pagination: Pagination = new Pagination(limit, page);
      const data = pagination.data(preData);

      return data;
    } catch (err) {
      log.error(`${err} :: ${__filename}`);
    }
  };

  deleteWebsite = async () => {
    try {
      const uuid = this.params.uuid;

      const isWeb = await this.getWebsiteByUUID(uuid);

      if (isWeb) {
        // delete data
        const del = await db.websites.delete({
          where: {
            id: isWeb.id,
          },
        });

        return del;
      } else {
        return false;
      }
    } catch (err) {
      log.error(`${err} :: ${__filename}`);
    }
  };
}
