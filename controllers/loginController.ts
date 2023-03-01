import { Request, Response } from 'express';
import constants from '../configs/constants';
import jwt from 'jsonwebtoken';
import log from '../configs/winstonLogger';
import bcrypt from 'bcrypt';
import { make } from 'simple-body-validator';
import UsersRepository from '../repositories/UsersRepository';
import * as dotenv from 'dotenv';
dotenv.config();

interface loginInterface {
  id: Number;
  uuid: String;
  email: String;
  name: String;
  token: String;
  createdAt: String;
  updatedAt: String;
}

export const login = async (req: Request, res: Response) => {
  try {
    let { email, password } = req.body;

    const rules = {
      email: 'required|email',
      password: 'required',
    };

    const validator = make(req.body, rules);

    if (!validator.validate()) {
      return res.status(400).json({
        status: false,
        message: constants.VALIDATION_ERROR,
        errors: validator.errors().all(),
      });
    }

    const userRepo = new UsersRepository(req);
    const user = await userRepo.getUserByEmail(email);

    if (user) {
      // password validation
      const validPassword = await bcrypt.compare(password, user.password!); // ! 👈️ non-null assertion

      if (!validPassword) {
        throw 'The email or password invalid';
      } else {
        // create JWT token
        const tokenData = {
          id: user.id,
          uuid: user.uuid,
          email: user.email,
          name: user.name,
        };

        let token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY as string, {
          expiresIn: parseInt(process.env.JWT_EXPIRES_IN as string),
        });

        let refreshToken = jwt.sign(tokenData, process.env.JWT_REFRESH_TOKEN_KEY as string, {
          expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES_IN as string),
        });

        let resData: any = {};
        resData = user;
        resData.password = undefined;
        resData.token = token;
        resData.refreshToken = refreshToken;

        res.status(200).json({
          status: true,
          data: resData,
        });
      }
    } else {
      throw constants.DATA_NOT_FOUND;
    }
  } catch (err) {
    log.error(`${err} :: ${__filename}`);
    res.status(400).json({ status: false, message: constants.SOMETHING_WRONG, errors: err });
  }
};
