import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs';
import User from "../models/usermodel.js";
import dotenv from "dotenv";

dotenv.config()


const jwtSecret = process.env.JWT_SECRET;

//REGISTER
export const register = async (req, res) => {
    const { email, password, name } = req.body
    try {
        //CHECK EXIST USER
        const user = await User.findOne({ email: email })
        if (user) {
            return res.status(409).json({ success: false, message: "User already exist with this email" })
        }

        //HASHING PASSWORD
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            email,
            name,
            password: hashPassword,
        })

        await newUser.save()

        res
            .status(200)
            .json({ succcess: true, message: "User Successfully Registered", user: newUser })

    } catch (err) {

        res.status(400).json({ succcess: false, message: "Server Failed Tryagain" })
    }
}

//LOGIN
export const login = async (req, res) => {

    const { email, password } = req.body

    try {


        if (!jwtSecret) {
            throw new Error('JWT secret is not defined in the environment variables.');
        }

        //CHECK EXIST USER
        const user = await User.findOne({ email: email })
        if (!user) {
            console.log("not a user")
            return res.status(404).json({ success: false, message: "User Not Found" })
        }

        // COMPARE PASSWORD
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(403).json({ succcess: false, message: "Invalid Credentials" })
        }

        const token = jwt.sign(
            {
                user: user._id,
            },
            jwtSecret, {
            expiresIn: "30d"
        }
        )

        res.cookie("token", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 });
        res.json({ success: true, message: 'Login Success', user });

    } catch (err) {
        console.log(err)
        res.status(400).json({ succcess: false, message: "Server Failed Tryagain" })
    }
}

//LOGOUT
export const logout = (req, res) => {
    try {
        res.status(200).clearCookie("token").json({ succcess: true, message: 'Logout Suceess' })
    } catch (err) {
        res.status(400).json({ succcess: false, message: "Bad Request" })
    }

}