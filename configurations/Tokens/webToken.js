const jwt = require('jsonwebtoken')
const createError = require('http-errors')


const ACCESS_SECRET_KEY =  "25938eeb531bd950435339eb2ca0a57ac5440819ce11ffe7e4880f17a647e56a";
  

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret = ACCESS_SECRET_KEY;
            const options = {
                expiresIn: "86400s",
                issuer: "xyz.com",
                audience: userId
            };
            jwt.sign(payload, secret, options, (err, token) => {
                if (err) {
                    reject(createError.InternalServerError())
                }
                resolve(token)
            })
        })
    },
    verifyAccessToken: (req, res, next) => {
        if (!req.headers["authorization"]) {
            return next(createError.Unauthorized())
        }
        const authHeader = req.headers["authorization"]
        const bearerToken = authHeader.split(" ");
        const token = bearerToken[1]

        jwt.verify(token, ACCESS_SECRET_KEY, (err, payload) => {
            if (err) {
                const message = err.name == "JsonWebTokenError" ? "Unauthorized" : err.message
                return next(createError.Unauthorized(message))
            }
            res.payload = payload
            next()
        })
    }
}



