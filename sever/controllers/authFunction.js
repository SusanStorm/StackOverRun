import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import usersModel from '../models/userModel.js'
import mongoose from 'mongoose'
const fbFrndRequest = async (req, res) => {

    const { _id, value, userId, userName } = req.body

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("user doesn't exist")
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).send("user doesn't exist")
    }

    try {

        let fbReqData = await usersModel.findById(_id)
       
        if (value === "sendFrndRequest") {
            if (!fbReqData?.frequest?.includes(userId)) {
                fbReqData = await usersModel.findByIdAndUpdate(_id, { $addToSet: { "frequest": [{ userId, userName }] } })
                console.log(fbReqData)
                fbReqData = await usersModel.findByIdAndUpdate({ _id: _id }, { $pull: { "crequest": { userId: userId, userName: userName } } })
                res.status(200).json(fbReqData)
            }
            if (fbReqData?.frequest?.includes(userId)) {
                fbReqData = await usersModel.findByIdAndUpdate({ _id: _id }, { $pull: { "frequest": { userId: userId, userName: userName } } })
                res.status(200).json(fbReqData)
            }
        }

        if (value === "cancelFrndRequest") {
            if (!fbReqData?.crequest?.includes(userId)) {
                fbReqData = await usersModel.findByIdAndUpdate(_id, { $addToSet: { "crequest": [{ userId, userName }] } })
                fbReqData = await usersModel.findByIdAndUpdate({ _id: _id }, { $pull: { "frequest": { userId: userId, userName: userName } } })
                res.status(200).json(fbReqData)
            }
        }

        if (value === "acceptFrndRequest") {
            if (!fbReqData?.friends?.includes(userId)) {
                fbReqData = await usersModel.findByIdAndUpdate({ _id: _id }, { $pull: { "frequest": { userId: userId, userName: userName } } })
                fbReqData = await usersModel.findByIdAndUpdate(_id, { $addToSet: { "friends": [{ userId, userName }] } })
                res.status(200).json(fbReqData)
            }
        }

        if (value === "removeFrndRequest") {
            fbReqData = await usersModel.findByIdAndUpdate({ _id: _id }, { $pull: { "friends": { userId: userId, userName: userName } } })
            res.status(200).json(fbReqData)
        }
    }

    catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const saveUserChats = async (req, res) => {

    const { _id, userName, userId, userEmail, userChats } = req.body

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("user doesn't exist")
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).send("user doesn't exist")
    }

    try {
        let saveUsersChat = await usersModel.findById(_id)
        if (userChats !== "") {
            saveUsersChat = await usersModel.findByIdAndUpdate(_id, { $addToSet: { "letsChat": [{ userName, userId, userEmail, userChats }] } })
            saveUsersChat = await usersModel.findByIdAndUpdate(userId, { $addToSet: { "letsChat": [{ userName, userId: _id, userEmail, userChats }] } })
            res.status(200).json(saveUsersChat)
        }

    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


const saveChatbotChats = async (req, res) => {

    const { _id, message, sepId } = req.body

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("user doesn't exist")
    }

    try {
        let saveChats = await usersModel.findById(_id)
        if (message !== "") {
            saveChats = await usersModel.findByIdAndUpdate(_id, { $addToSet: { "chatBox": [{ message, sepId }] } })
            res.status(200).json(saveChats)
        }

    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const fetchAllFbUsers = async (req, res) => {
    try {
        const fetchFbUsersData = await usersModel.find()
        res.status(200).json(fetchFbUsersData)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


// const updateUser = async (req,res) => {
//     try {
//       // Find the user by their ID and update their information
//       const user = await usersModel.findByIdAndUpdate(id, data, { new: true });
//       return user;
//     } catch (error) {
//       console.error(error);
//     }
//   };
export { fbFrndRequest, fetchAllFbUsers, saveUserChats, saveChatbotChats }