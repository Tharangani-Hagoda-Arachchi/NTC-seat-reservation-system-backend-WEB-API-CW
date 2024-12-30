import express from 'express';
import { addNewWeekDayTrip,addNewWeekendTrip,addNewSpecialTrip,getTripsDetails,getseatsDetailsById,updateNotProvidedSeats,cancelTrip,updateTripTime } from '../controllers/tripController.js';
import validateTrip from '../validators/tripValidator.js'
import { authorize, ensureAuthentication } from '../utils/authentication.js';
const triprouter  = express.Router();

triprouter.post('/trips/weekdays',ensureAuthentication,authorize(['admin']),validateTrip,addNewWeekDayTrip);
triprouter.post('/trips/weekends',ensureAuthentication,authorize(['admin']),validateTrip,addNewWeekendTrip);
triprouter.post('/trips/specials',ensureAuthentication,authorize(['admin']),validateTrip,addNewSpecialTrip);
triprouter.get('/trips/:startLocation/:endLocation/:date',getTripsDetails);
triprouter.get('/trips/:tripId/seats',getseatsDetailsById);
triprouter.patch('/trips/notProvidedSeats/:tripId',ensureAuthentication,authorize(['operator']),updateNotProvidedSeats);
triprouter.patch('/trips/update-trip-times/:tripId',ensureAuthentication,authorize(['admin']),updateTripTime);
triprouter.put('/trips/:tripId/cancel',ensureAuthentication,authorize(['operator']),cancelTrip);



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


// Update not provided seats by trip id
/**
 * @swagger
 * /api/trips/notProvidedSeats/{tripId}:
 *   patch:
 *     summary: Update not provided seat numbers
 *     description: Updates not provided seat numbers by trip Id.
 *     tags:
 *       - Trips
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         description: The unique Trip Id of the trip to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: The not provided seat numbers.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notProvidedSeats:
 *                 type: array
 *                 items:
 *                   type: integer
 *             example:
 *               notProvidedSeats: [1, 2, 3, 4]
 * 
 *     responses:
 *       200:
 *         description: Not provided seats successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Seats updated successfully."
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
 *                   example: "Validation failed."
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - "Start Location required"
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
 *                 
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
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
 *                   example: "Invalid token."
 * 
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

// cancel trip
/**
 * @swagger
 * /api/trips/{tripId}/cancel:
 *   put:
 *     summary: cancel trip by tripId
 *     description: Updates trip avalability to cancel using trip Id.
 *     tags:
 *       - Trips
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         description: The unique Trip Id of the trip to cancel.
 *         schema:
 *           type: string
 * 
 *     responses:
 *       200:
 *         description: trip successfully cancel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "trip canceled successfully."
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
 *                   example: "Validation failed."
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - "trpId required"
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
 *                   example: "trip already exists."
 *                 
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
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
 *                   example: "Invalid token."
 * 
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




// get trip info by start location, end location and date
/**
 * @swagger
 * /api/trips/{startLocation}/{endLocation}/{date}:
 *   get:
 *     summary: Search trips
 *     description: Search trips by start location, end location and date.
 *     tags:
 *       - Trips
 *     parameters:
 *       - in: path
 *         name: startLocation
 *         required: true
 *         description: Starting location of the trip
 *         schema:
 *           type: string
 *           example: "Glle"
 *       - in: path
 *         name: endLocation
 *         required: true
 *         description: Ending location of the trip
 *         schema:
 *           type: string
 *           example: "Colombo"
 *       - in: path
 *         name: date
 *         required: true
 *         description: Date of the trip 
 *         schema:
 *           type: string
 *           example: "2024-06-27"
 *     responses:
 *       200:
 *         description: Trip retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Routes retrieved successfully."
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
 *                   example: "ServerError"
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */




// get seats details tripID
/**
 * @swagger
 * /api/trips/{tripId}/seats:
 *   get:
 *     summary: get seat details bu trip id
 *     description: get seat details bu trip id.
 *     tags:
 *       - Trips
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *         description: trip ID of trip which want to check seats avalability.
 * 
 *     responses:
 *       200:
 *         description: seat details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "seats retrieved successfully."
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


// Update startTime and endTime
/**
 * @swagger
 * /api/trips/update-trip-times/{tripId}:
 *   patch:
 *     summary: Update trip times
 *     description: Updates trip times by trip Id.
 *     tags:
 *       - Trips
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         description: The unique Trip Id of the trip to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: The start and end time.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *                 example: "12:30"
 *               endTime:
 *                 type: string
 *                 example: "15:30"

 * 
 *     responses:
 *       200:
 *         description: time successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "time updated successfully."
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
 *                   example: "Validation failed."
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - "required"
 *                 
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
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
 *                   example: "Invalid token."
 * 
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
