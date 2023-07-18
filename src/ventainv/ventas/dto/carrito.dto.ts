import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CarritoFormDataDto {
  carrito: string;
}

export class carritoDto {
  @IsNotEmpty()
  @IsString()
  idUsuario: string;

  @IsNotEmpty()
  @IsNumber()
  idProducto: number;

 @IsNotEmpty()
  @IsNumber()
  precioUnitario: number;

  @IsNotEmpty()
  @IsNumber()
  precioTotal: number;

  @IsNotEmpty()
  @IsNumber()
  cantidad: number;

  @IsBoolean()
  disponible: boolean;

  @IsBoolean()
  status: boolean;
}
