const Company = require("../../models/companyModel.js");
const Modality = require("../../models/modalityModel.js");
const TypeOfJob = require("../../models/typeOfJobModel.js");
const fs = require("fs");

const genericLocalRFC = "XAXX010101000";
const genericForeignRFC = "XEXX010101000";

exports.createCompanyController = async (req, res) => {
    console.log("Entrando al controlador de createCompanyController")
    try {
        const { name, rfc, country, state, city, zipCode, street, streetNumber, email, phone, description } = req.body;
        const logo = req.file;

        if (!name || !rfc || !country || !state || !city || !zipCode || !street || !streetNumber || !email || !phone || !description) {
            return res.status(400).json({
                ok: false,
                code: "BAD_REQUEST",
                message: "Campo obligatorio faltante"
            });
        }

        const company = await Company.findOne({ where: { rfc: rfc } });
        if (company && company.rfc !== genericLocalRFC && company.rfc !== genericForeignRFC) {
            return res.status(400).json({
                ok: false,
                code: "BAD_REQUEST",
                message: "RFC ya registrado"
            });
        }

        await Company.create({
            name: name,
            rfc: rfc,
            logo: logo.path,
            country: country,
            state: state,
            city: city,
            zip_code: zipCode,
            street: street,
            street_number: streetNumber,
            contact_email: email,
            contact_phone: phone,
            userId: req.userId,
            description: description
        });
        res.status(201).json({
            ok: true,
            code: "SUCCESS",
            message: "Solicitud de alta creada correctamente"
        });
    } catch (e) {
        console.error(e);
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({
            ok: false,
            code: "SERVER_ERROR",
            message: "Error al crear la solicitud de alta"
        });
    }
};

exports.getCompaniesController = async (req, res) => {
    try {
        const [companies, modalities, typeOfJobs] = await Promise.all([
            Company.findAll({ where: { userId: req.userId, isApproved: "approved" }, attributes: ['id', 'name'] }),
            Modality.findAll({ attributes: ['id', 'name'] }),
            TypeOfJob.findAll({ attributes: ['id', 'name'] })
        ]);
        res.status(200).json({
            ok: true,
            code: "SUCCESS",
            message: "Solicitudes de alta obtenidas correctamente",
            companies: companies,
            modalities: modalities,
            typeOfJobs: typeOfJobs
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            ok: false,
            code: "SERVER_ERROR",
            message: "Error al obtener las solicitudes de alta"
        });
    }
};

exports.getCompaniesForRequestsPage = async (req, res) => {
    try {
        const companies = await Company.findAll({
            where: {
                userId: req.userId
            },
            attributes: ["id", "name", "isApproved", "contact_email", "contact_phone", "logo", "createdAt"],
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
};

exports.getCompaniesForMainPageController = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query
        const parsedPage = Math.max(1, parseInt(page), 1);
        const parsedLimit = Math.max(1, parseInt(limit), 20);
        const offset = (parsedPage - 1) * parsedLimit;
        const { rows, count } = await Company.findAndCountAll({
            where: {
                isApproved: "approved"
            },
            attributes: ["id", "name", "logo", "city", "state", "description"],
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