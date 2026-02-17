const { DataTypes } = require("sequelize");
const sequelize = require("../src/utils/database");

const Job = sequelize.define("job", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    salary_min: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    salary_max: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    modalityId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    typeOfJobId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description_html: {
        type: DataTypes.TEXT("long"),
        allowNull: false
    },
    responsabilities_html: {
        type: DataTypes.TEXT("long"),
        allowNull: false
    },
    requirements_html: {
        type: DataTypes.TEXT("long"),
        allowNull: false
    },
    benefits_html: {
        type: DataTypes.TEXT("long"),
        allowNull: false
    },
    description_text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    responsabilities_text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    requirements_text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    benefits_text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isApproved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Job;