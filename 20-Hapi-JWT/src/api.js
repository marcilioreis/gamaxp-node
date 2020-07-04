const Hapi = require('@hapi/hapi');
const HapiSwagger = require('hapi-swagger');
const HapiJWT = require('hapi-auth-jwt2');
const Vision = require('@hapi/vision');
const Inert = require('@hapi/inert');

const MongoDb = require('./db/strategies/mongodb/mongodb');
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema');
const Context = require('./db/strategies/base/contextStrategy');
const HeroRoute = require('./routes/heroRoutes');
const AuthRoute = require('./routes/authRoutes');

const JWT_SECRET = 'TRETA_TRETA';
const app = new Hapi.Server({
  port: 5200,
});

function mapRoutes(instance, methods) {
  return methods.map((method) => instance[method]());
}

async function main() {
  const connection = MongoDb.connect();
  const context = new Context(new MongoDb(connection, HeroiSchema));
  const swaggerOptions = {
    info: {
      title: 'Api Heroes',
      version: 'v1.0',
    },
  };

  await app.register([
    HapiJWT,
    Vision,
    Inert,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  app.auth.strategy('jwt', 'jwt', {
    key: JWT_SECRET,
    // options: {
    //   expiresIn: 20
    // }
    validate: (dado, request) => {
      // verify if active
      // verify if keeps paying

      return {
        isValid: true,
      };
    },
  });

  app.auth.default('jwt');

  app.route([
    ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
    ...mapRoutes(new AuthRoute(JWT_SECRET), AuthRoute.methods()),
  ]);

  await app.start();

  return app;
}

module.exports = main().catch(console.error);