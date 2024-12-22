import express from 'express';
import { addOperator,getOperatorById,getOperator,deleteOperator,updateOperatorEmailAndPassword } from '../controllers/operatorController.js';
import validateOperator from '../validators/operatorValidator.js';
//import { authorize, ensureAuthentication } from '../utils/authentication.js';
const operatorrouter  = express.Router();

operatorrouter.post('/operators',validateOperator,addOperator);
operatorrouter.get('/operators/:operatorRegisteredId',getOperatorById);
operatorrouter.get('/operators',getOperator);
operatorrouter.delete('/operators/:operatorRegisteredId',deleteOperator);
operatorrouter.patch('/operators/:operatorRegisteredId',updateOperatorEmailAndPassword);

export default operatorrouter;



//add operator swagger documentation

/**
 * @swagger
 * /api/operators:
 *   post:
 *     summary: Add Operator
 *     description: Add a new operator account with validation rules for id, name, email, password and phone no.
 *     tags:
 *       - Operators
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               -operatorRegisteredId
 *               - operatorName
 *               - operatorEmail
 *               - operatorPassword
 *               - operatorPhoneNo
 *             properties:
 *               operatorRegisteredId:
 *                 type: string
 *                 description: OperatorID's ID (3-50 characters).
 *                 example: NTC-OPE-0001
 *               operatorName:
 *                 type: string
 *                 description: Operators's name (3-50 characters).
 *                 example: Nimal Perera
 *               operatorEmail:
 *                 type: string
 *                 description: A valid email address.
 *                 example: nimal@example.com
 *               operatorPassword:
 *                 type: string
 *                 description: >
 *                   A password that includes:
 *                   - At least 6 characters
 *                   - At least one uppercase letter
 *                   - At least one lowercase letter
 *                   - At least one number
 *                   - At least one special character
 *                 example: P@ssword123
*               operatorPhoneNo:
 *                 type: Number
 *                 description: Phone No should be valid no (10 numbers).
 *                 example: 0771111111
 *     responses:
 *       201:
 *         description: New Operator Added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "new Operator added successfully."
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




// get operator by id

/**
 * @swagger
 * /api/operators/{operatorRegisteredId}:
 *   get:
 *     summary: Search operator by operator ID
 *     description: Search operator by their ID.
 *     tags:
 *       - Operators
 *     parameters:
 *       - in: path
 *         name: operatorRegisteredId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the operator to retrieve.
 *     responses:
 *       200:
 *         description: Operator retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Operator retrieved successfully."
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
 *                   example: "Token invalid."
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

//get all operators
/**
 * @swagger
 * /api/operators:
 *   get:
 *     summary: Retrieve all operators
 *     description: Fetches a list of all operator users from the system.
 *     tags:
 *       - Operators
 *     responses:
 *       200:
 *         description: Operators retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Operators retrieved successfully."
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
 *                   example: "token invalid."
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


//delete operator

/**
 * @swagger
 * /api/operators/{operatorRegisteredId}:
 *   delete:
 *     summary: Delete an Operator by their ID
 *     description: Deletes an operator from the database by their unique admin ID.
 *     tags:
 *       - Operators
 *     parameters:
 *       - in: path
 *         name: operatorRegisteredId
 *         required: true
 *         description: The unique ID of the operator to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Operator successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Operator with ID NTC123 deleted successfully."
 *       404:
 *         description: operator not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Operator with ID NTC123 not found."
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
 *                   example: "access token invalid."
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
 * /api/operators/{operatorRegisteredId}:
 *   patch:
 *     summary: Update an operator's email, phone number, and password
 *     description: Updates only the email, phone number, and password of an operator by their unique operator ID. The operator's name remains unchanged.
 *     tags:
 *       - Operators
 *     parameters:
 *       - in: path
 *         name: operatorRegisteredId
 *         required: true
 *         description: The unique ID of the operator to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: The new operator details (email, phone number, and password).
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               operatorEmail:
 *                 type: string
 *                 example: "newemail@example.com"
 *               operatorPassword:
 *                 type: string
 *                 example: "Newpassword123*"
 *               operatorPhoneNo:
 *                 type: string
 *                 example: "0771111111"
 *     responses:
 *       200:
 *         description: Operator successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Operator with ID 12345 updated successfully."
 *                 updatedOperator:
 *                   type: object
 *                   properties:
 *                     operatorRegisteredId:
 *                       type: string
 *                       example: "12345OP"
 *                     operatorName:
 *                       type: string
 *                       example: "John Doe"
 *                     operatorEmail:
 *                       type: string
 *                       example: "newemail@example.com"
 *                     operatorPhoneNo:
 *                       type: string
 *                       example: "0761111111"
 *       404:
 *         description: Operator not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Operator with ID 12345 not found."
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
 *                   example: "Invalid token."
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
 *       400:
 *         description: Validation error
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
 *                     - "Email must be a valid email address."
 *                     - "Password must be at least 8 characters."
 */
