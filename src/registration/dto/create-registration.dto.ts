import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  IsArray,
  IsInt,
  Min,
  Max,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AccompanyingPersonDto } from './accompanying-person.dto';

export class CreateRegistrationDto {
  // ── Basic Info ──────────────────────────────────────────────────────────

  @ApiProperty({ example: 'John Doe', description: 'Full name as per ID proof' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({ example: '+91 9876543210' })
  @IsString()
  @IsNotEmpty()
  mobile!: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: '41 Club Bhubaneswar' })
  @IsString()
  @IsNotEmpty()
  organization!: string;

  @ApiProperty({ example: 'Bhubaneswar' })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiProperty({ example: 'Odisha' })
  @IsString()
  @IsNotEmpty()
  state!: string;

  @ApiProperty({ example: 'male', description: 'male | female | other' })
  @IsString()
  @IsNotEmpty()
  gender!: string;

  // ── Event Info ──────────────────────────────────────────────────────────

  @ApiProperty({
    example: 'single',
    description: 'single | single_twin | couple | tangent_twin',
  })
  @IsString()
  @IsNotEmpty()
  registrationType!: string;

  @ApiProperty({ example: 2, description: 'Number of accompanying persons (0–5)', default: 0 })
  @IsInt()
  @Min(0)
  @Max(5)
  accompanyingPersonsCount!: number;

  @ApiProperty({ type: [AccompanyingPersonDto], required: false, default: [] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AccompanyingPersonDto)
  @IsOptional()
  accompanyingPersons?: AccompanyingPersonDto[];

  @ApiProperty({ example: false })
  @IsBoolean()
  airportPickup!: boolean;

  @ApiProperty({ example: '2026-09-17', required: false })
  @IsString()
  @IsOptional()
  arrivalDate?: string;

  @ApiProperty({ example: '14:30', required: false })
  @IsString()
  @IsOptional()
  arrivalTime?: string;

  @ApiProperty({ example: 'AI 123 Delhi-Bhubaneswar', required: false })
  @IsString()
  @IsOptional()
  flightDetails?: string;

  @ApiProperty({ example: 'Veg', description: 'Veg | Non-Veg | Jain | Other', required: false })
  @IsString()
  @IsOptional()
  dietary?: string;

  @ApiProperty({
    example: ['jagannath', 'chilika'],
    description: 'Selected pre-tour IDs',
    required: false,
    default: [],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  preTours?: string[];

  @ApiProperty({ example: 43000, description: 'Total calculated amount', required: false })
  @IsNumber()
  @IsOptional()
  totalAmount?: number;
}