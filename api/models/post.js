const { MongoClient, ObjectID } = require('mongodb');

const mongoUrl = process.env.MONGOURI || 'mongodb://localhost:27017/barker';


const addPost = async function(ownerEmail, postContent){

    const post = {
        owner: ownerEmail,
        content: postContent,
        comments: [], //comments id 
        likes: [] //users id 
    }

    let client;

    try{
        client = await createClient();
    }catch(error){
        throw error;
    }
    const db = client.db();

    try{
        await db.collection('posts').insertOne(post)
    }catch(error){
        throw error;
    }finally{
        client.close();
    }

    return true;

}




const getAllPost = async function(ownerEmail){

    let client;

    try{
        client = await createClient();
    }catch(error){
        throw error;
    }
    const db = client.db();

    let result;

    try{
        result = await db.collection('posts').find({ owner: ownerEmail }).toArray();
    }catch(error){
        throw(error);
    }finally{
        client.close();
    }

    return result;

}




const getPost = async function(postID){

    let client;

    try{
        client = await createClient();
    }catch(error){
        throw error;
    }
    const db = client.db();

    try{
        result = await db.collection('posts').findOne(ObjectID(postID));
    }catch(error){
        throw(error);
    }finally{
        client.close();
    }

    return result;
}




const updatePost = async function(postID, newContent){

    if(!(await getPost(postID))) throw new Error('This post doesn\'t exist');

    let client;

    try{
        client = await createClient();
    }catch(error){
        throw error;
    }
    const db = client.db();

    try{
        await db.collection('posts').findOneAndUpdate({ "_id": ObjectID(postID)}, { $set: { "content": newContent }});
    }catch(error){
        throw(error);
    }finally{
        client.close();
    }

    return true;

}

const asingCommentToPost = async function(postID, commentID){

    if(!(await getPost(postID))) throw new Error('This post doesn\'t exist');

    let client;

    try{
        client = await createClient();
    }catch(error){
        throw error;
    }
    const db = client.db();

    try{
        await db.collection('posts').updateOne({ "_id": ObjectID(postID)}, { $addToSet: { comments: commentID }})
    }catch(error){
        throw(error);
    }finally{
        client.close();
    }

    return true;
}

const unAsingComment = async function(postID, commentID){

    if(!(await getPost(postID))) throw new Error('This post doesn\'t exist');

    let client;

    try{
        client = await createClient();
    }catch(error){
        throw error;
    }
    const db = client.db();

    try{
        await db.collection('posts').updateOne({ "_id": ObjectID(postID)}, { $pull: { comments: commentID }})
    }catch(error){
        throw(error);
    }finally{
        client.close();
    }

    return true;
}




const removePost = async function(postID){

    if(!(await getPost(postID))) throw new Error('This post doesn\'t exist');

    let client;

    try{
        client = await createClient();
    }catch(error){
        throw error;
    }
    const db = client.db();

    try{
        await db.collection('posts').findOneAndDelete({ "_id": ObjectID(postID) });
    }catch(error){
        throw(error);
    }finally{
        client.close();
    }

    return true;

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
    createClient,
    removePost,
    unAsingComment,
    asingCommentToPost,
    updatePost,
    getPost,
    getAllPost,
    addPost
}