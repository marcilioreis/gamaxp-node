const assert = require('assert');
const api = require('./../api');

let app = {};
const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hcmNpbGlvcmVpcyIsImlkIjoxLCJpYXQiOjE1OTM4ODE0NDV9.41lPRK7QKEyxw36owT1UsxS3Zk2soIY_ZgBFSDswPs8';
describe('Suite de testes Auth', function () {
  this.beforeAll(async () => {
    app = await api;
  });
  it('Get Token', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        username: 'marcilioreis',
        password: '123',
      },
    });
    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.deepEqual(statusCode, 200);
    assert.ok(dados.token.length > 10);
  });
});
