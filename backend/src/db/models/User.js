import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    name: String,
    role: {
        type: String,
        enum: ['admin', 'member'],
        default: 'member'
    },
    email:{
        type: String,   
        unique: true,
        required: true
    },
    password:{
        type : String
    },
    projects : [{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Project',
    }],
    activeTasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref : "Task",

    }],
    closedTasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref : "Task",
    }]
})

export default mongoose.model('User',UserSchema)