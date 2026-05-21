const express = require('express')
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const authRouter = express.Router()

authRouter.post('/register', authController.registerUser)

authRouter.post('/login', authController.login)

authRouter.get('/logout', authController.logout)

authRouter.get('/get-me',authMiddleware.authUser, authController.getMe)

module.exports = authRouter