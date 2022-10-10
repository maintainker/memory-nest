import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import AlbumUser from './AlbumUser';
import Events from './Events';

// @Index()
@Entity({ schema: 'memory', name: 'albums' })
export default class Albums {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 30, nullable: false })
  name: string;

  @Column('varchar', { name: 'password', length: 100, nullable: true })
  password: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => AlbumUser, (albumUser) => albumUser.id, {
    onDelete: 'SET NULL',
  })
  albumUser: number[];

  @OneToMany(() => Events, (event) => event.id, {
    onDelete: 'CASCADE',
  })
  event: number[];
}
