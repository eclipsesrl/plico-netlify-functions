import { FunctionHandler } from './utils/function-handler';
import { OkResponse } from './utils/event-response';
import { getAmountWithTaxState } from './ecommerce/taxes';

export const handler: FunctionHandler = async (event, context) => {
  const b = JSON.parse(event.body);
  // TODO: add checks and validations and switch prices

  const res = await getAmountWithTaxState(100, b.country, b.state, b.taxNumber);

  return OkResponse(res);
};

