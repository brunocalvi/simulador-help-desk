const Sequelize = require('sequelize');
const connection = require("../database/connection");
const Chamado = require('./Chamado');

const Usuario = connection.define("tb_usuarios", {
  customer_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  usuario: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  senha: {
    type: Sequelize.STRING,
  }
});

Usuario.hasMany(Chamado, {
  foreignKey: 'customer_id'
});

/*Usuario.sync({ alter: true })
.then(() => {
  console.log("Tabela 'tb_usuarios' sincronizada com sucesso!");
})
.catch((error) => {
  console.error("Erro ao sincronizar a tabela:", error.message);
});*/

module.exports = Usuario;