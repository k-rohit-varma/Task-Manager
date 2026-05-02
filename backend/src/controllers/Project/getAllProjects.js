import Project from "../../db/models/Project.js";

export const getAllProjects = async ( req , res )=>{
    try{
        const user = req.user;
        console.log("users. "+user);
        if( user.role === "admin"){
            const projects = await Project.find();
            return res.status(200).send({
                message : "Projects fetched successfully",
                projects
            })
        }
        const projects = await Project.find({users : user._id});
        return res.status(200).send({
            message : "Projects fetched successfully",
            projects
        })
    }catch(err){        
        return res.status(500).send({
            message : "Internal Server Error",
            error : err.message
        })
    }
}