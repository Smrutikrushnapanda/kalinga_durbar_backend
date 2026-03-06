import { IsString, IsOptional, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AccompanyingPersonDto {
  @ApiProperty({ example: 'Jane Doe', description: 'Full name as per Aadhaar' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({ example: '1234 5678 9012', required: false })
  @IsString()
  @IsOptional()
  @Matches(/^[0-9]{12}$/)
  aadhar?: string;

  @ApiProperty({ example: '+91 9876543210', required: false })
  @IsString()
  @IsOptional()
  @Matches(/^[0-9]{10}$/)
  phone?: string;

  @ApiProperty({ example: 'male', required: false })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiProperty({ example: 'spouse', required: false })
  @IsString()
  @IsOptional()
  relation?: string;
}
