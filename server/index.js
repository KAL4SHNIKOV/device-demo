import http from 'node:http';
import { readData, writeData, createId } from './store.js';

const port = process.env.PORT || 4000;

const sendJson = (res, status, payload) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
};

const withCors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

const parseBody = async (req) => {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
  }
  if (!raw) {
    return {};
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const getNotFound = (res, message) => sendJson(res, 404, { message });

const server = http.createServer(async (req, res) => {
  withCors(res);
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const { pathname, searchParams } = url;

  if (req.method === 'GET' && pathname === '/api/health') {
    sendJson(res, 200, { status: 'ok', timestamp: new Date().toISOString() });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/dashboard') {
    const data = await readData();
    const total = data.devices.length;
    const statusCounts = data.devices.reduce(
      (acc, device) => {
        acc[device.status] = (acc[device.status] || 0) + 1;
        return acc;
      },
      { idle: 0, rented: 0, maintenance: 0 }
    );
    const utilization = total ? Math.round((statusCounts.rented / total) * 100) : 0;
    sendJson(res, 200, {
      totalDevices: total,
      utilization,
      statusCounts,
      pendingTasks: data.tasks.filter((task) => task.status === 'pending').length,
      latestDispatch: data.dispatches[0] || null
    });
    return;
  }

  if (pathname === '/api/devices') {
    if (req.method === 'GET') {
      const data = await readData();
      const status = searchParams.get('status');
      const type = searchParams.get('type');
      const q = searchParams.get('q');
      let items = data.devices;

      if (status) {
        items = items.filter((device) => device.status === status);
      }
      if (type) {
        items = items.filter((device) => device.type === type);
      }
      if (q) {
        const query = q.toLowerCase();
        items = items.filter((device) =>
          [device.name, device.id, device.location, device.owner]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(query))
        );
      }

      sendJson(res, 200, items);
      return;
    }

    if (req.method === 'POST') {
      const body = await parseBody(req);
      if (!body) {
        sendJson(res, 400, { message: 'JSON 格式错误' });
        return;
      }
      const { name, type, status, location, owner } = body;
      if (!name || !type) {
        sendJson(res, 400, { message: 'name 与 type 为必填' });
        return;
      }
      const data = await readData();
      const device = {
        id: createId('DEV'),
        name,
        type,
        status: status || 'idle',
        location: location || '未指定',
        owner: owner || '未知'
      };
      data.devices.unshift(device);
      await writeData(data);
      sendJson(res, 201, device);
      return;
    }
  }

  if (pathname.startsWith('/api/devices/')) {
    const id = decodeURIComponent(pathname.replace('/api/devices/', ''));
    const data = await readData();
    const device = data.devices.find((item) => item.id === id);

    if (!device) {
      getNotFound(res, '设备不存在');
      return;
    }

    if (req.method === 'GET') {
      sendJson(res, 200, device);
      return;
    }

    if (req.method === 'PATCH') {
      const body = await parseBody(req);
      if (!body) {
        sendJson(res, 400, { message: 'JSON 格式错误' });
        return;
      }
      Object.assign(device, body);
      await writeData(data);
      sendJson(res, 200, device);
      return;
    }

    if (req.method === 'DELETE') {
      const index = data.devices.findIndex((item) => item.id === id);
      const [removed] = data.devices.splice(index, 1);
      await writeData(data);
      sendJson(res, 200, removed);
      return;
    }
  }

  if (pathname === '/api/tasks') {
    if (req.method === 'GET') {
      const data = await readData();
      sendJson(res, 200, data.tasks);
      return;
    }

    if (req.method === 'POST') {
      const body = await parseBody(req);
      if (!body) {
        sendJson(res, 400, { message: 'JSON 格式错误' });
        return;
      }
      const { title, project } = body;
      if (!title || !project) {
        sendJson(res, 400, { message: 'title 与 project 为必填' });
        return;
      }
      const data = await readData();
      const task = {
        id: createId('TASK'),
        title,
        project,
        status: 'pending',
        date: new Date().toISOString().slice(0, 10)
      };
      data.tasks.unshift(task);
      await writeData(data);
      sendJson(res, 201, task);
      return;
    }
  }

  if (pathname.startsWith('/api/tasks/')) {
    const id = decodeURIComponent(pathname.replace('/api/tasks/', ''));
    const data = await readData();
    const task = data.tasks.find((item) => item.id === id);

    if (!task) {
      getNotFound(res, '任务不存在');
      return;
    }

    if (req.method === 'PATCH') {
      const body = await parseBody(req);
      if (!body) {
        sendJson(res, 400, { message: 'JSON 格式错误' });
        return;
      }
      Object.assign(task, body);
      await writeData(data);
      sendJson(res, 200, task);
      return;
    }
  }

  if (pathname === '/api/dispatches') {
    if (req.method === 'GET') {
      const data = await readData();
      sendJson(res, 200, data.dispatches);
      return;
    }

    if (req.method === 'POST') {
      const body = await parseBody(req);
      if (!body) {
        sendJson(res, 400, { message: 'JSON 格式错误' });
        return;
      }
      const { title, eta, driver, vehicle, phone } = body;
      if (!title) {
        sendJson(res, 400, { message: 'title 为必填' });
        return;
      }
      const data = await readData();
      const dispatch = {
        id: createId('RENT'),
        title,
        status: 'in_transit',
        eta: eta || '待确认',
        driver: driver || '待指派',
        vehicle: vehicle || '待指派',
        phone: phone || '',
        createdAt: new Date().toISOString().slice(0, 10)
      };
      data.dispatches.unshift(dispatch);
      await writeData(data);
      sendJson(res, 201, dispatch);
      return;
    }
  }

  if (pathname.startsWith('/api/dispatches/')) {
    const id = decodeURIComponent(pathname.replace('/api/dispatches/', ''));
    const data = await readData();
    const dispatch = data.dispatches.find((item) => item.id === id);

    if (!dispatch) {
      getNotFound(res, '调度单不存在');
      return;
    }

    if (req.method === 'PATCH') {
      const body = await parseBody(req);
      if (!body) {
        sendJson(res, 400, { message: 'JSON 格式错误' });
        return;
      }
      Object.assign(dispatch, body);
      await writeData(data);
      sendJson(res, 200, dispatch);
      return;
    }
  }

  if (pathname === '/api/profile') {
    const data = await readData();
    if (req.method === 'GET') {
      sendJson(res, 200, data.profile);
      return;
    }

    if (req.method === 'PATCH') {
      const body = await parseBody(req);
      if (!body) {
        sendJson(res, 400, { message: 'JSON 格式错误' });
        return;
      }
      data.profile = { ...data.profile, ...body };
      await writeData(data);
      sendJson(res, 200, data.profile);
      return;
    }
  }

  sendJson(res, 404, { message: '接口不存在' });
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server running on http://localhost:${port}`);
});
