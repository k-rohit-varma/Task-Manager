import express from 'express'
import { createProject } from '../controllers/Project/createProject.js'
import { adminMiddleware } from '../middleware/admin.js'
import { assignProject } from '../controllers/Project/assignProject.js'
import { auth } from '../middleware/auth.js'
import { getAllProjects } from '../controllers/Project/getAllProjects.js'

const projectRouter = express.Router()

projectRouter.post('/',adminMiddleware ,createProject)
projectRouter.post('/assign',auth ,assignProject)
projectRouter.get('/',auth, getAllProjects);

export default projectRouter