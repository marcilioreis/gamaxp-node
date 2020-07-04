const { config } = require('dotenv');
const { join } = require('path');
const { ok } = require('assert');

const env = process.env.NODE_ENV || 'dev';
ok(env === 'prod' || env === 'dev', 'a env é inválida, ou dev ou prod');

const configPath = join(__dirname, './config', `.env.${env}`);
config({
  path: configPath,
});

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
const Postgres = require('./db/strategies/postgres/postgres');
const UsuarioSchema = require('./db/strategies/postgres/schemas/usuarioSchema');

const JWT_SECRET = process.env.JWT_KEY;
const app = new Hapi.Server({
  port: process.env.PORT,
});

function mapRoutes(instance, methods) {
  return methods.map((method) => instance[method]());
}

async function main() {
  const connection = MongoDb.connect();
  const context = new Context(new MongoDb(connection, HeroiSchema));
  const connectionPostgres = await Postgres.connect();
  const usuarioModel = await Postgres.defineModel(
    connectionPostgres,
    UsuarioSchema
  );
  const contextPostgres = new Context(new Postgres(connection, usuarioModel));

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
    validate: async (dado, request) => {
      const [result] = await contextPostgres.read({
        username: dado.username.toLowerCase(),
        id: dado.id,
      });

      // verify if active
      // verify if keeps paying
      if (!result) {
        return {
          isValid: false,
        };
      }

      return {
        isValid: true,
      };
    },
  });

  app.auth.default('jwt');

  app.route([
    ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
    ...mapRoutes(
      new AuthRoute(JWT_SECRET, contextPostgres),
      AuthRoute.methods()
    ),
  ]);

  await app.start();

  return app;
}

module.exports = main().catch(console.error);
