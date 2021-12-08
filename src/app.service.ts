import { Injectable } from '@nestjs/common'
import { FormDataDTO } from './FormDataDTO'
import { Role } from './Role'

export type OutputValidation = {
  method: string
  valid: boolean
  incompatibilities: string[]
}

@Injectable()
export class AppService {
  validateZipCode(
    roles: Express.Multer.File,
    body: FormDataDTO,
  ): OutputValidation[] {
    const validationRoles = JSON.parse(roles.buffer.toString('utf-8')) as Role[]
    return this.parseRoles(validationRoles, body)
  }

  parseRoles(roles: Role[], body: FormDataDTO): OutputValidation[] {
    return roles.map((role) => this.createOutputByRole(role, body))
  }

  createOutputByRole(
    role: Role,
    { orderPrice, zipcode }: FormDataDTO,
  ): OutputValidation {
    const incompatibilities = []

    if (!role.active) incompatibilities.push('Disabled shipping')

    if (orderPrice < role.min_price_in_cents)
      incompatibilities.push('Minimum price not reached for this method')

    const [minCode, maxCode] = role.range_postcode_valid
    const numberCode = Number(zipcode)

    if (numberCode < Number(minCode) || numberCode > Number(maxCode)) {
      incompatibilities.push(
        'Zip code outside the delivery area for this method',
      )
    }

    return {
      method: role.name,
      valid: !incompatibilities.length,
      incompatibilities,
    } as OutputValidation
  }
}
