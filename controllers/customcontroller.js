import { verifyToken, getUserByDecodedToken } from "../services/userservice.js";

export const custom15url = async (req, res) => {
    // CHECKING JWT 
    const token = req.cookies.token;
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

        

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}