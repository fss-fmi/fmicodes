import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '@fmicodes/fmicodes-services/auth/auth.service';
import { LocalStrategy } from '@fmicodes/fmicodes-services/auth/strategies/local.strategy';
import { AnonymousStrategy } from '@fmicodes/fmicodes-services/auth/strategies/anonymous.strategy';
import { DiscordStrategy } from '@fmicodes/fmicodes-services/auth/strategies/discord.strategy';
import { appConfig } from '../app/app.config';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register(appConfig.jwtAccessToken),
  ],
  providers: [AuthService, LocalStrategy, AnonymousStrategy, DiscordStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

export default AuthModule;
