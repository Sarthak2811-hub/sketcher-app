import dotenv from "dotenv";
dotenv.config();

import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware.js";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.post("/signup", async (req, res) => {

    const parseData = CreateUserSchema.safeParse(req.body);
    if (!parseData.success) {
        res.status(411).json({
            message: "Incorrect inputs"
        })
        return;
    }
    try {
        const hashedPassword = await bcrypt.hash(parseData.data.password, 10);
        const user = await prismaClient.user.create({
            data: {
                email: parseData.data?.username,
                password: hashedPassword,
                name: parseData.data.name,
                photo: ""
            }
        })

        res.status(201).json({
            userId: user.id
        })
    } catch (e) {
        console.error("Prisma error:", e);
        res.status(409).json({
            message: "User already exists with this username",
            error: String(e)
        })
    }

})

app.post("/signin", async (req, res) => {

    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(411).json({
            message: "Incorrect inputs"
        })
        return;
    }
    try {
        const user = await prismaClient.user.findFirst({
            where: { email: parsedData.data.username }
        })

        if (!user) {
            res.status(401).json({ message: "Invalid credentials" })
            return;
        }

        const passwordMatch = await bcrypt.compare(parsedData.data.password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ message: "Invalid credentials" })
            return;
        }

        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET,
            { expiresIn: "7d" }   // tokens now expire after 7 days
        );

        res.json({ token })
    } catch (e) {
        console.error("[HTTP] Signin error:", e);
        res.status(500).json({ message: "Server error during signin" })
    }
})

app.post("/room", middleware, async (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    const userId = (req as any).userId;
    if (!userId) {
        res.status(403).json({
            message: "Unauthorized"
        })
        return;
    }
    try {
        const room = await prismaClient.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: userId
            }
        })
        res.json({
            roomId: room.id
        })

    } catch (e) {
        res.status(411).json({
            message: "Room already exists with this name"
        })
    }


})

app.get("/chats/:roomId", async (req, res) => {
    try {
        const roomIdParam = req.params.roomId;
        let roomId = Number(roomIdParam);

        if (isNaN(roomId)) {
            const room = await prismaClient.room.findFirst({
                where: { slug: roomIdParam }
            });
            if (!room) {
                res.status(404).json({ message: "Room not found" });
                return;
            }
            roomId = room.id;
        }

        const messages = await prismaClient.chat.findMany({
            where: { roomId },
            orderBy: { id: "asc" },  // asc = oldest first, so canvas draws in correct order
            take: 1000
        });

        res.json({ messages });
    } catch (e) {
        console.error("[HTTP] Failed to fetch chats:", e);
        res.status(500).json({ message: "Failed to fetch shapes", messages: [] });
    }
})

app.get("/room/:slug", async (req, res) => {
    try {
        const slug = req.params.slug;
        let room = await prismaClient.room.findFirst({ where: { slug } });

        if (!room) {
            let firstUser = await prismaClient.user.findFirst();
            if (!firstUser) {
                console.log("[HTTP] No users found in database. Seeding default dev-user account...");
                const hashedPassword = await bcrypt.hash("password123", 10);
                firstUser = await prismaClient.user.create({
                    data: {
                        email: "dev-user@example.com",
                        password: hashedPassword,
                        name: "Dev User",
                        photo: ""
                    }
                });
            }
            room = await prismaClient.room.create({
                data: { slug, adminId: firstUser.id }
            });
            console.log(`[HTTP] Auto-created room '${slug}' for user ID ${firstUser.id}`);
        }

        res.json({ room })
    } catch (e) {
        console.error("[HTTP] Failed to fetch/create room:", e);
        res.status(500).json({ room: null, message: "Server error" })
    }
})

app.listen(3002);