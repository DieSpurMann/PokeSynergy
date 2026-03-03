import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: 'utils.conf' });

export const url: string = process.env['DBLINK'] ? process.env['DBLINK'] : '';


export async function connectToDatabase(url: string): Promise<void> {
    try {
        await mongoose.connect(url);
        console.log("Connected to the database successfully!");
    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1);
    }
}

export async function disconnectFromDatabase(): Promise<void> {
    try {
        await mongoose.disconnect();
        console.log("Disconnected from the database successfully!");
    } catch (error) {
        console.error("Error disconnecting from the database:", error);
    }
}


