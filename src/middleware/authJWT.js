const jwt = require('jsonwebtoken');

const authJWT = (req, res, next) => {
    const authorization = req.get('authorization');
    let token = null;

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        token = authorization.substring(7);
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET || 'esteesunsecretkey');
        
        if (!token || !decodedToken.id) {
            return res.status(401).json({ error: 'token missing or invalid' });
        }
        req.user = decodedToken;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'invalid token' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'token expired' });
        }
        return res.status(500).json({ error: 'auth failed' });
    }
};

module.exports = authJWT;
