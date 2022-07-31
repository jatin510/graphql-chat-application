import { gql } from 'apollo-server-express';

export const messageTypes = gql`
  type Message {
    id: ID
    user: String!
    content: String!
  }

  type PostMessageReturnType {
    id: String
    message: Message
  }

  extend type Query {
    messages: [Message!]
  }

  extend type Mutation {
    postMessage(user: String!, content: String!): PostMessageReturnType
  }

  extend type Subscription {
    newMessageCreated: Message!
  }
`;
