import BlacklistToken from "../models/blacklisttokenModel.js";

export const validateRefreshToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken || req.headers['x-refresh-token'] ;

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    // Check if the refresh token is in the blacklist
    const blacklistedToken = await BlacklistToken.findOne({ token: refreshToken });
    if (blacklistedToken) {
        return res.status(403).json({ message: 'Refresh token is blacklisted' });
    }

    next();
};