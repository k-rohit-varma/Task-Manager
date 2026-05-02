import jwt from 'jsonwebtoken'

export const me = ( req, res )=>{
    try{
        const token = req.cookies?.token;
        console.log("production jwt: "+token)
        if(!token){
            return res.status(401).json({
                message : 'Unauthorized'
            })
        }
        const verified = jwt.verify(token, process.env.JWT_SCRECT)
        if(!verified){
            return res.status(401).json({
                message : 'Unauthorized'
            })
        }
        return res.status(200).json({
            message : 'User details fetched successfully',
            user : verified.data
        })
    }   
    catch(err){
        return res.status(500).json({
            message : 'Failed to fetch user details',
            error : err.message
        })
    }
}