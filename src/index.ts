// TODO: implement authentication
import 'reflect-metadata';
import { createConnection, getConnectionOptions } from 'typeorm';
import express, { Application, Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloWorldResolver } from './resolvers/HelloWorldResolver';
import { MovieResolver } from './resolvers/MovieResolver';
import chalk from 'chalk';
import bodyParser from 'body-parser';

(async () => {
  const app: Application = express();
  const movieResolver = new MovieResolver();
  const dbOptions = await getConnectionOptions(
    process.env.NODE_ENV || 'development'
  );

  await createConnection({ ...dbOptions, name: 'default' });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloWorldResolver, MovieResolver]
    }),
    context: ({ req, res }) => ({ req, res })
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(bodyParser.json());

  app.get('/movies', async (_req: Request, res: Response) => {
    try {
      return await movieResolver
        .allMovies()
        .then(movies => res.json({ movies }))
        .catch(error => {
          throw new Error(error.message);
        });
    } catch (error) {
      return res.status(500).json({ error });
    }
  });

  app.get('/movie/:id?', async (req: Request, res: Response) => {
    try {
      const id = req.query.id || req.params.id;
      if (!id) throw new Error('No params');
      return await movieResolver
        .findMovieById(id)
        .then(movie => res.send({ movie }))
        .catch(error => {
          throw new Error(error.message);
        });
    } catch (error) {
      return res.status(500).json({ error });
    }
  });

  app.post('/create', async (req: Request, res: Response) => {
    try {
      const { title, minutes, firstName = null, lastName = null } = req.body;
      return await movieResolver
        .createMovie({ title, minutes, firstName, lastName })
        .then(movie => res.json({ movie }))
        .catch(error => {
          throw new Error(error.message);
        });
    } catch (error) {
      return res.status(500).json({ error });
    }
  });

  app.post('/update', async (req: Request, res: Response) => {
    try {
      const {
        id,
        title,
        minutes,
        firstName = null,
        lastName = null
      } = req.body;
      return await movieResolver
        .findMovieById(id)
        .then(async () => {
          return res.json(
            await movieResolver.updateMovie(id, {
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
      return res.status(500).json({ error });
    }
  });

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(chalk.green.bold(`READY - listening on port:${PORT}`));
  });
})();
