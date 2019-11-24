import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloWorldResolver } from './resolvers/HelloWorldResolver';
import { MovieResolver } from './resolvers/MovieResolver';
import chalk from 'chalk';

(async () => {
  const app = express();

  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloWorldResolver, MovieResolver]
    }),
    context: ({ req, res }) => ({ req, res })
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log(chalk.green.bold('READY'));
  });

  app.get('/create', async (req, res) => {
    if (req.query.title && req.query.minutes) {
      const resolver = new MovieResolver();
      const title = req.query.title;
      const minutes = req.query.minutes;
      const firstName = req.query.firstName || null;
      const lastName = req.query.lastName || null;

      await resolver
        .createMovie({ title, minutes, firstName, lastName })
        .then(movie => res.json({ movie }))
        .catch(error => res.json({ error }));
    }
  });

  app.get('/update', async (req, res) => {
    if (req.query.id && req.query.firstName && req.query.lastName) {
      const resolver = new MovieResolver();
      const firstName = req.query.firstName;
      const lastName = req.query.lastName;
      const id = req.query.id;

      await resolver
        .findMovieById(id)
        .then(async () => {
          res.json(await resolver.updateMovie(id, { firstName, lastName }));
        })
        .catch(error => res.json({ error }));
    }
  });
})();
