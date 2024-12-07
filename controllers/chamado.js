const Chamado = require('../models/Chamado');

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

  return { addChamado, consultarChamados, consultarChamCustomer, consultaChamado }
}