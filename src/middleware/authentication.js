const db = require('../models/index');
const tokenHelper = require('../helpers/token.js');
const url = require('url');

const isAuthenticated = async function (req, res, next) {
    // Get authorization header from request
    const {authorization} = req.headers;
    // Firstly, set request user to null
    req.user = null;

    if (authorization) {
        // Make sure the token is bearer token
        const isBearerToken = authorization.startsWith('Bearer ');

        // Decode token - verifies secret and checks exp
        if (isBearerToken) {
            const token = authorization.slice(7, authorization.length);

            try {
                // Verify token and get token data
                const tokenData = await tokenHelper.verifyToken(token);
                // Find user from database
                const user = await db.users.findByPk(tokenData.userId);
                if (!user) {
                    return next({
                        status: 401,
                        message: 'There is no user',
                    });
                }

                // Set request user
                req.user = user.dataValues;

                // Check if the token renewal time is coming
                const now = new Date();
                const exp = new Date(tokenData.exp * 1000);
                const difference = exp.getTime() - now.getTime();
                const minutes = Math.round(difference / 60000);
                if (minutes < 15) {
                    if (!req.url.includes('auth/token')) {
                        return next({
                            status: 403,
                            message: 'refresh',
                        });
                    }
                }
            } catch (err) {
                console.error(err)
                return next({status: 401, ...err});
            }
        }
    }

    // Go to next middleware
    return next();
}

module.exports = {
    isAuthenticated,
}
