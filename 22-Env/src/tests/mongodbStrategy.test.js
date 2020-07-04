const assert = require('assert');
const MongoDb = require('./../db/strategies/mongodb/mongodb');
const HeroiSchema = require('./../db/strategies//mongodb/schemas/heroisSchema');
const Context = require('./../db/strategies/base/contextStrategy');

const MOCK_HEROI_CADASTRAR = {
  nome: 'Hawkgirl',
  poder: 'Spacecop',
  dataNascimento: new Date('1985-07-19'),
};
const MOCK_HEROI_ATUALIZAR = {
  nome: 'Black Canary',
  poder: 'Sonic Scream',
  dataNascimento: new Date('1989-07-19'),
};
const MOCK_HEROI_DEFAULT = {
  nome: `Super Girl-${Date.now()}`,
  poder: 'Super Force',
  dataNascimento: new Date('1995-07-19'),
};
let MOCK_HEROI_ID = '';

let context = {};

describe('MongoDb Strategy', function () {
  // before all com arrow function depende do escopo superior NÃO utilizar Arrow Function
  this.beforeAll(async () => {
    const connection = MongoDb.connect();
    context = new Context(new MongoDb(connection, HeroiSchema));
    await context.create(MOCK_HEROI_DEFAULT);
    const result = await context.create(MOCK_HEROI_ATUALIZAR);
    MOCK_HEROI_ID = result._id;
  });
  it('MongoDbSQL Connection', async () => {
    const result = await context.isConnected();
    const expected = 'Connected';
    assert.equal(result, expected);
  });
  it('MongoDbSQL Create', async () => {
    const { nome, poder, dataNascimento } = await context.create(
      MOCK_HEROI_CADASTRAR
    );
    assert.deepEqual({ nome, poder, dataNascimento }, MOCK_HEROI_CADASTRAR);
  });
  it('MongoDbSQL Read', async () => {
    const [{ nome, poder, dataNascimento }] = await context.read({
      nome: MOCK_HEROI_DEFAULT.nome,
    });
    const result = {
      nome,
      poder,
      dataNascimento,
    };
    assert.deepEqual(result, MOCK_HEROI_DEFAULT);
  });
  it('MongoDbSQL Update', async () => {
    const novoItem = {
      nome: 'Kara Zor-El',
    };
    const result = await context.update(MOCK_HEROI_ID, novoItem);

    assert.deepEqual(result.nModified, 1);
  });
  it('MongoDbSQL Delete', async () => {
    const result = await context.delete(MOCK_HEROI_ID);

    assert.deepEqual(result.n, 1);
  });
});
