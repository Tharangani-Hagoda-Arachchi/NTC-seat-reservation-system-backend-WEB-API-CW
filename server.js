import DBConnect from "./db_config.js"
import {errorMiddleware} from './utils//errorHandler.js'
import { swaggerUi,swaggerDocs } from "./swagger.js";
import authrouter from "./routes/authRoutes.js"
import adminrouter from "./routes/adminRoutes.js";
import operatorrouter from "./routes/operatorRoute.js";
import busRouterouter from "./routes/busRouteroutes.js";
import busrouter from "./routes/busRoutes.js";
import triprouter from "./routes/tripRoutes.js";
import bookingrouter from "./routes/bookingRoutes.js";
import { fetchSwaggerJson, filterRoutes } from "./splitSwagger.js";
import { bookingAvalabilityCheckingJob } from "./cron/tripShedulerCron.js"; 
import { startBookingCleanupJob } from "./cron/bookingDeletioncron.js";

import express from 'express'
import cors from 'cors'
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const SWAGGER_URL = 'https://ntcbusreservation.me/api/swagger.json';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
dotenv.config();
app.use(cookieParser());

// server.js or app.js

app.get('/api', (req, res) => {
  res.send('<h1>Application is loading...</h1><p>Timestamp: ' + new Date().toISOString() + '</p>');
});


//start cron jobs
bookingAvalabilityCheckingJob();
startBookingCleanupJob();


//swager setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.get('/api/swagger.json', (req, res) => {
  res.json(swaggerDocs);
});

// Route to fetch and filter Swagger JSON for 'auth' routes
app.get('/api/auth-swagger.json', async (req, res) => {
  try {
      const swaggerJson = await fetchSwaggerJson(SWAGGER_URL);
      const filteredSwagger = filterRoutes(swaggerJson, 'auths');
      res.json(filteredSwagger);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.get('/api/route-swagger.json', async (req, res) => {
  try {
      const swaggerJson = await fetchSwaggerJson(SWAGGER_URL);
      const filteredSwagger = filterRoutes(swaggerJson, 'routes');
      res.json(filteredSwagger);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin-swagger.json', async (req, res) => {
  try {
      const swaggerJson = await fetchSwaggerJson(SWAGGER_URL);
      const filteredSwagger = filterRoutes(swaggerJson, 'admins');
      res.json(filteredSwagger);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.get('/api/operator-swagger.json', async (req, res) => {
  try {
      const swaggerJson = await fetchSwaggerJson(SWAGGER_URL);
      const filteredSwagger = filterRoutes(swaggerJson, 'operators');
      res.json(filteredSwagger);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.get('/api/bus-swagger.json', async (req, res) => {
  try {
      const swaggerJson = await fetchSwaggerJson(SWAGGER_URL);
      const filteredSwagger = filterRoutes(swaggerJson, 'buses');
      res.json(filteredSwagger);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});




app.use('/api/auths',authrouter)
app.use('/api',adminrouter)
app.use('/api',operatorrouter)
app.use('/api',busRouterouter)
app.use('/api',busrouter)
app.use('/api',triprouter)
app.use('/api',bookingrouter)


DBConnect();

app.use(errorMiddleware);

app.listen(port,() => {
    console.log(`Sever run on port ${port}`);
    console.log(`Server running on https://ntcbusreservation.me/api`);
  console.log(`Swagger docs available at https://ntcbusreservation.me/api-docs`);

})

