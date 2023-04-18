import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { UserIdWithToken } from './interfaces/User';

export default async (req: Request) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    return {
      _id: '',
      token: '',
      role: '',
    };
  }

  const token = bearer.split(' ')[1];

  if (!token) {
    return {
      _id: '',
      token: '',
      role: '',
    };
  }

  const userFromToken = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as UserIdWithToken;

  if (!userFromToken) {
    return {
      _id: '',
      token: '',
      role: '',
    };
  }

  userFromToken.token = token;

  return userFromToken;
};