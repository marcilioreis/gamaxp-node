const Commander = require("commander");
const Database = require("./database");
const Heroi = require("./heroi");

async function main() {
  Commander.version("v1")
    .option("-n, --nome [value]", "Nome do Heroi")
    .option("-p, --poder [value]", "Poder do Heroi")
    .option("-i, --id [value]", "Id do Heroi")

    .option("-c, --cadastrar", "Cadastrar um Heroi")
    .option("-l, --listar", "Listar herois")
    .option("-r, --remover", "Remove heroi por id")
    .option("-a, --atualizar [value]", "Atualiza heroi por id")
    .parse(process.argv);

  const heroi = new Heroi(Commander);

  try {
    if (Commander.cadastrar) {
      delete heroi.id;
      const resultado = await Database.cadastrar(heroi);

      if (!resultado) {
        console.error("não deu");
        return;
      }
    }
    if (Commander.listar) {
      const resultado = await Database.listar();

      console.log("deu :>> ", resultado);
      return;
    }
    if (Commander.remover) {
      const resultado = await Database.remover(heroi.id);

      if (!resultado) {
        console.error("não deu");
        return;
      }

      console.log("deu :>> ", resultado);
      return;
    }
    if (Commander.atualizar) {
      const idParaAtualizar = parseInt(Commander.atualizar);
      // remover todas as chaves que estiverem com undefined | null
      const dado = JSON.stringify(heroi);
      const heroiAtualizar = JSON.parse(dado);
      const resultado = await Database.atualizar(
        idParaAtualizar,
        heroiAtualizar
      );

      if (!resultado) {
        console.error("não deu");
        return;
      }

      console.log("deu :>> ", resultado);
    }
  } catch (error) {
    console.error(error);
  }
}

main();
