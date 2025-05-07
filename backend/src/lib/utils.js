import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    try {
        console.log("Generating token for userId:", userId);
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "7d"  // Expiry time for the token
        });
        console.log("Generated Token:", token);

        // Set token as a cookie
        res.cookie("jwt", token, {
            path: "/",
            httpOnly: true,   // Make sure cookie is accessible only via HTTP requests
            sameSite: "none",
            secure: process.env.NODE_ENV === "production", // Only use secure cookies in production
        });
    } catch (error) {
        console.error("Error while generating token:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
