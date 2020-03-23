import { FunctionEvent } from './event-type';
import { FunctionEventResponse } from './event-response';

export type FunctionHandler = (
  event: FunctionEvent,
  context: any
) => Promise<FunctionEventResponse>;

export type FunctionHandlerCallback = (
  event: FunctionEvent,
  context: any,
  callback: Function
) => void