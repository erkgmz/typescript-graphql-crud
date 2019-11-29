import { MovieResolver, MovieInput } from '../resolvers/MovieResolver';
const movieResolver = new MovieResolver();

const movieInput: MovieInput = {
  title: 'Test Title',
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
});
