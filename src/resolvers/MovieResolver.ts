import {
  Resolver,
  Mutation,
  Arg,
  Query,
  InputType,
  Field,
  Int,
  Ctx
} from 'type-graphql';
import { Movie } from '../entity/Movie';
import { MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Context } from '../graphql-types/Context';

@InputType()
export class MovieInput {
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
export class MovieUpdateInput {
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

  @Mutation(() => Boolean)
  async ctx(@Ctx() ctx: Context) {
    const reqBody = ctx.req.body;
    console.log('====================> ', reqBody);
  }
}
