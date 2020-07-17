const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const joi = require('joi');


mongoUrl = 'mongodb://localhost:27017/barker'


async function createUser(email, name, lastname, password){
    const hashPassword = await bcrypt.hash(password, 10);
    const user = {
        email: email,
        name: name,
        lastname: lastname,
        password: hashPassword
    }

    let client;
    try{
        client = await dbConnect();
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
}

async function dbConnect(){
    let dbconnection;
    try{
        dbconnection = await MongoClient.connect(mongoUrl, { useUnifiedTopology: true });
    }catch(error){
        throw error;
    }

    return dbconnection;
}

createUser('asd@asd.pl', 'dawid', 'wengrzik', 'zupa');