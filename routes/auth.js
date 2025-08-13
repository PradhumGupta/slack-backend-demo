import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/sign-up", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password)
            return res.status(400).json({ message: "Provide all the above info" });

        const findUser = await User.findOne({ email });

        if (findUser) 
            return res.status(400).json({ message: "Email is already in use, Try login" });

        const newUser = await User.create({
            name, email, password
        });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

        res.status(201).json({ message: "User created", token });
    } catch (error) {
        console.error("Error while registering user", error);
        res.status(500).json({ error: "Server error, Something went wrong" });
    }
})

router.post("/sign-in", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ message: "Provide all the above info" });

        const user = await User.findOne({ email });

        if (!user)
            return res.status(404).json({ message: "User not found" });

        const isMatched = await bcrypt.compare(password, user.password);

        if (isMatched === false) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ message: "User logged in", token });
    } catch (error) {
        console.error("Error while logging in user", error)
        res.status(500).json({ error: "Server error, Something went wrong" });
    }
})

// 444ms
router.get("/profile", protect, async (req, res) => {
    try {
        if(!req.user.id) 
            return res.status(401).json({ error: "Unauthenticated access" });

        const user = await User.findById(req.user.id).lean();

        if(!user) 
            return res.status(404).json({ message: "user not found" });

        return res.status(200).json(user);
    } catch (error) {
        console.error("Error in getting the user profile");
        return res.status(500).json({ error: "Server error, Something went wrong" });
    }
})

export default router;