import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import users from '../models/userModel.js'
import { stripe } from "../utils/stripe.js";

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try{
        const existinguser = await users.findOne({ email });
        if(existinguser){
            return res.status(200).json({ message: "User already Exist.",sucess:false})
        }

        
        const hashedPassword = await bcrypt.hash(password, 12)
        
    const customer = await stripe.customers.create(
        {
          email,
        },
        {
          apiKey: process.env.STRIPE_SECRET_KEY,
        }
      );

        const newUser = await users.create({ name, email, password: hashedPassword , stripeCustomerId: customer.id,}) 
        const token = jwt.sign({ email: newUser.email, id:newUser._id}, process.env.JWT_SECRET , { expiresIn: '1h'});
        console.log(newUser);
        res.status(200).json({ result: newUser, token ,sucess:true})
    } catch(error){
        res.status(500).json("Something went worng...")
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existinguser = await users.findOne({ email });
        if(!existinguser){
            return res.status(200).json({ message: "User don't Exist."})
        }

        const isPasswordCrt = await bcrypt.compare(password, existinguser.password)
        if(!isPasswordCrt){
            return res.status(200).json({message : "Invalid credentials",sucess:false})
        }
        const token = jwt.sign({ email: existinguser.email, id:existinguser._id},  process.env.JWT_SECRET, { expiresIn: '1h'});
        res.status(200).json({ result: existinguser, token,sucess:true})
    } catch (error)  {
        res.status(500).json({message:"Something went worng...",sucess: false})
    }
}
export const me=async(req,res)=>{
    const user = await users.findOne({ email: req.user });

   res.status(200).json({
    errors: [],
    data: {
      user: {
        id: user._id,
        email: user.email,
        stripeCustomerId: user.stripeCustomerId,
      },
    },
  });
}