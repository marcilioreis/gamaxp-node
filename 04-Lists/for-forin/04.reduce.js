const { obterPessoas } = require("./service");

Array.prototype.meuReduce = function (callback, valorInicial) {
  let valorFinal = typeof valorInicial !== undefined ? valorInicial : this[0];

  for (let index = 0; index <= this.length - 1; index++) {
    valorFinal = callback(valorFinal, this[index], this);
  }

  return valorFinal;
};

async function main() {
  try {
    const { results } = await obterPessoas("a");

    // Default Reduce
    // const pesos = results.map((item) => parseInt(item.height));
    // console.log("pesos :>> ", pesos);
    // // [10.2], [21.2], [33.2], [49.2] = 0
    // const total = pesos.reduce((anterior, proximo) => {
    //   return anterior + proximo;
    // }, 0);

    // Custom Reduce
    const minhaLista = [
      ["Marcilio", "Reis"],
      ["FRN", "Vtex"],
    ];
    const total = minhaLista
      .meuReduce((anterior, proximo) => {
        return anterior.concat(proximo);
      }, [])
      .join(", ");

    console.log("total :>> ", total);
  } catch (error) {
    console.log("error :>> ", error);
  }
}

main();
