import express from 'express';
import { addNewBus,deleteBus,updateBusPermitNo,updateBusByBusNo } from '../controllers/busController.js';
import validateAddBus from '../validators/busValidator.js';
import { authorize, ensureAuthentication } from '../utils/authentication.js';
const busrouter  = express.Router();

busrouter.post('/buses',ensureAuthentication,authorize(['admin','operator']),validateAddBus,addNewBus);
busrouter.delete('/buses/:permitNo',ensureAuthentication,authorize(['admin','operator']),deleteBus);
busrouter.put('/buses/:permitNo',ensureAuthentication,authorize(['admin','operator']),updateBusPermitNo);
busrouter.patch('/buses/:busNo',ensureAuthentication,authorize(['admin','operator']),updateBusByBusNo);

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




//delete bus

/**
 * @swagger
 * /api/buses/{permitNo}:
 *   delete:
 *     summary: Delete an bus by their permit NO
 *     description: Deletes a bus from the database by their unique permit no.
 *     tags:
 *       - Buses
 *     parameters:
 *       - in: path
 *         name: permitNo
 *         required: true
 *         description: The permit No of the bus to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bus successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bus with no 123 deleted successfully."
 *       404:
 *         description: bus not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "bus with permit No 123 not found."
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



//update all details by permit No
/**
 * @swagger
 * /api/buses/{permitNo}:
 *   put:
 *     summary: Update bus details
 *     description: Updates all details of busses by concidering permit No.
 *     tags:
 *       - Buses
 *     parameters:
 *       - in: path
 *         name: permitNo
 *         required: true
 *         description: The unique permit No of the bus to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       name: bus
 *       description: The new bus details .
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               busNo:
 *                 type: string
 *                 example: "NTB 987"
 *               busName:
 *                 type: string
 *                 example: "Asiri Travellers"
 *               busType:
 *                 type: string
 *                 example: "Luxury"
 *               driverRegisteredCode:
 *                 type: string
 *                 example: "6243566d8"
 *               conductorRegisteredCode:
 *                 type: string
 *                 example: "6243566c8"
 *               routeNo:
 *                 type: string
 *                 example: "372/6"
 *     responses:
 *       200:
 *         description: Bus successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bus with permit No 12345 updated successfully."
 *
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
 *                   example: "bus with ID 12345 not found."
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
 *                   example: "invalid token."
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




//update drive and conductor details by bus No
/**
 * @swagger
 * /api/buses/{busNo}:
 *   patch:
 *     summary: Update driver and condutors register codes 
 *     description: Updates driver and conductor code of busses by concidering bus No.
 *     tags:
 *       - Buses
 *     parameters:
 *       - in: path
 *         name: busNo
 *         required: true
 *         description: The unique Bus No of the bus to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       name: bus
 *       description: The new bus details .
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               driverRegisteredCode:
 *                 type: string
 *                 example: "6243566d9"
 *               conductorRegisteredCode:
 *                 type: string
 *                 example: "6243566c9"
 *     responses:
 *       200:
 *         description: Bus successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bus with bus No 12345 updated successfully."
 *
 *       400:
 *         description: Bad request - driver code or conductor code is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "driver code and conductor code required."
 *       404:
 *         description: bus not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "bus with No 12345 not found."
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
 *                   example: "invalid token."
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



