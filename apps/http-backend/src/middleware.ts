import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export function middleware(req: Request & { userId?: number }, res: Response, next: NextFunction){
    const header = (req.headers.authorization ?? "") as string;
    const token = header.startsWith("Bearer ") ? header.slice(7) : header;

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        if(decoded && decoded.userId){
            req.userId = decoded.userId;
            next();
        } else {
            res.status(403).json({
                message: "Unauthorized"
            })
        }
    } catch(e) {
        res.status(403).json({
            message: "Unauthorized"
        })
    }

}