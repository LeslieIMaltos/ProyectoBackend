import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class productos {
  @PrimaryGeneratedColumn()
  idProductos: number;
  @Column({ length: 45 })
  nombreProducto: string;
  @Column({ length: 500 })
  descripcionProducto: string;
  @Column()
  cantidadStock: number;
  @Column()
  precio: number;
  @Column()
  imagenProducto: string;
  @Column()
  idCategoria: number;
  @Column()
  categoria: string;
  @Column()
  idVendedor: string;
  @Column()
  nombreVendedor: string;
  @Column()
  status: boolean;
}
