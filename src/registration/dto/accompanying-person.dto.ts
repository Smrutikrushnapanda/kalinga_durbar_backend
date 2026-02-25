import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AccompanyingPersonDto {
  @ApiProperty({ example: 'Jane Doe', description: 'Full name as per Aadhaar' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({ example: '1234 5678 9012', required: false })
  @IsString()
  @IsOptional()
  aadhar?: string;

  @ApiProperty({ example: '+91 9876543210', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'male' })
  @IsString()
  @IsNotEmpty()
  gender!: string;
}