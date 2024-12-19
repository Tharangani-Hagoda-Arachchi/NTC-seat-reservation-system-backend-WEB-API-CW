import express from 'express';
import {signup,login} from '../controllers/authController.js';
import validateSignup from '../validators/userValidator.js';
import { refreshTokenGeneration } from '../controllers/authController.js';
const authrouter  = express.Router();

authrouter.post('/signup',validateSignup,signup);
authrouter.post('/login',login);
authrouter.post('/token',refreshTokenGeneration);

export default authrouter;


//signup swagger documentation

/**
 * @swagger
 * /api/auths/signup:
 *   post:
 *     summary: User Registration
 *     description: Create a new user account with validation rules for name, email, password, and role.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's  name (3-50 characters).
 *                 example: Nimal Perera
 *               email:
 *                 type: string
 *                 description: A valid email address.
 *                 example: nimal@example.com
 *               password:
 *                 type: string
 *                 description: >
 *                   A password that includes:
 *                   - At least 6 characters
 *                   - At least one uppercase letter
 *                   - At least one lowercase letter
 *                   - At least one number
 *                   - At least one special character
 *                 example: P@ssword123
 *               role:
 *                 type: string
 *                 description: |
 *                   User's role in the system. Must be one of:
 *                   - operator
 *                   - admin
 *                   - commuter
 *                 enum: [operator, admin, commuter]
 *                 example: operator
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully."
 *                
 *       400:
 *         description: Validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 errorType:
 *                   type: string
 *                   example: ValidationError
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - "Name must be at least 3 characters."
 *                     - "Role must be one of: operator, admin, commuter."
 *       409:
 *         description: Conflict error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 409
 *                 errorType:
 *                   type: string
 *                   example: ConflictError
 *                 message:
 *                   type: string
 *                   example: " email already exists."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 errorType:
 *                   type: string
 *                   example: ServerError
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */



//Login swagger documentation

