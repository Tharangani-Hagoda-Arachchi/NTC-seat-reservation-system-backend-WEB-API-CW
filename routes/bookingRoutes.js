import express from 'express';
import { bookingSeats,bookingPayment,bookingCancel,getBookingsByCommuterId } from '../controllers/bookinController.js';
import validateBookings from '../validators/bookingValidator.js';
import { authorize, ensureAuthentication } from '../utils/authentication.js';
const bookingrouter  = express.Router();

bookingrouter.post('/bookings/:tripId',ensureAuthentication,validateBookings,bookingSeats);
bookingrouter.post('/bookings/payments/:bookingReferenceNo',ensureAuthentication,bookingPayment);
bookingrouter.patch('/bookings/:bookingReferenceNo',ensureAuthentication,bookingCancel);
bookingrouter.get('/bookings/commuter',ensureAuthentication,authorize(['commuter']),getBookingsByCommuterId);

export default bookingrouter;


//booking using trip id
/**
 * @swagger
 * /api/bookings/{tripId}:
 *   post:
 *     summary: make bookings by tripId 
 *     description: make bookings by tripId 
 *     tags:
 *       - Bookings
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         description: The tripId which want to book.
 *         schema:
 *           type: string
 *     requestBody:
 *       name: bookings
 *       description: The booking details.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingSeatNo:
 *                 type: array
 *                 items:
 *                   type: integer
 *               commuterName:
 *                 type: string
 *               commuterPhoneNo:
 *                 type: number
 *               commuterEmail:
 *                 type: string
 *               bordingPlace:
 *                 type: string
 *               destinationPlace:
 *                 type: string
 *             example:
 *               bookingSeatNo: [1, 2, 3, 4]
 *               commuterName: "Nimal"
 *               commuterPhoneNo: 0765671356
 *               commuterEmail: "Nimal@gmail.com"
 *               bordingPlace: "Galle"
 *               destinationPlace: "Colombo"
 *     responses:
 *       200:
 *         description: Booking successfully 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "booking successfully."
 *       400:
 *         description: Bad request - required field missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: " required."
 *       404:
 *         description: trip not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "trip with No 12345 not found."
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
 */


//booking payments
/**
 * @swagger
 * /api/bookings/payments/{bookingReferenceNo}:
 *   post:
 *     summary: make payments
 *     description: make payment using booking ref no 
 *     tags:
 *       - Bookings
 *     parameters:
 *       - in: path
 *         name: bookingReferenceNo
 *         required: true
 *         description: The booking reference no which want to do payments.
 *         schema:
 *           type: string
 *     requestBody:
 *       name: payments
 *       description: The payment details.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentAmount:
 *                 type: number
 *                 example: 1200.00
 *     responses:
 *       200:
 *         description: payment successfully 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "payment successfully and booking confirmed."
 *       400:
 *         description: Bad request - required field missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: " required."
 *       404:
 *         description: booking not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "booking with No 12345 not found."
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
 */


//booking cancel
/**
 * @swagger
 * /api/bookings/{bookingReferenceNo}:
 *   patch:
 *     summary: booking cancel
 *     description: booking cancel
 *     tags:
 *       - Bookings
 *     parameters:
 *       - in: path
 *         name: bookingReferenceNo
 *         required: true
 *         description: The booking reference no which want to do payments.
 *         schema:
 * 
 *     responses:
 *       200:
 *         description: booking cancel successfully 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "booking cancel successfully."
 *       400:
 *         description: Bad request - required field missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: " required."
 *       404:
 *         description: booking not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "booking with No 12345 not found."
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
 */



//get bookingaccording to commuterId 

/**
 * @swagger
 * /api/bookings/commuter:
 *   get:
 *     summary: Get bookings according to commuterId
 *     description: Retrieve bookings associated with a specific commuterId.
 *     tags:
 *       - Commuter Bookings
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bookings retrieved successfully."
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

