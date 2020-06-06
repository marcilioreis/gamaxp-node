const { obterPessoas } = require("./service");

/*
const item = {
    nome: 'Marcilio'
    idade: 35
}

const { nome, idade } = item;
console.log(nome, idade)
*/

Array.prototype.meuFilter = function (callback) {
  const lista = [];

  for (index in this) {
    const item = this[index];
    const resutado = callback(item, index, this);
    // 0, "", null, undefined === false
    if (!resutado) continue;

    lista.push(item);
  }

  return lista;
};

async function main() {
  try {
    const { results } = await obterPessoas("a");

    // Default Filter
    // const familiaLars = results.filter(function (item) {
    //   //  by default returns a boolean to inform if keep or remove of list
    //   // false => remove
    //   // true => keeps

    //   // if not found = -1
    //   // if found = array position
    //   const result = item.name.toLowerCase().indexOf(`lars`) !== -1;
    //   return result;
    // });

    // Custom Filter
    const familiaLars = results.meuFilter((item, index, lista) => {
      console.log(`index: ${index}`, lista.length);
      return item.name.toLowerCase().indexOf(`lars`) !== -1;
    });

    const names = familiaLars.map((pessoa) => pessoa.name);

    console.log("names :>> ", names);
  } catch (error) {
    console.log("error :>> ", error);
  }
}

main();
