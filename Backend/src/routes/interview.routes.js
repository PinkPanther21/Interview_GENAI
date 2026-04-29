const express = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const interviewController = require('../controllers/interview.controller')
const interviewRouter = express.Router()

interviewRouter.post("/", authMiddleware.authUser, interviewController.generateInterviewReportController)

module.exports = interviewRouter