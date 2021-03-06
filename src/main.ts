import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Zipcode validator')
    .setDescription(
      'Zipcode validator API to verify the zipcode and price from clients` orders',
    )
    .setVersion('1.0')
    .addTag('zipcodeValidator')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000)
}
bootstrap()
