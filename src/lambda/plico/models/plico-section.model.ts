import { IsString, Validate, IsBoolean, IsIn, IsOptional, MinLength } from 'class-validator';
import { PlicoSectionTypes, AllowedPlicoSectionTypes } from './plico-sections-type.enum';
import { AllowedPlicoSectionStatus } from './plico-section-status.enum';

export class PlicoSection {
  @IsOptional()
  id: string;

  @IsString()
  @MinLength(3)
  name: string;

  @IsIn(AllowedPlicoSectionTypes)
  type: PlicoSectionTypes;

  @IsIn(AllowedPlicoSectionStatus)
  status: string;
}
