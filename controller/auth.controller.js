import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const {username,password} = req.body;
    const hashed=await bcrypt.hash(password, 10);
    try{
        const user = await User.create({username, password: hashed});
        res.status(201).json({ message: "User registered successfully", user });
    }catch(error){
        res.status(500).json({ message: "Internal server error" }); 
    }
}

export const   login = async (req, res) => {
const {username, password} = req.body;

const user= await User.findOne({ where: { username } });

if (!user)    return res.status(404).json({ message: "User not found" });

const match = await bcrypt.compare(password, user.password);
if (!match) return res.status(400).json({ message: "Invalid credentials" });

const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
res.json({token})
}