const { DataTypes } = require("sequelize");
const sequelize = require("../src/utils/database");

const Company = sequelize.define("company", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Company;