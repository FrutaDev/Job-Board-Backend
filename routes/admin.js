const express = require("express")
const router = express.Router()

const {
    getAllJobForAdminPanelController,
    getAllCompaniesForAdminPanelController,
    postJobIsApprovedController,
    postCompanyIsApprovedController,
    getCompanyForAdminPanelByIdController
} = require("../controllers/admin/admin.controllers")

router.get("/jobs", getAllJobForAdminPanelController)
router.get("/companies", getAllCompaniesForAdminPanelController)
router.get("/companies/:id", getCompanyForAdminPanelByIdController)
router.post("/job/:id/approve", postJobIsApprovedController)
router.post("/company/:id/approve", postCompanyIsApprovedController)

module.exports = router