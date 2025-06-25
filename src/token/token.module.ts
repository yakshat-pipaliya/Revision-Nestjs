import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';


@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'YP',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [TokenController],
  providers: [TokenService, JwtStrategy],
  exports: [TokenService],
})
export class TokenModule { }
