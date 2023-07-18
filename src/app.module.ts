import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { productos } from './ventainv/ventas/entities/producto.entity';
import { VentasModule } from './ventainv/ventas/ventas.module';
import { categories } from './ventainv/ventas/entities/categoria.entity';
import { CloudinaryModule } from './ventainv/cloudinary/cloudinary.module';
import { carrito_compras } from './ventainv/ventas/entities/carritoCompras.entity';
import { compras } from './ventainv/ventas/entities/compras.entity';
import { ventas } from './ventainv/ventas/entities/ventas.entity';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(
      'mongodb+srv://Adrian1jr:Guerrero2@nest.jfdelym.mongodb.net/test',
    ),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db-mysql-do-user-12617584-0.b.db.ondigitalocean.com',
      port: 25060,
      username: 'doadmin',
      password: 'AVNS_FSGhSClXJBqvo5C39eJ',
      database: 'defaultdb',
      entities: [productos, categories, carrito_compras, compras, ventas],
      synchronize: false,
    }),
    VentasModule,
    CloudinaryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
