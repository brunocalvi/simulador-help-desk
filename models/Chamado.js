const Sequelize = require('sequelize');
const connection = require('../database/connection');

const Chamado = connection.define('tb_chamados', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_atendimento: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "tb_balcao_atendimentos",
      key: "id",
    }
  },
  id_usuario: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "tb_usuarios",
      key: "id",
    }
  },
  device_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  serial_number: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  motivo_chamado: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  estado_chamado: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

//User.sync({ force: true })
//User.sync({ alter: true })

/*
Chamado.sync({ alter: true })
  .then(() => {
    console.log("Tabela 'tb_chamados' sincronizada com sucesso!");
  })
  .catch((error) => {
    console.error("Erro ao sincronizar a tabela:", error.message);
  });
*/

module.exports = Chamado;