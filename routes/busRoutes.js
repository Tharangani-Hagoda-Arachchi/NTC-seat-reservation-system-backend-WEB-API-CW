import express from 'express';
import { addNewBus } from '../controllers/busController.js';
import validateAddBus from '../validators/busValidator.js';
import { authorize, ensureAuthentication } from '../utils/authentication.js';
const busrouter  = express.Router();

busrouter.post('/buses',ensureAuthentication,authorize(['admin','operator']),validateAddBus,addNewBus);

export default busrouter;


//add new bus swagger documentation

/**
 * @swagger
 * /api/buses:
 *   post:
 *     summary: Add new bus 
 *     description: Add a new bus  with validation rules .
 *     tags:
 *       - Buses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permitNo
 *               - busNo
 *               - busName
 *               - busType
 *               - driverRegisteredCode
 *               - conductorRegisteredCode
 *               - routeNo
 *             properties:
 *               permitNo:
 *                 type: string
 *                 description: permit No required.
 *                 example: 163456
 *               busNo:
 *                 type: string
 *                 example: NTD 6576
 *               busName:
 *                 type: string
 *                 example: Sigiri travellers
 *               busType:
 *                 type: string
 *                 example: Luxury
 *               driverRegisteredCode:
 *                 type: string
 *                 example: Dr54673
 *               conductorRegisteredCode:
 *                 type: string
 *                 example: cn54673
 *               routeNo:
 *                 type: string
 *                 example: 256/8
 *     responses:
 *       201:
 *         description: Bus added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Add new bus successfully."
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
 *                     - "permitNo required"
 *                     
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
 *                   example: "Bus already exists."
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
