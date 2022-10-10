import { Injectable } from '@nestjs/common';

@Injectable()
export class EventsService {
  getEvent(): string {
    return '2134';
  }
  createEvent(): unknown {
    return '123';
  }
}
