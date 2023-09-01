import {
  IsAlphanumeric,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class RegisterAuthDto {
  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  full_name: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  password: string;
}

export class RegisterVerifyAuthDto {
  @IsNumber()
  @IsOptional()
  verifycode: number;
}
