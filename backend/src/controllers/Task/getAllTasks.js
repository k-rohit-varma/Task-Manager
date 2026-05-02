import Project from "../../db/models/Project.js";
import Task from "../../db/models/Task.js";

export const getAllTasks = async ( req , res )=>{
    try{
        const {projectId} = req.params;

        if(!projectId){
            return res.status(400).send({
                message : "Project Id is required"
            })
        }
        const project = await Project.findById(projectId);
        if(!project){
            return res.status(404).send({
                message : "Project not found"
            })
        }
        const tasks = await Task.find({project : projectId});
        return res.status(200).send({
            message : "Tasks fetched successfully",
            tasks
        })
    }catch(err){
        return res.status(500).send({
            message : "Internal Server Error",
            error : err.message
        })
    }
}