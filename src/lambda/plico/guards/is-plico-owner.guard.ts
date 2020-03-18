import { PlicoService } from '../plico.service';

export async function isPlicoOwnerGuard(
  plicoService: PlicoService,
  request: any,
  id: string
): Promise<boolean> {
  const { user } = request;
  const plico = await plicoService.getPlicoData(id);

  if (plico.owner == user.uid) {
    request.plico = plico;
    return true;
  }

  return false;
}
