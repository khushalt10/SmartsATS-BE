
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log("Testing DB connection...");
    try {
        await prisma.$connect();
        console.log("Successfully connected to DB!");
        const count = await prisma.application.count();
        console.log("Application count:", count);
    } catch (e) {
        console.error("Connection failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
