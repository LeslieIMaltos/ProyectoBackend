import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class carrito_compras {
  @PrimaryGeneratedColumn()
  idCarrito: number;
  @Column()
  idUsuario: string;
  @Column()
  idProducto: number;
  @Column()
  precioUnitario: number;
  @Column()
  precioTotal: number;
  @Column()
  cantidad: number;
  @Column()
  disponible: boolean;
  @Column()
  status: boolean;
}
