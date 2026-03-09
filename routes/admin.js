const express = require("express")
const router = express.Router()

const {
    getAllJobForAdminPanelController,
    getAllCompaniesForAdminPanelController,
    postJobIsApprovedController,
    postCompanyIsApprovedController,
    getCompanyForAdminPanelByIdController
} = require("../controllers/admin/admin.controllers")
const { authMiddleware } = require("../middlewares/auth.middleware")

router.get("/jobs", authMiddleware(["admin"]), getAllJobForAdminPanelController)
router.get("/companies", authMiddleware(["admin"]), getAllCompaniesForAdminPanelController)
router.get("/companies/:id", authMiddleware(["admin"]), getCompanyForAdminPanelByIdController)
router.post("/job/:id/approve", authMiddleware(["admin"]), postJobIsApprovedController)
router.post("/company/:id/approve", authMiddleware(["admin"]), postCompanyIsApprovedController)

module.exports = router