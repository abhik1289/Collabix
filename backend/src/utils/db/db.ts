
import mongoose from "mongoose";
import { serverConfigEnv } from "../../configs/server.config";



export const connectDB = async () => {
    try {
        await mongoose.connect(serverConfigEnv.DB_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

