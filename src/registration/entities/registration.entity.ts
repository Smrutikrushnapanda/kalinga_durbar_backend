import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AccompanyingPerson } from './accompanying-person.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum RegistrationType {
  SINGLE = 'single',
  SINGLE_TWIN = 'single_twin',
  COUPLE = 'couple',
  TANGENT_TWIN = 'tangent_twin',
}

export enum DietaryPreference {
  VEG = 'Veg',
  NON_VEG = 'Non-Veg',
  JAIN = 'Jain',
  OTHER = 'Other',
}

export enum RegistrationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

@Entity('registrations')
export class Registration {
  @ApiProperty({ example: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // ── Basic Info ────────────────────────────────────────────────────────────

  @ApiProperty({ example: 'John Doe' })
  @Column({ name: 'full_name' })
  fullName!: string;

  @ApiProperty({ example: '+91 9876543210' })
  @Column({ type: 'varchar', length: 20 })
  mobile!: string;

  @ApiProperty({ example: 'john@example.com' })
  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @ApiProperty({
    example: '123456789012',
    description: '12-digit Aadhaar number',
  })
  @Column({ name: 'aadhar', type: 'varchar', length: 12, nullable: true })
  aadhar!: string;

  @ApiProperty({ example: '41 Club Bhubaneswar' })
  @Column({ name: 'organization', type: 'varchar', length: 255 })
  organization!: string;

  @ApiProperty({ example: 'Bhubaneswar' })
  @Column({ type: 'varchar', length: 100 })
  city!: string;

  @ApiProperty({ example: 'Odisha' })
  @Column({ type: 'varchar', length: 100 })
  state!: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @Column({ type: 'varchar', length: 20 })
  gender!: string;

  // ── Event Info ────────────────────────────────────────────────────────────

  @ApiProperty({ enum: RegistrationType, example: RegistrationType.SINGLE })
  @Column({ name: 'registration_type', type: 'varchar', length: 50 })
  registrationType!: string;

  @ApiProperty({ example: 2, description: 'Number of accompanying persons' })
  @Column({ name: 'accompanying_persons_count', default: 0 })
  accompanyingPersonsCount!: number;

  @ApiProperty({ example: false })
  @Column({ name: 'airport_pickup', default: false })
  airportPickup!: boolean;

  @ApiProperty({ example: '2026-09-17', required: false })
  @Column({ name: 'arrival_date', type: 'varchar', length: 20, nullable: true })
  arrivalDate?: string;

  @ApiProperty({ example: '14:30', required: false })
  @Column({ name: 'arrival_time', type: 'varchar', length: 10, nullable: true })
  arrivalTime?: string;

  @ApiProperty({ example: 'AI 123 Delhi-Bhubaneswar', required: false })
  @Column({
    name: 'flight_details',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  flightDetails?: string;

  @ApiProperty({ enum: DietaryPreference, example: DietaryPreference.VEG })
  @Column({ name: 'dietary', type: 'varchar', length: 50, nullable: true })
  dietary?: string;

  @ApiProperty({
    example: ['jagannath', 'chilika'],
    description: 'Selected pre-tour IDs',
  })
  @Column({ name: 'pre_tours', type: 'jsonb', default: () => "'[]'" })
  preTours!: string[];

  // ── Payment / Status ──────────────────────────────────────────────────────

  @ApiProperty({ example: 43000 })
  @Column({
    name: 'total_amount',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  totalAmount!: number;

  @ApiProperty({
    enum: RegistrationStatus,
    example: RegistrationStatus.PENDING,
  })
  @Column({
    name: 'status',
    type: 'varchar',
    length: 20,
    default: RegistrationStatus.PENDING,
  })
  status!: string;

  // ── QR ────────────────────────────────────────────────────────────────────

  @ApiProperty({
    example: 'KD-2026-ABCD1234',
    description: 'Unique QR code token',
  })
  @Column({
    name: 'qr_token',
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: true,
  })
  qrToken?: string;

  // ── Relations ─────────────────────────────────────────────────────────────

  @OneToMany(() => AccompanyingPerson, (p) => p.registration, {
    cascade: true,
    eager: true,
  })
  accompanyingPersons!: AccompanyingPerson[];

  // ── Timestamps ────────────────────────────────────────────────────────────

  @CreateDateColumn({ name: 'created_on' })
  createdOn!: Date;

  @UpdateDateColumn({ name: 'updated_on' })
  updatedOn!: Date;
}
