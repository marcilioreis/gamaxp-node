const assert = require('assert');
const api = require('./../api');

let app = {};
const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hcmNpbGlvcmVpcyIsImlkIjoxLCJpYXQiOjE1OTM4ODE0NDV9.41lPRK7QKEyxw36owT1UsxS3Zk2soIY_ZgBFSDswPs8';

const headers = {
  authorization: TOKEN,
};
const MOCK_HEROI_CADASTRAR = {
  nome: 'Chapolin Colorado',
  poder: 'Marreta Biônica',
};
const MOCK_HEROI_INICIAL = {
  nome: 'Static Shock',
  poder: 'Electricity',
};
let MOCK_ID = '';

describe('Suite de testes da API Heroes', function () {
  this.timeout(Infinity);
  this.beforeAll(async () => {
    app = await api;
    const result = await app.inject({
      method: 'POST',
      url: '/heroes',
      headers,
      payload: JSON.stringify(MOCK_HEROI_INICIAL),
    });
    const dados = JSON.parse(result.payload);
    MOCK_ID = dados._id;
  });
  it('API Read - GET', async () => {
    const result = await app.inject({
      method: 'GET',
      headers,
      url: '/heroes?skip=0&limit=10',
    });
    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;

    assert.deepEqual(statusCode, 200);
    assert.ok(Array.isArray(dados));
  });
  it('API Read - GET - only 3 records', async () => {
    const TAMANHO_LIMITE = 3;
    const result = await app.inject({
      method: 'GET',
      headers,
      url: `/heroes?skip=0&limit=${TAMANHO_LIMITE}`,
    });
    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;

    assert.deepEqual(statusCode, 200);
    assert.ok(dados.length === TAMANHO_LIMITE);
  });
  it('API Read - GET - must return an limit error', async () => {
    const TAMANHO_LIMITE = 'aa';
    const result = await app.inject({
      method: 'GET',
      headers,
      url: `/heroes?skip=0&limit=${TAMANHO_LIMITE}`,
    });
    const errorResult = {
      statusCode: 400,
      error: 'Bad Request',
      message: '"limit" must be a number',
      validation: {
        source: 'query',
        keys: ['limit'],
      },
    };

    assert.deepEqual(result.statusCode, 400);
    assert.deepEqual(result.payload, JSON.stringify(errorResult));
  });
  it('API Read - GET - must filter one item', async () => {
    const NAME = MOCK_HEROI_INICIAL.nome;
    const result = await app.inject({
      method: 'GET',
      headers,
      url: `/heroes?skip=0&limit=5&nome=${NAME}`,
    });
    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;

    assert.deepEqual(statusCode, 200);
    assert.deepEqual(dados[0].nome, NAME);
  });
  it('API Create - POST', async () => {
    const result = await app.inject({
      method: 'POST',
      url: `/heroes`,
      headers,
      payload: JSON.stringify(MOCK_HEROI_CADASTRAR),
    });
    const { message, _id } = JSON.parse(result.payload);
    const statusCode = result.statusCode;

    assert.ok(statusCode === 200);
    assert.notStrictEqual(_id, undefined);
    assert.deepEqual(message, 'Heroi cadastrado com sucesso!');
  });
  it('API Update - PATCH - /herois/:id', async () => {
    const _id = MOCK_ID;
    const expected = {
      poder: 'Ultra Electricity',
    };
    const result = await app.inject({
      method: 'PATCH',
      url: `/heroes/${_id}`,
      headers,
      payload: JSON.stringify(expected),
    });
    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepEqual(dados.message, 'Heroi atualizado com sucesso!');
  });
  it('API Update - PATCH - /herois/:id - should not update with incorrect ID', async () => {
    const _id = `5efe73738438d61b90216a5f`;
    const result = await app.inject({
      method: 'PATCH',
      url: `/heroes/${_id}`,
      headers,
      payload: JSON.stringify({
        poder: 'Ultra Electricity',
      }),
    });
    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);
    const expected = {
      error: 'Precondition Failed',
      message: 'Id não encontrado no banco!',
      statusCode: 412,
    };
    assert.ok(statusCode === 412);
    assert.deepEqual(dados, expected);
  });
  it('API Delete - DELETE - /herois/:id', async () => {
    const _id = MOCK_ID;
    const result = await app.inject({
      method: 'DELETE',
      headers,
      url: `/heroes/${_id}`,
    });
    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepEqual(dados.message, 'Heroi removido com sucesso!');
  });
  it('API Delete - DELETE - /herois/:id - should not remove with incorrect ID', async () => {
    const _id = `5efe73738438d61b90216a5f`;
    const result = await app.inject({
      method: 'DELETE',
      headers,
      url: `/heroes/${_id}`,
    });
    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);
    const expected = {
      error: 'Precondition Failed',
      message: 'Id não encontrado no banco!',
      statusCode: 412,
    };

    assert.ok(statusCode === 412);
    assert.deepEqual(dados, expected);
  });
  it('API Delete - DELETE - /herois/:id - should not remove with invalid ID', async () => {
    const _id = `ffsdsss`;
    const result = await app.inject({
      method: 'DELETE',
      headers,
      url: `/heroes/${_id}`,
    });
    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);
    console.log('dados :>> ', dados);
    const expected = {
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An internal server error occurred',
    };

    assert.ok(statusCode === 500);
    assert.deepEqual(dados, expected);
  });
});
