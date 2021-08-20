import { Controller, Get, Post, PathParams, BodyParams } from '@tsed/common';
import { Returns, ContentType } from '@tsed/schema';
import { BadRequest, NotFound } from '@tsed/exceptions';
import { Between } from 'typeorm';
import moment, { DurationInputArg2 } from 'moment';
import { v4 as uuidv4 } from 'uuid';

import { BaseController } from './BaseController';
import { Device } from '../entities/Device';
import { DataRow } from '../entities/DataRow';
import { DataEntry } from '../entities/DataEntry';
import { DeviceSocketService } from '../services/DeviceSocketService';
import { TypeORMService } from '@tsed/typeorm';

class HomeResponse {
  name: string;
  publicKey: string;
  numRows: number;
  lastEntry: Date | undefined;
}

class Response {
  error?: string;
  success?: boolean;
};

interface BodyParam {
  [key: string]: number;
};

@Controller('/data')
export class DataController extends BaseController {
  protected deviceSocketService: DeviceSocketService;

  constructor(typeORMService: TypeORMService, deviceSocketService: DeviceSocketService) {
    super(typeORMService)
    this.deviceSocketService = deviceSocketService;
  }

  @Get('/')
  @ContentType('application/json')
  @Returns(200, Array).Of(HomeResponse)
  find(): Promise<HomeResponse[] | Response> {
    return Device.find({ where: { private: false } })
      .then(devices => Promise.all(devices.map(async device => {
        return {
          name: device.name,
          publicKey: device.publicKey,
          numRows: await DataRow.count({ where: { device } }),
          lastEntry: (await DataRow.findOne({ where: { device }, order: { createdAt: 'DESC' } }))?.createdAt,
        }
      })));
  }

  @Post('/')
  @ContentType('application/json')
  @Returns(200, Device)
  createDevice(@BodyParams('name') name?: string, @BodyParams('private') isPrivate?: boolean): Promise<Device> {
    if (!name) {
      throw new BadRequest('No name specified name');
    }
    const device = Device.create({
      name: name,
      private: isPrivate,
      publicKey: uuidv4(),
      privateKey: uuidv4(),
    });
    return device.save();
  }

  @Get('/:key')
  @ContentType('application/json')
  @Returns(200, Device)
  findDevice(@PathParams('key') key: string): Promise<Device | Response> {
    return Device.findOneOrFail(undefined, { select: ['name', 'publicKey'], where: { publicKey: key } })
      .catch(() => { throw new NotFound('Device not found') });
  }

  @Get('/:key/:period')
  @ContentType('application/json')
  @Returns(200, Device)
  getData(@PathParams('key') key: string, @PathParams('period') period: string): Promise<DataRow[] | Response | undefined> {
    return Device.findOneOrFail(undefined, { where: { publicKey: key } })
      .catch(() => { throw new NotFound('Device not found') })
      .then(device => {
        if (period === 'all') {
          return DataRow.find({ select: ['createdAt', 'entries'], where: { device }, relations: ['entries'], order: { createdAt: 'ASC' } });
        } else {
          const date = moment().subtract(1, period as DurationInputArg2).toDate();
          return DataRow.find({ select: ['createdAt', 'entries'], where: { device, createdAt: Between(date, new Date()) }, relations: ['entries'], order: { createdAt: 'ASC' } });
        }
      })
      .then(rows => rows.filter(row => (row.entries || []).length > 0));
  }

  @Post('/:key')
  @ContentType('application/json')
  @Returns(200, Response)
  insert(@PathParams('key') key: string, @BodyParams() data: BodyParam): Promise<Response> {
    return Device.findOneOrFail(undefined, { where: { privateKey: key } })
      .catch(() => { throw new NotFound('Device not found') })
      .then((device: Device) => {
        if (!data || Object.keys(data || []).length === 0) {
          throw new BadRequest('Data was empty');
        }
        const row: DataRow = new DataRow();
        row.device = device;
        return row.save().then(row => {
          return Promise.all(Object.keys(data || []).map(key => {
            const entry: DataEntry = new DataEntry();
            entry.key = key;
            entry.value = data[key];
            entry.dataRow = row;
            return entry.save();
          })).then(() => {
            return DataRow.findOne(undefined, { where: { id: row.id }, relations: ['entries'] })
          }).then((row: DataRow) => {
            this.deviceSocketService.updateData(device, row);
            return { success: true };
          });
        });
      });
  }
}