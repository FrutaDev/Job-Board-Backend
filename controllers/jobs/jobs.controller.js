const { clean } = require("../../src/utils/jobSanitizer.js");
const Job = require("../../models/jobModel.js")

exports.createJobController = async (req, res) => {
    try {
        const { title, companyId, location, salary_min, salary_max, modalityId, typeOfJobId, description_html, description_text, responsabilities_html, responsabilities_text, requirements_html, requirements_text, benefits_html, benefits_text } = req.body;
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
        console.log("👽👽👽 Job created successfully");
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