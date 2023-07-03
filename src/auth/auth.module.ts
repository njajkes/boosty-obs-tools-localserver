import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { StorageModule } from 'src/storage/storage.module';
import { StorageService } from 'src/storage/storage.service';

@Module({
  imports: [StorageModule],
  providers: [AuthService, StorageService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
