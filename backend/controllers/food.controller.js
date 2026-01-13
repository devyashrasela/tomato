import FoodModel from "../models/foodModel.js";
import fs from "fs";

//add food item
const addFood = async (req, res) => {
    try {
        const image_filename = req.file?.filename;
        if (!image_filename) {
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
            image: image_filename
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
    try{
        const foodItems = await FoodModel.find({}); 
        res.json({success:true, foodItems:foodItems});
    }catch(error){
        console.error(error);
        res.json({ success:false, message:"error"});
    }
}

//Remove food item
const removeFood = async (req, res) => {
    try {
        const food = await FoodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, () => {});

        await FoodModel.findByIdAndDelete(req.body.id);
        res.json({ success:true, message:"Food item removed successfully" });
    }catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

export {addFood,listFood,removeFood};