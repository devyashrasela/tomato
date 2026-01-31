import FoodModel from "../models/foodModel.js";
import { deleteFromCloudinary } from "../config/cloudinary.js";

//add food item
const addFood = async (req, res) => {
    try {
        if (!req.cloudinaryResult) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        const foodItem = new FoodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: req.cloudinaryResult.secure_url,
            cloudinary_id: req.cloudinaryResult.public_id
        });

        await foodItem.save();

        res.status(201).json({
            success: true,
            message: "Food item added successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//list food items
const listFood = async (req, res) => {
    try {
        const foodItems = await FoodModel.find({});
        res.json({ success: true, foodItems: foodItems });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "error" });
    }
}

//Remove food item
const removeFood = async (req, res) => {
    try {
        const food = await FoodModel.findById(req.body.id);

        // Delete image from Cloudinary if cloudinary_id exists
        if (food.cloudinary_id) {
            await deleteFromCloudinary(food.cloudinary_id);
        }

        await FoodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food item removed successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

export { addFood, listFood, removeFood };