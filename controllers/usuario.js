const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

module.exports = () => {
  async function addUsuario(dados) {
    let senhaH = await senhaHash(dados.senha);

    return await Usuario.create({ 
      "usuario": dados.usuario,
      "senha": senhaH
    });
  }

  async function consultaUsuario(customer_id) {
    return await Usuario.findByPk(customer_id, { attributes: ['customer_id', 'usuario', 'createdAt'] });
  }

  async function atualizarUsuario(dados, customer_id) {
    return await Usuario.update(
      { 
        "senha": dados.senha,
        "usuario": dados.usuario, 
      },
      { where: { customer_id: customer_id }}
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
      { where: { customer_id: id }}
    );
  }

  async function login(dados) {
    const usuarBD = await Usuario.findOne({ where: { "usuario": dados.usuario } });
    const checked = await checkSenha(dados.senha, usuarBD.senha);

    if(checked == true) {
      return await consultaUsuario(usuarBD.customer_id);
    }
  }

  return { addUsuario, consultaUsuario, atualizarUsuario, atualizarSenha, login, checkSenha }
}