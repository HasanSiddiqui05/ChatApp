 import { getAccessUser } from "../Service/Auth.js"; 
import User from '../Model/userModel.js'

const verifyJWT= async(req, res, next) => {
    
    const accToken = req.cookies.accessToken;

    if(!accToken)
        return res.status(401).json({message: 'User not Authorized or Token missing'})

    try{
        const decodeUser = getAccessUser(accToken)

        const user = await User.findById(decodeUser?._id).select('-refreshToken')

        if (!user) {
            return res.status(401).json({ message: "User not found. Invalid token." });
        }
        req.user = user
        next()
    }catch(err){
        return res.status(401).json({ message: `Invalid token ${err.message}` });
    }
}

export default verifyJWT;

