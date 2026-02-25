import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Registration } from './registration.entity';

@Entity('accompanying_persons')
export class AccompanyingPerson {
  @ApiProperty({ example: 'uuid', description: 'Unique ID' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: 'Jane Doe', description: 'Full name as per Aadhaar' })
  @Column({ name: 'full_name' })
  fullName!: string;

  @ApiProperty({ example: '1234 5678 9012', description: 'Aadhaar number' })
  @Column({ name: 'aadhar', type: 'varchar', length: 20, nullable: true })
  aadhar?: string;

  @ApiProperty({ example: '+91 9876543210', description: 'Phone number' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @ApiProperty({ example: 'male', description: 'Gender' })
  @Column({ type: 'varchar', length: 20 })
  gender!: string;

  @ManyToOne(() => Registration, (reg) => reg.accompanyingPersons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'registration_id' })
  registration!: Registration;

  @Column({ name: 'registration_id' })
  registrationId!: string;

  @CreateDateColumn({ name: 'created_on' })
  createdOn!: Date;
}