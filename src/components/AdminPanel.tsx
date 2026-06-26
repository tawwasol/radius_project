import React, { useState } from 'react';
import { SaasSubscriber, SaasPlan } from '../types';
import { 
  Users, DollarSign, Server, Cpu, Database, Activity, 
  CheckCircle, AlertTriangle, Play, RefreshCw, Plus, X, Search, Terminal
} from 'lucide-react';

interface AdminPanelProps {
  onBack: () => void;
}

const PRESET_PLANS: SaasPlan[] = [
  { id: 'basic', name: 'الباقة البرونزية', maxRouters: 3, maxActiveUsers: 500, priceMonthly: 19, features: [] },
  { id: 'business', name: 'الباقة الذهبية', maxRouters: 10, maxActiveUsers: 3000, priceMonthly: 49, features: [] },
  { id: 'enterprise', name: 'الباقة اللامحدودة', maxRouters: 999, maxActiveUsers: 99999, priceMonthly: 99, features: [] },
];

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const [subscribers, setSubscribers] = useState<SaasSubscriber[]>([
    {
      id: 'sub1',
      businessName: 'شبكة النور للواي فاي',
      ownerName: 'أحمد محمود العتيبي',
      email: 'nour.wifi@gmail.com',
      phone: '+966501234567',
      planId: 'business',
      status: 'active',
      signupDate: '2026-05-12',
      routersCount: 4,
      activeUsersCount: 1250,
    },
    {
      id: 'sub2',
      businessName: 'منظومة طنجة لخدمات الإنترنت',
      ownerName: 'عبد الإله الطنجي',
      email: 'tanger.net@outlook.com',
      phone: '+212612345678',
      planId: 'enterprise',
      status: 'active',
      signupDate: '2026-06-01',
      routersCount: 15,
      activeUsersCount: 4890,
    },
    {
      id: 'sub3',
      businessName: 'شبكة الدلتا المحلية',
      ownerName: 'محمود عبد الرازق',
      email: 'delta.net@yahoo.com',
      phone: '+201012345678',
      planId: 'basic',
      status: 'pending',
      signupDate: '2026-06-24',
      routersCount: 1,
      activeUsersCount: 45,
    },
    {
      id: 'sub4',
      businessName: 'واي فاي اليمن السعيد',
      ownerName: 'صالح اليماني',
      email: 'yemen.happy.wifi@gmail.com',
      phone: '+967712345678',
      planId: 'basic',
      status: 'expired',
      signupDate: '2026-04-10',
      routersCount: 2,
      activeUsersCount: 0,
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[2026-06-25 08:00:01] FreeRADIUS Version 3.2.3 (Ubuntu 24.04) starts successfully.',
    '[2026-06-25 08:00:02] SQL module loaded: Connected to MySQL radius database on localhost.',
    '[2026-06-25 08:05:12] IP: 192.168.10.1 - NAS-IP-Address found. RADIUS Authentication Request accepted for user: "usr5410"',
    '[2026-06-25 08:12:43] IP: 192.168.20.1 - NAS-IP-Address found. RADIUS Accounting Stop received for user: "usr1122" (Uptime: 3600s, Vol: 1.2GB)',
    '[2026-06-25 08:24:00] Cleaning expired accounting records - 12 sessions closed automatically.',
    '[2026-06-25 08:35:10] RADIUS Auth Request for user "hotspot-8822" accepted with Mikrotik-Rate-Limit: "2M/5M"'
  ]);

  const [newSub, setNewSub] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    planId: 'business',
    routersCount: 1,
    activeUsersCount: 0,
  });

  const handleAddSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    const subscriber: SaasSubscriber = {
      id: 'sub_' + Math.random().toString(36).substr(2, 9),
      ...newSub,
      status: 'active',
      signupDate: new Date().toISOString().split('T')[0],
    };
    setSubscribers([subscriber, ...subscribers]);
    setIsAddModalOpen(false);
    setNewSub({
      businessName: '',
      ownerName: '',
      email: '',
      phone: '',
      planId: 'business',
      routersCount: 1,
      activeUsersCount: 0,
    });
  };

  const toggleStatus = (id: string, currentStatus: 'active' | 'pending' | 'expired') => {
    setSubscribers(subscribers.map(sub => {
      if (sub.id === id) {
        let nextStatus: 'active' | 'pending' | 'expired' = 'active';
        if (currentStatus === 'active') nextStatus = 'expired';
        else if (currentStatus === 'expired' || currentStatus === 'pending') nextStatus = 'active';
        return { ...sub, status: nextStatus };
      }
      return sub;
    }));
  };

  const deleteSubscriber = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المشترك نهائياً من سيرفر الريديوس؟')) {
      setSubscribers(subscribers.filter(sub => sub.id !== id));
    }
  };

  const totalMRR = subscribers
    .filter(sub => sub.status === 'active')
    .reduce((sum, sub) => {
      const plan = PRESET_PLANS.find(p => p.id === sub.planId);
      return sum + (plan ? plan.priceMonthly : 0);
    }, 0);

  const filteredSubscribers = subscribers.filter(sub => {
    const matchesSearch = sub.businessName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sub.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.phone.includes(searchQuery);
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const triggerTestRADIUSLog = () => {
    const randomUser = `usr${Math.floor(Math.random() * 9000) + 1000}`;
    const randomIp = `192.168.100.${Math.floor(Math.random() * 254) + 1}`;
    const newLog = `[${new Date().toISOString().replace('T', ' ').substring(0, 19)}] IP: ${randomIp} - Access-Request for user "${randomUser}" APPROVED with dynamic QoS bandwidth config.`;
    setTerminalLogs(prev => [...prev, newLog]);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8">
      {/* Top Breadcrumb & Back */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <span className="text-xs text-sky-400 font-mono tracking-wider">سيرفر أوبونتو 24 روت الرئيسي</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5 mt-1">
            <Server className="text-sky-400" size={28} />
            <span>لوحة تحكم مالك المنصة (SaaS SuperAdmin)</span>
          </h1>
        </div>
        <button 
          onClick={onBack}
          className="px-4 py-2 text-sm bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg transition-colors"
        >
          &larr; العودة للرئيسية التجريبية
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column - Overall Host Stats & Controls */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Hardware Stats */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Activity size={16} className="text-sky-400" />
              <span>أداء خادم Ubuntu 24.04</span>
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-mono">
                  <span>استهلاك المعالج (vCPU)</span>
                  <span className="text-sky-400">22%</span>
                </div>
                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: '22%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5 font-mono">
                  <span>الذاكرة العشوائية (RAM)</span>
                  <span className="text-sky-400">2.1 GB / 8 GB</span>
                </div>
                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '26%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5 font-mono">
                  <span>مساحة القرص الصلب (SSD)</span>
                  <span className="text-sky-400">18 GB / 120 GB</span>
                </div>
                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '15%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5 font-mono">
                  <span>سجل FreeRADIUS Daemon</span>
                  <span className="text-emerald-400">مستقر (Active)</span>
                </div>
                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <DollarSign size={16} className="text-sky-400" />
              <span>المقاييس المالية (SaaS)</span>
            </h2>
            <div>
              <span className="text-xs text-slate-500 block">الإيرادات الشهرية المتكررة (MRR)</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">${totalMRR}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">متوسط الاشتراك الشهري</span>
              <span className="text-base font-bold text-slate-300 font-mono">$39 / شبكة</span>
            </div>
          </div>
        </div>

        {/* Right 3/4 Column - SaaS Subscribers Database */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Main subscribers card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">مشتركو شبكات RADIUS (أصحاب الشبكات المحلية)</h2>
                <p className="text-xs text-slate-400 mt-1">إجمالي الشبكات المسجلة على سيرفر أوبونتو ريديوس لإدارة المبيعات</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-lg flex items-center gap-2.5 transition-all shadow-md shadow-sky-500/10"
              >
                <Plus size={16} />
                <span>إضافة شبكة جديدة</span>
              </button>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="ابحث باسم الشبكة، المالك أو الهاتف..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 bg-slate-950 border border-slate-800 focus:border-sky-500/50 rounded-lg text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'active', 'pending', 'expired'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                      filterStatus === status 
                        ? 'bg-sky-500/15 border-sky-500/30 text-sky-400' 
                        : 'bg-slate-950 border-slate-850 hover:border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {status === 'all' && 'الكل'}
                    {status === 'active' && 'نشط'}
                    {status === 'pending' && 'قيد الانتظار'}
                    {status === 'expired' && 'منتهي'}
                  </button>
                ))}
              </div>
            </div>

            {/* Subscribers Table */}
            <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
              <table className="w-full text-right text-sm">
                <thead className="bg-slate-900 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-4">اسم الشبكة / المالك</th>
                    <th className="px-5 py-4">الباقة</th>
                    <th className="px-5 py-4">أجهزة ميكروتك</th>
                    <th className="px-5 py-4">العملاء المتصلون</th>
                    <th className="px-5 py-4">الحالة</th>
                    <th className="px-5 py-4 text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {filteredSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                        لا يوجد شبكات مطابقة للبحث حالياً
                      </td>
                    </tr>
                  ) : (
                    filteredSubscribers.map((sub) => {
                      const plan = PRESET_PLANS.find(p => p.id === sub.planId);
                      return (
                        <tr key={sub.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="px-5 py-4">
                            <span className="font-bold text-white block">{sub.businessName}</span>
                            <span className="text-xs text-slate-500 block mt-0.5">{sub.ownerName} &bull; {sub.phone}</span>
                          </td>
                          <td className="px-5 py-4 font-mono font-bold">
                            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-sky-400 text-xs">
                              {plan?.name || sub.planId} (${plan?.priceMonthly}/ش)
                            </span>
                          </td>
                          <td className="px-5 py-4 font-mono text-slate-300">{sub.routersCount} / {plan?.maxRouters === 999 ? '∞' : plan?.maxRouters}</td>
                          <td className="px-5 py-4 font-mono text-slate-300">
                            <span className="text-white font-bold">{sub.activeUsersCount.toLocaleString()}</span> / {plan?.maxActiveUsers === 99999 ? '∞' : plan?.maxActiveUsers?.toLocaleString()}
                          </td>
                          <td className="px-5 py-4">
                            {sub.status === 'active' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                نشط ومفعل
                              </span>
                            )}
                            {sub.status === 'pending' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                بانتظار التفعيل
                              </span>
                            )}
                            {sub.status === 'expired' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                اشتراك منتهي
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-left">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => toggleStatus(sub.id, sub.status)}
                                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                                  sub.status === 'active' 
                                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20' 
                                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                }`}
                              >
                                {sub.status === 'active' ? 'تعطيل' : 'تفعيل'}
                              </button>
                              <button
                                onClick={() => deleteSubscriber(sub.id)}
                                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
                              >
                                حذف
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* RADIUS Terminal Simulator */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="text-sky-400" size={20} />
                <span>سيرفر FreeRADIUS مراقبة الجلسات الحية على Ubuntu 24</span>
              </h2>
              <button 
                onClick={triggerTestRADIUSLog}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-sky-400 hover:text-sky-300 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw size={12} className="animate-spin-slow" />
                <span>محاكاة طلب RADIUS جديد</span>
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl font-mono text-[11px] sm:text-xs text-sky-300 space-y-2 h-44 overflow-y-auto text-left" dir="ltr">
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="whitespace-pre-wrap leading-relaxed border-l-2 border-slate-800 pl-2">
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Add Subscriber Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-extrabold text-white">إضافة شبكة مايكروتك جديدة للمنصة السحابية</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 hover:bg-slate-850 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubscriber} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-bold">اسم شبكة المشترك</label>
                  <input 
                    type="text" 
                    required
                    placeholder="مثال: شبكة الأقصى الرقمية"
                    value={newSub.businessName}
                    onChange={(e) => setNewSub({...newSub, businessName: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-bold">اسم مالك الشبكة</label>
                  <input 
                    type="text" 
                    required
                    placeholder="مثال: يوسف الرفاعي"
                    value={newSub.ownerName}
                    onChange={(e) => setNewSub({...newSub, ownerName: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-bold">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    required
                    placeholder="name@example.com"
                    value={newSub.email}
                    onChange={(e) => setNewSub({...newSub, email: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none text-left"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-bold">رقم الهاتف للواتساب</label>
                  <input 
                    type="text" 
                    required
                    placeholder="+96650000000"
                    value={newSub.phone}
                    onChange={(e) => setNewSub({...newSub, phone: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-bold">الباقة السحابية</label>
                  <select
                    value={newSub.planId}
                    onChange={(e) => setNewSub({...newSub, planId: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-sm text-slate-100 focus:outline-none"
                  >
                    <option value="basic">الباقة البرونزية (3 أجهزة مايكروتك)</option>
                    <option value="business">الباقة الذهبية (10 أجهزة مايكروتك)</option>
                    <option value="enterprise">الباقة اللامحدودة (أجهزة غير محدودة)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-bold">أجهزة ميكروتك النشطة</label>
                  <input 
                    type="number" 
                    min={1}
                    value={newSub.routersCount}
                    onChange={(e) => setNewSub({...newSub, routersCount: parseInt(e.target.value) || 1})}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-sm text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-950 border border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-lg transition-all shadow-md shadow-sky-500/15"
                >
                  تأكيد وتفعيل الريديوس
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
