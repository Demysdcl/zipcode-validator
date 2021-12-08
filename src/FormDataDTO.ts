import { IsNotEmpty } from 'class-validator'
export class FormDataDTO {
  @IsNotEmpty()
  zipcode: string

  orderPrice: number
}
