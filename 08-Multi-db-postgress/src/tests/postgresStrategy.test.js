const assert = require("assert");
const Postgres = require("./../db/strategies/postgres");
const Context = require("./../db/strategies/base/contextStrategy");

const context = new Context(new Postgres());
const MOCK_HEROI_CADASTRAR = { nome: "Hawkgirl", poder: "Spacecop" };
const MOCK_HEROI_ATUALIZAR = { nome: "Black Canary", poder: "Sonic Scream" };

describe("Postgres Strategy", function () {
  this.timeout(Infinity);
  this.beforeAll(async function () {
    await context.connect();
    await context.delete();
    await context.create(MOCK_HEROI_ATUALIZAR);
  });
  it("PostgresSQL Connection", async function () {
    const result = await context.isConnected();
    assert.equal(result, true);
  });
  it("PostgresSQL Create", async function () {
    const result = await context.create(MOCK_HEROI_CADASTRAR);
    delete result.id;
    assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
  });
  it("PostgresSQL Read", async function () {
    const [result] = await context.read({
      nome: MOCK_HEROI_CADASTRAR.nome,
    });
    delete result.id;
    // get first pos
    // const posicaoZero = result[0];
    // const [pos1, pos2] = ["esse é o 1", "esse é o 2"];

    assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
  });
  it("PostgresSQL Update", async function () {
    const [itemAtualizar] = await context.read({
      nome: MOCK_HEROI_ATUALIZAR.nome,
    });
    const novoItem = {
      ...MOCK_HEROI_ATUALIZAR,
      nome: "Dinah Lance",
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
  it("PostgresSQL Delete", async function () {
    const [itemRemover] = await context.read({});
    const result = await context.delete(itemRemover.id);

    assert.deepEqual(result, 1);
  });
});
