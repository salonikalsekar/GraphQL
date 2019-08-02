const express = require('express');
const bodyParser = require('body-parser');
const graphqlhttp = require('express-graphql');
const {
    buildSchema
} = require('graphql');

const app = express()


app.get('/', (req, res, next) => {
    res.send("hello")
})

//String-  will return a string and never a null
//! - required
app.use('/graphql', graphqlhttp({
    schema: buildSchema(`
    type RootQuery{
        events: [String!]!
    }
    type RootMutation{
        createEvent(name: String): String

    }
        schema{
            query:RootQuery
            mutation:RootMutation
        }
    `),
    rootValue: {
        events: () =>{
            return ['abc, xyz, klm, bcd']
        },
        createEvent: (args) =>{
            const eventName = args.name;
            return eventName
        }
    },
    graphiql : true
}))

app.listen(3000)