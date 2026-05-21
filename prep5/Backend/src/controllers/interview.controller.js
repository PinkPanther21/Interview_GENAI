const pdfParse = require("pdf-parse")
const {generateInterviewReport, generateResumePdf} = require('../services/ai.service')
const interviewReportModel = require("../models/interviewReport.model")

async function generateInterviewReportController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Resume file is required"
            })
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const resumeContent = await (new pdfParse.PDFParse(
            Uint8Array.from(req.file.buffer)
        )).getText()

        const { selfDescription, jobDescription } = req.body

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            title:
        interviewReportByAi.title ||
        jobDescription?.split(" ").slice(0, 6).join(" ") + "...",
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })

    } catch (error) {
        console.error("GENERATE ERROR:", error)
        res.status(500).json({
            message: error.message
        })
    }
}

async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        })

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found"
            })
        }

        res.status(200).json({
            message: "Interview report fetched successfully",
            interviewReport
        })

    } catch (error) {
        console.error("GET BY ID ERROR:", error)
        res.status(500).json({
            message: error.message
        })
    }
}

async function getAllInterviewReportsController(req, res) {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

        res.status(200).json({
            message: "Interview reports fetched successfully",
            interviewReports
        })

    } catch (error) {
        console.error("GET ALL REPORTS ERROR:", error) // 👈 ADD THIS
        res.status(500).json({
            message: error.message
        })
    }
}

async function generateResumePdfController(req, res){
    const {interviewReportId} = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if(!interviewReport){
        return res.status(404).json({
            message: "Report not found"
        })
    }

    const { resume, jobDescription, selfDescription} = interviewReport

    const pdfBuffer = await generateResumePdf({resume, jobDescription, selfDescription })

     res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = {generateInterviewReportController,getInterviewReportByIdController,getAllInterviewReportsController, generateResumePdfController}