const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

module.exports = () => {
  async function addUsuario(dados) {
    let senhaH = await senhaHash(dados.senha);

    return await Usuario.create({ 
      "usuario": dados.usuario,
      "senha": senhaH,
      "customer_id": dados.customer_id
    });
  }

  async function consultaUsuario(id_usuario) {
    return await Usuario.findByPk(id_usuario, { attributes: ['id', 'customer_id', 'usuario', 'createdAt'] });
  }

  async function atualizarUsuario(dados, id_usuario) {
    return await Usuario.update(
      { 
        "senha": dados.senha,
        "usuario": dados.usuario, 
      },
      { where: { id_usuario: id_usuario }}
    );
  }

  async function senhaHash(senha) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(senha, salt); 
  };

  async function checkSenha(password, hash) {
    return bcrypt.compareSync(password, hash);
  };

  async function atualizarSenha(senha, id) {
    let senhaH = await senhaHash(senha);

    return await Usuario.update(
      { senha: senhaH },
      { where: { id: id }}
    );
  }

  async function login(dados) {
    const usuarBD = await Usuario.findOne({ where: { "usuario": dados.usuario } });
    const checked = await checkSenha(dados.senha, usuarBD.senha);

    if(checked == true) {
      return await consultaUsuario(usuarBD.id);
    }
  }

  async function retornaIdPorCustomer(customer_id) {
    return await Usuario.findOne({ where: { "customer_id": customer_id } });
  }

  return { addUsuario, consultaUsuario, atualizarUsuario, atualizarSenha, login, checkSenha, retornaIdPorCustomer }
}