import { useState } from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  ClipboardList, 
  QrCode, 
  MapPin, 
  Search, 
  Bell, 
  ChevronRight, 
  Plus,
  Filter,
  User,
  Settings,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

// 模拟数据：设备列表
const mockDevices = [
  { id: 'DEV-2025001', name: '180kN张力机', type: 'A类-战略', status: 'idle', location: '昆明中心库', owner: '新捷' },
  { id: 'DEV-2025002', name: '25吨汽车吊', type: 'B类-通用', status: 'rented', location: '天星输变电项目部', owner: '田兴公司' },
  { id: 'DEV-2025003', name: '牵引机(90kN)', type: 'A类-战略', status: 'maintenance', location: '大理维修站', owner: '新捷供应链' },
  { id: 'DEV-2025004', name: '300kW发电机', type: 'B类-通用', status: 'idle', location: '北电项目部', owner: '北电' },
];

// 模拟数据：调度任务
const mockTasks = [
  { id: 'T-01', title: '张力机租赁申请', project: '遥龙500kV线路工程', status: 'pending', date: '2025-11-19' },
  { id: 'T-02', title: '挖掘机归还确认', project: '滇中配网改造', status: 'approved', date: '2025-11-18' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showScanner, setShowScanner] = useState(false);

  // 底部导航栏组件
  const TabBar = () => (
    <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 pb-5 px-2 shadow-lg z-50">
      <button 
        onClick={() => setActiveTab('dashboard')} 
        className={`flex flex-col items-center space-y-1 ${activeTab === 'dashboard' ? 'text-blue-600' : 'text-gray-400'}`}
      >
        <LayoutDashboard size={24} />
        <span className="text-xs">驾驶舱</span>
      </button>
      <button 
        onClick={() => setActiveTab('resources')} 
        className={`flex flex-col items-center space-y-1 ${activeTab === 'resources' ? 'text-blue-600' : 'text-gray-400'}`}
      >
        <Truck size={24} />
        <span className="text-xs">资源库</span>
      </button>
      <div className="relative -top-6">
        <button 
          onClick={() => setShowScanner(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-xl border-4 border-gray-50 flex flex-col items-center justify-center"
        >
          <QrCode size={28} />
        </button>
      </div>
      <button 
        onClick={() => setActiveTab('dispatch')} 
        className={`flex flex-col items-center space-y-1 ${activeTab === 'dispatch' ? 'text-blue-600' : 'text-gray-400'}`}
      >
        <ClipboardList size={24} />
        <span className="text-xs">调度中心</span>
      </button>
      <button 
        onClick={() => setActiveTab('profile')} 
        className={`flex flex-col items-center space-y-1 ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-400'}`}
      >
        <User size={24} />
        <span className="text-xs">我的</span>
      </button>
    </div>
  );

  // 扫码模拟界面
  if (showScanner) {
    return (
      <div className="h-screen bg-black relative flex flex-col items-center justify-center text-white">
        <div className="absolute top-4 right-4" onClick={() => setShowScanner(false)}>
          <span className="text-lg font-bold">关闭</span>
        </div>
        <div className="w-64 h-64 border-2 border-blue-500 rounded-lg relative mb-8 bg-transparent">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-blue-500"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-blue-500"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-blue-500"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-blue-500"></div>
          <div className="w-full h-1 bg-blue-500 absolute top-0 animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
        </div>
        <p className="text-gray-300 mb-2">将二维码/资产标签放入框内</p>
        <p className="text-xs text-gray-500">支持识别：设备入场、退场、巡检打卡</p>
        <button className="mt-8 bg-white/20 px-6 py-2 rounded-full text-sm">打开手电筒</button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 overflow-hidden flex flex-col font-sans text-gray-800">
      {/* 顶部状态栏模拟 */}
      <div className="bg-blue-600 text-white px-4 pt-8 pb-4 flex justify-between items-center shadow-md sticky top-0 z-40">
        <div>
          <div className="text-xs opacity-80">XJ · 机械化施工资源平台</div>
          <div className="text-lg font-bold flex items-center gap-2">
             {activeTab === 'dashboard' && '驾驶舱 Dashboard'}
             {activeTab === 'resources' && '设备资源库 Resource'}
             {activeTab === 'dispatch' && '调度中心 Dispatch'}
             {activeTab === 'profile' && '个人中心 Profile'}
          </div>
        </div>
        <div className="relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
        
        {/* 1. 驾驶舱视图 */}
        {activeTab === 'dashboard' && (
          <div className="p-4 space-y-4">
            {/* 快捷入口 Grid */}
            <div className="grid grid-cols-4 gap-2 bg-white p-4 rounded-xl shadow-sm">
              {[
                { icon: <Truck className="text-blue-500" />, label: '我要租设备' },
                { icon: <ClipboardList className="text-orange-500" />, label: '发布闲置' },
                { icon: <MapPin className="text-green-500" />, label: '设备地图' },
                { icon: <AlertTriangle className="text-red-500" />, label: '故障报修' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className="bg-gray-50 p-3 rounded-full">{item.icon}</div>
                  <span className="text-xs text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>

            {/* 核心指标卡片 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-white shadow-lg">
                <div className="text-xs opacity-80 mb-1">自有设备总数</div>
                <div className="text-2xl font-bold">142 <span className="text-xs font-normal">台</span></div>
                <div className="mt-2 text-xs bg-white/20 inline-block px-2 py-0.5 rounded">
                  利用率 78%
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">本月节约租赁费</div>
                <div className="text-2xl font-bold text-gray-800">24.5 <span className="text-xs font-normal">万</span></div>
                <div className="mt-2 text-xs text-green-600 flex items-center">
                  <CheckCircle size={12} className="mr-1"/> 同比增长 12%
                </div>
              </div>
            </div>

            {/* 待办任务列表 */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-800">待办任务</h3>
                <span className="text-xs text-blue-600">查看全部</span>
              </div>
              <div className="space-y-3">
                {mockTasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className={`mt-1 w-2 h-2 rounded-full ${task.status === 'pending' ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium text-sm">{task.title}</span>
                        <span className="text-xs text-gray-400">{task.date}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">项目：{task.project}</div>
                    </div>
                    <button className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full">处理</button>
                  </div>
                ))}
              </div>
            </div>

             {/* 模拟地图预览 */}
             <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-800">资源分布监控</h3>
              </div>
              <div className="h-32 bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-50 opacity-50"></div>
                {/* 模拟地图点 */}
                <div className="absolute top-10 left-10 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-md"></div>
                <div className="absolute top-20 right-20 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
                <div className="absolute bottom-10 left-1/2 w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow-md"></div>
                <span className="text-gray-400 text-xs z-10">IoT 地图加载中...</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. 资源库视图 */}
        {activeTab === 'resources' && (
          <div className="p-4 space-y-4">
            {/* 搜索栏 */}
            <div className="flex gap-2">
              <div className="flex-1 bg-white flex items-center px-3 py-2 rounded-lg shadow-sm border border-gray-200">
                <Search size={18} className="text-gray-400 mr-2" />
                <input type="text" placeholder="搜索设备名称/型号/编号" className="bg-transparent outline-none text-sm w-full" />
              </div>
              <button className="bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                <Filter size={20} className="text-gray-600" />
              </button>
            </div>

            {/* 分类标签 */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs whitespace-nowrap">全部</button>
              <button className="bg-white text-gray-600 px-4 py-1.5 rounded-full text-xs border border-gray-200 whitespace-nowrap">A类-战略</button>
              <button className="bg-white text-gray-600 px-4 py-1.5 rounded-full text-xs border border-gray-200 whitespace-nowrap">B类-通用</button>
              <button className="bg-white text-gray-600 px-4 py-1.5 rounded-full text-xs border border-gray-200 whitespace-nowrap">C类-易耗</button>
            </div>

            {/* 设备列表 */}
            <div className="space-y-3">
              {mockDevices.map((dev) => (
                <div key={dev.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-gray-800 flex items-center gap-2">
                        {dev.name}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${dev.type.includes('A类') ? 'text-purple-600 border-purple-200 bg-purple-50' : 'text-gray-600 border-gray-200 bg-gray-50'}`}>
                          {dev.type}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">编号: {dev.id}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      dev.status === 'idle' ? 'bg-green-100 text-green-700' : 
                      dev.status === 'rented' ? 'bg-blue-100 text-blue-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {dev.status === 'idle' ? '空闲' : dev.status === 'rented' ? '在租' : '维保'}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} /> {dev.location}
                    </div>
                    <div>权属: {dev.owner}</div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 bg-blue-50 text-blue-600 py-1.5 rounded text-xs font-medium">申请调拨</button>
                    <button className="flex-1 bg-gray-50 text-gray-600 py-1.5 rounded text-xs font-medium">查看详情</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. 调度中心视图 */}
        {activeTab === 'dispatch' && (
          <div className="p-4 space-y-4">
            {/* 发起新流程 */}
            <button className="w-full bg-blue-600 text-white py-3 rounded-xl shadow-lg flex items-center justify-center gap-2">
              <Plus size={20} /> 发起新的租赁需求
            </button>

            <div className="bg-white rounded-xl p-4 shadow-sm">
               <h3 className="font-bold text-gray-800 mb-4 text-sm">租赁进度追踪</h3>
               <div className="relative pl-4 border-l-2 border-gray-200 space-y-6">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-0 w-3 h-3 bg-blue-500 rounded-full ring-4 ring-white"></div>
                    <div className="text-sm font-bold text-gray-800">设备已出库，运输中</div>
                    <div className="text-xs text-gray-500 mt-1">订单号：RENT-20251108</div>
                    <div className="text-xs text-gray-400 mt-1">预计送达：今日 14:00</div>
                    <div className="mt-2 bg-gray-50 p-2 rounded text-xs flex items-center gap-2">
                      <Truck size={14} className="text-gray-500"/>
                      <span>车牌：云A·88888 (李师傅 139****1234)</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-0 w-3 h-3 bg-gray-300 rounded-full ring-4 ring-white"></div>
                    <div className="text-sm font-bold text-gray-400">等待现场签收</div>
                    <div className="text-xs text-gray-400 mt-1">请现场人员准备好企信扫码</div>
                  </div>
               </div>
            </div>

             <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-bold text-gray-800 mb-3 text-sm">历史单据</h3>
              {[1,2,3].map(i => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <div className="text-sm font-medium">张力机租赁单</div>
                    <div className="text-xs text-gray-400">2025-10-1{i}</div>
                  </div>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">已完成</span>
                </div>
              ))}
             </div>
          </div>
        )}

        {/* 4. 个人中心/我的 */}
        {activeTab === 'profile' && (
          <div className="p-4">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white shadow-lg mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
                  何
                </div>
                <div>
                  <div className="font-bold text-lg">何星</div>
                  <div className="text-xs opacity-80 mt-1">市场经营部 · 专责</div>
                  <div className="text-xs opacity-60 mt-0.5">投控集团</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {[
                {icon: <ClipboardList size={18}/>, label: '我的审批', sub: '3个待处理'},
                {icon: <Truck size={18}/>, label: '我经手的设备', sub: '5台在租'},
                {icon: <CheckCircle size={18}/>, label: '扫码记录', sub: ''},
                {icon: <Settings size={18}/>, label: '系统设置', sub: ''},
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 active:bg-gray-100">
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="text-gray-400">{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.sub && <span className="text-xs text-red-500">{item.sub}</span>}
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center text-xs text-gray-400">
              v1.0.0 (MVP)
            </div>
          </div>
        )}
      </div>

      {/* 底部导航 */}
      <TabBar />
    </div>
  );
}