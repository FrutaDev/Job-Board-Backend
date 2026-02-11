const express = require("express");

const sequelize = require("./src/utils/database");
const cors = require("cors");

const User = require("./models/userModel");
const Company = require("./models/companyModel");
const TypeOfJob = require("./models/typeOfJobModel");
const RefreshToken = require("./models/refreshTokensModel");
const Job = require("./models/jobModel");
const Modality = require("./models/modalityModel");
const PostulatedWork = require("./models/postulatedWorksModel");

const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

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

PostulatedWork.belongsTo(User, { foreignKey: "userId" });
User.hasMany(PostulatedWork, { foreignKey: "userId" });

PostulatedWork.belongsTo(Job, { foreignKey: "jobId" });
Job.hasMany(PostulatedWork, { foreignKey: "jobId" });

sequelize
    .sync()
    .then(() => {
        console.log("Database synchronized");
        app.listen(3000, () => {
            console.log("Server is running on address http://127.0.0.1:3000/");
        });
    })
    .catch((error) => {
        console.error("Error synchronizing database:", error);
    });