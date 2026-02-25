import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegistrationModule } from './registration/registration.module';
import { Registration } from './registration/entities/registration.entity';
import { AccompanyingPerson } from './registration/entities/accompanying-person.entity';

@Module({
  imports: [
    // Load .env
    ConfigModule.forRoot({ isGlobal: true }),

    // Database
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      entities: [Registration, AccompanyingPerson],
      synchronize: true, // auto-creates tables — disable in production
      logging: false,
    }),

    RegistrationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}