const Hapi = require('@hapi/hapi');
const MongoDb = require('./db/strategies/mongodb/mongodb');
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema');
const Context = require('./db/strategies/base/contextStrategy');
const HeroRoute = require('./routes/heroRoutes');

const app = new Hapi.Server({
  port: 5200,
});

function mapRoutes(instance, methods) {
  return methods.map((method) => instance[method]());
}

async function main() {
  const connection = MongoDb.connect();
  const context = new Context(new MongoDb(connection, HeroiSchema));

  app.route([...mapRoutes(new HeroRoute(context), HeroRoute.methods())]);

  await app.start();

  return app;
}

module.exports = main().catch(console.error);
