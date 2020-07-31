const userModel = require('../models/user.js');

beforeAll(() => {
    return userModel.createUser('bubus@asd.pl', 'bubus', 'bubus', 'zupa');
})

test('create user', async () => {
    expect(await userModel.createUser('bbbbb@asd.pl', 'bubus', 'bubus', 'zupa')).toBe(true);
});

test('create user when email exist', async () => {

    await expect(userModel.createUser('bubus@asd.pl', 'bubus', 'bubus', 'zupa')).rejects.toThrow();

});