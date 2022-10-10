import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Albums from './Album';
import Spots from './Spots';

@Entity({ schema: 'memory', name: 'events' })
export default class Events {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 30, nullable: false })
  name: string;

  @Column('varchar', { name: 'name', length: 30, default: '' })
  description: string;

  @Column('date')
  date: Date;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => Albums, (albums) => albums.id, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  album: Albums;

  @OneToMany(() => Spots, (spot) => spot.id, {
    onDelete: 'CASCADE',
  })
  spots: number[];
}
