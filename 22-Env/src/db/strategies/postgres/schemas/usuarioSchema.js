const Sequelize = require('sequelize');

const UsuarioSchema = {
  name: 'usuarios',
  schema: {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
      unique: true,
      required: true,
    },
    password: {
      type: Sequelize.STRING,
      required: true,
    },
  },
  options: {
    tableName: 'tb_usuarios',
    freezeTableName: false,
    timestamps: false,
  },
};

module.exports = UsuarioSchema;
