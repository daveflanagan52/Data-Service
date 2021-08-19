import { Column, Entity, OneToMany,  PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { DataRow } from './DataRow';

@Entity({
  orderBy: {
    createdAt: 'ASC'
  }
})
export class Device extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  private: boolean;

  @Column()
  publicKey: string;

  @Column()
  privateKey: string;

  @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => DataRow, dataRow => dataRow.device)
  rows?: DataRow[];
}
