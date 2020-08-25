const { MongoClient, ObjectID } = require('mongodb');

const mongoUrl = process.env.MONGOURI || 'mongodb://localhost:27017/barker';



const addComment = async function(ownerEmail, postID, content){
    const comment = {
        ownerEmail: ownerEmail,
        underPostID: postID,
        content: content,
        date: new Date().toString()
    }

    let client;

    try{
        client = await createClient();
    }catch(error){
        throw error;
    }

    let result;

    try{
        const db = client.db();
        result = await db.collection('comments').insertOne(comment)
    }catch(error){
        throw error;
    }finally{
        client.close();
    }

    return result;

}




const getAllCommentsByPost = async function(postID){

    let client;

    try{
        client = await createClient();
    }catch(error){
        throw error;
    }
    const db = client.db();

    let result;

    try{
        result = await db.collection('comments').find({ underPostID: postID }).toArray();
    }catch(error){
        throw(error);
    }finally{
        client.close();
    }

    return result;

}


const getComment = async function(commentID){

    let client;

    try{
        client = await createClient();
    }catch(error){
        throw error;
    }
    const db = client.db();

    let result;

    try{
        result = await db.collection('comments').findOne(ObjectID(commentID));
    }catch(error){
        throw(error);
    }finally{
        client.close();
    }

    return result;
}



const modifyComment = async function(commentID, newContent){
    
    if(!(await getComment(commentID))) throw new Error('This comment doesn\'t exist');
    
    let client;

    try{
        client = await createClient() ;
    }catch(error){
        throw error;
    }
    const db = client.db();

    try{
        await db.collection('comments').findOneAndUpdate({ "_id": ObjectID(commentID)}, { $set: { "content": newContent }});
    }catch(error){
        throw(error);
    }finally{
        client.close();
    }

    return true;
}

const deleteComment = async function(commentID){
    if(!(await getComment(commentID))) throw new Error('This comment doesn\'t exist');

    let client;

    try{
        client = await createClient();
    }catch(error){
        throw error;
    }
    const db = client.db();

    try{
        await db.collection('comments').findOneAndDelete({ "_id": ObjectID(commentID) })
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
    addComment,
    getAllCommentsByPost,
    getComment,
    modifyComment,
    deleteComment
}