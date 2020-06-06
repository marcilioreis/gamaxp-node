/*
  0 Obter um usuário
  1 Obter o numero de telefone de um usuario a partir de seu id
  2 Obter o endereço do usuario pelo id
*/
// importamos o modulo interno do node.js
const util = require("util");
const obterEnderecoAsync = util.promisify(obterEndereco);

function obterUsuario() {
  // if problem -> reject(error)
  // if success -> resolve
  return new Promise(function resolvePromise(resolve, reject) {
    setTimeout(() => {
      //   return reject(new Error("erro!!!!!!!"));
      return resolve({
        id: 1,
        nome: "Marcilio",
        dataNascimento: new Date(),
      });
    }, 1000);
  });
}

function obterTelefone(idUsuario) {
  return new Promise(function resolvePromise(resolve, reject) {
    setTimeout(() => {
      return resolve({
        telefone: 956368575,
        ddd: 11,
      });
    }, 2000);
  });
}

function obterEndereco(idUsuario, callback) {
  setTimeout(() => {
    return callback(null, {
      rua: "rua um",
      numero: 11,
    });
  }, 2000);
}

// 1 - adicionar a palavra async automaticamente retorna uma Promise
main();
async function main() {
  try {
    console.time("medida-promise");
    const usuario = await obterUsuario();
    // const telefone = await obterTelefone(usuario.id);
    // const endereco = await obterEnderecoAsync(usuario.id);
    const resultado = await Promise.all([
      obterTelefone(usuario.id),
      obterEnderecoAsync(usuario.id),
    ]);
    const endereco = resultado[1];
    const telefone = resultado[0];
    console.log(`
        Nome: ${usuario.nome},
        Telefone: (${telefone.ddd}) ${telefone.telefone},
        Endereço: ${endereco.rua} - ${endereco.numero},
      `);
    console.timeEnd("medida-promise");
  } catch (error) {
    console.error("erro", error);
  }
}

/* Promises
  const usuarioPromise = obterUsuario();
  // for success: .then()
  // for error: .catch()
  usuarioPromise
    .then(function (usuario) {
      return obterTelefone(usuario.id).then(function resolveTelefone(resultTel) {
        return {
          usuario: {
            nome: usuario.nome,
            id: usuario.id,
          },
          telefone: resultTel,
        };
      });
    })
    .then(function (resultado) {
      const endereco = obterEnderecoAsync(resultado.usuario.id);
      return endereco.then(function resolveEndereco(resultEnd) {
        return {
          usuario: resultado.usuario,
          telefone: resultado.telefone,
          endereco: resultEnd,
        };
      });
    })
    .then(function (result) {
      console.log(`
        Nome: ${result.usuario.nome},
        Endereço: ${result.endereco.rua} - ${result.endereco.numero},
        Telefone: (${result.telefone.ddd}) ${result.telefone.telefone}
      `);
    })
    .catch(function (error) {
      console.error("erro", error);
    });
*/

/* classic callback
  obterUsuario(function resolverUsuario(error, usuario) {
    // null || "" || 0 === false
    if (error) {
      console.error("sem tempo irmão: ", error);
      return;
    }
    obterTelefone(usuario.id, function resolverTelefone(error1, telefone) {
      if (error1) {
        console.error("sem telefone irmão: ", error1);
        return;
      }
      obterEndereco(usuario.id, function resolverEndereco(error2, endereco) {
        if (error2) {
          console.error("sem endereco irmão: ", error2);
          return;
        }
        console.log(`
          Nome: ${usuario.nome},
          Endereço: ${endereco.rua},${endereco.numero},
          Telefone: (${telefone.ddd})${telefone.telefone}
        `);
      });
    });
  });
*/
