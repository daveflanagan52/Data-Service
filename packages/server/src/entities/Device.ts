import {
  Column, Entity, OneToMany, PrimaryGeneratedColumn, BaseEntity, Index
} from 'typeorm';
import { DataRow } from './DataRow';

@Entity()
export class Device extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  private: boolean;

  @Index({ unique: true })
  @Column()
  publicKey: string;

  @Column()
  privateKey: string;

  @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => DataRow, (dataRow) => dataRow.device)
  rows?: DataRow[];
}
