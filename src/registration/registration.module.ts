import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationService } from './registration.service';
import { RegistrationController } from './registration.controller';
import { Registration } from './entities/registration.entity';
import { AccompanyingPerson } from './entities/accompanying-person.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Registration, AccompanyingPerson])],
  controllers: [RegistrationController],
  providers: [RegistrationService],
  exports: [RegistrationService],
})
export class RegistrationModule {}
