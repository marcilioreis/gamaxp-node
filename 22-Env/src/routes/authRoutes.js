const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const Jwt = require('jsonwebtoken');
const BaseRoute = require('./base/baseRoute');
const PasswordHelper = require('./../helpers/passwordHelper');

const failAction = (request, headers, erro) => {
  throw erro;
};

const USER = {
  username: 'marcilioreis',
  password: '123',
};

class AuthRoutes extends BaseRoute {
  constructor(secret, db) {
    super();
    this.secret = secret;
    this.db = db;
  }

  login() {
    return {
      path: '/login',
      method: 'POST',
      config: {
        auth: false,
        tags: ['api'],
        description: 'Get Token',
        notes: 'Login with user and password',
        validate: {
          failAction,
          payload: Joi.object({
            username: Joi.string().required().min(3).max(100),
            password: Joi.string().required().min(2).max(100),
          }),
        },
      },
      handler: async (request) => {
        try {
          const { username, password } = request.payload;

          const [usuario] = await this.db.read({
            username: username.toLowerCase(),
          });

          if (!usuario) {
            return Boom.unauthorized('O Usuario informado não existe');
          }

          const match = await PasswordHelper.comparePassword(
            password,
            usuario.password
          );

          if (!match) {
            return Boom.unauthorized('Usuario ou senha invalidos!');
          }

          const token = Jwt.sign(
            {
              username: username,
              id: usuario.id,
            },
            this.secret
          );

          return {
            token,
          };
        } catch (error) {
          console.log('error: ', error);
          return Boom.internal();
        }
      },
    };
  }

  //   create() {
  //     return {
  //       path: '/heroes',
  //       method: 'POST',
  //       config: {
  //         tags: ['api'],
  //         description: 'Must insert Heroes',
  //         notes: 'Can insert heroes by nome and poder',
  //         validate: {
  //           failAction,
  //           payload: Joi.object({
  //             nome: Joi.string().required().min(3).max(100),
  //             poder: Joi.string().required().min(2).max(100),
  //           }),
  //         },
  //       },
  //       handler: async (request) => {
  //         try {
  //           const { nome, poder } = request.payload;
  //           const result = await this.db.create({
  //             nome,
  //             poder,
  //           });
  //           return {
  //             message: 'Heroi cadastrado com sucesso!',
  //             _id: result._id,
  //           };
  //         } catch (error) {
  //           console.log('error', error);
  //           return Boom.internal();
  //         }
  //       },
  //     };
  //   }
  //   update() {
  //     return {
  //       path: '/heroes/{id}',
  //       method: 'PATCH',
  //       config: {
  //         tags: ['api'],
  //         description: 'Must update Heroes by id',
  //         notes: 'Can update any field',
  //         validate: {
  //           params: Joi.object({
  //             id: Joi.string().required(),
  //           }),
  //           payload: Joi.object({
  //             nome: Joi.string().min(3).max(100),
  //             poder: Joi.string().min(2).max(100),
  //           }),
  //         },
  //       },
  //       handler: async (request) => {
  //         try {
  //           const { id } = request.params;
  //           const { payload } = request;
  //           const dadosString = JSON.stringify(payload);
  //           const dados = JSON.parse(dadosString);
  //           const result = await this.db.update(id, dados);

  //           if (result.nModified !== 1) {
  //             return Boom.preconditionFailed('Id não encontrado no banco!');
  //           }

  //           return {
  //             message: 'Heroi atualizado com sucesso!',
  //           };
  //         } catch (error) {
  //           console.log('error', error);
  //           return Boom.internal();
  //         }
  //       },
  //     };
  //   }
  //   delete() {
  //     return {
  //       path: '/heroes/{id}',
  //       method: 'DELETE',
  //       config: {
  //         tags: ['api'],
  //         description: 'Must delete Hero by id',
  //         notes: 'Can delete result by a valid id',
  //         validate: {
  //           failAction,
  //           params: Joi.object({
  //             id: Joi.string().required(),
  //           }),
  //         },
  //       },
  //       handler: async (request) => {
  //         try {
  //           const { id } = request.params;
  //           const result = await this.db.delete(id);

  //           if (result.n !== 1) {
  //             return Boom.preconditionFailed('Id não encontrado no banco!');
  //           }

  //           return {
  //             message: 'Heroi removido com sucesso!',
  //           };
  //         } catch (error) {
  //           console.log('error', error);
  //           return Boom.internal();
  //         }
  //       },
  //     };
  //   }
}

module.exports = AuthRoutes;
