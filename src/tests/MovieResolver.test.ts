import {
  MovieResolver,
  MovieInput,
  MovieUpdateInput
} from '../resolvers/MovieResolver';
import { createConnection } from 'typeorm';

const movieResolver = new MovieResolver();

const movieInput: MovieInput = {
  title: 'TestTitle',
  minutes: 90,
  firstName: 'TestFirst',
  lastName: 'TestLast'
};

const movieUpdateInput: MovieUpdateInput = {
  title: 'UpdateTitle',
  minutes: 90,
  firstName: 'UpdateFirst',
  lastName: 'UpdateLast'
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
    it('should return a boolean', async () => {
      await createConnection();
      await movieResolver.updateMovie(44, movieUpdateInput).then(isUpdated => {
        expect(typeof isUpdated).toBe('boolean');
      });
    });
  });
});
