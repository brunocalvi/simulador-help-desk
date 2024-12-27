const request = require('supertest');
const app = require('../app');

let usuarioTest = {
  "usuario": `Test.${Date.now()}`,
  "senha": 'Vp.cew*12345@',
  "customer_id": `${Date.now()}`
}

let id_usuario;

test('Deve registrar um usuário com sucesso', async () => {
  return await request(app).post('/api/usuario/registrar')
    .send(usuarioTest)
    .then((res) => {

      id_usuario = res.body.id_usuario;

      expect(res.status).toEqual(201);
      expect(res.body.id_usuario).not.toBeNull();
    });
});

test('Deve consultar um usuário', async () => {
  return await request(app).get(`/api/usuario/${id_usuario}`)
    .then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.usuario).not.toBeNull();
    })
});

describe('Ao pedir para alterar o usuário ...', () => {

  test('Deve pedir para a senha ter mais de 8 caracteres', async () => {
    return await request(app).put(`/api/usuario/${id_usuario}`)
      .send({ usuario: usuarioTest.usuario, senha: '2179-Qv' })
      .then((res) => {
        expect(res.status).toEqual(400);
        expect(res.body.error[0]).toEqual('Senha deve ter no mínimo 8 caracteres.');
      });
  });

  test('Deve pedir para a senha ter letras minusculas', async () => {
    return await request(app).put(`/api/usuario/${id_usuario}`)
      .send({ usuario: usuarioTest.usuario, senha: 'MASTER-ACU2179-QVY' })
      .then((res) => {
        expect(res.status).toEqual(400);
        expect(res.body.error[0]).toEqual('Senha deve conter letras minusculas.');
      });
  });

  test('Deve pedir para a senha ter letras maiúsculas', async () => {
    return await request(app).put(`/api/usuario/${id_usuario}`)
      .send({ usuario: usuarioTest.usuario, senha: 'master-acu2179-qvy' })
      .then((res) => {
        expect(res.status).toEqual(400);
        expect(res.body.error[0]).toEqual('Senha deve conter letras maiúsculas.');
      });
  });

  test('Deve pedir para a senha ter números', async () => {
    return await request(app).put(`/api/usuario/${id_usuario}`)
      .send({ usuario: usuarioTest.usuario, senha: 'Master-ACuqaew-QvY' })
      .then((res) => {
        expect(res.status).toEqual(400);
        expect(res.body.error[0]).toEqual('Senha deve conter números.');
      });
  });

  test('Deve pedir para a senha ter caracteres especiais.', async () => {
    return await request(app).put(`/api/usuario/${id_usuario}`)
      .send({ usuario: usuarioTest.usuario, senha: 'MasterACu2179QvY' })
      .then((res) => {
        expect(res.status).toEqual(400);
        expect(res.body.error[0]).toEqual('Senha deve conter caracteres especiais.');
      });
  });

});

test('Deve logar com o usuário de test', async () => {
  return await request(app).post('/api/usuario/login')
    .send({ usuario: usuarioTest.usuario, senha: usuarioTest.senha })
    .then((res) => {
      expect(res.status).toEqual(200);
      expect(res.body.usuario.customer_id).not.toBeNull();
    })
});

