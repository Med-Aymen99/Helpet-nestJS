import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { PayloadInterface } from '../interfaces/payload.interface';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('SECRET'),
    });
  }

  //Définier la façon avec laquelle on valide le token
  async validate(payload: PayloadInterface) {
    const user = await this.userRepo.findOne({
        where: {username: payload.username}
    });
    
    if (user) {
        delete user.salt;
        delete user.password;
        return user;
    } else {
        throw new UnauthorizedException();
    }
  }
}
