import express from 'express';
import {signup,login} from '../controllers/authController.js';
import validateSignup from '../validators/userValidator.js';
const authrouter  = express.Router();

authrouter.post('/signup',validateSignup,signup);
authrouter.post('/login',login);

export default authrouter;