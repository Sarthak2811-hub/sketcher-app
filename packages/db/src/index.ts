import dotenv from "dotenv";
import { PrismaClient } from "../generated/client/index.js";

dotenv.config();

console.log("DATABASE_URL:", process.env.DATABASE_URL ? "SET" : "NOT SET");

export const prismaClient = new PrismaClient();

