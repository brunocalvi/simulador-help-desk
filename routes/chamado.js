module.exports = (app) => {
  app.post('/api/chamado/registrar', async (req, res) => {
    const chamado = req.body;
    let erro = [];
    let statusRet = 400;

    if(chamado.estado_chamado.length > 2) {
      erro.push('No campo estado do chamado utilize apenas siglas');
    }

    const duplicidade = await app.controllers.chamado.duplicidadeChamado(chamado.id_usuario, chamado.serial_number);

    if(duplicidade.length > 0 && erro.length == 0) {
      erro.push('Este serial já está registrado em outro chamado:');

      duplicidade.forEach(cha => {
        erro.push(`localhost:${process.env.PORT}/api/chamado/${cha.id}`); 
      });
      statusRet = 409;
    }

    const andamento = await app.controllers.chamado.confirmEmAndamento(chamado.serial_number);

    if(andamento.length > 0 && erro.length == 0) {
      erro.push('Este serial já está em um chamado em andamento!');
      statusRet = 403;
    }

    /*const limite = await app.controllers.chamado.countLimitBalcao(chamado.id_atendimento);

    if(limite.count >= 5 && erro.length == 0) {
      const fila = await app.jobs.chamadoEmEspera.addNaFila(chamado);

      erro.push('O balcão de atendimento chegou no limite de chamados em espera, você entrou em uma fila para aguardar!');
      erro.push(`Posição na fila: ${fila}`);
      statusRet = 200;
    }*/
    
    if(erro[0] == undefined || erro[0] == '') {
      try {
        const fila = await app.jobs.chamadoEmEspera.addNaFila(chamado);

        res.status(200).json({
          status: 200,
          metodo: 'Chamado',
          mensagem: `O chamado entrou em uma fila de processamento!'`,
          fila: fila
        });

        /*const retorno = await app.controllers.chamado.addChamado(chamado);

        res.status(201).json({
          status: 201,
          metodo: 'Chamado',
          mensagem: `Chamado nº${retorno.id} cadastrado com sucesso`,
          id: retorno.id
        });*/

      } catch(e) {
        res.status(400).json({
          status: 400,
          metodo: 'Chamado',
          mensagem: `Falha ao cadastrar o chamado`,
          alerta: e.message
        });
      }
    } else {

      res.status(statusRet).json({
        status: statusRet,
        metodo: 'Chamado',
        mensagem: `Falha ao cadastrar o chamado`,
        alerta: erro
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
    const { customer_id, page = 1, size = 10 } = req.query;

    try {
      const id = await app.controllers.usuario.retornaIdPorCustomer(customer_id);
      let id_usuario = id.id;
  
      try {   
        const { count, rows: todosChamados } = await app.controllers.chamado.consultarChamCustomer(id_usuario, page, parseInt(size));
  
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
    } catch(e) { console.log(e) }
    
  });

  app.get('/api/chamado/:id', async (req, res) => {
    const id = req.params.id;
    let erro = [];

    if(isNaN(id)) {
      erro.push('Insira um ID valido na rota!');
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

  app.put('/api/chamado/:id', async (req, res) => {
    const id = req.params.id;
    const dadosChamado = req.body;
    const { motivo_chamado, estado_chamado, device_id, serial_number } = dadosChamado;

    let erro = [];

    if(isNaN(id)) {
      erro.push('Insira um ID valido na rota!');
    }

    if(motivo_chamado == undefined || motivo_chamado == '') {
      erro.push('O campo motivo_chamado precisa estar preenchido!');
    }

    if(device_id == undefined || device_id == '') {
      erro.push('O campo device_id precisa estar preenchido!');
    }

    if(serial_number == undefined || serial_number == '') {
      erro.push('O campo serial_number precisa estar preenchido!');
    }

    if(estado_chamado == undefined || estado_chamado == '') {
      dadosChamado.estado_chamado = "AB";
    }

    if(erro[0] == undefined || erro[0] == '') {
      try {
        const resultado = await app.controllers.chamado.atualizaChamado(dadosChamado, id);

        res.status(200).json({
          status: 200,
          metodo: 'Chamado',
          mensagem: `Chamado atualizado com sucesso.`
        });

      } catch(e) {
        res.status(400).json({
          status: 400,
          metodo: 'Chamado',
          error: e.message
        });
      }
    } else {
      res.status(400).json({
        status: 400,
        metodo: 'Chamado',
        error: erro
      });
    }
  });

  return app;
}