import {
  Resolver,
  Mutation,
  Arg,
  Query,
  InputType,
  Field,
  Int
} from 'type-graphql';
import { Movie } from '../entity/Movie';

@InputType()
class MovieInput {
  @Field()
  title: string;

  @Field(() => Int)
  minutes: number;
}

@InputType()
class MovieUpdateInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => Int, { nullable: true })
  minutes?: number;
}

@Resolver()
export class MovieResolver {
  // CREATE
  // @Mutation(() => Movie)
  // async createMovie(@Arg('options', () => MovieInput) options: MovieInput) {
  //   await Movie.insert(options);
  //   return true;
  // }

  // different way to do same thing
  // CREATE
  @Mutation(() => Movie)
  async createMovie(@Arg('options', () => MovieInput) options: MovieInput) {
    const movie = await Movie.create(options).save();
    return movie;
  }

  // READ
  @Query(() => [Movie])
  movies() {
    return Movie.find();
  }

  // UPDATE
  // using MovieInput - main drawback is that all fields in MovieInput must be set
  // @Mutation(() => Boolean)
  // async updateMovie(
  //   @Arg('id', () => Int) id: number,
  //   @Arg('input', () => MovieInput) input: MovieInput
  // ) {
  //   await Movie.update({ id }, input);
  //   return true;
  // }

  // same update except specialized MovieUpdateInput where fields are optional
  @Mutation(() => Boolean)
  async updateMovie(
    @Arg('id', () => Int) id: number,
    @Arg('input', () => MovieUpdateInput) input: MovieUpdateInput
  ) {
    await Movie.update({ id }, input);
    return true;
  }

  // DELETE
  @Mutation(() => Boolean)
  async deleteMovie(@Arg('id', () => Int) id: number) {
    await Movie.delete({ id });
    return true;
  }
}
