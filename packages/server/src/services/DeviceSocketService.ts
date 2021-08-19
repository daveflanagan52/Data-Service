import { IO, Nsp, Socket, SocketService, SocketSession, Input, Namespace, Args } from '@tsed/socketio';
import * as SocketIO from 'socket.io';

import { DataRow } from '../entities/DataRow';
import { Device } from '../entities/Device';

@SocketService('/device')
export class DeviceSocketService {

  @Nsp nsp: SocketIO.Namespace;
  public clients: Map<string, SocketIO.Socket[]> = new Map();

  constructor(@IO private io: SocketIO.Server) { }

  $onConnection(@Socket socket: SocketIO.Socket, @SocketSession session: SocketSession) {
    console.log('=====   CONNECTED A CLIENT   =====');
    console.log(`===== SOCKET ID ${socket.id} =====`);

    const key: string = (socket.handshake.query?.key || '') as string;
    console.log('KEY', key);
    if (!this.clients.has(key)) {
      Device.findOneOrFail(undefined, { where: { publicKey: key } })
        .then((device: Device) => {
          this.clients.set(device.publicKey, [socket]);
        })
        .catch(() => socket.disconnect());
    } else {
      this.clients.get(key)?.push(socket);
    }
  }

  updateData(device: Device, row: DataRow) {
    const clients = this.clients.get(device.publicKey);
    (clients || []).filter(c => c.connected).forEach(client => {
      client.emit('data', row);
    });
  }
}