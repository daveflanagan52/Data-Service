import { Controller, Get, Post, PathParams, BodyParams } from '@tsed/common';
import { Returns, ContentType } from '@tsed/schema';
import { BadRequest, NotFound } from '@tsed/exceptions';
import { Between } from 'typeorm';
import moment, { DurationInputArg2 } from 'moment';

import { BaseController } from './BaseController';
import { Device } from '../entities/Device';
import { DataRow } from '../entities/DataRow';
import { DataEntry } from '../entities/DataEntry';

class Response {
  error?: string;
  success?: boolean;
};

interface BodyParam {
  [key: string]: number;
};

@Controller('/data')
export class DataController extends BaseController {
  @Get('/:key')
  @ContentType('application/json')
  @Returns(200, Device)
  findDevice(@PathParams('key') key: string): Promise<Device | Response> {
    return Device.findOneOrFail(undefined, { where: { key } })
      .catch(() => { throw new NotFound('Device not found') });
  }

  @Get('/:key/:period')
  @ContentType('application/json')
  @Returns(200, Device)
  getData(@PathParams('key') key: string, @PathParams('period') period: string): Promise<DataRow[] | Response | undefined> {
    return Device.findOneOrFail(undefined, { where: { key } })
      .catch(() => { throw new NotFound('Device not found') })
      .then(device => {
        if (period === 'all') {
          return DataRow.find({ where: { device }, relations: ['entries'], order: { createdAt: 'ASC' } });
        } else {
          const date = moment().subtract(1, period as DurationInputArg2).toDate();
          return DataRow.find({ where: { device, createdAt: Between(date, new Date()) }, relations: ['entries'], order: { createdAt: 'ASC' } });
        }
      })
      .then(rows => rows.filter(row => (row.entries || []).length > 0));
  }

  @Post('/:key')
  @ContentType('application/json')
  @Returns(200, Response)
  insert(@PathParams('key') key: string, @BodyParams() data: BodyParam): Promise<Response> {
    return Device.findOneOrFail(undefined, { where: { key } })
      .catch(() => { throw new NotFound('Device not found') })
      .then((device: Device) => {
        if (!data || Object.keys(data || []).length === 0) {
          throw new BadRequest('Data was empty');
        }
        const row: DataRow = new DataRow();
        row.device = device;
        return row.save().then(row => {
          Object.keys(data || []).forEach(key => {
            const entry: DataEntry = new DataEntry();
            entry.key = key;
            entry.value = data[key] || 0;
            entry.dataRow = row;
            entry.save();
          });
          return { success: true };
        });
      });
  }
}