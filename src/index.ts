import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloWorldResolver } from './resolvers/HelloWorldResolver';
import { MovieResolver } from './resolvers/MovieResolver';
import chalk from 'chalk';
import bodyParser from 'body-parser';

(async () => {
  const app = express();

  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloWorldResolver, MovieResolver]
    }),
    context: ({ req, res }) => ({ req, res })
  });

  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(bodyParser.json());

  apolloServer.applyMiddleware({ app, cors: false });

  app.post('/create', async (req, res) => {
    if (!req.body.title || !req.body.minutes) {
      return res.status(500).send({
        error: 'Mising Fields. Make sure TITLE and MINUTES are set'
      });
    }

    const resolver = new MovieResolver();
    const title = req.body.title;
    const minutes = req.body.minutes;
    const firstName = req.body.firstName || null;
    const lastName = req.body.lastName || null;

    return await resolver
      .createMovie({ title, minutes, firstName, lastName })
      .then(movie => res.json({ movie }))
      .catch(error => res.json({ error }));
  });

  app.post('/update', async (req, res) => {
    if (!req.body.id && !req.body.firstName && !req.body.lastName) {
      return res.status(500).send({
        error: 'Missing fields. Make sure ID, FIRST NAME and LAST NAME are set'
      });
    }

    const resolver = new MovieResolver();
    const firstName = req.body.firstName || null;
    const lastName = req.body.lastName || null;
    const id = req.body.id;

    return await resolver
      .findMovieById(id)
      .then(async () => {
        res.json(await resolver.updateMovie(id, { firstName, lastName }));
      })
      .catch(error => res.json({ error }));
  });

  app.listen(4000, () => {
    console.log(chalk.green.bold('READY'));
  });
})();
