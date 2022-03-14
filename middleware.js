// global middleware
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.status(401);

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403);
            req.user = user;
        });
    } catch (err) {
        res.status(500).send({ error: { message: err } })
    } finally {
        next();
    }
}

module.exports = { authenticateToken };