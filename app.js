const mongoose = require('mongoose');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');

mongoose.ObjectId.get(v => v == null ? v : v.toString());

// Mongoose model
const Thing = mongoose.model('Thing', new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: String
}));

// GraphQL Type for model
const ThingType = new GraphQLObjectType({
  name: 'thing',
  fields: function () {
    return {
      id: { type: GraphQLID },
      name: { type: GraphQLString }
    }
  }
});

// Basic query (fetch all)
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    thing: {
      type: GraphQLList(ThingType),
      resolve: () => Thing.find()
    }
  }
});

// Basic mutation (create new)
const RootMutation = new GraphQLObjectType({
  name: 'CreateMutation',
  fields: {
    create: {
      type: ThingType,
      description: 'Create new thing',
      args: {
        name: {
          name: 'Name of Thing',
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (root, args) => {
        const newThing = new Thing({ name: args.name });
        newThing.id = newThing._id;
        return new Promise((res, rej) => {
          newThing.save(err => {
            if (err) return rej(err);
            res(newThing);
          });
        });
      }
    }
  }
});

// Compile a Schema
const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost/things');
mongoose.connection.once('open', async () => {
    await console.log('MongoDB connected.');
});

// Setup a simple server
const express = require('express');
const app = express();
const graphqlHTTP = require('express-graphql');

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(3001, () => {
    console.log('🚀 App is running on port 3001: http://localhost:3001/graphql');
});
