import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ── CORS ──────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: '*', 
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ── Global validation pipe ────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Swagger ───────────────────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('Kalinga Durbar – NAGM 2026 API')
    .setDescription(
      'Event registration API for NAGM 2026, Bhubaneswar. ' +
      '18th–20th September · 41 India · Association of 41 Clubs · Tangent India',
    )
    .setVersion('1.0')
    .addTag('registrations', 'Event registration endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: 'Kalinga Durbar API Docs',
  });

  // ── Start ─────────────────────────────────────────────────────────────────
  const port = process.env.PORT ?? 8000;
  await app.listen(port);

  console.log(`\n🚀 Server running on http://localhost:${port}`);
  console.log(`📖 Swagger docs: http://localhost:${port}/api/docs\n`);
}

bootstrap();