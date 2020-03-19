import { FunctionHandler } from './utils/function-handler';
import { OkResponse } from './utils/event-response';
import { getAmountWithTaxState } from './ecommerce/taxes';

export const handler: FunctionHandler = async (event, context) => {
  const b = JSON.parse(event.body);

  const res = await getAmountWithTaxState(100, b.country, b.state, b.taxNumber);

  return OkResponse(res);
};
