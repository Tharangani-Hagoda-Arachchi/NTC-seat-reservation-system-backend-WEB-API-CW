import express from 'express';
import {addRoute, getRouteByRouteNo,getRoute,deleteRoute,getRouteByStaratLocation} from '../controllers/busRouteController.js';
import validateRoute from '../validators/busRouteValidator.js';
import { authorize, ensureAuthentication } from '../utils/authentication.js';
const busRouterouter  = express.Router();

busRouterouter.post('/routes',ensureAuthentication,authorize(['admin']),validateRoute,addRoute);
busRouterouter.get('/routes/routeNo/:routeNo',getRouteByRouteNo);
busRouterouter.get('/routes',getRoute);
busRouterouter.get('/routes/startLocation/:startLocation',getRouteByStaratLocation);
busRouterouter.delete('/routes/:routeNo',ensureAuthentication,authorize(['admin']),deleteRoute);

export default busRouterouter;

//create new route swagger documentation

/**
 * @swagger
 * /api/routes:
 *   post:
 *     summary: Create new bus route
 *     description: Create a new bus route with validation rules for route no, start location, end location, and total distance in km.
 *     tags:
 *       - Bus Routes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - routeNo
 *               - startLocation
 *               - endLocation
 *               - totalDistanceIn_km
 *             properties:
 *               routeNo:
 *                 type: string
 *                 description: Route No required.
 *                 example: 372/6
 *               startLocation:
 *                 type: string
 *                 example: Galle
 *               endLocation:
 *                 type: string
 *                 example: Colombo
 *               totalDistanceIn_km:
 *                 type: number
 *                 example: 132
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
 *                   example: "Add new route successfully."
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
 *                     - "route no required and not exede 50 characters"
 *                     - "Start Location is required."
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
 *                   example: "Route already exists."
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



//get route by route no

/**
 * @swagger
 * /api/routes/routeNo/{routeNo}:
 *   get:
 *     summary: Search route by route No
 *     description: Search route by route No.
 *     tags:
 *       - Bus Routes
 *     parameters:
 *       - in: path
 *         name: routeNo
 *         required: true
 *         schema:
 *           type: string
 *         description: Route No of the route to retrieve.
 *     responses:
 *       200:
 *         description: route retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Route retrieved successfully."
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
 *
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



// get routes by start location
/**
 * @swagger
 * /api/routes/startLocation/{startLocation}:
 *   get:
 *     summary: Search route by start locatin
 *     description: Search route by start location.
 *     tags:
 *       - Bus Routes
 *     parameters:
 *       - in: path
 *         name: startLocation
 *         required: true
 *         schema:
 *           type: string
 *         description: Start Location of the route to retrieve.
 * 
 *     responses:
 *       200:
 *         description: routes retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Routes retrieved successfully."
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
 *
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


//get all routes
/**
 * @swagger
 * /api/routes:
 *   get:
 *     summary: Retrieve all routes
 *     description: Fetches a list of all bus routes from the system.
 *     tags:
 *       - Bus Routes
 *     responses:
 *       200:
 *         description: Routes retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Routes retrieved successfully."
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
 *
 */


//delete route

/**
 * @swagger
 * /api/routes/{routeNo}:
 *   delete:
 *     summary: Delete an route by their route NO
 *     description: Deletes an operator from the database by their unique route No.
 *     tags:
 *       - Bus Routes
 *     parameters:
 *       - in: path
 *         name: routeNo
 *         required: true
 *         description: The route No of the route to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Route successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Operator with no 123 deleted successfully."
 *       404:
 *         description: route not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "route with No 123 not found."
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

