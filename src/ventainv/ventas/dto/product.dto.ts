import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductFormDataDto {
  producto: string;
}

export class productDto {
  @IsNotEmpty()
  @IsString()
  nombreProducto: string;

  @IsNotEmpty()
  @IsString()
  descripcionProducto: string;

  @IsNotEmpty()
  @IsNumber()
  cantidadStock: number;

  @IsNotEmpty()
  @IsNumber()
  precio: number;

  @IsString()
  imagenProducto: string;

  @IsNotEmpty()
  @IsNumber()
  idCategoria: number;

  @IsNotEmpty()
  @IsString()
  categoria: string;

  @IsNotEmpty()
  @IsString()
  idVendedor: string;

  @IsNotEmpty()
  @IsString()
  nombreVendedor: string;

  @IsBoolean()
  status: boolean;
}
