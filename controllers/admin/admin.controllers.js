const Job = require("../../models/jobModel")
const Modality = require("../../models/modalityModel")
const TypeOfJob = require("../../models/typeOfJobModel")
const Company = require("../../models/companyModel")
const { Op } = require("sequelize");

exports.getAllJobForAdminPanelController = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        const parsedPage = Math.max(1, parseInt(page), 1);
        const parsedLimit = Math.max(1, parseInt(limit), 20);
        const offset = (parsedPage - 1) * parsedLimit;
        const { rows, count } = await Job.findAndCountAll({
            where: {
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
}

exports.getAllCompaniesForAdminPanelController = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        const parsedPage = Math.max(1, parseInt(page), 1);
        const parsedLimit = Math.max(1, parseInt(limit), 20);
        const offset = (parsedPage - 1) * parsedLimit;
        const { rows, count } = await Company.findAndCountAll({
            where: {
                name: {
                    [Op.like]: `%${search}%`
                }
            },
            attributes: ["id", "name", "country", "state", "city", "logo", "createdAt", "isApproved"],
            order: [
                ["createdAt", "DESC"]
            ],
            limit: parsedLimit,
            offset: offset
        });
        res.status(200).json({
            ok: true,
            code: "SUCCESS",
            message: "Companies fetched successfully",
            companies: rows,
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
}

exports.getCompanyForAdminPanelByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await Company.findOne({
            where: {
                id: id
            },
            attributes: ["id", "name", "rfc", "country", "state", "city", "contact_email", "contact_phone", "logo", "isApproved", "description", "zip_code", "street", "street_number"]
        });
        res.status(200).json({
            ok: true,
            code: "SUCCESS",
            message: "Company fetched successfully",
            company: company
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            ok: false,
            code: "SERVER_ERROR",
            message: "Internal server error"
        });
    }
}

exports.postJobIsApprovedController = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        console.log("👽👽", status)
        const job = await Job.findOne({
            where: {
                id: id
            }
        });
        job.isApproved = status;
        await job.save();
        res.status(200).json({
            ok: true,
            code: "SUCCESS",
            message: "Job approved successfully"
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            ok: false,
            code: "SERVER_ERROR",
            message: "Internal server error"
        });
    }
}

exports.postCompanyIsApprovedController = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const company = await Company.findOne({
            where: {
                id: id
            }
        });
        company.isApproved = status;
        await company.save();
        res.status(200).json({
            ok: true,
            code: "SUCCESS",
            message: "Company approved successfully"
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            ok: false,
            code: "SERVER_ERROR",
            message: "Internal server error"
        });
    }
}
