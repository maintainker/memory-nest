import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from './jwt.constants';
import { JwtModuleOptions } from './jwt.interface';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {
    console.log(options);
  }
  sign(id: number) {
    const today = new Date().valueOf();
    const access_expire = today + 1000 * 60 * 15;
    const refresh_expire = today + 1000 * 60 * 120;
    const access = jwt.sign(
      { id, access_expire },
      this.options.privateAccessKey,
    );
    const refresh = jwt.sign(
      { id, refresh_expire },
      this.options.privateRefreshKey,
    );
    return {
      access_expire,
      refresh_expire,
      access,
      refresh,
    };
  }
  verifyAccess(token: string) {
    return jwt.verify(token, this.options.privateAccessKey);
  }
  verifyRefresh(token: string) {
    return jwt.verify(token, this.options.privateRefreshKey);
  }
}
