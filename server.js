import DBConnect from "./db_config.js"
import {errorMiddleware} from './utils//errorHandler.js'
import authrouter from "./routes/authRoutes.js"

import express from 'express'
import cors from 'cors'
import dotenv from "dotenv";


const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
dotenv.config();

app.use('/auth',authrouter)

DBConnect();

app.use(errorMiddleware);

app.listen(port,() => {
    console.log(`Sever run on port ${port}`);
})

