import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class categories {
  @PrimaryGeneratedColumn()
  idCategoria: number;

  @Column({ length: 25 })
  categoria: string;
}
