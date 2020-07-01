const assert = require('assert');
const api = require('./../api');

let app = {};

describe('Suite de testes da API Heroes', function () {
  this.beforeAll(async () => {
    app = await api;
  });
  it('API Read', async () => {
    const result = await app.inject({
      method: 'GET',
      url: '/heroes?skip=0&limit=10',
    });
    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;

    assert.deepEqual(statusCode, 200);
    assert.ok(Array.isArray(dados));
  });
  it('API Read - only 3 records', async () => {
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
  it('API Read - must return an limit error', async () => {
    const TAMANHO_LIMITE = 'aa';
    const result = await app.inject({
      method: 'GET',
      url: `/heroes?skip=0&limit=${TAMANHO_LIMITE}`,
    });

    assert.deepEqual(result.payload, 'Erro interno no servidor');
  });
  it('API Read - must filter one item', async () => {
    const NAME = 'Clone-4';
    const result = await app.inject({
      method: 'GET',
      url: `/heroes?skip=0&limit=5&nome=${NAME}`,
    });
    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;

    assert.deepEqual(statusCode, 200);
    assert.deepEqual(dados[0].nome, NAME);
  });
});
