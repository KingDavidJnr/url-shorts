const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Url {
    id: ID!
    originalUrl: String!
    shortCode: String!
    clicks: Int!
    expiresAt: String
    createdAt: String!
    updatedAt: String!
    userId: String
  }

  type UrlPage {
    items: [Url!]!
    totalItems: Int!
    totalPages: Int!
    currentPage: Int!
  }

  type SuccessMessage {
    message: String!
  }

  type Query {
    me: User!
    myUrls(page: Int, limit: Int): UrlPage!
    url(id: ID!): Url!
    analytics(id: ID!): Url!
  }

  type Mutation {
    register(email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    createShortUrl(originalUrl: String!, shortCode: String, expiresAt: String): Url!
    updateUrl(id: ID!, originalUrl: String, expiresAt: String): Url!
    deleteUrl(id: ID!): SuccessMessage!
  }
`;

module.exports = typeDefs;
