import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';

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

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
