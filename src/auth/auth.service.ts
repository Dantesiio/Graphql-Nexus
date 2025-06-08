import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { LoginInput } from './dto/login.input';
import { AuthReponse } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { SignupInput } from './dto/signup.input';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(private readonly userService: UsersService,
     private readonly jwtService: JwtService,
    ) {}

    private getJwtToken( userId: string ) {
       return this.jwtService.sign({ id: userId });
    }
  
  async login( loginInput: LoginInput ): Promise<AuthReponse>{
        
        const { email, password } = loginInput;
        const user = await this.userService.findOneByEmail( email );

        if (!user) throw new BadRequestException('User not found');

        if( !bcrypt.compareSync( password,  user.password!) ){
            throw new BadRequestException('Email / Password do not match');
        }
        
        const token = this.getJwtToken( user.id );
        
        return {
            token,
            user
        }
    }

  async signup( signupInput: SignupInput ): Promise<AuthReponse> { 

        const user = await this.userService.create( signupInput )

        const token = this.getJwtToken( user.id );

        return {token, user}
               
    }

    async validateUser( id: string ): Promise<User> {
        const user = await this.userService.findOneById( id );
        if(!user) throw new BadRequestException(`user with id: ${id} not found` )

        if( !user.isActive ){
            throw new UnauthorizedException(`User is inactive, talk with an admin`);
        }
        if (!user) throw new BadRequestException('User not found');

        delete user.password;
        return user;
    }
  
}
