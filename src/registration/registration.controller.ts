import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { RegistrationService } from './registration.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { Registration } from './entities/registration.entity';

@ApiTags('registrations')
@Controller('registrations')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  // ── POST /registrations ──────────────────────────────────────────────────

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a new event registration' })
  @ApiBody({ type: CreateRegistrationDto })
  @ApiResponse({ status: 201, description: 'Registration created', type: Registration })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async create(@Body() dto: CreateRegistrationDto): Promise<Registration> {
    return this.registrationService.create(dto);
  }

  // ── GET /registrations ───────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'Get all registrations' })
  @ApiResponse({ status: 200, description: 'List of all registrations', type: [Registration] })
  async findAll(): Promise<Registration[]> {
    return this.registrationService.findAll();
  }

  // ── GET /registrations/stats ─────────────────────────────────────────────

  @Get('stats')
  @ApiOperation({ summary: 'Get registration statistics' })
  @ApiResponse({
    status: 200,
    description: 'Stats: total, confirmed, pending, by type, accompanying count',
  })
  async getStats() {
    return this.registrationService.getStats();
  }

  // ── GET /registrations/qr/:token ─────────────────────────────────────────

  @Get('qr/:token')
  @ApiOperation({ summary: 'Get registration by QR token' })
  @ApiParam({ name: 'token', description: 'QR token e.g. KD2026-ABCD1234' })
  @ApiResponse({ status: 200, description: 'Registration found', type: Registration })
  @ApiResponse({ status: 404, description: 'Not found' })
  async findByQr(@Param('token') token: string): Promise<Registration> {
    return this.registrationService.findByQrToken(token);
  }

  // ── GET /registrations/email/:email ──────────────────────────────────────

  @Get('email/:email')
  @ApiOperation({ summary: 'Get registration by email' })
  @ApiParam({ name: 'email', description: 'Registrant email' })
  @ApiResponse({ status: 200, description: 'Registration found', type: Registration })
  @ApiResponse({ status: 404, description: 'Not found' })
  async findByEmail(@Param('email') email: string): Promise<Registration> {
    return this.registrationService.findByEmail(email);
  }

  // ── GET /registrations/:id ───────────────────────────────────────────────

  @Get(':id')
  @ApiOperation({ summary: 'Get registration by ID' })
  @ApiParam({ name: 'id', description: 'UUID' })
  @ApiResponse({ status: 200, description: 'Registration found', type: Registration })
  @ApiResponse({ status: 404, description: 'Not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Registration> {
    return this.registrationService.findOne(id);
  }

  // ── PATCH /registrations/:id ─────────────────────────────────────────────

  @Patch(':id')
  @ApiOperation({ summary: 'Update a registration (e.g. confirm, cancel)' })
  @ApiParam({ name: 'id', description: 'UUID' })
  @ApiBody({ type: UpdateRegistrationDto })
  @ApiResponse({ status: 200, description: 'Updated', type: Registration })
  @ApiResponse({ status: 404, description: 'Not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRegistrationDto,
  ): Promise<Registration> {
    return this.registrationService.update(id, dto);
  }

  // ── DELETE /registrations/:id ────────────────────────────────────────────

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a registration' })
  @ApiParam({ name: 'id', description: 'UUID' })
  @ApiResponse({ status: 204, description: 'Deleted' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.registrationService.remove(id);
  }
}