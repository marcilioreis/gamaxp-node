class NotImplemenetedException extends Error {
  constructor() {
    super("Not Implmented Exception");
  }
}

class ICrud {
  create(item) {
    throw new NotImplemenetedException();
  }

  read(query) {
    throw new NotImplemenetedException();
  }

  update(id, item) {
    throw new NotImplemenetedException();
  }

  delete(id) {
    throw new NotImplemenetedException();
  }
}

class MongoDb extends ICrud {
  constructor() {
    super();
  }

  create(item) {
    console.log("O item foi salvo em MongoDB");
  }
}

class Postgres extends ICrud {
  constructor() {
    super();
  }

  create(item) {
    console.log("O item foi salvo em Postgres");
  }
}

class ContextStrategy {
  constructor(strategy) {
    this._database = strategy;
  }

  create(item) {
    return this._database.create(item);
  }

  read(query) {
    return this._database.read(query);
  }

  update(id, item) {
    return this._database.update(id, item);
  }

  delete(id) {
    return this._database.delete(id);
  }
}

const contextMongo = new ContextStrategy(new MongoDb());
contextMongo.create();

//contextMongo.read();

const contextPostgres = new ContextStrategy(new Postgres());
contextPostgres.create();
