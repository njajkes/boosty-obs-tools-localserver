import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { StorageService } from './storage.service';

@Module({
  providers: [AuthService, StorageService],
  controllers: [AuthController],
})
export class AuthModule {}
