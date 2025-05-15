import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist: true}));
  app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
}); ///this allows the server to allows request from the frontend
  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
