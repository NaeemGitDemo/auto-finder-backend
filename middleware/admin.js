
const admin = async (req, res, next) => {
    if (!req.user.isAdmin) { return res.status(403).json({ error: 'Not An Admin' }) }
    next()
}


module.exports= admin