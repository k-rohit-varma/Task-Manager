import mongoose from "mongoose";

const TaskSchema = mongoose.Schema({
    title: String,
    description: String,
    status: {
        type: String,
        enum: ['todo', 'in_progress', 'completed' ,'on_hold'],
        default: 'todo'
    },
    dueDate: Date,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    project: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model('Task', TaskSchema);