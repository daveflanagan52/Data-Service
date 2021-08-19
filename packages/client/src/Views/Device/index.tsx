import React, { useState, useEffect } from 'react';
import moment from 'moment';
import io from 'socket.io-client';
import { useParams } from 'react-router';
import { Line } from 'react-chartjs-2';
import { faClock, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Alert, { AlertType } from '../../Components/Alert';
import Card from '../../Components/Card';
import Column from '../../Components/Column';
import DataCard from '../../Components/DataCard';
import Dropdown from '../../Components/Dropdown';
import Loader from '../../Components/Loader';
import Row from '../../Components/Row';

import { useGetDataQuery, useGetDeviceQuery } from '../../Services/Data';

import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);

const colors = [
  '121, 123, 242',
  '255, 169, 129'
];

interface Dataset {
  label: string,
  data: KeyNumberStringList[],
  fill: boolean,
  tension: number,
  order: number,
  pointRadius: number,
  borderWidth: number,
  backgroundColor: string,
  borderColor: string,
  parsing: {
    yAxisKey: string,
  }
};

interface KeyNumberStringList {
  [key: string]: number | string,
}
interface KeyNumberList {
  [key: string]: number,
}

type DeviceParams = {
  key: string;
};

const periods: string[] = [
  'hour',
  'day',
  'week',
  'month',
  'all',
];

const Device: React.FC = () => {
  const { key } = useParams<DeviceParams>();

  const [labels, setLabels] = useState([]);
  const [minimums, setMinimums] = useState({});
  const [maximums, setMaximums] = useState({});
  const [averages, setAverages] = useState({});
  const [datasets, setDatasets] = useState([]);
  const [period, setPeriod] = useState('week');

  const device = useGetDeviceQuery(key);
  const { data, isLoading } = useGetDataQuery({ key, period });

  useEffect(() => {
    if (device.data) {
      const socket = io('/device', {
        path: '/api/v1/socket.io/device',
        query: {
          'key': device.data.key,
        }
      });
      socket.on('connect', () => {
        console.log('connected to server');
      });
      socket.on('disconnect', data => {
        console.log('disconnected');
      });
      socket.on('data', data => {
      });
    }
  }, [device.data])

  useEffect(() => {
    setLabels((data || []).map(row => moment(row.createdAt).format('llll')));

    const fomattedData = (data || []).map(row => {
      return {
        x: moment(row.createdAt).format('llll'),
        ...row.entries.reduce((previous, entry) => ({ ...previous, [entry.key]: entry.value }), {})
      } as KeyNumberStringList;
    });

    let colorIndex = 0;
    const _datasets: { [key: string]: Dataset } = {};
    const _minimums: KeyNumberList = {};
    const _maximums: KeyNumberList = {};
    const _averages: KeyNumberList = {};

    fomattedData.forEach(row => {
      Object.keys(row).forEach(key => {
        if (key !== 'x' && !_datasets[key]) {
          const filtered = fomattedData.map(r => r[key]).filter(x => typeof x === 'number') as unknown as number[];
          _averages[key] = filtered.reduce((p, v) => p + v, 0) / filtered.length;
          _minimums[key] = filtered.reduce((p, v) => p < v ? p : v, Number.MAX_VALUE);
          _maximums[key] = filtered.reduce((p, v) => p > v ? p : v, Number.MIN_VALUE);
          _datasets[key] = {
            label: key,
            data: fomattedData,
            fill: false,
            tension: 0.1,
            order: 100 - colorIndex,
            pointRadius: 1,
            borderWidth: 3,
            backgroundColor: 'rgba(' + colors[colorIndex] + ', 1)',
            borderColor: 'rgba(' + colors[colorIndex] + ', 1)',
            parsing: {
              yAxisKey: key
            }
          };
          colorIndex++;
        }
      });
    });

    setAverages(_averages);
    setMinimums(_minimums);
    setMaximums(_maximums);
    setDatasets(Object.values(_datasets));
  }, [data, period]);

  if (!device.isLoading && !device.data) {
    return <Alert type={AlertType.Error} icon={faSearch} message='Device not found!' />;
  }

  return (
    <>
      <Loader show={isLoading || device.isLoading} />
      <h1>{device?.data?.name || (device?.isLoading ? 'Loading...' : 'Not Found')}</h1>
      {!isLoading && labels.length === 0 && (
        <Alert type={AlertType.Warning} icon={faSearch} message='No data returned for the selected time period.' />
      )}
      <Card headerItems={[
        <Dropdown popClassName='dropdown ms-auto' key='period' label='Period' text={<><FontAwesomeIcon icon={faClock} className='me-2' />{period}</>}>
          {periods.map(key => (
            <li key={key} onClick={() => setPeriod(key)}>
              <button type='button' className='dropdown-item text-capitalize'>{key}</button>
            </li>
          ))}
        </Dropdown>
      ]}>
        <Line
          data={{
            labels,
            datasets,
          }}
          options={{
            plugins: {
              zoom: {
                zoom: {
                  wheel: {
                    enabled: true,
                  },
                  pinch: {
                    enabled: true
                  },
                  mode: 'xy',
                }
              }
            },
            animation: false,
            scales: {
              y: {
                suggestedMin: 0,
                suggestedMax: 100,
              },
              xAxes: {
                display: false,
              }
            },
          }}
        />
      </Card>
      <Row>
        <Column xs={12} md={4}>
          <DataCard title='Lowest' data={minimums} />
        </Column>
        <Column xs={12} md={4}>
          <DataCard title='Averages' data={averages} />
        </Column>
        <Column xs={12} md={4}>
          <DataCard title='Highest' data={maximums} />
        </Column>
      </Row>
    </>
  );
}

export default Device;
