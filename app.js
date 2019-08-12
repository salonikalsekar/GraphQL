const express = require('express');
const bodyParser = require('body-parser');
const graphqlhttp = require('express-graphql');
const mongoose = require('mongoose');
const graphqlSchema = require('./graphql/schema/index')
const graphqlResolver = require('./graphql/resolvers/index')
const isAuth = require('./middleware/is-auth');
const app = express()

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });
  
app.use(isAuth)

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

