import userModel from "../models/userModel.js";

const addToCart = async (req,res) => {
    try{
        let userData = await userModel.findOne({_id:req.userId});
        let cartData = await userData.cartData;
        if(!cartData[req.body.itemId]){
            cartData[req.body.itemId] = 1;
        }
        else{
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.userId,{cartData:cartData});
        return res.json({success:true,message:"Item added to cart successfully"});
    }
    catch(error){
        console.log(error); 
        return res.json({success:false,message:"Something went wrong"});
    }
}

const removeFromCart = async (req,res) => {
    try{
        let userData = await userModel.findOne({_id:req.userId});
        let cartData = await userData.cartData;
        if(cartData[req.body.itemId] && cartData[req.body.itemId]>0){
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(req.userId,{cartData:cartData});
        return res.json({success:true,message:"Item removed from cart successfully"});
    }
    catch(error){
        console.log(error); 
        return res.json({success:false,message:"Something went wrong"});
    }
}

const getCart = async (req,res) => {
    try{
        let userData = await userModel.findOne({_id:req.userId});
        let cartData = await userData.cartData;
        return res.json({success:true, cartData});
    }
    catch(error){
        console.log(error); 
        return res.json({success:false,message:"Something went wrong"});
    }
}

export {addToCart, removeFromCart, getCart};