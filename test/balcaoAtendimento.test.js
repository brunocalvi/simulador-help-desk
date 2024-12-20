const request = require('supertest');
const app = require('../app');

let balcaoTest = {
  atendente_balcao: `Test ${Date.now()}`, 
  fila_atendimento: `Test ${Date.now()}` 
};

let id_balcao;

test('Deve cadastrar um balcão de atendimento para o test', async () => {
  return await request(app).post('/api/balcaoAtendimento/registrar')
    .send(balcaoTest)
    .then((res) => {

      id_balcao = res.body.id_balcao;

      expect(res.status).toEqual(201);
      expect(res.body.mensagem).toEqual(`O balcão ${balcaoTest.fila_atendimento} foi cadastrado com sucesso`);
    });
});

test('Deve listar todos os balcões cadastrados', async () => {
  return await request(app).get('/api/balcaoAtendimento/todosBalcao')
    .then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.lista).not.toBeNull();
    });
});

test('Não deve consultar um balcão sem um ID valido na rota', async () => {
  return await request(app).get(`/api/balcaoAtendimento/balcao/acd!`)
    .then((res) => {
      expect(res.status).toEqual(400);
      expect(res.body.error).not.toBeNull();
    })
});

test('Deve consultar um balcão em específico', async () => {
  return await request(app).get(`/api/balcaoAtendimento/balcao/${id_balcao}`)
    .then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.balcao.id).toEqual(id_balcao);
    })
});

test('Deve excluir o balcão cadastrado para o test', async () => {
  return await request(app).delete(`/api/balcaoAtendimento/balcao/${id_balcao}`)
    .then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.mensagem).toEqual('Balcão de atendimento deletado com sucesso');
    });
});