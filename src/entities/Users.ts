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

@Index('userId', ['userId'], { unique: true })
@Entity({ schema: 'memory', name: 'users' })
export default class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'userId', unique: true, length: 30 })
  userId: string;

  @Column('varchar', { name: 'name', length: 30, nullable: false })
  name: string;

  @Column('varchar', { name: 'password', length: 100, nullable: false })
  password: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => AlbumUser, (albumUser) => albumUser.user, {
    onDelete: 'SET NULL',
    cascade: ['insert', 'update', 'remove'],
  })
  albumUser: AlbumUser[];
}
