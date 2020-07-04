const assert = require('assert');
const Postgres = require('../db/strategies/postgres/postgres');
const HeroiSchema = require('./../db/strategies/postgres/schemas/heroiSchema');
const Context = require('./../db/strategies/base/contextStrategy');

const MOCK_HEROI_CADASTRAR = { nome: 'Hawkgirl', poder: 'Spacecop' };
const MOCK_HEROI_ATUALIZAR = { nome: 'Black Canary', poder: 'Sonic Scream' };
const MOCK_HEROI_CHECK = { nome: 'Catwoman', poder: 'Thief' };

let context = {};

describe('Postgres Strategy', function () {
  this.timeout(Infinity);
  before(async () => {
    const connection = await Postgres.connect();
    const model = await Postgres.defineModel(connection, HeroiSchema);
    context = new Context(new Postgres(connection, model));

    await context.delete();
    await context.create(MOCK_HEROI_CADASTRAR);
    await context.create(MOCK_HEROI_ATUALIZAR);
  });

  it('PostgresSQL Connection', async () => {
    const result = await context.isConnected();
    assert.equal(result, true);
  });

  it('PostgresSQL Create', async () => {
    const result = await context.create(MOCK_HEROI_CADASTRAR);
    delete result.id;
    assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
  });

  it('PostgresSQL Read', async () => {
    const [result] = await context.read(MOCK_HEROI_CADASTRAR);

    delete result.id;
    assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
  });

  it('PostgresSQL Update', async () => {
    const [itemAtualizar] = await context.read({
      nome: MOCK_HEROI_ATUALIZAR.nome,
    });
    const novoItem = {
      ...MOCK_HEROI_ATUALIZAR,
      nome: 'Dinah Lance',
    };
    const [result] = await context.update(itemAtualizar.id, novoItem);
    const [itemAtualizado] = await context.read({ id: itemAtualizar.id });

    assert.deepEqual(result, 1);
    assert.deepEqual(itemAtualizado.nome, novoItem.nome);
    /*
    Uso de rest/spread para mergear ou separar objetos
    {
      nome: 'Batman',
      poder: "dinheiro"
    }
    {
      dataNasc: '1956-05-09'
    }
    // final
    {
      nome: 'Batman',
      poder: "dinheiro"
      dataNasc: '1956-05-09'
    }
    */
  });

  it('PostgresSQL Delete', async () => {
    const [itemRemover] = await context.read({});
    const result = await context.delete(itemRemover.id);

    assert.deepEqual(result, 1);
  });
});
