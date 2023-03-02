import express from 'express';
import { jwtVerify } from '../middleware/auth';
import { createUser } from '../controllers/usersController';
import { login } from '../controllers/loginController';
import { me } from '../controllers/auth/meController';
import {
  createWebsite,
  updateWebsite,
  getWebsiteByUUID,
  listWebsite,
  deleteWebsite,
} from '../controllers/auth/websitesController';

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
router.get('/auth/me', me);

router.post('/auth/websites/create', createWebsite);
router.put('/auth/websites/update/:uuid', updateWebsite);
router.get('/auth/websites/get/:uuid', getWebsiteByUUID);
router.get('/auth/websites/list', listWebsite);
router.delete('/auth/websites/delete/:uuid', deleteWebsite);

export default router;
