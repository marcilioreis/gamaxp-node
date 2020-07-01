const assert = require('assert');
const api = require('./../api');
const MongoDb = require('./../db/strategies/mongodb/mongodb');
const HeroiSchema = require('./../db/strategies//mongodb/schemas/heroisSchema');
const Context = require('./../db/strategies/base/contextStrategy');

let app = {};

describe('Suite de testes da API Heroes', function () {
  this.beforeAll(async () => {
    app = await api;
  });

  it('API Read', async () => {
    const result = await app.inject({
      method: 'GET',
      url: '/heroes',
    });
    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;

    assert.deepEqual(statusCode, 200);
    assert.ok(Array.isArray(dados));
  });
});
