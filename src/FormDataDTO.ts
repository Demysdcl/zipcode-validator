import { IsInt, IsNotEmpty } from 'class-validator'
export class FormDataDTO {
  @IsNotEmpty()
  zipcode: string

  @IsInt()
  orderPrice: number
}
