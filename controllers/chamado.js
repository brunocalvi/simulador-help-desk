const Chamado = require('../models/Chamado');
const { Op } = require('sequelize');

module.exports = () => {
  async function addChamado(params) {
    return await Chamado.create({ 
      "id_atendimento": params.id_atendimento,
      "customer_id": params.customer_id,
      "motivo_chamado": params.motivo_chamado,
      "estado_chamado": params.estado_chamado,
      "device_id": params.device_id,
      "serial_number": params.serial_number
    }); 
  }

  async function consultarChamados(page, size) {
    const offset = (page - 1) * size;
    return await Chamado.findAndCountAll({
        limit: size,
        offset: offset
    });
  }

  async function consultarChamCustomer(customer_id, page, size) {
    const offset = (page - 1) * size;
    return await Chamado.findAndCountAll({
      where: {
        customer_id: customer_id,
      },
      limit: size,
      offset: offset
    });
  }

  async function consultaChamado(id) {
    return await Chamado.findByPk(id);
  }

  async function atualizaChamado(dados, id) {
    return await Chamado.update({
        "motivo_chamado": dados.motivo_chamado,
        "estado_chamado": dados.estado_chamado,
        "device_id": dados.device_id,
        "serial_number": dados.serial_number
      },
      { where: { id: id }}
    );
  }

  async function duplicidadeChamado(customer_id, serial_number) {
    return await Chamado.findAll({
      where: {
        "customer_id": customer_id,
        "serial_number": serial_number,
        "estado_chamado": { [Op.ne]: 'CO' }, // Verifica onde estado_chamado é != 'CO'
      },
    });
  }

  async function confirmEmAndamento(serial_number) {
    return await Chamado.findAll({
      where: {
        "serial_number": serial_number,
        "estado_chamado": { [Op.ne]: 'CO' }, // Verifica estado_chamado é != 'CO'
      },
    });
  }

  return { addChamado, consultarChamados, consultarChamCustomer, consultaChamado, atualizaChamado, duplicidadeChamado, confirmEmAndamento }
}