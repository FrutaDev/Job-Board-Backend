const { DataTypes } = require("sequelize");
const sequelize = require("../src/utils/database");

const PostulatedWork = sequelize.define("postulatedWork", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    jobId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = PostulatedWork;