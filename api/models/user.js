const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');


mongoUrl = process.env.MONGOURI || 'mongodb://localhost:27017/barker';


async function createUser(email, name, lastname, password){

    const hashPassword = await bcrypt.hash(password, 10);
    const user = {
        email: email,
        name: name,
        lastname: lastname,
        password: hashPassword
    }

    if(await findUserByEmail(email)) throw new Error('Email already used');

    let client;
    try{
        client = await createClient();
    }catch(error){
        throw error;
    }

    const db = client.db();
    try{
        await db.collection('users').insertOne(user);
    }catch(error){
        console.log(error.message)
    }
    client.close();
    return 'User added successfully'
}

async function findUserByEmail(email){
    let client;
    try{
        client = await createClient();
    }catch(error){
        throw error;
    }
    const db = client.db();

    let result;
    try{
        result = await db.collection('users').findOne({ email: email });
    }catch(error){
        console.log(error.message)
    }

    client.close();
    return result;

}

async function createClient(){
    let dbconnection;
    try{
        dbconnection = await MongoClient.connect(mongoUrl, { useUnifiedTopology: true });
    }catch(error){
        console.log(error.message);
        // throw error;
    }

    return dbconnection;
}

createUser('dawid@asd.pl', 'dawid', 'wengrzik', 'zupa');