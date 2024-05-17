import { generateRandom15 } from "../services/customservice.js";
import { verifyToken, getUserByDecodedToken } from "../services/userservice.js";
import Url from '../models/urlmodel.js'

export const custom15url = async (req, res) => {
    // CHECKING JWT 
    const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized. No token provided" });
    }
    try {
        // VERIFY TOKEN
        const verify = verifyToken(token)
        if (!verify) {
            return res.status(401).json({ success: false, message: "Unauthorized token" });
        }

        // RETRIEVE USER DATA
        const user = await getUserByDecodedToken(verify.user)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let userUrls = await Url.findOne({ user: user._id })

        console.log(userUrls.customUrl)
        if (!userUrls) {
            userUrls = new Url({ user: user._id, urls: [], customUrls: [] });
        }

        const custom15 = generateRandom15()

        userUrls.customUrl.push(custom15);

        await userUrls.save();

        res.status(200).json({ success: true, message: "Custom 15 URL successfully added" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const get15url = async (req, res) => {
    // CHECKING JWT
    const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized. No token provided" });
    }

    try {
        // VERIFY TOKEN
        const verify = verifyToken(token)
        if (!verify) {
            return res.status(401).json({ success: false, message: "Unauthorized token" });
        }

        // RETRIEVE USER DATA
        const user = await getUserByDecodedToken(verify.user)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // FETCHING DATA FROM DB
        const result = await Url.findOne({ user: user._id })

        const data = result.customUrl

        res.status(200).json({ success: true, message: "data fetched success", data: data });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const delete15 = async (req, res) => {
    // CHECKING JWT
    const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized. No token provided" });
    }

    // CHECKING SHORT URL CODE
    const urlCode = req.params.urlCode;
    if (!urlCode) {
        res.status(404).send("Passed short url is wrong or not found");
    }

    try {
        // VERIFY TOKEN
        const verify = verifyToken(token)
        if (!verify) {
            return res.status(401).json({ success: false, message: "Unauthorized token" });
        }

        // RETRIEVE USER DATA
        const user = await getUserByDecodedToken(verify.user)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let userUrls = await Url.findOne({ user: user._id });

        if (!userUrls) {
            console.log("User not found.");
            return;
        }

        const updatedCustomUrls = userUrls.customUrl.filter(subArray => {
            return !subArray.some(urlObj => urlObj.code === urlCode);
        });

        userUrls.customUrl = updatedCustomUrls;

        await userUrls.save();

        res.status(200).json({ success: true, message: "data delete success" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const delete1 = async (req, res) => {
    // CHECKING JWT
    const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized. No token provided" });
    }

    // CHECKING SHORT URL CODE
    const urlCode = req.params.urlCode;
    if (!urlCode) {
        res.status(404).send("Passed short url is wrong or not found");
    }

    try {
        // VERIFY TOKEN
        const verify = verifyToken(token)
        if (!verify) {
            return res.status(401).json({ success: false, message: "Unauthorized token" });
        }

        // RETRIEVE USER DATA
        const user = await getUserByDecodedToken(verify.user)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let userUrls = await Url.findOne({ user: user._id });

        if (!userUrls) {
            console.log("User not found.");
            return;
        }

        // FIND AND REMOVE THE URL OBJECT
        let urlFound = false;
        userUrls.customUrl = userUrls.customUrl.map(subArray => {
            const updatedSubArray = subArray.filter(urlObj => urlObj.code !== urlCode);
            if (updatedSubArray.length !== subArray.length) {
                urlFound = true;
            }
            return updatedSubArray;
        });

        if (!urlFound) {
            return res.status(404).json({ success: false, message: "URL not found" });
        }

        // SAVE THE UPDATED DOCUMENT
        await userUrls.save();

        res.status(200).json({ success: true, message: "data delete success" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

