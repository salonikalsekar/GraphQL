const express = require('express');
const bodyParser = require('body-parser');
const graphqlhttp = require('express-graphql');
const mongoose = require('mongoose');
const eventModel = require('./models/event');
const userModel = require('./models/users');

const {
    buildSchema
} = require('graphql');

const bcryptjs = require('bcryptjs');
const app = express()


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

    type User{
        _id: ID!
        email: String!
        password: String
    }

    type RootQuery{
        events: [Event!]!
    }

    input UserInput{
        email: String!
        password: String
    }

    input EventInput{
        title: String!
        description: String!
        price: Float!
        date: String!
    }
    type RootMutation{
        createEvent(eventInp : EventInput): Event
        createUser(userInp : UserInput): User

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
        createEvent: args => {
            const event = new eventModel({
              title: args.eventInp.title,
              description: args.eventInp.description,
              price: +args.eventInp.price,
              date: new Date().toISOString(),
              creator: '5d47d75c97d0696c218aec72'
            });
            let createdEvent;
            return event
              .save()
              .then(result => {
                createdEvent = { ...result._doc, _id: result._doc._id.toString() };
                return userModel.findById('5d47d75c97d0696c218aec72');
              })
              .then(user => {
                if (!user) {
                  throw new Error('User not found.');
                }
                console.log(event)
                user.createdEvents.push(event);
                return user.save();
              })
              .then(result => {
                return createdEvent;
              })
              .catch(err => {
                console.log(err);
                throw err;
              });
          },
        createUser: (args) =>{
           return userModel.findOne({email: args.userInp.email}).then(user => {
                if(user)
                throw new Error('User already present');
                return bcryptjs.hash(args.userInp.password, 12)
            })
            .then(hashed => {
                const user = new userModel({
                    email: args.userInp.email,
                        password: hashed
                })
                        return user.save()
                }).then(res =>{
                    return { ...res._doc, _id: res._doc._id.toString(), password: null} 
            }).catch(err => {
                throw err;
            })

        }
    },
    graphiql : true
}))
mongoose.connect(`mongodb+srv://saloni:Hari@cluster0-wgbmh.mongodb.net/react-graphql-dev?retryWrites=true&w=majority`).then(() =>{
    app.listen(3001)
})
.catch(err =>{
    console.log(err)
})

