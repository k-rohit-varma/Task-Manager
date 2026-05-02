import mongoose from "mongoose";

const ProjectSchema = mongoose.Schema({
    name: String,
    description: String,
    users :[{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
    }],
    activeTasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref : "Task",

    }],
    closedTasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref : "Task",
    }],
    isCompleted: {
        type: Boolean,
        default: false
    },
    createdBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
    }
})

export default mongoose.model('Project', ProjectSchema)