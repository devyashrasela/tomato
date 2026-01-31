import express from "express";
import {addFood,listFood,removeFood} from "../controllers/food.controller.js"
import multer from "multer";

const foodRouter = express.Router();

//Image Storage Engine - Use memory storage for Vercel (read-only filesystem)
const isVercel = process.env.VERCEL === '1';

let storage;
if (isVercel) {
    // Memory storage for Vercel - files available in req.file.buffer
    storage = multer.memoryStorage();
} else {
    // Disk storage for local development
    storage = multer.diskStorage({
        destination: "uploads",
        filename: (req, file, cb) => {
            return cb(null, `${Date.now()}${file.originalname}`);
        }
    });
}

const upload = multer({ storage: storage });

foodRouter.post("/add",upload.single('image'),addFood);
foodRouter.get("/list",listFood);
foodRouter.post("/remove",removeFood);

export default foodRouter;

