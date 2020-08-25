const { MongoClient, ObjectID } = require('mongodb');

const mongoUrl = process.env.MONGOURI || 'mongodb://localhost:27017/barker';


const addPost = async function(ownerEmail, postContent){

    const post = {
        owner: ownerEmail,
        content: postContent,
        likes: [], //users id 
        date: new Date().toString()
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

    let result;

    try{
        result = await db.collection('posts').findOne(ObjectID(postID));
    }catch(error){
        throw(error);
    }finally{
        client.close();
    }
    console.log(result)
    if(!result) throw new Error(`Post doesn\'t exist`)

    return result;
}




const updatePost = async function(ownerEmail, postID, newContent){
    let post;
    try{
        post = await getPost(postID)
    }catch(err){
        throw new Error('This post doesn\'t exist');
    }

    if(post.owner !== ownerEmail) throw new Error('This user has no permition to update this post')

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





const deletePost = async function(postID){

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
    deletePost,
    updatePost,
    getPost,
    getAllPost,
    addPost
}
