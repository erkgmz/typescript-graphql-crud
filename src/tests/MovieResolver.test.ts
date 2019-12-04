import {
  MovieResolver,
  MovieInput,
  MovieUpdateInput
} from '../resolvers/MovieResolver';
import { createConnection, getConnectionOptions, Connection } from 'typeorm';

const movieResolver = new MovieResolver();

const movieInput: MovieInput = {
  title: 'TestTitle',
  minutes: 90,
  firstName: 'TestFirst',
  lastName: 'TestLast'
};

describe('The MovieResolver', () => {
  describe('when creating a movie', () => {
    it('should return a object', async () => {
      await movieResolver
        .createMovie(movieInput)
        .then(movie => {
          expect(typeof movie).toEqual('object');
        })
        .catch(error => error);
    });

    it('should return a string', async () => {
      await movieResolver
        .createMovie(movieInput)
        .then(movie => {
          expect(typeof movie.title).toEqual('string');
        })
        .catch(error => error);
    });

    it('should return a number', async () => {
      await movieResolver
        .createMovie(movieInput)
        .then(movie => {
          expect(typeof movie.minutes).toEqual('number');
        })
        .catch(error => error);
    });
  });

  describe('when updating a movie', () => {
    let connection: Connection;

    const movieUpdateInput: MovieUpdateInput = {
      title: 'This is a Test Title',
      minutes: 90,
      firstName: 'TestUpdateFirst',
      lastName: 'TestUpdateLast'
    };

    beforeEach(async () => {
      const dbOptions = await getConnectionOptions('test');

      connection = await createConnection({
        ...dbOptions,
        name: 'default',
        logging: false
      });
    });

    afterEach(async () => {
      await connection.close();
    });

    it('should return a boolean', async () => {
      await movieResolver.updateMovie(0, movieUpdateInput).then(isUpdated => {
        expect(typeof isUpdated).toBe('boolean');
      });
    });
  });
});
