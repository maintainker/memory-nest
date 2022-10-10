import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Events from './Events';
import Photos from './Photo';

@Entity({ schema: 'memory', name: 'spots' })
export default class Spots {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  // @ManyToOne(() => Events, (events) => events.spots, {
  //   cascade: ['insert', 'update', 'remove'],
  //   onDelete: 'CASCADE',
  // })
  event: Events;

  @Column({ type: 'int', name: 'order' })
  order: number;

  @Column({ type: 'varchar', length: 30, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  description: string;

  // TODO: 추후에 위치정보를 올릴수 있도록
  // TODO: 댓글기능

  @OneToMany(() => Photos, (Photos) => Photos.id)
  photos: number[];
}
