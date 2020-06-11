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

  isConnected() {
    throw new NotImplemenetedException();
  }
}

module.exports = ICrud;
