import express from "express";
import { addFood, listFood, removeFood } from "../controllers/food.controller.js";
import multer from "multer";
import { uploadToCloudinary } from "../config/cloudinary.js";

const foodRouter = express.Router();

// Use memory storage - works on both local and Vercel
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to upload image to Cloudinary
const uploadToCloud = async (req, res, next) => {
    try {
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            req.cloudinaryResult = result;
        }
        next();
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        res.status(500).json({ success: false, message: 'Image upload failed' });
    }
};

foodRouter.post("/add", upload.single('image'), uploadToCloud, addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);

export default foodRouter;


