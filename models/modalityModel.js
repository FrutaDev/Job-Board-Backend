const { DataTypes } = require("sequelize");
const sequelize = require("../src/utils/database");

const Modality = sequelize.define("modality", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.ENUM("Presencial", "Remoto", "Híbrido"),
        allowNull: false
    },
});

module.exports = Modality;