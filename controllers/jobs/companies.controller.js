const Company = require("../../models/companyModel.js");
const Modality = require("../../models/modalityModel.js");
const TypeOfJob = require("../../models/typeOfJobModel.js");

const genericLocalRFC = "XAXX010101000";
const genericForeignRFC = "XEXX010101000";

exports.createCompanyController = async (req, res) => {
    try {
        const { name, rfc, country, state, city, zipCode, street, streetNumber, email, phone } = req.body;
        const logo = req.file;
        if (!name || !rfc || !country || !state || !city || !zipCode || !street || !streetNumber || !email || !phone) {
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
            logo: logo,
            country: country,
            state: state,
            city: city,
            zip_code: zipCode,
            street: street,
            street_number: streetNumber,
            contact_email: email,
            contact_phone: phone,
            userId: req.userId
        });
        res.status(201).json({
            ok: true,
            code: "SUCCESS",
            message: "Solicitud de alta creada correctamente"
        });
    } catch (e) {
        console.error(e);
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