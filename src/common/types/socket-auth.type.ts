import { Socket, DefaultEventsMap } from 'socket.io';
import { JwtPayload } from './jwt-payload.type';

export type AuthenticatedSocket = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  { user: JwtPayload }
>;
