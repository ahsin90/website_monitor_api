import { Request, Response } from 'express';
import constants from '../../configs/constants';
import log from '../../configs/winstonLogger';
import { make } from 'simple-body-validator';
import WebsiteRepository from '../../repositories/db/WebsitesRepository';

export const createWebsite = async (req: Request, res: Response) => {
  try {
    // create validation
    const rules = {
      name: 'required',
      url: 'required|url',
    };

    // validate the request
    const validator = make(req.body, rules);
    if (!validator.validate()) {
      return res.status(400).json({
        status: false,
        message: constants.VALIDATION_ERROR,
        errors: validator.errors().all(),
      });
    }

    const webRepo: WebsiteRepository = new WebsiteRepository(req);

    const isUrl = await webRepo.getWebsiteByUrl(req.body.url);

    if (isUrl) {
      // The URL already in database
      throw 'The URL already in database';
    } else {
      const web = await webRepo.createWebsite();

      if (web) {
        // write http response
        res.status(200).json({ status: true, message: constants.DATA_CREATED, data: web });
      } else {
        throw constants.FAILED_CREATE_DATA;
      }
    }
  } catch (err) {
    log.error(`${err} :: ${__filename}`);
    res.status(400).json({ status: false, message: constants.SOMETHING_WRONG, errors: err });
  }
};

export const updateWebsite = async (req: Request, res: Response) => {
  try {
    // create validation
    const rules = {
      name: 'required',
      url: 'required|url',
    };

    // validate the request
    const validator = make(req.body, rules);
    if (!validator.validate()) {
      return res.status(400).json({
        status: false,
        message: constants.VALIDATION_ERROR,
        errors: validator.errors().all(),
      });
    }

    const webRepo: WebsiteRepository = new WebsiteRepository(req);

    const web = await webRepo.updateWebsite();

    if (web) {
      // write http response
      res.status(200).json({ status: true, message: constants.DATA_UPDATED, data: web });
    } else {
      throw constants.FAILED_UPDATE_DATA;
    }
  } catch (err) {
    log.error(`${err} :: ${__filename}`);
    res.status(400).json({ status: false, message: constants.SOMETHING_WRONG, errors: err });
  }
};

export const getWebsiteByUUID = async (req: Request, res: Response) => {
  try {
    const uuid = req.params.uuid;

    const webRepo: WebsiteRepository = new WebsiteRepository(req);

    const web = await webRepo.getWebsiteByUUID(uuid);

    if (web) {
      // write http response
      res.status(200).json({ status: true, message: null, data: web });
    } else {
      throw constants.DATA_NOT_FOUND;
    }
  } catch (err) {
    log.error(`${err} :: ${__filename}`);
    res.status(400).json({ status: false, message: constants.SOMETHING_WRONG, errors: err });
  }
};

export const listWebsite = async (req: Request, res: Response) => {
  try {
    const webRepo: WebsiteRepository = new WebsiteRepository(req);

    const web = await webRepo.listWebsite();
    // write http response
    res.status(200).json({ status: true, message: null, data: web });
  } catch (err) {
    log.error(`${err} :: ${__filename}`);
    res.status(400).json({ status: false, message: constants.SOMETHING_WRONG, errors: err });
  }
};

export const history = async (req: Request, res: Response) => {
  try {
    const webRepo: WebsiteRepository = new WebsiteRepository(req);

    const web = await webRepo.history();
    if (web) {
      // write http response
      res.status(200).json({ status: true, message: null, data: web });
    } else {
      throw constants.DATA_NOT_FOUND;
    }
  } catch (err) {
    log.error(`${err} :: ${__filename}`);
    res.status(400).json({ status: false, message: constants.SOMETHING_WRONG, errors: err });
  }
};

export const deleteWebsite = async (req: Request, res: Response) => {
  try {
    const webRepo: WebsiteRepository = new WebsiteRepository(req);

    const web = await webRepo.deleteWebsite();

    if (web) {
      // write http response
      res.status(200).json({ status: true, message: constants.DATA_DELETED, data: web });
    } else {
      throw constants.FAILED_DELETE_DATA;
    }
  } catch (err) {
    log.error(`${err} :: ${__filename}`);
    res.status(400).json({ status: false, message: constants.SOMETHING_WRONG, errors: err });
  }
};
