import { Injectable } from '@nestjs/common';
import { FormDataDTO } from './FormDataDTO';
import { Role } from './Role';

type OutputValidation = {
  method: string;
  valid: boolean;
  incompatibilities: string[];
};

@Injectable()
export class AppService {
  validateZipCode(roles: Express.Multer.File, body: FormDataDTO): any {
    const validationRoles = JSON.parse(
      roles.buffer.toString('utf-8'),
    ) as Role[];

    return validationRoles.map((role) => createOutputByRole(role, body));
  }
}
function createOutputByRole(
  role: Role,
  { orderPrice, zipCode }: FormDataDTO,
): OutputValidation {
  const incompatibilities = [];

  if (!role.active) incompatibilities.push('Disabled shipping');

  if (orderPrice < role.min_price_in_cents)
    incompatibilities.push('Minimum price not reached for this method');

  const [minCode, maxCode] = role.range_postcode_valid;
  const numberCode = Number(zipCode);

  if (numberCode < Number(minCode) || numberCode > Number(maxCode)) {
    incompatibilities.push(
      'Zip code outside the delivery area for this method',
    );
  }

  return {
    method: role.name,
    valid: !incompatibilities.length,
    incompatibilities,
  } as OutputValidation;
}
