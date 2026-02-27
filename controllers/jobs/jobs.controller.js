const { clean } = require("../../src/utils/jobSanitizer.js");
const Job = require("../../models/jobModel.js")
const Modality = require("../../models/modalityModel.js")
const TypeOfJob = require("../../models/typeOfJobModel.js")
const Company = require("../../models/companyModel.js")
const PostulatedWork = require("../../models/postulatedWorksModel.js")

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
        const { page = 1, limit = 20 } = req.query
        const parsedPage = Math.max(1, parseInt(page), 1);
        const parsedLimit = Math.max(1, parseInt(limit), 20);
        const offset = (parsedPage - 1) * parsedLimit;
        const { rows, count } = await Job.findAndCountAll({
            where: {
                isApproved: "approved"
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
        const jobs = await Job.findAll({
            where: {
                userId: req.userId
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
            ]
        });
        res.status(200).json({
            ok: true,
            code: "SUCCESS",
            message: "Jobs fetched successfully",
            jobs: jobs
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
        const postulatedWorks = await PostulatedWork.findAll({
            where: {
                userId: req.userId
            },
            attributes: ["id", "jobId", "userId", "status", "createdAt"],
            include: [
                {
                    model: Job,
                    attributes: ["id", "title", "location", "salary_min", "salary_max", "companyId"]
                }
            ]
        });

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
                company: company
            }
        }))

        res.status(200).json({
            ok: true,
            code: "SUCCESS",
            message: "Postulated works fetched successfully",
            postulatedWorks: finalResponse,
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
        console.log("👽👽")
        const jobs = await Job.findAll({
            where: {
                userId: req.userId
            },
            attributes: ["id", "title", "location", "salary_min", "salary_max", "companyId"]
        });

        console.log("👽👽", jobs)

        if (jobs.length === 0) {
            return res.status(200).json({
                ok: true,
                code: "SUCCESS",
                message: "Jobs not found",
                postulatedWorks: []
            });
        }

        const postulatedWorks = await PostulatedWork.findAll({
            where: {
                jobId: jobs.map(job => job.id)
            },
            attributes: ["id", "jobId", "userId", "status", "createdAt"],
            include: [
                {
                    model: Job,
                    attributes: ["id", "title", "location", "salary_min", "salary_max", "companyId"]
                }
            ]
        });

        console.log("👽👽", postulatedWorks)

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
                company: company
            }
        }))

        res.status(200).json({
            ok: true,
            code: "SUCCESS",
            message: "Postulated works fetched successfully",
            postulatedWorks: finalResponse,
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