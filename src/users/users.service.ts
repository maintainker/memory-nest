import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import Connection from 'mysql2/typings/mysql/lib/Connection';
import Users from 'src/entities/Users';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users, process.env.DB_NAME)
    private usersRepository: Repository<Users>,
  ) {}

  async findByUserId(userId: string) {
    return this.usersRepository.findOne({
      where: { userId },
      select: ['id', 'userId', 'password'],
    });
  }

  async join(userId: string, name: string, password: string) {
    // const user = await this.usersRepository.findOne({where:{userId}});
    const queryRunner = this.usersRepository.queryRunner;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const user = await queryRunner.manager
      .getRepository(Users)
      .findOne({ where: { userId } });
    if (user) {
      throw new ForbiddenException('이미 존재하는 사용자입니다');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    console.log(hashedPassword);
    try {
      const returned = await queryRunner.manager.getRepository(Users).save({
        userId,
        name,
        password: hashedPassword,
      });
      // const workspaceMember = queryRunner.manager
      //   .getRepository(WorkspaceMembers)
      //   .create();
      // workspaceMember.UserId = returned.id;
      // workspaceMember.WorkspaceId = 1;
      // await queryRunner.manager
      //   .getRepository(WorkspaceMembers)
      //   .save(workspaceMember);
      // await queryRunner.manager.getRepository(ChannelMembers).save({
      //   UserId: returned.id,
      //   ChannelId: 1,
      // });
      await queryRunner.commitTransaction();
      return returned;
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
