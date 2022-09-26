import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import 'dotenv/config';
const config = process.env;
@Injectable()
export class ImageService {
  constructor(private readonly config: ConfigService) {} // ConfigService 불러오기){}
  async uploadImage(files: Express.Multer.File) {
    try {
      const today = Date.now();
      const upload = await new AWS.S3()
        .putObject({
          Key: `${today + files[0].originalname}`,
          Body: files[0].buffer,
          Bucket: config['AWS_S3_BUCKET_NAME'],
          // ACL: 'public-read',
        })
        .promise();
      const url = `https://memory-data-images.s3.ap-northeast-2.amazonaws.com/${
        today + files[0].originalname
      }`;
      console.log(url);
      console.log(upload);
    } catch (error) {
      console.log(error);
    }
    return 'SUCESS';
  }
}
