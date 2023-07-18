import { Module } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { productos } from './entities/producto.entity';
import { categories } from './entities/categoria.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { carrito_compras } from './entities/carritoCompras.entity';
import { ventas } from './entities/ventas.entity';
import { compras } from './entities/compras.entity';

@Module({
  imports: [
    CloudinaryModule,
    TypeOrmModule.forFeature([productos, categories, carrito_compras, compras, ventas]),
  ],
  controllers: [VentasController],
  providers: [VentasService],
})
export class VentasModule {}
