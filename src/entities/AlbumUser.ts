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
  @PrimaryGeneratedColumn({ type: 'int', name: 'albumUserId' })
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

  @ManyToOne(
    () => Users,
    (user) => ({
      id: user.id,
      userId: user.userId,
      name: user.name,
    }),
    {
      cascade: ['insert', 'update', 'remove'],
      onDelete: 'CASCADE',
    },
  )
  user: Pick<Users, 'id' | 'name' | 'userId'>;

  @ManyToOne(
    () => Albums,
    (album) => ({
      albumId: album.albumId,
      name: album.name,
    }),
    {
      cascade: ['insert', 'update', 'remove'],
      onDelete: 'CASCADE',
    },
  )
  album: Pick<Albums, 'albumId' | 'name'>;
}
