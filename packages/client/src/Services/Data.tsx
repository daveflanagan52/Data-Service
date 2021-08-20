import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import io from 'socket.io-client';
import moment, { DurationInputArg2 } from 'moment';
import { Device, DataRow } from '../Types';

export const dataApi = createApi({
  reducerPath: 'dataApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1/' }),
  endpoints: (builder) => ({
    getDevices: builder.query<Device[], undefined>({
      query: () => 'data',
    }),
    addDevice: builder.mutation<Device, Partial<Device>>({
      query(body) {
        return {
          url: 'data',
          method: 'POST',
          body,
        };
      },
    }),
    getDevice: builder.query<Device, string>({
      query: (key: string) => `data/${key}`,
    }),
    updateData: builder.query<DataRow[], { key: string, period: string }>({
      query: ({ key, period }) => `data/${key}/${period}`,
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const socket = io('/device', {
          path: '/api/v1/socket.io/device',
          query: {
            key: arg.key,
          },
        });
        socket.on('data', (data: DataRow) => {
          const date = moment().subtract(1, arg.period as DurationInputArg2);
          updateCachedData((draft) => {
            draft = draft.filter((x) => date.isSameOrBefore(x.createdAt));
            draft.push(data);
            return draft;
          });
        });
        await cacheEntryRemoved;
        socket.close();
      },
    }),
  }),
});

export const {
  useGetDevicesQuery, useGetDeviceQuery, useUpdateDataQuery, useAddDeviceMutation,
} = dataApi;
