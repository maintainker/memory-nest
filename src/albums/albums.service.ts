import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Albums from 'src/entities/Album';
import AlbumUser from 'src/entities/AlbumUser';
import Users from 'src/entities/Users';
import { Connection, Repository } from 'typeorm';
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
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const thisUser = await this.usersRepository.findOne({
        where: { id: user.id },
      });
      const newAlbumParam: { name: string; password?: string } = {
        name: body.albumName,
      };
      body.password && (newAlbumParam.password = body.password);
      const newAlbum = this.albumRepository.create(newAlbumParam);
      const newAlbumUser = this.albumUsersRepository.create({
        nickname: body.nickname || user.name,
        role: AlbumRole.Editor,
        user: { id: thisUser.id, userId: thisUser.userId },
        album: { albumId: newAlbum.albumId, name: newAlbum.name },
      });
      newAlbum.albumUser = [newAlbumUser];
      newAlbumUser.album = newAlbum;
      await queryRunner.commitTransaction();
      await Promise.all([
        this.albumRepository.save(newAlbum),
        this.albumUsersRepository.save(newAlbumUser),
        this.usersRepository.update(
          { id: user.id },
          {
            albumUser: thisUser.albumUser
              ? [...thisUser.albumUser, newAlbumUser]
              : [newAlbumUser],
          },
        ),
      ]);
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
