const express = require('express');
const bodyParser = require('body-parser');
const graphqlhttp = require('express-graphql');
const mongoose = require('mongoose');

const {
    buildSchema
} = require('graphql');

const app = express()

const events = [];

app.get('/', (req, res, next) => {
    res.send("hello")
})

//String-  will return a string and never a null
//! - required
app.use('/graphql', graphqlhttp({
    schema: buildSchema(`

    type Event{
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    type RootQuery{
        events: [Event!]!
    }
    input EventInput{
        title: String!
        description: String!
        price: Float!
        date: String!
    }
    type RootMutation{
        createEvent(eventInp : EventInput): Event

    }
        schema{
            query:RootQuery
            mutation:RootMutation
        }
    `),
    rootValue: {
        events: () =>{
            return events
        },
        createEvent: (args) =>{
            const event ={
                _id :  Math.random().toString(),
                title: args.eventInp.title,
                description: args.eventInp.description,
                price: +args.eventInp.price,
                date: new Date().toISOString()
            }
            events.push(event)
            return event

        }
    },
    graphiql : true
}))
// const client = new MongoClient(`mongodb+srv://sal-14:${process.env.MONGO_PASSWORD}@cluster0-wgbmh.mongodb.net/test?retryWrites=true&w=majority`, { useNewUrlParser: true });
mongoose.connect(`mongodb+srv://saloni:Hari@cluster0-wgbmh.mongodb.net/test?retryWrites=true&w=majority`).then(() =>{
    app.listen(3000)
})
.catch(err =>{
    console.log(err)
})

