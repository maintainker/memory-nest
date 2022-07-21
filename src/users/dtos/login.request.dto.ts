import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
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
    example: '!suyohw88',
    description: '비밀번호',
  })
  public password: string;
}
