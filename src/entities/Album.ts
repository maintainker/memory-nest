import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import AlbumUser from './AlbumUser';

@Index()
@Entity({ schema: 'memory', name: 'albums' })
export default class Albums {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  albumId: number;

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

  @ManyToOne(() => AlbumUser, (albumUser) => albumUser.album, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'SET NULL',
  })
  albumUser: AlbumUser[];
}
