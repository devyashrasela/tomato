import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1] || req.headers.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;

        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export default authMiddleware;
