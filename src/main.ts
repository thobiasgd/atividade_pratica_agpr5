import { NestFactory } from '@nestjs/core';
import { EnvService } from './infra/env/env.service';
import { AppModule } from './infra/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(EnvService);
  const port = configService.get('PORT');

  const config = new DocumentBuilder()
    .setTitle('FastFeet API')
    .setDescription('An API for a delivery company.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(port);
}
bootstrap();
