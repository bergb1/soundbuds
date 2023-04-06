import { ObjectType, Field, Authorized, ID } from 'type-graphql';

@ObjectType()
export class User {
    @Field(type => ID)
    user_id!: string;

    @Field()
    username!: string;

    @Field()
    email!: string;

    @Field()
    password!: string;

    @Field()
    role!: string;

    @Field({ nullable: true })
    nickname?: string;
}
