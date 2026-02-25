import { PartialType } from '@nestjs/swagger';
import { CreateRegistrationDto } from './create-registration.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRegistrationDto extends PartialType(CreateRegistrationDto) {
  @ApiProperty({
    example: 'confirmed',
    description: 'pending | confirmed | cancelled',
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string;
}