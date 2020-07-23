// const { MongoClient, ObjectID } = require('mongodb');

// const mongoUrl = process.env.MONGOURI || 'mongodb://localhost:27017/barker';


// const addComment = async function(ownerEmail, underPostID, commentContent){

//     const comment = {
//         owner: ownerEmail,
//         content: commentContent,
//         comments: [],
//         likes: []
//     }

//     let client;

//     try{
//         client = await createClient();
//     }catch(error){
//         throw error;
//     }
//     const db = client.db();
