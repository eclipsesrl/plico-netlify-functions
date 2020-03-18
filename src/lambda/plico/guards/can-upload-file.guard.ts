import { PlicoService } from '../plico.service';
import { PlicoSectionStatus } from '../models/plico-section-status.enum';
import {
  BadRequestException,
  UnauthorizedException
} from '../../utils/exceptions';
import { PlicoSection } from '../models/plico-section.model';

/**
 *
 * @param plicoService
 * @param request
 * @param id
 *
 * @throws BadRequestException
 */
export async function canUploadFileGuard(
  plicoService: PlicoService,
  request: any,
  id: string
): Promise<boolean> {
  const { user, body } = request;

  const { files } = JSON.parse(body);
  if (!files) {
    throw BadRequestException(`Missing required parameters files`);
  }
  let filesToCheck = Array.isArray(files) ? files : [files];

  const plico = await plicoService.getPlicoData(id);

  if (plico.owner == user.uid) {
    request.plico = plico;

    let filteredFiles = filesToCheck.filter(id => {
      return plico.sections.find((section: PlicoSection) => section.id == id);
    });

    request.files = filteredFiles;
    return true;
  }

  if (plico.client == user.email) {
    request.plico = plico;
    let filteredFiles = filesToCheck.filter(id => {
      return plico.sections.find(
        (section: PlicoSection) =>
          section.id == id && section.status == PlicoSectionStatus.PUBLIC
      );
    });

    request.files = filteredFiles;
    return true;
  }

  if (plico.collaborators.includes(user.email)) {
    request.plico = plico;
    let filteredFiles = filesToCheck.filter(id => {
      return plico.sections.find((section: PlicoSection) => (section.id = id));
    });

    request.files = filteredFiles;
    return true;
  }

  throw UnauthorizedException(`NOT_ALLOWED`);
}
