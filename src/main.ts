import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.enableCors({
    // origin: 'http://localhost:3000',
    origin: 'https://todo.eziio.site',
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3305);
}
bootstrap();
