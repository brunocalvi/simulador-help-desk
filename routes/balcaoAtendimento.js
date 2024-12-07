module.exports = (app) => {
  app.post('/api/balcaoAtendimento/registrar', async (req, res) => {
    const balcao = req.body;

    try {
      const registro = await app.controllers.balcaoAtendimento.addBalcao(balcao);

      res.status(201).json({
        status: 201,
        metodo: 'Balcão de Atendimento',
        mensagem: `O balcão ${registro.fila_atendimento} foi cadastrado com sucesso`
      });

    } catch(e) {
      res.status(400).json({
        status: 400,
        metodo: 'Balcão de Atendimento',
        mensagem: `Falha ao cadastrar o balcão de atendimento`,
        error: e.message
      });
    }
  });

  app.get('/api/balcaoAtendimento/todosBalcao', async (req, res) => {
    try {
      const todos = await app.controllers.balcaoAtendimento.consultaBalcoes();

      res.status(200).json({
        status: 200,
        metodo: 'Balcão de Atendimento',
        lista: todos
      })

    } catch(e) {
      res.status(400).json({
        status: 400,
        metodo: 'Balcão de Atendimento',
        mensagem: `Falha ao consultar os balcões cadastrados`,
        error: e.message
      });
    }

    app.get('/api/balcaoAtendimento/balcao/:id', async (req, res) => {
      const id = req.params.id;
      let erro = [];

      if(isNaN(id)) {
        erro.push('Insira um ID valido na consulta!');
      }

      if(erro[0] == undefined || erro[0] == '') {
        try {
          const result = await app.controllers.balcaoAtendimento.consultaUmBalcao(id);

          res.status(200).json({
            status: 200,
            metodo: 'Balcão de Atendimento',
            balcao: result
          });

        } catch(e) {

          res.status(400).json({
            status: 400,
            metodo: 'Balcão de Atendimento',
            mensagem: `Falha ao consultar o balcão cadastrado`,
            error: e.message
          });

        }
      } else {

        res.status(400).json({
          status: 400,
          metodo: 'Balcão de Atendimento',
          mensagem: `Falha ao consultar o balcão cadastrado`,
          error: erro
        });

      }
    })
  });

  app.delete('/api/balcaoAtendimento/balcao/:id', async (req, res) => {
    const id = req.params.id;

    try {
      const result = await app.controllers.balcaoAtendimento.deletarBalcao(id);

      res.status(200).json({
        status: 200,
        metodo: 'Balcão de Atendimento',
        mensagem: `Balcão de atendimento deletado com sucesso`
      });


    } catch(e) {
      res.status(400).json({
        status: 400,
        metodo: 'Balcão de Atendimento',
        mensagem: `Falha ao deletar o balcão cadastrado`,
        error: e.message
      });
    }
  });

  return app;
}