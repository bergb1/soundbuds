import { Resolver, Query } from 'type-graphql';
import { User } from '../schemas/user';

@Resolver(User)
export class UserResolver {
    @Query(returns => String)
    async users() {
        return "Hello World!"
    }
}