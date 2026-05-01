import {v2 as cloudinary} from "cloudinary";

cloudinary.config({
    cloud_name :process.env.Cloudnary_Name,
    api_key:process.env.Cloudnary_Api_key,
    api_secret:process.env.Cloudnary_Api_secret
})
export default cloudinary;