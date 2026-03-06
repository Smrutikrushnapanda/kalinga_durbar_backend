import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Registration } from './entities/registration.entity';
import { AccompanyingPerson } from './entities/accompanying-person.entity';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(Registration)
    private readonly registrationRepo: Repository<Registration>,

    @InjectRepository(AccompanyingPerson)
    private readonly personRepo: Repository<AccompanyingPerson>,
  ) {}

  // ── Helpers ───────────────────────────────────────────────────────────────

  private generateQrToken(): string {
    // Format: KD2026-<8 uppercase random chars>
    return `KD2026-${nanoid(8).toUpperCase()}`;
  }

  private async uniqueQrToken(): Promise<string> {
    let token: string;
    let exists: boolean;
    do {
      token = this.generateQrToken();
      exists = !!(await this.registrationRepo.findOne({
        where: { qrToken: token },
        select: ['id'],
      }));
    } while (exists);
    return token;
  }

  // ── CRUD ──────────────────────────────────────────────────────────────────

  async create(dto: CreateRegistrationDto): Promise<Registration> {
    // Prevent duplicate email registration
    const existing = await this.registrationRepo.findOne({
      where: { email: dto.email.toLowerCase().trim() },
    });
    if (existing) {
      throw new ConflictException(
        `A registration already exists for email: ${dto.email}`,
      );
    }

    const qrToken = await this.uniqueQrToken();

    const registration = this.registrationRepo.create({
      fullName: dto.fullName.trim(),
      mobile: dto.mobile.trim(),
      email: dto.email.toLowerCase().trim(),
      clubNumber: dto.clubNumber.trim(),
      areaNumber: dto.areaNumber.trim(),
      city: dto.city.trim(),
      state: dto.state.trim(),
      gender: dto.gender?.trim() || undefined,
      registrationType: dto.registrationType,
      accompanyingPersonsCount: dto.accompanyingPersonsCount ?? 0,
      airportPickup: dto.airportPickup ?? false,
      arrivalDate: dto.arrivalDate,
      arrivalTime: dto.arrivalTime,
      flightDetails: dto.flightDetails,
      dietary: dto.dietary,
      preTours: dto.preTours ?? [],
      totalAmount: dto.totalAmount ?? 0,
      status: 'pending',
      qrToken,
      accompanyingPersons: (dto.accompanyingPersons ?? []).map((p) =>
        this.personRepo.create(p),
      ),
    });

    return this.registrationRepo.save(registration);
  }

  async findAll(): Promise<Registration[]> {
    return this.registrationRepo.find({
      relations: ['accompanyingPersons'],
      order: { createdOn: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Registration> {
    const reg = await this.registrationRepo.findOne({
      where: { id },
      relations: ['accompanyingPersons'],
    });
    if (!reg) throw new NotFoundException(`Registration #${id} not found`);
    return reg;
  }

  async findByQrToken(qrToken: string): Promise<Registration> {
    const reg = await this.registrationRepo.findOne({
      where: { qrToken },
      relations: ['accompanyingPersons'],
    });
    if (!reg)
      throw new NotFoundException(`No registration found for QR: ${qrToken}`);
    return reg;
  }

  async findByEmail(email: string): Promise<Registration> {
    const reg = await this.registrationRepo.findOne({
      where: { email: email.toLowerCase().trim() },
      relations: ['accompanyingPersons'],
    });
    if (!reg)
      throw new NotFoundException(`No registration found for email: ${email}`);
    return reg;
  }

  async update(id: string, dto: UpdateRegistrationDto): Promise<Registration> {
    const reg = await this.findOne(id);
    Object.assign(reg, dto);
    return this.registrationRepo.save(reg);
  }

  async remove(id: string): Promise<void> {
    const reg = await this.findOne(id);
    await this.registrationRepo.remove(reg);
  }

  async getStats(): Promise<{
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    byRegistrationType: Record<string, number>;
    totalAccompanying: number;
  }> {
    const all = await this.registrationRepo.find();

    const byType: Record<string, number> = {};
    let totalAccompanying = 0;

    for (const r of all) {
      byType[r.registrationType] = (byType[r.registrationType] ?? 0) + 1;
      totalAccompanying += r.accompanyingPersonsCount;
    }

    return {
      total: all.length,
      confirmed: all.filter((r) => r.status === 'confirmed').length,
      pending: all.filter((r) => r.status === 'pending').length,
      cancelled: all.filter((r) => r.status === 'cancelled').length,
      byRegistrationType: byType,
      totalAccompanying,
    };
  }
}
