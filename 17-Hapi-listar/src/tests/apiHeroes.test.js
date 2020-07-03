const assert = require('assert');
const api = require('./../api');

let app = {};
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
  this.beforeAll(async () => {
    app = await api;
    const result = await app.inject({
      method: 'POST',
      url: '/heroes',
      payload: JSON.stringify(MOCK_HEROI_INICIAL),
    });
    const dados = JSON.parse(result.payload);
    MOCK_ID = dados._id;
  });
  it('API Read - GET', async () => {
    const result = await app.inject({
      method: 'GET',
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
    const NAME = 'Clone-0';
    const result = await app.inject({
      method: 'GET',
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
      payload: JSON.stringify(expected),
    });
    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepEqual(dados.message, 'Heroi atualizado com sucesso!');
  });
  it('API Update - PATCH - /herois/:id - should not update with incorrect ID', async () => {
    const _id = `5efe73738438d61b90216a5f`;
    const expected = {
      poder: 'Ultra Electricity',
    };
    const result = await app.inject({
      method: 'PATCH',
      url: `/heroes/${_id}`,
      payload: JSON.stringify(expected),
    });
    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepEqual(dados.message, 'Não foi possível atualizar.');
  });
});
