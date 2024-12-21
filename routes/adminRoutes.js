import express from 'express';
import { addAdmin } from '../controllers/adminController.js';
import validateAddAdmin from '../validators/adminValidator.js';
//import { authorize, ensureAuthentication } from '../utils/authentication.js';
const adminrouter  = express.Router();

adminrouter.post('/admins',validateAddAdmin,addAdmin);

export default adminrouter;

//add admin swagger documentation

/**
 * @swagger
 * /api/admins:
 *   post:
 *     summary: Add Adding
 *     description: Add a new admin account with validation rules for id, name, email, password.
 *     tags:
 *       - Admins
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               -adminId
 *               - adminName
 *               - adminEmail
 *               - adminPassword
 *             properties:
 *               adminId:
 *                 type: string
 *                 description: Admin's ID (3-50 characters).
 *                 example: NTC-ADMIN-0001
 *               adminName:
 *                 type: string
 *                 description: Admin's name (3-50 characters).
 *                 example: Nimal Perera
 *               adminEmail:
 *                 type: string
 *                 description: A valid email address.
 *                 example: nimal@example.com
 *               adminPassword:
 *                 type: string
 *                 description: >
 *                   A password that includes:
 *                   - At least 6 characters
 *                   - At least one uppercase letter
 *                   - At least one lowercase letter
 *                   - At least one number
 *                   - At least one special character
 *                 example: P@ssword123
 *     responses:
 *       201:
 *         description: New Admin Added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "new admin added successfully."
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
 *                   example: "Validation failed."
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - "Name must be at least 3 characters."
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
 *                   example: "Email already exists."
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