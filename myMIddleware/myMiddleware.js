module.exports = (req, res, next) => {
    // verify session data exists
    if(req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({
            message: `You shall not pass, not MW authorized`
        })
    }
}