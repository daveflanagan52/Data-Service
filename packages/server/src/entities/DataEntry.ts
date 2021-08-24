import {
  Column, Entity, ManyToOne, PrimaryGeneratedColumn, BaseEntity, Index
} from 'typeorm';
import { DataRow } from './DataRow';

@Entity()
export class DataEntry extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column('decimal')
  value: number;

  @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Index()
  @ManyToOne(() => DataRow, (dataRow) => dataRow.entries)
  dataRow?: DataRow;
}
