
/*import { CreatePlicoDTO } from './dto/create-plico.dto';
import { CanCreatePlicoGuard } from './guards/can-create-plico.guard';
import { PlicoService } from './plico.service';
import { User } from '../firebase/user/user.model';
import { Plico } from './models/plico.model';
import { CreateInviteDTO } from './dto/create-invite-dto';
import { JoinPlicoDTO } from './dto/join-plico-dto';
import { UpdatePlicoDTO } from './dto/update-plico.dto';
import { IsPlicoUserGuard } from './guards/is-plico-user.guard';
import { CanUploadFileGuard } from './guards/can-upload-file.guard';
import { CanReadFilesGuard } from './guards/can-read-files.guard';
*/
/*
export class PlicoController {
  constructor(private plicoService: PlicoService) {}

  @Delete('/:id')
  @UseGuards(IsPlicoOwnerGuard)
  deletePlico(
    @Param('id') id: string,
    @GetPlico() plico: Plico,
    @GetUser() user: User
  ) {
    return this.plicoService.removePlico(plico.id, plico, user.uid);
  }

  @Post('/:id/invites')
  @Requires('user.data')
  @UseGuards(IsPlicoOwnerGuard)
  @UsePipes(ValidationPipe)
  invitePlicoUser(
    @Param('id') id: string,
    @Body() createInviteDTO: CreateInviteDTO,
    @GetUser() user: User,
    @GetPlico() plico: Plico
  ) {
    return this.plicoService.inviteUser(plico, user, createInviteDTO);
  }

  @Delete('/:id/invites/:email')
  @Requires('user.data')
  @UseGuards(IsPlicoOwnerGuard)
  @UsePipes(ValidationPipe)
  deletePlicoInvite(
    @Param('id') id: string,
    @Param('email') email: string,
    @GetPlico() plico: Plico
  ) {
    return this.plicoService.deleteInvite(plico, email);
  }

  @Delete('/:id/users/:email')
  @Requires('user.data')
  @UseGuards(IsPlicoOwnerGuard)
  @UsePipes(ValidationPipe)
  deletePlicoUser(
    @Param('id') id: string,
    @Param('email') email: string,
    @GetPlico() plico: Plico
  ) {
    return this.plicoService.removeUserFromPlico(plico, email);
  }

  @Patch('/:id')
  @Requires('user.data')
  @UseGuards(IsPlicoOwnerGuard)
  updatePlico(
    @Param('id') id: string,
    @Body() updatePlicoDTO: UpdatePlicoDTO,
    @GetUser() user: User
  ) {
    return this.plicoService.updatePlico(id, updatePlicoDTO, user);
  }

  @Post('/join')
  @Requires('user.data') // Required to lazy load users
  joinPlico(@Body() joinPlicoDTO: JoinPlicoDTO, @GetUser() user: User) {
    return this.plicoService.joinPlico(joinPlicoDTO, user);
  }

  @Post('/:id/files')
  @UseGuards(CanUploadFileGuard)
  async uploadFiles(@GetPlico() plico: Plico, @GetFiles() files) {
    return this.plicoService.getFilesUploadLinks(plico, files);
  }

  @Get('/:id/files')
  @UseGuards(CanReadFilesGuard)
  async getFilesLinks(@GetPlico() plico: Plico, @GetFiles() files: string[]) {
    return await this.plicoService.getFilesReadLinks(plico, files);
  }

}
*/