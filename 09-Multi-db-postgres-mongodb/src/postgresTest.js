// npm install sequelize
// npm install pg-hstore pg
const Sequelize = require("sequelize");
const driver = new Sequelize("heroes", "marcilioreis", "62724546", {
  host: "localhost",
  dialect: "postgres",
  quotedIdentifiers: false,
  operatorsAliases: false,
});

async function main() {
  const Herois = driver.define(
    "herois",
    {
      id: {
        type: Sequelize.INTEGER,
        required: true,
        primaryKey: true,
        autoIncrement: true,
      },
      nome: {
        type: Sequelize.STRING,
        required: true,
      },
      poder: {
        type: Sequelize.STRING,
        required: true,
      },
    },
    {
      tableName: "tb_herois",
      freezeTableName: false,
      timestamps: false,
    }
  );
  await Herois.sync();
  await Herois.create({
    nome: "Catwoman",
    poder: "Thief",
  });
  const result = await Herois.findAll({ raw: true, attributes: ["nome"] });
  console.log("result :>> ", result);
}

main();
