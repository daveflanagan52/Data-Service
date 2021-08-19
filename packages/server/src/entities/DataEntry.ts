import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { DataRow } from './DataRow';

@Entity({
  orderBy: {
    createdAt: 'DESC'
  }
})
export class DataEntry extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column('decimal')
  value: number;

  @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => DataRow, dataRow => dataRow.entries)
  dataRow?: DataRow;
}
