import User from "../models/user.model.js"
import Jwt from "jsonwebtoken"

export const protectRoute = async(req,res,next)=>{
    try{
        const token  = req.headers.token;
        const decoded = Jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId).select("-password")
        if(!user)return res.json({success:false,message:"User not Found"})
            req.user = user;
        next();
    }catch(error){
res.json({success:false , message:"User not Found"})
    }
}


export const checkAuth = (req,res)=>{
    res.json({success:true,user:req.user})
}

