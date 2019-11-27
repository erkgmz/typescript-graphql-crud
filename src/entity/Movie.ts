import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class Movie extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  title: string;

  @Field(() => Int, { nullable: true })
  @Column('int', { nullable: true })
  minutes: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  firstName: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  lastName: string;
}
