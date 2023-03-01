import { Request, Response } from 'express';
import log from '../../configs/winstonLogger';
import UsersRepository from '../../repositories/UsersRepository';

export const me = async (req: Request, res: Response) => {
  try {
    const auth: any = req.user;

    const userRepo: UsersRepository = new UsersRepository(req);
    const user = await userRepo.getByUUID(auth.uuid);

    let me: any = {};
    me = user;
    me.password = undefined;

    res.status(200).json({ status: true, message: null, data: me });
  } catch (err) {
    log.error(`${err} :: ${__filename}`);
    res.status(400).json({ status: false, message: 'Errors!', errors: err });
  }
};
