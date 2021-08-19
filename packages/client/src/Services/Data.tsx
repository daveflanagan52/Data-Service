import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Device, DataRow } from '../Types';

export const dataApi = createApi({
  reducerPath: 'dataApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1/' }),
  endpoints: (builder) => ({
    getDevice: builder.query<Device, string>({
      query: (key: string) => 'data/' + key,
    }),
    getData: builder.query<DataRow[], { key: string, period: string }>({
      query: ({ key, period }) => 'data/' + key + '/' + period,
    }),
  }),
})

export const { useGetDeviceQuery, useGetDataQuery } = dataApi;