import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateAlbumRequestDto {
  @IsString()
  @ValidateIf((object, value) => !value)
  @ApiProperty({
    example: '난 우리 가족의 아들',
    title: '닉네임',
    description: '앨범에서의 닉네임',
  })
  public nickname?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '우리가족 추억',
    title: '앨범 이름',
    description: '앨범의 이름',
  })
  public albumName!: string;

  @IsString()
  @ValidateIf((object, value) => !value)
  @ApiProperty({
    example: '!suyohw88',
    title: '비밀번호',
    description: '없으면 참가자 누구나 참여가능',
  })
  public password?: string;
}
