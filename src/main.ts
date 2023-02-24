import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  let httpsOptions: { key: Buffer; cert: Buffer };

  if (process.env.NODE_ENV !== 'production') {
    httpsOptions = {
      key: fs.readFileSync(path.resolve(__dirname, '../ssl/private.key')),
      cert: fs.readFileSync(path.resolve(__dirname, '../ssl/certificate.crt')),
    };
  }

  const app = await NestFactory.create(AppModule, { httpsOptions });

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-doc', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
