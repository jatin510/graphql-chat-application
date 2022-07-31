import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

const messages: any = [
  {
    id: 1,
    user: 'jatin',
    content: 'jatin',
  },
];

interface PostMessage {
  content: string;
  user: string;
}

interface Message {
  content: string;
  user: string;
  id: string;
}

export const messageResolvers = {
  Query: {
    messages: () => messages,
  },

  Mutation: {
    postMessage: (
      _parent: any,
      args: PostMessage,
      context: any,
      _info: any
    ) => {
      const { content, user } = args;
      const { pubsub } = context;

      const newMessage = { content, user, id: 1 };
      pubsub.publish('NEW_MESSAGE', { newMessageCreated: newMessage });
      messages.push(newMessage);

      return { id: 1, message: newMessage };
    },
  },

  Subscription: {
    newMessageCreated: {
      subscribe: (_parent: any, _args: any, context: any) => {
        const { pubsub } = context;
        console.log(pubsub.asyncIterator(['NEW_MESSAGE']));
        return pubsub.asyncIterator(['NEW_MESSAGE']);
      },
    },
  },
};

export default messageResolvers;
