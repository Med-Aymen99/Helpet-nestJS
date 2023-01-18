import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common/pipes';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({origin: true});
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );  
  await app.listen(process.env.APP_PORT);
}
bootstrap();
