import React, { useState, useEffect } from 'react';
import { Router, SpeedProfile, Voucher, Subscriber, ActiveSession } from '../types';
import { 
  Wifi, Cpu, Users, Layers, Shield, FileText, Zap, Plus, Search, 
  Trash2, Play, RefreshCw, Printer, ToggleLeft, ToggleRight, X, Power, Signal, Download, Upload, Activity
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ISPPanelProps {
  onBack: () => void;
  onOpenMobileSim: () => void;
  vouchers: Voucher[];
  setVouchers: React.Dispatch<React.SetStateAction<Voucher[]>>;
  subscribers: Subscriber[];
  setSubscribers: React.Dispatch<React.SetStateAction<Subscriber[]>>;
  activeSessions: ActiveSession[];
  setActiveSessions: React.Dispatch<React.SetStateAction<ActiveSession[]>>;
}

const INITIAL_ROUTERS: Router[] = [
  {
    id: 'r1',
    name: 'مايكروتك البرج الرئيسي (CCR1036)',
    ipAddress: '197.34.120.45',
    dnsName: 'router1.localnet.com',
    radiusSecret: 'SuperSecretRadiusKey999',
    apiPort: 8728,
    apiUser: 'radius_api',
    apiPass: 'ApiPass4321',
    status: 'online',
    location: 'برج الاتصالات - الحي الغربي',
    model: 'MikroTik CCR1036-12G-4S+',
    activeUsers: 840,
    cpuUsage: 14,
    ramUsage: 35,
    uptime: '15d 4h 12m',
  },
  {
    id: 'r2',
    name: 'مايكروتك فرع الياسمين (hEX gr3)',
    ipAddress: '197.34.120.46',
    radiusSecret: 'SuperSecretRadiusKey999',
    apiPort: 8728,
    apiUser: 'radius_api',
    apiPass: 'ApiPass4321',
    status: 'online',
    location: 'سنترال حي الياسمين',
    model: 'MikroTik hEX gr3 (RB750Gr3)',
    activeUsers: 120,
    cpuUsage: 45,
    ramUsage: 62,
    uptime: '3d 18h 5m',
  },
  {
    id: 'r3',
    name: 'مايكروتك صالة أفراح الشوق (RB4011)',
    ipAddress: '10.20.10.5',
    radiusSecret: 'SecretWeddingKey',
    apiPort: 8728,
    apiUser: 'admin',
    apiPass: 'AdminWeddingPass',
    status: 'offline',
    location: 'صالة أفراح الشوق',
    model: 'MikroTik RB4011iGS+RM',
    activeUsers: 0,
    cpuUsage: 0,
    ramUsage: 0,
    uptime: '0h 0m',
  }
];

const INITIAL_PROFILES: SpeedProfile[] = [
  { id: 'p1', name: 'سرعة 5 ميجا - تحميل غير محدود', downloadLimit: '5M', uploadLimit: '2M', rateLimitString: '2M/5M', price: 15, validityDays: 30 },
  { id: 'p2', name: 'سرعة 10 ميجا - فئة رجال الأعمال', downloadLimit: '10M', uploadLimit: '5M', rateLimitString: '5/10M', price: 30, validityDays: 30 },
  { id: 'p3', name: 'باقة هوتسبوت يومية - 2 جيجا كاب', downloadLimit: '4M', uploadLimit: '1M', rateLimitString: '1M/4M', price: 2, validityDays: 1, quotaLimitGb: 2 },
  { id: 'p4', name: 'سرعة 2 ميجا - الباقة المخفضة', downloadLimit: '2M', uploadLimit: '512K', rateLimitString: '512K/2M', price: 8, validityDays: 30 },
];

export default function ISPPanel({ 
  onBack, 
  onOpenMobileSim, 
  vouchers, 
  setVouchers, 
  subscribers, 
  setSubscribers, 
  activeSessions, 
  setActiveSessions 
}: ISPPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'routers' | 'profiles' | 'vouchers' | 'subscribers' | 'sessions'>('dashboard');
  
  const [routers, setRouters] = useState<Router[]>(INITIAL_ROUTERS);
  const [profiles, setProfiles] = useState<SpeedProfile[]>(INITIAL_PROFILES);

  // Filter and search states
  const [routerSearch, setRouterSearch] = useState('');
  const [voucherFilter, setVoucherFilter] = useState('all');
  const [subscriberSearch, setSubscriberSearch] = useState('');
  const [subscriberFilter, setSubscriberFilter] = useState('all');

  // Generator form states
  const [genCount, setGenCount] = useState(20);
  const [genProfile, setGenProfile] = useState('p1');
  const [genPrefix, setGenPrefix] = useState('WiFi-');
  const [genCodeLength, setGenCodeLength] = useState(6);
  const [genHasPassword, setGenHasPassword] = useState(false);
  const [isVoucherPrintViewOpen, setIsVoucherPrintViewOpen] = useState(false);
  const [printedVouchers, setPrintedVouchers] = useState<Voucher[]>([]);

  // Add router states
  const [isAddRouterOpen, setIsAddRouterOpen] = useState(false);
  const [newRouter, setNewRouter] = useState({
    name: '', ipAddress: '', radiusSecret: 'radiusKey123',
    apiPort: 8728, apiUser: 'admin', apiPass: '', location: '', model: 'MikroTik CCR2004'
  });

  // Add subscriber states
  const [isAddSubOpen, setIsAddSubOpen] = useState(false);
  const [newSub, setNewSub] = useState({
    username: '', phone: '', profileId: 'p1', type: 'hotspot' as 'pppoe' | 'hotspot', macAddress: '', notes: ''
  });

  // Simulated live traffic data (Mbps)
  const [trafficData, setTrafficData] = useState<any[]>([
    { name: '08:00', upload: 45, download: 180 },
    { name: '08:05', upload: 52, download: 210 },
    { name: '08:10', upload: 58, download: 245 },
    { name: '08:15', upload: 49, download: 195 },
    { name: '08:20', upload: 65, download: 280 },
    { name: '08:25', upload: 72, download: 310 },
    { name: '08:30', upload: 80, download: 340 },
    { name: '08:35', upload: 75, download: 322 },
  ]);

  // Update dynamic metrics & traffic simulation
  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate live bandwidth changes
      setTrafficData(prev => {
        const nextTime = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
        const lastVal = prev[prev.length - 1];
        const deltaDown = Math.floor((Math.random() - 0.5) * 40);
        const deltaUp = Math.floor((Math.random() - 0.5) * 10);
        
        const nextDownload = Math.max(100, Math.min(500, (lastVal ? lastVal.download : 250) + deltaDown));
        const nextUpload = Math.max(30, Math.min(120, (lastVal ? lastVal.upload : 60) + deltaUp));
        
        return [...prev.slice(1), { name: nextTime, upload: nextUpload, download: nextDownload }];
      });

      // Simulate minor active user fluctuation
      setRouters(prev => prev.map(r => {
        if (r.status === 'online') {
          const delta = Math.floor((Math.random() - 0.5) * 6);
          const nextUsers = Math.max(50, r.activeUsers + delta);
          return {
            ...r,
            activeUsers: nextUsers,
            cpuUsage: Math.max(5, Math.min(95, r.cpuUsage + Math.floor((Math.random() - 0.5) * 4))),
            ramUsage: Math.max(20, Math.min(90, r.ramUsage + Math.floor((Math.random() - 0.5) * 2)))
          };
        }
        return r;
      }));
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // Handle Voucher Generation
  const handleGenerateVouchers = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedProf = profiles.find(p => p.id === genProfile);
    if (!selectedProf) return;

    const newGenList: Voucher[] = [];
    const timestamp = new Date().toISOString().split('T')[0];

    for (let i = 0; i < genCount; i++) {
      const serial = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      let code = genPrefix;
      
      if (genCodeLength > 0) {
        const chars = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; // Easy-to-read uppercase alphanumeric
        for (let c = 0; c < genCodeLength; c++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
      }

      const voucherItem: Voucher = {
        id: 'v_' + Math.random().toString(36).substr(2, 9),
        code: code,
        password: genHasPassword ? Math.floor(1000 + Math.random() * 9000).toString() : undefined,
        profileId: genProfile,
        profileName: selectedProf.name,
        serialNumber: serial,
        isUsed: false,
        createdAt: timestamp,
        price: selectedProf.price
      };
      newGenList.push(voucherItem);
    }

    setVouchers(prev => [...newGenList, ...prev]);
    setPrintedVouchers(newGenList);
    setIsVoucherPrintViewOpen(true);
  };

  // Add router handler
  const handleAddRouter = (e: React.FormEvent) => {
    e.preventDefault();
    const routerItem: Router = {
      id: 'r_' + Math.random().toString(36).substr(2, 9),
      ...newRouter,
      status: 'online',
      activeUsers: 0,
      cpuUsage: 12,
      ramUsage: 28,
      uptime: '0m',
    };
    setRouters([...routers, routerItem]);
    setIsAddRouterOpen(false);
  };

  // Add manual subscriber handler
  const handleAddSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedProf = profiles.find(p => p.id === newSub.profileId);
    if (!selectedProf) return;

    const subItem: Subscriber = {
      id: 'sub_' + Math.random().toString(36).substr(2, 9),
      username: newSub.username,
      phone: newSub.phone,
      profileId: newSub.profileId,
      profileName: selectedProf.name,
      type: newSub.type,
      macAddress: newSub.macAddress || undefined,
      status: 'active',
      expirationDate: new Date(Date.now() + selectedProf.validityDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: newSub.notes || undefined,
      totalDataUsedGb: 0
    };

    setSubscribers([subItem, ...subscribers]);
    setIsAddSubOpen(false);
    setNewSub({
      username: '', phone: '', profileId: 'p1', type: 'hotspot', macAddress: '', notes: ''
    });
  };

  // Disconnect/Kick Active Session
  const handleKickSession = (sessionId: string, username: string) => {
    if (window.confirm(`هل أنت متأكد من فصل المستخدم "${username}"؟ سيتم إرسال إشعار قطع فوري CoA/PoD إلى راوتر ميكروتك.`)) {
      setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
      
      // Update subscriber active users logic
      setRouters(prev => prev.map(r => {
        if (r.status === 'online' && r.activeUsers > 0) {
          return { ...r, activeUsers: r.activeUsers - 1 };
        }
        return r;
      }));
    }
  };

  // Delete router
  const handleDeleteRouter = (id: string, name: string) => {
    if (window.confirm(`هل تريد بالتأكيد إزالة جهاز المايكروتك "${name}" من إعدادات الريديوس؟`)) {
      setRouters(routers.filter(r => r.id !== id));
    }
  };

  // Delete voucher
  const handleDeleteVoucher = (id: string) => {
    if (window.confirm('هل تريد حذف الكارت المولد؟')) {
      setVouchers(vouchers.filter(v => v.id !== id));
    }
  };

  // Totals calculations
  const totalActiveUsers = routers.reduce((sum, r) => sum + r.activeUsers, 0);
  const onlineRoutersCount = routers.filter(r => r.status === 'online').length;

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Top Navbar */}
      <header className="border-b border-slate-900 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/15">
              <Wifi size={20} className="animate-pulse" />
            </div>
            <div>
              <span className="text-base font-black text-white">لوحة تحكم RADIUS</span>
              <span className="text-slate-500 text-[10px] block font-mono">CLIENT NETWORKS PORTAL</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMobileSim}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg text-xs font-bold transition-all hover:shadow-md hover:shadow-sky-500/10"
            >
              <Zap size={13} />
              <span>محاكاة تطبيق الموبايل للعملاء</span>
            </button>
            <button
              onClick={onBack}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded-lg text-xs font-medium transition-colors"
            >
              الصفحة الرئيسية للمشروع
            </button>
          </div>
        </div>
      </header>

      {/* Workspace Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Navigation Sidebar */}
        <nav className="lg:col-span-3 bg-slate-900/60 border border-slate-900 p-4 rounded-2xl flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 shrink-0">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold w-full whitespace-nowrap transition-colors justify-start ${
              activeTab === 'dashboard' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
            }`}
          >
            <Cpu size={18} />
            <span>لوحة التحكم والشبكة</span>
          </button>

          <button 
            onClick={() => setActiveTab('routers')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold w-full whitespace-nowrap transition-colors justify-start ${
              activeTab === 'routers' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
            }`}
          >
            <Wifi size={18} />
            <span>أجهزة المايكروتك ({routers.length})</span>
          </button>

          <button 
            onClick={() => setActiveTab('profiles')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold w-full whitespace-nowrap transition-colors justify-start ${
              activeTab === 'profiles' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
            }`}
          >
            <Layers size={18} />
            <span>باقات السرعة ({profiles.length})</span>
          </button>

          <button 
            onClick={() => setActiveTab('vouchers')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold w-full whitespace-nowrap transition-colors justify-start ${
              activeTab === 'vouchers' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
            }`}
          >
            <FileText size={18} />
            <span>مولد كروت الهوتسبوت ({vouchers.length})</span>
          </button>

          <button 
            onClick={() => setActiveTab('subscribers')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold w-full whitespace-nowrap transition-colors justify-start ${
              activeTab === 'subscribers' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
            }`}
          >
            <Users size={18} />
            <span>المشتركين الدائمين ({subscribers.length})</span>
          </button>

          <button 
            onClick={() => setActiveTab('sessions')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold w-full whitespace-nowrap transition-colors justify-start ${
              activeTab === 'sessions' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
            }`}
          >
            <Shield size={18} />
            <span>الجلسات المفتوحة الآن ({activeSessions.length})</span>
          </button>
        </nav>

        {/* Content Section */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* 1. Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Stat Boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-900 p-4 rounded-xl">
                  <span className="text-slate-500 text-xs block mb-1">المستخدمين النشطين (Active Sessions)</span>
                  <span className="text-2xl font-extrabold text-white font-mono">{totalActiveUsers}</span>
                  <span className="text-[10px] text-emerald-400 block mt-1">متصل في هذه اللحظة</span>
                </div>
                <div className="bg-slate-900 border border-slate-900 p-4 rounded-xl">
                  <span className="text-slate-500 text-xs block mb-1">حالة أجهزة المايكروتك</span>
                  <span className="text-2xl font-extrabold text-white font-mono">{onlineRoutersCount} / {routers.length}</span>
                  <span className="text-[10px] text-emerald-400 block mt-1">أونلاين وجاهز بالـ API</span>
                </div>
                <div className="bg-slate-900 border border-slate-900 p-4 rounded-xl">
                  <span className="text-slate-500 text-xs block mb-1">الكروت غير المستعملة</span>
                  <span className="text-2xl font-extrabold text-white font-mono">{vouchers.filter(v => !v.isUsed).length}</span>
                  <span className="text-[10px] text-sky-400 block mt-1">جاهزة للمبيعات والتوزيع</span>
                </div>
                <div className="bg-slate-900 border border-slate-900 p-4 rounded-xl">
                  <span className="text-slate-500 text-xs block mb-1">معدل البنج مع خادم الريديوس</span>
                  <span className="text-2xl font-extrabold text-white font-mono">1.2ms</span>
                  <span className="text-[10px] text-purple-400 block mt-1">سرعة استجابة فائقة</span>
                </div>
              </div>

              {/* Bandwidth Traffic Charts */}
              <div className="bg-slate-900 border border-slate-900 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Activity size={16} className="text-sky-400" />
                      <span>حجم البيانات اللحظي المار عبر الشبكة (Real-time Net-Flow)</span>
                    </h3>
                    <span className="text-[10px] text-slate-500 block">يتم تحديث البيانات تلقائياً من المايكروتك عبر الريديوس</span>
                  </div>
                  <div className="flex gap-4 text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-sky-400">
                      <span className="w-2.5 h-2.5 rounded bg-sky-500" />
                      تنزيل (Download)
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                      رفع (Upload)
                    </span>
                  </div>
                </div>

                <div className="h-64 w-full text-left" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} unit="M" />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }} />
                      <Area type="monotone" dataKey="download" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorDownload)" />
                      <Area type="monotone" dataKey="upload" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorUpload)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quick Action Alerts */}
              <div className="bg-slate-900 border border-slate-900 p-5 rounded-2xl">
                <h3 className="text-sm font-bold text-white mb-3">حالة الاتصالات ومراقبة RADIUS AAA</h3>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-900 text-xs">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>قاعدة بيانات ريديوس MySQL متصلة وخفيفة</span>
                    </span>
                    <span className="text-slate-500">100% جهوزية</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-900 text-xs">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>بروتوكول COA (Disconnect Messages) مفعل على بورت 3799</span>
                    </span>
                    <span className="text-slate-500">منفذ 1700 / 3799</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-900 text-xs">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-400" />
                      <span>راوتر "صالة أفراح الشوق" غير قادر على الاتصال بسيرفر RADIUS</span>
                    </span>
                    <span className="text-red-400 font-bold">قطع اتصال</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* 2. Routers Tab */}
          {activeTab === 'routers' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-white">إدارة أجهزة المايكروتك (MikroTik Devices)</h2>
                  <p className="text-xs text-slate-400 mt-1">أضف وتحكم في راوترات المايكروتك التي تتواصل مع خادم الريديوس على أوبونتو</p>
                </div>
                <button 
                  onClick={() => setIsAddRouterOpen(true)}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-lg flex items-center gap-2"
                >
                  <Plus size={16} />
                  <span>إضافة راوتر جديد</span>
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="ابحث بالاسم، الآي بي، أو الموديل..."
                  value={routerSearch}
                  onChange={(e) => setRouterSearch(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Router Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {routers.filter(r => r.name.includes(routerSearch) || r.ipAddress.includes(routerSearch)).map((router) => (
                  <div key={router.id} className="bg-slate-900 border border-slate-850 rounded-2xl p-5 relative overflow-hidden group">
                    <div className="absolute top-4 left-4">
                      {router.status === 'online' ? (
                        <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          متصل بالـ API
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold flex items-center gap-1.5">
                          غير متصل
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white mb-1 pr-1">{router.name}</h3>
                    <span className="text-xs font-mono text-slate-500">{router.model}</span>
                    
                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs border-t border-slate-850 pt-3">
                      <div>
                        <span className="text-slate-500 block mb-0.5">آي بي الراوتر (IP)</span>
                        <span className="font-mono text-white font-bold">{router.ipAddress}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-0.5">منفذ API</span>
                        <span className="font-mono text-white font-bold">{router.apiPort}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-0.5">مفتاح ريديوس (Secret)</span>
                        <span className="font-mono text-sky-400 select-all font-bold">{router.radiusSecret}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-0.5">وقت التشغيل المتواصل</span>
                        <span className="font-mono text-slate-300">{router.status === 'online' ? router.uptime : '-'}</span>
                      </div>
                    </div>

                    {router.status === 'online' && (
                      <div className="mt-4 grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-xl text-center">
                        <div>
                          <span className="text-[9px] text-slate-500 block mb-0.5">المعالج (CPU)</span>
                          <span className="font-mono font-bold text-white text-xs">{router.cpuUsage}%</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block mb-0.5">الذاكرة (RAM)</span>
                          <span className="font-mono font-bold text-white text-xs">{router.ramUsage}%</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block mb-0.5">المستخدمين</span>
                          <span className="font-mono font-bold text-sky-400 text-xs">{router.activeUsers}</span>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-slate-850 flex justify-between items-center">
                      <span className="text-xs text-slate-500">{router.location}</span>
                      <button 
                        onClick={() => handleDeleteRouter(router.id, router.name)}
                        className="p-1.5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                        title="حذف الراوتر"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Speed Profiles Tab */}
          {activeTab === 'profiles' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-white">باقات السرعات والأسعار (QoS RADIUS Profiles)</h2>
                  <p className="text-xs text-slate-400 mt-1">تحديد حدود التحميل والرفع التي يرسلها سيرفر ريديوس للشبكة لكل كارت أو حساب</p>
                </div>
                <button 
                  onClick={() => {
                    const name = prompt('أدخل اسم باقة السرعة الجديدة:');
                    const limit = prompt('أدخل قيمة Mikrotik-Rate-Limit (مثال: 2M/5M لـ 2 ميجا رفع و 5 ميجا تحميل):', '2M/5M');
                    const priceStr = prompt('أدخل سعر الباقة بالعملة المحلية (مثال: 20):', '20');
                    const daysStr = prompt('أدخل صلاحية الباقة بالأيام (مثال: 30):', '30');

                    if (name && limit && priceStr && daysStr) {
                      const newProfile: SpeedProfile = {
                        id: 'p_' + Math.random().toString(36).substr(2, 9),
                        name,
                        downloadLimit: limit.split('/')[1] || '5M',
                        uploadLimit: limit.split('/')[0] || '2M',
                        rateLimitString: limit,
                        price: parseFloat(priceStr) || 20,
                        validityDays: parseInt(daysStr) || 30,
                      };
                      setProfiles([...profiles, newProfile]);
                    }
                  }}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-lg flex items-center gap-2"
                >
                  <Plus size={16} />
                  <span>باقة سرعة جديدة</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profiles.map((prof) => (
                  <div key={prof.id} className="bg-slate-900 border border-slate-850 rounded-2xl p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-bold text-white">{prof.name}</h3>
                        <span className="text-xs text-slate-500 font-mono">ID: {prof.id}</span>
                      </div>
                      <span className="text-lg font-extrabold text-emerald-400 font-mono">${prof.price}</span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-xl">
                      <div>
                        <span className="text-slate-500 block mb-0.5">حد التنزيل (Download)</span>
                        <span className="font-bold text-white text-sm">{prof.downloadLimit}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-0.5">حد الرفع (Upload)</span>
                        <span className="font-bold text-white text-sm">{prof.uploadLimit}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-0.5">RADIUS Attribute (Rate-Limit)</span>
                        <span className="font-bold text-sky-400 font-mono select-all text-xs block mt-1 bg-slate-900 px-2 py-1 rounded w-fit">{prof.rateLimitString}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-0.5">فترة الصلاحية بالأيام</span>
                        <span className="font-bold text-white text-sm">{prof.validityDays} يوم</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Voucher Generator Tab */}
          {activeTab === 'vouchers' && (
            <div className="space-y-6">
              
              {/* Top Layout */}
              <div className="bg-slate-900 border border-slate-900 p-6 rounded-2xl">
                <h2 className="text-base font-black text-white mb-4">توليد كروت جديدة بكميات كبيرة (Bulk Hotspot Voucher Generator)</h2>
                
                <form onSubmit={handleGenerateVouchers} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-bold">باقة السرعة المستهدفة</label>
                    <select
                      value={genProfile}
                      onChange={(e) => setGenProfile(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold focus:outline-none"
                    >
                      {profiles.map(p => (
                        <option key={p.id} value={p.id}>{p.name} - (${p.price})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-bold">عدد الكروت المطلوب توليدها</label>
                    <input 
                      type="number" 
                      min={1} 
                      max={500} 
                      value={genCount}
                      onChange={(e) => setGenCount(parseInt(e.target.value) || 10)}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-bold">حروف تمهيدية للكود (Prefix)</label>
                    <input 
                      type="text" 
                      placeholder="مثال: WIFI-"
                      value={genPrefix}
                      onChange={(e) => setGenPrefix(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-bold">طول الكود العشوائي</label>
                    <select
                      value={genCodeLength}
                      onChange={(e) => setGenCodeLength(parseInt(e.target.value) || 6)}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold focus:outline-none"
                    >
                      <option value={4}>4 خانات (سهل الحفظ)</option>
                      <option value={6}>6 خانات (آمن ومستقر)</option>
                      <option value={8}>8 خانات (فائق الأمان)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 mt-5">
                    <input 
                      type="checkbox" 
                      id="has_pass"
                      checked={genHasPassword}
                      onChange={(e) => setGenHasPassword(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-sky-500 focus:ring-0"
                    />
                    <label htmlFor="has_pass" className="text-xs text-slate-300 font-bold select-none cursor-pointer">
                      توليد كود بكلمة مرور منفصلة
                    </label>
                  </div>

                  <div className="sm:col-span-1 mt-4">
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Zap size={14} />
                      <span>توليد وتصدير للطباعة</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Vouchers Database Table */}
              <div className="bg-slate-900 border border-slate-900 p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-base font-bold text-white">سجل الكروت المولدة (RADIUS radcheck Db)</h3>
                    <p className="text-xs text-slate-400 mt-1">توليد حسابات الهوتسبوت الجاهزة للبيع</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setVoucherFilter('all')}
                      className={`px-3 py-1 rounded text-xs font-semibold ${voucherFilter === 'all' ? 'bg-sky-500 text-slate-950' : 'bg-slate-950 text-slate-400'}`}
                    >
                      الكل ({vouchers.length})
                    </button>
                    <button
                      onClick={() => setVoucherFilter('unused')}
                      className={`px-3 py-1 rounded text-xs font-semibold ${voucherFilter === 'unused' ? 'bg-sky-500 text-slate-950' : 'bg-slate-950 text-slate-400'}`}
                    >
                      غير مستخدم ({vouchers.filter(v => !v.isUsed).length})
                    </button>
                    <button
                      onClick={() => setVoucherFilter('used')}
                      className={`px-3 py-1 rounded text-xs font-semibold ${voucherFilter === 'used' ? 'bg-sky-500 text-slate-950' : 'bg-slate-950 text-slate-400'}`}
                    >
                      مستخدم ({vouchers.filter(v => v.isUsed).length})
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-900 text-slate-400 uppercase font-semibold border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-3">كود الاتصال</th>
                        <th className="px-4 py-3">كلمة المرور</th>
                        <th className="px-4 py-3">الباقة</th>
                        <th className="px-4 py-3">الرقم التسلسلي</th>
                        <th className="px-4 py-3">السعر</th>
                        <th className="px-4 py-3">الحالة</th>
                        <th className="px-4 py-3 text-left">إجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {vouchers.filter(v => {
                        if (voucherFilter === 'used') return v.isUsed;
                        if (voucherFilter === 'unused') return !v.isUsed;
                        return true;
                      }).length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                            لا يوجد كروت مطابقة للفلاتر حالياً
                          </td>
                        </tr>
                      ) : (
                        vouchers.filter(v => {
                          if (voucherFilter === 'used') return v.isUsed;
                          if (voucherFilter === 'unused') return !v.isUsed;
                          return true;
                        }).map((voucher) => (
                          <tr key={voucher.id} className="hover:bg-slate-900/40 font-mono">
                            <td className="px-4 py-3 font-bold text-white text-sm select-all">{voucher.code}</td>
                            <td className="px-4 py-3 text-slate-400">{voucher.password || 'لا يوجد'}</td>
                            <td className="px-4 py-3 text-slate-300 font-sans">{voucher.profileName}</td>
                            <td className="px-4 py-3 text-slate-500 text-[10px]">{voucher.serialNumber}</td>
                            <td className="px-4 py-3 text-emerald-400 font-bold">${voucher.price}</td>
                            <td className="px-4 py-3 font-sans">
                              {voucher.isUsed ? (
                                <span className="px-2 py-0.5 text-[10px] rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                  تم الشحن
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  متاح للبيع
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-left">
                              <button 
                                onClick={() => handleDeleteVoucher(voucher.id)}
                                className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* 5. Subscribers Tab */}
          {activeTab === 'subscribers' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-white">المشتركين الدائمين (PPPoE & Static Accounts)</h2>
                  <p className="text-xs text-slate-400 mt-1">حسابات المشتركين المنزليين والشركات مع صلاحيات انتهاء وتاريخ تجديد محدد</p>
                </div>
                <button 
                  onClick={() => setIsAddSubOpen(true)}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-lg flex items-center gap-2"
                >
                  <Plus size={16} />
                  <span>إضافة مشترك دائم</span>
                </button>
              </div>

              {/* Search subscriber */}
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="بحث بالمشترك أو الهاتف..."
                    value={subscriberSearch}
                    onChange={(e) => setSubscriberSearch(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <select
                  value={subscriberFilter}
                  onChange={(e) => setSubscriberFilter(e.target.value)}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold focus:outline-none"
                >
                  <option value="all">كل أنواع الاتصال</option>
                  <option value="pppoe">PPPoE منزلي</option>
                  <option value="hotspot">Hotspot وايرلس</option>
                </select>
              </div>

              {/* Subscribers Table */}
              <div className="bg-slate-900 border border-slate-900 p-6 rounded-2xl">
                <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-900 text-slate-400 uppercase font-semibold border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-3">اسم المستخدم / الهاتف</th>
                        <th className="px-4 py-3">نوع الحساب</th>
                        <th className="px-4 py-3">باقة السرعة</th>
                        <th className="px-4 py-3">تاريخ الانتهاء</th>
                        <th className="px-4 py-3">مجموع الاستهلاك</th>
                        <th className="px-4 py-3">الحالة</th>
                        <th className="px-4 py-3 text-left">إجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {subscribers.filter(s => {
                        const matchesSearch = s.username.includes(subscriberSearch) || s.phone.includes(subscriberSearch);
                        const matchesFilter = subscriberFilter === 'all' || s.type === subscriberFilter;
                        return matchesSearch && matchesFilter;
                      }).map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-900/40">
                          <td className="px-4 py-3">
                            <span className="font-bold text-white block text-sm">{sub.username}</span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">{sub.phone}</span>
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-slate-300 uppercase">
                            {sub.type === 'pppoe' ? (
                              <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
                                PPPoE
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400">
                                Hotspot
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-300 font-semibold">{sub.profileName}</td>
                          <td className="px-4 py-3 font-mono text-slate-400">{sub.expirationDate}</td>
                          <td className="px-4 py-3 font-mono text-slate-300">{sub.totalDataUsedGb} GB</td>
                          <td className="px-4 py-3">
                            {sub.status === 'active' ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                نشط ومجدد
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                معطل / منتهي
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-left">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => {
                                  const confirmMsg = sub.status === 'active' ? 'تعطيل حساب المشترك؟' : 'إعادة تجديد وتفعيل حساب المشترك؟';
                                  if (window.confirm(confirmMsg)) {
                                    setSubscribers(subscribers.map(s => {
                                      if (s.id === sub.id) {
                                        return { ...s, status: s.status === 'active' ? 'expired' : 'active' };
                                      }
                                      return s;
                                    }));
                                  }
                                }}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  sub.status === 'active' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                                }`}
                              >
                                {sub.status === 'active' ? 'إيقاف' : 'تفعيل'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 6. Active Sessions Tab */}
          {activeTab === 'sessions' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white">الجلسات المفتوحة للمستخدمين (RADIUS active accounting sessions)</h2>
                <p className="text-xs text-slate-400 mt-1">العملاء المتصلين الآن بأجهزة ميكروتك ويتحكم خادم ريديوس بجلساتهم وسرعاتهم</p>
              </div>

              <div className="bg-slate-900 border border-slate-900 p-6 rounded-2xl">
                <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-900 text-slate-400 uppercase font-semibold border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-3">اسم المشترك / الماك (MAC)</th>
                        <th className="px-4 py-3">آي بي العميل (IP)</th>
                        <th className="px-4 py-3">راوتر البث (NAS IP)</th>
                        <th className="px-4 py-3">وقت الاتصال</th>
                        <th className="px-4 py-3">سرعة الباقة</th>
                        <th className="px-4 py-3">بيانات (رفع/تنزيل)</th>
                        <th className="px-4 py-3 text-left">فصل فوري</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {activeSessions.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                            لا يوجد مستخدمين متصلين حالياً بالشبكة
                          </td>
                        </tr>
                      ) : (
                        activeSessions.map((session) => (
                          <tr key={session.id} className="hover:bg-slate-900/40 font-mono">
                            <td className="px-4 py-3">
                              <span className="font-bold text-white block text-sm font-sans">{session.username}</span>
                              <span className="text-[10px] text-slate-500 block mt-0.5">{session.callerId}</span>
                            </td>
                            <td className="px-4 py-3 text-slate-300">{session.ipAddress}</td>
                            <td className="px-4 py-3 text-slate-400 text-[10px]">{session.nasIpAddress}</td>
                            <td className="px-4 py-3 text-slate-300">{session.uptime}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] font-bold">
                                {session.rateLimit}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-emerald-400 flex items-center gap-1">
                                <Upload size={10} />
                                {(session.uploadBytes / 1024 / 1024).toFixed(1)} MB
                              </span>
                              <span className="text-sky-400 flex items-center gap-1 mt-0.5">
                                <Download size={10} />
                                {(session.downloadBytes / 1024 / 1024).toFixed(1)} MB
                              </span>
                            </td>
                            <td className="px-4 py-3 text-left">
                              <button 
                                onClick={() => handleKickSession(session.id, session.username)}
                                className="px-2.5 py-1 text-[10px] font-bold rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors flex items-center gap-1 ml-0"
                              >
                                <Power size={11} />
                                <span>Kick (PoD)</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 1. Add Router Modal */}
      {isAddRouterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-extrabold text-white">إضافة جهاز مايكروتك (RADIUS NAS)</h3>
              <button onClick={() => setIsAddRouterOpen(false)} className="p-1 hover:bg-slate-850 rounded-lg text-slate-400">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddRouter} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-bold">اسم الجهاز (معرّف للشبكة)</label>
                <input 
                  type="text" required placeholder="مثال: راوتر البرج الرئيسي"
                  value={newRouter.name}
                  onChange={(e) => setNewRouter({...newRouter, name: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-bold">عنوان الآي بي المكتبي / الثابت</label>
                  <input 
                    type="text" required placeholder="197.45.12.33"
                    value={newRouter.ipAddress}
                    onChange={(e) => setNewRouter({...newRouter, ipAddress: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 text-left focus:outline-none" dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-bold">الموديل (Hardware)</label>
                  <input 
                    type="text" placeholder="MikroTik CCR2004"
                    value={newRouter.model}
                    onChange={(e) => setNewRouter({...newRouter, model: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-bold">كلمة سر الريديوس (RADIUS Secret Key)</label>
                <input 
                  type="text" required
                  value={newRouter.radiusSecret}
                  onChange={(e) => setNewRouter({...newRouter, radiusSecret: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-sky-400 font-mono focus:outline-none"
                />
              </div>
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddRouterOpen(false)} className="px-4 py-2 bg-slate-950 border border-slate-800 text-slate-400 rounded-lg text-xs font-semibold">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-xs">إضافة للريديوس</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add Subscriber Modal */}
      {isAddSubOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-extrabold text-white">إضافة مشترك منزلي دائم (PPPoE / Mac)</h3>
              <button onClick={() => setIsAddSubOpen(false)} className="p-1 hover:bg-slate-850 rounded-lg text-slate-400">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSubscriber} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-bold">اسم المستخدم (المصادقة)</label>
                <input 
                  type="text" required placeholder="مثال: customer_mohamed"
                  value={newSub.username}
                  onChange={(e) => setNewSub({...newSub, username: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none text-left" dir="ltr"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-bold">رقم الهاتف للواتساب</label>
                  <input 
                    type="text" required placeholder="+96650..."
                    value={newSub.phone}
                    onChange={(e) => setNewSub({...newSub, phone: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none text-left" dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-bold">نوع الحساب</label>
                  <select
                    value={newSub.type}
                    onChange={(e) => setNewSub({...newSub, type: e.target.value as 'pppoe' | 'hotspot'})}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none"
                  >
                    <option value="pppoe">اتصال منزلي (PPPoE)</option>
                    <option value="hotspot">اتصال هوتسبوت (Hotspot)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-bold">باقة السرعة</label>
                  <select
                    value={newSub.profileId}
                    onChange={(e) => setNewSub({...newSub, profileId: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none"
                  >
                    {profiles.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-bold">الماك أدرس (MAC) - اختياري</label>
                  <input 
                    type="text" placeholder="00:11:22:33:AA:BB"
                    value={newSub.macAddress}
                    onChange={(e) => setNewSub({...newSub, macAddress: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 text-left focus:outline-none" dir="ltr"
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddSubOpen(false)} className="px-4 py-2 bg-slate-950 border border-slate-800 text-slate-400 rounded-lg text-xs font-semibold">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-xs">تفعيل وإضافة</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Vouchers Beautiful Print/PDF Template Modal */}
      {isVoucherPrintViewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-4 no-print">
              <div>
                <h3 className="font-extrabold text-white text-lg">تصدير الكروت المولدة بنجاح للطباعة</h3>
                <p className="text-xs text-slate-400 mt-1">تنسيق مثالي وجاهز للمطابع والمحلات وموزعي الشبكة</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-lg flex items-center gap-2"
                >
                  <Printer size={16} />
                  <span>بدء الطباعة المباشرة</span>
                </button>
                <button 
                  onClick={() => setIsVoucherPrintViewOpen(false)}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg text-sm font-semibold"
                >
                  إغلاق نافذة المعاينة
                </button>
              </div>
            </div>

            {/* Print Grid Frame */}
            <div className="bg-white text-slate-950 p-6 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4" id="printable-area">
              {printedVouchers.map((voucher, idx) => (
                <div key={idx} className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center relative overflow-hidden bg-slate-50 flex flex-col justify-between h-48">
                  {/* Decorative Wifi wave */}
                  <div className="absolute top-1 right-1 opacity-10">
                    <Wifi size={50} />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold mb-2">
                      <span>شبكة الواي فاي المحلية</span>
                      <span className="font-mono text-[8px]">{voucher.serialNumber.substring(0,6)}</span>
                    </div>
                    <div className="text-xs font-semibold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full inline-block mb-3">
                      {voucher.profileName}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1">كود كارت الهوتسبوت</span>
                    <span className="text-lg font-black tracking-widest text-slate-900 block bg-white border border-slate-200 py-1.5 rounded-lg shadow-sm font-mono">{voucher.code}</span>
                  </div>

                  {voucher.password && (
                    <div className="mt-1">
                      <span className="text-[9px] text-slate-400">كلمة المرور: </span>
                      <span className="text-xs font-bold font-mono">{voucher.password}</span>
                    </div>
                  )}

                  <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-bold text-slate-800">
                    <span>صلاحية الكارت: 30 يوم</span>
                    <span className="text-emerald-700">${voucher.price}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
