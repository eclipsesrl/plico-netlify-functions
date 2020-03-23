import {
  IsString,
  IsOptional,
  IsISO31661Alpha2,
  IsIn
} from 'class-validator';

export class CalculateCheckoutDTO {
  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsISO31661Alpha2()
  country: string;

  @IsString()
  @IsOptional()
  state: string;

  @IsString()
  @IsIn(['pro', 'lite'])
  plan: string;

  @IsOptional()
  @IsString()
  tax_id: string;

}
