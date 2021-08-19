class Device {
  id: number;
  name: string;
  publicKey: string;
  createdAt: Date;
  rows?: DataRow[];
};

class DataRow {
  id?: number;
  createdAt: Date;
  device?: Device;
  entries?: DataEntry[];
};

class DataEntry {
  id?: number;
  row?: DataRow;
  key: string;
  value: number;
  createdAt?: Date;
};

export { Device, DataRow, DataEntry };