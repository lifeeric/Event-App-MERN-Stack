const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    // Find the Auhorization Header
    const header = req.get('Authorization');

    // if header not found
    if( !header )
    {
        req.isAuth = false;
        return next();
    }

    const token = header.split(' ')[1];

    // if Token not found
    if( !token )
    {
        req.isAuth = false;
        return next();
    }

    let decodedToken;

    try {
        decodedToken = jwt.verify(token, 'myKey')
    }
    catch(err) {
        req.isAuth = false;
        throw new Error('Not verified! token');
    }

    // if there is no token
    if( !!(!decodedToken) )
    {
        req.isAuth = false;
        return next();
    }
    console.log(decodedToken)
    // Return Token
    req.isAuth = true;
    req.userId = decodedToken.userId;
    return next();

}   