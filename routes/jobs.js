const express = require("express");
const router = express.Router();
const { createJobController, getAllJobsController, getJobsForRequestsPage, getJobByIdController } = require("../controllers/jobs/jobs.controller");
const { createCompanyController, getCompaniesController, getCompaniesForRequestsPage, getCompaniesForMainPageController } = require("../controllers/jobs/companies.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validators");
const { companySchema } = require("../middlewares/validators");
const upload = require("../middlewares/uploadFile");

router.get("/all-jobs", authMiddleware(["admin", "user"]), getAllJobsController);
router.get("/companies", authMiddleware(["admin", "user"]), getCompaniesController);
router.get("/companies-main-page", authMiddleware(["admin", "user"]), getCompaniesForMainPageController);
router.get("/get-jobs-for-requests-page", authMiddleware(["admin", "user"]), getJobsForRequestsPage);
router.get("/get-companies-for-requests-page", authMiddleware(["admin", "user"]), getCompaniesForRequestsPage);
router.get("/:id", authMiddleware(["admin", "user"]), getJobByIdController);
router.post("/create-job", authMiddleware(["admin", "user"]), createJobController);
router.post("/create-company", authMiddleware(["admin", "user"]), upload.single("logo"), validate(companySchema), createCompanyController);

module.exports = router;
