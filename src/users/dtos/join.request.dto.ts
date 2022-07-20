import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class JoinRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'suyohw88',
    description: '아이디',
  })
  public userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '설영환',
    description: '이름',
  })
  public name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '!suyohw88',
    description: '비밀번호',
  })
  public password: string;
}
