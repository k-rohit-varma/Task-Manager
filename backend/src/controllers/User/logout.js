export const logout = async (req, res) => {
    try {
        res.clearCookie('token')
        return res.status(200).json({
            message : 'User logged out successfully'
        })
    }catch(err){
        return res.status(500).json({
            message : 'User logout failed',
            error : err.message
        })
    }
}