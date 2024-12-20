const request = require('supertest');
const app = require('../app');

let balcaoTest = {
  atendente_balcao: `Test ${Date.now()}`, 
  fila_atendimento: `Test ${Date.now()}` 
};

let usuarioTest = {
  usuario: `Test ${Date.now()}`,
  senha: `Vp.cew*${Date.now()}`
}

let id_balcao;
let id_usuario;
let id_chamado;
let serial = Date.now();  

function criarChamado(dados) {
  return {
    id_atendimento: dados.id_atendimento || 99,
    customer_id: dados.customer_id || 99,
    motivo_chamado: dados.motivo_chamado || 'teste de chamado',
    estado_chamado: dados.estado_chamado || 'EE',
    device_id: dados.device_id || 1,
    serial_number: dados.serial_number || serial
  };
}

test('Deve cadastrar um balcão de atendimento para o chamado', async () => {
  return await request(app).post('/api/balcaoAtendimento/registrar')
    .send(balcaoTest)
    .then((res) => {

      id_balcao = res.body.id_balcao;

      expect(res.status).toEqual(201);
      expect(res.body.mensagem).toEqual(`O balcão ${balcaoTest.fila_atendimento} foi cadastrado com sucesso`);
    });
});

test('Deve registrar um usuário com sucesso para o chamado', async () => {
  return await request(app).post('/api/usuario/registrar')
    .send(usuarioTest)
    .then((res) => {

      id_usuario = res.body.id_usuario;

      expect(res.status).toEqual(201);
      expect(res.body.id_usuario).not.toBeNull();
    });
});


test('Deve registrar um chamado para a bateria', async () => {
  const chamado = criarChamado({
    id_atendimento: id_balcao, 
    customer_id: id_usuario
  });

  return await request(app).post('/api/chamado/registrar')
    .send(chamado)
    .then((res) => {

      id_chamado = res.body.id; 

      expect(res.status).toEqual(201);
      expect(res.body.id).not.toBeNull();
    });
});

test('Não Deve registrar um chamado com o campo estado do chamado tendo mais de 2 siglas', async () => {
  const chamado = criarChamado({
    id_atendimento: id_balcao, 
    customer_id: id_usuario, 
    serial_number: 1234567890,
    estado_chamado: 'abcd1234'
  });

  return await request(app).post('/api/chamado/registrar')
    .send(chamado)
    .then((res) => {
      expect(res.status).toEqual(400);
      expect(res.body.mensagem).toEqual('Falha ao cadastrar o chamado');
    });
});

test.skip('Não deve deixar registrar um chamado duplicado', async () => {
  const chamado = criarChamado({ 
    id_atendimento: id_balcao, 
    customer_id: id_usuario, 
    serial_number: serial
  });

  return await request(app).post('/api/chamado/registrar')
    .send(chamado)
    .then((res) => {
      expect(res.status).toEqual(409);
      expect(res.body.error[0]).toEqual('este serial já está registrado em outro chamado');
    });
});


test.skip('Não Deve registrar um chamado com um serial em um chamado aberto', async () => {
  const chamado = criarChamado({});

  return await request(app).post('/api/chamado/registrar')
    .send(chamado)
    .then((res) => {
      expect(res.status).toEqual(403);
      expect(res.body.mensagem).toEqual('Falha ao cadastrar o chamado');
    });
});


test('Deve lista todos os chamados', async () => {
  return await request(app).get('/api/chamado/todos?page=1&size=10')
    .then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.chamados).not.toBeNull();
    });
});

test('Deve lista todos os chamados por customer_id', async () => {
  return await request(app).get(`/api/chamado/customer?customer_id=${id_usuario}&page=1&size=10`)
    .then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.chamados).not.toBeNull();
    });
});

test('Deve visualizar as informações de um chamado', async () => {
  return await request(app).get(`/api/chamado/${id_chamado}`)
    .then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.chamado).not.toBeNull();
    });
});

describe('Ao alterar um chamado ...', () => {

  test('Deve aceitar apenas um ID valido', async () => {
    const chamado = criarChamado({});

    return await request(app).put(`/api/chamado/abc`)
      .send(chamado)
      .then((res) => {
        expect(res.status).toEqual(400);
        expect(res.body.error).not.toBeNull();
      });
  });

  test('Deve atualizar o chamado com sucesso', async () => {
    const chamado = criarChamado({
      id_atendimento: 99,
      customer_id: 99,
      motivo_chamado: 'Chamado atualizado',
      estado_chamado: 'CO',
      device_id: 1,
      serial_number: serial
    });

    return await request(app).put(`/api/chamado/${id_chamado}`)
      .send(chamado)
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(res.body.error).not.toBeNull();
      });
  });
  

});









