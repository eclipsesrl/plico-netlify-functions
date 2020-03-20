import { transformAndValidate } from 'class-transformer-validator';
import { classToPlain } from 'class-transformer';

export async function validateAndTransformBack<T>(c: any, data: any): Promise<T> {
  const createPlicoDTO = await transformAndValidate(c, data);

  let dto = Array.isArray(createPlicoDTO)
    ? classToPlain(createPlicoDTO[0])
    : classToPlain(createPlicoDTO);

  return dto as T;
}
