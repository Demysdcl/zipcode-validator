import { Test, TestingModule } from '@nestjs/testing'
import { AppService, OutputValidation } from '../app.service'
import { FormDataDTO } from '../FormDataDTO'

describe('AppService', () => {
  let appService: AppService

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppService],
      providers: [AppService],
    }).compile()

    appService = app.get<AppService>(AppService)
  })

  describe('createOutputByRole', () => {
    it('should fill incompatibilities with "Disabled shipping"', () => {
      const role = {
        name: 'Retirada em loja agendada',
        active: false,
        min_price_in_cents: 1,
        range_postcode_valid: ['00000000', '99999999'],
      }
      const data = { orderPrice: 3000, zipcode: '03108010' } as FormDataDTO

      const expected = {
        method: 'Retirada em loja agendada',
        valid: false,
        incompatibilities: ['Disabled shipping'],
      } as OutputValidation

      const result = appService.createOutputByRole(role, data)

      expect(result).toStrictEqual(expected)
      expect(result.valid).toBeFalsy()
      expect(result.incompatibilities.length).toBe(1)
      expect(result.incompatibilities[0]).toBe('Disabled shipping')
    })

    it('should fill incompatibilities with "Minimum price not reached for this method"', () => {
      const role = {
        name: 'Entrega normal SP (frete grátis)',
        active: true,
        min_price_in_cents: 10000,
        range_postcode_valid: ['01000000', '19999999'],
      }

      const data = { orderPrice: 3000, zipcode: '03108010' } as FormDataDTO

      const expected = {
        method: 'Entrega normal SP (frete grátis)',
        valid: false,
        incompatibilities: ['Minimum price not reached for this method'],
      } as OutputValidation

      const result = appService.createOutputByRole(role, data)

      expect(result).toStrictEqual(expected)
      expect(result.valid).toBeFalsy()
      expect(result.incompatibilities.length).toBe(1)
      expect(result.incompatibilities[0]).toBe(
        'Minimum price not reached for this method',
      )
    })

    it('should fill incompatibilities with "Zip code outside the delivery area for this method"', () => {
      const role = {
        name: 'Entrega normal RJ',
        active: true,
        min_price_in_cents: 4500,
        range_postcode_valid: ['20000000', '26600999'],
      }

      const data = { orderPrice: 4800, zipcode: '03108010' } as FormDataDTO

      const expected = {
        method: 'Entrega normal RJ',
        valid: false,
        incompatibilities: [
          'Zip code outside the delivery area for this method',
        ],
      } as OutputValidation

      const result = appService.createOutputByRole(role, data)

      expect(result).toStrictEqual(expected)
      expect(result.valid).toBeFalsy()
      expect(result.incompatibilities.length).toBe(1)
      expect(result.incompatibilities[0]).toBe(
        'Zip code outside the delivery area for this method',
      )
    })

    it('should fill incompatibilities with all error', () => {
      const role = {
        name: 'Entrega normal RJ',
        active: false,
        min_price_in_cents: 4500,
        range_postcode_valid: ['20000', '26600'],
      }

      const data = { orderPrice: 3000, zipcode: '03108010' } as FormDataDTO

      const expected = {
        method: 'Entrega normal RJ',
        valid: false,
        incompatibilities: [
          'Disabled shipping',
          'Minimum price not reached for this method',
          'Zip code outside the delivery area for this method',
        ],
      } as OutputValidation

      const result = appService.createOutputByRole(role, data)

      expect(result).toStrictEqual(expected)
      expect(result.valid).toBeFalsy()
      expect(result.incompatibilities.length).toBe(3)
      expect(result.incompatibilities[0]).toBe('Disabled shipping')
      expect(result.incompatibilities[1]).toBe(
        'Minimum price not reached for this method',
      )
      expect(result.incompatibilities[2]).toBe(
        'Zip code outside the delivery area for this method',
      )
    })
  })

  describe('validateZipCode', () => {
    it('should match process with snapshot', () => {
      const roles = [
        {
          name: 'Entrega normal SP',
          active: true,
          min_price_in_cents: 1,
          range_postcode_valid: ['01000000', '19999999'],
        },
        {
          name: 'Entrega normal SP (frete grátis)',
          active: true,
          min_price_in_cents: 10000,
          range_postcode_valid: ['01000000', '19999999'],
        },
        {
          name: 'Entrega normal RJ',
          active: true,
          min_price_in_cents: 4500,
          range_postcode_valid: ['20000000', '26600999'],
        },
        {
          name: 'Entrega normal RJ (expressa)',
          active: true,
          min_price_in_cents: 29900,
          range_postcode_valid: ['20000000', '26600999'],
        },
        {
          name: 'Entrega normal BR',
          active: true,
          min_price_in_cents: 5000,
          range_postcode_valid: ['00000000', '99999999'],
        },
        {
          name: 'Entrega normal agendada SP',
          active: true,
          min_price_in_cents: 10000,
          range_postcode_valid: ['01000000', '19999999'],
        },
        {
          name: 'Retirada em loja',
          active: true,
          min_price_in_cents: 1,
          range_postcode_valid: ['00000000', '99999999'],
        },
        {
          name: 'Retirada em loja agendada',
          active: false,
          min_price_in_cents: 1,
          range_postcode_valid: ['00000000', '99999999'],
        },
      ]

      console.log(appService)

      const result = appService.parseRoles(roles, {
        orderPrice: 3000,
        zipcode: '03108010',
      })
      expect(result).toMatchSnapshot()
    })
  })
})
