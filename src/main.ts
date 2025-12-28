import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Включаем CORS для фронтенда
  app.enableCors();

  // Включаем валидацию
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

  // ЗАПУСК НА ПОРТУ 3000
  await app.listen(3000);
  console.log(' SERVER IS RUNNING ON: http://localhost:3000');
}
bootstrap();
