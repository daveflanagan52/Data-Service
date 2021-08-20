import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Chart from 'react-apexcharts';
import { useParams } from 'react-router';
import { Helmet } from 'react-helmet';
import { faClock, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Alert, { AlertType } from '../../Components/Alert';
import Card from '../../Components/Card';
import Column from '../../Components/Column';
import DataCard from '../../Components/DataCard';
import Dropdown from '../../Components/Dropdown';
import Loader from '../../Components/Loader';
import Row from '../../Components/Row';

import { useGetDeviceQuery, useUpdateDataQuery } from '../../Services/Data';
import { DataRow } from '../../Types';

interface Dataset {
  name: string,
  data: KeyNumberStringList[],
}

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
  const [series, setSeries] = useState([]);
  const [period, setPeriod] = useState('hour');

  const device = useGetDeviceQuery(key);
  const { data, isLoading } = useUpdateDataQuery({ key, period });

  useEffect(() => {
    setLabels((data || []).reduce((p, v) => [...p, moment(v.createdAt).format('llll')], []));
    const _series: Dataset[] = [];
    const _minimums: KeyNumberList = {};
    const _maximums: KeyNumberList = {};
    const _averages: KeyNumberList = {};

    const keys = (data || []).reduce((keys, row) => row.entries.reduce((previous, entry) => (previous.includes(entry.key) ? previous : [...previous, entry.key]), keys), []);
    keys.forEach((key) => {
      const filtered = ((data || []) as DataRow[]).reduce((previous, row) => [...previous, [moment(row.createdAt).valueOf(), row.entries.filter((x) => x.key === key).pop()?.value || 0]], []);
      _averages[key] = filtered.reduce((p, v) => p + v[1], 0) / filtered.length;
      _minimums[key] = filtered.reduce((p, v) => (p < v[1] ? p : v[1]), Number.MAX_VALUE);
      _maximums[key] = filtered.reduce((p, v) => (p > v[1] ? p : v[1]), Number.MIN_VALUE);
      _series.push({
        name: key,
        data: filtered,
      });
    });

    setAverages(_averages);
    setMinimums(_minimums);
    setMaximums(_maximums);
    setSeries(_series.sort((a, b) => a.name.localeCompare(b.name)));
  }, [data, period]);

  if (!device.isLoading && !device.data) {
    return <Alert type={AlertType.Error} icon={faSearch} message="Device not found!" />;
  }

  return (
    <>
      <Helmet>
        <title>
          Data Service |
          {device?.data?.name || (device?.isLoading ? 'Loading...' : 'Not Found')}
        </title>
      </Helmet>
      <Loader show={isLoading || device.isLoading} />
      <h1 className="mb-4">{device?.data?.name || (device?.isLoading ? 'Loading...' : 'Not Found')}</h1>
      {!isLoading && series.length === 0 && (
        <Alert type={AlertType.Warning} icon={faSearch} message="No data returned for the selected time period." />
      )}
      <Card headerItems={[
        <Dropdown
          popClassName="dropdown ms-auto"
          key="period"
          label="Period"
          text={(
            <>
              <FontAwesomeIcon icon={faClock} className="me-2" />
              {period}
            </>
)}
        >
          {periods.map((key) => (
            <li key={key} onClick={() => setPeriod(key)}>
              <button type="button" className="dropdown-item text-capitalize">{key}</button>
            </li>
          ))}
        </Dropdown>,
      ]}
      >
        <Chart
          options={{
            chart: {
              id: 'realtime',
              height: 450,
              type: 'area',
            },
            dataLabels: {
              enabled: false,
            },
            xaxis: {
              type: 'datetime',
              categories: labels,
            },
          }}
          type="area"
          series={series}
          height={450}
        />
      </Card>
      <Row>
        <Column xs={12} md={4}>
          <DataCard title="Lowest" data={minimums} />
        </Column>
        <Column xs={12} md={4}>
          <DataCard title="Average" data={averages} />
        </Column>
        <Column xs={12} md={4}>
          <DataCard title="Highest" data={maximums} />
        </Column>
      </Row>
    </>
  );
};

export default Device;
