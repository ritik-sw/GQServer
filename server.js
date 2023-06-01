const { ApolloServer, gql } = require('apollo-server');

// Define your schema using GraphQL schema language
const typeDefs = gql`
  type Todo {
    id: ID!
    task: String!
    completed: Boolean!
  }

  type Query {
    todos: [Todo!]!
  }

  type Mutation {
    addTodo(task: String!): Todo!
    completeTodo(id: ID!): Todo!
    updateTodo(id: ID!, task: String!, completed: Boolean!): Todo!
    deleteTodo(id: ID!): Todo!
  }
`;

// Define your data store
const todos = [
  { id: '1', task: 'Walk the dog', completed: false },
  { id: '2', task: 'Buy groceries', completed: false },
  { id: '3', task: 'Do laundry', completed: true },
];

// Define your resolvers
const resolvers = {
  Query: {
    todos: () => todos,
  },
  Mutation: {
    addTodo: (parent, args) => {
      const newTodo = { id: String(todos.length + 1), task: args.task, completed: false };
      todos.push(newTodo);
      return newTodo;
    },
    completeTodo: (parent, args) => {
      const todoIndex = todos.findIndex(todo => todo.id === args.id);
      if (todoIndex !== -1) {
        todos[todoIndex].completed = true;
        return todos[todoIndex];
      }
      return null;
    },
    updateTodo: (parent, args) => {
      const todoIndex = todos.findIndex(todo => todo.id === args.id);
      if (todoIndex !== -1) {
        todos[todoIndex].task = args.task;
        todos[todoIndex].completed = args.completed;
        return todos[todoIndex];
      }
      return null;
    },
    deleteTodo: (parent, args) => {
      const todoIndex = todos.findIndex(todo => todo.id === args.id);
      if (todoIndex !== -1) {
        const deletedTodo = todos.splice(todoIndex, 1);
        return deletedTodo[0];
      }
      return null;
    },
  },
};

// Create your Apollo Server instance
const server = new ApolloServer({ typeDefs, resolvers });

// Start listening for requests
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at this port ${url}`);
});