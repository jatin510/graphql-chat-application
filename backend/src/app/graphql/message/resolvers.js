const messages = [
  {
    id: 1,
    user: 'jatin',
    content: 'jatin',
  },
];
const currentNumber = 2;
export default {
  Query: {
    messages: () => messages,
    currentNumber() {
      return currentNumber;
    },
  },
  Mutation: {
    postMessage: (_parent, args, _context, _info) => {
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
      subscribe: () => {
        console.log('hello');
        // pubsub.asyncIterator(['NUMBER_INCREMENTED'])
      },
    },
  },
};
