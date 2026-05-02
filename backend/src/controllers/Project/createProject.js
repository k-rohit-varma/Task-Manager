import Project from "../../db/models/Project.js";

export const createProject = async (req, res) => {
    try{
        const { name, description } = req.body;
        if(!name || !description){
            return res.status(400).send({
                message : 'Name and Description are required'
            })
        }
        const project = await Project.create({
            name,
            description,
            createdBy : req.user.data._id
        })
        return res.status(201).send({
            message : 'Project Created Successfully',
            project
        })
    }catch(err){
        return res.status(500).send({
            message : 'Internal Server Error'+err
        })
    }
}