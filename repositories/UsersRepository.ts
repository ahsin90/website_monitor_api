import { Request } from 'express';
import db from '../configs/database';
import bcrypt from 'bcrypt';

export default class UsersRepository {
  body: Request['body'];
  params: Request['params'];

  constructor(req: Request) {
    this.body = req.body;
    this.params = req.params;
  }

  createUser = async () => {
    try {
      this.body.repeatPassword = undefined;
      const user = await db.user.create({ data: this.body });
      return user;
    } catch (err) {
      console.log(err);
    }
  };

  getUserByEmail = async (email: string) => {
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    return user;
  };

  getByUUID = async (uuid: string) => {
    const user = await db.user.findUnique({
      where: {
        uuid: uuid,
      },
    });

    return user;
  };
}
