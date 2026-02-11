const { DataTypes } = require("sequelize");
const sequelize = require("../src/utils/database");

const RefreshToken = sequelize.define("refreshToken", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

module.exports = RefreshToken;