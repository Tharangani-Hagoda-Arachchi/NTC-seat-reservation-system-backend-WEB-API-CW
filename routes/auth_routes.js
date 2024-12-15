import express from 'express';
import {signup,login} from '../controllers/auth_controller.js';
import validateSignup from '../validators/user_validator.js';
const authrouter  = express.Router();

authrouter.post('/signup',validateSignup,signup);
authrouter.post('/login',login);

export default authrouter;