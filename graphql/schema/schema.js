const { buildSchema } = require('graphql');

module.exports = buildSchema(`

schema {
    query: Query,
    mutation: Mutation
}

type Query {
    events: [Event!]!
    bookings: [Booking!]!
    login(email: String!, password: String!): AuthData!
}

type AuthData {
    token: String!
    _id: ID!
    error: Error!
}

type Event {
    _id: ID!
    title: String!
    description: String!
    date: String!
    price: Float!
    creator: User!
}

type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}

type User {
    _id: ID!
    email: String!
    password: String
    createdEvents: [Event!]
    error: Error
}

type Error {
    error: String!
    message: String!
}

type Mutation {
    createUser(user: newUser): User!
    createEvent(event: newEvent): Event!
    bookEvent(bookId: String!): Booking!
    cancelBooking(bookId: String!): Booking!
} 

input newUser {
    email: String!
    password: String!
}

input newEvent {
    title: String!
    description: String!
    date: String!
    price: Float!
}

`);