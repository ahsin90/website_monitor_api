import * as dotenv from 'dotenv';
dotenv.config();
import constants from '../configs/constants';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export function jwtVerify(req: Request, res: Response, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  //   check the token
  if (token == null) return res.status(401).json({ status: false, message: constants.UNAUTHORIZED });

  const jwtSecretKey = process.env.JWT_SECRET_KEY as string;

  const verify = jwt.verify(token, jwtSecretKey, async function (err, decoded) {
    // access forbidden
    if (err) return res.status(403).json({ status: false, message: constants.FORBIDEN_ACCESS });

    //access user from token
    let resData: any = {};
    resData = decoded;
    req.user = resData;

    next();
  });
}
