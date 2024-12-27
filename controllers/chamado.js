const Chamado = require('../models/Chamado');
const { Op } = require('sequelize');

module.exports = () => {
  async function addChamado(params) {
    return await Chamado.create({ 
      "id_atendimento": params.id_atendimento,
      "id_usuario": params.id_usuario,
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

  async function consultarChamCustomer(id_usuario, page, size) {
    const offset = (page - 1) * size;
    return await Chamado.findAndCountAll({
      where: {
        id_usuario: id_usuario,
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

  async function duplicidadeChamado(id_usuario, serial_number) {
    return await Chamado.findAll({
      where: {
        "id_usuario": id_usuario,
        "serial_number": serial_number,
        "estado_chamado": { [Op.ne]: 'CO' }, // Verifica o estado_chamado é != 'CO'
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

  /*async function countLimitBalcao(id_atendimento) {
    return await Chamado.findAndCountAll({
      where: {
        "id_atendimento": id_atendimento,
        "estado_chamado": { [Op.ne]: 'CO' },
      },
    });
  }*/

  return { addChamado, consultarChamados, consultarChamCustomer, consultaChamado, atualizaChamado, duplicidadeChamado, confirmEmAndamento }
}