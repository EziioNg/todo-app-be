import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Devil May Cry - Dragon Ninja - Rip and Tear';
  }
}
