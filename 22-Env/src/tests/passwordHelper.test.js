const assert = require('assert');
const PasswordHelper = require('./../helpers/passwordHelper');

const SENHA = 'M@rs6272';
const HASH = '$2b$04$vuLhs7XwJ6fQRrcGcy/2ye00uOu4Qm1F5WOYuND0O9DvRFmx8Ut2S';

describe('Suite de testes UserHelper', function () {
  it('Must generante a hash from a password', async () => {
    const result = await PasswordHelper.hashPassword(SENHA);

    assert.ok(result.length > 10);
  });
  it('Must compare a password with his hash', async () => {
    const result = await PasswordHelper.comparePassword(SENHA, HASH);

    assert.ok(result);
  });
});
