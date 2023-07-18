import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class compras {
  @PrimaryGeneratedColumn()
  idCompra: number;
  @Column()
  idUsuario: string;
  @Column()
  idProducto: number;
  @Column()
  nombreProducto: string;
  @Column()
  precioUnitario: number;
  @Column()
  precioTotal: number;
  @Column()
  cantidad: number;
}
