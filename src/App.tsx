import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import AdminPanel from './components/AdminPanel';
import ISPPanel from './components/ISPPanel';
import UbuntuWizard from './components/UbuntuWizard';
import MobileSimulator from './components/MobileSimulator';
import { Voucher, Subscriber, ActiveSession } from './types';
import { Wifi, Server, Smartphone, Laptop, Settings, ArrowLeft, Terminal, ShieldAlert, LogOut } from 'lucide-react';

// Define Multi-tenant Datasets
export interface TenantData {
  id: string;
  businessName: string;
  ownerName: string;
  category: 'cafe' | 'restaurant' | 'hotel' | 'isp' | 'coworking';
  logoUrl?: string;
  primaryColor: string; // Tailwind class like "sky" or "emerald"
  routers: any[];
  profiles: any[];
  vouchers: Voucher[];
  subscribers: Subscriber[];
  activeSessions: ActiveSession[];
}

const DEFAULT_TENANT_DATA: Record<string, TenantData> = {
  default_isp: {
    id: 'default_isp',
    businessName: 'منظومة الإنترنت الافتراضية',
    ownerName: 'الموزع الرئيسي',
    category: 'isp',
    primaryColor: 'sky',
    routers: [
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
      }
    ],
    profiles: [
      { id: 'p1', name: 'سرعة 5 ميجا - تحميل غير محدود', downloadLimit: '5M', uploadLimit: '2M', rateLimitString: '2M/5M', price: 15, validityDays: 30 },
      { id: 'p2', name: 'سرعة 10 ميجا - فئة رجال الأعمال', downloadLimit: '10M', uploadLimit: '5M', rateLimitString: '5/10M', price: 30, validityDays: 30 },
      { id: 'p3', name: 'باقة هوتسبوت يومية - 2 جيجا كاب', downloadLimit: '4M', uploadLimit: '1M', rateLimitString: '1M/4M', price: 2, validityDays: 1, quotaLimitGb: 2 },
    ],
    vouchers: [
      { id: 'v1', code: 'WiFi-883A', profileId: 'p1', profileName: 'سرعة 5 ميجا - تحميل غير محدود', serialNumber: '4120958102', isUsed: false, createdAt: '2026-06-25', price: 15 },
      { id: 'v2', code: 'WiFi-990B', profileId: 'p1', profileName: 'سرعة 5 ميجا - تحميل غير محدود', serialNumber: '9210452120', isUsed: true, usedBy: '00:15:5D:11:22:33', usedAt: '2026-06-24', createdAt: '2026-06-25', price: 15 },
      { id: 'v3', code: 'WiFi-321D', profileId: 'p2', profileName: 'سرعة 10 ميجا - فئة رجال الأعمال', serialNumber: '8823102451', isUsed: false, createdAt: '2026-06-25', price: 30 },
    ],
    subscribers: [
      { id: 's1', username: 'pppoe_villa_12', phone: '+966504441111', profileId: 'p2', profileName: 'سرعة 10 ميجا - فئة رجال الأعمال', type: 'pppoe', macAddress: '00:15:5D:80:FF:12', status: 'active', expirationDate: '2026-07-24', totalDataUsedGb: 45.8 },
      { id: 's2', username: 'customer_ali_salem', phone: '+966505552222', profileId: 'p1', profileName: 'سرعة 5 ميجا - تحميل غير محدود', type: 'hotspot', status: 'active', expirationDate: '2026-07-10', totalDataUsedGb: 12.4 },
    ],
    activeSessions: [
      { id: 'as1', username: 'WiFi-990B', callerId: '00:15:5D:11:22:33', ipAddress: '10.5.50.150', nasIpAddress: '197.34.120.45', uptime: '4h 22m', downloadBytes: 2548020104, uploadBytes: 412502100, rateLimit: '2M/5M' },
    ]
  },
  sub1: {
    id: 'sub1',
    businessName: 'كافيه ستاربكس - فرع الياسمين',
    ownerName: 'أحمد محمود العتيبي',
    category: 'cafe',
    primaryColor: 'emerald',
    routers: [
      {
        id: 'r_sbux1',
        name: 'ميكروتك صالة الجلوس (CCR1009)',
        ipAddress: '10.10.10.1',
        radiusSecret: 'StarbucksSecretWifiKey',
        apiPort: 8728,
        apiUser: 'sbux_admin',
        apiPass: 'Starbucks9988',
        status: 'online',
        location: 'خلف الكاونتر الرئيسي',
        model: 'MikroTik CCR1009-7G-1C-1S+',
        activeUsers: 48,
        cpuUsage: 12,
        ramUsage: 28,
        uptime: '38d 14h',
      },
      {
        id: 'r_sbux2',
        name: 'أكسس بوينت الجلسات الخارجية',
        ipAddress: '10.10.10.2',
        radiusSecret: 'StarbucksSecretWifiKey',
        apiPort: 8728,
        apiUser: 'sbux_admin',
        apiPass: 'Starbucks9988',
        status: 'online',
        location: 'الجلسات الخارجية المطلة على الشارع',
        model: 'MikroTik hAP ac2',
        activeUsers: 22,
        cpuUsage: 25,
        ramUsage: 44,
        uptime: '8d 2h',
      }
    ],
    profiles: [
      { id: 'p_sbux_free', name: 'باقة القهوة المجانية (1 ساعة)', downloadLimit: '2M', uploadLimit: '1M', rateLimitString: '1M/2M', price: 0, validityDays: 1, quotaLimitGb: 0.5 },
      { id: 'p_sbux_premium', name: 'باقة عمل وتصفح فائق السرعة', downloadLimit: '12M', uploadLimit: '6M', rateLimitString: '6M/12M', price: 5, validityDays: 1, quotaLimitGb: 4.0 },
      { id: 'p_sbux_vip', name: 'باقة الاجتماعات المغلقة السنوية', downloadLimit: '30M', uploadLimit: '15M', rateLimitString: '15M/30M', price: 99, validityDays: 30, quotaLimitGb: 100.0 }
    ],
    vouchers: [
      { id: 'v_sbux1', code: 'SBUX-COFFEE', profileId: 'p_sbux_free', profileName: 'باقة القهوة المجانية (1 ساعة)', serialNumber: '1004128501', isUsed: false, createdAt: '2026-06-27', price: 0 },
      { id: 'v_sbux2', code: 'SBUX-WORKER', profileId: 'p_sbux_premium', profileName: 'باقة عمل وتصفح فائق السرعة', serialNumber: '1004128502', isUsed: true, usedBy: 'AA:BB:CC:11:22:33', usedAt: '2026-06-27', createdAt: '2026-06-27', price: 5 },
      { id: 'v_sbux3', code: 'SBUX-VIP99', profileId: 'p_sbux_vip', profileName: 'باقة الاجتماعات المغلقة السنوية', serialNumber: '1004128503', isUsed: false, createdAt: '2026-06-27', price: 99 },
    ],
    subscribers: [
      { id: 's_sbux1', username: 'starbucks_vip_guest', phone: '+966555112233', profileId: 'p_sbux_vip', profileName: 'باقة الاجتماعات المغلقة السنوية', type: 'hotspot', status: 'active', expirationDate: '2026-08-25', totalDataUsedGb: 14.5 }
    ],
    activeSessions: [
      { id: 'as_sbux1', username: 'SBUX-WORKER', callerId: 'AA:BB:CC:11:22:33', ipAddress: '10.10.10.154', nasIpAddress: '10.10.10.1', uptime: '1h 14m', downloadBytes: 812401042, uploadBytes: 154210405, rateLimit: '6M/12M' }
    ]
  },
  sub2: {
    id: 'sub2',
    businessName: 'مطعم برجر هاوس - الفرع الرئيسي',
    ownerName: 'عبد الإله الطنجي',
    category: 'restaurant',
    primaryColor: 'amber',
    routers: [
      {
        id: 'r_bh1',
        name: 'ميكروتك مطعم برجر هاوس (hEX gr3)',
        ipAddress: '192.168.88.1',
        radiusSecret: 'BurgerSecret99',
        apiPort: 8728,
        apiUser: 'admin',
        apiPass: 'BurgerHousePass',
        status: 'online',
        location: 'كابينة الشبكة الداخلية',
        model: 'MikroTik hEX gr3 (RB750Gr3)',
        activeUsers: 14,
        cpuUsage: 18,
        ramUsage: 45,
        uptime: '4d 1h',
      }
    ],
    profiles: [
      { id: 'p_bh_free', name: 'إنترنت الزبائن السريع (30 دقيقة)', downloadLimit: '3M', uploadLimit: '1.5M', rateLimitString: '1.5M/3M', price: 0, validityDays: 1, quotaLimitGb: 0.3 }
    ],
    vouchers: [
      { id: 'v_bh1', code: 'BURGER-EAT', profileId: 'p_bh_free', profileName: 'إنترنت الزبائن السريع (30 دقيقة)', serialNumber: '2210452109', isUsed: false, createdAt: '2026-06-27', price: 0 },
      { id: 'v_bh2', code: 'BURGER-FREE', profileId: 'p_bh_free', profileName: 'إنترنت الزبائن السريع (30 دقيقة)', serialNumber: '2210452110', isUsed: true, usedBy: '88:99:AA:BB:CC:DD', usedAt: '2026-06-27', createdAt: '2026-06-27', price: 0 },
    ],
    subscribers: [],
    activeSessions: [
      { id: 'as_bh1', username: 'BURGER-FREE', callerId: '88:99:AA:BB:CC:DD', ipAddress: '192.168.88.54', nasIpAddress: '192.168.88.1', uptime: '12m', downloadBytes: 42104502, uploadBytes: 8412014, rateLimit: '1.5M/3M' }
    ]
  },
  sub3: {
    id: 'sub3',
    businessName: 'فندق القصر الفاخر (Luxe Palace Hotel)',
    ownerName: 'محمود عبد الرازق',
    category: 'hotel',
    primaryColor: 'purple',
    routers: [
      {
        id: 'r_luxe1',
        name: 'ميكروتك الفندق الرئيسي (CCR2004)',
        ipAddress: '172.16.0.1',
        radiusSecret: 'LuxeHotelSecret999',
        apiPort: 8728,
        apiUser: 'luxe_radius_api',
        apiPass: 'LuxePass4321',
        status: 'online',
        location: 'غرفة التحكم والسيرفرات - الطابق الأرضي',
        model: 'MikroTik CCR2004-16G-2S+',
        activeUsers: 340,
        cpuUsage: 8,
        ramUsage: 22,
        uptime: '92d 18h',
      },
      {
        id: 'r_luxe2',
        name: 'شبكة الكافيه واللوبي الداخلي',
        ipAddress: '172.16.0.2',
        radiusSecret: 'LuxeHotelSecret999',
        apiPort: 8728,
        apiUser: 'luxe_radius_api',
        apiPass: 'LuxePass4321',
        status: 'online',
        location: 'سقف بهو الفندق الرئيسي',
        model: 'MikroTik RB4011iGS+',
        activeUsers: 94,
        cpuUsage: 35,
        ramUsage: 51,
        uptime: '14d 6h',
      }
    ],
    profiles: [
      { id: 'p_luxe_guest', name: 'باقة النزلاء العادية (24 ساعة)', downloadLimit: '4M', uploadLimit: '2M', rateLimitString: '2M/4M', price: 10, validityDays: 1, quotaLimitGb: 2.0 },
      { id: 'p_luxe_premium', name: 'الباقة الذهبية للغرف والأجنحة', downloadLimit: '15M', uploadLimit: '8M', rateLimitString: '8M/15M', price: 35, validityDays: 7, quotaLimitGb: 15.0 },
      { id: 'p_luxe_vip', name: 'الباقة الفائقة اللامحدودة (VIP)', downloadLimit: '40M', uploadLimit: '20M', rateLimitString: '20M/40M', price: 120, validityDays: 30, quotaLimitGb: 100.0 }
    ],
    vouchers: [
      { id: 'v_luxe1', code: 'LUXE-ROOM102', profileId: 'p_luxe_guest', profileName: 'باقة النزلاء العادية (24 ساعة)', serialNumber: '3304125810', isUsed: false, createdAt: '2026-06-27', price: 10 },
      { id: 'v_luxe2', code: 'LUXE-ROOM305', profileId: 'p_luxe_premium', profileName: 'الباقة الذهبية للغرف والأجنحة', serialNumber: '3304125811', isUsed: true, usedBy: '11:22:33:44:55:66', usedAt: '2026-06-27', createdAt: '2026-06-27', price: 35 },
    ],
    subscribers: [
      { id: 's_luxe1', username: 'guest_suite_501', phone: '+966544002211', profileId: 'p_luxe_vip', profileName: 'الباقة الفائقة اللامحدودة (VIP)', type: 'pppoe', macAddress: '00:15:5D:AA:BB:CC', status: 'active', expirationDate: '2026-07-15', totalDataUsedGb: 44.2 }
    ],
    activeSessions: [
      { id: 'as_luxe1', username: 'LUXE-ROOM305', callerId: '11:22:33:44:55:66', ipAddress: '172.16.10.45', nasIpAddress: '172.16.0.1', uptime: '3h 10m', downloadBytes: 2401024502, uploadBytes: 310240102, rateLimit: '8M/15M' }
    ]
  }
};

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'admin' | 'isp' | 'ubuntu'>('landing');
  const [isMobileSimOpen, setIsMobileSimOpen] = useState(false);

  // Impersonation state
  const [impersonatedTenant, setImpersonatedTenant] = useState<TenantData | null>(null);

  // Dynamic shared data states for ISP panel (defaults to standard network, or loads impersonated client on demand)
  const [vouchers, setVouchers] = useState<Voucher[]>(DEFAULT_TENANT_DATA.default_isp.vouchers);
  const [subscribers, setSubscribers] = useState<Subscriber[]>(DEFAULT_TENANT_DATA.default_isp.subscribers);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>(DEFAULT_TENANT_DATA.default_isp.activeSessions);

  // Callback to log in as a specific restaurant or café owner (impersonation)
  const handleImpersonateTenant = (tenantId: string) => {
    const data = DEFAULT_TENANT_DATA[tenantId];
    if (data) {
      setImpersonatedTenant(data);
      setVouchers(data.vouchers);
      setSubscribers(data.subscribers);
      setActiveSessions(data.activeSessions);
      setCurrentView('isp');
    } else {
      // Fallback
      setImpersonatedTenant(null);
      setVouchers(DEFAULT_TENANT_DATA.default_isp.vouchers);
      setSubscribers(DEFAULT_TENANT_DATA.default_isp.subscribers);
      setActiveSessions(DEFAULT_TENANT_DATA.default_isp.activeSessions);
      setCurrentView('isp');
    }
  };

  // Exit Impersonation and return to SuperAdmin
  const handleExitImpersonation = () => {
    setImpersonatedTenant(null);
    setVouchers(DEFAULT_TENANT_DATA.default_isp.vouchers);
    setSubscribers(DEFAULT_TENANT_DATA.default_isp.subscribers);
    setActiveSessions(DEFAULT_TENANT_DATA.default_isp.activeSessions);
    setCurrentView('admin');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Dynamic Top Banner */}
      {currentView !== 'landing' && (
        <div dir="rtl" className="bg-gradient-to-l from-sky-950 via-slate-950 to-slate-900 border-b border-sky-900/40 text-[11px] font-semibold text-sky-200 px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 no-print">
          <div className="flex items-center gap-2">
            {impersonatedTenant ? (
              <div className="flex items-center gap-2 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">
                <ShieldAlert size={11} />
                <span>أنت مسجّل كمسؤول للنظام (SuperAdmin) - تصفح متكامل للعميل: {impersonatedTenant.businessName}</span>
              </div>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>خادم FreeRADIUS الرئيسي متصل ويعمل بنجاح على Ubuntu 24.04 Root (1812/1813)</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            {impersonatedTenant && (
              <button 
                onClick={handleExitImpersonation}
                className="bg-rose-500 hover:bg-rose-400 text-slate-950 font-extrabold px-2.5 py-0.5 rounded flex items-center gap-1 transition-all"
              >
                <LogOut size={11} />
                <span>العودة للوحة SaaS الإدارية</span>
              </button>
            )}
            <button 
              onClick={() => setCurrentView('ubuntu')}
              className="hover:text-white flex items-center gap-1 underline transition-all"
            >
              <Terminal size={12} />
              <span>سكريبت التثبيت على Ubuntu 24</span>
            </button>
            <button 
              onClick={() => setIsMobileSimOpen(!isMobileSimOpen)}
              className="hover:text-white flex items-center gap-1 underline transition-all"
            >
              <Smartphone size={12} />
              <span>{isMobileSimOpen ? 'إخفاء تطبيق الموبايل' : 'إظهار تطبيق الموبايل'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Render selected view */}
      <div className="flex-1">
        {currentView === 'landing' && (
          <LandingPage onEnterApp={(role) => {
            if (role === 'admin') {
              setCurrentView('admin');
            } else {
              setImpersonatedTenant(null);
              setVouchers(DEFAULT_TENANT_DATA.default_isp.vouchers);
              setSubscribers(DEFAULT_TENANT_DATA.default_isp.subscribers);
              setActiveSessions(DEFAULT_TENANT_DATA.default_isp.activeSessions);
              setCurrentView('isp');
            }
          }} />
        )}

        {currentView === 'admin' && (
          <AdminPanel 
            onBack={() => setCurrentView('landing')} 
            onImpersonateTenant={handleImpersonateTenant} 
          />
        )}

        {currentView === 'isp' && (
          <div className="relative">
            <ISPPanel 
              onBack={() => {
                if (impersonatedTenant) {
                  handleExitImpersonation();
                } else {
                  setCurrentView('landing');
                }
              }} 
              onOpenMobileSim={() => setIsMobileSimOpen(true)}
              vouchers={vouchers}
              setVouchers={setVouchers}
              subscribers={subscribers}
              setSubscribers={setSubscribers}
              activeSessions={activeSessions}
              setActiveSessions={setActiveSessions}
            />

            {/* Side-Drawer with absolute overlay for Mobile Simulator */}
            {isMobileSimOpen && (
              <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex justify-end no-print">
                <div className="bg-slate-900 border-l border-slate-800 p-6 w-full max-w-sm h-full overflow-y-auto relative animate-in slide-in-from-left duration-200">
                  <button 
                    onClick={() => setIsMobileSimOpen(false)}
                    className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="mt-8 space-y-6">
                    <div className="text-right">
                      <h3 className="text-sm font-black text-white">محاكاة تجربة تطبيق الهاتف</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        تطبيق متصل بالريديوس يشحن كروت {impersonatedTenant ? impersonatedTenant.businessName : 'الشبكة الافتراضية'}، ويوضح حالة المشتركين مباشرة.
                      </p>
                    </div>
                    <MobileSimulator 
                      vouchers={vouchers}
                      setVouchers={setVouchers}
                      subscribers={subscribers}
                      setSubscribers={setSubscribers}
                      activeSessions={activeSessions}
                      setActiveSessions={setActiveSessions}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'ubuntu' && (
          <div className="space-y-4">
            <div className="max-w-4xl mx-auto px-4 pt-4 no-print" dir="rtl">
              <button 
                onClick={() => setCurrentView('isp')}
                className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
              >
                &larr; العودة للوحة تحكم ريديوس (ISP Panel)
              </button>
            </div>
            <UbuntuWizard />
          </div>
        )}
      </div>

    </div>
  );
}
