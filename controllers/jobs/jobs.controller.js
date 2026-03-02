const { clean } = require("../../src/utils/jobSanitizer.js");
const Job = require("../../models/jobModel.js")
const Modality = require("../../models/modalityModel.js")
const TypeOfJob = require("../../models/typeOfJobModel.js")
const Company = require("../../models/companyModel.js")
const PostulatedWork = require("../../models/postulatedWorksModel.js")
const { Op } = require("sequelize");

exports.createJobController = async (req, res) => {
    try {
        const { title, companyId, location, salary_min, salary_max, modalityId, typeOfJobId, description_html, responsabilities_html, requirements_html, benefits_html } = req.body;
        const cleanSummary = clean(description_html);
        const cleanResponsibilities = clean(responsabilities_html);
        const cleanRequirements = clean(requirements_html);
        const cleanBenefits = clean(benefits_html);

        await Job.create({
            title: title,
            companyId: companyId,
            location: location,
            salary_min: salary_min,
            salary_max: salary_max,
            modalityId: modalityId,
            typeOfJobId: typeOfJobId,
            description_html: cleanSummary.html,
            responsabilities_html: cleanResponsibilities.html,
            requirements_html: cleanRequirements.html,
            benefits_html: cleanBenefits.html,
            description_text: cleanSummary.text,
            responsabilities_text: cleanResponsibilities.text,
            requirements_text: cleanRequirements.text,
            benefits_text: cleanBenefits.text,
            userId: req.userId
        })


        res.status(201).json({
            ok: true,
            code: "SUCCESS",
            message: "Job created successfully"
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            ok: false,
            code: "SERVER_ERROR",
            message: "Internal server error"
        });
    }
};

exports.getAllJobsController = async (req, res) => {
    try {
        const { page = 1, limit = 20, search = "" } = req.query

        const parsedPage = Math.max(1, parseInt(page), 1);
        const parsedLimit = Math.max(1, parseInt(limit), 20);
        const offset = (parsedPage - 1) * parsedLimit;
        const { rows, count } = await Job.findAndCountAll({
            where: {
                isApproved: "approved",
                title: {
                    [Op.like]: `%${search}%`
                }
            },
            attributes: ["id", "title", "location", "salary_min", "salary_max"],
            include: [
                {
                    model: Modality,
                    attributes: ["name"]
                },
                {
                    model: TypeOfJob,
                    attributes: ["name"]
                },
                {
                    model: Company,
                    attributes: ["name"]
                }
            ],
            order: [
                ["createdAt", "DESC"]
            ],
            limit: parsedLimit,
            offset: offset
        });
        res.status(200).json({
            ok: true,
            code: "SUCCESS",
            message: "Jobs fetched successfully",
            jobs: rows,
            count: count,
            page: parsedPage,
            limit: parsedLimit
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            ok: false,
            code: "SERVER_ERROR",
            message: "Internal server error"
        });
    }
};

exports.getJobsForRequestsPage = async (req, res) => {
    try {
        const { page = 1, limit = 20, search = "" } = req.query
        const parsedPage = Math.max(1, parseInt(page), 1);
        const parsedLimit = Math.max(1, parseInt(limit), 20);
        const offset = (parsedPage - 1) * parsedLimit;
        const { rows, count } = await Job.findAndCountAll({
            where: {
                userId: req.userId,
                title: {
                    [Op.like]: `%${search}%`
                }
            },
            attributes: ["id", "title", "location", "salary_min", "salary_max", "isApproved", "createdAt"],
            include: [
                {
                    model: Modality,
                    attributes: ["name"]
                },
                {
                    model: TypeOfJob,
                    attributes: ["name"]
                },
                {
                    model: Company,
                    attributes: ["name"]
                }
            ],
            order: [
                ["createdAt", "DESC"]
            ],
            limit: parsedLimit,
            offset: offset
        });
        res.status(200).json({
            ok: true,
            code: "SUCCESS",
            message: "Jobs fetched successfully",
            jobs: rows,
            count: count,
            page: parsedPage,
            limit: parsedLimit
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            ok: false,
            code: "SERVER_ERROR",
            message: "Internal server error"
        });
    }
};

exports.getJobByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findOne({
            where: {
                id: id
            },
            attributes: ["id", "title", "location", "salary_min", "salary_max", "description_html", "responsabilities_html", "requirements_html", "benefits_html"],
            include: [
                {
                    model: Modality,
                    attributes: ["name"]
                },
                {
                    model: TypeOfJob,
                    attributes: ["name"]
                },
                {
                    model: Company,
                    attributes: ["name"]
                }
            ]
        });
        res.status(200).json({
            ok: true,
            code: "SUCCESS",
            message: "Job fetched successfully",
            job: job
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            ok: false,
            code: "SERVER_ERROR",
            message: "Internal server error"
        });
    }
};

exports.postPostulateToJobController = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findOne({
            where: {
                id: id
            },
            attributes: ["id"],
        });
        if (!job) {
            return res.status(404).json({
                ok: false,
                code: "NOT_FOUND",
                message: "Job not found"
            });
        }
        const postulatedWork = await PostulatedWork.findOne({
            where: {
                jobId: job.id,
                userId: req.userId
            }
        })
        if (postulatedWork) {
            return res.status(400).json({
                ok: false,
                code: "BAD_REQUEST",
                message: "You have already postulated to this job"
            });
        }

        await PostulatedWork.create({
            jobId: job.id,
            userId: req.userId
        })

        res.status(200).json({
            ok: true,
            code: "SUCCESS",
            message: "Postulated to job successfully",
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            ok: false,
            code: "SERVER_ERROR",
            message: "Internal server error"
        });
    }
};

exports.getPostulatedWorksController = async (req, res) => {
    try {
        const { page = 1, limit = 20, search = "" } = req.query
        const parsedPage = Math.max(1, parseInt(page), 1);
        const parsedLimit = Math.max(1, parseInt(limit), 20);
        const offset = (parsedPage - 1) * parsedLimit;
        const job = await Job.findAll({
            where: {
                title: {
                    [Op.like]: `%${search}%`
                }
            },
            attributes: ["id"]
        })
        const { rows, count } = await PostulatedWork.findAndCountAll({
            where: {
                userId: req.userId,
                jobId: {
                    [Op.in]: job.map(job => job.id)
                }
            },
            attributes: ["id", "jobId", "userId", "status", "createdAt"],
            include: [
                {
                    model: Job,
                    attributes: ["id", "title", "location", "salary_min", "salary_max", "companyId"]
                }
            ],
            limit: parsedLimit,
            offset: offset
        });

        const finalResponse = await Promise.all(rows.map(async postulatedWork => {
            const company = await Company.findOne({
                where: {
                    id: postulatedWork.job.companyId
                },
                attributes: ["name"]
            });
            return {
                id: postulatedWork.id,
                jobId: postulatedWork.jobId,
                userId: postulatedWork.userId,
                status: postulatedWork.status,
                createdAt: postulatedWork.createdAt,
                job: postulatedWork.job,
                company: company
            }
        }))

        res.status(200).json({
            ok: true,
            code: "SUCCESS",
            message: "Postulated works fetched successfully",
            postulatedWorks: finalResponse,
            count: count
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            ok: false,
            code: "SERVER_ERROR",
            message: "Internal server error"
        });
    }
};

exports.getPostulatedWorksReceivedController = async (req, res) => {
    try {
        const { page = 1, limit = 20, search = "" } = req.query
        const parsedPage = Math.max(1, parseInt(page), 1);
        const parsedLimit = Math.max(1, parseInt(limit), 20);
        const offset = (parsedPage - 1) * parsedLimit;
        const job = await Job.findAll({
            where: {
                userId: req.userId,
                title: {
                    [Op.like]: `%${search}%`
                }
            },
            attributes: ["id"]
        })
        const { rows, count } = await Job.findAndCountAll({
            where: {
                userId: req.userId,
                id: {
                    [Op.in]: job.map(job => job.id)
                }
            },
            attributes: ["id", "title", "location", "salary_min", "salary_max", "companyId"],
            limit: parsedLimit,
            offset: offset
        });

        if (rows.length === 0) {
            return res.status(200).json({
                ok: true,
                code: "SUCCESS",
                message: "Jobs not found",
                postulatedWorks: []
            });
        }

        const postulatedWorks = await PostulatedWork.findAll({
            where: {
                jobId: rows.map(job => job.id)
            },
            attributes: ["id", "jobId", "userId", "status", "createdAt"],
            include: [
                {
                    model: Job,
                    attributes: ["id", "title", "location", "salary_min", "salary_max", "companyId"]
                }
            ],
            limit: parsedLimit,
            offset: offset
        });

        if (postulatedWorks.length === 0) {
            return res.status(200).json({
                ok: true,
                code: "SUCCESS",
                message: "Postulated works not found",
                postulatedWorks: []
            });
        }

        const finalResponse = await Promise.all(postulatedWorks.map(async postulatedWork => {
            const company = await Company.findOne({
                where: {
                    id: postulatedWork.job.companyId
                },
                attributes: ["name"]
            });


            return {
                id: postulatedWork.id,
                jobId: postulatedWork.jobId,
                userId: postulatedWork.userId,
                status: postulatedWork.status,
                createdAt: postulatedWork.createdAt,
                job: postulatedWork.job,
                company: company,
            }
        }))

        res.status(200).json({
            ok: true,
            code: "SUCCESS",
            message: "Postulated works fetched successfully",
            postulatedWorks: finalResponse,
            count: count
        });
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            ok: false,
            code: "SERVER_ERROR",
            message: "Internal server error"
        });
    }
};