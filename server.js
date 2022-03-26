import express from "express";
import router from "./views/router.js";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDb } from "./db/helpers.js";
import logger from "./middleware/logger.js"
import errorHandler from "./middleware/errorHandler.js"
async function startServer() {
    const app = express();
    dotenv.config();
    console.log(process.env)
    const PORT = process.env.PORT ? process.env.PORT : 4000;
    app.use(cors());
    app.use(express.json());
    app.use(logger);
    app.use(router);
    app.use(errorHandler);
    await connectToDb();
    app.listen(PORT, () => console.log(`hello express from port: ${PORT}`));
}
startServer()