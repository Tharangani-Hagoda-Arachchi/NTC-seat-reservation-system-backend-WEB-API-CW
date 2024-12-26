import express from 'express';
import { addNewWeekDayTrip,addNewWeekendTrip,addNewSpecialTrip } from '../controllers/tripController.js';
import validateTrip from '../validators/tripValidator.js'
import { authorize, ensureAuthentication } from '../utils/authentication.js';
const triprouter  = express.Router();

triprouter.post('/trips/weekdays',ensureAuthentication,authorize(['admin']),validateTrip,addNewWeekDayTrip);
triprouter.post('/trips/weekends',ensureAuthentication,authorize(['admin']),validateTrip,addNewWeekendTrip);
triprouter.post('/trips/specials',ensureAuthentication,authorize(['admin']),validateTrip,addNewSpecialTrip);


export default triprouter;


//add new weekday trip swagger documentation

/**
 * @swagger
 * /api/trips/weekdays:
 *   post:
 *     summary: Add new trip
 *     description: Add a new trips for weekdays to upcoming 4 weeks.
 *     tags:
 *       - Trips
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startLocation
 *               - endLocation
 *               - startTime
 *               - endTime
 *               - totalTravellingTime
 *               - busNo
 *               - routeNo
 *               - stopedStation
 *             properties:
 *               startLocation:
 *                 type: string
 *                 description: start location No required.
 *                 example: Galle
 *               endLocation:
 *                 type: string
 *                 example: Colombo
 *               startTime:
 *                 type: string
 *                 example: 09:30
 *               endTime:
 *                 type: string
 *                 example: 14:00
 *               totalTravellingTime:
 *                 type: string
 *                 example: 3h 30m
 *               busNo:
 *                 type: string
 *                 example: NTD 789
 *               routeNo:
 *                 type: string
 *                 example: 256/8
 *               stoppedStations:
 *                 type: array
 *                 items:
 *                  type: object
 *                  properties:
 *                    name:
 *                       type: string
 *                       example: "Station X"
 *                    time:
 *                       type: string
 *                       format: time
 *                       example: "08:30"
 *     responses:
 *       201:
 *         description: trip added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Add new trips successfully."
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
 *                     - "start Location required"
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






//add new weekend trip swagger documentation

/**
 * @swagger
 * /api/trips/weekends:
 *   post:
 *     summary: Add new trip
 *     description: Add a new trips for weekends to upcoming 4 weeks.
 *     tags:
 *       - Trips
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startLocation
 *               - endLocation
 *               - startTime
 *               - endTime
 *               - totalTravellingTime
 *               - busNo
 *               - routeNo
 *               - stopedStation
 *             properties:
 *               startLocation:
 *                 type: string
 *                 description: start location No required.
 *                 example: Galle
 *               endLocation:
 *                 type: string
 *                 example: Colombo
 *               startTime:
 *                 type: string
 *                 example: 09:30
 *               endTime:
 *                 type: string
 *                 example: 14:00
 *               totalTravellingTime:
 *                 type: string
 *                 example: 3h 30m
 *               busNo:
 *                 type: string
 *                 example: NTD 789
 *               routeNo:
 *                 type: string
 *                 example: 256/8
 *               stoppedStations:
 *                 type: array
 *                 items:
 *                  type: object
 *                  properties:
 *                    name:
 *                       type: string
 *                       example: "Station X"
 *                    time:
 *                       type: string
 *                       format: time
 *                       example: "08:30"
 *     responses:
 *       201:
 *         description: trip added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Add new trips successfully."
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
 *                     - "start Location required"
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



//add new special trip swagger documentation

/**
 * @swagger
 * /api/trips/specials:
 *   post:
 *     summary: Add new trip
 *     description: Add a new special trips .
 *     tags:
 *       - Trips
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startLocation
 *               - endLocation
 *               - date
 *               - startTime
 *               - endTime
 *               - totalTravellingTime
 *               - busNo
 *               - routeNo
 *               - stopedStation
 *             properties:
 *               startLocation:
 *                 type: string
 *                 description: start location No required.
 *                 example: Galle
 *               endLocation:
 *                 type: string
 *                 example: Colombo
 *               date:
 *                 type: string
 *                 example: 2024-12-26 (YYYY-MM-DD)
 *               startTime:
 *                 type: string
 *                 example: 09:30
 *               endTime:
 *                 type: string
 *                 example: 14:00
 *               totalTravellingTime:
 *                 type: string
 *                 example: 3h 30m
 *               busNo:
 *                 type: string
 *                 example: NTD 789
 *               routeNo:
 *                 type: string
 *                 example: 256/8
 *               stoppedStations:
 *                 type: array
 *                 items:
 *                  type: object
 *                  properties:
 *                    name:
 *                       type: string
 *                       example: "Station X"
 *                    time:
 *                       type: string
 *                       format: time
 *                       example: "08:30"
 *     responses:
 *       201:
 *         description: trip added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Add new trips successfully."
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
 *                     - "start Location required"
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
