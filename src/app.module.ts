import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AlertModule } from './alert/alert.module';
import { CounterModule } from './counter/counter.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [AuthModule, AlertModule, CounterModule, StorageModule],
  providers: [],
})
export class AppModule {}
