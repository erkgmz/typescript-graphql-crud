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

  app.get('/movies', async (_req, res) => {
    try {
      const Resolver = new MovieResolver();
      return await Resolver.allMovies()
        .then(movie => res.json({ movie }))
        .catch(error => {
          throw new Error(error.message);
        });
    } catch (error) {
      const { message } = error;
      return res.status(500).json({ message, error: true });
    }
  });

  app.get('/movie/:id?', async (req, res) => {
    try {
      const Resolver = new MovieResolver();
      const { id } = req.query;
      if (!id) throw new Error('No params');
      return await Resolver.findMovieById(id)
        .then(movie => res.send({ movie }))
        .catch(error => {
          throw new Error(error.message);
        });
    } catch (error) {
      const { message } = error;
      return res.status(500).json({ message, error: true });
    }
  });

  app.post('/create', async (req, res) => {
    try {
      const Resolver = new MovieResolver();
      const { title, minutes, firstName = null, lastName = null } = req.body;
      return await Resolver.createMovie({ title, minutes, firstName, lastName })
        .then(movie => res.json({ movie }))
        .catch(error => {
          throw new Error(error.message);
        });
    } catch (error) {
      const { message } = error;
      return res.status(500).json({ message, error: true });
    }
  });

  app.post('/update', async (req, res) => {
    try {
      const Resolver = new MovieResolver();
      const {
        id,
        title,
        minutes,
        firstName = null,
        lastName = null
      } = req.body;
      return await Resolver.findMovieById(id)
        .then(async () => {
          return res.json(
            await Resolver.updateMovie(id, {
              title,
              minutes,
              firstName,
              lastName
            })
          );
        })
        .catch(error => {
          throw new Error(error.message);
        });
    } catch (error) {
      const { message } = error;
      return res.status(500).json({ message, error: true });
    }
  });

  app.listen(4000, () => {
    console.log(chalk.green.bold('READY'));
  });
})();
