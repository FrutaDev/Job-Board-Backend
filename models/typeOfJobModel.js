const { DataTypes } = require("sequelize");
const sequelize = require("../src/utils/database");

const TypeOfJob = sequelize.define("typeOfJob", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.ENUM("Full-time", "Part-time", "Internship"),
        allowNull: false
    },
});

module.exports = TypeOfJob;