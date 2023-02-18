import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(path.resolve(__dirname, '../ssl/private.key')),
    cert: fs.readFileSync(path.resolve(__dirname, '../ssl/certificate.crt')),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });

  await app.listen(3000);
}
bootstrap();
