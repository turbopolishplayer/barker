const userModel = require('../models/user.js');


test('create user', async () => {
    expect(await userModel.createUser('goodtest@asd.pl', 'bubus', 'bubus', 'zupa')).toBe(true);
});

test('create user when email exist', async () => {
    try{
        await userModel.createUser('bubus@asd.pl', 'bubus', 'bubus', 'zupa');
    }catch(error){
        expect(error).toEqual(new Error('Email already used'));
    }
});