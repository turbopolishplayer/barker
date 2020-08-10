const { MongoClient, ObjectID } = require('mongodb');

const mongoUrl = process.env.MONGOURI || 'mongodb://localhost:27017/barker';



const addComment = async function(ownerEmail, underPostID, content){
    const comment = {
        ownerEmail: ownerEmail,
        underPostID: underPostID,
        content: content
    }

    let client;

    try{
        client = await createClient();
    }catch(error){
        throw error;
    }

    try{
        const db = client.db();
        await db.collection('comments').insertOne(comment)
    }catch(error){
        throw error;
    }finally{
        client.close();
    }

    return true;

}




const getAllComments = async function(ownerEmail){

    let client;

    try{
        client = await createClient();
    }catch(error){
        throw error;
    }
    const db = client.db();

    let result;

    try{
        result = await db.collection('comments').find({ owner: ownerEmail }).toArray();
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

    try{
        result = await db.collection('comments').findOne(ObjectID(postID));
    }catch(error){
        throw(error);
    }finally{
        client.close();
    }

    return result;
}



const updateComment = async function(commentID, newContent){
    
    if(!(await getComment(commentID))) throw new Error('This comment doesn\'t exist');
    l
    let client;

    try{
        client = await createClient();
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

const removeComment = async function(commentID){
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
    getAllComments,
    getComment,
    updateComment,
    removeComment
}