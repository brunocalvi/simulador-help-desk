const Balcao = require('../models/BalcaoAtendimento');

module.exports = () => {
  async function addBalcao(dados) {
    return await Balcao.create({ 
      "atendente_balcao": dados.atendente_balcao, 
      "fila_atendimento": dados.fila_atendimento 
    });
  }

  async function consultaBalcoes() {
    return await Balcao.findAll();
  }

  async function consultaUmBalcao(id) {
    return await Balcao.findByPk(id);
  }

  async function deletarBalcao(id) {
    await Balcao.destroy({ where: { id: id }});
  }

  return { addBalcao, consultaBalcoes, consultaUmBalcao, deletarBalcao };
}