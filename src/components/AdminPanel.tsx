import React, { useState } from 'react';
import { SaasSubscriber, SaasPlan } from '../types';
import { 
  Users, DollarSign, Server, Cpu, Database, Activity, 
  CheckCircle, AlertTriangle, Play, RefreshCw, Plus, X, Search, Terminal,
  Coffee, Utensils, Hotel, Sparkles, Sliders, Smartphone, Download, Check, 
  HelpCircle, ArrowRight, TrendingUp, Key, Lock, Mail, Phone, MapPin, Percent, FileText, Gift,
  Trash2, Wifi, Shield, Save
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminPanelProps {
  onBack: () => void;
  onImpersonateTenant?: (tenantId: string) => void;
}

const PRESET_PLANS: SaasPlan[] = [
  { id: 'basic', name: 'الباقة البرونزية للمقاهي الصغيرة', maxRouters: 3, maxActiveUsers: 500, priceMonthly: 19, features: ['ريديوس هوتسبوت', 'صفحة هبوط قياسية', 'مراقبة راوتر واحد'] },
  { id: 'business', name: 'الباقة الذهبية للمطاعم والكافيهات', maxRouters: 10, maxActiveUsers: 3000, priceMonthly: 49, features: ['ريديوس متطور', 'مصمم صفحات الهبوط باسم المحل', 'تحصيل أرقام الهاتف', 'تقارير أسبوعية'] },
  { id: 'enterprise', name: 'الباقة المخصصة للفنادق والموزعين', maxRouters: 999, maxActiveUsers: 99999, priceMonthly: 99, features: ['أجهزة غير محدودة', 'تطبيق هاتف خاص بمحلّك (White Label)', 'دعم فني خاص 24/7', 'ربط الدفع الإلكتروني الكروت'] },
];

export default function AdminPanel({ onBack, onImpersonateTenant }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'tenants' | 'leads' | 'customizer' | 'roi' | 'radius' | 'settings'>('tenants');

  // Admin and ISP Credentials Management States
  const [adminUser, setAdminUser] = useState(localStorage.getItem('saas_admin_username') || 'Admin');
  const [adminPass, setAdminPass] = useState(localStorage.getItem('saas_admin_password') || 'Asd123Asd1979');
  const [ispUser, setIspUser] = useState(localStorage.getItem('saas_isp_username') || 'isp');
  const [ispPass, setIspPass] = useState(localStorage.getItem('saas_isp_password') || 'isp');
  
  const handleUpdateAdminCreds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUser.trim() || !adminPass.trim()) {
      alert('الرجاء إدخال اسم مستخدم وكلمة مرور صالحة!');
      return;
    }
    localStorage.setItem('saas_admin_username', adminUser.trim());
    localStorage.setItem('saas_admin_password', adminPass.trim());
    alert('تم تحديث بيانات دخول المسؤول السحابي (SaaS SuperAdmin) بنجاح!');
  };

  const handleUpdateIspCreds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ispUser.trim() || !ispPass.trim()) {
      alert('الرجاء إدخال اسم مستخدم وكلمة مرور صالحة!');
      return;
    }
    localStorage.setItem('saas_isp_username', ispUser.trim());
    localStorage.setItem('saas_isp_password', ispPass.trim());
    alert('تم تحديث بيانات دخول لوحة تحكم الشبكات (ISP Panel) بنجاح!');
  };

  // Multi-tenant Active Subscriptions
  const [subscribers, setSubscribers] = useState<SaasSubscriber[]>([
    {
      id: 'sub1',
      businessName: 'كافيه ستاربكس - فرع الياسمين',
      ownerName: 'أحمد محمود العتيبي',
      email: 'nour.wifi@gmail.com',
      phone: '+966501234567',
      planId: 'business',
      status: 'active',
      signupDate: '2026-05-12',
      routersCount: 2,
      activeUsersCount: 70,
    },
    {
      id: 'sub2',
      businessName: 'مطعم برجر هاوس - الفرع الرئيسي',
      ownerName: 'عبد الإله الطنجي',
      email: 'tanger.net@outlook.com',
      phone: '+212612345678',
      planId: 'basic',
      status: 'active',
      signupDate: '2026-06-01',
      routersCount: 1,
      activeUsersCount: 14,
    },
    {
      id: 'sub3',
      businessName: 'فندق القصر الفاخر (Luxe Palace Hotel)',
      ownerName: 'محمود عبد الرازق',
      email: 'luxe.hotel@yahoo.com',
      phone: '+201012345678',
      planId: 'enterprise',
      status: 'active',
      signupDate: '2026-06-24',
      routersCount: 2,
      activeUsersCount: 435,
    },
    {
      id: 'sub4',
      businessName: 'كافيه جافا كود - صالة الفرودست',
      ownerName: 'صالح اليماني',
      email: 'javacode@gmail.com',
      phone: '+967712345678',
      planId: 'business',
      status: 'expired',
      signupDate: '2026-04-10',
      routersCount: 3,
      activeUsersCount: 0,
    }
  ]);

  // Lead Pipeline & CRM for Prospective Cafes / Restaurants
  const [leads, setLeads] = useState([
    { id: 'l1', cafeName: 'كافيه باربيرا (Caffe Barbera)', city: 'الرياض', tables: 35, email: 'barbera.ryd@cafe.com', phone: '+96654091823', status: 'proposal', monthlyPotential: 49 },
    { id: 'l2', cafeName: 'لو كافيه كورتادو (Le Cafe)', city: 'جدة', tables: 20, email: 'cortado.jed@cafe.net', phone: '+96659102452', status: 'new', monthlyPotential: 19 },
    { id: 'l3', cafeName: 'مطعم توب كوك (Top Cook Restaurant)', city: 'القاهرة', tables: 60, email: 'info@topcook.com', phone: '+20112451029', status: 'demo', monthlyPotential: 49 },
    { id: 'l4', cafeName: 'فندق روتانا بلازا (Rotana Hotel)', city: 'دبي', tables: 180, email: 'it@rotanaplaza.ae', phone: '+97150124582', status: 'negotiation', monthlyPotential: 99 },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // CRM Demo Call scheduler state
  const [demoLeadId, setDemoLeadId] = useState<string | null>(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [proposalData, setProposalData] = useState<any | null>(null);

  // WIFI CAPTIVE PORTAL CUSTOMIZER STATE (Sales Pitch / Demo tool)
  const [selectedTemplate, setSelectedTemplate] = useState<'cafe' | 'restaurant' | 'hotel' | 'coworking'>('cafe');
  const [portalAccent, setPortalAccent] = useState('#10b981'); // default green SBUX
  const [welcomeText, setWelcomeText] = useState('أهلاً بك في شبكة الواي فاي للقهوة! احصل على كود الإنترنت مجاناً من كاونتر الكافيه للاتصال بالشبكة.');
  const [logoText, setLogoText] = useState('Cozy Espresso Bar');
  const [requirePhone, setRequirePhone] = useState(true);
  const [requireSms, setRequireSms] = useState(false);
  const [enableAd, setEnableAd] = useState(true);
  const [adText, setAdText] = useState('خصم 20% على جميع المعجنات والدونات اللذيذة بمناسبة الافتتاح!');
  const [isDownloadingConfig, setIsDownloadingConfig] = useState(false);

  // ROI CALCULATOR STATE
  const [roiDailyCustomers, setRoiDailyCustomers] = useState(150);
  const [roiPremiumPrice, setRoiPremiumPrice] = useState(10); // Price in SAR/EGP/USD for premium speed
  const [roiPremiumConv, setRoiPremiumConv] = useState(6); // % of users buying premium speed
  const [roiLeadVal, setRoiLeadVal] = useState(2); // Valued amount of gathering email/phone number for SMS marketing

  const [newSub, setNewSub] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    planId: 'business',
    routersCount: 1,
    activeUsersCount: 0,
  });

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[2026-06-28 08:12:00] [FreeRADIUS] RADIUS server online - Listening on authorization port 1812 and accounting port 1813.',
    '[2026-06-28 08:13:02] [MySQL AAA] Connected successfully to radcheck/radacct database tables.',
    '[2026-06-28 08:15:10] [Auth Accept] Starbucks-Cafe router authorized Guest MAC (CC:42:DE:33) via speed profile: p_sbux_free.',
    '[2026-06-28 08:24:15] [QoS Command] Sent Mikrotik-Rate-Limit Attribute "1M/2M" to Starbuck Nas (10.10.10.1).',
    '[2026-06-28 08:35:44] [Accounting Start] Guest (SBUX-WORKER) connected. NAS-IP-Address: 10.10.10.1 (CCR1009).',
    '[2026-06-28 08:44:02] [Auth Request] Burger-House client (BURGER-EAT) from IP: 192.168.88.54 approved.'
  ]);

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
    if (window.confirm('هل أنت متأكد من حذف هذا العميل التجاري نهائياً؟ سيتم فصل كافة الأجهزة عن قاعدة بيانات RADIUS.')) {
      setSubscribers(subscribers.filter(sub => sub.id !== id));
    }
  };

  // Finance SaaS Calculations
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
    return matchesSearch;
  });

  const triggerTestRADIUSLog = () => {
    const randomUser = `WiFi-${Math.floor(Math.random() * 9000) + 1000}`;
    const randomIp = `10.10.10.${Math.floor(Math.random() * 254) + 2}`;
    const newLog = `[${new Date().toISOString().replace('T', ' ').substring(0, 19)}] [RADIUS Auth] Access-Request for client "${randomUser}" APPROVED at NAS (Starbucks Router). rateLimit: "1M/2M" configured.`;
    setTerminalLogs(prev => [...prev, newLog]);
  };

  // ROI Calculator output calculations
  const premiumDailySubscribers = Math.round(roiDailyCustomers * (roiPremiumConv / 100));
  const dailyPremiumRevenue = premiumDailySubscribers * roiPremiumPrice;
  const monthlyPremiumRevenue = dailyPremiumRevenue * 30;
  const monthlyLeadsCollected = roiDailyCustomers * 30;
  const monthlyLeadsValue = monthlyLeadsCollected * roiLeadVal;
  const totalEstimatedValue = monthlyPremiumRevenue + monthlyLeadsValue;

  // Generate Technical & Financial SaaS Proposal for CRM Leads
  const handleGenerateProposal = (lead: any) => {
    setProposalData(lead);
    setIsProposalModalOpen(true);
  };

  // Change Lead Status
  const handleProgressLead = (leadId: string, currentStatus: string) => {
    const statusOrder = ['new', 'demo', 'proposal', 'negotiation', 'won'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    if (currentIndex < statusOrder.length - 1) {
      const nextStatus = statusOrder[currentIndex + 1];
      setLeads(leads.map(l => l.id === leadId ? { ...l, status: nextStatus } : l));
      
      // If won, automatically register them as a Tenant!
      if (nextStatus === 'won') {
        const lead = leads.find(l => l.id === leadId);
        if (lead) {
          const newTenant: SaasSubscriber = {
            id: lead.id,
            businessName: lead.cafeName,
            ownerName: 'المدير المسؤول',
            email: lead.email,
            phone: lead.phone,
            planId: lead.monthlyPotential === 99 ? 'enterprise' : 'business',
            status: 'active',
            signupDate: new Date().toISOString().split('T')[0],
            routersCount: 1,
            activeUsersCount: 0
          };
          setSubscribers([newTenant, ...subscribers]);
          alert(`تهانينا! تم تحويل العميل المحتمل "${lead.cafeName}" إلى عميل تجاري نشط وتأهيل حساب الـ RADIUS الخاص به بنجاح.`);
        }
      }
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8">
      {/* Top Breadcrumb & Back */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <span className="text-xs text-emerald-400 font-mono tracking-wider flex items-center gap-1.5">
            <Sparkles size={12} className="animate-pulse" />
            <span>لوحة تحكم مزود الخدمة السحابية &bull; SaaS Platform Owner</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5 mt-1">
            <Server className="text-emerald-400" size={28} />
            <span>لوحة تحكم المدير ومبيعات الكافيهات (SaaS SuperAdmin)</span>
          </h1>
        </div>
        <button 
          onClick={onBack}
          className="px-4 py-2 text-sm bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
        >
          &larr;
          <span>العودة للرئيسية</span>
        </button>
      </div>

      {/* Main SaaS Stats Overview */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 left-4 p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <DollarSign size={18} />
          </div>
          <span className="text-slate-500 text-xs block mb-1">الإيرادات المتكررة شهرياً (SaaS MRR)</span>
          <span className="text-3xl font-black text-emerald-400 font-mono">${totalMRR}</span>
          <span className="text-[10px] text-slate-400 block mt-1.5">من إجمالي {subscribers.filter(s => s.status === 'active').length} كافيهات ومطاعم نشطة</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 left-4 p-2 bg-sky-500/10 text-sky-400 rounded-lg">
            <Coffee size={18} />
          </div>
          <span className="text-slate-500 text-xs block mb-1">الكافيهات والمطاعم المفعّلة</span>
          <span className="text-3xl font-black text-white font-mono">
            {subscribers.filter(s => s.planId === 'business' || s.planId === 'basic').length}
          </span>
          <span className="text-[10px] text-emerald-400 block mt-1.5">باقات الكافيه القياسية والذهبية</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 left-4 p-2 bg-purple-500/10 text-purple-400 rounded-lg">
            <Hotel size={18} />
          </div>
          <span className="text-slate-500 text-xs block mb-1">الفنادق والشبكات الضخمة (Enterprise)</span>
          <span className="text-3xl font-black text-white font-mono">
            {subscribers.filter(s => s.planId === 'enterprise').length}
          </span>
          <span className="text-[10px] text-purple-400 block mt-1.5">تغطية غرف ونزلاء دائمة بالـ API</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 left-4 p-2 bg-amber-500/10 text-amber-400 rounded-lg">
            <TrendingUp size={18} />
          </div>
          <span className="text-slate-500 text-xs block mb-1">العملاء المتصلون بالإنترنت الآن</span>
          <span className="text-3xl font-black text-amber-400 font-mono">
            {subscribers.reduce((sum, s) => sum + s.activeUsersCount, 0).toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-400 block mt-1.5">جلسات حية نشطة عبر خادم RADIUS</span>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="max-w-7xl mx-auto flex flex-wrap gap-2 mb-6 border-b border-slate-900 pb-4">
        <button 
          onClick={() => setActiveTab('tenants')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'tenants' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Users size={16} />
          <span>إدارة الكافيهات والمطاعم المشتركة ({subscribers.length})</span>
        </button>

        <button 
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'leads' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Gift size={16} />
          <span>إدارة المبيعات والعملاء المحتملين CRM ({leads.length})</span>
        </button>

        <button 
          onClick={() => setActiveTab('customizer')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'customizer' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Sliders size={16} />
          <span>مصمم صفحة هبوط الواي فاي للزبائن (صانع العروض)</span>
        </button>

        <button 
          onClick={() => setActiveTab('roi')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'roi' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Percent size={16} />
          <span>حاسبة الأرباح وعوائد الواي فاي لكافيهك</span>
        </button>

        <button 
          onClick={() => setActiveTab('radius')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'radius' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Terminal size={16} />
          <span>مراقبة خادم RADIUS وحركة البيانات</span>
        </button>

        <button 
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'settings' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Lock size={16} />
          <span>بيانات الدخول وحماية الـ RADIUS</span>
        </button>
      </div>

      {/* Main Content Workspace */}
      <div className="max-w-7xl mx-auto">
        
        {/* TAB 1: Tenants List */}
        {activeTab === 'tenants' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">إدارة حسابات المستأجرين (Tenants Management)</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    أصحاب المطاعم، الفنادق، ومقاهي الكورتادو المشتركين بالريديوس السحابي لبيع باقاتهم للعملاء.
                  </p>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-2 transition-all shadow-md shadow-emerald-500/10"
                >
                  <Plus size={14} />
                  <span>تجهيز ريديوس لعميل تجاري جديد</span>
                </button>
              </div>

              {/* Filters */}
              <div className="relative mb-6">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="ابحث باسم الكافيه، المطعم، أو هاتف المالك..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 bg-slate-950 border border-slate-800 focus:border-sky-500/50 rounded-lg text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none font-sans"
                />
              </div>

              {/* Grid of Tenants */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredSubscribers.map((sub) => {
                  const plan = PRESET_PLANS.find(p => p.id === sub.planId);
                  const isSBUX = sub.id === 'sub1';
                  const isBurger = sub.id === 'sub2';
                  const isHotel = sub.id === 'sub3';

                  let categoryIcon = <Coffee size={20} className="text-emerald-400" />;
                  let bgBadge = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
                  let brandAccent = "border-emerald-500/20";

                  if (isBurger) {
                    categoryIcon = <Utensils size={20} className="text-amber-400" />;
                    bgBadge = "bg-amber-500/10 border-amber-500/20 text-amber-400";
                    brandAccent = "border-amber-500/20";
                  } else if (isHotel) {
                    categoryIcon = <Hotel size={20} className="text-purple-400" />;
                    bgBadge = "bg-purple-500/10 border-purple-500/20 text-purple-400";
                    brandAccent = "border-purple-500/20";
                  }

                  return (
                    <div key={sub.id} className={`bg-slate-950 border ${brandAccent} p-5 rounded-2xl relative flex flex-col justify-between hover:border-slate-700 transition-all`}>
                      <div>
                        {/* Tenant Top Bar */}
                        <div className="flex justify-between items-start gap-4 mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2.5 rounded-xl bg-slate-900 border border-slate-800`}>
                              {categoryIcon}
                            </div>
                            <div>
                              <h3 className="font-bold text-white text-base">{sub.businessName}</h3>
                              <span className="text-xs text-slate-500 font-mono block mt-0.5">سجل الاشتراك: {sub.signupDate}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-1.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${bgBadge}`}>
                              {sub.planId === 'enterprise' ? 'فندقي / موزع مميز' : sub.planId === 'business' ? 'ذهبي للشركات' : 'برونزي كلاسيكي'}
                            </span>
                            {sub.status === 'active' ? (
                              <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                مفعل وقائم
                              </span>
                            ) : (
                              <span className="text-rose-400 text-[10px] font-bold flex items-center gap-1">
                                متوقف / منتهي
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Tenant Attributes Grid */}
                        <div className="grid grid-cols-2 gap-4 my-4 bg-slate-900/60 p-3.5 rounded-xl text-xs border border-slate-900">
                          <div>
                            <span className="text-slate-500 block mb-0.5">مالك المحل</span>
                            <span className="font-semibold text-slate-200">{sub.ownerName}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block mb-0.5">رقم الواتساب للتنبيهات</span>
                            <span className="font-mono text-slate-200" dir="ltr">{sub.phone}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block mb-0.5">راوترات ميكروتك النشطة</span>
                            <span className="font-mono font-bold text-white">{sub.routersCount} أجهزة</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block mb-0.5">الزبائن المتصلون اللحظة</span>
                            <span className="font-mono font-bold text-sky-400">{sub.activeUsersCount} زبون متصل</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons: Impersonate Client! */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-900 mt-2">
                        <span className="text-xs text-slate-500">سعر الباقة السحابية: <strong className="text-emerald-400">${plan?.priceMonthly || 0}/شهرياً</strong></span>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => onImpersonateTenant && onImpersonateTenant(sub.id)}
                            className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs rounded-lg transition-all flex items-center gap-1"
                          >
                            <Smartphone size={13} />
                            <span>دخول لوحة تحكم الكافيه بصفتك العميل</span>
                          </button>
                          
                          <button
                            onClick={() => toggleStatus(sub.id, sub.status)}
                            className="px-2 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs rounded-lg font-semibold"
                          >
                            {sub.status === 'active' ? 'تعطيل' : 'تفعيل'}
                          </button>
                          
                          <button
                            onClick={() => deleteSubscriber(sub.id)}
                            className="p-1.5 text-slate-600 hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-500/10"
                            title="حذف العميل"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CRM & Leads Pipeline */}
        {activeTab === 'leads' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="text-amber-400" size={20} />
                    <span>إدارة المبيعات وجلب الكافيهات والمطاعم (SaaS Leads Pipeline)</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    تابع تقدم صفقاتك مع أصحاب الكافيهات والمقاهي لربط شبكاتهم بسيرفر الريديوس وزيادة مبيعاتك السحابية.
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    const name = prompt('أدخل اسم الكافيه أو المطعم المحتمل:');
                    const city = prompt('المدينة:', 'الرياض');
                    const tables = prompt('عدد الطاولات المتوقعة لربط الزبائن:', '30');
                    const phone = prompt('رقم هاتف المالك للاتصال به:', '+96650000000');
                    if (name) {
                      const newLeadItem = {
                        id: 'l_' + Math.random().toString(36).substr(2, 9),
                        cafeName: name,
                        city: city || 'الرياض',
                        tables: parseInt(tables || '20') || 20,
                        email: `${name.toLowerCase().replace(/ /g, '')}@example.com`,
                        phone: phone || '+96650000000',
                        status: 'new',
                        monthlyPotential: 49
                      };
                      setLeads([newLeadItem, ...leads]);
                    }
                  }}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>إضافة فرصة بيع جديدة</span>
                </button>
              </div>

              {/* Sales Pipeline Kanban columns simulated */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                
                {/* COLUMN 1: NEW */}
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-900">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-extrabold text-white bg-slate-900 px-2 py-1 rounded">عميل محتمل جديد</span>
                    <span className="text-[10px] text-slate-500 font-mono">({leads.filter(l => l.status === 'new').length})</span>
                  </div>
                  
                  <div className="space-y-3">
                    {leads.filter(l => l.status === 'new').map(lead => (
                      <div key={lead.id} className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
                        <h4 className="font-bold text-slate-100 text-xs">{lead.cafeName}</h4>
                        <span className="text-[10px] text-slate-500 block">المدينة: {lead.city} &bull; {lead.tables} طاولة</span>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-950">
                          <span className="text-[10px] text-emerald-400 font-mono font-bold">${lead.monthlyPotential}/ش</span>
                          <button 
                            onClick={() => handleProgressLead(lead.id, lead.status)}
                            className="px-2 py-1 bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[9px] font-bold rounded hover:bg-sky-500 hover:text-slate-950"
                          >
                            جدولة ديمو &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COLUMN 2: DEMO */}
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-900">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-extrabold text-amber-400 bg-slate-900 px-2 py-1 rounded">مجدول للعرض الحي</span>
                    <span className="text-[10px] text-slate-500 font-mono">({leads.filter(l => l.status === 'demo').length})</span>
                  </div>
                  
                  <div className="space-y-3">
                    {leads.filter(l => l.status === 'demo').map(lead => (
                      <div key={lead.id} className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
                        <h4 className="font-bold text-slate-100 text-xs">{lead.cafeName}</h4>
                        <span className="text-[10px] text-slate-500 block">مكالمة معاينة الكارت وشاشة تسجيل الدخول</span>
                        <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-950">
                          <button 
                            onClick={() => handleGenerateProposal(lead)}
                            className="w-full text-center py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] font-bold rounded hover:bg-purple-500 hover:text-white"
                          >
                            تجهيز العرض السعري
                          </button>
                          <button 
                            onClick={() => handleProgressLead(lead.id, lead.status)}
                            className="w-full text-center py-1 bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[9px] font-bold rounded hover:bg-sky-500 hover:text-slate-950"
                          >
                            تم التقديم &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COLUMN 3: PROPOSAL SENT */}
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-900">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-extrabold text-purple-400 bg-slate-900 px-2 py-1 rounded">تم إرسال العرض</span>
                    <span className="text-[10px] text-slate-500 font-mono">({leads.filter(l => l.status === 'proposal').length})</span>
                  </div>
                  
                  <div className="space-y-3">
                    {leads.filter(l => l.status === 'proposal').map(lead => (
                      <div key={lead.id} className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
                        <h4 className="font-bold text-slate-100 text-xs">{lead.cafeName}</h4>
                        <span className="text-[10px] text-slate-500 block">العرض التقني والمالي لـ {lead.tables} راوتر</span>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-950">
                          <button 
                            onClick={() => handleGenerateProposal(lead)}
                            className="text-[9px] text-purple-400 underline font-semibold"
                          >
                            عرض العقد
                          </button>
                          <button 
                            onClick={() => handleProgressLead(lead.id, lead.status)}
                            className="px-2 py-1 bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[9px] font-bold rounded hover:bg-sky-500 hover:text-slate-950"
                          >
                            تفاوض &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COLUMN 4: NEGOTIATION */}
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-900">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-extrabold text-sky-400 bg-slate-900 px-2 py-1 rounded">المفاوضات النهائية</span>
                    <span className="text-[10px] text-slate-500 font-mono">({leads.filter(l => l.status === 'negotiation').length})</span>
                  </div>
                  
                  <div className="space-y-3">
                    {leads.filter(l => l.status === 'negotiation').map(lead => (
                      <div key={lead.id} className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
                        <h4 className="font-bold text-slate-100 text-xs">{lead.cafeName}</h4>
                        <span className="text-[10px] text-slate-500 block">سعر باقة الواي فاي + لوحة الموزع</span>
                        <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-950">
                          <button 
                            onClick={() => handleProgressLead(lead.id, lead.status)}
                            className="w-full text-center py-1.5 bg-emerald-500 text-slate-950 font-extrabold text-[10px] rounded hover:bg-emerald-400 transition-all"
                          >
                            إغلاق الصفقة وتفعيل الريديوس!
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COLUMN 5: WON */}
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-900">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-extrabold text-emerald-400 bg-slate-900 px-2 py-1 rounded">تم الربط والبيع (Won)</span>
                    <span className="text-[10px] text-slate-500 font-mono">({leads.filter(l => l.status === 'won').length})</span>
                  </div>
                  
                  <div className="space-y-3">
                    {leads.filter(l => l.status === 'won').length === 0 ? (
                      <div className="text-center py-8 text-xs text-slate-600 border border-dashed border-slate-800 rounded-xl">
                        اسحب الصفقات هنا لإغلاقها وتفعيلها تلقائياً
                      </div>
                    ) : (
                      leads.filter(l => l.status === 'won').map(lead => (
                        <div key={lead.id} className="bg-emerald-500/5 p-3.5 rounded-xl border border-emerald-500/25 space-y-1.5">
                          <h4 className="font-bold text-emerald-400 text-xs flex items-center gap-1">
                            <CheckCircle size={12} />
                            <span>{lead.cafeName}</span>
                          </h4>
                          <span className="text-[9px] text-slate-400 block">تم تنشيط السيرفر وتجهيز ملفات المايكروتك بنجاح.</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Captive Portal Customizer & Mock Simulator */}
        {activeTab === 'customizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
            {/* Left Column: Settings Panel */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sliders className="text-sky-400" size={20} />
                  <span>لوحة تعديل وتخصيص قوالب الواي فاي لزبائن الكافيه</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  صمّم وجرّب الواجهة التي يراها زبون المطعم أو الكافيه على هاتفه عند شحن كروت الهوتسبوت المولّدة.
                </p>
              </div>

              {/* Selector Template */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">نوع ومجال محل العميل (المستأجر)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => {
                      setSelectedTemplate('cafe');
                      setPortalAccent('#10b981');
                      setLogoText('Cozy Espresso Cafe ☕');
                      setWelcomeText('مرحباً بك في مقهى الاسبريسو! يرجى إدخال كود كارت الهوتسبوت لتنشيط الإنترنت السريع مجاناً.');
                    }}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                      selectedTemplate === 'cafe' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Coffee size={16} />
                    <span>مقهى / كافيه قهوة مختصة</span>
                  </button>

                  <button 
                    onClick={() => {
                      setSelectedTemplate('restaurant');
                      setPortalAccent('#f59e0b');
                      setLogoText('Burger House Diner 🍔');
                      setWelcomeText('برجر هاوس يرحب بك! احصل على كود تفعيل الواي فاي من أسفل فاتورة وجبتك للتمتع بتصفح المنيو.');
                    }}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                      selectedTemplate === 'restaurant' ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Utensils size={16} />
                    <span>مطعم وجبات / عائلات</span>
                  </button>

                  <button 
                    onClick={() => {
                      setSelectedTemplate('hotel');
                      setPortalAccent('#8b5cf6');
                      setLogoText('Royal Plaza Suites 🏨');
                      setWelcomeText('عميلنا العزيز، يرجى إدخال رقم غرفتك وكلمة المرور المكتوبة ببطاقة النزيل للاشتراك بريديوس الفندق.');
                    }}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                      selectedTemplate === 'hotel' ? 'bg-purple-500/10 border-purple-500 text-purple-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Hotel size={16} />
                    <span>فندق / غرف وضيافة</span>
                  </button>

                  <button 
                    onClick={() => {
                      setSelectedTemplate('coworking');
                      setPortalAccent('#0ea5e9');
                      setLogoText('Focus Space Coworking 💻');
                      setWelcomeText('مرحباً بك في مساحة التركيز! يرجى شحن الكارت المخصص للسرعة الفائقة 40 ميجا المعتمدة من RADIUS.');
                    }}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                      selectedTemplate === 'coworking' ? 'bg-sky-500/10 border-sky-500 text-sky-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Server size={16} />
                    <span>مساحة عمل مشتركة</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Text Modifiers */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">اسم البراند / الكافيه</label>
                  <input 
                    type="text" 
                    value={logoText}
                    onChange={(e) => setLogoText(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs font-bold text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">اللون الأساسي للقوالب والأزرار</label>
                  <div className="flex gap-2">
                    {['#10b981', '#f59e0b', '#8b5cf6', '#0ea5e9', '#ef4444', '#ec4899'].map(color => (
                      <button
                        key={color}
                        onClick={() => setPortalAccent(color)}
                        className={`w-7 h-7 rounded-full border transition-all ${portalAccent === color ? 'ring-2 ring-white scale-110' : 'opacity-60'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">نص الترحيب والتعليمات للزبون</label>
                  <textarea 
                    rows={3}
                    value={welcomeText}
                    onChange={(e) => setWelcomeText(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs font-medium text-slate-200 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Feature Toggles */}
              <div className="space-y-2.5 bg-slate-950/50 p-4 rounded-xl border border-slate-850">
                <h3 className="text-xs font-extrabold text-white mb-2">ميزات تجميع بيانات الزبائن وتسييل الشبكة</h3>
                
                <label className="flex items-center gap-2.5 cursor-pointer text-xs select-none">
                  <input 
                    type="checkbox" 
                    checked={requirePhone}
                    onChange={(e) => setRequirePhone(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-sky-500 focus:ring-0"
                  />
                  <span className="font-semibold text-slate-300">جمع أرقام هواتف الزبائن للرسائل الدعائية SMS</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs select-none mt-2">
                  <input 
                    type="checkbox" 
                    checked={enableAd}
                    onChange={(e) => setEnableAd(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-sky-500 focus:ring-0"
                  />
                  <span className="font-semibold text-slate-300">عرض إعلان تجاري/منيو المطعم قبل تسجيل الدخول</span>
                </label>

                {enableAd && (
                  <div className="mt-2.5">
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">نص الإعلان الدعائي المنبثق</label>
                    <input 
                      type="text" 
                      value={adText}
                      onChange={(e) => setAdText(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-300 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Script Generation */}
              <div>
                <button
                  onClick={() => {
                    setIsDownloadingConfig(true);
                    setTimeout(() => {
                      setIsDownloadingConfig(false);
                      alert('تم توليد وتجهيز حزمة صفحة تسجيل الدخول لـ Mikrotik Hotspot! تم تصدير ملفات index.html و style.css المربوطة بـ RADIUS AAA.');
                    }, 1500);
                  }}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Download size={15} />
                  <span>{isDownloadingConfig ? 'جاري تجهيز وتشفير الحزمة...' : 'تصدير قالب Mikrotik Hotspot جاهز للرفع'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Dynamic Phone Screen Simulator preview */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-900 border border-slate-800 p-6 rounded-2xl min-h-[500px]">
              <span className="text-xs text-slate-400 font-bold mb-4">معاينة فورية كما تبدو على هاتف زبون الكافيه</span>
              
              {/* Phone Mockup Frame */}
              <div className="w-[280px] h-[540px] bg-slate-950 border-[10px] border-slate-800 rounded-[36px] shadow-2xl relative overflow-hidden flex flex-col">
                
                {/* Phone Speaker Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-800 rounded-b-xl z-20 flex items-center justify-center">
                  <div className="w-10 h-1 bg-slate-900 rounded-full" />
                </div>

                {/* Simulated Screen Content */}
                <div className="flex-1 overflow-y-auto p-4 pt-8 text-right font-sans relative flex flex-col justify-between bg-slate-900">
                  
                  {/* Captive Portal Top Logo */}
                  <div className="text-center mt-3">
                    <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2" style={{ backgroundColor: `${portalAccent}20` }}>
                      <Wifi size={22} style={{ color: portalAccent }} />
                    </div>
                    <h3 className="text-xs font-black text-white">{logoText}</h3>
                    <span className="text-[8px] text-slate-500 font-mono block tracking-wider uppercase mt-0.5">WIFI HOTSPOT GATEWAY</span>
                  </div>

                  {/* Body Info */}
                  <div className="my-3 space-y-3.5 flex-1 flex flex-col justify-center">
                    
                    {/* Welcome Text */}
                    <p className="text-[10px] text-slate-300 leading-relaxed text-center px-1">
                      {welcomeText}
                    </p>

                    {/* Marketing Ad Banner */}
                    {enableAd && (
                      <div className="p-2 rounded-lg bg-slate-950 border border-dashed text-center" style={{ borderColor: `${portalAccent}50` }}>
                        <span className="text-[7px] text-amber-400 font-extrabold block mb-0.5 uppercase tracking-widest">إعلان حصري للزبائن</span>
                        <p className="text-[9px] text-slate-300 font-bold">{adText}</p>
                      </div>
                    )}

                    {/* Voucher Login Input */}
                    <div className="space-y-2">
                      {requirePhone && (
                        <div>
                          <label className="block text-[8px] font-bold text-slate-400 mb-1">أدخل رقم هاتفك أولاً (لتفعيل الدعاية)</label>
                          <input 
                            type="text" 
                            disabled 
                            placeholder="+966 5x xxx xxxx"
                            className="w-full text-center px-2 py-1.5 bg-slate-950 border border-slate-800 text-[10px] rounded-md text-slate-400 select-none outline-none"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-[8px] font-bold text-slate-400 mb-1">أدخل كود الكارت (Voucher Code)</label>
                        <input 
                          type="text" 
                          disabled 
                          placeholder="مثال: SBUX-8822"
                          className="w-full text-center px-2 py-2 bg-slate-950 border font-mono text-[11px] font-bold rounded-md outline-none"
                          style={{ borderColor: portalAccent, color: portalAccent }}
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      disabled
                      className="w-full py-2 rounded-lg text-slate-950 font-black text-xs select-none transition-all"
                      style={{ backgroundColor: portalAccent }}
                    >
                      تسجيل دخول وتفعيل الإنترنت
                    </button>
                  </div>

                  {/* Bottom Footer Credits */}
                  <div className="text-center">
                    <span className="text-[7px] text-slate-600 font-mono block">Secured by MikroRADIUS SaaS Cloud &bull; v4.0</span>
                  </div>
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-800 rounded-full" />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ROI Calculator */}
        {activeTab === 'roi' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="text-emerald-400" size={20} />
                  <span>حاسبة العائد الاستثماري لكافيهك (Hotspot Profitability Calculator)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  أثبت لعميلك (صاحب الكافيه) مدى ربحية اشتراكه معك بـ $49/ش، وكم سيجني من مبيعات كروت الواي فاي الممتازة وتجميع بيانات الزبائن.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                
                {/* Inputs */}
                <div className="lg:col-span-5 bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-slate-850 pb-2 mb-3">البيانات الأساسية للكافيه</h3>
                  
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-bold">عدد الزبائن المتوسط يومياً بالمحل</label>
                    <input 
                      type="number" 
                      value={roiDailyCustomers}
                      onChange={(e) => setRoiDailyCustomers(parseInt(e.target.value) || 50)}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm font-bold text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-bold">سعر كارت السرعة الممتازة (Premium Bypass)</label>
                    <input 
                      type="number" 
                      value={roiPremiumPrice}
                      onChange={(e) => setRoiPremiumPrice(parseInt(e.target.value) || 5)}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm font-bold text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-bold">نسبة الزبائن الراغبين بالترقية وشراء الكارت (%)</label>
                    <select
                      value={roiPremiumConv}
                      onChange={(e) => setRoiPremiumConv(parseInt(e.target.value) || 5)}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-white focus:outline-none"
                    >
                      <option value={3}>3% (متحفظة)</option>
                      <option value={6}>6% (متوسطة - الأكثر دقة)</option>
                      <option value={10}>10% (مرتفعة - منطقة نشطة)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-bold">القيمة التقديرية لرقم العميل لتسويق الـ SMS ($)</label>
                    <input 
                      type="number" 
                      step="0.5"
                      value={roiLeadVal}
                      onChange={(e) => setRoiLeadVal(parseFloat(e.target.value) || 1)}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Outputs Display */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                      <span className="text-slate-500 text-xs block mb-1">مبيعات كروت الواي فاي شهرياً</span>
                      <span className="text-2xl font-black text-emerald-400 font-mono">${monthlyPremiumRevenue.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 block mt-1">بمعدل {premiumDailySubscribers} كروت مباعة يومياً</span>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                      <span className="text-slate-500 text-xs block mb-1">أرقام هواتف الزبائن المجمّعة شهرياً</span>
                      <span className="text-2xl font-black text-white font-mono">{monthlyLeadsCollected.toLocaleString()} هاتف</span>
                      <span className="text-[10px] text-sky-400 block mt-1">تستخدم لحملات إعادة استهداف بالواتساب مجاناً</span>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                      <span className="text-slate-500 text-xs block mb-1">القيمة التسويقية للبيانات المجمّعة</span>
                      <span className="text-2xl font-black text-purple-400 font-mono">${monthlyLeadsValue.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 block mt-1">توفر قيمة الإعلانات الخارجية الباهظة للبراند</span>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
                      <span className="text-emerald-400 text-xs block mb-1 font-bold">إجمالي القيمة المضافة للكافيه شهرياً</span>
                      <span className="text-2xl font-black text-emerald-300 font-mono">${totalEstimatedValue.toLocaleString()}</span>
                      <span className="text-[10px] text-emerald-400 block mt-1 font-bold">تغطية تكلفتنا الإدارية بـ {Math.round(totalEstimatedValue / 49)} ضعفاً!</span>
                    </div>

                  </div>

                  {/* Summary Call-to-action Card */}
                  <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
                    <div className="space-y-2">
                      <h4 className="text-white text-sm font-bold flex items-center gap-1">
                        <CheckCircle className="text-emerald-400" size={16} />
                        <span>العرض التجاري لمالك مقهى الكورتادو جاهز!</span>
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        باستخدام هذه المقاييس الحية، يمكنك إقناع صاحب الكافيه أنه بإنفاق <strong>$49 شهرياً</strong> على اشتراك ريديوس السحابي الخاص بك، سيحصل على إيرادات مباشرة تفوق <strong>${totalEstimatedValue} شهرياً</strong>، بالإضافة إلى بناء قاعدة بيانات حقيقية لزبائن المحل للعودة والشراء مجدداً.
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-900 flex justify-end">
                      <button
                        onClick={() => alert('تم تصدير ملف دراسة الجدوى وعرض العوائد للكافيه بصيغة PDF تجريبية بنجاح!')}
                        className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs rounded-lg transition-all"
                      >
                        تحميل ملف دراسة الجدوى (العرض المالي)
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 5: RADIUS Daemon Monitor */}
        {activeTab === 'radius' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* System resources & server logs */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Terminal className="text-emerald-400" size={20} />
                  <span>مراقبة خادم FreeRADIUS Daemon السحابي النشط</span>
                </h2>
                
                <div className="flex gap-2">
                  <button 
                    onClick={triggerTestRADIUSLog}
                    className="px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-emerald-400 hover:text-emerald-300 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw size={12} className="animate-spin" />
                    <span>محاكاة مصادقة زبون كافيه</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl font-mono text-[11px] sm:text-xs text-emerald-400 space-y-2 h-64 overflow-y-auto text-left" dir="ltr">
                {terminalLogs.map((log, idx) => (
                  <div key={idx} className="whitespace-pre-wrap leading-relaxed border-l-2 border-slate-800 pl-2">
                    {log}
                  </div>
                ))}
              </div>
            </div>

            {/* Hardware monitoring */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <h3 className="text-xs font-extrabold text-slate-400 mb-2 uppercase tracking-widest">معدل البنج وAAA زمن الاستجابة</h3>
                <span className="text-2xl font-black text-white font-mono">1.15 ms</span>
                <p className="text-[10px] text-emerald-400 mt-1">سرعة المعالجة الفورية وتوزيع الكيوهات</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <h3 className="text-xs font-extrabold text-slate-400 mb-2 uppercase tracking-widest">تكامل قاعدة البيانات radcheck</h3>
                <span className="text-2xl font-black text-white font-mono">MySQL OK</span>
                <p className="text-[10px] text-emerald-400 mt-1">قاعدة بيانات المشتركين متصلة ومحصنة</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <h3 className="text-xs font-extrabold text-slate-400 mb-2 uppercase tracking-widest">بروتوكول PoD/CoA</h3>
                <span className="text-2xl font-black text-white font-mono">Port 3799 Active</span>
                <p className="text-[10px] text-emerald-400 mt-1">قطع الاتصال الفوري CoA مفعل للعملاء المكتفين</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Title card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-sky-500" />
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Lock className="text-emerald-400" size={20} />
                <span>إعدادات الدخول والأمان وكلمات المرور للمنصة</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                تتيح لك هذه الصفحة إدارة كلمات المرور وأسماء المستخدمين لمدراء النظام السحابي ومشغلي شبكة المايكروتك ISP.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SaaS SuperAdmin Password Form */}
              <form onSubmit={handleUpdateAdminCreds} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3 mb-2">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                    <Shield size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">حساب المسؤول السحابي (SaaS SuperAdmin)</h3>
                    <p className="text-[10px] text-slate-400">تستخدم للدخول إلى بوابة مبيعات الكافيهات ومراقبة السيرفر</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">اسم مستخدم المسؤول (Admin Username)</label>
                  <input 
                    type="text"
                    required
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-sm text-slate-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">كلمة مرور المسؤول (Admin Password)</label>
                  <input 
                    type="text"
                    required
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-sm text-slate-100 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save size={14} />
                  <span>حفظ بيانات المسؤول السحابي الجديدة</span>
                </button>
              </form>

              {/* ISP Panel Password Form */}
              <form onSubmit={handleUpdateIspCreds} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3 mb-2">
                  <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg">
                    <Server size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">حساب مشغل الشبكة والـ RADIUS (ISP Panel)</h3>
                    <p className="text-[10px] text-slate-400">تستخدم للوصول إلى لوحة المايكروتك لإنشاء وتوليد كروت الإنترنت</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">اسم مستخدم الـ ISP (ISP Username)</label>
                  <input 
                    type="text"
                    required
                    value={ispUser}
                    onChange={(e) => setIspUser(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl text-sm text-slate-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">كلمة مرور الـ ISP (ISP Password)</label>
                  <input 
                    type="text"
                    required
                    value={ispPass}
                    onChange={(e) => setIspPass(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl text-sm text-slate-100 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save size={14} />
                  <span>حفظ بيانات مشغل الشبكة الجديدة</span>
                </button>
              </form>
            </div>

            {/* Explanatory notes card */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <HelpCircle size={16} className="text-sky-400" />
                <span>كيف يتم تطبيق حماية الأمان وكلمات المرور؟</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                يتم ربط كلمات المرور المعدلة هنا محلياً بمتغيرات البيئة وملفات الإعداد الخاصة بالـ <code className="text-sky-400 font-mono">FreeRADIUS daemon</code> و الـ <code className="text-sky-400 font-mono">htaccess</code> الأمنية على سيرفر الـ Ubuntu الخاص بك. عند تشغيل السكريبت الآلي للتركيب على سيرفر أوبونتو 24، يقوم الخادم بتعطيل أي وصول خارجي لملفات التهيئة وحصرها بجدار الحماية لمنع أي اختراق لبيانات كروت الواي فاي المولدة.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Add Subscriber / Tenant Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-extrabold text-white">إضافة كافيه أو مطعم (مستأجر) جديد للمنصة</h3>
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
                  <label className="block text-xs text-slate-400 mb-1.5 font-bold">اسم المحل أو الكافيه</label>
                  <input 
                    type="text" 
                    required
                    placeholder="مثال: كافيه كورتادو لاند"
                    value={newSub.businessName}
                    onChange={(e) => setNewSub({...newSub, businessName: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-bold">اسم المالك</label>
                  <input 
                    type="text" 
                    required
                    placeholder="مثال: عثمان خالد"
                    value={newSub.ownerName}
                    onChange={(e) => setNewSub({...newSub, ownerName: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-bold">البريد الإلكتروني للعميل</label>
                  <input 
                    type="email" 
                    required
                    placeholder="owner@cafe.com"
                    value={newSub.email}
                    onChange={(e) => setNewSub({...newSub, email: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none text-left"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-bold">هاتف المالك</label>
                  <input 
                    type="text" 
                    required
                    placeholder="+966 50 123 4567"
                    value={newSub.phone}
                    onChange={(e) => setNewSub({...newSub, phone: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-bold">الباقة المطلوبة</label>
                  <select
                    value={newSub.planId}
                    onChange={(e) => setNewSub({...newSub, planId: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-sm text-slate-100 focus:outline-none"
                  >
                    <option value="basic">الباقة البرونزية (3 أجهزة مايكروتك - $19/ش)</option>
                    <option value="business">الباقة الذهبية (10 أجهزة مايكروتك - $49/ش)</option>
                    <option value="enterprise">الباقة اللامحدودة (أجهزة غير محدودة - $99/ش)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-bold">عدد أجهزة المايكروتك المسجلة</label>
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
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-lg transition-all"
                >
                  إنشاء حساب وتفعيل الريديوس
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leads Technical/Financial Proposal Modal */}
      {isProposalModalOpen && proposalData && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-extrabold text-white">العرض الفني والمالي المتكامل لربط الشبكة</h3>
              <button 
                onClick={() => setIsProposalModalOpen(false)}
                className="p-1 hover:bg-slate-850 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs sm:text-sm text-right leading-relaxed overflow-y-auto max-h-[75vh]">
              
              {/* Header */}
              <div className="text-center border-b border-slate-800 pb-4">
                <span className="text-xs text-sky-400 font-mono tracking-wider block">PREPARED BY MIKRORADIUS CLOUD PLATFORM</span>
                <h4 className="font-extrabold text-white text-lg mt-1">عرض تقديم الخدمة السحابية لإدارة الواي فاي والتحكم</h4>
                <p className="text-slate-400 text-xs mt-1">مُعد خصيصاً لـ: <strong>{proposalData.cafeName}</strong> &bull; فرع {proposalData.city}</p>
              </div>

              {/* Proposal Content */}
              <div className="space-y-4">
                <div>
                  <h5 className="font-bold text-white mb-1.5 text-xs text-sky-400">1. الملخص الفني للخدمة (Technical Specifications)</h5>
                  <p className="text-slate-300 text-xs">
                    تتضمن الخدمة ربط راوترات المايكروتك الخاصة بمحلك بخادم RADIUS AAA مركزي متواجد على أوبونتو 24.04 فائق الأمان. يتيح لك النظام:
                  </p>
                  <ul className="list-disc pr-5 mt-2 space-y-1 text-slate-400 text-[11px]">
                    <li>توليد كروت هوتسبوت بفترات صلاحية وسعة تحميل محددة.</li>
                    <li>إلزام الزبون بشحن الكارت أو شحن رصيده للحصول على خدمة إنترنت سريعة ومستقرة.</li>
                    <li>تخصيص كامل لصفحة هبوط تسجيل الدخول تحمل لوغو وألوان هويتك البصرية الخاصة بك مع لوحات إعلانية مميزة للزبائن.</li>
                    <li>لوحة تحكم إدارية وتطبيق موبايل للعمال لمراقبة استهلاك الإنترنت للزبائن وفصل المتجاوزين.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-white mb-1.5 text-xs text-sky-400">2. العرض السعري والمالي (Financial Model)</h5>
                  <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 p-4 space-y-2">
                    <div className="flex justify-between border-b border-slate-900 pb-2">
                      <span className="text-slate-400 font-bold">بند الخدمة</span>
                      <span className="text-slate-400 font-bold">التكلفة</span>
                    </div>
                    <div className="flex justify-between text-slate-200">
                      <span>الربط الهندسي الأولي والتهيئة لـ {proposalData.tables} طاولة</span>
                      <span className="font-bold text-emerald-400">مجانياً (ضمن باقة التفعيل الأسبوعي)</span>
                    </div>
                    <div className="flex justify-between text-slate-200">
                      <span>قالب صفحة هبوط هوتسبوت كافيه مخصص بالهوية البصرية</span>
                      <span className="font-bold text-white">$15 (مرة واحدة)</span>
                    </div>
                    <div className="flex justify-between text-slate-200 font-bold border-t border-slate-900 pt-2 text-white">
                      <span>الاشتراك الشهري بالريديوس السحابي (باقة ذهبية)</span>
                      <span className="font-bold text-emerald-400">${proposalData.monthlyPotential} / شهرياً</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-bold text-white mb-1.5 text-xs text-sky-400">3. العائد الاستثماري المتوقع لكافيهك (ROI Estimation)</h5>
                  <p className="text-slate-300 text-xs">
                    بتقدير متوسط حضور {roiDailyCustomers} زبون يومياً بمحلك، وتحويل {roiPremiumConv}% لخدمة الإنترنت المدفوع أو شحن بياناتهم، يتوقع كافيهك جني ما لا يقل عن <strong>${totalEstimatedValue.toLocaleString()} شهرياً</strong> كقيمة مباشرة تسويقية ونقدية. هذا يعني تغطية تكلفة الاشتراك السحابي البالغة <strong>${proposalData.monthlyPotential}/ش</strong> بنسبة <strong>{Math.round(totalEstimatedValue / proposalData.monthlyPotential)} ضعفاً!</strong>
                  </p>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button 
                  onClick={() => setIsProposalModalOpen(false)}
                  className="px-4 py-2 bg-slate-950 border border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  إغلاق العرض
                </button>
                <button 
                  onClick={() => {
                    alert('تم تحميل ملف العرض التجاري المطبوع بنجاح!');
                    setIsProposalModalOpen(false);
                  }}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-all"
                >
                  تحميل العرض كـ PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
