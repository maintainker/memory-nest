import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumRole } from 'src/@types/enum';
import Albums from 'src/entities/Album';
import AlbumUser from 'src/entities/AlbumUser';
import Users from 'src/entities/Users';
import { Connection, QueryRunner, Repository } from 'typeorm';
import { CreateAlbumRequestDto } from './dtos/createAlbum.request.dtos';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Users, process.env.DB_NAME)
    private usersRepository: Repository<Users>,
    @InjectRepository(AlbumUser, process.env.DB_NAME)
    private albumUsersRepository: Repository<AlbumUser>,
    @InjectRepository(Albums, process.env.DB_NAME)
    private albumRepository: Repository<Albums>,
    private connection: Connection,
  ) {}
  async createAlbum(body: CreateAlbumRequestDto, user: Users) {
    let queryRunner: QueryRunner | null = null;
    try {
      queryRunner = await this.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const newAlbumParam: { name: string; password?: string } = {
        name: body.albumName,
      };
      body.password && (newAlbumParam.password = body.password);
      const newAlbum = this.albumRepository.create(newAlbumParam);
      const newAlbumUser = this.albumUsersRepository.create({
        nickname: body.nickname || user.name,
        role: AlbumRole.Editor,
        user: user,
        album: newAlbum,
      });
      newAlbumUser.album = newAlbum;
      await Promise.all([
        // this.albumRepository.save(newAlbum),
        this.albumUsersRepository.save(newAlbumUser),
      ]);
      console.log('create album& albumuser finish ');
    } catch (error) {
      console.error(error);
      queryRunner && (await queryRunner.rollbackTransaction());
      throw error;
    } finally {
      queryRunner && (await queryRunner.release());
    }
  }
}
