GraphQL  - Basic Concepts

Developed by Facebook and made in open source in 2015.


GraphQL is a new API standard that provides a more efficient, powerful and flexible alternative to REST.
GraphQL enables declarative data fetching.
GraphQL server only exposes a single endpoint. 


3 factors challenging the way APIs are designed:
1. Increased mobile usage creates need for efficient data loading
2. Variety of different frontend frameworks and platforms
3. Fast development & expectation for rapid feature development


It has many advantages over REST APIs.
Faster, only one endpoint to be written which implements all the query we want. 
We use post request even while getting data - because we need to send the query expression and we cant send body while making get request. 


In REST we have to mention route for every request, every method and every resource we want. 
But in GraphQL we write a json having the operation type, route and its parameters along with the data to be requested. 

Query is similar to get in REST, and mutation is similar to post/patch/put/delete in REST. The third one is subscription where the client subscribes to know when an event occurs.

query{
    User(id:"r121"){
        name
        title
    }
}

No more Over- and Underfetching
Improved productivity and flexibility is achieved
No need to change the backend to satisfy the requirements of the front end side
And since the schema is well defined, the front end and backend can work independently. 



CORE concepts:
GraphQL has its own type system to define the schema of the API.
Schema is written using SDL- Schema Definition Language

    type User{
        name: String!
        age: Int!
        posts: [Post!]! - one-mayn relation
    }



Schema:
Schema has a type system (query, mutation, subscription)

{
    Persons{
        name
    }
}


type Query{
    Persons(last: Int): [Person!]!
}


References:

https://graphql.org/learn/
https://www.howtographql.com/basics/
