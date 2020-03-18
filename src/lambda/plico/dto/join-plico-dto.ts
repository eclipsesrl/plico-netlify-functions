import { IsString } from 'class-validator';

export class JoinPlicoDTO {
  @IsString()
  code: string;
}
