class Device {
  id: number;
  name: string;
  publicKey: string;
  privateKey?: string;
  private?: boolean;
  createdAt: Date;
  rows?: DataRow[];
  numRows?: number;
  lastEntry?: Date;
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