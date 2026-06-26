import React, { useState } from 'react';
import { Voucher, Subscriber, ActiveSession } from '../types';
import { 
  Smartphone, Battery, Wifi, Signal, RefreshCw, QrCode, 
  User, CheckCircle, AlertTriangle, Zap, DollarSign, Send, Key, Download, Upload, ShieldCheck
} from 'lucide-react';

interface MobileSimulatorProps {
  vouchers: Voucher[];
  setVouchers: React.Dispatch<React.SetStateAction<Voucher[]>>;
  subscribers: Subscriber[];
  setSubscribers: React.Dispatch<React.SetStateAction<Subscriber[]>>;
  activeSessions: ActiveSession[];
  setActiveSessions: React.Dispatch<React.SetStateAction<ActiveSession[]>>;
}

export default function MobileSimulator({
  vouchers,
  setVouchers,
  subscribers,
  setSubscribers,
  activeSessions,
  setActiveSessions
}: MobileSimulatorProps) {
  const [appRole, setAppRole] = useState<'agent' | 'customer'>('customer');
  const [voucherInput, setVoucherInput] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Simulation state for customer logged in
  const [customerSession, setCustomerSession] = useState<{
    username: string;
    speedProfile: string;
    timeLeft: string;
    quotaUsedGb: number;
    quotaLimitGb: number;
  } | null>(null);

  // Handle Voucher charging via customer app
  const handleChargeVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const foundVoucher = vouchers.find(v => v.code.toLowerCase() === voucherInput.trim().toLowerCase());

    if (!foundVoucher) {
      setErrorMessage('كود الكارت غير صحيح، يرجى التحقق وإعادة المحاولة.');
      return;
    }

    if (foundVoucher.isUsed) {
      setErrorMessage('عذراً، هذا الكارت تم شحنه واستعماله مسبقاً.');
      return;
    }

    // Mark voucher as used
    setVouchers(prev => prev.map(v => {
      if (v.id === foundVoucher.id) {
        return { ...v, isUsed: true, usedBy: 'Mobile App User', usedAt: new Date().toLocaleDateString() };
      }
      return v;
    }));

    // Add session
    const nextSession: ActiveSession = {
      id: 'sess_' + Math.random().toString(36).substr(2, 9),
      username: foundVoucher.code,
      callerId: 'A4:D1:E6:B2:77:F1',
      ipAddress: '10.5.50.' + Math.floor(2 + Math.random() * 250),
      nasIpAddress: '197.34.120.45',
      uptime: '0h 1m',
      downloadBytes: 154020,
      uploadBytes: 24500,
      rateLimit: '2M/5M'
    };

    setActiveSessions(prev => [nextSession, ...prev]);

    setCustomerSession({
      username: foundVoucher.code,
      speedProfile: foundVoucher.profileName,
      timeLeft: '29 يوم و 23 ساعة',
      quotaUsedGb: 0.1,
      quotaLimitGb: foundVoucher.profileName.includes('2 جيجا') ? 2 : 50
    });

    setSuccessMessage(`تم تفعيل كارت ${foundVoucher.profileName} بنجاح ومصادقته مع سيرفر ريديوس!`);
    setVoucherInput('');
  };

  // Agent quick-generate 5 vouchers from their phone
  const handleQuickAgentGenerate = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const newVouchersList: Voucher[] = [];

    for (let i = 0; i < 5; i++) {
      const serial = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      const randomCode = 'MOB-' + Math.floor(100000 + Math.random() * 900000);
      
      newVouchersList.push({
        id: 'v_mob_' + Math.random().toString(36).substr(2, 9),
        code: randomCode,
        profileId: 'p1',
        profileName: 'سرعة 5 ميجا - هاتف سريع',
        serialNumber: serial,
        isUsed: false,
        createdAt: timestamp,
        price: 15
      });
    }

    setVouchers(prev => [...newVouchersList, ...prev]);
    setSuccessMessage('تم توليد 5 كروت جديدة من الموبايل وإضافتها لقاعدة بيانات ريديوس!');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl w-full max-w-[360px] mx-auto shadow-2xl relative">
      {/* Phone Case Details */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-4.5 bg-slate-950 rounded-b-xl flex items-center justify-center gap-1.5 z-30">
        <div className="w-12 h-1 bg-slate-800 rounded-full" />
        <div className="w-2.5 h-2.5 bg-slate-850 rounded-full" />
      </div>

      {/* Screen Container */}
      <div dir="rtl" className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-900 flex flex-col justify-between h-[560px] relative">
        
        {/* Status Bar */}
        <div className="h-9 bg-slate-950 flex items-center justify-between px-4 text-[10px] font-mono text-slate-400 select-none z-20 pt-1.5">
          <span>08:38 ص</span>
          <div className="flex items-center gap-1">
            <Signal size={10} />
            <Wifi size={10} />
            <Battery size={10} />
          </div>
        </div>

        {/* Top App Header */}
        <div className="px-4 py-3 border-b border-slate-900 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/15">
              <Smartphone size={12} />
            </div>
            <span className="text-xs font-black text-white">تطبيق MikroRADIUS</span>
          </div>
          
          {/* Role Changer toggle within phone */}
          <div className="flex gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-850">
            <button 
              onClick={() => { setAppRole('customer'); setSuccessMessage(null); setErrorMessage(null); }}
              className={`px-2 py-1 text-[9px] font-bold rounded ${appRole === 'customer' ? 'bg-sky-500 text-slate-950' : 'text-slate-400'}`}
            >
              المشترك
            </button>
            <button 
              onClick={() => { setAppRole('agent'); setSuccessMessage(null); setErrorMessage(null); }}
              className={`px-2 py-1 text-[9px] font-bold rounded ${appRole === 'agent' ? 'bg-sky-500 text-slate-950' : 'text-slate-400'}`}
            >
              الموزّع
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          
          {/* Messages */}
          {successMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
              <CheckCircle size={14} className="shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-400 rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* CUSTOMER VIEWS */}
          {appRole === 'customer' && (
            <>
              {/* Not logged in / No session state */}
              {!customerSession ? (
                <div className="space-y-4 text-center py-6">
                  <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-xl space-y-2">
                    <User className="mx-auto text-sky-400" size={32} />
                    <h3 className="text-xs font-bold text-white">تفعيل كارت الواي فاي</h3>
                    <p className="text-[10px] text-slate-500 leading-relaxed">أدخل كود كارت الهوتسبوت الذي اشتريته من الموزع لتفعيل الإنترنت لجهازك فورياً</p>
                  </div>

                  <form onSubmit={handleChargeVoucher} className="space-y-3">
                    <div className="relative">
                      <Key className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                      <input 
                        type="text" 
                        required
                        placeholder="كود الكارت (WiFi-XXXXXX)"
                        value={voucherInput}
                        onChange={(e) => setVoucherInput(e.target.value)}
                        className="w-full pl-3 pr-9 py-2 bg-slate-900 border border-slate-850 rounded-lg text-xs font-mono font-bold placeholder:text-slate-600 focus:outline-none text-left"
                        dir="ltr"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-md shadow-sky-500/15"
                    >
                      <Send size={12} />
                      <span>شحن الكارت والاتصال بالشبكة</span>
                    </button>
                  </form>

                  <div className="pt-4 border-t border-slate-900">
                    <span className="text-[10px] text-slate-500 block">هل تملك حساباً منزلياً دائم؟</span>
                    <button 
                      onClick={() => {
                        setCustomerSession({
                          username: 'home_user_99',
                          speedProfile: 'سرعة 10 ميجا منزلية',
                          timeLeft: '12 يوم متبقية',
                          quotaUsedGb: 14.5,
                          quotaLimitGb: 100
                        });
                      }}
                      className="text-[10px] text-sky-400 font-bold underline mt-1"
                    >
                      تسجيل الدخول كـ PPPoE
                    </button>
                  </div>
                </div>
              ) : (
                /* Logged in Active Session View */
                <div className="space-y-4">
                  
                  {/* Status Card */}
                  <div className="bg-sky-500/5 border border-sky-500/10 p-4 rounded-xl space-y-3 text-center">
                    <div className="p-2 bg-sky-500/10 text-sky-400 rounded-full w-fit mx-auto">
                      <ShieldCheck size={28} className="animate-pulse" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">حسابك متصل ومصادق بالريديوس</span>
                      <span className="text-xs font-bold text-white font-mono">{customerSession.username}</span>
                    </div>
                  </div>

                  {/* Quota details */}
                  <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-xl space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">الباقة المشترك بها:</span>
                      <span className="font-bold text-white">{customerSession.speedProfile}</span>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] mb-1 font-mono">
                        <span>الاستهلاك الكلي</span>
                        <span>{customerSession.quotaUsedGb} GB / {customerSession.quotaLimitGb} GB</span>
                      </div>
                      <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-sky-500 rounded-full" 
                          style={{ width: `${(customerSession.quotaUsedGb / customerSession.quotaLimitGb) * 100}%` }} 
                        />
                      </div>
                    </div>

                    <div className="flex justify-between text-[11px] border-t border-slate-850 pt-2.5">
                      <span className="text-slate-400">الوقت المتبقي لانتهاء الكارت:</span>
                      <span className="font-bold text-sky-400">{customerSession.timeLeft}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCustomerSession(null);
                      setSuccessMessage('تم تسجيل الخروج وقطع الاتصال من سيرفر الريديوس.');
                    }}
                    className="w-full py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-bold hover:bg-rose-500/20 transition-colors"
                  >
                    قطع الاتصال (Logout)
                  </button>

                </div>
              )}
            </>
          )}

          {/* AGENT VIEWS */}
          {appRole === 'agent' && (
            <div className="space-y-4">
              
              {/* Agent Quick Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-900 p-2.5 border border-slate-850 rounded-xl text-center">
                  <span className="text-[8px] text-slate-500 block">مبيعات اليوم</span>
                  <span className="text-xs font-bold text-white font-mono">$125</span>
                </div>
                <div className="bg-slate-900 p-2.5 border border-slate-850 rounded-xl text-center">
                  <span className="text-[8px] text-slate-500 block">إجمالي كروت الموزع</span>
                  <span className="text-xs font-bold text-white font-mono">{vouchers.length}</span>
                </div>
              </div>

              {/* Agent tools */}
              <div className="p-3 bg-slate-900/60 border border-slate-900 rounded-xl space-y-2">
                <h4 className="text-[11px] font-bold text-white">إجراءات الموزع السريعة</h4>
                <p className="text-[9px] text-slate-500">تحكم بالشبكة وولد الكروت للزبائن مباشرة من يدك</p>

                <div className="space-y-2 pt-2">
                  <button 
                    onClick={handleQuickAgentGenerate}
                    className="w-full py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    <Zap size={11} />
                    <span>توليد 5 كروت سريعة للزبائن</span>
                  </button>

                  <button 
                    onClick={() => {
                      const code = prompt('امسح أو اكتب كود الكارت لتفعيل اشتراكه فورا:');
                      if (code) {
                        setVoucherInput(code);
                        setAppRole('customer');
                      }
                    }}
                    className="w-full py-2 bg-slate-950 border border-slate-850 text-slate-300 rounded-lg text-xs hover:bg-slate-900 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <QrCode size={11} />
                    <span>مسح كود كارت (QR Scanner)</span>
                  </button>
                </div>
              </div>

              {/* Recent Vouchers List on Phone */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 block font-bold">آخر الكروت المتاحة للشحن:</span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {vouchers.slice(0, 5).map((v, i) => (
                    <div key={i} className="bg-slate-900 p-2 rounded-lg border border-slate-850 flex justify-between items-center text-[10px]">
                      <div>
                        <span className="font-bold text-white font-mono select-all">{v.code}</span>
                        <span className="text-[8px] text-slate-500 block font-sans">{v.profileName}</span>
                      </div>
                      <span className="font-mono text-emerald-400 font-bold">${v.price}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Home button notch */}
        <div className="h-4 bg-slate-950 border-t border-slate-900 flex items-center justify-center">
          <div className="w-16 h-1 bg-slate-800 rounded-full" />
        </div>

      </div>
    </div>
  );
}
