/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
// import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { TransformInterceptor2 } from './common/interceptors/transform2.interceptor';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor2());
  app.enableCors({
    // origin: 'http://localhost:3000',
    origin: 'https://todo.eziio.site',
    credentials: true,
  });
  app.use(cookieParser());
  // await app.listen(process.env.PORT ?? 3000);
  await app.listen(process.env.PORT ?? 3305);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
