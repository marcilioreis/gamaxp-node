const ICrud = require("./interfaces/interfaceCrud");
const Mongoose = require("mongoose");
const { resolve } = require("bluebird");
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const STATUS = {
  0: "Disconnected",
  1: "Connected",
  2: "Connecting",
  3: "Disconnecting",
};

class MongoDB extends ICrud {
  constructor() {
    super();
    this._herois = null;
    this._driver = null;
  }

  async isConnected() {
    const state = STATUS[this._driver.readyState];
    if (state === "Connected") return state;
    if (state !== "Connecting") return state;

    await new Promise((resolve) => setTimeout(resolve, 1000));
    return STATUS[this._driver.readyState];
  }

  connect() {
    Mongoose.connect(
      "mongodb://marcilioreis:62724546@localhost:27017/heroes",
      options,
      function (error) {
        if (!error) return;
        console.log("Falha na conexão! :>> ", error);
      }
    );

    const connection = Mongoose.connection;
    connection.once("open", () => console.log("database online!"));

    this._driver = connection;
    this.defineModel();
  }

  defineModel() {
    const heroiSchema = new Mongoose.Schema({
      nome: { type: String, required: true },
      poder: { type: String, required: true },
      dataNascimento: { type: Date, default: new Date() },
      insertedAt: { type: Date, default: new Date() },
    });

    this._herois = Mongoose.model("heroes", heroiSchema);
  }

  create(item) {
    return this._herois.create(item);
  }
  read(item, skip = 0, limit = 10) {
    return this._herois.find(item).skip(skip).limit(limit);
  }
  update(id, item) {
    return this._herois.updateOne({ _id: id }, { $set: item });
  }
  delete(id) {
    return this._herois.deleteOne({ _id: id });
  }
}

module.exports = MongoDB;
