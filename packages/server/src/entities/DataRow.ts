import {
  Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, BaseEntity, Index
} from 'typeorm';
import { DataEntry } from './DataEntry';
import { Device } from './Device';

@Entity()
export class DataRow extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Index()
  @ManyToOne(() => Device, (device) => device.rows)
  device?: Device;

  @OneToMany(() => DataEntry, (entry) => entry.dataRow)
  entries?: DataEntry[];
}
