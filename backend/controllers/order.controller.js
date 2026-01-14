import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
    const frontendUrl = "https://tomato-nv2f.vercel.app";

    try{
        const newOrder = new orderModel({
            userId: req.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.userId,{cartData:{}});
        const line_items = req.body.items.map((item)=>({
            price_data:{
                currency:"inr",
                product_data:{
                    name:item.name
                },
                unit_amount:item.price*100*80
            },
            quantity:item.quantity
        }))

        line_items.push({
                        price_data:{
                currency:"inr",
                product_data:{
                    name:"Delivery Charges"
                },
                unit_amount:2*100*80
            },
            quantity:1
        })

        const session = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode:'payment',
            success_url:`${frontendUrl}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${frontendUrl}/verify?success=false&orderId=${newOrder._id}`,
        })

        res.json({success:true,session_url:session.url});
    }
    catch(error){
        console.log(error);
        res.status(500).json({success:false,message:"Error placing order"});
    }
}

const verifyOrder = async (req, res) => {
    const {orderId,success} = req.body;
    try{
        if(success===true){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"Payment Successful"});
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Payment Failed"});
        }
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

const userOrders = async (req,res) => {
    try{
        const orders = await orderModel.find({userId:req.userId});
        res.json({success:true,data:orders});
    }
    catch(error){
        console.log(error);
        res.status(500).json({success:false,message:"Error fetching orders"});
    }
}

const listOrders = async (req,res) => {
    try{
        const orders = await orderModel.find({});
        res.json({success:true,data:orders});
    }
    catch(error){
        console.log(error);
        res.status(500).json({success:false,message:"Error fetching orders"});
    }
}

const updateStatus = async (req,res) => {
    try{
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Order status updated successfully"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({success:false,message:"Error updating order status"});
    }
}

export { placeOrder,verifyOrder,userOrders,listOrders, updateStatus };    