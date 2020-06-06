const { deepEqual, ok } = require("assert");
const database = require("./database");

const DEFAULT_ITEM_CADASTRAR = {
  nome: "Green Lantern",
  poder: "Will Power",
  id: 1,
};

const DEFAULT_ITEM_ATUALIZAR = {
  nome: "Green Arrow",
  poder: "Bow & Arrow Mastery",
  id: 1,
};

describe("Suíte de manipulação de Herois", () => {
  before(async () => {
    await database.cadastrar(DEFAULT_ITEM_CADASTRAR);
    await database.cadastrar(DEFAULT_ITEM_ATUALIZAR);
  });
  it("deve pesquisar um herói usando arquivos", async () => {
    const expected = DEFAULT_ITEM_CADASTRAR;
    const [resultado] = await database.listar(expected.id);
    // const posicaoUm = resultado[0];

    deepEqual(resultado, expected);
  });
  it("deve cadastrar um herói usando arquivos", async () => {
    const expected = DEFAULT_ITEM_CADASTRAR;
    const resultado = await database.cadastrar(DEFAULT_ITEM_CADASTRAR);
    const [actual] = await database.listar(DEFAULT_ITEM_CADASTRAR.id);

    deepEqual(actual, expected);
  });
  it("deve remover um herói por id", async () => {
    const expected = true;
    const resultado = await database.remover(DEFAULT_ITEM_CADASTRAR.id);

    deepEqual(resultado, expected);
  });
  it("deve atualizar um herói por id", async () => {
    const expected = {
      ...DEFAULT_ITEM_ATUALIZAR,
      nome: "Booster Gold",
      poder: "Future Technology",
    };
    const novoDado = {
      nome: "Booster Gold",
      poder: "Future Technology",
    };

    await database.atualizar(DEFAULT_ITEM_ATUALIZAR.id, novoDado);

    const [resultado] = await database.listar(DEFAULT_ITEM_ATUALIZAR.id);
    console.log("resultado :>> ", resultado);
    console.log("expected :>> ", expected);
    deepEqual(resultado, expected);
  });
});
