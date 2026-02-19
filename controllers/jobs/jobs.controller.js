const { clean } = require("../../src/utils/jobSanitizer.js");
const Job = require("../../models/jobModel.js")
const Modality = require("../../models/modalityModel.js")
const TypeOfJob = require("../../models/typeOfJobModel.js")
const Company = require("../../models/companyModel.js")

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
        const jobs = await Job.findAll({
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