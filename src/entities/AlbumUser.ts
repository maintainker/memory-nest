import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Albums from './Album';
import Users from './Users';

@Index()
@Entity({ schema: 'memory', name: 'album-user' })
export default class AlbumUser {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  albumUserId: number;

  @Column('varchar', { name: 'nickname', length: 30, nullable: false })
  nickname: string;

  @Column({
    type: 'enum',
    enum: AlbumRole,
    name: 'role',
    nullable: false,
  })
  role: AlbumRole;

  @OneToMany(() => Users, (user) => user.albumUser, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  user: Users;

  @OneToMany(() => Albums, (album) => album.albumUser, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  album: Albums;
}
