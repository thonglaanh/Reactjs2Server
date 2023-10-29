const jwt = require('jsonwebtoken');

const middleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        console.log('chua co token');
        return res.status(400).json({ status: 'error', message: 'Chưa có token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(decoded);
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return refreshToken(req, res, next);
        } else {
            return res.send('Token không hợp lệ');
        }
    }
};
//load lại token hết hạn
const refreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(401);
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const accessToken = generateAccessToken({ _id: decoded._id });

        res.cookie('token', accessToken);
        next();
    } catch (error) {
        return res.sendStatus(403);
    }
};

function generateAccessToken(data) {
    return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
}

module.exports = middleware;
