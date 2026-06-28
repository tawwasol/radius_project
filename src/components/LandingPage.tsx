import React, { useState } from 'react';
import { Shield, Cpu, Smartphone, Users, Zap, Layers, BarChart3, Wifi, Server, Check, ArrowRight, BookOpen, Lock, User, Key, Eye, EyeOff, Edit3, Save, X, RefreshCw } from 'lucide-react';

interface LandingPageProps {
  onEnterApp: (role: 'isp' | 'admin') => void;
}

export default function LandingPage({ onEnterApp }: LandingPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>('business');
  
  // Login modal and credentials state
  const [loginModalType, setLoginModalType] = useState<'admin' | 'isp' | null>(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Editing credentials state
  const [isEditingCredentials, setIsEditingCredentials] = useState(false);
  const [editUser, setEditUser] = useState('');
  const [editPass, setEditPass] = useState('');

  // Load credentials from localStorage or defaults
  const getStoredCreds = (type: 'admin' | 'isp') => {
    if (type === 'admin') {
      const u = localStorage.getItem('saas_admin_username') || 'Admin';
      const p = localStorage.getItem('saas_admin_password') || 'Asd123Asd1979';
      return { u, p };
    } else {
      const u = localStorage.getItem('saas_isp_username') || 'isp';
      const p = localStorage.getItem('saas_isp_password') || 'isp';
      return { u, p };
    }
  };

  const openLoginModal = (type: 'admin' | 'isp') => {
    setLoginModalType(type);
    const { u, p } = getStoredCreds(type);
    setEditUser(u);
    setEditPass(p);
    setIsEditingCredentials(false);
    setLoginError('');
    setUsernameInput('');
    setPasswordInput('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginModalType) return;

    const { u, p } = getStoredCreds(loginModalType);

    if (usernameInput.trim() === u && passwordInput.trim() === p) {
      setLoginError('');
      onEnterApp(loginModalType);
      setLoginModalType(null);
      setUsernameInput('');
      setPasswordInput('');
    } else {
      setLoginError('اسم المستخدم أو كلمة المرور غير صحيحة! يرجى التحقق من بيانات الدخول والمحاولة مرة أخرى.');
    }
  };

  const handleSaveCredentials = () => {
    if (!loginModalType) return;
    if (!editUser.trim() || !editPass.trim()) {
      alert('الرجاء إدخال اسم مستخدم وكلمة مرور صالحة!');
      return;
    }
    if (loginModalType === 'admin') {
      localStorage.setItem('saas_admin_username', editUser.trim());
      localStorage.setItem('saas_admin_password', editPass.trim());
    } else {
      localStorage.setItem('saas_isp_username', editUser.trim());
      localStorage.setItem('saas_isp_password', editPass.trim());
    }
    alert('تم تحديث بيانات الدخول بنجاح! يمكنك الآن استخدام البيانات الجديدة لتسجيل الدخول.');
    setIsEditingCredentials(false);
    
    // Auto populate the login inputs with the newly saved ones to make it smooth
    setUsernameInput(editUser.trim());
    setPasswordInput(editPass.trim());
  };

  const plans = [
    {
      id: 'basic',
      name: 'الباقة البرونزية',
      price: '19',
      routers: 'حتى 3 راوتر مايكروتك',
      users: 'حتى 500 مستخدم نشط',
      features: [
        'سيرفر RADIUS سحابي مخصص',
        'توليد كروت الهوتسبوت والـ PPPoE',
        'مراقبة بسيطة لحالة الميكروتك',
        'تحديث تلقائي لحالة المشتركين',
        'دعم فني عبر التذاكر',
      ],
      color: 'border-slate-700 hover:border-slate-500'
    },
    {
      id: 'business',
      name: 'الباقة الذهبية (الأكثر طلباً)',
      price: '49',
      routers: 'حتى 10 راوترات مايكروتك',
      users: 'حتى 3000 مستخدم نشط',
      features: [
        'كل ميزات الباقة البرونزية',
        'لوحة تحكم خاصة للعملاء وتطبيق الهاتف',
        'مزامنة الأجهزة الفورية بالـ API',
        'تصدير الكروت بجودة عالية للطباعة المباشرة',
        'تنبيهات SMS وتلجرام مجانية للمشتركين',
        'دعم فني متواصل 24/7 مع مهندس شبكات',
      ],
      popular: true,
      color: 'border-sky-500 shadow-lg shadow-sky-500/10'
    },
    {
      id: 'enterprise',
      name: 'الباقة اللامحدودة للموزعين',
      price: '99',
      routers: 'راوترات غير محدودة',
      users: 'مستخدمين غير محدودين',
      features: [
        'كل ميزات الباقة الذهبية',
        'سيرفر RADIUS مخصص بالكامل على سحابتنا أو سيرفرك الخاص',
        'شعار مخصص لشركتك (White Label)',
        'تطبيق هاتف خاص باسم شبكتك على Google Play & App Store',
        'نظام دفع وتجديد تلقائي عبر بوابات الدفع المحلية',
        'جلسة إعداد واستشارة هندسية لتأمين وتوزيع شبكتك',
      ],
      color: 'border-slate-700 hover:border-purple-500'
    }
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden font-sans selection:bg-sky-500 selection:text-white">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.15),transparent_60%)] pointer-events-none" />
      <div className="absolute top-[800px] right-0 w-96 h-96 bg-sky-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[1800px] left-0 w-96 h-96 bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/15 rounded-xl border border-sky-500/20 text-sky-400">
              <Wifi size={28} className="animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-l from-white to-sky-400 bg-clip-text text-transparent">MikroRADIUS SaaS</span>
              <span className="block text-[10px] text-sky-500 font-mono tracking-widest text-left">v4.0 PRO</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">الميزات الأساسية</a>
            <a href="#ubuntu" className="hover:text-white transition-colors">سيرفر Ubuntu 24</a>
            <a href="#mobile" className="hover:text-white transition-colors">تطبيق الموبايل</a>
            <a href="#pricing" className="hover:text-white transition-colors">الأسعار والخطط</a>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => openLoginModal('admin')}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-all border border-transparent hover:border-slate-800"
            >
              بوابة المسؤول (SaaS Admin)
            </button>
            <button 
              onClick={() => openLoginModal('isp')}
              className="px-5 py-2.5 text-sm bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg transition-all hover:shadow-lg hover:shadow-sky-500/20 flex items-center gap-2"
            >
              <span>دخول لوحة تحكم الشبكات</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-24 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium mb-8">
          <Server size={14} />
          <span>جاهز للتثبيت على سيرفر Ubuntu 24.04 LTS الخاص بك</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          مشروعك التجاري لبيع خدمات <span className="bg-gradient-to-l from-sky-400 to-sky-500 bg-clip-text text-transparent">التحكم بالمايكروتك</span> عبر الـ RADIUS
        </h1>
        
        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          منصة تجارية SaaS متكاملة صُممت بواسطة مهندسي شبكات لمحترفي الويب ومزودي خدمات الإنترنت. تحكّم بكامل شبكتك، ولّد الكروت، وراقب عملائك بكل سهولة ومن أي مكان مع تطبيق الهاتف.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => openLoginModal('isp')}
            className="w-full sm:w-auto px-8 py-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-base rounded-xl transition-all shadow-lg hover:shadow-sky-500/25 flex items-center justify-center gap-2"
          >
            <span>ابدأ تجربة المنصة الآن مجاناً</span>
            <ArrowRight size={18} />
          </button>
          <a 
            href="#ubuntu"
            className="w-full sm:w-auto px-8 py-4 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold text-base rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <BookOpen size={18} />
            <span>كود سكريبت Ubuntu 24</span>
          </a>
        </div>

        {/* Live Router Status Dashboard Preview Badge */}
        <div className="mt-16 border border-slate-900 rounded-2xl bg-slate-950 p-3 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 to-transparent pointer-events-none" />
          <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-900 text-left">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-slate-500 font-mono ml-2">mikroradius-v4-preview@ubuntu-24-04</span>
          </div>
          
          <div className="p-4 sm:p-8 bg-slate-900/40 grid grid-cols-2 sm:grid-cols-4 gap-4 text-right">
            <div className="p-4 bg-slate-950/80 border border-slate-900 rounded-xl">
              <span className="text-slate-500 text-xs block mb-1">حالة السيرفر الرئيسي</span>
              <span className="text-emerald-400 font-bold text-sm sm:text-base flex items-center gap-1.5 justify-end">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                متصل ومستقر
              </span>
            </div>
            <div className="p-4 bg-slate-950/80 border border-slate-900 rounded-xl">
              <span className="text-slate-500 text-xs block mb-1">سرعة المعالجة للريديوس</span>
              <span className="text-white font-mono font-bold text-sm sm:text-base">0.002s (ثانية)</span>
            </div>
            <div className="p-4 bg-slate-950/80 border border-slate-900 rounded-xl">
              <span className="text-slate-500 text-xs block mb-1">العملاء المتصلين الآن</span>
              <span className="text-sky-400 font-mono font-bold text-sm sm:text-base">12,450 عميل</span>
            </div>
            <div className="p-4 bg-slate-950/80 border border-slate-900 rounded-xl">
              <span className="text-slate-500 text-xs block mb-1">إجمالي الكروت المولدة اليوم</span>
              <span className="text-purple-400 font-mono font-bold text-sm sm:text-base">4,210 كارت</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-slate-900/20 border-t border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">لماذا تختار منصة MikroRADIUS لإدارة شبكتك؟</h2>
            <p className="mt-4 text-slate-400">نحن لا نقدم مجرد لوحة تحكم عادية، بل نقدم بيئة متكاملة لربط ريديوس على لينكس بأجهزة ميكروتك، تدعم أحدث معايير الأمان والتوزيع التجاري.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-900 hover:border-sky-500/30 transition-all group">
              <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl w-fit mb-6">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">أمان فائق للريديوس (AAA)</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                تطبيق كامل لمعايير المصادقة والترخيص والمحاسبة (Authentication, Authorization, Accounting) لحماية شبكتك من الاختراق وضمان عدم مشاركة الحسابات بدون إذن.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-900 hover:border-sky-500/30 transition-all group">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit mb-6">
                <Cpu size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">مولد الكروت الذكي (Voucher Generator)</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                ولّد آلاف الكروت لشبكات الهوتسبوت أو PPPoE بضغطة زر واحدة. تحكّم في سعة كرت الإنترنت، السرعة والتحميل، مع إمكانية تصديرها كملفات PDF جاهزة للطباعة فورياً.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-900 hover:border-sky-500/30 transition-all group">
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl w-fit mb-6">
                <Smartphone size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">ربط كامل مع تطبيق الهاتف</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                أتح لعملائك أو موزعين الكروت تطبيق أندرويد/آيفون خفيف وسريع، يمكنهم من خلاله فحص الرصيد، شحن الكروت عبر كود الـ QR، ومتابعة الاستهلاك فورياً من هاتفهم.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-900 hover:border-sky-500/30 transition-all group">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit mb-6">
                <Layers size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">توزيع سرعات ميكروتك بدقة</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                يتحكم ريديوس في سرعات العملاء برفع قيم Dynamic Queues إلى المايكروتك بمجرد تسجيل الدخول، مما يحافظ على استقرار البنج وسرعة التصفح لجميع المستخدمين.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-900 hover:border-sky-500/30 transition-all group">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit mb-6">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">إحصائيات وتحليلات فورية</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                لوحات تحليلية رائعة للمايكروتك تعرض حجم مرور البيانات اليومي والشهري، وجداول المشتركين الأكثر استهلاكاً للتحكم بتوزيع الباندويث المتاح.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-900 hover:border-sky-500/30 transition-all group">
              <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl w-fit mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">مزامنة الـ API الفورية</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                تقوم لوحة التحكم بالتخاطب مع راوتر الميكروتك عبر بروتوكولات مشفرة وآمنة لتحديث قائمة الجلسات النشطة وعزل الأجهزة غير المصرح لها بالولوج فوراً.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">خطط أسعار مرنة ومناسبة لجميع أحجام الشبكات</h2>
          <p className="mt-4 text-slate-400">اختر الباقة المناسبة لحجم أعمالك الآن، وقم بترقية اشتراكك في أي وقت بسهولة مع دعم فني متكامل.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`p-8 rounded-2xl bg-slate-950 border transition-all relative flex flex-col justify-between ${plan.color} ${plan.popular ? 'ring-2 ring-sky-500/50' : ''}`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-sky-500 text-slate-950 font-bold text-[10px] rounded-full tracking-wider uppercase">
                  الأكثر مبيعاً
                </span>
              )}
              
              <div>
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1.5 justify-start">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">${plan.price}</span>
                  <span className="text-slate-500 text-sm">/ شهرياً</span>
                </div>
                
                <div className="mt-6 py-3 border-t border-b border-slate-900 space-y-2 text-sm text-sky-400">
                  <div className="flex justify-between">
                    <span>عدد أجهزة المايكروتك:</span>
                    <span className="font-bold text-white">{plan.routers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>العملاء المتزامنين بالثانية:</span>
                    <span className="font-bold text-white">{plan.users}</span>
                  </div>
                </div>

                <ul className="mt-6 space-y-3.5 text-right">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-900">
                <button 
                  onClick={() => openLoginModal('isp')}
                  className={`w-full py-3 rounded-xl font-bold transition-all text-sm ${
                    plan.popular 
                      ? 'bg-sky-500 text-slate-950 hover:bg-sky-400 shadow-lg shadow-sky-500/20' 
                      : 'bg-slate-900 text-slate-200 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  اشترك بالباقة الآن التجريبية
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Guarantee Section */}
      <section className="py-16 bg-slate-900/40 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">رأي مهندسي وموزعي شبكات المايكروتك</h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              "بصفتي مهندس شبكات وموزع إنترنت محلي، كنت أعاني دائماً من توزيع كروت الواي فاي وفصل المشتركين المتجاوزين للاستهلاك. مع نظام ريديوس هذا المربوط بالمايكروتك، أصبحت أدير 8 راوترات موزعة في أحياء مختلفة من سيرفر أوبونتو واحد، ومع تطبيق الموبايل، يمكن لعمالي توليد الكروت وشحنها للمشتركين بضغطة زر."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sky-400">
                م.أ
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">م. أحمد العتيبي</h4>
                <p className="text-slate-500 text-xs">مدير شبكة الجزيرة للواي فاي</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-slate-950 border border-slate-900 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Server className="text-sky-400" size={20} />
              <span>جاهز لسيرفر Ubuntu 24 الخاص بك</span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              تشتمل لوحة التحكم الخاصة بنا على مولّد سكريبتات متكامل لأوبونتو يقوم بتنزيل وإعداد سيرفر FreeRADIUS وربطه بـ MySQL وتكوين جداول قاعدة البيانات وجدران الحماية لتجربة تشغيل فائقة السرعة والاستقرار.
            </p>
            <div className="p-4 rounded-xl bg-slate-900 font-mono text-xs text-sky-400 border border-slate-800 overflow-x-auto text-left whitespace-nowrap">
              # wget https://mikroradius-saas.com/ubuntu24-install.sh && chmod +x ubuntu24-install.sh
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Wifi size={20} className="text-sky-400" />
            <span className="text-white font-bold">MikroRADIUS SaaS</span>
            <span>&copy; {new Date().getFullYear()} جميع الحقوق محفوظة.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-slate-300">الشروط والأحكام</a>
            <a href="#pricing" className="hover:text-slate-300">سياسة الخصوصية</a>
            <a href="#ubuntu" className="hover:text-slate-300">الدعم الهندسي</a>
          </div>
        </div>
      </footer>

      {/* Modern Credentials Login and Edit Modal */}
      {loginModalType && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg">
                  {loginModalType === 'admin' ? <Shield size={20} /> : <Server size={20} />}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    {loginModalType === 'admin' ? 'بوابة المسؤول (SaaS SuperAdmin)' : 'بوابة المشتركين والشبكات (ISP Portal)'}
                  </h3>
                  <span className="text-[10px] text-slate-400 block mt-0.5">يرجى تسجيل الدخول للوصول للوحة التحكم</span>
                </div>
              </div>
              <button 
                onClick={() => setLoginModalType(null)}
                className="p-1.5 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              {!isEditingCredentials ? (
                /* LOGIN FORM VIEW */
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {loginError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold leading-relaxed">
                      {loginError}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">اسم المستخدم</label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input 
                        type="text"
                        required
                        placeholder="أدخل اسم المستخدم..."
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">كلمة المرور</label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="أدخل كلمة المرور..."
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg shadow-sky-500/10 flex items-center justify-center gap-2 mt-2"
                  >
                    <span>تسجيل الدخول</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              ) : (
                /* CHANGE CREDENTIALS VIEW */
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-xs font-semibold leading-relaxed">
                    تنبيه: أنت تقوم بتعديل بيانات الدخول الخاصة بهذه اللوحة. سيتم حفظ البيانات الجديدة محلياً في المتصفح.
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">اسم المستخدم الجديد</label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input 
                        type="text"
                        required
                        value={editUser}
                        onChange={(e) => setEditUser(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-sm text-slate-100 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">كلمة المرور الجديدة</label>
                    <div className="relative">
                      <Key className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input 
                        type="text"
                        required
                        value={editPass}
                        onChange={(e) => setEditPass(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-sm text-slate-100 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSaveCredentials}
                      className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <Save size={14} />
                      <span>حفظ كلمة المرور الجديدة</span>
                    </button>
                    <button
                      onClick={() => setIsEditingCredentials(false)}
                      className="px-4 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
