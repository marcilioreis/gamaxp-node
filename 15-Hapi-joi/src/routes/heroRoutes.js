const BaseRoute = require('./base/baseRoute');
const Joi = require('@hapi/joi');

class HeroRoutes extends BaseRoute {
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    return {
      path: '/heroes',
      method: 'GET',
      config: {
        validate: {
          // payload => body
          // headers -> header
          // params =>  url paramns :id
          // query -> ?skip=0&limit=5
          failAction: (request, headers, erro) => {
            throw erro;
          },
          query: Joi.object({
            skip: Joi.number().integer().default(0),
            limit: Joi.number().integer().default(10),
            nome: Joi.string().min(3).max(100),
          }),
        },
      },
      handler: (request, headers) => {
        try {
          const { skip, limit, nome } = request.query;
          const query = nome
            ? {
                nome: { $regex: `.*${nome}*.` },
              }
            : {};

          return this.db.read(nome ? query : {}, skip, limit);
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
