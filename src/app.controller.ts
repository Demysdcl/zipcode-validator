import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AppService } from './app.service'
import { FormDataDTO } from './FormDataDTO'

@Controller('zipcodeValidator')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('validate')
  @UseInterceptors(FileInterceptor('roles'))
  validateZipCode(
    @UploadedFile() roles: Express.Multer.File,
    @Body() body: FormDataDTO,
  ): any {
    return this.appService.validateZipCode(roles, body)
  }
}
