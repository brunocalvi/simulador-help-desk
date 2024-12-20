module.exports = (app) => {
  app.post('/api/usuario/registrar', async (req, res) => {
    const dadosUsuario = req.body;
    const { usuario, senha } = dadosUsuario;
    let erro = [];

    let validaSenha = await app.common.functions.validPassword(senha);

    if(validaSenha != null) { 
      validaSenha.forEach(e => {
        erro.push(e); 
      });
    }

    if(erro[0] == undefined || erro[0] == '') {
      try {
        const retorno = await app.controllers.usuario.addUsuario(dadosUsuario);

        res.status(201).json({
          status: 201,
          metodo: 'Usuário',
          mensagem: `O usuário ${retorno.usuario} foi cadastrado com sucesso`,
          id_usuario: retorno.customer_id
        });

      } catch(e) {
        res.status(400).json({
          status: 400,
          metodo: 'Usuário',
          mensagem: `Falha ao cadastrar o usuário`,
          error: e.message
        });
      }
    } else {

      res.status(400).json({
        status: 400,
        metodo: 'Usuário',
        mensagem: `Falha ao cadastrar o usuário`,
        error: erro
      });

    }
  });

  app.get('/api/usuario/:id', async (req, res) => {
    const id = req.params.id;
    let erro = [];

    if(isNaN(id)) {
      erro.push('Insira um ID valido na consulta!');
    }

    if(erro[0] == undefined || erro[0] == '') {
      try {
        const retorno = await app.controllers.usuario.consultaUsuario(id);

        res.status(200).json({
          status: 200,
          metodo: 'Usuário',
          usuario: retorno
        });

      } catch(e) {
        res.status(400).json({
          status: 400,
          metodo: 'Usuário',
          mensagem: `Falha ao consultar o usuário`,
          error: e.message
        });
      }
    } else {

      res.status(400).json({
        status: 400,
        metodo: 'Usuário',
        mensagem: `Falha ao consultar o usuário`,
        error: erro
      });

    }
  });

  app.put('/api/usuario/:id', async (req, res) => {
    const id = req.params.id;
    let dadosUsuario = req.body;
    let { usuario, senha } = dadosUsuario;
    let erro = [];

    if(senha != undefined) {
      let validaSenha = await app.common.functions.validPassword(senha, id);

      if(validaSenha != null) { 
        validaSenha.forEach(e => {
          erro.push(e); 
        });
      }
    }

    if(erro[0] == undefined || erro[0] == '') {
      try {
        await app.controllers.usuario.atualizarUsuario(dadosUsuario, id);

        if(senha != undefined) {
          await app.controllers.usuario.atualizarSenha(senha, id);
        }

        res.status(200).json({
          status: 200,
          metodo: 'Usuário',
          mensagem: `Usuário atualizado com sucesso.`
        });

      } catch(e) {

        res.status(400).json({
          status: 400,
          metodo: 'Usuário',
          mensagem: `Falha ao atualizar o usuário`,
          error: e.message
        });

      }
    } else {

      res.status(400).json({
        status: 400,
        metodo: 'Usuário',
        mensagem: `Falha ao atualizar o usuário`,
        error: erro
      });

    }
  });

  app.post('/api/usuario/login', async (req, res) => {
    const dados = { usuario, senha } = req.body;

    try {
      const resultado = await app.controllers.usuario.login(dados);

      if(resultado != undefined){

        res.status(200).json({
          status: 200,
          metodo: 'Usuário',
          usuario: resultado 
        });

      } else {

        res.status(409).json({
          status: 409,
          metodo: 'Usuário',
          mensagem: `Usuário ou senha invalidos!`,
          usuario: resultado 
        });

      }

    } catch(e) {

      res.status(400).json({
        status: 400,
        metodo: 'Usuário',
        mensagem: `Falha ao fazer o login do usuário`,
        error: e.message
      });

    }
  })

  return app;
}