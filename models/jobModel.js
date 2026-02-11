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
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    salary: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    typeOfJobId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    modalityId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Job;