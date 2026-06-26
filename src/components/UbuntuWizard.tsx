import React, { useState } from 'react';
import { Terminal, Copy, Check, Server, Shield, Database, Cpu, HelpCircle, Code } from 'lucide-react';

export default function UbuntuWizard() {
  const [copied, setCopied] = useState<string | null>(null);
  const [dbPass, setDbPass] = useState('RadPass1234!');
  const [radiusSecret, setRadiusSecret] = useState('MySuperRadiusSecret999');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const fullInstallScript = `#!/bin/bash
# -----------------------------------------------------------------------------
# سكريبت الإعداد التلقائي لسيرفر FreeRADIUS + MySQL على Ubuntu 24.04 LTS
# -----------------------------------------------------------------------------

# تحديث حزم النظام الأساسية
echo "[*] تحديث مستودعات حزم أوبونتو..."
sudo apt update && sudo apt upgrade -y

# تثبيت خادم قواعد البيانات وقارئ الريديوس وموديول الـ SQL
echo "[*] تثبيت MySQL Server و FreeRADIUS..."
sudo apt install mysql-server freeradius freeradius-mysql freeradius-utils -y

# تأمين قاعدة البيانات وتهيئة الجداول للريديوس
echo "[*] إنشاء قاعدة بيانات الريديوس والمستخدم..."
sudo mysql -e "CREATE DATABASE radius;"
sudo mysql -e "CREATE USER 'radius'@'localhost' IDENTIFIED BY '${dbPass}';"
sudo mysql -e "GRANT ALL PRIVILEGES ON radius.* TO 'radius'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# استيراد مخطط جداول FreeRADIUS الافتراضية
echo "[*] استيراد مخطط قاعدة البيانات الافتراضي للريديوس..."
sudo mysql radius < /etc/freeradius/3.0/mods-config/sql/main/mysql/schema.sql

# تفعيل موديول SQL في FreeRADIUS
echo "[*] تفعيل موديول SQL والمصادقة الآمنة..."
sudo ln -sf /etc/freeradius/3.0/mods-available/sql /etc/freeradius/3.0/mods-enabled/

# تعديل موديول SQL لربطه بكلمة مرور قاعدة البيانات
sudo sed -i 's/password = "radpass"/password = "${dbPass}"/g' /etc/freeradius/3.0/mods-available/sql

# ضبط إعدادات الـ Default site لدعم استعلامات الـ SQL
sudo sed -i 's/-sql/sql/g' /etc/freeradius/3.0/sites-available/default
sudo sed -i 's/-sql/sql/g' /etc/freeradius/3.0/sites-available/inner-tunnel

# إضافة راوتر مايكروتك كـ Client مصرح له بالدخول للريديوس
echo "[*] إعداد راوتر مايكروتك الافتراضي في clients.conf..."
sudo cat <<EOT >> /etc/freeradius/3.0/clients.conf
client mikrotik_routers {
    ipaddr = 0.0.0.0/0
    secret = ${radiusSecret}
    nas_type = other
}
EOT

# إعادة تشغيل خادم الريديوس وتفعيله مع إقلاع النظام
echo "[*] تشغيل خادم الريديوس وتفعيله مع الإقلاع..."
sudo systemctl restart mysql
sudo systemctl restart freeradius
sudo systemctl enable freeradius

echo "[+] تم التثبيت والإعداد بنجاح! سيرفر الريديوس يستمع الآن على بورت 1812 (Auth) و 1813 (Acct)"
`;

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Title Block */}
        <div className="bg-slate-900 border border-slate-900 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl">
              <Server size={28} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">دليل إعداد سيرفر FreeRADIUS على Ubuntu 24.04 LTS</h1>
              <p className="text-xs text-slate-400 mt-1">تثبيت وتكوين السيرفر الخاص بك لاستقبال طلبات الاتصال من أجهزة المايكروتك بنقرة واحدة</p>
            </div>
          </div>
        </div>

        {/* Configuration variables inputs */}
        <div className="bg-slate-900 border border-slate-900 p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-bold">كلمة مرور قاعدة بيانات ريديوس (MySQL)</label>
            <input 
              type="text" 
              value={dbPass}
              onChange={(e) => setDbPass(e.target.value)}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-sky-400 font-mono focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-bold">مفتاح الريديوس السري المشترك (Shared Secret)</label>
            <input 
              type="text" 
              value={radiusSecret}
              onChange={(e) => setRadiusSecret(e.target.value)}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-sky-400 font-mono focus:outline-none"
            />
          </div>
        </div>

        {/* Dynamic Ubuntu Installer Codeblock */}
        <div className="bg-slate-900 border border-slate-900 rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-900/80 border-b border-slate-850 flex justify-between items-center">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Code size={14} className="text-sky-400" />
              <span>سكريبت التثبيت التلقائي (Ubuntu 24.04 Installer script)</span>
            </span>
            <button 
              onClick={() => copyToClipboard(fullInstallScript, 'script')}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-sky-400 hover:text-sky-300 rounded text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              {copied === 'script' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copied === 'script' ? 'تم النسخ!' : 'نسخ الكود'}</span>
            </button>
          </div>
          <div className="bg-slate-950 p-4 font-mono text-xs text-sky-300 overflow-x-auto text-left max-h-96" dir="ltr">
            <pre>{fullInstallScript}</pre>
          </div>
        </div>

        {/* Step-by-Step Explanation for the Network Engineer */}
        <div className="bg-slate-900 border border-slate-900 p-6 rounded-2xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Shield size={18} className="text-sky-400" />
            <span>خطوات الربط داخل نظام المايكروتك (MikroTik RouterOS Config)</span>
          </h2>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-950 text-sky-400 font-bold flex items-center justify-center shrink-0 border border-slate-850">1</span>
              <div>
                <h4 className="font-bold text-white mb-1">تكوين بروتوكول RADIUS في المايكروتك</h4>
                <p className="text-slate-400 leading-relaxed mb-2">من خلال Winbox، اذهب إلى قائمة RADIUS واضغط على إضافة (+)، ثم قم بتعبئة البيانات كالتالي:</p>
                <ul className="list-disc pr-5 text-slate-500 space-y-1 font-mono text-xs">
                  <li>Service: Check [hotspot, ppp]</li>
                  <li>RADIUS Server Address: <span className="text-sky-400">IP الخاص بسيرفر الأوبونتو</span></li>
                  <li>Secret: <span className="text-sky-400">{radiusSecret}</span></li>
                  <li>Authentication Port: 1812</li>
                  <li>Accounting Port: 1813</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-950 text-sky-400 font-bold flex items-center justify-center shrink-0 border border-slate-850">2</span>
              <div>
                <h4 className="font-bold text-white mb-1">تفعيل ريديوس في إعدادات الهوتسبوت (Hotspot)</h4>
                <p className="text-slate-400 leading-relaxed">اذهب إلى <span className="font-mono text-white">IP &rarr; Hotspot &rarr; Server Profiles</span>، افتح ملف البروفايل الخاص بشبكتك، ثم توجه إلى تبويب <span className="font-mono text-white">RADIUS</span> وقم بتفعيل خيار <span className="text-emerald-400 font-bold">[Use RADIUS]</span>.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-950 text-sky-400 font-bold flex items-center justify-center shrink-0 border border-slate-850">3</span>
              <div>
                <h4 className="font-bold text-white mb-1">تفعيل ريديوس للاتصال المنزلي (PPPoE)</h4>
                <p className="text-slate-400 leading-relaxed">اذهب إلى <span className="font-mono text-white">PPP &rarr; Secrets &rarr; PPPoE Authentication Profiles</span>، واجعل المايكروتك يوجه طلبات الاتصال المنزلي لسيرفر الريديوس مباشرة لمطابقة بيانات المستخدمين وتطبيق السرعات تلقائياً.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
