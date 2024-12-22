import express from 'express';
import { addAdmin,getAdminById,getAdmin,deleteAdmin,updateAdminEmailAndPassword } from '../controllers/adminController.js';
import validateAddAdmin from '../validators/adminValidator.js';
import { authorize, ensureAuthentication } from '../utils/authentication.js';
const adminrouter  = express.Router();

adminrouter.post('/admins',validateAddAdmin,addAdmin);
adminrouter.get('/admins/:adminId',getAdminById);
adminrouter.get('/admins',ensureAuthentication,authorize(['admin']),getAdmin);
adminrouter.delete('/admins/:adminId',deleteAdmin);
adminrouter.patch('/admins/:adminId',updateAdminEmailAndPassword);


export default adminrouter;

//add admin swagger documentation

/**
 * @swagger
 * /api/admins:
 *   post:
 *     summary: Add Adming
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


// get admin by id

/**
 * @swagger
 * /api/admins/{adminId}:
 *   get:
 *     summary: Search admin by admin ID
 *     description: Search bus admin by their ID.
 *     tags:
 *       - Admins
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the admin to retrieve.
 *     responses:
 *       200:
 *         description: Admin retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin retrieved successfully."
 *
 *       401:
 *         description: Authentication error.
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
 *                   example: 401
 *                 errorType:
 *                   type: string
 *                   example: AuthenticationError
 *                 message:
 *                   type: string
 *                   example: "Email or password is invalid."
 *       403:
 *         description: Authorization error.
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
 *                   example: 403
 *                 errorType:
 *                   type: string
 *                   example: AuthorizationError
 *                 message:
 *                   type: string
 *                   example: "Access Denied."
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

//get all admins
/**
 * @swagger
 * /api/admins:
 *   get:
 *     summary: Retrieve all admins
 *     description: Fetches a list of all admin users from the system.
 *     tags:
 *       - Admins
 *     responses:
 *       200:
 *         description: Admin retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin retrieved successfully."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server Error
 *       401:
 *         description: Authentication error.
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
 *                   example: 401
 *                 errorType:
 *                   type: string
 *                   example: AuthenticationError
 *                 message:
 *                   type: string
 *                   example: "Email or password is invalid."
 *       403:
 *         description: Authorization error.
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
 *                   example: 403
 *                 errorType:
 *                   type: string
 *                   example: AuthorizationError
 *                 message:
 *                   type: string
 *                   example: "Access Denied."
 */


//delete admin

/**
 * @swagger
 * /api/admins/{adminId}:
 *   delete:
 *     summary: Delete an admin by their ID
 *     description: Deletes an admin from the database by their unique admin ID.
 *     tags:
 *       - Admins
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         description: The unique ID of the admin to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin with ID NTC123 deleted successfully."
 *       404:
 *         description: Admin not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin with ID NTC123 not found."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 *       401:
 *         description: Authentication error
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
 *                   example: 401
 *                 errorType:
 *                   type: string
 *                   example: AuthenticationError
 *                 message:
 *                   type: string
 *                   example: "Email or password is invalid."
 *       403:
 *         description: Authorization error
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
 *                   example: 403
 *                 errorType:
 *                   type: string
 *                   example: AuthorizationError
 *                 message:
 *                   type: string
 *                   example: "Access Denied."
 */



/**
 * @swagger
 * /api/admins/{adminId}:
 *   patch:
 *     summary: Update an admin's email and password
 *     description: Updates only the email and password of an admin by their unique admin ID. The admin's name remains unchanged.
 *     tags:
 *       - Admins
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         description: The unique ID of the admin to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       name: admin
 *       description: The new admin details (email and password).
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminEmail:
 *                 type: string
 *                 example: "newemail@example.com"
 *               adminPassword:
 *                 type: string
 *                 example: "Newpassword123*"
 *     responses:
 *       200:
 *         description: Admin successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin with ID 12345 updated successfully."
 *                 updatedAdmin:
 *                   type: object
 *                   properties:
 *                     adminId:
 *                       type: string
 *                       example: "12345"
 *                     adminName:
 *                       type: string
 *                       example: "John Doe"
 *                     adminEmail:
 *                       type: string
 *                       example: "newemail@example.com"
 *       400:
 *         description: Bad request - email or password is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email and password are required."
 *       404:
 *         description: Admin not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin with ID 12345 not found."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 *       401:
 *         description: Authentication error
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
 *                   example: 401
 *                 errorType:
 *                   type: string
 *                   example: AuthenticationError
 *                 message:
 *                   type: string
 *                   example: "Email or password is invalid."
 *       403:
 *         description: Authorization error
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
 *                   example: 403
 *                 errorType:
 *                   type: string
 *                   example: AuthorizationError
 *                 message:
 *                   type: string
 *                   example: "Access Denied."
 */
