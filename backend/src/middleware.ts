import { NextFunction, Request , Response } from "express"
import jwt from 'jsonwebtoken';
import config from "./config";

export const userMiddlerware = (req:Request, res:Response , next: NextFunction) =>{
        const header = req.headers["authorization"];
        const decoded = jwt.verify(header as string, config.JWT_SECRET)

        if (decoded){
            //@ts-ignore
            req.userId = decoded.id;
            next()

        }else{
            res.status(403).json({
                message: "you are not logged in"
            })
        }
}