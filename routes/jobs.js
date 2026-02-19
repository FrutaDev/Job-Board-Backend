const express = require("express");
const router = express.Router();
const { createJobController, getAllJobsController, getJobsForRequestsPage } = require("../controllers/jobs/jobs.controller");
const { createCompanyController, getCompaniesController, getCompaniesForRequestsPage } = require("../controllers/jobs/companies.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validators");
const { companySchema } = require("../middlewares/validators");
const upload = require("../middlewares/uploadFile");

router.get("/all-jobs", authMiddleware(["admin", "user"]), getAllJobsController);
router.get("/companies", authMiddleware(["admin", "user"]), getCompaniesController);
router.post("/create-job", authMiddleware(["admin", "user"]), createJobController);
router.post("/create-company", authMiddleware(["admin", "user"]), upload.single("logo"), validate(companySchema), createCompanyController);
router.get("/get-jobs-for-requests-page", authMiddleware(["admin", "user"]), getJobsForRequestsPage);
router.get("/get-companies-for-requests-page", authMiddleware(["admin", "user"]), getCompaniesForRequestsPage);

module.exports = router;
