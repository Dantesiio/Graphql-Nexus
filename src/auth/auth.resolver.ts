import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthReponse } from './types/auth-response.type';
import { SignupInput } from './dto/signup.input';
import { LoginInput } from './dto/login.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthReponse, { name: 'signup'})
  async signup(
    @Args('signInput') signInput: SignupInput
  ): Promise<AuthReponse>{
    return await this.authService.signup(signInput);
  }

   @Mutation(() => AuthReponse, { name: 'login'})
  async login(
    @Args('loginInput') loginInput: LoginInput
  ): Promise<AuthReponse>{
    return await this.authService.login(loginInput);
  }


}
