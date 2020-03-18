import {
  IsString,
  IsNotEmpty,
  MinLength,
  ValidateNested,
  IsArray,
  IsObject,
  IsOptional
} from 'class-validator';
import { Type } from 'class-transformer';
import { PlicoSection } from '../models/plico-section.model';

export class UpdatePlicoDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => PlicoSection)
  sections?: PlicoSection[];
}
