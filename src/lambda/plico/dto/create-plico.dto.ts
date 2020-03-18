import {
  IsString,
  IsNotEmpty,
  MinLength,
  ValidateNested,
  IsArray,
  IsObject
} from 'class-validator';
import { Type } from 'class-transformer';
import { PlicoSection } from '../models/plico-section.model';

export class CreatePlicoDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => PlicoSection)
  sections: PlicoSection[];
}
