const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');


const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/barker';




const createUser = async function(email, name, lastname, password){

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
        email: email,
        name: name,
        lastname: lastname,
        password: hashedPassword,
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
    }finally{
        client.close();
    }

    return true;
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
    }finally{
        client.close();
    }

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
    }finally{
        client.close();
    }

    return true;
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
    }finally{
        client.close();
    }

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
    }finally{
        client.close();
    }

    return true;
}




const changePassword = async function (userEmail, newPassword){
    if(!(await getUserByEmail(userEmail))) throw new Error('This email is not used');

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    let client;
    try{
        client = await createClient();
    }catch(error){
        throw error;
    }
    const db = client.db()

    try{
        await db.collection('users').updateOne({ email: userEmail }, { $set: { password: hashedPassword }});
    }catch(error){
        throw error;
    }finally{
        client.close();
    }

    return true;
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
        throw error;
    }finally{
        client.close();
    }
    
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
        throw error;
    }finally{
        client.close();
    }

    delete result.password;
    return result;

}




async function createClient(){
    let dbConnection;
    try{
        dbConnection = await MongoClient.connect(mongoUrl, { useUnifiedTopology: true });
    }catch(error){
        throw error;
    }

    return dbConnection;
}




module.exports = {
    createUser,
    getUserByEmail,
    getUserByEmailWithoutPassword,
    addFollowToUser,
    removeFollowFromUser,
    assignPostToUser,
    deletePostFromUser,
    changePassword
};