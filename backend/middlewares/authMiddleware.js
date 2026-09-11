const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes
const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (token && token.startsWith("Bearer")) {
            token = token.split(" ")[1]; // Extract token
            
            console.log("Token verification attempt for protected route");
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Token decoded successfully for user:", decoded.id);
            
            req.user = await User.findById(decoded.id).select("-password");
            
            if (!req.user) {
                console.log("User not found for token:", decoded.id);
                return res.status(401).json({ message: "User not found" });
            }
            
            console.log("User authenticated:", req.user.email);
            next();
        } else {
            console.log("No token provided or invalid format");
            res.status(401).json({ message: "Not authorized, no token" });
        }
    } catch (error) {
        console.error("Auth middleware error:", error.message);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        
        res.status(401).json({ message: "Token failed", error: error.message });
    }
};

module.exports = { protect };
