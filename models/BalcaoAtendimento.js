const Sequelize = require("sequelize");
const connection = require("../database/connection");
const Chamado = require('./Chamado');

const BalcaoAtendimento = connection.define("tb_balcao_atendimentos", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  atendente_balcao: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  fila_atendimento: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

BalcaoAtendimento.hasMany(Chamado, {
  foreignKey: 'id_atendimento'
});

BalcaoAtendimento.sync({ alter: true })
  .then(() => {
    console.log("Tabela 'tb_balcao_atendimentos' sincronizada com sucesso!");
  })
  .catch((error) => {
    console.error("Erro ao sincronizar a tabela:", error.message);
  });

module.exports = BalcaoAtendimento;
