import express from 'express';
import { jwtVerify } from '../middleware/auth';
import { createUser } from '../controllers/usersController';
import { login } from '../controllers/loginController';

const router = express.Router();

router.get('/', function (req, res) {
  res.status(200).json({
    status: true,
    message: 'Hello :)',
  });
});

router.post('/login', login);

// admin routes
router.use('/auth', jwtVerify);

router.post('/auth/user', createUser);

export default router;
