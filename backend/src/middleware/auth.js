import jwt from 'jsonwebtoken'

export const auth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message : 'Unauthorized'
            })
        }
        const verified = jwt.verify(token, process.env.JWT_SCRECT)
        if (!verified) {
            return res.status(401).json({
                message : 'Unauthorized'
            })
        }
        req.user = verified.data;
        next()
    }catch(err){
        return res.status(401).json({
            message : 'Unauthorized'
        })
    }
}