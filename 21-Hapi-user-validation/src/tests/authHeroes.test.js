const assert = require('assert');
const api = require('./../api');
const Context = require('./../db/strategies/base/contextStrategy');
const Postgres = require('./../db/strategies/postgres/postgres');
const UsuarioSchema = require('./../db/strategies/postgres/schemas/usuarioSchema');

let app = {};
const USER = {
  username: 'marcilioreis',
  password: '123',
};

const USER_DB = {
  username: USER.username.toLowerCase(),
  password: '$2b$04$mN7ankQoHojkOSXOBvpMm.IEwC4I7QkAkHqabknQYWNCcQklz/XNe',
};
describe('Suite de testes Auth', function () {
  this.beforeAll(async () => {
    app = await api;

    const connectionPostgres = await Postgres.connect();
    const model = await Postgres.defineModel(connectionPostgres, UsuarioSchema);
    const postgres = new Context(new Postgres(connectionPostgres, model));

    await postgres.update(null, USER_DB, true);
  });
  it('Get Token', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: USER,
    });
    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.deepEqual(statusCode, 200);
    assert.ok(dados.token.length > 10);
  });
  it('Must return unauthorized with wrong name or password', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        username: 'marcilioreis',
        password: '123d',
      },
    });
    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.deepEqual(statusCode, 401);
    assert.deepEqual(dados.error, 'Unauthorized');
  });
});
