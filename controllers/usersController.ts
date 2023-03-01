import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { make } from 'simple-body-validator';
import UsersRepository from '../repositories/UsersRepository';

export const createUser = async (req: Request, res: Response) => {
  try {
    // create validation input
    const rules = {
      email: 'required|email',
      name: 'required',
      password: 'required|min:6',
      repeatPassword: 'required|same:password',
    };
    const validator = make(req.body, rules);
    if (!validator.validate()) {
      return res.status(400).json({
        status: false,
        message: 'validation error',
        errors: validator.errors().all(),
      });
    }
    // generate password's salt
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const userRepo: UsersRepository = new UsersRepository(req);

    // check the email if availabe
    const isEmail = await userRepo.getUserByEmail(req.body.email);

    if (isEmail) {
      // email already
      throw 'The email already in database';
    } else {
      const user = await userRepo.createUser();

      if (user) {
        // write http response
        res.status(200).json({ status: true, message: 'user created', data: user });
      } else {
        throw 'Failed to create user';
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: false, message: 'Errors!', errors: err });
  }
};
