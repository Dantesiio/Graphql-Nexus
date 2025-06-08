import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SignupInput } from 'src/auth/dto/signup.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}


    async create( signupInput: SignupInput ): Promise<User> {
    try {

      const newUser = this.userRepository.create({ 
        ...signupInput,
        password: bcrypt.hashSync( signupInput.password, 10 )
       });

      return await this.userRepository.save( newUser ); 

    } catch (error) {
      this.handleDBErrors(error);
    }
  }


  async findOneByEmail( email: string ): Promise<User> {
   
    try {
      return await this.userRepository.findOneByOrFail({ email })
    } catch (error) {
      throw new NotFoundException(`${ email } not found`);
    }

  }

  async findOneById( id: string ): Promise<User> {
   
    try {
      return await this.userRepository.findOneByOrFail({ id })
    } catch (error) {
      throw new NotFoundException(`${ id } not found`);
    }

  }

  private handleDBErrors( error: any ): never{
    if( error.code === '23505' ){
      throw new BadRequestException(error.detail.replace('Key', ''));
    }

    if( error.code == 'error-001' ){
      throw new BadRequestException(error.detail.replace('Key', ''));
    }
    this.logger.error( error );
    throw new InternalServerErrorException('Please check server logs');
  }

}
