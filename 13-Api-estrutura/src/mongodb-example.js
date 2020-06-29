const Mongoose = require("mongoose");
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

Mongoose.connect(
  "mongodb://marcilioreis:62724546@localhost:27017/heroes",
  options,
  function (error) {
    if (!error) return;
    console.log("Falha na conexão! :>> ", error);
  }
);

const connection = Mongoose.connection;

// function nomeFuncao(params) {    }
// const minhaFuncao = function () {    }
// const minhaFuncaoArrow = (params) => console.log(params);

connection.once("open", () => console.log("database online!"));

/* 
    setTimeout(() => {
      const state = connection.readyState;
      console.log("state :>> ", state);
    }, 1000);
    0: Disconnected
    1: Connected
    2: Connecting
    3: Disconnecting
*/

const heroiSchema = new Mongoose.Schema({
  nome: { type: String, required: true },
  poder: { type: String, required: true },
  dataNascimento: { type: Date, default: new Date() },
  insertedAt: { type: Date, default: new Date() },
});

const model = Mongoose.model("heroes", heroiSchema);

async function main() {
  const resultCadastrar = await model.create({
    nome: "Batman",
    poder: "Dinheiro",
    dataNascimento: "1985-07-19",
  });
  console.log("result Cadastrar :>> ", resultCadastrar);

  const listItens = await model.find();
  console.log("list Itens :>> ", listItens);
}

main();
