import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

const messages: any = [
  {
    id: 1,
    user: 'jatin',
    content: 'jatin',
  },
];

const currentNumber = 2;

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

    currentNumber() {
      return currentNumber;
    },
  },

  Mutation: {
    postMessage: (
      _parent: any,
      args: PostMessage,
      _context: any,
      _info: any
    ) => {
      const { content, user } = args;
      console.log(_context.pubsub);

      const newMessage = { content, user, id: 1 };

      messages.push(newMessage);

      return { id: 1, message: newMessage };
    },
  },
  Subscription: {
    numberIncremented: {
      subscribe: (_parent: any, _args: any, context: any) => {
        console.log('hello');
        console.log(pubsub);
        pubsub.asyncIterator(['NUMBER_INCREMENTED']);
      },
    },
  },
};

export default messageResolvers;
