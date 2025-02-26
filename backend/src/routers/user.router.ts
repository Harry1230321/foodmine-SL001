import { Router } from 'express';
import jwt from "jsonwebtoken";
import { sample_users } from '../data';
import asyncHandler from 'express-async-handler';
import { User, UserModel } from '../models/user.model';
import { HTTP_BAD_REQUEST } from '../constants/http_status';
import bcrypt from 'bcryptjs';

const router = Router();



router.get("/seed", asyncHandler(
    async (req, res) => {
        const foodsCount = await UserModel.countDocuments();
        if (foodsCount > 0) {
            res.send("Seed is already done");
            return;
        }
        await UserModel.create(sample_users);
        res.send("Seeding is done");
    }
))


router.post("/login",asyncHandler( async (req,res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({email});
    if (!user) {
        res.status(HTTP_BAD_REQUEST).send("Invalid email ");
        return;
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {
        res.send(generateTokenResponse(user));
    }
    else {
        res.status(HTTP_BAD_REQUEST).send("Invalid  password");
    }
}))

router.post('/register', asyncHandler(
    async (req, res)=>{
        const { name, email, password, address } = req.body;
        const user = await UserModel.findOne({email});
        if (user) {
            res.status(HTTP_BAD_REQUEST)
            .send('User already exists, go to login!');
            return;
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const newUser:User = {
            id: '',
            name,
            email: email.toLowerCase(),
            password: encryptedPassword,
            address,
            isAdmin: false,
        }

        const dbUser = await UserModel.create(newUser);
        res.send(generateTokenResponse(dbUser));
}))

const generateTokenResponse =(user:any)=>{
    const token= jwt.sign({
        email:user.email,
        name:user.name
    }, process.env.JWT_SECRET || "default_secret",{expiresIn:"30d"});


    // Create a plain JavaScript object with all the necessary properties
  // including the token (this avoids Mongoose's document transformation issues)
  return {
    id: user._id, // Convert MongoDB _id to id
    name: user.name,
    email: user.email,
    address: user.address,
    isAdmin: user.isAdmin,
    token: token // Add the token explicitly
  };
}

export default router;