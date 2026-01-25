import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.resolve(__dirname, 'data.json');

const defaultData = () => ({
  devices: [
    { id: 'DEV-2025001', name: '180kN张力机', type: 'A类-战略', status: 'idle', location: '昆明中心库', owner: '新捷' },
    { id: 'DEV-2025002', name: '25吨汽车吊', type: 'B类-通用', status: 'rented', location: '天星输变电项目部', owner: '田兴公司' },
    { id: 'DEV-2025003', name: '牵引机(90kN)', type: 'A类-战略', status: 'maintenance', location: '大理维修站', owner: '新捷供应链' },
    { id: 'DEV-2025004', name: '300kW发电机', type: 'B类-通用', status: 'idle', location: '北电项目部', owner: '北电' }
  ],
  tasks: [
    { id: 'T-01', title: '张力机租赁申请', project: '遥龙500kV线路工程', status: 'pending', date: '2025-11-19' },
    { id: 'T-02', title: '挖掘机归还确认', project: '滇中配网改造', status: 'approved', date: '2025-11-18' }
  ],
  dispatches: [
    {
      id: 'RENT-20251108',
      title: '张力机租赁单',
      status: 'in_transit',
      eta: '今日 14:00',
      driver: '李师傅',
      vehicle: '云A·88888',
      phone: '139****1234',
      createdAt: '2025-11-08'
    }
  ],
  profile: {
    id: 'U-001',
    name: '何星',
    department: '市场经营部',
    role: '专责',
    organization: '投控集团',
    pendingApprovals: 3,
    activeRentals: 5,
    version: 'v1.0.0 (MVP)'
  }
});

const ensureDataFile = async () => {
  try {
    await fs.access(dataFile);
  } catch {
    const seed = defaultData();
    await fs.writeFile(dataFile, JSON.stringify(seed, null, 2), 'utf8');
  }
};

export const readData = async () => {
  await ensureDataFile();
  const raw = await fs.readFile(dataFile, 'utf8');
  return JSON.parse(raw);
};

export const writeData = async (data) => {
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf8');
};

export const createId = (prefix) => {
  const short = randomUUID().split('-')[0];
  return `${prefix}-${short}`.toUpperCase();
};
