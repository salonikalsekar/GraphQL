const express = require('express');
const bodyParser = require('body-parser');
const graphqlhttp = require('express-graphql');
const mongoose = require('mongoose');
const graphqlSchema = require('./graphql/schema/index')
const graphqlResolver = require('./graphql/resolvers/index')

const app = express()

//String-  will return a string and never a null
//! - required
app.use('/graphql', graphqlhttp({
    schema:graphqlSchema,
    rootValue:graphqlResolver ,
    graphiql : true
}))
mongoose.connect(`mongodb+srv://saloni:Hari@cluster0-wgbmh.mongodb.net/react-graphql-dev?retryWrites=true&w=majority`).then(() =>{
    app.listen(3001)
})
.catch(err =>{
    console.log(err)
})

