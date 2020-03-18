import { PlicoService } from './plico.service';
import { UserService } from '../firebase/user/user.service';
import { AuthGuard } from '../firebase/auth.guard';
import { FunctionEvent } from '../utils/event-type';
import {
  BadRequestException,
  UnauthorizedException
} from '../utils/exceptions';
import { auth } from 'firebase-admin';
import { transformAndValidate } from 'class-transformer-validator';
import { CreatePlicoDTO } from './dto/create-plico.dto';
import { classToPlain } from 'class-transformer';
import { OkResponse } from '../utils/event-response';
import { isPlicoOwnerGuard } from './guards/is-plico-owner.guard';
import { User } from '../firebase/user/user.model';
import { UpdatePlicoDTO } from './dto/update-plico.dto';
import { CreateInviteDTO } from './dto/create-invite-dto';
import { JoinPlicoDTO } from './dto/join-plico-dto';
import { canReadFilesGuard } from './guards/can-read-files.guard';
import { canUploadFileGuard } from './guards/can-upload-file.guard';

export default class PlicoHandler {
  plicoService: PlicoService;
  userService: UserService;
  auth: AuthGuard;

  constructor() {
    this.plicoService = new PlicoService();

    this.userService = new UserService();

    this.auth = new AuthGuard(this.userService);
  }

  async handleCreatePlico(request: FunctionEvent) {
    if (request.httpMethod !== 'POST') {
      return BadRequestException('INVALID_HTTP_METHOD_USED');
    }

    const is = await this.auth.isAuthenticated(request, true);

    if (!is) {
      return UnauthorizedException('NOT_LOGGED_IN');
    }

    const body = JSON.parse(request.body);

    try {
      const createPlicoDTO = await transformAndValidate(CreatePlicoDTO, body);
      const can = await this.plicoService.canCreatePlico(request.user.data);
      let dto = Array.isArray(createPlicoDTO)
        ? classToPlain(createPlicoDTO[0])
        : classToPlain(createPlicoDTO);
      if (can) {
        const plico = await this.plicoService.createPlico(
          dto as CreatePlicoDTO,
          request.user
        );
        return OkResponse(plico);
      } else {
        return UnauthorizedException(`LIMIT_PLAN_REACHED`);
      }
    } catch (e) {
      console.error(e);
      return BadRequestException(JSON.stringify(e));
    }
  }

  async handleDeletePlico(request: FunctionEvent, id: string) {
    if (request.httpMethod !== 'DELETE') {
      return BadRequestException('INVALID_HTTP_METHOD_USED');
    }
    const is = await this.auth.isAuthenticated(request);
    if (!is) {
      return UnauthorizedException('NOT_LOGGED_IN');
    }

    const owner = await isPlicoOwnerGuard(this.plicoService, request, id);
    if (!owner) {
      return UnauthorizedException('NOT_OWNER');
    }
    return await this.plicoService.removePlico(
      id,
      request.plico,
      (request.user as User).uid
    );
  }

  async handleUpdatePlico(request: FunctionEvent, id: string) {
    if (request.httpMethod !== 'PUT') {
      return BadRequestException('INVALID_HTTP_METHOD_USED');
    }
    const is = await this.auth.isAuthenticated(request, true);
    if (!is) {
      return UnauthorizedException('NOT_LOGGED_IN');
    }
    const owner = await isPlicoOwnerGuard(this.plicoService, request, id);
    if (!owner) {
      return UnauthorizedException('NOT_OWNER');
    }
    try {
      const updatePlicoDto = await transformAndValidate(
        UpdatePlicoDTO,
        request.body
      );
      let dto = Array.isArray(updatePlicoDto)
        ? classToPlain(updatePlicoDto[0])
        : classToPlain(updatePlicoDto);
      return await this.plicoService.updatePlico(id, dto, request.user);
    } catch (e) {
      console.error(e);
      return BadRequestException(JSON.stringify(e));
    }
  }

  async handleInviteUsers(request: FunctionEvent, id: string) {
    if (request.httpMethod !== 'POST') {
      return BadRequestException('INVALID_HTTP_METHOD_USED');
    }
    const is = await this.auth.isAuthenticated(request, true);
    if (!is) {
      return UnauthorizedException('NOT_LOGGED_IN');
    }
    const owner = await isPlicoOwnerGuard(this.plicoService, request, id);
    if (!owner) {
      return UnauthorizedException('NOT_OWNER');
    }

    try {
      const invitePlicoDTO = await transformAndValidate(
        CreateInviteDTO,
        request.body
      );
      let dto: any = Array.isArray(invitePlicoDTO)
        ? classToPlain(invitePlicoDTO[0])
        : classToPlain(invitePlicoDTO);
      return await this.plicoService.inviteUser(
        request.plico,
        request.user,
        dto
      );
    } catch (e) {
      console.error(e);
      return BadRequestException(JSON.stringify(e));
    }
  }

  async handleDeleteInvite(request: FunctionEvent, id: string, email: string) {
    if (request.httpMethod !== 'DELETE') {
      return BadRequestException('INVALID_HTTP_METHOD_USED');
    }
    const is = await this.auth.isAuthenticated(request, true);
    if (!is) {
      return UnauthorizedException('NOT_LOGGED_IN');
    }
    const owner = await isPlicoOwnerGuard(this.plicoService, request, id);
    if (!owner) {
      return UnauthorizedException('NOT_OWNER');
    }

    return await this.plicoService.deleteInvite(request.plico, email);
  }

  async handleJoin(request: FunctionEvent) {
    if (request.httpMethod !== 'POST') {
      return BadRequestException('INVALID_HTTP_METHOD_USED');
    }
    const is = await this.auth.isAuthenticated(request, true);
    if (!is) {
      return UnauthorizedException('NOT_LOGGED_IN');
    }
    try {
      const dtoClass = await transformAndValidate(JoinPlicoDTO, request.body);
      let dto: any = Array.isArray(dtoClass)
        ? classToPlain(dtoClass[0])
        : classToPlain(dtoClass);
      return await this.plicoService.joinPlico(dto, request.user);
    } catch (e) {
      console.error(e);
      return BadRequestException(JSON.stringify(e));
    }
  }

  async handleDeleteUserFromPlico(
    request: FunctionEvent,
    id: string,
    email: string
  ) {
    if (request.httpMethod !== 'DELETE') {
      return BadRequestException('INVALID_HTTP_METHOD_USED');
    }
    const is = await this.auth.isAuthenticated(request, true);
    if (!is) {
      return UnauthorizedException('NOT_LOGGED_IN');
    }
    const owner = await isPlicoOwnerGuard(this.plicoService, request, id);
    if (!owner) {
      return UnauthorizedException('NOT_OWNER');
    }

    return this.plicoService.removeUserFromPlico(request.plico, email);
  }

  async handleGetFilesLinks(request: FunctionEvent, id: string) {
    if (request.httpMethod !== 'GET') {
      return BadRequestException('INVALID_HTTP_METHOD_USED');
    }
    const is = await this.auth.isAuthenticated(request, true);
    if (!is) {
      return UnauthorizedException('NOT_LOGGED_IN');
    }
    try {
      const can = await canReadFilesGuard(this.plicoService, request, id);
      if (!can) {
        return UnauthorizedException('CANT_READ_FILES');
      }
      return await this.plicoService.getFilesReadLinks(
        request.plico,
        request.files
      );
    } catch (e) {
      return e;
    }
  }

  async handleGetFilesUploadLinks(request: FunctionEvent, id: string) {
    if (request.httpMethod !== 'POST') {
      return BadRequestException('INVALID_HTTP_METHOD_USED');
    }
    const is = await this.auth.isAuthenticated(request, true);
    if (!is) {
      return UnauthorizedException('NOT_LOGGED_IN');
    }
    try {
      const can = await canUploadFileGuard(this.plicoService, request, id);
      console.log(can);
      if (!can) {
        return UnauthorizedException('CANT_UPLOAD_FILES');
      }
      return await this.plicoService.getFilesUploadLinks(
        request.plico,
        request.files
      );
    } catch (e) {
      return e;
    }
  }
}
