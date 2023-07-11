import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AlertModule } from './alert/alert.module';
import { CounterModule } from './counter/counter.module';
import { StorageModule } from './storage/storage.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    AlertModule,
    CounterModule,
    StorageModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'client'),
    }),
    ConfigModule.forRoot(),
  ],
  providers: [],
})
export class AppModule {}
