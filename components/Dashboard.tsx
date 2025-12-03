
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';
import { DollarSign, FileText, Activity, Users, Sparkles, TrendingUp, TrendingDown, Bell, AlertTriangle, Clock, Calendar } from 'lucide-react';
import { getContracts, getInvoices, getBillboards, getClients, getExpiringContracts, getOverdueInvoices, getUpcomingBillings } from '../services/mockData';
import { BillboardType } from '../types';
import { analyzeBusinessData } from '../services/aiService';

export const Dashboard: React.FC = () => {
  const [aiInsight, setAiInsight] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  // Live Data
  const contracts = getContracts();
  const invoices = getInvoices();
  const billboards = getBillboards();
  const clients = getClients();

  // Notification Data
  const expiringContracts = getExpiringContracts();
  const overdueInvoices = getOverdueInvoices();
  // Get only first 3 upcoming
  const upcomingBillings = getUpcomingBillings().slice(0, 3);

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

  // Revenue Trend Data (Mocked for now, but structure ready for real data)
  const revenueData = [
    { name: 'Aug', revenue: 12000, expenses: 4000 },
    { name: 'Sep', revenue: 15500, expenses: 5000 },
    { name: 'Oct', revenue: 18000, expenses: 6000 },
    { name: 'Nov', revenue: 22000, expenses: 7500 },
    { name: 'Dec', revenue: 19500, expenses: 8000 },
    { name: 'Jan', revenue: 24000, expenses: 9000 },
  ];

  // Occupancy Data
  const occupancyData = [
    { name: 'LED Available', value: totalLedSlots - rentedLedSlots },
    { name: 'LED Rented', value: rentedLedSlots },
    { name: 'Static Available', value: totalStaticSides - rentedStaticSides },
    { name: 'Static Rented', value: rentedStaticSides },
  ];

  // Top Clients Data
  const topClientsData = clients.map(client => {
      const clientRevenue = invoices
        .filter(i => i.clientId === client.id && i.type === 'Invoice')
        .reduce((acc, curr) => acc + curr.total, 0);
      return { name: client.companyName, value: clientRevenue };
  }).sort((a, b) => b.value - a.value).slice(0, 5);

  // Revenue by Town
  const revenueByTownData = billboards.reduce((acc: any[], curr) => {
      // Find active contracts for this billboard
      const billboardContracts = contracts.filter(c => c.billboardId === curr.id && c.status === 'Active');
      const revenue = billboardContracts.reduce((sum, c) => sum + c.totalContractValue, 0);
      
      const existing = acc.find(item => item.name === curr.town);
      if (existing) {
          existing.value += revenue;
      } else {
          acc.push({ name: curr.town, value: revenue });
      }
      return acc;
  }, []).sort((a: any, b: any) => b.value - a.value).slice(0, 5);

  const COLORS = ['#e2e8f0', '#6366f1', '#f1f5f9', '#0f172a']; 
  const BAR_COLORS = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8'];

  const handleAskAI = async () => {
      setLoadingAi(true);
      const context = `Total Revenue: $${totalRevenue}, Occupancy Rate: ${occupancyRate}%, Active Contracts: ${activeContracts}. LED Rented Slots: ${rentedLedSlots}/${totalLedSlots}. Top Client: ${topClientsData[0]?.name || 'None'}.`;
      const result = await analyzeBusinessData(context);
      setAiInsight(result);
      setLoadingAi(false);
  };

  const getClientName = (id: string) => clients.find(c => c.id === id)?.companyName || 'Unknown';

  return (
    <div className="space-y-8 animate-fade-in pb-12 flex flex-col lg:flex-row gap-8">
      {/* Main Content Area */}
      <div className="flex-1 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 mb-2">Executive Dashboard</h2>
              <p className="text-slate-500 font-medium">Real-time business metrics & strategic performance</p>
            </div>
            <button 
              onClick={handleAskAI}
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg hover:shadow-indigo-500/30 transition-all hover:scale-105"
            >
                <Sparkles size={16} /> {loadingAi ? 'Analyzing Data...' : 'AI Strategic Insights'}
            </button>
        </div>

        {aiInsight && (
            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-indigo-100 p-8 rounded-2xl animate-fade-in shadow-inner">
                <h3 className="text-indigo-900 font-bold mb-4 flex items-center gap-2 text-lg"><Sparkles size={20}/> Strategic Advice</h3>
                <div className="text-indigo-800 text-sm whitespace-pre-line leading-relaxed font-medium">{aiInsight}</div>
            </div>
        )}
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                <TrendingUp size={12}/> +12%
              </span>
            </div>
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Total Revenue</p>
                <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">${totalRevenue.toLocaleString()}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-full">Active</span>
            </div>
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Active Contracts</p>
                <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">{activeContracts}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition-colors">
                <Activity className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                Inventory
              </span>
            </div>
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Occupancy Rate</p>
                <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">{occupancyRate}%</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                <TrendingUp size={12}/> +2
              </span>
            </div>
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Total Clients</p>
                <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">{clients.length}</h3>
            </div>
          </div>
        </div>

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Financial Trends</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4'}}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#0f172a" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                  <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" name="Expenses" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue by Location</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueByTownData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px' }}/>
                            <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
             </div>
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Inventory Occupancy</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                        data={occupancyData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                        >
                        {occupancyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                        <Legend iconType="circle" layout="vertical" verticalAlign="bottom" wrapperStyle={{fontSize: '12px', color: '#64748b'}} />
                    </PieChart>
                    </ResponsiveContainer>
                </div>
             </div>
        </div>
      </div>

      {/* Sidebar / Notification Area */}
      <div className="w-full lg:w-80 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold uppercase tracking-wide text-xs">
                 <Bell size={16} className="text-slate-400" /> Recent Alerts
             </div>
             
             <div className="space-y-4">
                 {/* Upcoming Collections Widget */}
                 {upcomingBillings.length > 0 && (
                     <div className="mb-6 pb-6 border-b border-slate-50">
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar size={14} className="text-indigo-500" />
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Upcoming Collections</h4>
                        </div>
                        <div className="space-y-3">
                            {upcomingBillings.map((bill, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-indigo-50/50 rounded-xl border border-indigo-50">
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-slate-800 truncate">{bill.clientName}</p>
                                        <p className="text-[10px] text-slate-500">Due: {bill.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-indigo-700">${bill.amount.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>
                 )}

                 {/* Expiring Contracts */}
                 {expiringContracts.length > 0 ? (
                    expiringContracts.map(c => (
                        <div key={c.id} className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 hover:bg-amber-50 transition-colors">
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 bg-white rounded-lg text-amber-500 shadow-sm mt-0.5 border border-amber-100">
                                    <Clock size={14} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wide">Expiring Soon</h4>
                                    <p className="text-sm font-bold text-slate-800 mt-0.5">{getClientName(c.clientId)}</p>
                                    <p className="text-xs text-slate-500">Ends {c.endDate}</p>
                                </div>
                            </div>
                        </div>
                    ))
                 ) : (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center text-xs text-slate-400">
                        No contracts expiring soon.
                    </div>
                 )}

                 {/* Overdue Invoices */}
                 {overdueInvoices.length > 0 ? (
                    overdueInvoices.slice(0, 3).map(inv => (
                        <div key={inv.id} className="p-4 bg-red-50/50 rounded-xl border border-red-100 hover:bg-red-50 transition-colors">
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 bg-white rounded-lg text-red-500 shadow-sm mt-0.5 border border-red-100">
                                    <AlertTriangle size={14} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-red-800 uppercase tracking-wide">Pending Payment</h4>
                                    <p className="text-sm font-bold text-slate-800 mt-0.5">{getClientName(inv.clientId)}</p>
                                    <p className="text-xs text-slate-500">${inv.total.toLocaleString()} (Inv #{inv.id})</p>
                                </div>
                            </div>
                        </div>
                    ))
                 ) : (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center text-xs text-slate-400">
                        No pending invoices.
                    </div>
                 )}
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Top Revenue Sources</h3>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topClientsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis dataKey="name" type="category" width={90} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 600}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px' }} />
                    <Bar dataKey="value" fill="#0f172a" radius={[0, 4, 4, 0]} barSize={15}>
                        {topClientsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
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
