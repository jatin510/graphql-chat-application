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

export default {
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
      // const { pubSub } = context;

      const newMessage = { content, user, id: 1 };

      messages.push(newMessage);
      // pubSub.publish('NUMBER_INCREMENTED', {
      //   numberIncremented: currentNumber,
      // });

      return { id: 1, message: newMessage };
    },
  },
  Subscription: {
    numberIncremented: {
      subscribe: (_parent: any, _args: any, context: any) => {
        const { pubsub } = context;
        pubsub.asyncIterator(['NUMBER_INCREMENTED']);
      },
    },
  },
};
