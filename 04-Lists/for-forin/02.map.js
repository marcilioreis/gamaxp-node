const service = require("./service");

Array.prototype.meuMap = function (callback) {
  const novoArrayMapeado = [];
  for (let index = 0; index < this.length - 1; index++) {
    const resutado = callback(this[index], index);
    novoArrayMapeado.push(resutado);
  }
  return novoArrayMapeado;
};

async function main() {
  try {
    const results = await service.obterPessoas("a");

    // foreach
    // const names = [];
    // results.results.forEach((item) => {
    //   names.push(item.name);
    // });

    // map tradicional
    // const names = results.results.map(function (pessoa) {
    //   return pessoa.name;
    // });

    // map arrow function
    // const names = results.results.map((pessoa) => pessoa.name);

    const names = results.results.meuMap(function (pessoa, index) {
      return `[${index}] ${pessoa.name}`;
    });

    console.log("names :>> ", names);
  } catch (error) {
    console.log("error :>> ", error);
  }
}

main();
