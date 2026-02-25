const express = require("express");
require("dotenv").config();

const sequelize = require("./src/utils/database");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const User = require("./models/userModel");
const Company = require("./models/companyModel");
const TypeOfJob = require("./models/typeOfJobModel");
const RefreshToken = require("./models/refreshTokensModel");
const Job = require("./models/jobModel");
const Modality = require("./models/modalityModel");
const PostulatedWork = require("./models/postulatedWorksModel");

const authRoutes = require("./routes/auth");
const jobsRoutes = require("./routes/jobs");
const adminRoutes = require("./routes/admin");
const { setUserId } = require("./middlewares/setUserId");
const { seedModalities } = require("./models/seeds/seedModalities");
const { seedTypeOfJob } = require("./models/seeds/seedTypeOfJob");

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/auth", authRoutes);

app.use(setUserId);

app.use("/admin", adminRoutes);

app.use("/jobs", jobsRoutes);

app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
    res.status(201).json({ message: "Hello World!" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        ok: false,
        code: "SERVER_ERROR",
        message: "Internal server error"
    });
});

User.hasOne(RefreshToken, { foreignKey: "userId" });
RefreshToken.belongsTo(User, { foreignKey: "userId" });

User.hasOne(Company, { foreignKey: "userId" });
Company.belongsTo(User, { foreignKey: "userId" });

TypeOfJob.hasMany(Job, { foreignKey: "typeOfJobId" });
Job.belongsTo(TypeOfJob, { foreignKey: "typeOfJobId" });

Modality.hasMany(Job, { foreignKey: "modalityId" });
Job.belongsTo(Modality, { foreignKey: "modalityId" });

Company.hasMany(Job, { foreignKey: "companyId" });
Job.belongsTo(Company, { foreignKey: "companyId" });
Job.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Job, { foreignKey: "userId" })

PostulatedWork.belongsTo(User, { foreignKey: "userId" });
User.hasMany(PostulatedWork, { foreignKey: "userId" });

PostulatedWork.belongsTo(Job, { foreignKey: "jobId" });
Job.hasMany(PostulatedWork, { foreignKey: "jobId" });

sequelize
    .sync()
    .then(async () => {
        console.log("Database synchronized");
        await seedModalities();
        await seedTypeOfJob();
        app.listen(3000, () => {
            console.log("Server is running on address http://127.0.0.1:3000/");
        });
    })
    .catch((error) => {
        console.error("Error synchronizing database:", error);
    });