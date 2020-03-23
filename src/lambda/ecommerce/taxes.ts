//@ts-ignore
import SalesTax from 'sales-tax';
import {
  SaleState,
  AreaType,
  SaleStateWithTotal
} from './interfaces/sale-state';

SalesTax.setTaxOriginCountry('IT');

export async function getTaxState(
  country: string,
  state?: string,
  taxNumber?: string
) {
  const res: SaleState = await SalesTax.getSalesTax(
    country,
    state || '',
    taxNumber || ''
  );

  if (res.area === AreaType.WORLDWIDE) {
    res.rate = 0.0;
  }

  return res;
}

export async function getAmountWithTaxState(
  amount: number | {regional: number, worldwide: number},
  country: string,
  state?: string,
  taxNumber?: string
): Promise<SaleStateWithTotal> {
  const taxState = await getTaxState(country, state, taxNumber);
  if (typeof amount == "number") {
    return {
      ...taxState,
      total: (1.0 + taxState.rate) * amount
    };
  } else {
    const isRegional = taxState.area !== AreaType.WORLDWIDE;
    const subtotal = isRegional ? amount.regional : amount.worldwide;
    return {
      ...taxState,
      total: (1.0 + taxState.rate) * subtotal
    };
  }
  
}
