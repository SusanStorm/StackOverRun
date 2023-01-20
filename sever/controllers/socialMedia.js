import mongoose from 'mongoose'
import socialMediaModel from '../models/socialMediaModel.js'

const postImg = async (req, res) => {
    const { userId, userName, postDisc, publicId, resourceType} = req.body

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(404).json({ message: error.message })
    }

    try {
        const data = req.body
        const postfbImg = await socialMediaModel.create({ ...data })
        res.status(200).json(postfbImg)
    }
    catch (error) {
        res.status(400).json(error)
    }
}

const getAllPosts = async (req, res) => {
    try {
        const fbpostsList = await socialMediaModel.find()
        res.status(200).json(fbpostsList)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const voteFbPost = async (req, res) => {
    const { id, value, userId, userName } = req.body


    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ message: error.message })
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(404).json({ message: error.message })
    }

    try {
        let voteFbPost = await socialMediaModel.findById(id)

        if (value === "like") {
            if (!voteFbPost?.imgLike?.includes(userId)) {
                voteFbPost = await socialMediaModel.findByIdAndUpdate(id, { $addToSet: { "imgLike": [userId] } })
                voteFbPost = await socialMediaModel.findByIdAndUpdate(id, { $pullAll: { "imgDisLike": [userId] } })
                res.status(200).json(voteFbPost)
            }
            else if (voteFbPost?.imgLike?.includes(userId)) {
                voteFbPost = await socialMediaModel.findByIdAndUpdate(id, { $pullAll: { "imgLike": [userId] } })
                res.status(200).json(voteFbPost)
            }
        }

        if (value === "dislike") {
            if (!voteFbPost?.imgDisLike?.includes(userId)) {
                voteFbPost = await socialMediaModel.findByIdAndUpdate(id, { $addToSet: { "imgDisLike": [userId] } })
                voteFbPost = await socialMediaModel.findByIdAndUpdate(id, { $pullAll: { "imgLike": [userId] } })
                res.status(200).json(voteFbPost)
            }
            else if (voteFbPost?.imgDisLike?.includes(userId)) {
                voteFbPost = await socialMediaModel.findByIdAndUpdate(id, { $pullAll: { "imgDisLike": [userId] } })
                res.status(200).json(voteFbPost)
            }
        }
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const deletePost = async (req, res) => {

    const { _id } = req.body

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("post doesn't exist")
    }

    try {
        await socialMediaModel.findByIdAndRemove(_id)
        res.status(200).json("post deleted")

    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


export { postImg, getAllPosts, voteFbPost, deletePost }