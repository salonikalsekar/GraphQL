const {
    buildSchema
} = require('graphql');

module.exports =  buildSchema(`
type Booking{
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!

}

type Event{
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
}

type User{
    _id: ID!
    email: String!
    password: String
    createdEvents : [Event!]
}

type RootQuery{
    events: [Event!]!
    bookings: [Booking!]!
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
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!

}
    schema{
        query:RootQuery
        mutation:RootMutation
    }
`)