const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');


const mongoUrl = process.env.MONGOURI || 'mongodb://localhost:27017/barker';




const createUser = async function(email, name, lastname, password){

    const hashPassword = await bcrypt.hash(password, 10);
    const user = {
        email: email,
        name: name,
        lastname: lastname,
        password: hashPassword,
        followers: [],
        following: [],
        posts: [],

    }

    if(await getUserByEmail(email)) throw new Error('Email already used');

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
        throw error;
    }
    client.close();
    return 'User added successfully'
}




const getUserByEmail = async function(email){
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




const getUserByEmailWithoutPassword = async function(email){

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

    delete result.password;
    client.close();
    return result;

}




const addFollowToUser = async function(getsFollowEmail, givesFollowEmail){

    let client;
    try{
        client = await createClient();
    }catch(error){
        throw error;
    }
    const db = client.db();

    try{
        await db.collection('users').updateOne({ email: getsFollowEmail }, { $addToSet: { followers: givesFollowEmail }});
        await db.collection('users').updateOne({ email: givesFollowEmail }, { $addToSet: { following: getsFollowEmail }})
    }catch(error){
        throw error
    }

    client.close();
    return true;

}

const removeFollowFromUser = async function(getsFollowEmail, givesFollowEmail){
    
    let client;
    try{
        client = await createClient();
    }catch(error){
        throw error;
    }
    const db = client.db();

    try{
        await db.collection('users').updateOne({ email: getsFollowEmail }, { $pull: { followers: givesFollowEmail }});
        await db.collection('users').updateOne({ email: givesFollowEmail }, { $pull: { followers: getsFollowEmail }});
    }catch(error){
        throw error;
    }
}




const assignPostToUser = async function(postID, owner){
    let client;
    try{
        client = await createClient();
    }catch(error){
        throw error;
    }
    const db = client.db();

    try{
        await db.collection('users').updateOne({email: owner}, { $addToSet: { posts: postID }})
    }catch(error){
        throw error;
    }

    client.close();
    return true;
} 




const deletePostFromUser = async function(postID, owner){

    let client;
    try{
        client = await createClient();
    }catch(error){
        throw error;
    }
    const db = client.db();

    try{
        await db.collection('users').updateOne({ email: owner }, { $pull: { posts: postID} });
    }catch(error){
        throw error;
    }

    client.close();
    return true;
}




const createClient = async function(){
    let dbConnection;
    try{
        dbConnection = await MongoClient.connect(mongoUrl, { useUnifiedTopology: true });
    }catch(error){
        throw error;
    }

    return dbConnection;
}




module.exports = createUser;


/////////////////////////
/////////////////////////
/////////////////////////
// createUser('bubus@asd.pl', 'dawid', 'wengrzik', 'zupa').then(result => console.log(result)).catch(err => console.log(err.message));


getUserByEmail('bubus@asd.pl')
.then(result => {
    // delete result.password;
    console.log(result);
})
.catch(err => {
    console.log(err);
})

// getUserByEmailWithoutPassword('bubus@asd.pl')
// .then(result => {
//     // delete result.password;
//     console.log(result);
// })
// .catch(err => {
//     console.log(err);
// })

// addFollowToUser('bubus@asd.pl', 'PIMPUS!!')
// .then(result => {
//     console.log(result);
// })
// .catch(err => {
//     console.log(err.message);
// });


// assignPostToUser('1', 'bubus@asd.pl')
// .then(result => console.log(result))
// .catch(error => console.log(error));

deletePostFromUser('1', 'bubus@asd.pl')
.then(result => console.log(result))
.catch(error => console.log(error));