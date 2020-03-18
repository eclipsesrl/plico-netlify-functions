import { IsEmail, IsIn } from 'class-validator';

export class CreateInviteDTO {
  @IsEmail()
  email: string;
  @IsIn(['collaborator', 'client'])
  type: 'collaborator' | 'client';
}
