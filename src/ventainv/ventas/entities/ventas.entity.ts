import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class ventas {
  @PrimaryGeneratedColumn()
  idVenta: number;
  @Column()
  idVendedor: string;
  @Column()
  idProducto: number;
  @Column()
  nombreProducto: string;
  @Column()
  precio: number;
  @Column()
  cantidadVendido: number;
}
