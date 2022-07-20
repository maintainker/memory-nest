import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Connection, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    // @InjectRepository(WorkspaceMembers)
    // private workspaceMembersRepository: Repository<WorkspaceMembers>,
    // @InjectRepository(ChannelMembers)
    // private channelMembersRepository: Repository<ChannelMembers>,
    private connection: Connection,
  ) {}

  async findByUserId(userId: string) {
    return this.usersRepository.findOne({
      where: { userId },
      select: ['id', 'userId', 'password'],
    });
  }

  async join(userId: string, name: string, password: string) {
    const queryRunner = this.connection.createQueryRunner();
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
      return true;
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
