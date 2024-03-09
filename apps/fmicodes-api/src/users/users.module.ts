import { Module } from '@nestjs/common';
import { UsersService } from '@fmicodes/fmicodes-services/users/users.service';
import { PrismaService } from '@fmicodes/fmicodes-services/prisma/prisma.service';
import { JwtStrategy } from '@fmicodes/fmicodes-services/auth/strategies/jwt.strategy';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService, PrismaService, JwtStrategy],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}

export default UsersModule;
