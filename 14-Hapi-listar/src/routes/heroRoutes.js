const BaseRoute = require('./base/baseRoute');

class HeroRoutes extends BaseRoute {
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    return {
      path: '/heroes',
      method: 'GET',
      handler: (request, headers) => {
        try {
          const { skip, limit, nome } = request.query;

          // console.log('skip :>> ', skip);
          // console.log('limit :>> ', limit);

          let query = {};
          if (nome) {
            query.nome = nome;
          }

          if (isNaN(skip)) {
            throw Error('o tipo do skip é incorreto');
          }

          if (isNaN(limit)) {
            throw Error('o tipo do limit é incorreto');
          }

          return this.db.read(query, parseInt(skip), parseInt(limit));
        } catch (error) {
          console.log('error: ', error);
          return 'Erro interno no servidor';
        }
      },
    };
  }
  create() {
    return {
      path: '/heroes',
      method: 'POST',
      handler: (request, head) => {
        return this.db.read();
      },
    };
  }
}

module.exports = HeroRoutes;
