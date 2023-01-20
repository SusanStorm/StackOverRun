import express from 'express'
import { postImg, getAllPosts, voteFbPost, deletePost } from '../controllers/socialMedia.js'

const socialMediaRoutes = express.Router()
socialMediaRoutes.post('/postyourpost', postImg)
socialMediaRoutes.patch('/votepost', voteFbPost)
socialMediaRoutes.patch('/deletepost', deletePost)
socialMediaRoutes.get('/posts', getAllPosts)

export default socialMediaRoutes