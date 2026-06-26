/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import AdminPanel from './components/AdminPanel';
import ISPPanel from './components/ISPPanel';
import UbuntuWizard from './components/UbuntuWizard';
import MobileSimulator from './components/MobileSimulator';
import { Voucher, Subscriber, ActiveSession } from './types';
import { Wifi, Server, Smartphone, Laptop, Settings, ArrowLeft, Terminal } from 'lucide-react';

const INITIAL_VOUCHERS: Voucher[] = [
  { id: 'v1', code: 'WiFi-883A', profileId: 'p1', profileName: 'سرعة 5 ميجا - تحميل غير محدود', serialNumber: '4120958102', isUsed: false, createdAt: '2026-06-25', price: 15 },
  { id: 'v2', code: 'WiFi-990B', profileId: 'p1', profileName: 'سرعة 5 ميجا - تحميل غير محدود', serialNumber: '9210452120', isUsed: true, usedBy: '00:15:5D:11:22:33', usedAt: '2026-06-24', createdAt: '2026-06-25', price: 15 },
  { id: 'v3', code: 'WiFi-321D', profileId: 'p2', profileName: 'سرعة 10 ميجا - فئة رجال الأعمال', serialNumber: '8823102451', isUsed: false, createdAt: '2026-06-25', price: 30 },
  { id: 'v4', code: 'WiFi-225C', profileId: 'p3', profileName: 'باقة هوتسبوت يومية - 2 جيجا كاب', serialNumber: '7102941029', isUsed: false, createdAt: '2026-06-25', price: 2 },
];

const INITIAL_SUBSCRIBERS: Subscriber[] = [
  { id: 's1', username: 'pppoe_villa_12', phone: '+966504441111', profileId: 'p2', profileName: 'سرعة 10 ميجا - فئة رجال الأعمال', type: 'pppoe', macAddress: '00:15:5D:80:FF:12', status: 'active', expirationDate: '2026-07-24', totalDataUsedGb: 45.8 },
  { id: 's2', username: 'customer_ali_salem', phone: '+966505552222', profileId: 'p1', profileName: 'سرعة 5 ميجا - تحميل غير محدود', type: 'hotspot', status: 'active', expirationDate: '2026-07-10', totalDataUsedGb: 12.4 },
  { id: 's3', username: 'pppoe_apt_5', phone: '+20104445555', profileId: 'p4', profileName: 'سرعة 2 ميجا - الباقة المخفضة', type: 'pppoe', status: 'expired', expirationDate: '2026-06-20', totalDataUsedGb: 88.0 },
];

const INITIAL_ACTIVE_SESSIONS: ActiveSession[] = [
  { id: 'as1', username: 'WiFi-990B', callerId: '00:15:5D:11:22:33', ipAddress: '10.5.50.150', nasIpAddress: '197.34.120.45', uptime: '4h 22m', downloadBytes: 2548020104, uploadBytes: 412502100, rateLimit: '2M/5M' },
  { id: 'as2', username: 'customer_ali_salem', callerId: '10:D0:7A:B3:CD:99', ipAddress: '10.5.50.88', nasIpAddress: '197.34.120.45', uptime: '1h 5m', downloadBytes: 852104000, uploadBytes: 94102000, rateLimit: '2M/5M' },
];

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'admin' | 'isp' | 'ubuntu'>('landing');
  const [isMobileSimOpen, setIsMobileSimOpen] = useState(false);

  // Unified global shared state for dynamic simulation
  const [vouchers, setVouchers] = useState<Voucher[]>(INITIAL_VOUCHERS);
  const [subscribers, setSubscribers] = useState<Subscriber[]>(INITIAL_SUBSCRIBERS);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>(INITIAL_ACTIVE_SESSIONS);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Banner indicating the network engine role */}
      {currentView !== 'landing' && (
        <div dir="rtl" className="bg-gradient-to-l from-sky-900 to-slate-900 border-b border-sky-800/30 text-[11px] font-semibold text-sky-200 px-6 py-2 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>خادم FreeRADIUS الرئيسي متصل ويعمل بنجاح على Ubuntu 24.04 Root (1812/1813)</span>
          </div>
          <div className="flex items-center gap-4">
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
          <LandingPage onEnterApp={(role) => setCurrentView(role === 'admin' ? 'admin' : 'isp')} />
        )}

        {currentView === 'admin' && (
          <AdminPanel onBack={() => setCurrentView('landing')} />
        )}

        {currentView === 'isp' && (
          <div className="relative">
            <ISPPanel 
              onBack={() => setCurrentView('landing')} 
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
                      <p className="text-xs text-slate-400 mt-1">تطبيق متصل بالريديوس يشحن الكروت المولدة، ويوضح حالة حسابات الموزعين والمشتركين مباشرة.</p>
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

