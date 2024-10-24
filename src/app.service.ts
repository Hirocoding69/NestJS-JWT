import { Inject, Injectable } from '@nestjs/common';
import { DevConfigService } from './common/providers/DevConfigService';

@Injectable()
export class AppService {
  constructor(private devConfigServie: DevConfigService, 
    @Inject('CONFIG') private config: {port:string}){}
  getHello(): string {
    return `Hello ${this.devConfigServie.getDBHOST()} port: ${this.config.port}`;
  }
}
