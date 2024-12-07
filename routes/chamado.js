module.exports = (app) => {
  app.post('/api/chamado/registrar', async (req, res) => {
    const chamado = req.body;
    let erro = [];

    if(chamado.estado_chamado.length > 2) {
      erro.push('No campo estado do chamado utilize apenas siglas');
    }

    if(erro[0] == undefined || erro[0] == '') {
      try {
        const retorno = await app.controllers.chamado.addChamado(chamado);

        res.status(201).json({
          status: 201,
          metodo: 'Chamado',
          mensagem: `Chamado nº${retorno.id} cadastrado com sucesso`
        });

      } catch(e) {
        res.status(400).json({
          status: 400,
          metodo: 'Chamado',
          mensagem: `Falha ao cadastrar o chamado`,
          error: e.message
        });
      }
    } else {

      res.status(400).json({
        status: 400,
        metodo: 'Chamado',
        mensagem: `Falha ao cadastrar o chamado`,
        error: erro
      });

    }
  });

  app.get('/api/chamado/todos', async (req, res) => {
    // Exemplo: http://servidor/api/chamado/todos?page=2&size=20
    try {
      const { page = 1, size = 10 } = req.query;
      const { count, rows: todosChamados } = await app.controllers.chamado.consultarChamados(page, parseInt(size));

      res.status(200).json({
          status: 200,
          metodo: 'Chamado',
          mensagem: 'Lista por ID',
          registros: count,
          paginacao: {
            paginaAtual: page,
            quantidadePorPagina: size,
            paginas: Math.ceil(count / size)
          },
          chamados: todosChamados,

      });
    } catch(e) {
      res.status(400).json({
        status: 400,
        metodo: 'Chamado',
        mensagem: `Falha ao visualizar os chamados`,
        error: e.message
      });
    }
  });

  app.get('/api/chamado/customer', async (req, res) => {
    // Exemplo: http://servidor/api/chamado/customer?customer_id=1&page=2&size=20
    try {
      const { customer_id, page = 1, size = 10 } = req.query;
      const { count, rows: todosChamados } = await app.controllers.chamado.consultarChamCustomer(customer_id, page, parseInt(size));

      res.status(200).json({
          status: 200,
          metodo: 'Chamado',
          mensagem: 'Lista por customer_id',
          registros: count,
          paginacao: {
            paginaAtual: page,
            quantidadePorPagina: size,
            paginas: Math.ceil(count / size)
          },
          chamados: todosChamados,

      });
    } catch(e) {
      res.status(400).json({
        status: 400,
        metodo: 'Chamado',
        mensagem: `Falha ao visualizar os chamados`,
        error: e.message
      });
    }
  });

  app.get('/api/chamado/:id', async (req, res) => {
    const id = req.params.id;
    let erro = [];

    if(isNaN(id)) {
      erro.push('Insira um ID valido na consulta!');
    }

    if(erro[0] == undefined || erro[0] == '') {
      try {
        const cham = await app.controllers.chamado.consultaChamado(id);

        res.status(200).json({
          status: 200,
          metodo: 'Chamado',
          chamado: cham
        });

      } catch(e) {
        res.status(400).json({
          status: 400,
          metodo: 'Chamado',
          mensagem: `Falha ao visualizar o chamado`,
          error: e.message
        });
      }
    } else {
      res.status(400).json({
        status: 400,
        metodo: 'Chamado',
        mensagem: `Falha ao visualizar o chamado`,
        error: erro
      });
    }
  });

  return app;
}