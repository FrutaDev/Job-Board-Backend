const express = require("express");
const router = express.Router();
const { createJobController, getAllJobsController, getJobsForRequestsPage, getJobByIdController, postPostulateToJobController, getPostulatedWorksController, getPostulatedWorksReceivedController, updatePostulatedJobStatusController, getPostulateByIdController, getPostulateReceivedByIdController } = require("../controllers/jobs/jobs.controller");
const { createCompanyController, getCompaniesController, getCompaniesForRequestsPage, getCompaniesForMainPageController } = require("../controllers/jobs/companies.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validators");
const { companySchema } = require("../middlewares/validators");
const { uploadLogo } = require("../middlewares/uploadFile");

router.get("/all-jobs", authMiddleware(["admin", "user"]), getAllJobsController);
router.get("/get-jobs-for-requests-page", authMiddleware(["admin", "user"]), getJobsForRequestsPage);
router.post("/create-job", authMiddleware(["admin", "user"]), createJobController);

router.get("/companies", authMiddleware(["admin", "user"]), getCompaniesController);
router.get("/companies-main-page", authMiddleware(["admin", "user"]), getCompaniesForMainPageController);
router.get("/get-companies-for-requests-page", authMiddleware(["admin", "user"]), getCompaniesForRequestsPage);
router.post("/create-company", authMiddleware(["admin", "user"]), uploadLogo.single("logo"), validate(companySchema), createCompanyController);

router.get("/postulates", authMiddleware(["user", "admin"]), getPostulatedWorksController)
router.get("/postulates-received", authMiddleware(["admin", "user"]), getPostulatedWorksReceivedController)
router.put("/postulate/", authMiddleware(["admin", "user"]), updatePostulatedJobStatusController)
router.get("/postulate-received/:id", authMiddleware(["admin", "user"]), getPostulateReceivedByIdController)
router.get("/postulate/:id", authMiddleware(["admin", "user"]), getPostulateByIdController)
router.get("/:id", authMiddleware(["admin", "user"]), getJobByIdController);
router.post("/:id/postulate", authMiddleware(["user"]), postPostulateToJobController);


module.exports = router;
