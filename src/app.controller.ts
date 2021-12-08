import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes } from '@nestjs/swagger'
import { AppService } from './app.service'
import { FormDataDTO } from './FormDataDTO'

@Controller('zipcodeValidator')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        zipcode: { type: 'string' },
        orderPrice: { type: 'integer' },
        roles: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('validate')
  @UseInterceptors(FileInterceptor('roles'))
  validateZipCode(
    @UploadedFile() roles: Express.Multer.File,
    @Body() body: FormDataDTO,
  ): any {
    return this.appService.validateZipCode(roles, body)
  }
}
