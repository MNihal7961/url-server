import Url from "../models/urlmodel.js";
import { verifyToken, getUserByDecodedToken } from "../services/userservice.js";
import {
    checkOriginalLink,
    generateShortUrl,
    getOriginalLinkByUrlCode,
    removeShortedUrlCode,
} from "../services/urlservice.js";

export const createUrlPost = async (req, res) => {
    // CHECKING JWT
    const token = req.headers.authorization
    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "Unauthorized. No token provided" });
    }

    // CHECKING LINK
    const { originalLink, length } = req.body;
    if (!originalLink) {
        return res.status(400).json({ message: "Missing original URL link" });
    }

    try {
        // VERIFY TOKEN
        const verify = verifyToken(token);
        if (!verify) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized token" });
        }

        // RETRIEVE USER DATA
        const user = await getUserByDecodedToken(verify.user);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        // VALIDATING ORIGINAL-LINK
        const validLink = checkOriginalLink(originalLink);
        if (!validLink) {
            return res.status(400).json({ message: "Invalid URL format" });
        }

        // GENERATING SHORT URL
        const urlCode = generateShortUrl(parseInt(length));
        if (!urlCode) {
            return res.status(500).json({ message: "Failed Try Again" });
        }

        // STORING TO DATABASE
        let urlData = await Url.findOne({ user: user._id });
        if (!urlData) {
            urlData = await Url.create({ user: user._id, urls: [] });
        }

        const existUrl = urlData.urls.find(
            (url) => url.originalLink === originalLink
        );
        if (existUrl) {
            return res
                .status(409)
                .json({ message: "This URL has already been shortened." });
        }

        urlData.urls.push({ urlCode, originalLink, name: req.body?.name });
        await urlData.save();

        res
            .status(200)
            .json({ success: true, message: "URL successfully shortened" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const fetchAllUrlsByUserGet = async (req, res) => {
    // CHECKING JWT
    const token = req.headers.authorization
    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "Unauthorized. No token provided" });
    }

    try {
        // VERIFY TOKEN
        const verify = verifyToken(token);
        if (!verify) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized token" });
        }

        // RETRIEVE USER DATA
        const user = await getUserByDecodedToken(verify.user);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        // FETCHING DATA FROM DB
        const data = await Url.findOne({ user: user._id });

        res
            .status(200)
            .json({ success: true, message: "data fetched success", data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const redirectByUrlCodeGet = async (req, res) => {
    // CHECKING JWT
    const token = req.headers.authorization
    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "Unauthorized. No token provided" });
    }

    // CHECKING SHORT URL CODE
    const urlCode = req.params.urlCode;
    if (!urlCode) {
        res.status(404).send("Passed short url is wrong or not found");
    }

    try {
        // VERIFY TOKEN
        const verify = verifyToken(token);
        if (!verify) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized token" });
        }

        // RETRIEVE USER DATA
        const user = await getUserByDecodedToken(verify.user);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        // FETCHING ORIGINAL LINK BY SHORT URL
        const originalLink = await getOriginalLinkByUrlCode(user, urlCode);
        if (!originalLink) {
            return res
                .status(404)
                .json({ success: false, message: "Link not found" });
        }

        res.status(301).redirect(originalLink);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const deleteUrlCodePut = async (req, res) => {
    // CHECKING JWT
    const token = req.headers.authorization
    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "Unauthorized. No token provided" });
    }

    // CHECKING SHORT URL CODE
    const urlCode = req.params.urlCode;
    if (!urlCode) {
        res.status(404).send("Passed short url is wrong or not found");
    }
    try {
        // VERIFY TOKEN
        const verify = verifyToken(token);
        if (!verify) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized token" });
        }

        // RETRIEVE USER DATA
        const user = await getUserByDecodedToken(verify.user);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        // FINDING AND REMOVING URL
        const update = await removeShortedUrlCode(user, urlCode);
        if (!update) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }

        return res.status(201).json({ message: "Successfully removed short url" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
