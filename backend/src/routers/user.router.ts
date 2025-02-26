import { Router } from 'express';
import jwt from "jsonwebtoken";
import { sample_users } from '../data';
import asyncHandler from 'express-async-handler';
import { UserModel } from '../models/user.model';
import { FoodModel } from '../models/food.model';
const router = Router();



router.get("/seed", asyncHandler(
    async (req, res) => {
        const foodsCount = await UserModel.countDocuments();
        if (foodsCount> 0) {
            res.send("Seed is already done");
            return;
        }
        await UserModel.create(sample_users);
        res.send("Seeding is done");
    }
))


router.post("/login",asyncHandler( async (req,res) => {
    const{email,password} = req.body;
    const user = await UserModel.findOne({email,password});
    if(user) {
        res.send(generateTokenRespone(user));
    }
    else{
        res.status(400).send("Invalid email or password");
    }
}))

const generateTokenRespone =(user:any)=>{
    const token= jwt.sign({
        email:user.email,
        name:user.name
    },"shuushuushuu",{expiresIn:"30d"});


    user.token=token;
    return user;
}

export default router;