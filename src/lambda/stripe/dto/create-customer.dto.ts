import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsObject,
  IsEmail,
  IsOptional,
  IsISO31661Alpha2,
  IsIn
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCustomerDTO {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  payment_method: string;

  @IsObject()
  @ValidateNested()
  @Type(() => AddressDTO)
  address: AddressDTO;

  @IsOptional()
  tax_id: string;

  @IsOptional()
  @IsString()
  codice_univoco: string;
}

export class AddressDTO {
  @IsString()
  line1: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsISO31661Alpha2()
  country: string;

  @IsString()
  @IsOptional()
  postal_code: string;

  @IsString()
  @IsOptional()
  state: string;
}
