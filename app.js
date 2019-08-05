const express = require('express');
const bodyParser = require('body-parser');
const graphqlhttp = require('express-graphql');
const mongoose = require('mongoose');
const eventModel = require('./models/event');
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
            return eventModel.find().then(events => {
                return events.map(event => {
                    return { ...event._doc, _id: event.id } 
                })
            }).catch(err => {
                throw err;
            })
        },
        createEvent: (args) =>{
            // const event ={
            //     _id :  Math.random().toString(),
            //     title: args.eventInp.title,
            //     description: args.eventInp.description,
            //     price: +args.eventInp.price,
            //     date: new Date().toISOString()
            // }
            // events.push(event)

            const event = new eventModel({
                title: args.eventInp.title,
                    description: args.eventInp.description,
                    price: +args.eventInp.price,
                    date: new Date().toISOString()
            })
            return event.save().then(res =>{
                return { ...res._doc, _id: res._doc._id.toString() } 
            }).catch(err => {
                throw err;
            })

        }
    },
    graphiql : true
}))
mongoose.connect(`mongodb+srv://user:password@cluster0-wgbmh.mongodb.net/react-graphql-dev?retryWrites=true&w=majority`).then(() =>{
    app.listen(3000)
})
.catch(err =>{
    console.log(err)
})

