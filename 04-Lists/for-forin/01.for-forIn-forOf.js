const service = require("./service");

async function main() {
  try {
    const result = await service.obterPessoas("a");
    const names = [];

    console.time("tempo for");
    for (let index = 0; index <= result.results.length - 1; index++) {
      const pessoa = result.results[index];
      names.push(pessoa.name);
    }
    console.timeEnd("tempo for");

    console.time("tempo forIn");
    for (const key in result.results) {
      if (result.results.hasOwnProperty(key)) {
        const pessoa = result.results[key];
        names.push(pessoa.name);
      }
    }
    console.timeEnd("tempo forIn");

    console.time("tempo forOf");
    for (const pessoa of result.results) {
      names.push(pessoa.name);
    }
    console.timeEnd("tempo forOf");

    console.log("names :>> ", names);
  } catch (error) {
    console.log("internal error :>> ", error);
  }
}

main();
