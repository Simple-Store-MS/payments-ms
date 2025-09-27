import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreatePaymentSessionDto {
  @IsString()
  public currency: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PaymentSessionItemDto)
  public items: PaymentSessionItemDto[];

  @IsString()
  public orderId: string;
}

export class PaymentSessionItemDto {
  @IsString()
  public name: string;

  @IsNumber()
  @IsPositive()
  public price: number;

  @IsPositive()
  public quantity: number;
}
