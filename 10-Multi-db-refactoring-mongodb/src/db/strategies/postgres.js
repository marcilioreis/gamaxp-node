const ICrud = require("./interfaces/interfaceCrud");
const Sequelize = require("sequelize");

class Postgres extends ICrud {
  constructor() {
    super();
    this._driver = null;
    this._herois = null;
  }

  async isConnected() {
    try {
      await this._driver.authenticate();
      return true;
    } catch (error) {
      console.log("error :>> ", error);
      return false;
    }
  }

  async connect() {
    this._driver = new Sequelize("heroes", "marcilioreis", "62724546", {
      host: "localhost",
      dialect: "postgres",
      quotedIdentifiers: false,
      operatorsAliases: false,
    });

    await this.defineModel();
  }

  async defineModel() {
    this._herois = this._driver.define(
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
    await this._herois.sync();
  }

  async create(item) {
    const { dataValues } = await this._herois.create(item);
    return dataValues;
  }

  async read(item = {}) {
    const result = await this._herois.findAll({ where: item, raw: true });
    return result;
  }

  async update(id, item) {
    return await this._herois.update(item, { where: { id: id } });
  }

  async delete(id) {
    const query = id ? { id } : {};
    return await this._herois.destroy({ where: query });
  }
}

module.exports = Postgres;
