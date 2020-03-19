import { FunctionEvent } from './event-type';
import { FunctionEventResponse } from './event-response';

export type FunctionHandler = (
  event: FunctionEvent,
  context: any
) => Promise<FunctionEventResponse>;
