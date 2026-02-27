const Job = require("../../models/jobModel")
const Modality = require("../../models/modalityModel")
const TypeOfJob = require("../../models/typeOfJobModel")
const Company = require("../../models/companyModel")

exports.getAllJobForAdminPanelController = async (req, res) => {
    try {
        const jobs = await Job.findAll({
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
}

exports.getAllCompaniesForAdminPanelController = async (req, res) => {
    try {
        const companies = await Company.findAll({
            attributes: ["id", "name", "country", "state", "city", "logo", "createdAt", "isApproved"],
            order: [
                ["createdAt", "DESC"]
            ]
        });
        res.status(200).json({
            ok: true,
            code: "SUCCESS",
            message: "Companies fetched successfully",
            companies: companies
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
        const { isApproved } = req.body;
        const job = await Job.findOne({
            where: {
                id: id
            }
        });
        job.isApproved = isApproved;
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
        const { isApproved } = req.body;
        const company = await Company.findOne({
            where: {
                id: id
            }
        });
        company.isApproved = isApproved;
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
