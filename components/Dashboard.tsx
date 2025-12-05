
import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie, Legend, ComposedChart, Line
} from 'recharts';
import { DollarSign, FileText, Activity, Users, Sparkles, TrendingUp, Bell, AlertTriangle, Clock, Calendar, ArrowRight, BrainCircuit } from 'lucide-react';
import { getContracts, getInvoices, getBillboards, getClients, getExpiringContracts, getOverdueInvoices, getUpcomingBillings, getFinancialTrends } from '../services/mockData';
import { BillboardType } from '../types';
import { analyzeBusinessData } from '../services/aiService';

export const Dashboard: React.FC = () => {
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Live Data
  const contracts = getContracts();
  const invoices = getInvoices();
  const billboards = getBillboards();
  const clients = getClients();

  // Notification Data
  const expiringContracts = getExpiringContracts();
  const overdueInvoices = getOverdueInvoices();
  const upcomingBillings = getUpcomingBillings().slice(0, 3);
  const financialTrends = getFinancialTrends();

  const totalRevenue = invoices.filter(i => i.type === 'Invoice').reduce((acc, curr) => acc + curr.total, 0);
  const activeContracts = contracts.filter(c => c.status === 'Active').length;
  
  const ledBillboards = billboards.filter(b => b.type === BillboardType.LED);
  const totalLedSlots = ledBillboards.reduce((acc, b) => acc + (b.totalSlots || 0), 0);
  const rentedLedSlots = ledBillboards.reduce((acc, b) => acc + (b.rentedSlots || 0), 0);
  
  const staticBillboards = billboards.filter(b => b.type === BillboardType.Static);
  const totalStaticSides = staticBillboards.length * 2;
  const rentedStaticSides = staticBillboards.reduce((acc, b) => {
    let count = 0;
    if (b.sideAStatus === 'Rented') count++;
    if (b.sideBStatus === 'Rented') count++;
    return acc + count;
  }, 0);

  const occupancyRate = Math.round(((rentedLedSlots + rentedStaticSides) / (totalLedSlots + totalStaticSides)) * 100) || 0;

  const occupancyData = [
    { name: 'Occupied', value: rentedLedSlots + rentedStaticSides },
    { name: 'Available', value: (totalLedSlots + totalStaticSides) - (rentedLedSlots + rentedStaticSides) },
  ];
  const OCCUPANCY_COLORS = ['#6366f1', '#f1f5f9'];

  const topClientsData = clients.map(client => {
      const clientRevenue = invoices
        .filter(i => i.clientId === client.id && i.type === 'Invoice')
        .reduce((acc, curr) => acc + curr.total, 0);
      return { name: client.companyName, value: clientRevenue };
  }).sort((a, b) => b.value - a.value).slice(0, 5);

  const revenueByTownData = billboards.reduce((acc: any[], curr) => {
      const billboardContracts = contracts.filter(c => c.billboardId === curr.id && c.status === 'Active');
      const revenue = billboardContracts.reduce((sum, c) => sum + c.totalContractValue, 0);
      const existing = acc.find(item => item.name === curr.town);
      if (existing) { existing.value += revenue; } else { acc.push({ name: curr.town, value: revenue }); }
      return acc;
  }, []).sort((a: any, b: any) => b.value - a.value).slice(0, 5);

  const handleAskAI = async (e?: React.FormEvent) => {
      if(e) e.preventDefault();
      if(!aiQuery) return;
      setLoadingAi(true);
      const context = `Revenue: $${totalRevenue}. Occupancy: ${occupancyRate}%. Active Contracts: ${activeContracts}. Expiring (30d): ${expiringContracts.length}. Overdue: ${overdueInvoices.length}. Top Client: ${topClientsData[0]?.name}. User Q: ${aiQuery}`;
      const result = await analyzeBusinessData(context);
      setAiResponse(result);
      setLoadingAi(false);
  };

  const getClientName = (id: string) => clients.find(c => c.id === id)?.companyName || 'Unknown';

  return (
    <div className="space-y-8 animate-fade-in pb-12 flex flex-col xl:flex-row gap-8">
      {/* Main Content Area */}
      <div className="flex-1 space-y-8 min-w-0">
        
        {/* AI Analyst Section - Premium Dark Gradient */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-indigo-500/30 transition-all duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 shadow-inner"><BrainCircuit size={24} className="text-indigo-300"/></div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Spiritus AI Analyst</h2>
                        <p className="text-indigo-200/80 text-sm">Real-time intelligence for your fleet</p>
                    </div>
                </div>
                
                <form onSubmit={handleAskAI} className="relative max-w-2xl mb-6">
                    <input 
                        type="text" 
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        placeholder="Ask about revenue trends, occupancy, or strategy..." 
                        className="w-full pl-6 pr-14 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-indigo-200/30 backdrop-blur-md focus:outline-none focus:bg-white/10 focus:border-indigo-400/50 transition-all shadow-lg shadow-black/10"
                    />
                    <button type="submit" disabled={loadingAi} className="absolute right-2 top-2 p-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-95">
                        {loadingAi ? <Sparkles size={20} className="animate-spin"/> : <ArrowRight size={20} />}
                    </button>
                </form>

                {aiResponse && (
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md animate-fade-in shadow-inner">
                        <div className="flex items-start gap-3">
                            <Sparkles size={18} className="text-amber-300 mt-1 shrink-0 animate-pulse"/>
                            <p className="text-sm leading-relaxed text-indigo-50 font-medium">{aiResponse}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* KPI Cards - Glassmorphism & Hover Effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass bg-white/60 p-6 rounded-3xl shadow-sm border border-white/60 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl shadow-sm group-hover:shadow-md transition-all">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100/50 text-emerald-700 rounded-full flex items-center gap-1 border border-emerald-100">
                <TrendingUp size={12}/> +12%
              </span>
            </div>
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Total Revenue</p>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">${totalRevenue.toLocaleString()}</h3>
            </div>
          </div>

          <div className="glass bg-white/60 p-6 rounded-3xl shadow-sm border border-white/60 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-sm group-hover:shadow-md transition-all">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-blue-100/50 text-blue-700 rounded-full border border-blue-100">Active</span>
            </div>
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Contracts</p>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">{activeContracts}</h3>
            </div>
          </div>

          <div className="glass bg-white/60 p-6 rounded-3xl shadow-sm border border-white/60 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl shadow-sm group-hover:shadow-md transition-all">
                <Activity className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-amber-100/50 text-amber-700 rounded-full border border-amber-100">
                {rentedLedSlots + rentedStaticSides} / {totalLedSlots + totalStaticSides}
              </span>
            </div>
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Occupancy</p>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">{occupancyRate}%</h3>
            </div>
          </div>

          <div className="glass bg-white/60 p-6 rounded-3xl shadow-sm border border-white/60 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-sm group-hover:shadow-md transition-all">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-purple-100/50 text-purple-700 rounded-full flex items-center gap-1 border border-purple-100">
                <TrendingUp size={12}/> +2
              </span>
            </div>
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Total Clients</p>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">{clients.length}</h3>
            </div>
          </div>
        </div>

        {/* Main Charts Row */}
        <div className="glass bg-white/80 p-8 rounded-3xl shadow-sm border border-white/50 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Financial Performance</h3>
                    <p className="text-sm text-slate-500 font-medium">Revenue vs Expenses (Actuals + Forecast)</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold bg-slate-100/50 p-1.5 rounded-xl border border-slate-200/50">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm text-slate-700"><span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span> Revenue</div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Margin</div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> Exp.</div>
                </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={financialTrends}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1e293b" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#1e293b" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                    itemStyle={{ fontSize: '13px', fontWeight: 600, padding: '2px 0' }}
                    cursor={{fill: '#f8fafc', radius: 4}}
                  />
                  <Bar dataKey="revenue" barSize={28} fill="url(#revenueGradient)" radius={[6, 6, 0, 0]} name="Revenue" />
                  <Bar dataKey="expenses" barSize={28} fill="#e2e8f0" radius={[6, 6, 0, 0]} name="Expenses" />
                  <Line type="monotone" dataKey="margin" stroke="#6366f1" strokeWidth={3} dot={{r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff'}} name="Net Margin" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
        </div>
        
        {/* Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Revenue by Town */}
             <div className="glass bg-white/80 p-8 rounded-3xl shadow-sm border border-white/50 backdrop-blur-xl">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Top Locations</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueByTownData} layout="vertical" margin={{ left: 0, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12, fontWeight: 600}} width={100} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}/>
                            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
                                {revenueByTownData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'][index % 5]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
             </div>

             {/* Occupancy Donut */}
             <div className="glass bg-white/80 p-8 rounded-3xl shadow-sm border border-white/50 backdrop-blur-xl relative overflow-hidden">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Fleet Occupancy</h3>
                <div className="h-64 relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                        data={occupancyData}
                        cx="50%"
                        cy="50%"
                        innerRadius={85}
                        outerRadius={105}
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={8}
                        >
                        {occupancyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={OCCUPANCY_COLORS[index % OCCUPANCY_COLORS.length]} />
                        ))}
                        </Pie>
                    </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-4">
                        <span className="text-5xl font-black text-slate-900 tracking-tighter">{occupancyRate}%</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Occupied</span>
                    </div>
                </div>
             </div>
        </div>
      </div>

      {/* Sidebar Notifications - Refined */}
      <div className="w-full xl:w-96 space-y-6 min-w-0">
          <div className="glass bg-white/80 p-6 rounded-3xl shadow-sm border border-white/50 backdrop-blur-xl">
             <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold uppercase tracking-wide text-xs">
                 <Bell size={16} className="text-indigo-500" /> Action Required
             </div>
             
             <div className="space-y-4">
                 {/* Upcoming Collections */}
                 {upcomingBillings.length > 0 && (
                     <div className="mb-6 pb-6 border-b border-slate-200/50">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar size={14} className="text-indigo-500" />
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Upcoming Collections</h4>
                        </div>
                        <div className="space-y-3">
                            {upcomingBillings.map((bill, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-slate-800 truncate">{bill.clientName}</p>
                                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">Due: {bill.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">${bill.amount.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>
                 )}

                 {/* Alerts List */}
                 {expiringContracts.length === 0 && overdueInvoices.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600"><Sparkles size={20}/></div>
                        <p className="text-sm font-medium text-slate-500">All caught up!</p>
                        <p className="text-xs text-slate-400">No pending alerts at the moment.</p>
                    </div>
                 ) : (
                    <>
                        {expiringContracts.map(c => (
                            <div key={c.id} className="p-4 bg-gradient-to-r from-amber-50 to-white rounded-2xl border border-amber-100 shadow-sm flex items-start gap-3">
                                <div className="p-2 bg-white rounded-xl text-amber-500 shadow-sm border border-amber-50 shrink-0">
                                    <Clock size={16} />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-0.5">Expiring Contract</h4>
                                    <p className="text-sm font-bold text-slate-800 truncate">{getClientName(c.clientId)}</p>
                                    <p className="text-xs text-slate-500 mt-1">Ends {c.endDate}</p>
                                </div>
                            </div>
                        ))}
                        {overdueInvoices.slice(0, 3).map(inv => (
                            <div key={inv.id} className="p-4 bg-gradient-to-r from-red-50 to-white rounded-2xl border border-red-100 shadow-sm flex items-start gap-3">
                                <div className="p-2 bg-white rounded-xl text-red-500 shadow-sm border border-red-50 shrink-0">
                                    <AlertTriangle size={16} />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-xs font-bold text-red-700 uppercase tracking-wide mb-0.5">Overdue Payment</h4>
                                    <p className="text-sm font-bold text-slate-800 truncate">{getClientName(inv.clientId)}</p>
                                    <p className="text-xs text-slate-500 mt-1">${inv.total.toLocaleString()} • #{inv.id}</p>
                                </div>
                            </div>
                        ))}
                    </>
                 )}
             </div>
          </div>

          <div className="glass bg-white/80 p-6 rounded-3xl shadow-sm border border-white/50 backdrop-blur-xl">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Revenue Sources</h3>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topClientsData} layout="vertical" margin={{ left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={90} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="value" fill="#1e293b" radius={[0, 6, 6, 0]} barSize={16}>
                        {topClientsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1'][index % 5]} />
                        ))}
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
      </div>
    </div>
  );
};
