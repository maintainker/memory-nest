import { AlbumRole } from 'src/@types/enum';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Albums from './Album';
import Users from './Users';

// @Index()
@Entity({ schema: 'memory', name: 'albumUser' })
export default class AlbumUser {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'nickname', length: 30, nullable: false })
  nickname: string;

  @Column({
    type: 'enum',
    enum: AlbumRole,
    name: 'role',
    nullable: false,
  })
  role: AlbumRole;

  @ManyToOne(() => Users, (user) => user.id, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  user: Users;

  @ManyToOne(() => Albums, (album) => album.id, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  album: Albums;
}
