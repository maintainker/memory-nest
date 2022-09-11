import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import Users from 'src/entities/Users';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginRequestDto } from './dtos/login.request.dto';
import { JwtService } from 'src/auth/jwt.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users, process.env.DB_NAME)
    private usersRepository: Repository<Users>,
    private jwtService: JwtService,
    private connection: Connection,
  ) {}

  async findByUserId(userId: string) {
    return this.usersRepository.findOne({
      where: { userId },
      select: ['id', 'userId', 'password'],
    });
  }
  async findById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }
  async login({
    userId,
    password,
  }: LoginRequestDto): Promise<
    { body: LoginResponse; refresh: string } | ErrorCommonResponse
  > {
    const user = await this.findByUserId(userId);
    if (user) {
      const isSamePassword = await bcrypt.compare(password, user.password);
      if (!isSamePassword) {
        return {
          success: false,
          message: '비밀번호가 일치하지 않습니다.',
        };
      }
      const { access, access_expire, refresh, refresh_expire } =
        this.jwtService.sign(user.id);
      return {
        body: {
          success: true,
          access,
          access_expire,
          refresh_expire,
        },
        refresh,
      };
    } else {
      return {
        success: false,
        message: '가입되지 않았거나 탈퇴 된 유저입니다.',
      };
    }
  }
  async join(userId: string, name: string, password: string) {
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const user = await queryRunner.manager
      .getRepository(Users)
      .findOne({ where: { userId } });
    if (user) {
      throw new ForbiddenException('이미 존재하는 사용자입니다');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
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
