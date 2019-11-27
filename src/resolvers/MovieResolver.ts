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
import { MoreThanOrEqual, LessThanOrEqual } from 'typeorm';

@InputType()
class MovieInput {
  @Field()
  title: string;

  @Field(() => Int)
  minutes: number;

  @Field(() => String, { nullable: true })
  firstName: string;

  @Field(() => String, { nullable: true })
  lastName: string;
}

@InputType()
class MovieUpdateInput {
  @Field(() => String, { nullable: true })
  title: string;

  @Field(() => Int, { nullable: true })
  minutes: number;

  @Field(() => String, { nullable: true })
  firstName: string;

  @Field(() => String, { nullable: true })
  lastName: string;
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
  allMovies() {
    return Movie.find();
  }

  @Query(() => Movie)
  findMovieById(@Arg('id', () => Int) id: number) {
    return Movie.findOne({ id });
  }

  @Query(() => Movie)
  findMovieByTitle(@Arg('title') title: string) {
    return Movie.findOne({ title });
  }

  @Query(() => [Movie])
  findAllWhereMinutesAreGreaterThan(@Arg('minutes') minutes: number) {
    return Movie.find({ minutes: MoreThanOrEqual(minutes) });
  }

  @Query(() => [Movie])
  findAllWhereMinutesAreLessThan(@Arg('minutes') minutes: number) {
    return Movie.find({ minutes: LessThanOrEqual(minutes) });
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

  @Mutation(() => Boolean)
  async deleteAll(@Arg('id', () => [Int]) id: number[]) {
    await Movie.delete(id);
    return true;
  }
}
