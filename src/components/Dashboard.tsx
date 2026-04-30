import React, { useMemo, useEffect } from 'react';
import { Customer, Activity, Schedule } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Calendar as CalendarIcon,
  MessageSquare,
  Bell,
  Cake,
  Send,
  Building2,
  Briefcase,
  Target,
  Trophy
} from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { subDays, isBefore } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { toast } from 'sonner';
import { BUSINESS_INDUSTRIES } from '../constants';

interface DashboardProps {
  customers: Customer[];
  activities: Activity[];
  schedules: Schedule[];
}

export const Dashboard: React.FC<DashboardProps> = ({ customers, activities, schedules }) => {
  const stats = useMemo(() => {
    const totalRevenue = customers
      .filter(c => c.status === 'Deal')
      .reduce((sum, c) => sum + (c.revenue || 0), 0);

    const potentialRevenue = customers
      .filter(c => c.status === 'Negosiasi')
      .reduce((sum, c) => sum + (c.revenue || 0), 0);

    const dealCount = customers.filter(c => c.status === 'Deal').length;
    const negoCount = customers.filter(c => c.status === 'Negosiasi').length;
    const rejectCount = customers.filter(c => c.status === 'Menolak').length;

    // Birthday Checking
    const today = new Date();
    const todayMonthDay = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const birthdaysToday = customers.flatMap(c => {
      const picsWithBirthdayToday = [];
      if (c.pic1.birthday && c.pic1.birthday.slice(5) === todayMonthDay) {
        picsWithBirthdayToday.push({ customer: c, pic: c.pic1 });
      }
      if (c.pic2.birthday && c.pic2.birthday.slice(5) === todayMonthDay) {
        picsWithBirthdayToday.push({ customer: c, pic: c.pic2 });
      }
      return picsWithBirthdayToday;
    });

    // Auto Insights
    const fourteenDaysAgo = subDays(new Date(), 14);

    const noActivity14 = customers.filter(c => {
      if (!c.lastActivityDate) return true;
      return isBefore(c.lastActivityDate.toDate(), fourteenDaysAgo);
    });

    const stagnantNego = customers.filter(c => 
      c.status === 'Negosiasi' && isBefore(c.updatedAt.toDate(), fourteenDaysAgo)
    );

    const highRSNoDeal = customers.filter(c => 
      c.status === 'Negosiasi' && (c.relationshipScore || 0) > 150
    );

    const rsLevelsCount = {
      Loyal: customers.filter(c => c.rsLevel === 'Loyal').length,
      Trusted: customers.filter(c => c.rsLevel === 'Trusted').length,
      Engaged: customers.filter(c => c.rsLevel === 'Engaged').length,
      Warm: customers.filter(c => c.rsLevel === 'Warm').length,
      Cold: customers.filter(c => c.rsLevel === 'Cold').length,
    };

    const topLoyalists = [...customers]
      .sort((a, b) => (b.relationshipScore || 0) - (a.relationshipScore || 0))
      .slice(0, 5);

    const industryData = BUSINESS_INDUSTRIES.map(ind => ({
      name: ind,
      count: customers.filter(c => c.industry === ind).length,
      revenue: customers.filter(c => c.industry === ind).reduce((sum, c) => sum + (c.revenue || 0), 0)
    })).filter(d => d.count > 0).sort((a, b) => b.revenue - a.revenue);

    return { 
      totalRevenue, potentialRevenue, dealCount, negoCount, rejectCount, 
      noActivity14, stagnantNego, highRSNoDeal,
      birthdaysToday, industryData, rsLevelsCount, topLoyalists
    };
  }, [customers]);

  useEffect(() => {
    if (stats.birthdaysToday.length > 0) {
      stats.birthdaysToday.forEach(b => {
        toast.info(`Birthday Reminder: ${b.pic.name} (${b.customer.companyName})`, {
          description: "It's time to send a birthday wish!",
          duration: 10000,
        });
      });
    }
  }, [stats.birthdaysToday]);

  const handleSendWish = (b: any) => {
    const template = b.customer.birthdayTemplate || 'Hi {name}, Selamat ulang tahun! Semoga sukses selalu bersama {company}.';
    const message = template
      .replace('{name}', b.pic.name)
      .replace('{company}', b.customer.companyName);
    
    const whatsappUrl = `https://wa.me/${b.pic.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const chartData = [
    { name: 'Deal', value: stats.dealCount, color: '#10b981' },
    { name: 'Negosiasi', value: stats.negoCount, color: '#f59e0b' },
    { name: 'Menolak', value: stats.rejectCount, color: '#f43f5e' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Birthday Section (Priority) */}
      {stats.birthdaysToday.length > 0 && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 rotate-12">
            <Cake size={160} />
          </div>
          <div className="flex items-center gap-3 mb-4">
             <div className="bg-white/20 p-2 rounded-lg">
                <Bell className="text-white animate-bounce" size={20} />
             </div>
             <div>
               <h2 className="text-lg font-black tracking-tight">Hari Ini Ada PIC Yang Berulang Tahun!</h2>
               <p className="text-blue-100 text-xs font-medium">Jangan lewatkan kesempatan untuk membangun relasi lebih kuat.</p>
             </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
            {stats.birthdaysToday.map((b, i) => (
              <Card key={i} className="bg-white/10 border-white/20 backdrop-blur-md text-white border-none shadow-none">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black truncate">{b.pic.name}</p>
                    <p className="text-[10px] text-blue-200 font-bold uppercase truncate">{b.customer.companyName}</p>
                  </div>
                  <button 
                    onClick={() => handleSendWish(b)}
                    className="shrink-0 bg-white text-blue-700 p-2 rounded-full hover:bg-blue-50 transition-colors shadow-lg"
                  >
                    <Send size={14} />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Customers" 
          value={customers.length.toString()} 
          description="Total portfolio size"
          icon={<Users size={14} />}
        />
        <StatCard 
          title="Loyal Customers" 
          value={stats.rsLevelsCount.Loyal.toString()} 
          description="RS Level > 250"
          icon={<Trophy className="text-purple-500" size={14} />}
          accent="purple"
        />
        <StatCard 
          title="Potential Revenue" 
          value={formatCurrency(stats.potentialRevenue)} 
          description="Pipeline Prospek"
          icon={<Target className="text-orange-500" size={14} />}
          accent="orange"
        />
        <StatCard 
          title="Needs Attention" 
          value={(stats.noActivity14.length + stats.stagnantNego.length).toString().padStart(2, '0')} 
          description="Risk of churn/loss"
          accent="red"
          status="Action"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Relationship Score */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden rounded-xl">
           <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy size={14} className="text-amber-500" />
              <h3 className="text-[11px] font-bold uppercase text-slate-600 tracking-tighter">Top RS (Relationship Score)</h3>
            </div>
          </div>
          <CardContent className="p-4 space-y-4">
             {stats.topLoyalists.length > 0 ? stats.topLoyalists.map((c, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800 line-clamp-1">{c.companyName}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">{c.rsLevel}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-900">{c.relationshipScore}</p>
                    <div className="w-16 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                       <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, (c.relationshipScore / 300) * 100)}%` }}></div>
                    </div>
                  </div>
                </div>
             )) : (
                <p className="text-[10px] text-slate-400 font-bold uppercase py-10 text-center">No scores yet</p>
             )}
          </CardContent>
        </Card>

        {/* Pipeline Distribution Chart */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden rounded-xl">
           <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 size={14} className="text-blue-600" />
              <h3 className="text-[11px] font-bold uppercase text-slate-600 tracking-tighter">Market Segmentation</h3>
            </div>
          </div>
          <CardContent className="p-5 space-y-4 max-h-[300px] overflow-y-auto">
            {stats.industryData.length > 0 ? stats.industryData.map((item, i) => (
              <div key={i} className="group">
                <div className="flex justify-between items-end mb-1">
                  <div>
                    <p className="text-xs font-black text-slate-800 flex items-center gap-2">
                       {item.name}
                    </p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{item.count} Customers</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-900">{formatCurrency(item.revenue)}</p>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 group-hover:bg-blue-700 transition-all duration-500" 
                    style={{ width: `${(item.revenue / (stats.totalRevenue + stats.potentialRevenue || 1)) * 100}%` }}
                  />
                </div>
              </div>
            )) : (
              <div className="h-40 flex flex-col items-center justify-center text-center">
                <Building2 size={32} className="text-slate-100 mb-2" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No industry data</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Chart */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm bg-white overflow-hidden rounded-xl">
           <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-[11px] font-bold uppercase text-slate-600 tracking-tighter">Pipeline Revenue Value</h3>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Won</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Pipeline</span>
               </div>
            </div>
          </div>
          <CardContent className="h-[250px] pt-6">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Won (Deal)', value: stats.totalRevenue, fill: '#10b981' },
                { name: 'Pipeline (Negosiasi)', value: stats.potentialRevenue, fill: '#f59e0b' }
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 600}} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  formatter={(value: any) => formatCurrency(value)}
                  contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60}>
                  <Cell fill="#10b981" />
                  <Cell fill="#f59e0b" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Third Section: Insights & Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Auto Insights / Notifications */}
        <div className="flex flex-col gap-6">
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-red-100 rounded text-red-600 flex items-center justify-center">
                <AlertCircle size={14} />
              </div>
              <h3 className="text-[11px] font-bold uppercase text-slate-700 tracking-tighter">RS Intelligence & Alerts</h3>
            </div>
            <div className="space-y-3">
              {stats.noActivity14.length > 0 && (
                <div className="flex gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="w-1 h-auto bg-red-400 rounded-full shrink-0"></div>
                  <div>
                    <p className="text-xs font-bold text-red-900">Inactivity Detection</p>
                    <p className="text-[10px] text-red-700 mt-0.5 leading-relaxed"><b>{stats.noActivity14.length} Customers</b> not contacted in 14 days.</p>
                  </div>
                </div>
              )}
              {stats.highRSNoDeal.length > 0 && (
                <div className="flex gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                   <div className="w-1 h-auto bg-indigo-400 rounded-full shrink-0"></div>
                   <div>
                     <p className="text-xs font-bold text-indigo-900">Closing Opportunity</p>
                     <p className="text-[10px] text-indigo-700 mt-0.5 leading-relaxed"><b>{stats.highRSNoDeal.length} Customers</b> have high RS score but haven't closed a deal yet.</p>
                   </div>
                </div>
              )}
              {stats.stagnantNego.length > 0 && (
                <div className="flex gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="w-1 h-auto bg-orange-400 rounded-full shrink-0"></div>
                  <div>
                    <p className="text-xs font-bold text-orange-900">Stagnant Negotiations</p>
                    <p className="text-[10px] text-orange-700 mt-0.5 leading-relaxed"><b>{stats.stagnantNego.length} Deals</b> stuck in negotiation for 14+ days.</p>
                  </div>
                </div>
              )}
              <div className="flex gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="w-1 h-auto bg-emerald-400 rounded-full shrink-0"></div>
                <div>
                  <p className="text-xs font-bold text-emerald-900">Smart Tip</p>
                  <p className="text-[10px] text-emerald-700 mt-0.5 leading-relaxed">Sending a regular 'Gift' (+25 pts) is the fastest way to become a 'Trusted' partner.</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-[#0F172A] text-white rounded-xl p-5 border-none shadow-xl">
            <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-4">Next Scheduled Visits</h3>
            <div className="space-y-4">
              {schedules.filter(s => s.status === 'pending').slice(0, 2).map(schedule => (
                <div key={schedule.id} className="flex items-center gap-3">
                  <div className="text-center bg-white/10 px-2 py-1.5 rounded min-w-[40px]">
                    <p className="text-[8px] uppercase text-slate-400 font-bold">{schedule.date.toDate().toLocaleDateString('default', { month: 'short' })}</p>
                    <p className="text-sm font-black">{schedule.date.toDate().getDate()}</p>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold truncate leading-tight">{schedule.notes || 'Site Survey'}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 truncate uppercase font-medium tracking-tighter">09:30 AM • HQ Office</p>
                  </div>
                </div>
              ))}
              {schedules.filter(s => s.status === 'pending').length === 0 && (
                <p className="text-[10px] text-slate-500 italic">No upcoming visits scheduled.</p>
              )}
            </div>
            <button className="w-full mt-5 py-2 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-300 hover:bg-slate-800 transition-colors uppercase tracking-widest">
              View Calendar
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, description, icon, trend, accent, status, progress }: { 
  title: string, 
  value: string, 
  description: string, 
  icon?: React.ReactNode, 
  trend?: 'up' | 'down',
  accent?: string,
  status?: string,
  progress?: number
}) => (
  <Card className={cn(
    "border-slate-200 shadow-sm bg-white overflow-hidden rounded-xl",
    accent === 'orange' && "border-l-4 border-l-orange-400"
  )}>
    <CardContent className="p-4">
      <div className="flex justify-between items-center mb-2">
        <p className={cn(
          "text-[10px] uppercase font-bold tracking-wider",
          accent === 'orange' ? "text-orange-600" : "text-slate-400"
        )}>{title}</p>
        {status && <span className="text-[9px] font-black uppercase text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">{status}</span>}
        {trend && (
           <div className={cn("flex items-center text-[10px] font-bold", trend === 'up' ? "text-emerald-500" : "text-rose-500")}>
             {trend === 'up' ? '↑' : '↓'}
           </div>
        )}
      </div>
      <p className="text-2xl font-black text-slate-800 tracking-tight">{value}</p>
      <div className="flex items-center gap-2 mt-1">
        {icon && <span className="text-slate-300">{icon}</span>}
        <p className="text-[10px] text-slate-500 font-medium">{description}</p>
      </div>
      {progress !== undefined && (
        <div className="w-full bg-slate-100 h-1 rounded-full mt-3 overflow-hidden">
          <div className="bg-blue-500 h-1 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </CardContent>
  </Card>
);
